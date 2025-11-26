import { 
  type Service, type InsertService, 
  type Order, type InsertOrder,
  type User, type InsertUser,
  type LaunchRequest, type InsertLaunchRequest,
  type LaunchProgress, type InsertLaunchProgress,
  type Document, type InsertDocument,
  type AdminNote, type InsertAdminNote,
  type TeamMessage, type InsertTeamMessage,
  type Benefit, type InsertBenefit,
  type BenefitCode, type InsertBenefitCode,
  type BlogPost, type InsertBlogPost
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Services
  getAllServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  
  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  
  // Users
  getAllUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  getTeamUsers(): Promise<User[]>; // Get all simplificador and superadmin users
  
  // Launch Requests
  getAllLaunchRequests(): Promise<LaunchRequest[]>;
  getLaunchRequest(id: string): Promise<LaunchRequest | undefined>;
  getLaunchRequestByUserId(userId: string): Promise<LaunchRequest | undefined>;
  createLaunchRequest(request: InsertLaunchRequest): Promise<LaunchRequest>;
  updateLaunchRequest(id: string, request: Partial<InsertLaunchRequest>): Promise<LaunchRequest | undefined>;
  getLaunchRequestsByStatus(status: string): Promise<LaunchRequest[]>;
  getLaunchRequestsByAssignedTo(userId: string): Promise<LaunchRequest[]>; // Get requests assigned to user
  getUnassignedLaunchRequests(): Promise<LaunchRequest[]>; // Get unassigned requests
  
  // Launch Progress
  getLaunchProgress(launchRequestId: string): Promise<LaunchProgress | undefined>;
  createLaunchProgress(progress: InsertLaunchProgress): Promise<LaunchProgress>;
  updateLaunchProgress(id: string, progress: Partial<InsertLaunchProgress>): Promise<LaunchProgress | undefined>;
  
  // Documents
  getDocumentsByLaunchRequest(launchRequestId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: string): Promise<boolean>;
  
  // Admin Notes
  getNotesByLaunchRequest(launchRequestId: string): Promise<AdminNote[]>;
  createAdminNote(note: InsertAdminNote): Promise<AdminNote>;
  
  // Team Messages
  getMessagesByLaunchRequest(launchRequestId: string): Promise<TeamMessage[]>;
  createTeamMessage(message: InsertTeamMessage): Promise<TeamMessage>;
  updateTeamMessage(id: string, message: Partial<InsertTeamMessage>): Promise<TeamMessage | undefined>;
  
  // Benefits
  getAllBenefits(): Promise<Benefit[]>;
  getBenefit(id: string): Promise<Benefit | undefined>;
  createBenefit(benefit: InsertBenefit): Promise<Benefit>;
  
  // Benefit Codes
  getBenefitCodesByUser(userId: string): Promise<BenefitCode[]>;
  createBenefitCode(code: InsertBenefitCode): Promise<BenefitCode>;
  getBenefitCodeByCode(code: string): Promise<BenefitCode | undefined>;
  
  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private services: Map<string, Service>;
  private orders: Map<string, Order>;
  private users: Map<string, User>;
  private launchRequests: Map<string, LaunchRequest>;
  private launchProgress: Map<string, LaunchProgress>;
  private documents: Map<string, Document>;
  private adminNotes: Map<string, AdminNote>;
  private teamMessages: Map<string, TeamMessage>;
  private benefits: Map<string, Benefit>;
  private benefitCodes: Map<string, BenefitCode>;
  private blogPosts: Map<string, BlogPost>;

  constructor() {
    this.services = new Map();
    this.orders = new Map();
    this.users = new Map();
    this.launchRequests = new Map();
    this.launchProgress = new Map();
    this.documents = new Map();
    this.adminNotes = new Map();
    this.teamMessages = new Map();
    this.benefits = new Map();
    this.benefitCodes = new Map();
    this.blogPosts = new Map();
    this.initializeServices();
    this.initializeDefaultAdmin();
    this.initializeBenefits();
    this.initializeBlogPosts();
  }

  // Services methods
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.isActive === 1);
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: string, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const existing = this.services.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...serviceUpdate };
    this.services.set(id, updated);
    return updated;
  }

  // Orders methods
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.customerEmail === email);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      createdAt: new Date()
    } as Order;
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, orderUpdate: Partial<InsertOrder>): Promise<Order | undefined> {
    const existing = this.orders.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...orderUpdate } as Order;
    this.orders.set(id, updated);
    return updated;
  }

  // Users methods
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date()
    } as User;
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...userUpdate } as User;
    this.users.set(id, updated);
    return updated;
  }

  async getTeamUsers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => 
      user.role === 'simplificador' || user.role === 'superadmin'
    );
  }

  // Launch Requests methods
  async getAllLaunchRequests(): Promise<LaunchRequest[]> {
    return Array.from(this.launchRequests.values());
  }

  async getLaunchRequest(id: string): Promise<LaunchRequest | undefined> {
    return this.launchRequests.get(id);
  }

  async getLaunchRequestByUserId(userId: string): Promise<LaunchRequest | undefined> {
    return Array.from(this.launchRequests.values()).find(req => req.userId === userId);
  }

  async createLaunchRequest(insertRequest: InsertLaunchRequest): Promise<LaunchRequest> {
    const id = randomUUID();
    const request: LaunchRequest = {
      ...insertRequest,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    } as LaunchRequest;
    this.launchRequests.set(id, request);
    return request;
  }

  async updateLaunchRequest(id: string, requestUpdate: Partial<InsertLaunchRequest>): Promise<LaunchRequest | undefined> {
    const existing = this.launchRequests.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...requestUpdate,
      updatedAt: new Date()
    } as LaunchRequest;
    this.launchRequests.set(id, updated);
    
    // Create sample message when isStarted changes to true if no messages exist
    if (requestUpdate.isStarted === true && !existing.isStarted) {
      const existingMessages = await this.getMessagesByLaunchRequest(id);
      if (existingMessages.length === 0) {
        await this.createTeamMessage({
          launchRequestId: id,
          message: `Hola ${updated.fullName || 'estimado cliente'},\n\nNos complace informarte que tu solicitud de constitución de empresa está en proceso. Te convocamos a una reunión virtual para la firma de documentos:\n\n📅 Fecha: Jueves, 20 de octubre de 2025\n🕐 Hora: 10:00 AM (hora de Ecuador)\n📍 Plataforma: Zoom (enlace será enviado 24h antes)\n\nEn esta reunión:\n✓ Firmarás digitalmente el acto constitutivo\n✓ Revisaremos los documentos finales\n✓ Resolveremos cualquier duda que tengas\n\nPor favor, confirma tu asistencia respondiendo a este mensaje.\n\nSaludos cordiales,\nEquipo Lo Simple`,
          senderRole: 'admin',
          senderName: 'Equipo Lo Simple',
          isResolved: false
        });
      }
    }
    
    return updated;
  }

  async getLaunchRequestsByStatus(status: string): Promise<LaunchRequest[]> {
    return Array.from(this.launchRequests.values()).filter(req => req.adminStatus === status);
  }

  async getLaunchRequestsByAssignedTo(userId: string): Promise<LaunchRequest[]> {
    return Array.from(this.launchRequests.values()).filter(req => req.assignedTo === userId);
  }

  async getUnassignedLaunchRequests(): Promise<LaunchRequest[]> {
    return Array.from(this.launchRequests.values()).filter(req => !req.assignedTo);
  }

  // Launch Progress methods
  async getLaunchProgress(launchRequestId: string): Promise<LaunchProgress | undefined> {
    return Array.from(this.launchProgress.values()).find(p => p.launchRequestId === launchRequestId);
  }

  async createLaunchProgress(insertProgress: InsertLaunchProgress): Promise<LaunchProgress> {
    const id = randomUUID();
    const progress: LaunchProgress = {
      ...insertProgress,
      id,
      updatedAt: new Date()
    } as LaunchProgress;
    this.launchProgress.set(id, progress);
    return progress;
  }

  async updateLaunchProgress(id: string, progressUpdate: Partial<InsertLaunchProgress>): Promise<LaunchProgress | undefined> {
    const existing = this.launchProgress.get(id);
    if (!existing) return undefined;
    
    const updated = {
      ...existing,
      ...progressUpdate,
      updatedAt: new Date()
    } as LaunchProgress;
    this.launchProgress.set(id, updated);
    return updated;
  }

  // Documents methods
  async getDocumentsByLaunchRequest(launchRequestId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.launchRequestId === launchRequestId);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      uploadedAt: new Date()
    } as Document;
    this.documents.set(id, document);
    return document;
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Admin Notes methods
  async getNotesByLaunchRequest(launchRequestId: string): Promise<AdminNote[]> {
    return Array.from(this.adminNotes.values()).filter(note => note.launchRequestId === launchRequestId);
  }

  async createAdminNote(insertNote: InsertAdminNote): Promise<AdminNote> {
    const id = randomUUID();
    const note: AdminNote = {
      ...insertNote,
      id,
      createdAt: new Date()
    } as AdminNote;
    this.adminNotes.set(id, note);
    return note;
  }

  // Team Messages methods
  async getMessagesByLaunchRequest(launchRequestId: string): Promise<TeamMessage[]> {
    return Array.from(this.teamMessages.values())
      .filter(msg => msg.launchRequestId === launchRequestId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTeamMessage(insertMessage: InsertTeamMessage): Promise<TeamMessage> {
    const id = randomUUID();
    const message: TeamMessage = {
      ...insertMessage,
      id,
      createdAt: new Date()
    } as TeamMessage;
    this.teamMessages.set(id, message);
    return message;
  }

  async updateTeamMessage(id: string, messageUpdate: Partial<InsertTeamMessage>): Promise<TeamMessage | undefined> {
    const existing = this.teamMessages.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...messageUpdate } as TeamMessage;
    this.teamMessages.set(id, updated);
    return updated;
  }

  // Initialize with sample services based on sasecuador.com
  private initializeServices() {
    const sampleServices: Service[] = [
      {
        id: "sas-1-shareholder",
        name: "SAS con 1 accionista",
        description: "Constituye tu Sociedad por Acciones Simplificada de manera individual. Ideal para emprendedores que quieren formalizar su negocio de forma simple y económica.",
        shortDescription: "Constitución SAS individual - Perfect para emprendedores solos",
        price: "179.00",
        category: "SAS",
        features: [
          "Análisis de documentación a utilizar y solución de problemas en documentación",
          "Gestión de Reserva de Nombre",
          "Selección adecuada de Actividades Económicas para la SAS",
          "Contrato o Acto de Constitución inscrito",
          "Nombramientos inscritos",
          "RUC Habilitado",
          "Carpeta de documentos para abrir cuenta bancaria",
          "Títulos Acción",
          "Libro de Acciones y Accionistas",
          "Guía escrita de trámites posteriores",
          "Asistencia con costo adicional en obtención de firma electrónica TIPO ARCHIVO(sólo si no la tienes)",
          "Introducción a Ejecutiva de Cuenta Bancaria para iniciar la apertura de su cuenta desde la comodidad de tu hogar u oficina",
          "Información semanal, luego de constituida la empresa, por 40 semanas, vía correo electrónico sobre actividades recomendadas para el fortalecimiento de su empresa",
          "Participación en nuestra exclusiva comunidad de Whatsapp"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "sas-2-3-shareholders",
        name: "SAS con 2 o 3 accionistas",
        description: "Constituye tu SAS con 2 o 3 socios. Perfect para sociedades pequeñas que buscan formalizar su emprendimiento con múltiples participantes.",
        shortDescription: "Constitución SAS para sociedades de 2-3 personas",
        price: "299.00",
        category: "SAS",
        features: [
          "Análisis de documentación a utilizar y solución de problemas en documentación",
          "Gestión de Reserva de Nombre",
          "Selección adecuada de Actividades Económicas para la SAS",
          "Contrato o Acto de Constitución inscrito",
          "Nombramientos inscritos",
          "RUC Habilitado",
          "Carpeta de documentos para abrir cuenta bancaria",
          "Títulos Acción",
          "Libro de Acciones y Accionistas",
          "Guía escrita de trámites posteriores",
          "Asistencia con costo adicional en obtención de firma electrónica TIPO ARCHIVO(sólo si no la tienes)",
          "Introducción a Ejecutiva de Cuenta Bancaria para iniciar la apertura de su cuenta desde la comodidad de tu hogar u oficina",
          "Información semanal, luego de constituida la empresa, por 40 semanas, vía correo electrónico sobre actividades recomendadas para el fortalecimiento de su empresa",
          "Participación en nuestra exclusiva comunidad de Whatsapp"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "sas-4-7-shareholders",
        name: "SAS con 4 o 7 accionistas",
        description: "Constituye tu SAS con 4 a 7 socios. Ideal para equipos más grandes que quieren estructurar formalmente su empresa con múltiples participantes.",
        shortDescription: "Constitución SAS para equipos de 4-7 personas",
        price: "399.00",
        category: "SAS",
        features: [
          "Análisis de documentación a utilizar y solución de problemas en documentación",
          "Gestión de Reserva de Nombre",
          "Selección adecuada de Actividades Económicas para la SAS",
          "Contrato o Acto de Constitución inscrito",
          "Nombramientos inscritos",
          "RUC Habilitado",
          "Carpeta de documentos para abrir cuenta bancaria",
          "Títulos Acción",
          "Libro de Acciones y Accionistas",
          "Guía escrita de trámites posteriores",
          "Asistencia con costo adicional en obtención de firma electrónica TIPO ARCHIVO(sólo si no la tienes)",
          "Introducción a Ejecutiva de Cuenta Bancaria para iniciar la apertura de su cuenta desde la comodidad de tu hogar u oficina",
          "Información semanal, luego de constituida la empresa, por 40 semanas, vía correo electrónico sobre actividades recomendadas para el fortalecimiento de su empresa",
          "Participación en nuestra exclusiva comunidad de Whatsapp"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "capital-increase",
        name: "Aumento de Capital",
        description: "Incrementa el capital social de tu empresa de manera legal y ordenada para respaldar el crecimiento del negocio.",
        shortDescription: "Incrementa el capital social de tu empresa",
        price: "380.00",
        category: "Servicios Corporativos",
        features: [
          "Análisis de estructura de capital actual",
          "Preparación de resoluciones societarias",
          "Gestión ante Superintendencia de Compañías",
          "Actualización de escrituras",
          "Nuevos certificados de aportación",
          "Actualización registral completa"
        ],
        isActive: 0,
        imageUrl: null
      },
      {
        id: "electronic-invoicing",
        name: "Facturación Electrónica",
        description: "Implementación completa de sistema de facturación electrónica para cumplir con las regulaciones del SRI.",
        shortDescription: "Sistema completo de facturación electrónica",
        price: "280.00",
        category: "Servicios Digitales",
        features: [
          "Configuración en el SRI",
          "Implementación de sistema de facturación",
          "Capacitación en uso del sistema",
          "Certificados digitales necesarios",
          "Soporte técnico inicial",
          "Pruebas y validaciones"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "digital-signature",
        name: "Firma Electrónica Empresarial",
        description: "Obtención y configuración de firma electrónica para tu empresa, válida legalmente para contratos y documentos oficiales.",
        shortDescription: "Firma digital legal para tu empresa",
        price: "150.00",
        category: "Servicios Digitales",
        features: [
          "Gestión ante autoridad certificadora",
          "Configuración en dispositivos",
          "Capacitación en uso seguro",
          "Renovación anual incluida",
          "Soporte técnico",
          "Validez legal garantizada"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "legal-consultation",
        name: "Consultoría Legal Empresarial",
        description: "Asesoría legal especializada en temas corporativos, contratos comerciales y cumplimiento regulatorio para tu empresa.",
        shortDescription: "Asesoría legal especializada para empresas",
        price: "200.00",
        category: "Servicios Legales",
        features: [
          "Consulta legal personalizada",
          "Revisión de contratos",
          "Asesoría regulatoria",
          "Análisis de riesgos legales",
          "Recomendaciones estratégicas",
          "Seguimiento de casos"
        ],
        isActive: 1,
        imageUrl: null
      },
      // FIRMAS ELECTRÓNICAS - Opciones de vigencia
      {
        id: "firma-30-dias",
        name: "Firma Electrónica - 30 días",
        description: "Firma electrónica con validez legal por 30 días, ideal para documentos de corta duración o pruebas del servicio.",
        shortDescription: "Firma electrónica válida 30 días - Prueba",
        price: "17.00",
        category: "Firmas Electrónicas",
        features: [
          "Validez legal 30 días",
          "Certificado digital incluido",
          "Compatible con todos los formatos PDF",
          "Soporte técnico básico",
          "Validación en línea disponible",
          "Cumple normativas ecuatorianas",
          "Instalación guiada"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "firma-1-ano",
        name: "Firma Electrónica - 1 año",
        description: "Firma electrónica con validez de 1 año, perfecta para uso empresarial regular con certificado robusto.",
        shortDescription: "Firma electrónica válida 1 año - Empresarial",
        price: "28.00",
        category: "Firmas Electrónicas",
        features: [
          "Validez legal 1 año completo",
          "Certificado digital robusto",
          "Soporte en múltiples dispositivos",
          "Soporte técnico prioritario",
          "Backup de certificado incluido",
          "Compatible con sistemas empresariales",
          "Capacitación personalizada"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "firma-2-anos",
        name: "Firma Electrónica - 2 años",
        description: "Firma electrónica con validez extendida de 2 años, ideal para empresas que requieren estabilidad a medio plazo.",
        shortDescription: "Firma electrónica válida 2 años - Estabilidad",
        price: "42.00",
        category: "Firmas Electrónicas",
        features: [
          "Validez legal 2 años completos",
          "Certificado de alta seguridad",
          "Gestión multi-dispositivo avanzada",
          "Soporte técnico 24/7",
          "Renovación automática opcional",
          "Integración con workflow empresarial",
          "Auditoría de firmas incluida"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "firma-3-anos",
        name: "Firma Electrónica - 3 años",
        description: "Firma electrónica con validez de 3 años, perfecta para contratos de largo plazo y documentos importantes.",
        shortDescription: "Firma electrónica válida 3 años - Largo plazo",
        price: "60.00",
        category: "Firmas Electrónicas",
        features: [
          "Validez legal 3 años completos",
          "Certificado premium de máxima seguridad",
          "Gestión centralizada de múltiples firmas",
          "Account manager dedicado",
          "Políticas de renovación flexibles",
          "Integración con sistemas legacy",
          "Consultoría en implementación"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "firma-4-anos",
        name: "Firma Electrónica - 4 años",
        description: "Firma electrónica con la máxima validez de 4 años, diseñada para grandes corporaciones y proyectos estratégicos.",
        shortDescription: "Firma electrónica válida 4 años - Corporativo",
        price: "75.00",
        category: "Firmas Electrónicas",
        features: [
          "Validez legal máxima de 4 años",
          "Certificado corporativo de élite",
          "Arquitectura empresarial escalable",
          "Soporte corporativo con SLA",
          "Gestión avanzada de políticas",
          "Integración con infraestructura IT",
          "Consultoría estratégica continua"
        ],
        isActive: 1,
        imageUrl: null
      },
      // SERVICIOS CORPORATIVOS - Ordenados del más comprado al menos comprado
      {
        id: "cesion-acciones",
        name: "Cesión de Acciones",
        description: "Traspaso legal de acciones entre socios con todos los trámites registrales y documentación oficial requerida.",
        shortDescription: "Traspaso legal de acciones - Documentación completa",
        price: "65.00",
        category: "Servicios Corporativos",
        features: [
          "Asesoría previa",
          "Revisión de requisitos",
          "Elaboración de documentación",
          "Presentación y seguimiento de trámite en Superintendencia de Compañías",
          "Entrega de Nómina de Accionistas Actualizada",
          "Entrega de Nuevos Títulos Acción",
          "Actualización de Libro de Acciones y Accionistas bajo requerimiento"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "renovacion-nombramiento",
        name: "Renovación - Cambio Nombramiento",
        description: "Renovación de nombramientos de representantes legales y administradores con inscripción registral.",
        shortDescription: "Renovación de nombramientos - Representantes legales",
        price: "85.00",
        category: "Servicios Corporativos",
        features: [
          "Asesoría previa",
          "Revisión de requisitos",
          "Elaboración de documentación",
          "Presentación y seguimiento de trámite en Superintendencia de Compañías",
          "Actualización del RUC en el caso de cambio de representante"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "aumento-actividad-economica",
        name: "Aumento/Retiro de Actividad Económica",
        description: "Ampliación del objeto social de tu empresa para incluir nuevas actividades económicas permitidas.",
        shortDescription: "Ampliación objeto social - Nuevas actividades",
        price: "170.00",
        category: "Servicios Corporativos",
        features: [
          "Asesoría previa",
          "Revisión de requisitos",
          "Elaboración de documentación",
          "Presentación y seguimiento de trámite en Superintendencia de Compañías",
          "Actualización de RUC"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "cambio-nombre",
        name: "Cambio de Denominación",
        description: "Modificación de la razón social de tu empresa con todos los trámites legales y actualización de documentos.",
        shortDescription: "Cambio de razón social - Trámites legales",
        price: "245.00",
        category: "Servicios Corporativos",
        features: [
          "Asesoría previa",
          "Revisión de requisitos",
          "Elaboración de documentación",
          "Presentación y seguimiento de trámite en Superintendencia de Compañías",
          "Actualización de RUC"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "registro-marca-corporativo",
        name: "Registro de Marca",
        description: "Protección legal de tu marca comercial con registro oficial ante el IEPI para uso exclusivo y comercialización.",
        shortDescription: "Registro oficial de marca - Protección legal",
        price: "350.00",
        category: "Servicios Corporativos",
        features: [
          "Búsqueda de antecedentes",
          "Solicitud de registro ante IEPI",
          "Seguimiento del proceso",
          "Certificado de registro",
          "Asesoría en clasificación",
          "Protección legal garantizada"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "aumento-capital",
        name: "Aumento de Capital",
        description: "Incremento del capital social de tu empresa con todos los procedimientos legales y registrales correspondientes.",
        shortDescription: "Aumento de capital social - Trámites completos",
        price: "350.00",
        category: "Servicios Corporativos",
        features: [
          "Junta general extraordinaria",
          "Reforma de estatutos sociales",
          "Inscripción en Registro Mercantil",
          "Actualización de documentos societarios",
          "Emisión de nuevas acciones",
          "Asesoría financiera y legal"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "liquidacion-abreviada-1",
        name: "Liquidación Abreviada un Accionista sin soporte contable",
        description: "Proceso de liquidación abreviada para empresas con un solo accionista, sin incluir soporte contable.",
        shortDescription: "Liquidación abreviada un accionista",
        price: "179.00",
        category: "Servicios Corporativos",
        features: [
          "Análisis de documentación societaria",
          "Resolución de junta de accionistas",
          "Elaboración de estado de liquidación",
          "Trámites en Registro Mercantil",
          "Cancelación de RUC",
          "Documentación final de cierre"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "liquidacion-abreviada-2-3",
        name: "Liquidación Abreviada dos o tres Accionistas sin soporte contable",
        description: "Proceso de liquidación abreviada para empresas con dos o tres accionistas, sin incluir soporte contable.",
        shortDescription: "Liquidación abreviada 2-3 accionistas",
        price: "299.00",
        category: "Servicios Corporativos",
        features: [
          "Análisis de documentación societaria",
          "Resolución de junta de accionistas",
          "Elaboración de estado de liquidación",
          "Trámites en Registro Mercantil",
          "Cancelación de RUC",
          "Documentación final de cierre"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "liquidacion-abreviada-4",
        name: "Liquidación Abreviada cuatro Accionistas sin soporte contable",
        description: "Proceso de liquidación abreviada para empresas con cuatro accionistas, sin incluir soporte contable.",
        shortDescription: "Liquidación abreviada 4 accionistas",
        price: "399.00",
        category: "Servicios Corporativos",
        features: [
          "Análisis de documentación societaria",
          "Resolución de junta de accionistas",
          "Elaboración de estado de liquidación",
          "Trámites en Registro Mercantil",
          "Cancelación de RUC",
          "Documentación final de cierre"
        ],
        isActive: 1,
        imageUrl: null
      },
      // DESARROLLO WEB - Movido a categoría "Otros" con precio $500
      {
        id: "desarrollo-web-otros",
        name: "Desarrollo Web Profesional",
        description: "Desarrollo de sitio web profesional personalizado con diseño responsivo y funcionalidades modernas para tu empresa.",
        shortDescription: "Sitio web profesional personalizado - Diseño moderno",
        price: "500.00",
        category: "Otros",
        features: [
          "Diseño web responsivo",
          "Hasta 5 páginas incluidas",
          "Formulario de contacto",
          "Optimización SEO básica",
          "Panel de administración",
          "Hosting por 1 año incluido",
          "Certificado SSL gratuito",
          "Soporte técnico 3 meses"
        ],
        isActive: 1,
        imageUrl: null
      }
    ];

    sampleServices.forEach(service => {
      this.services.set(service.id, service);
    });
  }

  // Initialize default superadmin user
  private initializeDefaultAdmin() {
    const adminId = randomUUID();
    const defaultAdmin: User = {
      id: adminId,
      email: 'joseantonio@losimple.co',
      password: '$2b$10$GoG9LyVBI2s74l9WnLp11uzbDsMFvlHzRRbCM5HzvvmjnPUrqJ2WO', // z0*3$9&ErC
      fullName: 'José Antonio',
      role: 'superadmin',
      createdAt: new Date(),
      resetToken: null,
      resetTokenExpiry: null
    };
    this.users.set(adminId, defaultAdmin);
  }

  // Benefits methods
  async getAllBenefits(): Promise<Benefit[]> {
    return Array.from(this.benefits.values()).filter(benefit => benefit.isActive);
  }

  async getBenefit(id: string): Promise<Benefit | undefined> {
    return this.benefits.get(id);
  }

  async createBenefit(insertBenefit: InsertBenefit): Promise<Benefit> {
    const id = randomUUID();
    const benefit: Benefit = {
      ...insertBenefit,
      id,
      createdAt: new Date()
    } as Benefit;
    this.benefits.set(id, benefit);
    return benefit;
  }

  // Benefit Codes methods
  async getBenefitCodesByUser(userId: string): Promise<BenefitCode[]> {
    return Array.from(this.benefitCodes.values())
      .filter(code => code.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createBenefitCode(insertCode: InsertBenefitCode): Promise<BenefitCode> {
    const id = randomUUID();
    const code: BenefitCode = {
      ...insertCode,
      id,
      createdAt: new Date()
    } as BenefitCode;
    this.benefitCodes.set(id, code);
    return code;
  }

  async getBenefitCodeByCode(code: string): Promise<BenefitCode | undefined> {
    return Array.from(this.benefitCodes.values()).find(bc => bc.code === code);
  }

  // Blog Post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isPublished)
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isPublished && post.category === category)
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    } as BlogPost;
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, postUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;
    
    const updated = {
      ...existing,
      ...postUpdate,
      updatedAt: new Date()
    } as BlogPost;
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Initialize benefits
  private initializeBenefits() {
    const defaultBenefits: Benefit[] = [
      {
        id: randomUUID(),
        name: 'Descuento ToSellMore',
        description: 'Obtén un descuento especial en servicios de ToSellMore',
        partnerName: 'ToSellMore',
        partnerEmail: 'beneficios@tosellmore.com',
        iconName: 'Percent',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: 'Horas de Coworking Impaqto',
        description: 'Disfruta horas gratis de coworking en Impaqto',
        partnerName: 'Impaqto',
        partnerEmail: 'hola@impaqto.com',
        iconName: 'Building2',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: 'Créditos para uso de Sassi',
        description: 'Recibe créditos para usar la plataforma Sassi',
        partnerName: 'Sassi',
        partnerEmail: 'info@sassi.com',
        iconName: 'Coins',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: 'Descuento en Asesoría Legal',
        description: 'Descuento especial en servicios de asesoría legal',
        partnerName: 'Asesoría Legal',
        partnerEmail: 'contacto@asesorialegal.com',
        iconName: 'Scale',
        isActive: true,
        createdAt: new Date()
      }
    ];

    defaultBenefits.forEach(benefit => {
      this.benefits.set(benefit.id, benefit);
    });
  }

  // Initialize blog posts with sample articles
  private initializeBlogPosts() {
    const samplePosts: BlogPost[] = [
      {
        id: randomUUID(),
        title: "¿Qué es una SAS y por qué es la mejor opción para emprendedores en Ecuador?",
        slug: "que-es-sas-ecuador-emprendedores",
        excerpt: "Descubre las ventajas de constituir una Sociedad por Acciones Simplificada (SAS) en Ecuador: proceso rápido, bajo costo y flexibilidad total para tu negocio.",
        content: `<h2>¿Qué es una SAS?</h2>
<p>La Sociedad por Acciones Simplificada (SAS) es un tipo de empresa creada en Ecuador mediante la Ley Orgánica de Emprendimiento e Innovación (LOEI) del año 2020. Esta figura jurídica fue diseñada específicamente para facilitar la formalización de emprendimientos.</p>

<h2>Ventajas de constituir una SAS</h2>
<ul>
<li><strong>Constitución 100% digital:</strong> Todo el proceso se realiza en línea, sin necesidad de notaría.</li>
<li><strong>Capital mínimo de $1:</strong> No necesitas un capital elevado para iniciar.</li>
<li><strong>Un solo accionista:</strong> Puedes ser el único dueño de tu empresa.</li>
<li><strong>Proceso rápido:</strong> En Lo Simple lo hacemos en 5 días.</li>
<li><strong>Responsabilidad limitada:</strong> Tu patrimonio personal está protegido.</li>
</ul>

<h2>¿Para quién es ideal una SAS?</h2>
<p>La SAS es perfecta para freelancers, consultores, emprendedores digitales, startups y cualquier persona que quiera formalizar su actividad económica de manera simple y económica.</p>

<h2>Requisitos para constituir una SAS</h2>
<ol>
<li>Cédula de identidad vigente</li>
<li>Papeleta de votación</li>
<li>Firma electrónica (te ayudamos a obtenerla)</li>
<li>Definir el nombre de tu empresa</li>
<li>Determinar las actividades económicas</li>
</ol>

<p>En Lo Simple te acompañamos en todo el proceso. <strong>Constituye tu SAS en solo 5 días</strong> con nuestro equipo de expertos.</p>`,
        category: "SAS",
        imageUrl: null,
        metaTitle: "¿Qué es una SAS en Ecuador? Guía Completa 2025 | Lo Simple",
        metaDescription: "Aprende qué es una SAS (Sociedad por Acciones Simplificada) en Ecuador, sus ventajas, requisitos y cómo constituirla en solo 5 días. Guía actualizada 2025.",
        author: "Lo Simple",
        isPublished: true,
        publishedAt: new Date("2025-11-01"),
        createdAt: new Date("2025-11-01"),
        updatedAt: new Date("2025-11-01")
      },
      {
        id: randomUUID(),
        title: "Facturación Electrónica en Ecuador: Todo lo que necesitas saber en 2025",
        slug: "facturacion-electronica-ecuador-2025",
        excerpt: "Guía completa sobre facturación electrónica en Ecuador: obligaciones, beneficios, cómo implementarla y evitar multas del SRI.",
        content: `<h2>¿Qué es la facturación electrónica?</h2>
<p>La facturación electrónica es un sistema digital autorizado por el Servicio de Rentas Internas (SRI) que permite emitir comprobantes de venta con validez legal de forma digital.</p>

<h2>¿Quiénes están obligados a facturar electrónicamente?</h2>
<p>Desde 2022, todas las empresas y personas naturales obligadas a llevar contabilidad deben emitir comprobantes electrónicos. Esto incluye:</p>
<ul>
<li>Sociedades (SAS, Compañías Limitadas, S.A.)</li>
<li>Personas naturales con ingresos mayores a $300,000 anuales</li>
<li>Contribuyentes especiales</li>
</ul>

<h2>Beneficios de la facturación electrónica</h2>
<ul>
<li><strong>Ahorro de costos:</strong> No más impresiones ni papel.</li>
<li><strong>Mayor control:</strong> Registro automático de todas las transacciones.</li>
<li><strong>Cumplimiento tributario:</strong> Evita multas y sanciones del SRI.</li>
<li><strong>Profesionalismo:</strong> Proyecta una imagen moderna de tu negocio.</li>
</ul>

<h2>¿Cómo implementar la facturación electrónica?</h2>
<ol>
<li>Obtener firma electrónica</li>
<li>Registrarse en el SRI como emisor electrónico</li>
<li>Contratar un sistema de facturación autorizado</li>
<li>Realizar pruebas en ambiente de producción</li>
<li>Iniciar la emisión de comprobantes</li>
</ol>

<p>En Lo Simple te ayudamos con todo el proceso. Visita <strong>facturacion.losimple.ai</strong> para conocer nuestro sistema de facturación electrónica.</p>`,
        category: "Facturación",
        imageUrl: null,
        metaTitle: "Facturación Electrónica Ecuador 2025: Guía Completa SRI | Lo Simple",
        metaDescription: "Todo sobre facturación electrónica en Ecuador 2025: obligaciones SRI, cómo implementarla, beneficios y evitar multas. Guía paso a paso.",
        author: "Lo Simple",
        isPublished: true,
        publishedAt: new Date("2025-10-15"),
        createdAt: new Date("2025-10-15"),
        updatedAt: new Date("2025-10-15")
      },
      {
        id: randomUUID(),
        title: "Firma Electrónica en Ecuador: Cómo obtenerla y para qué sirve",
        slug: "firma-electronica-ecuador-como-obtenerla",
        excerpt: "Aprende qué es la firma electrónica, cómo obtenerla en Ecuador, sus usos legales y por qué es indispensable para tu empresa.",
        content: `<h2>¿Qué es una firma electrónica?</h2>
<p>La firma electrónica es un mecanismo digital que permite validar la identidad de una persona y garantizar la autenticidad e integridad de un documento electrónico. En Ecuador, tiene la misma validez legal que una firma manuscrita.</p>

<h2>¿Para qué necesitas una firma electrónica?</h2>
<ul>
<li><strong>Constituir una SAS:</strong> Es requisito obligatorio para firmar el acto constitutivo.</li>
<li><strong>Facturación electrónica:</strong> Necesaria para firmar comprobantes electrónicos.</li>
<li><strong>Trámites en el SRI:</strong> Presentar declaraciones y realizar gestiones.</li>
<li><strong>Contratos digitales:</strong> Firmar acuerdos con validez legal.</li>
<li><strong>Trámites bancarios:</strong> Algunas instituciones la requieren.</li>
</ul>

<h2>Tipos de firma electrónica</h2>
<p>En Ecuador existen dos tipos principales:</p>
<ul>
<li><strong>Firma tipo archivo:</strong> Se almacena en tu computadora. Más económica y práctica.</li>
<li><strong>Firma tipo token:</strong> Se almacena en un dispositivo USB físico. Mayor seguridad.</li>
</ul>

<h2>¿Cómo obtener tu firma electrónica?</h2>
<ol>
<li>Elegir una entidad certificadora autorizada</li>
<li>Completar la solicitud en línea</li>
<li>Realizar el pago correspondiente</li>
<li>Verificar tu identidad (puede ser presencial o virtual)</li>
<li>Descargar e instalar tu certificado</li>
</ol>

<p>En <strong>ecuadorfirmasimple.com</strong> puedes obtener tu firma electrónica de forma rápida y sencilla con el proceso más ágil del mercado.</p>`,
        category: "Firma Electrónica",
        imageUrl: null,
        metaTitle: "Firma Electrónica Ecuador: Cómo Obtenerla Paso a Paso | Lo Simple",
        metaDescription: "Guía completa para obtener tu firma electrónica en Ecuador. Requisitos, tipos, costos y proceso paso a paso. Obtén la tuya hoy.",
        author: "Lo Simple",
        isPublished: true,
        publishedAt: new Date("2025-10-01"),
        createdAt: new Date("2025-10-01"),
        updatedAt: new Date("2025-10-01")
      },
      {
        id: randomUUID(),
        title: "Reforma de Estatutos SAS: Cuándo y cómo hacerla correctamente",
        slug: "reforma-estatutos-sas-ecuador",
        excerpt: "¿Necesitas agregar o quitar actividades de tu SAS? Aprende cuándo es necesario reformar los estatutos y cómo hacerlo de forma legal.",
        content: `<h2>¿Qué es una reforma de estatutos?</h2>
<p>La reforma de estatutos es un proceso legal que permite modificar las características de tu empresa SAS, como sus actividades económicas, nombre, capital social, o estructura administrativa.</p>

<h2>¿Cuándo necesitas reformar los estatutos?</h2>
<ul>
<li><strong>Agregar actividades económicas:</strong> Si tu negocio se expande a nuevas áreas.</li>
<li><strong>Eliminar actividades:</strong> Si dejas de realizar ciertas operaciones.</li>
<li><strong>Cambiar el nombre:</strong> Actualizar la denominación de tu empresa.</li>
<li><strong>Modificar el capital:</strong> Aumentar o reducir el capital social.</li>
<li><strong>Cambiar la administración:</strong> Modificar quién puede representar la empresa.</li>
</ul>

<h2>Proceso de reforma de estatutos</h2>
<ol>
<li>Realizar una junta de accionistas y aprobar las modificaciones</li>
<li>Elaborar el acta de reforma correspondiente</li>
<li>Inscribir la reforma en la Superintendencia de Compañías</li>
<li>Actualizar el RUC en el SRI si corresponde</li>
<li>Obtener los nuevos documentos actualizados</li>
</ol>

<h2>Documentos necesarios</h2>
<ul>
<li>Estatutos actuales de la empresa</li>
<li>Acta de junta de accionistas</li>
<li>Firma electrónica del representante legal</li>
<li>Copia del RUC vigente</li>
</ul>

<p>En Lo Simple te ayudamos con todo el proceso de reforma de estatutos de manera ágil y profesional.</p>`,
        category: "Legal",
        imageUrl: null,
        metaTitle: "Reforma de Estatutos SAS Ecuador: Guía Completa | Lo Simple",
        metaDescription: "Aprende cuándo y cómo reformar los estatutos de tu SAS en Ecuador. Proceso, requisitos y documentos necesarios. Asesoría profesional.",
        author: "Lo Simple",
        isPublished: true,
        publishedAt: new Date("2025-09-15"),
        createdAt: new Date("2025-09-15"),
        updatedAt: new Date("2025-09-15")
      },
      {
        id: randomUUID(),
        title: "5 errores comunes al constituir una empresa en Ecuador y cómo evitarlos",
        slug: "errores-comunes-constituir-empresa-ecuador",
        excerpt: "Evita los errores más frecuentes que cometen los emprendedores al crear su empresa. Consejos prácticos para una constitución exitosa.",
        content: `<h2>Error #1: No verificar la disponibilidad del nombre</h2>
<p>Muchos emprendedores eligen un nombre sin verificar si está disponible en la Superintendencia de Compañías. Esto puede retrasar el proceso semanas.</p>
<p><strong>Solución:</strong> Siempre consulta la disponibilidad del nombre antes de iniciar cualquier trámite. En Lo Simple hacemos esto por ti.</p>

<h2>Error #2: Elegir actividades económicas incorrectas</h2>
<p>Seleccionar actividades que no corresponden con tu negocio puede generar problemas tributarios y limitaciones operativas.</p>
<p><strong>Solución:</strong> Asesórate con expertos para elegir las actividades correctas según tu modelo de negocio.</p>

<h2>Error #3: No obtener la firma electrónica a tiempo</h2>
<p>La firma electrónica es requisito obligatorio y obtenerla puede tomar días. Dejarlo para último momento retrasa todo.</p>
<p><strong>Solución:</strong> Inicia el proceso de firma electrónica al mismo tiempo que comienzas la constitución.</p>

<h2>Error #4: Documentos personales vencidos o con errores</h2>
<p>Cédulas vencidas, papeletas de votación incorrectas o direcciones desactualizadas son problemas frecuentes.</p>
<p><strong>Solución:</strong> Revisa que todos tus documentos estén vigentes y actualizados antes de empezar.</p>

<h2>Error #5: No planificar la estructura societaria</h2>
<p>Definir incorrectamente la distribución de acciones o la administración puede generar conflictos futuros.</p>
<p><strong>Solución:</strong> Define claramente los porcentajes de participación y quién tendrá la representación legal.</p>

<p>En Lo Simple te guiamos paso a paso para evitar todos estos errores y constituir tu empresa correctamente.</p>`,
        category: "SAS",
        imageUrl: null,
        metaTitle: "5 Errores al Constituir Empresa en Ecuador: Cómo Evitarlos | Lo Simple",
        metaDescription: "Descubre los 5 errores más comunes al crear una empresa en Ecuador y cómo evitarlos. Consejos de expertos para emprendedores.",
        author: "Lo Simple",
        isPublished: true,
        publishedAt: new Date("2025-09-01"),
        createdAt: new Date("2025-09-01"),
        updatedAt: new Date("2025-09-01")
      },
      {
        id: randomUUID(),
        title: "Cesión de Acciones en una SAS: Guía paso a paso",
        slug: "cesion-acciones-sas-ecuador",
        excerpt: "¿Necesitas vender o transferir acciones de tu SAS? Conoce el proceso legal, los documentos necesarios y cómo hacerlo correctamente.",
        content: `<h2>¿Qué es una cesión de acciones?</h2>
<p>La cesión de acciones es el proceso legal mediante el cual un accionista transfiere total o parcialmente su participación en una SAS a otra persona, ya sea un accionista existente o un tercero.</p>

<h2>¿Cuándo se realiza una cesión de acciones?</h2>
<ul>
<li><strong>Venta de participación:</strong> Un socio desea vender su parte del negocio.</li>
<li><strong>Ingreso de nuevos socios:</strong> Se incorporan inversionistas o partners.</li>
<li><strong>Herencia:</strong> Transferencia por fallecimiento de un accionista.</li>
<li><strong>Donación:</strong> Transferencia gratuita entre familiares.</li>
<li><strong>Reorganización societaria:</strong> Reestructuración de la empresa.</li>
</ul>

<h2>Proceso de cesión de acciones</h2>
<ol>
<li>Verificar el estatuto social (posibles restricciones o derechos de preferencia)</li>
<li>Negociar términos entre cedente y cesionario</li>
<li>Elaborar el contrato de cesión de acciones</li>
<li>Realizar junta de accionistas para aprobar la cesión</li>
<li>Inscribir en el Libro de Acciones y Accionistas</li>
<li>Notificar a la Superintendencia de Compañías</li>
<li>Actualizar información ante el SRI si corresponde</li>
</ol>

<h2>Documentos necesarios</h2>
<ul>
<li>Contrato de cesión firmado electrónicamente</li>
<li>Acta de junta de accionistas</li>
<li>Identificación del cedente y cesionario</li>
<li>Libro de Acciones y Accionistas actualizado</li>
</ul>

<p>En Lo Simple te acompañamos en todo el proceso de cesión de acciones con asesoría legal completa.</p>`,
        category: "Legal",
        imageUrl: null,
        metaTitle: "Cesión de Acciones SAS Ecuador: Guía Paso a Paso | Lo Simple",
        metaDescription: "Cómo transferir acciones de una SAS en Ecuador. Proceso legal, documentos y requisitos para cesión de acciones. Asesoría especializada.",
        author: "Lo Simple",
        isPublished: true,
        publishedAt: new Date("2025-08-15"),
        createdAt: new Date("2025-08-15"),
        updatedAt: new Date("2025-08-15")
      }
    ];

    samplePosts.forEach(post => {
      this.blogPosts.set(post.id, post);
    });
  }
}

export const storage = new MemStorage();
