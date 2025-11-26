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

// Middleware to check if user is admin (legacy, now checks for team roles)
function isAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const userRole = (req.user as any)?.role;
  if (req.isAuthenticated() && (userRole === 'superadmin' || userRole === 'simplificador')) {
    return next();
  }
  res.status(403).json({ error: 'Acceso no autorizado' });
}

// Middleware to check if user is superadmin
function isSuperadmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated() && (req.user as any).role === 'superadmin') {
    return next();
  }
  res.status(403).json({ error: 'Solo superadmin puede realizar esta acción' });
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
  
  // POST /auth/admin-login - Admin team login
  api.post("/auth/admin-login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      // Check if user is part of the team
      if (user.role !== 'superadmin' && user.role !== 'simplificador') {
        return res.status(403).json({ error: 'Acceso solo para equipo Lo Simple' });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      });
    } catch (error) {
      console.error('Error admin login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
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
  
  // POST /auth/forgot-password - Request password reset
  api.post("/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email es requerido' });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Por seguridad, no revelamos si el email existe
        return res.json({ message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña' });
      }
      
      // Generate reset token (6 digit code)
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
      const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      
      await storage.updateUser(user.id, {
        resetToken,
        resetTokenExpiry
      });
      
      // TODO: Send email with token
      // Por ahora solo lo mostramos en consola para desarrollo
      console.log('='.repeat(50));
      console.log('CÓDIGO DE RECUPERACIÓN DE CONTRASEÑA');
      console.log('='.repeat(50));
      console.log(`Email: ${email}`);
      console.log(`Código: ${resetToken}`);
      console.log(`Expira en: 15 minutos`);
      console.log('='.repeat(50));
      
      res.json({ 
        message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña',
        // En desarrollo, devolvemos el token
        ...(process.env.NODE_ENV === 'development' && { resetToken })
      });
    } catch (error) {
      console.error('Error forgot password:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /auth/reset-password - Reset password with token
  api.post("/auth/reset-password", async (req, res) => {
    try {
      const { email, token, newPassword } = req.body;
      
      if (!email || !token || !newPassword) {
        return res.status(400).json({ error: 'Email, token y nueva contraseña son requeridos' });
      }
      
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user || !user.resetToken || !user.resetTokenExpiry) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }
      
      // Verify token
      if (user.resetToken !== token) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }
      
      // Check expiry
      if (new Date() > new Date(user.resetTokenExpiry)) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password and clear reset token
      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      });
      
      res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      console.error('Error reset password:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
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
      
      // Create progress tracking with initial steps
      await storage.createLaunchProgress({
        launchRequestId: request.id,
        logoCurrentStep: 'Revisión inicial de brief',
        logoNextStep: 'Desarrollo de conceptos creativos',
        websiteCurrentStep: 'Análisis de requerimientos',
        websiteNextStep: 'Diseño de wireframes',
        socialMediaCurrentStep: 'Configuración de perfiles',
        socialMediaNextStep: 'Estrategia de contenido',
        companyCurrentStep: 'Revisión de documentación',
        companyNextStep: 'Preparación de estatutos',
        invoicingCurrentStep: 'Registro en SRI',
        invoicingNextStep: 'Configuración del sistema',
        signatureCurrentStep: 'Solicitud de certificado',
        signatureNextStep: 'Instalación y activación'
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
      const userId = (req.user as any).id;
      const userRole = (req.user as any).role;
      let requests;
      
      if (userRole === 'superadmin') {
        // Superadmin sees all requests
        if (status) {
          requests = await storage.getLaunchRequestsByStatus(status);
        } else {
          requests = await storage.getAllLaunchRequests();
        }
      } else {
        // Simplificador sees only assigned requests
        requests = await storage.getLaunchRequestsByAssignedTo(userId);
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
  
  // GET /launch/messages - Get messages for user's launch request
  api.get("/launch/messages", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const request = await storage.getLaunchRequestByUserId(userId);
      
      if (!request) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      
      const messages = await storage.getMessagesByLaunchRequest(request.id);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // GET /admin/requests/:id/messages - Get messages for a launch request (admin only)
  api.get("/admin/requests/:id/messages", isAdmin, async (req, res) => {
    try {
      const messages = await storage.getMessagesByLaunchRequest(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /admin/messages - Create team message (admin only)
  api.post("/admin/messages", isAdmin, async (req, res) => {
    try {
      const { launchRequestId, message } = req.body;
      const senderName = (req.user as any).fullName || 'Equipo Lo Simple';
      
      const teamMessage = await storage.createTeamMessage({
        launchRequestId,
        message,
        senderRole: 'admin',
        senderName,
        isResolved: false
      });
      
      res.status(201).json(teamMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // PATCH /messages/:id/respond - Respond to a message (client only)
  api.patch("/messages/:id/respond", isAuthenticated, async (req, res) => {
    try {
      const { response } = req.body;
      
      const updated = await storage.updateTeamMessage(req.params.id, {
        clientResponse: response
      });
      
      if (!updated) {
        return res.status(404).json({ error: 'Mensaje no encontrado' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error responding to message:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // PATCH /messages/:id/resolve - Toggle resolved status
  api.patch("/messages/:id/resolve", isAuthenticated, async (req, res) => {
    try {
      const { isResolved } = req.body;
      
      const updated = await storage.updateTeamMessage(req.params.id, {
        isResolved
      });
      
      if (!updated) {
        return res.status(404).json({ error: 'Mensaje no encontrado' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating message:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // ============ TEAM MANAGEMENT ROUTES ============
  
  // GET /admin/team - Get all team users (superadmin only)
  api.get("/admin/team", isSuperadmin, async (req, res) => {
    try {
      const teamUsers = await storage.getTeamUsers();
      // Return users without passwords
      const usersWithoutPasswords = teamUsers.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error('Error fetching team users:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /admin/team - Create new team user (superadmin only)
  api.post("/admin/team", isSuperadmin, async (req, res) => {
    try {
      const { email, password, fullName, role } = req.body;
      
      if (!email || !password || !fullName || !role) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }
      
      if (role !== 'simplificador' && role !== 'superadmin') {
        return res.status(400).json({ error: 'Rol inválido' });
      }
      
      // Check if email already exists
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
        role
      });
      
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating team user:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // PATCH /admin/requests/:id/assign - Assign/Take request
  api.patch("/admin/requests/:id/assign", isAdmin, async (req, res) => {
    try {
      const requestId = req.params.id;
      const { assignedTo } = req.body; // Can be userId or null
      const userId = (req.user as any).id;
      const userRole = (req.user as any).role;
      
      // Simplificadores can only take unassigned requests for themselves
      if (userRole === 'simplificador') {
        if (assignedTo && assignedTo !== userId) {
          return res.status(403).json({ error: 'Solo puedes tomar solicitudes para ti mismo' });
        }
        // Simplificador is "taking" the request
        const updated = await storage.updateLaunchRequest(requestId, { assignedTo: userId });
        return res.json(updated);
      }
      
      // Superadmin can assign to anyone or unassign
      const updated = await storage.updateLaunchRequest(requestId, { assignedTo });
      res.json(updated);
    } catch (error) {
      console.error('Error assigning request:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // GET /admin/unassigned - Get unassigned requests (for simplificadores to take)
  api.get("/admin/unassigned", isAdmin, async (req, res) => {
    try {
      const requests = await storage.getUnassignedLaunchRequests();
      res.json(requests);
    } catch (error) {
      console.error('Error fetching unassigned requests:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /launch/payment-intent - Create payment intent for Launch
  api.post("/launch/payment-intent", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      // Plan Launch fijo: $599 + IVA
      const baseAmount = 599;
      const tax = baseAmount * 0.15; // 15% IVA
      const totalAmount = baseAmount + tax;
      
      // Get launch request
      const request = await storage.getLaunchRequestByUserId(userId);
      if (!request) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      
      if (!request.isFormComplete) {
        return res.status(400).json({ error: 'Debes completar el formulario primero' });
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
          plan: 'launch',
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

  // POST /launch/test-complete-payment - Complete payment without Stripe (TEST ONLY)
  api.post("/launch/test-complete-payment", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      // Get launch request
      const request = await storage.getLaunchRequestByUserId(userId);
      if (!request) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      
      if (!request.isFormComplete) {
        return res.status(400).json({ error: 'Debes completar el formulario primero' });
      }
      
      // Mark as paid (TEST MODE)
      const baseAmount = 599;
      const tax = baseAmount * 0.15;
      const totalAmount = baseAmount + tax;
      
      await storage.updateLaunchRequest(request.id, {
        paymentStatus: 'completed',
        paidAmount: totalAmount.toFixed(2),
        stripePaymentIntentId: 'test_' + Date.now()
      });
      
      res.json({ 
        message: 'Pago de prueba completado exitosamente',
        totalAmount: totalAmount.toFixed(2)
      });
    } catch (error) {
      console.error('Error completing test payment:', error);
      res.status(500).json({ error: 'Error completando pago de prueba' });
    }
  });

  // ============ BENEFITS ROUTES ============
  
  // GET /benefits - Get all active benefits
  api.get("/benefits", isAuthenticated, async (req, res) => {
    try {
      const benefits = await storage.getAllBenefits();
      res.json(benefits);
    } catch (error) {
      console.error('Error fetching benefits:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /benefits/generate-code - Generate benefit code
  api.post("/benefits/generate-code", isAuthenticated, async (req, res) => {
    try {
      const { benefitId } = req.body;
      const userId = (req.user as any).id;
      
      if (!benefitId) {
        return res.status(400).json({ error: 'benefitId es requerido' });
      }
      
      // Get benefit
      const benefit = await storage.getBenefit(benefitId);
      if (!benefit) {
        return res.status(404).json({ error: 'Beneficio no encontrado' });
      }
      
      // Check if user has paid (has completed launch request)
      const launchRequest = await storage.getLaunchRequestByUserId(userId);
      if (!launchRequest || launchRequest.paymentStatus !== 'completed') {
        return res.status(403).json({ error: 'Debes completar el pago para acceder a beneficios' });
      }
      
      // Generate unique code: LoSimple + 5 random digits
      let code = '';
      let codeExists = true;
      
      while (codeExists) {
        const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5 digits between 10000-99999
        code = `LoSimple${randomDigits}`;
        const existing = await storage.getBenefitCodeByCode(code);
        codeExists = !!existing;
      }
      
      // Create benefit code
      const benefitCode = await storage.createBenefitCode({
        benefitId: benefit.id,
        userId,
        code,
        companyName: launchRequest.companyName1 || 'Empresa',
        isUsed: false,
        emailSent: false
      });
      
      // TODO: Send email to partner
      // For now, log to console (will be replaced with email integration)
      console.log('='.repeat(50));
      console.log('NUEVO CÓDIGO DE BENEFICIO GENERADO');
      console.log('='.repeat(50));
      console.log(`Beneficio: ${benefit.name}`);
      console.log(`Aliado: ${benefit.partnerName}`);
      console.log(`Email: ${benefit.partnerEmail}`);
      console.log(`Cliente: ${launchRequest.companyName1}`);
      console.log(`Código: ${code}`);
      console.log('='.repeat(50));
      console.log(`Asunto: ${benefit.partnerName} nuevo código de descuento`);
      console.log(`Contenido: Para tu información el Cliente ${launchRequest.companyName1} ha generado un código de descuento con el código ${code}, seguramente se acercará a tu punto de contacto.`);
      console.log('='.repeat(50));
      
      res.json({ 
        code: benefitCode.code,
        benefit: benefit.name
      });
    } catch (error) {
      console.error('Error generating benefit code:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // GET /benefits/my-codes - Get user's generated codes
  api.get("/benefits/my-codes", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const codes = await storage.getBenefitCodesByUser(userId);
      
      // Enrich with benefit info
      const enrichedCodes = await Promise.all(
        codes.map(async (code) => {
          const benefit = await storage.getBenefit(code.benefitId);
          return {
            ...code,
            benefitName: benefit?.name,
            benefitPartner: benefit?.partnerName
          };
        })
      );
      
      res.json(enrichedCodes);
    } catch (error) {
      console.error('Error fetching benefit codes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // ============ BLOG ROUTES ============
  
  // GET /blog/posts - Get all published blog posts (public)
  api.get("/blog/posts", async (req, res) => {
    try {
      const { category } = req.query;
      
      let posts;
      if (category && typeof category === 'string') {
        posts = await storage.getBlogPostsByCategory(category);
      } else {
        posts = await storage.getPublishedBlogPosts();
      }
      
      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // GET /blog/posts/:slug - Get a blog post by slug (public)
  api.get("/blog/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      
      if (!post) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
      }
      
      // Only return published posts for public access
      if (!post.isPublished) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // GET /blog/categories - Get unique categories from published posts
  api.get("/blog/categories", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      const categorySet = new Set(posts.map(post => post.category));
      const categories = Array.from(categorySet);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // ============ BLOG ADMIN ROUTES ============
  
  // GET /blog/admin/posts - Get all blog posts (admin only)
  api.get("/blog/admin/posts", isAdmin, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching all blog posts:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // GET /blog/admin/posts/:id - Get a blog post by ID (admin only)
  api.get("/blog/admin/posts/:id", isAdmin, async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      
      if (!post) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /blog/admin/posts - Create a new blog post (admin only)
  api.post("/blog/admin/posts", isAdmin, async (req, res) => {
    try {
      const { title, slug, excerpt, content, category, imageUrl, metaTitle, metaDescription, author, isPublished } = req.body;
      
      if (!title || !slug || !excerpt || !content || !category) {
        return res.status(400).json({ error: 'Título, slug, extracto, contenido y categoría son requeridos' });
      }
      
      // Check if slug already exists
      const existingPost = await storage.getBlogPostBySlug(slug);
      if (existingPost) {
        return res.status(400).json({ error: 'Ya existe un artículo con ese slug' });
      }
      
      const post = await storage.createBlogPost({
        title,
        slug,
        excerpt,
        content,
        category,
        imageUrl: imageUrl || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        author: author || 'Lo Simple',
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null
      });
      
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // PATCH /blog/admin/posts/:id - Update a blog post (admin only)
  api.patch("/blog/admin/posts/:id", isAdmin, async (req, res) => {
    try {
      const existingPost = await storage.getBlogPost(req.params.id);
      
      if (!existingPost) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
      }
      
      const { title, slug, excerpt, content, category, imageUrl, metaTitle, metaDescription, author, isPublished } = req.body;
      
      // Check if new slug conflicts with another post
      if (slug && slug !== existingPost.slug) {
        const conflictingPost = await storage.getBlogPostBySlug(slug);
        if (conflictingPost && conflictingPost.id !== existingPost.id) {
          return res.status(400).json({ error: 'Ya existe un artículo con ese slug' });
        }
      }
      
      // Set publishedAt when publishing for the first time
      let publishedAt = existingPost.publishedAt;
      if (isPublished && !existingPost.isPublished && !existingPost.publishedAt) {
        publishedAt = new Date();
      }
      
      const updatedPost = await storage.updateBlogPost(req.params.id, {
        title: title !== undefined ? title : existingPost.title,
        slug: slug !== undefined ? slug : existingPost.slug,
        excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
        content: content !== undefined ? content : existingPost.content,
        category: category !== undefined ? category : existingPost.category,
        imageUrl: imageUrl !== undefined ? imageUrl : existingPost.imageUrl,
        metaTitle: metaTitle !== undefined ? metaTitle : existingPost.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : existingPost.metaDescription,
        author: author !== undefined ? author : existingPost.author,
        isPublished: isPublished !== undefined ? isPublished : existingPost.isPublished,
        publishedAt
      });
      
      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // DELETE /blog/admin/posts/:id - Delete a blog post (admin only)
  api.delete("/blog/admin/posts/:id", isAdmin, async (req, res) => {
    try {
      const existingPost = await storage.getBlogPost(req.params.id);
      
      if (!existingPost) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
      }
      
      await storage.deleteBlogPost(req.params.id);
      res.json({ message: 'Artículo eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
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
