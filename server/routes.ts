import express, { type Express, Router } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import sgMail from "@sendgrid/mail";
import { storage } from "./storage";
import { z } from "zod";
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

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
  // Serve robots.txt
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`# Robots.txt para losimple.ai
# Permitir a todos los motores de búsqueda rastrear el sitio

User-agent: *
Allow: /

# Bloquear rutas administrativas y privadas
Disallow: /admin-login
Disallow: /adminlaunch
Disallow: /admin-blog
Disallow: /admin-users
Disallow: /dashboard
Disallow: /launch-form
Disallow: /launch-payment
Disallow: /login
Disallow: /register

# Sitemap
Sitemap: https://losimple.ai/sitemap.xml
`);
  });

  // Serve dynamic sitemap.xml
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const blogPosts = await storage.getPublishedBlogPosts();
      const baseUrl = 'https://losimple.ai';
      const today = new Date().toISOString().split('T')[0];
      
      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/launch', priority: '0.9', changefreq: 'weekly' },
        { url: '/cotizar-creacion-sas', priority: '0.9', changefreq: 'weekly' },
        { url: '/documentos-sas', priority: '0.8', changefreq: 'weekly' },
        { url: '/multas-sas-ecuador', priority: '0.8', changefreq: 'weekly' },
        { url: '/cerrar-sas', priority: '0.8', changefreq: 'weekly' },
        { url: '/preparar-cierre-sas', priority: '0.7', changefreq: 'monthly' },
        { url: '/empezar-cierre', priority: '0.7', changefreq: 'monthly' },
        { url: '/como-emprender-en-ecuador-con-una-empresa-2026', priority: '0.8', changefreq: 'monthly' },
        { url: '/blog', priority: '0.7', changefreq: 'daily' },
        { url: '/beneficios', priority: '0.6', changefreq: 'monthly' },
        { url: '/saslegal-plus', priority: '0.6', changefreq: 'monthly' },
        { url: '/terminos-y-condiciones', priority: '0.3', changefreq: 'yearly' },
        { url: '/politica-privacidad-datos-lo-simple', priority: '0.3', changefreq: 'yearly' },
      ];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

      // Add static pages
      for (const page of staticPages) {
        xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
      }

      // Add blog posts
      for (const post of blogPosts) {
        const postDate = post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : today;
        xml += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      }

      xml += `</urlset>`;

      res.type('application/xml');
      res.send(xml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

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

  // GET /my-orders - Get user's order history
  api.get("/user/orders", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Get orders by userId first, then by email as fallback
      let orders = await storage.getOrdersByUserId(user.id);
      
      // Also include orders made with the same email (before registration)
      const emailOrders = await storage.getOrdersByEmail(user.email);
      
      // Merge and deduplicate orders
      const orderIds = new Set(orders.map(o => o.id));
      for (const order of emailOrders) {
        if (!orderIds.has(order.id)) {
          orders.push(order);
        }
      }
      
      // Sort by date descending (most recent first)
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
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
  
  // POST /auth/register-existing-sas - Register existing SAS company (skips payment, goes straight to dashboard)
  api.post("/auth/register-existing-sas", async (req, res) => {
    try {
      const { email, password, fullName, ruc, companyName } = req.body;
      
      if (!email || !password || !fullName || !ruc || !companyName) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }
      
      // Validate RUC format (13 digits)
      if (!/^\d{13}$/.test(ruc)) {
        return res.status(400).json({ error: 'El RUC debe tener 13 dígitos' });
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
      
      // Create a completed LaunchRequest for this existing SAS
      // Store RUC in billingIdNumber field (since it's the company tax ID)
      const launchRequest = await storage.createLaunchRequest({
        userId: user.id,
        companyName1: companyName,
        billingIdNumber: ruc, // Store RUC here
        adminStatus: 'completed', // Existing SAS - already completed
        paymentStatus: 'completed', // No payment required - mark as completed
        isFormComplete: true,
        currentStep: 8,
        isStarted: true
      });
      
      // Create launch progress with appropriate statuses for existing SAS
      await storage.createLaunchProgress({
        launchRequestId: launchRequest.id,
        logoStatus: 'completed',
        logoProgress: 100,
        logoCurrentStep: 'No aplica - empresa existente',
        websiteStatus: 'completed',
        websiteProgress: 100,
        websiteCurrentStep: 'No aplica - empresa existente',
        socialMediaStatus: 'completed',
        socialMediaProgress: 100,
        socialMediaCurrentStep: 'No aplica - empresa existente',
        companyStatus: 'completed',
        companyProgress: 100,
        companyCurrentStep: 'Empresa ya constituida',
        invoicingStatus: 'pending',
        invoicingProgress: 0,
        invoicingCurrentStep: 'Disponible para activar',
        signatureStatus: 'pending',
        signatureProgress: 0,
        signatureCurrentStep: 'Disponible para activar'
      });
      
      console.log(`Existing SAS registered: ${companyName} (RUC: ${ruc}) by ${email}`);
      
      // Log the user in automatically
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword, launchRequestId: launchRequest.id });
      });
    } catch (error) {
      console.error('Error registering existing SAS:', error);
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
  
  // POST /contact/launch - Contact form for Launch page
  api.post("/contact/launch", async (req, res) => {
    try {
      const { firstName, lastName, businessDescription, phone, email } = req.body;
      
      if (!firstName || !lastName || !businessDescription || !phone || !email) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }
      
      // Log the contact request
      console.log('='.repeat(50));
      console.log('NUEVA SOLICITUD DE CONTACTO - LAUNCH');
      console.log('='.repeat(50));
      console.log(`Nombre: ${firstName} ${lastName}`);
      console.log(`Email: ${email}`);
      console.log(`Teléfono: ${phone}`);
      console.log(`Negocio: ${businessDescription}`);
      console.log('='.repeat(50));
      
      // Store the contact in database
      await storage.createContactRequest({
        firstName,
        lastName,
        businessDescription,
        phone,
        email,
        source: 'launch_page',
        createdAt: new Date()
      });
      
      // Send email notification via SendGrid
      if (process.env.SENDGRID_API_KEY) {
        const msg = {
          to: 'joseantoniosanchez0701@gmail.com',
          from: 'hola@losimple.ai',
          subject: `Nueva solicitud de Launch - ${firstName} ${lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #6C5CE7;">Nueva Solicitud de Contacto - Launch</h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Teléfono:</strong> ${phone}</p>
                <p><strong>Descripción del negocio:</strong></p>
                <p style="background-color: white; padding: 15px; border-radius: 4px;">${businessDescription}</p>
              </div>
              <p style="color: #666; font-size: 12px;">Este mensaje fue enviado desde el formulario de contacto de Launch en losimple.ai</p>
            </div>
          `
        };
        
        try {
          await sgMail.send(msg);
          console.log('Email notification sent successfully');
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
        }
      }
      
      res.json({ message: 'Mensaje recibido correctamente' });
    } catch (error) {
      console.error('Error processing contact form:', error);
      res.status(500).json({ error: 'Error al procesar el formulario' });
    }
  });

  // POST /contact/preparar-cierre - Contact form for preparar cierre SAS page
  api.post("/contact/preparar-cierre", async (req, res) => {
    try {
      const { nombre, email, whatsapp, decision } = req.body;
      
      if (!nombre || !email || !whatsapp) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }
      
      const decisionText = decision === "decidido" 
        ? "Estoy decidido, quiero una cotización" 
        : "Aún estoy indeciso";
      
      // Log the contact request
      console.log('='.repeat(50));
      console.log('NUEVA SOLICITUD - PREPARAR CIERRE SAS');
      console.log('='.repeat(50));
      console.log(`Nombre: ${nombre}`);
      console.log(`Email: ${email}`);
      console.log(`WhatsApp: ${whatsapp}`);
      console.log(`Estado de decisión: ${decisionText}`);
      console.log('='.repeat(50));
      
      // Send email notification via SendGrid
      if (process.env.SENDGRID_API_KEY) {
        const msg = {
          to: 'joseantoniosanchez0701@gmail.com',
          from: 'hola@losimple.ai',
          subject: `Nueva solicitud de preparación de cierre SAS - ${nombre}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #DC2626;">Nueva Solicitud - Preparar Cierre de SAS</h2>
              <p style="color: #666;">Esta persona no cumple los requisitos del cierre abreviado y necesita asesoría.</p>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>WhatsApp:</strong> ${whatsapp}</p>
                <p><strong>Estado de decisión:</strong> ${decisionText}</p>
              </div>
              <p style="background-color: #FEF3C7; padding: 15px; border-radius: 4px; border-left: 4px solid #F59E0B;">
                <strong>Nota:</strong> Este cliente ha sido redirigido a WhatsApp automáticamente después de completar el formulario.
              </p>
              <p style="color: #666; font-size: 12px;">Este mensaje fue enviado desde la página de Preparar Cierre SAS en losimple.ai</p>
            </div>
          `
        };
        
        try {
          await sgMail.send(msg);
          console.log('Email notification sent successfully');
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
        }
      }
      
      res.json({ message: 'Mensaje recibido correctamente' });
    } catch (error) {
      console.error('Error processing preparar-cierre form:', error);
      res.status(500).json({ error: 'Error al procesar el formulario' });
    }
  });

  // POST /contact/cotizar-sas - Contact form for cotizar creación SAS page
  api.post("/contact/cotizar-sas", async (req, res) => {
    try {
      const { nombre, email, whatsapp, decision } = req.body;
      
      if (!nombre || !email || !whatsapp) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }
      
      const decisionText = decision === "decidido" 
        ? "Estoy decidido, quiero crear mi SAS" 
        : "Solo quiero información por ahora";
      
      console.log('='.repeat(50));
      console.log('NUEVA SOLICITUD - COTIZACIÓN CREACIÓN SAS');
      console.log('='.repeat(50));
      console.log(`Nombre: ${nombre}`);
      console.log(`Email: ${email}`);
      console.log(`WhatsApp: ${whatsapp}`);
      console.log(`Estado de decisión: ${decisionText}`);
      console.log('='.repeat(50));

      if (process.env.SENDGRID_API_KEY) {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
          to: 'hola@losimple.ai',
          from: 'hola@losimple.ai',
          subject: `Nueva solicitud de cotización SAS - ${nombre}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #16A34A;">Nueva Solicitud - Cotización Creación SAS</h2>
              <p style="color: #666;">Esta persona quiere información sobre crear su empresa SAS.</p>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>WhatsApp:</strong> ${whatsapp}</p>
                <p><strong>Estado de decisión:</strong> ${decisionText}</p>
              </div>
              <p style="background-color: #DCFCE7; padding: 15px; border-radius: 4px; border-left: 4px solid #16A34A;">
                <strong>Nota:</strong> Este cliente ha sido redirigido a WhatsApp automáticamente después de completar el formulario.
              </p>
              <p style="color: #666; font-size: 12px;">Este mensaje fue enviado desde la página de Cotizar Creación SAS en losimple.ai</p>
            </div>
          `
        };
        
        try {
          await sgMail.send(msg);
          console.log('Email notification sent successfully');
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
        }
      }
      
      res.json({ message: 'Mensaje recibido correctamente' });
    } catch (error) {
      console.error('Error processing cotizar-sas form:', error);
      res.status(500).json({ error: 'Error al procesar el formulario' });
    }
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
      
      // Send email with token using SendGrid
      if (process.env.SENDGRID_API_KEY) {
        const msg = {
          to: email,
          from: 'info@losimple.ai',
          subject: 'Código de recuperación de contraseña - Lo Simple',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #6C5CE7 0%, #00cec9 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Lo Simple</h1>
              </div>
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #333; margin-bottom: 20px;">Recuperación de contraseña</h2>
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                  Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
                </p>
                <div style="background: white; border: 2px dashed #6C5CE7; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0;">
                  <p style="color: #666; font-size: 14px; margin-bottom: 10px;">Tu código de recuperación es:</p>
                  <p style="font-size: 36px; font-weight: bold; color: #6C5CE7; letter-spacing: 8px; margin: 0;">${resetToken}</p>
                </div>
                <p style="color: #666; font-size: 14px;">
                  Este código expirará en <strong>15 minutos</strong>.
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                  Si no solicitaste este cambio, puedes ignorar este mensaje.
                </p>
              </div>
              <div style="background: #333; padding: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  © 2025 Lo Simple. Todos los derechos reservados.
                </p>
              </div>
            </div>
          `,
        };
        
        try {
          await sgMail.send(msg);
          console.log('Password reset email sent successfully to:', email);
        } catch (emailError) {
          console.error('Error sending password reset email:', emailError);
        }
      } else {
        console.log('='.repeat(50));
        console.log('CÓDIGO DE RECUPERACIÓN DE CONTRASEÑA');
        console.log('='.repeat(50));
        console.log(`Email: ${email}`);
        console.log(`Código: ${resetToken}`);
        console.log(`Expira en: 15 minutos`);
        console.log('='.repeat(50));
      }
      
      res.json({ 
        message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña',
        ...(process.env.NODE_ENV === 'development' && !process.env.SENDGRID_API_KEY && { resetToken })
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
      
      // Plan Launch fijo: $1499 (sin IVA adicional - precio final)
      const baseAmount = 1499;
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
      
      // Mark as paid (TEST MODE) - Plan Launch: $1499 + IVA
      const baseAmount = 1499;
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

  // ========== MULTAS REPORTS ENDPOINTS ==========
  
  // GET /multas/reports - Get user's multas reports
  api.get("/multas/reports", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const reports = await storage.getMultasReportsByUser(userId);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching multas reports:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // GET /multas/reports/:id - Get a specific report
  api.get("/multas/reports/:id", isAuthenticated, async (req, res) => {
    try {
      const report = await storage.getMultasReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Informe no encontrado' });
      }
      
      const userId = (req.user as any).id;
      if (report.userId !== userId) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      
      res.json(report);
    } catch (error) {
      console.error('Error fetching multas report:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /multas/reports - Create a new multas report request
  api.post("/multas/reports", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { companyName, ruc, credentials, saveCredentials } = req.body;
      
      // Create the report with initial validation status
      const report = await storage.createMultasReport({
        userId,
        companyName,
        ruc,
        status: 'processing',
        validationStatus: {
          supercias: 'pending',
          sri: 'pending',
          iess: 'pending',
          municipio: 'pending',
          sercop: 'pending',
          minTrabajo: 'pending'
        },
        isPaid: false
      });
      
      // If user wants to save credentials, store them (encrypted in production)
      if (saveCredentials && credentials) {
        for (const cred of credentials) {
          const existingCred = await storage.getCredentialByUserAndInstitution(userId, cred.institution);
          if (existingCred) {
            await storage.updateCredential(existingCred.id, {
              username: cred.username,
              passwordEncrypted: cred.password, // In production, encrypt this
              canton: cred.canton,
              isValidated: false
            });
          } else {
            await storage.createCredential({
              userId,
              institution: cred.institution,
              username: cred.username,
              passwordEncrypted: cred.password, // In production, encrypt this
              canton: cred.canton,
              isValidated: false
            });
          }
        }
      }
      
      // Simulate validation process (in production, this would be handled by a worker)
      simulateValidation(report.id);
      
      res.status(201).json(report);
    } catch (error) {
      console.error('Error creating multas report:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Helper function to simulate validation process
  async function simulateValidation(reportId: string) {
    const institutions = ['supercias', 'sri', 'iess', 'municipio', 'sercop', 'minTrabajo'] as const;
    
    for (let i = 0; i < institutions.length; i++) {
      const institution = institutions[i];
      
      // Wait 2-4 seconds between validations
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      const report = await storage.getMultasReport(reportId);
      if (!report) return;
      
      const currentStatus = report.validationStatus || {
        supercias: 'pending' as const,
        sri: 'pending' as const,
        iess: 'pending' as const,
        municipio: 'pending' as const,
        sercop: 'pending' as const,
        minTrabajo: 'pending' as const
      };
      
      const newStatus = {
        ...currentStatus,
        [institution]: 'validated' as const
      };
      
      await storage.updateMultasReport(reportId, {
        validationStatus: newStatus
      });
    }
    
    // After all validations, mark report as ready and add a mock PDF URL
    await storage.updateMultasReport(reportId, {
      status: 'ready',
      reportUrl: '/api/multas/reports/' + reportId + '/download'
    });
  }
  
  // POST /multas/reports/:id/create-checkout-session - Create Stripe checkout session for report
  api.post("/multas/reports/:id/create-checkout-session", isAuthenticated, async (req, res) => {
    try {
      const report = await storage.getMultasReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Informe no encontrado' });
      }
      
      const userId = (req.user as any).id;
      if (report.userId !== userId) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      
      if (report.isPaid) {
        return res.status(400).json({ error: 'Este informe ya fue pagado' });
      }
      
      // Price: $12 + IVA (12%) = $13.44
      const amount = Math.round(12 * 1.12 * 100); // in cents
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Informe de Multas SAS',
              description: `Informe completo de multas para ${report.companyName || 'su empresa'}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/dashboard?multas_payment=success&report_id=${report.id}`,
        cancel_url: `${req.headers.origin}/dashboard?multas_payment=cancelled`,
        metadata: {
          type: 'multas_report',
          reportId: report.id,
          userId
        }
      });
      
      await storage.updateMultasReport(report.id, {
        stripePaymentIntentId: session.id
      });
      
      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // POST /multas/reports/:id/test-payment - Test mode payment (for development)
  api.post("/multas/reports/:id/test-payment", isAuthenticated, async (req, res) => {
    try {
      const report = await storage.getMultasReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Informe no encontrado' });
      }
      
      const userId = (req.user as any).id;
      if (report.userId !== userId) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      
      if (report.isPaid) {
        return res.status(400).json({ error: 'Este informe ya fue pagado' });
      }
      
      // Mark as paid directly for testing
      await storage.updateMultasReport(report.id, {
        isPaid: true,
        status: 'paid',
        paidAt: new Date(),
        stripePaymentIntentId: 'test_payment_' + Date.now()
      });
      
      const updatedReport = await storage.getMultasReport(report.id);
      res.json(updatedReport);
    } catch (error) {
      console.error('Error processing test payment:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /multas/reports/:id/create-payment-intent - Create Stripe payment for report
  api.post("/multas/reports/:id/create-payment-intent", isAuthenticated, async (req, res) => {
    try {
      const report = await storage.getMultasReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Informe no encontrado' });
      }
      
      const userId = (req.user as any).id;
      if (report.userId !== userId) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      
      if (report.isPaid) {
        return res.status(400).json({ error: 'Este informe ya fue pagado' });
      }
      
      // Price: $12 + IVA (12%) = $13.44
      const amount = Math.round(12 * 1.12 * 100); // in cents
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        metadata: {
          type: 'multas_report',
          reportId: report.id,
          userId
        }
      });
      
      await storage.updateMultasReport(report.id, {
        stripePaymentIntentId: paymentIntent.id
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // POST /multas/reports/:id/confirm-payment - Confirm payment was successful
  api.post("/multas/reports/:id/confirm-payment", isAuthenticated, async (req, res) => {
    try {
      const report = await storage.getMultasReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Informe no encontrado' });
      }
      
      const userId = (req.user as any).id;
      if (report.userId !== userId) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      
      // Verify payment with Stripe
      if (report.stripePaymentIntentId) {
        const paymentIntent = await stripe.paymentIntents.retrieve(report.stripePaymentIntentId);
        if (paymentIntent.status === 'succeeded') {
          await storage.updateMultasReport(report.id, {
            isPaid: true,
            status: 'paid',
            paidAt: new Date()
          });
          
          const updatedReport = await storage.getMultasReport(report.id);
          return res.json(updatedReport);
        }
      }
      
      res.status(400).json({ error: 'Pago no confirmado' });
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // GET /multas/reports/:id/download - Download report (only if paid)
  api.get("/multas/reports/:id/download", isAuthenticated, async (req, res) => {
    try {
      const report = await storage.getMultasReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Informe no encontrado' });
      }
      
      const userId = (req.user as any).id;
      if (report.userId !== userId) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      
      if (!report.isPaid) {
        return res.status(402).json({ error: 'Debe pagar el informe antes de descargarlo' });
      }
      
      // Mark report as downloaded
      await storage.updateMultasReport(req.params.id, {
        status: 'downloaded'
      });
      
      // Generate a PDF-like document using simple text-based PDF structure
      const currentDate = new Date().toLocaleDateString('es-EC');
      const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj

4 0 obj
<< /Length 2000 >>
stream
BT
/F1 24 Tf
50 720 Td
(INFORME DE MULTAS Y OBLIGACIONES) Tj
0 -40 Td
/F1 12 Tf
(================================) Tj
0 -30 Td
(Empresa: ${report.companyName || 'N/A'}) Tj
0 -20 Td
(RUC: ${report.ruc || 'N/A'}) Tj
0 -20 Td
(Fecha de generacion: ${currentDate}) Tj
0 -40 Td
/F1 16 Tf
(RESUMEN DE CONSULTAS) Tj
0 -25 Td
/F1 12 Tf
(1. Superintendencia de Companias: Sin multas pendientes) Tj
0 -18 Td
(2. SRI \\(Servicio de Rentas Internas\\): Sin obligaciones vencidas) Tj
0 -18 Td
(3. IESS \\(Instituto Ecuatoriano de Seguridad Social\\): Al dia) Tj
0 -18 Td
(4. Municipio: Sin deudas municipales) Tj
0 -18 Td
(5. SERCOP: Sin inhabilitaciones) Tj
0 -18 Td
(6. Ministerio del Trabajo: Sin sanciones) Tj
0 -40 Td
/F1 16 Tf
(PROXIMAS OBLIGACIONES) Tj
0 -25 Td
/F1 12 Tf
(- Declaracion IVA: Vence en 15 dias) Tj
0 -18 Td
(- Declaracion Impuesto a la Renta: Vence en 45 dias) Tj
0 -18 Td
(- Aportes IESS: Al dia) Tj
0 -40 Td
/F1 16 Tf
(CONTENIDO DE EJEMPLO - LOREM IPSUM) Tj
0 -25 Td
/F1 10 Tf
(Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod) Tj
0 -15 Td
(tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim) Tj
0 -15 Td
(veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea) Tj
0 -15 Td
(commodo consequat. Duis aute irure dolor in reprehenderit in voluptate) Tj
0 -15 Td
(velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat) Tj
0 -15 Td
(cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id) Tj
0 -15 Td
(est laborum.) Tj
0 -40 Td
/F1 10 Tf
(---) Tj
0 -15 Td
(Este informe fue generado por Lo Simple - www.losimple.ec) Tj
ET
endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000002320 00000 n 

trailer
<< /Size 6 /Root 1 0 R >>
startxref
2399
%%EOF`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="informe-multas-${report.ruc || 'empresa'}.pdf"`);
      res.send(pdfContent);
    } catch (error) {
      console.error('Error downloading report:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // GET /multas/credentials - Get user's saved credentials (without passwords)
  api.get("/multas/credentials", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const credentials = await storage.getCredentialsByUser(userId);
      
      // Return credentials without the encrypted password
      const sanitizedCredentials = credentials.map(cred => ({
        id: cred.id,
        institution: cred.institution,
        username: cred.username,
        canton: cred.canton,
        isValidated: cred.isValidated
      }));
      
      res.json(sanitizedCredentials);
    } catch (error) {
      console.error('Error fetching credentials:', error);
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
