import express, { type Express, Router } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { z } from "zod";
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

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

// Configure Passport
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'Email o contraseña incorrectos' });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Email o contraseña incorrectos' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware to check if user is authenticated
function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'No autenticado' });
}

// Middleware to check if user is admin
function isAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated() && (req.user as any).role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Acceso no autorizado' });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  app.use(session({
    secret: process.env.SESSION_SECRET || 'lo-simple-launch-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
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

  // ============ AUTHENTICATION ROUTES ============
  
  // POST /auth/register - Register new user
  api.post("/auth/register", async (req, res) => {
    try {
      const { email, password, fullName } = req.body;
      
      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Email, contraseña y nombre completo son requeridos' });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        fullName,
        role: 'client'
      });
      
      // Log the user in automatically
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword });
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /auth/login - Login user
  api.post("/auth/login", (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || 'Credenciales inválidas' });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      });
    })(req, res, next);
  });
  
  // POST /auth/logout - Logout user
  api.post("/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al cerrar sesión' });
      }
      res.json({ message: 'Sesión cerrada exitosamente' });
    });
  });
  
  // GET /auth/session - Check current session
  api.get("/auth/session", (req, res) => {
    if (req.isAuthenticated()) {
      const { password: _, ...userWithoutPassword } = req.user as any;
      res.json({ user: userWithoutPassword });
    } else {
      res.status(401).json({ error: 'No autenticado' });
    }
  });
  
  // ============ LAUNCH REQUEST ROUTES ============
  
  // GET /launch/my-request - Get current user's launch request
  api.get("/launch/my-request", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const request = await storage.getLaunchRequestByUserId(userId);
      res.json(request || null);
    } catch (error) {
      console.error('Error fetching launch request:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /launch/request - Create or update launch request
  api.post("/launch/request", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const existingRequest = await storage.getLaunchRequestByUserId(userId);
      
      if (existingRequest) {
        // Update existing request
        const updated = await storage.updateLaunchRequest(existingRequest.id, req.body);
        res.json(updated);
      } else {
        // Create new request
        const request = await storage.createLaunchRequest({
          userId,
          ...req.body
        });
        res.status(201).json(request);
      }
    } catch (error) {
      console.error('Error saving launch request:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /launch/start - Start the launch process (requires payment)
  api.post("/launch/start", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const request = await storage.getLaunchRequestByUserId(userId);
      
      if (!request) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      
      if (request.paymentStatus !== 'completed') {
        return res.status(400).json({ error: 'Debes completar el pago primero' });
      }
      
      if (!request.isFormComplete) {
        return res.status(400).json({ error: 'Debes completar el formulario primero' });
      }
      
      // Mark as started and move to admin queue
      const updated = await storage.updateLaunchRequest(request.id, {
        isStarted: true,
        adminStatus: 'new'
      });
      
      // Create progress tracking
      await storage.createLaunchProgress({
        launchRequestId: request.id
      });
      
      res.json(updated);
    } catch (error) {
      console.error('Error starting launch:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // GET /launch/progress - Get launch progress
  api.get("/launch/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const request = await storage.getLaunchRequestByUserId(userId);
      
      if (!request) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      
      const progress = await storage.getLaunchProgress(request.id);
      res.json(progress || null);
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // ============ ADMIN ROUTES ============
  
  // GET /admin/requests - Get all launch requests (Kanban view)
  api.get("/admin/requests", isAdmin, async (req, res) => {
    try {
      const status = req.query.status as string;
      let requests;
      
      if (status) {
        requests = await storage.getLaunchRequestsByStatus(status);
      } else {
        requests = await storage.getAllLaunchRequests();
      }
      
      res.json(requests);
    } catch (error) {
      console.error('Error fetching admin requests:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // GET /admin/requests/:id - Get detailed launch request
  api.get("/admin/requests/:id", isAdmin, async (req, res) => {
    try {
      const request = await storage.getLaunchRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      
      const progress = await storage.getLaunchProgress(request.id);
      const documents = await storage.getDocumentsByLaunchRequest(request.id);
      const notes = await storage.getNotesByLaunchRequest(request.id);
      
      res.json({
        request,
        progress,
        documents,
        notes
      });
    } catch (error) {
      console.error('Error fetching request details:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // PATCH /admin/requests/:id - Update request status
  api.patch("/admin/requests/:id", isAdmin, async (req, res) => {
    try {
      const updated = await storage.updateLaunchRequest(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      res.json(updated);
    } catch (error) {
      console.error('Error updating request:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // PATCH /admin/progress/:requestId - Update launch progress
  api.patch("/admin/progress/:requestId", isAdmin, async (req, res) => {
    try {
      const progress = await storage.getLaunchProgress(req.params.requestId);
      if (!progress) {
        return res.status(404).json({ error: 'Progreso no encontrado' });
      }
      
      const updated = await storage.updateLaunchProgress(progress.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /admin/notes - Add admin note
  api.post("/admin/notes", isAdmin, async (req, res) => {
    try {
      const { launchRequestId, noteText } = req.body;
      const adminUserId = (req.user as any).id;
      
      const note = await storage.createAdminNote({
        launchRequestId,
        adminUserId,
        noteText
      });
      
      res.status(201).json(note);
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /launch/payment-intent - Create payment intent for Launch
  api.post("/launch/payment-intent", isAuthenticated, async (req, res) => {
    try {
      const { plan } = req.body; // "fundador" or "pro"
      const userId = (req.user as any).id;
      
      if (!plan || !['fundador', 'pro'].includes(plan)) {
        return res.status(400).json({ error: 'Plan inválido' });
      }
      
      const prices = {
        fundador: 599,
        pro: 699
      };
      
      const baseAmount = prices[plan as 'fundador' | 'pro'];
      const tax = baseAmount * 0.15; // 15% IVA
      const totalAmount = baseAmount + tax;
      
      // Get or create launch request
      let request = await storage.getLaunchRequestByUserId(userId);
      if (!request) {
        request = await storage.createLaunchRequest({
          userId,
          selectedPlan: plan
        });
      } else {
        // Update plan selection
        await storage.updateLaunchRequest(request.id, { selectedPlan: plan });
      }
      
      // Create PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          type: 'launch',
          userId,
          requestId: request.id,
          plan,
          baseAmount: baseAmount.toFixed(2),
          tax: tax.toFixed(2),
          totalAmount: totalAmount.toFixed(2)
        }
      });
      
      // Update request with payment intent
      await storage.updateLaunchRequest(request.id, {
        stripePaymentIntentId: paymentIntent.id,
        paidAmount: totalAmount.toFixed(2)
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        baseAmount: baseAmount.toFixed(2),
        tax: tax.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
      });
    } catch (error: any) {
      console.error('Error creating launch payment intent:', error);
      res.status(500).json({ error: 'Error creando intención de pago: ' + error.message });
    }
  });
  
  // POST /launch/confirm-payment - Confirm Launch payment
  api.post("/launch/confirm-payment", isAuthenticated, async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      const userId = (req.user as any).id;
      
      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ error: 'El pago no se ha completado' });
      }
      
      // Update request payment status
      const request = await storage.getLaunchRequestByUserId(userId);
      if (request) {
        await storage.updateLaunchRequest(request.id, {
          paymentStatus: 'completed',
          stripePaymentIntentId: paymentIntentId
        });
      }
      
      res.json({ message: 'Pago confirmado exitosamente' });
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({ error: 'Error confirmando pago' });
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
