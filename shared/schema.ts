import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Existing marketplace tables
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  features: text("features").array().notNull(),
  isActive: integer("is_active").notNull().default(1),
  imageUrl: text("image_url"),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // Optional: linked user account
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  services: json("services").notNull().$type<Array<{ serviceId: string; quantity: number; price: string }>>(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Launch system tables
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("client"), // client, simplificador, superadmin
  resetToken: text("reset_token"), // Token para recuperación de contraseña
  resetTokenExpiry: timestamp("reset_token_expiry"), // Expiración del token
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const launchRequests = pgTable("launch_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  assignedTo: varchar("assigned_to").references(() => users.id), // Usuario del equipo asignado
  
  // Step 2: Personal data
  fullName: text("full_name"),
  idNumber: text("id_number"),
  personalEmail: text("personal_email"),
  phone: text("phone"),
  address: text("address"),
  province: text("province"),
  canton: text("canton"),
  numberOfShareholders: integer("number_of_shareholders"), // Número total de accionistas
  
  // Step 3: Shareholders data (JSON array)
  shareholders: json("shareholders").$type<Array<{
    fullName: string;
    idNumber: string;
    participation: number;
    email: string;
    phone: string;
    idCardUrl?: string; // Cédula
    votingCardUrl?: string; // Papeleta de votación
  }>>(),
  
  // Step 4: Company data
  companyName1: text("company_name_1"),
  companyName2: text("company_name_2"),
  companyName3: text("company_name_3"),
  mainActivity: text("main_activity"),
  secondaryActivities: text("secondary_activities").array(),
  initialCapital: decimal("initial_capital", { precision: 10, scale: 2 }),
  shareDistribution: json("share_distribution").$type<Array<{ name: string; shares: number }>>(),
  fiscalAddress: text("fiscal_address"),
  fiscalCity: text("fiscal_city"),
  administratorType: text("administrator_type"), // "single" or "joint"
  hasExternalRep: boolean("has_external_rep"),
  externalRepName: text("external_rep_name"),
  externalRepId: text("external_rep_id"),
  externalRepEmail: text("external_rep_email"),
  externalRepPhone: text("external_rep_phone"),
  // Company documents  
  utilityBillUrl: text("utility_bill_url"), // Pago de servicio básico
  
  // Step 5: Visual identity
  brandName: text("brand_name"),
  slogan: text("slogan"),
  brandDescription: text("brand_description"),
  personalityWords: text("personality_words").array(),
  preferredColors: text("preferred_colors").array(),
  preferredStyles: text("preferred_styles").array(),
  preferredFonts: text("preferred_fonts"),
  visualReferences: text("visual_references").array(),
  
  // Step 6: Website
  websiteObjectives: text("website_objectives").array(),
  desiredDomain: text("desired_domain"),
  hasDomain: boolean("has_domain"),
  wantsDomainPurchase: boolean("wants_domain_purchase"),
  socialMedia: json("social_media").$type<{ facebook?: string; instagram?: string; linkedin?: string; twitter?: string }>(),
  corporateEmail: text("corporate_email"),
  physicalAddress: text("physical_address"),
  aboutUsText: text("about_us_text"),
  servicesText: text("services_text"),
  businessImages: text("business_images").array(),
  websiteReference1: text("website_reference_1"),
  websiteReference2: text("website_reference_2"),
  websiteReference3: text("website_reference_3"),
  
  // Payment info (Plan Launch fijo: $599 + IVA)
  paymentMethod: text("payment_method"), // "card", "transfer", or "payphone"
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }),
  
  // Step 7: Billing
  billingName: text("billing_name"),
  billingIdNumber: text("billing_id_number"),
  billingAddress: text("billing_address"),
  billingEmail: text("billing_email"),
  
  // Form completion tracking
  currentStep: integer("current_step").notNull().default(1),
  isFormComplete: boolean("is_form_complete").notNull().default(false),
  isStarted: boolean("is_started").notNull().default(false), // True when user clicks "Empezar"
  
  // Status for admin kanban
  adminStatus: text("admin_status").notNull().default("new"), // new, reviewing, in_progress, completed
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const launchProgress = pgTable("launch_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  launchRequestId: varchar("launch_request_id").notNull().references(() => launchRequests.id),
  
  // 6 deliverables tracking
  logoStatus: text("logo_status").notNull().default("pending"), // pending, in_progress, completed
  logoProgress: integer("logo_progress").notNull().default(0), // 0-100
  logoDeliveryUrl: text("logo_delivery_url"),
  logoCurrentStep: text("logo_current_step"),
  logoNextStep: text("logo_next_step"),
  
  websiteStatus: text("website_status").notNull().default("pending"),
  websiteProgress: integer("website_progress").notNull().default(0),
  websiteDeliveryUrl: text("website_delivery_url"),
  websiteCurrentStep: text("website_current_step"),
  websiteNextStep: text("website_next_step"),
  
  socialMediaStatus: text("social_media_status").notNull().default("pending"),
  socialMediaProgress: integer("social_media_progress").notNull().default(0),
  socialMediaDeliveryUrl: text("social_media_delivery_url"),
  socialMediaCurrentStep: text("social_media_current_step"),
  socialMediaNextStep: text("social_media_next_step"),
  
  companyStatus: text("company_status").notNull().default("pending"),
  companyProgress: integer("company_progress").notNull().default(0),
  companyDeliveryUrl: text("company_delivery_url"),
  companyCurrentStep: text("company_current_step"),
  companyNextStep: text("company_next_step"),
  
  invoicingStatus: text("invoicing_status").notNull().default("pending"),
  invoicingProgress: integer("invoicing_progress").notNull().default(0),
  invoicingDeliveryUrl: text("invoicing_delivery_url"),
  invoicingCurrentStep: text("invoicing_current_step"),
  invoicingNextStep: text("invoicing_next_step"),
  
  signatureStatus: text("signature_status").notNull().default("pending"),
  signatureProgress: integer("signature_progress").notNull().default(0),
  signatureDeliveryUrl: text("signature_delivery_url"),
  signatureCurrentStep: text("signature_current_step"),
  signatureNextStep: text("signature_next_step"),
  
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  launchRequestId: varchar("launch_request_id").notNull().references(() => launchRequests.id),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // "id_front", "id_back", "utility_bill", "visual_reference", etc.
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const adminNotes = pgTable("admin_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  launchRequestId: varchar("launch_request_id").notNull().references(() => launchRequests.id),
  adminUserId: varchar("admin_user_id").notNull().references(() => users.id),
  noteText: text("note_text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const teamMessages = pgTable("team_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  launchRequestId: varchar("launch_request_id").notNull().references(() => launchRequests.id),
  message: text("message").notNull(),
  senderRole: text("sender_role").notNull(), // "admin" or "client"
  senderName: text("sender_name").notNull(),
  clientResponse: text("client_response"),
  isResolved: boolean("is_resolved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const benefits = pgTable("benefits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  partnerName: text("partner_name").notNull(), // Nombre del aliado (ToSellMore, Impaqto, etc.)
  partnerEmail: text("partner_email").notNull(), // Email del aliado para notificaciones
  iconName: text("icon_name").notNull(), // Nombre del ícono de lucide-react
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const benefitCodes = pgTable("benefit_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  benefitId: varchar("benefit_id").notNull().references(() => benefits.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  code: text("code").notNull().unique(), // El código generado (ej: LoSimple12345)
  companyName: text("company_name"), // Nombre de la empresa del cliente
  isUsed: boolean("is_used").notNull().default(false),
  usedAt: timestamp("used_at"),
  emailSent: boolean("email_sent").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Blog system
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(), // Short description for cards
  content: text("content").notNull(), // Full article content (HTML/Markdown)
  category: text("category").notNull(), // SAS, Facturación, Firma Electrónica, Legal
  imageUrl: text("image_url"), // Featured image
  metaTitle: text("meta_title"), // SEO title (optional, falls back to title)
  metaDescription: text("meta_description"), // SEO description
  author: text("author").notNull().default("Lo Simple"),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Contact requests
export const contactRequests = pgTable("contact_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  businessDescription: text("business_description").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  source: text("source").notNull(), // "launch_page", "home", etc.
  isContacted: boolean("is_contacted").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schemas for existing marketplace
export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
}).required({
  isActive: true,
}).extend({
  imageUrl: z.string().nullable(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

// Schemas for Launch system
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLaunchRequestSchema = createInsertSchema(launchRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLaunchProgressSchema = createInsertSchema(launchProgress).omit({
  id: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertAdminNoteSchema = createInsertSchema(adminNotes).omit({
  id: true,
  createdAt: true,
});

export const insertTeamMessageSchema = createInsertSchema(teamMessages).omit({
  id: true,
  createdAt: true,
});

export const insertBenefitSchema = createInsertSchema(benefits).omit({
  id: true,
  createdAt: true,
});

export const insertBenefitCodeSchema = createInsertSchema(benefitCodes).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({
  id: true,
  createdAt: true,
});

// Types for existing marketplace
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Types for Launch system
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LaunchRequest = typeof launchRequests.$inferSelect;
export type InsertLaunchRequest = z.infer<typeof insertLaunchRequestSchema>;
export type LaunchProgress = typeof launchProgress.$inferSelect;
export type InsertLaunchProgress = z.infer<typeof insertLaunchProgressSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type AdminNote = typeof adminNotes.$inferSelect;
export type InsertAdminNote = z.infer<typeof insertAdminNoteSchema>;
export type TeamMessage = typeof teamMessages.$inferSelect;
export type InsertTeamMessage = z.infer<typeof insertTeamMessageSchema>;
export type Benefit = typeof benefits.$inferSelect;
export type InsertBenefit = z.infer<typeof insertBenefitSchema>;
export type BenefitCode = typeof benefitCodes.$inferSelect;
export type InsertBenefitCode = z.infer<typeof insertBenefitCodeSchema>;

// Types for Blog system
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Types for Contact system
export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
