import express, { type Express, Router } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { z } from "zod";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Validation schemas for API requests
const createOrderRequestSchema = z.object({
  customerName: z.string().min(1, "Nombre es requerido"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(10, "Teléfono debe tener al menos 10 dígitos"),
  items: z.array(z.object({
    serviceId: z.string().min(1, "ID del servicio es requerido"),
    quantity: z.number().min(1, "Cantidad debe ser al menos 1"),
  })).min(1, "Al menos un servicio es requerido"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create isolated API router
  const api = Router();
  
  // GET /services - Get all active services
  api.get("/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // GET /services/:id - Get a specific service
  api.get("/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Servicio no encontrado" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // POST /orders - Create a new order with server-side price calculation
  api.post("/orders", async (req, res) => {
    try {
      // Validate request body
      const validatedData = createOrderRequestSchema.parse(req.body);

      // Calculate order details server-side for security
      const orderServices = [];
      let totalAmount = 0;

      for (const item of validatedData.items) {
        const service = await storage.getService(item.serviceId);
        if (!service) {
          return res.status(400).json({ 
            error: `Servicio con ID ${item.serviceId} no encontrado` 
          });
        }

        const itemPrice = parseFloat(service.price);
        const lineTotal = itemPrice * item.quantity;
        
        orderServices.push({
          serviceId: item.serviceId,
          quantity: item.quantity,
          price: itemPrice.toFixed(2),
        });

        totalAmount += lineTotal;
      }

      // Create order with server-calculated values
      const orderData = {
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        services: orderServices,
        totalAmount: totalAmount.toFixed(2),
        status: "pending",
        stripePaymentIntentId: null,
      };

      const order = await storage.createOrder(orderData);
      res.status(201).json(order);

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Datos de pedido inválidos",
          details: error.errors 
        });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // GET /orders/:id - Get order details
  api.get("/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // PATCH /orders/:id - Restricted order updates (will be replaced by Stripe webhook)
  api.patch("/orders/:id", async (req, res) => {
    try {
      // Temporarily restrict to only allow limited status updates
      // TODO: Replace with proper Stripe webhook implementation in task 4
      const allowedStatuses = ["pending", "cancelled"];
      const { status } = req.body;
      
      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({ 
          error: "Solo se permiten estados: pending, cancelled" 
        });
      }

      const updateData = { status };
      const updatedOrder = await storage.updateOrder(req.params.id, updateData);
      if (!updatedOrder) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }

      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Secure Stripe payment intent endpoint - creates server-side order first
  api.post("/create-payment-intent", async (req, res) => {
    try {
      const { items, discountCode, customerName, customerEmail, customerPhone } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Items del carrito son requeridos" });
      }

      // Prepare order data for server-side creation
      const orderData = {
        customerName: customerName || "Stripe Customer",
        customerEmail: customerEmail || "customer@stripe.com", 
        customerPhone: customerPhone || "0000000000",
        items: items
      };

      // Use existing secure order creation endpoint
      let totalAmount = 0;
      const orderServices = [];

      // Calculate and validate items server-side (replicating order logic)
      for (const item of items) {
        if (!item.serviceId || !item.quantity || item.quantity < 1) {
          return res.status(400).json({ 
            error: "Items inválidos en el carrito" 
          });
        }

        const service = await storage.getService(item.serviceId);
        if (!service) {
          return res.status(400).json({ 
            error: `Servicio con ID ${item.serviceId} no encontrado` 
          });
        }

        const itemPrice = parseFloat(service.price);
        const lineTotal = itemPrice * item.quantity;
        
        orderServices.push({
          serviceId: item.serviceId,
          quantity: item.quantity,
          price: itemPrice.toFixed(2),
        });

        totalAmount += lineTotal;
      }

      if (totalAmount <= 0) {
        return res.status(400).json({ error: "Total inválido" });
      }

      // Apply advance payment discount (50% automatic)
      const subtotal = totalAmount;
      const advanceDiscount = subtotal * 0.5;
      let finalAmount = subtotal - advanceDiscount;

      // Apply additional discount code if provided
      let additionalDiscount = 0;
      if (discountCode === 'NEWSDESAS') {
        // 10% discount on the advance amount (50% of original total)
        additionalDiscount = advanceDiscount * 0.1;
        finalAmount -= additionalDiscount;
      }

      // Ensure minimum amount and round to cents
      finalAmount = Math.max(Math.round(finalAmount * 100) / 100, 0.50);

      // Create server-side order first for security and integrity
      const order = await storage.createOrder({
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        services: orderServices,
        totalAmount: finalAmount.toFixed(2), // Store the discounted amount that user actually pays
        status: "pending"
      });

      // Create PaymentIntent bound to the server order
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(finalAmount * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          marketplace: "Lo Simple",
          orderId: order.id,
          subtotal: subtotal.toFixed(2),
          advanceDiscount: advanceDiscount.toFixed(2),
          additionalDiscount: additionalDiscount.toFixed(2),
          finalAmount: finalAmount.toFixed(2),
          discountCode: discountCode || '',
          itemCount: items.length.toString()
        }
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        orderId: order.id,
        subtotal: subtotal.toFixed(2),
        discounts: [
          {
            id: 'advance-50',
            name: 'Descuento Anticipo 50%',
            amount: advanceDiscount.toFixed(2)
          },
          ...(additionalDiscount > 0 ? [{
            id: 'promo-newsdesas',
            name: 'Descuento NEWSDESAS 10%',
            amount: additionalDiscount.toFixed(2)
          }] : [])
        ],
        finalAmount: finalAmount.toFixed(2),
        items: orderServices
      });
    } catch (error: any) {
      console.error("Error creating payment intent with order:", error);
      res.status(500).json({ 
        error: "Error creando intención de pago: " + error.message 
      });
    }
  });

  // Create Stripe Checkout Session (primary method - bypasses CSP)
  api.post("/create-checkout-session", async (req, res) => {
    try {
      const { items, discountCode } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Items del carrito son requeridos" });
      }

      // Calculate line items server-side for security
      let subtotal = 0;
      const orderServices = [];

      // First pass: calculate subtotal
      for (const item of items) {
        if (!item.serviceId || !item.quantity || item.quantity < 1) {
          return res.status(400).json({ 
            error: "Items inválidos en el carrito" 
          });
        }

        const service = await storage.getService(item.serviceId);
        if (!service) {
          return res.status(400).json({ 
            error: `Servicio con ID ${item.serviceId} no encontrado` 
          });
        }

        const itemPrice = parseFloat(service.price);
        const lineTotal = itemPrice * item.quantity;
        
        orderServices.push({
          serviceId: item.serviceId,
          quantity: item.quantity,
          price: itemPrice.toFixed(2),
        });

        subtotal += lineTotal;
      }

      if (subtotal <= 0) {
        return res.status(400).json({ error: "Total inválido" });
      }

      // Apply advance payment discount (50% automatic)
      const advanceDiscount = subtotal * 0.5;
      let finalAmount = subtotal - advanceDiscount;

      // Apply additional discount code if provided
      let additionalDiscount = 0;
      if (discountCode === 'NEWSDESAS') {
        additionalDiscount = advanceDiscount * 0.1;
        finalAmount -= additionalDiscount;
      }

      // Ensure minimum amount and round to cents
      finalAmount = Math.max(Math.round(finalAmount * 100) / 100, 0.50);

      // Create single line item with the final discounted amount
      const lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Servicios Lo Simple (Anticipo 50%)',
            description: `${items.length} servicio(s) con descuento anticipo${additionalDiscount > 0 ? ' + código NEWSDESAS' : ''}`,
          },
          unit_amount: Math.round(finalAmount * 100) // cents
        },
        quantity: 1,
      }];

      // Create server-side order first for security
      const order = await storage.createOrder({
        customerName: "Stripe Checkout Customer",
        customerEmail: "customer@checkout.stripe.com", 
        customerPhone: "0000000000",
        services: orderServices,
        totalAmount: finalAmount.toFixed(2),
        status: "pending"
      });

      // Build robust URLs for redirects
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout`,
        metadata: {
          marketplace: "Lo Simple",
          orderId: order.id,
          subtotal: subtotal.toFixed(2),
          advanceDiscount: advanceDiscount.toFixed(2),
          additionalDiscount: additionalDiscount.toFixed(2),
          finalAmount: finalAmount.toFixed(2),
          discountCode: discountCode || '',
          itemCount: items.length.toString()
        },
      });
      
      res.json({
        sessionId: session.id,
        orderId: order.id,
        subtotal: subtotal.toFixed(2),
        finalAmount: finalAmount.toFixed(2)
      });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ 
        error: "Error creando sesión de pago: " + error.message 
      });
    }
  });

  // Terminal 404 handler for API routes
  api.use((_req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  // Mount the API router
  app.use("/api", api);

  const httpServer = createServer(app);

  return httpServer;
}
