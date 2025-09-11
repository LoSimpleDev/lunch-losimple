import express, { type Express, Router } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { z } from "zod";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

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

  // Stripe payment intent endpoint
  api.post("/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Cantidad inválida" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          marketplace: "Lo Simple"
        }
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        error: "Error creando intención de pago: " + error.message 
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
