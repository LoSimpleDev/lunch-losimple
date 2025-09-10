import { type Service, type InsertService, type Order, type InsertOrder } from "@shared/schema";
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
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private services: Map<string, Service>;
  private orders: Map<string, Order>;

  constructor() {
    this.services = new Map();
    this.orders = new Map();
    this.initializeServices();
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
          "Análisis de documentación y solución de problemas",
          "Gestión de reserva de nombre",
          "Selección adecuada de Actividades Económicas",
          "Contrato inscrito y SAS 100% legalizada",
          "RUC habilitado para facturar",
          "Documentos para cuenta bancaria",
          "Títulos de Acción y Libro de Accionistas",
          "Guía de trámites posteriores",
          "Asistencia firma electrónica",
          "Introducción a Ejecutiva Bancaria",
          "12 charlas mensuales especializadas",
          "Acceso a comunidad Lo Simple"
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
          "Análisis de documentación y solución de problemas",
          "Gestión de reserva de nombre",
          "Selección adecuada de Actividades Económicas",
          "Contrato inscrito y SAS 100% legalizada",
          "Nombramientos inscritos para todos los socios",
          "RUC habilitado para facturar",
          "Documentos para cuenta bancaria",
          "Títulos de Acción y Libro de Accionistas",
          "Guía de trámites posteriores",
          "Asistencia firma electrónica",
          "Introducción a Ejecutiva Bancaria",
          "Conversión sin costo a S.A. o Cía. Ltda.",
          "12 charlas mensuales especializadas",
          "Acceso a comunidad Lo Simple"
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
          "Análisis de documentación y solución de problemas",
          "Gestión de reserva de nombre",
          "Selección adecuada de Actividades Económicas",
          "Contrato inscrito y SAS 100% legalizada",
          "Nombramientos inscritos para todos los socios",
          "RUC habilitado para facturar",
          "Documentos para cuenta bancaria",
          "Títulos de Acción y Libro de Accionistas",
          "Guía de trámites posteriores",
          "Asistencia firma electrónica",
          "Introducción a Ejecutiva Bancaria",
          "Conversión sin costo a S.A. o Cía. Ltda.",
          "12 charlas mensuales especializadas",
          "Acceso a comunidad Lo Simple"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "company-liquidation",
        name: "Liquidación de Empresas",
        description: "Proceso completo de liquidación y cierre de empresas de manera legal y ordenada, cumpliendo con todos los requisitos regulatorios.",
        shortDescription: "Cierre legal y ordenado de tu empresa",
        price: "450.00",
        category: "Servicios Corporativos",
        features: [
          "Análisis de situación actual de la empresa",
          "Preparación de documentos de liquidación",
          "Gestión ante organismos oficiales",
          "Cancelación de RUC y obligaciones",
          "Liquidación de activos y pasivos",
          "Cierre de cuentas bancarias empresariales",
          "Documentación final de cierre"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "statute-reform",
        name: "Reforma de Estatutos",
        description: "Actualiza y modifica los estatutos de tu empresa para adaptarlos a nuevas necesidades del negocio o cambios regulatorios.",
        shortDescription: "Actualiza los estatutos de tu empresa",
        price: "350.00",
        category: "Servicios Corporativos",
        features: [
          "Análisis de estatutos actuales",
          "Redacción de modificaciones necesarias",
          "Gestión ante Superintendencia de Compañías",
          "Actualización de nombramientos si aplica",
          "Inscripción de reformas",
          "Documentos actualizados"
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
        id: "accounting-setup",
        name: "Configuración Contable Inicial",
        description: "Establece la estructura contable de tu empresa desde cero con plan de cuentas y procesos adaptados a tu negocio.",
        shortDescription: "Estructura contable profesional para tu empresa",
        price: "320.00",
        category: "Servicios Contables",
        features: [
          "Plan de cuentas personalizado",
          "Configuración de sistema contable",
          "Políticas contables básicas",
          "Estructura de costos",
          "Reportes financieros base",
          "Capacitación inicial"
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
      // FACTURACIÓN ELECTRÓNICA - Planes mensuales
      {
        id: "facturacion-50-comprobantes",
        name: "Facturación Electrónica - 50 comprobantes",
        description: "Plan mensual de facturación electrónica para pequeños negocios. Incluye hasta 50 comprobantes al mes con soporte técnico completo.",
        shortDescription: "50 comprobantes mensuales - Ideal para emprendimientos",
        price: "4.48",
        category: "Facturación Electrónica",
        features: [
          "Hasta 50 comprobantes electrónicos al mes",
          "Facturas, notas de crédito y débito", 
          "Guía de retenciones automática",
          "Soporte técnico incluido",
          "Dashboard de control en tiempo real",
          "Reportes mensuales automáticos",
          "Cumplimiento normativo SRI",
          "Integración con tu sistema contable"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "facturacion-120-comprobantes",
        name: "Facturación Electrónica - 120 comprobantes",
        description: "Plan mensual con 120 comprobantes electrónicos, perfecto para pequeñas empresas en crecimiento.",
        shortDescription: "120 comprobantes mensuales - Pequeñas empresas",
        price: "8.96",
        category: "Facturación Electrónica",
        features: [
          "Hasta 120 comprobantes electrónicos al mes",
          "Todos los tipos de comprobantes SRI",
          "Retenciones automáticas configurables",
          "Soporte técnico prioritario",
          "Reportes analíticos avanzados",
          "Backup automático de datos",
          "Integración API disponible",
          "Capacitación personalizada incluida"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "facturacion-200-comprobantes", 
        name: "Facturación Electrónica - 200 comprobantes",
        description: "Plan mensual diseñado para medianas empresas que requieren hasta 200 comprobantes electrónicos mensuales.",
        shortDescription: "200 comprobantes mensuales - Medianas empresas",
        price: "11.20",
        category: "Facturación Electrónica",
        features: [
          "Hasta 200 comprobantes electrónicos al mes",
          "Gestión multi-sucursal incluida",
          "Configuración avanzada de impuestos",
          "Soporte técnico 24/7",
          "Reportes personalizables",
          "Integración con sistemas ERP",
          "API completa para desarrolladores",
          "Capacitación para equipo contable"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "facturacion-400-comprobantes",
        name: "Facturación Electrónica - 400 comprobantes", 
        description: "Plan empresarial para empresas que manejan alto volumen de transacciones, hasta 400 comprobantes mensuales.",
        shortDescription: "400 comprobantes mensuales - Alto volumen",
        price: "16.80",
        category: "Facturación Electrónica",
        features: [
          "Hasta 400 comprobantes electrónicos al mes",
          "Gestión empresarial multi-punto",
          "Configuraciones especializadas por sector",
          "Soporte técnico dedicado",
          "Business Intelligence integrado",
          "Sincronización con software contable",
          "API empresarial completa",
          "Consultoría mensual incluida"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "facturacion-600-comprobantes",
        name: "Facturación Electrónica - 600 comprobantes",
        description: "Plan corporativo para grandes empresas, diseñado para manejar hasta 600 comprobantes electrónicos mensualmente.",
        shortDescription: "600 comprobantes mensuales - Plan corporativo",
        price: "29.12",
        category: "Facturación Electrónica", 
        features: [
          "Hasta 600 comprobantes electrónicos al mes",
          "Arquitectura corporativa escalable",
          "Configuraciones especializadas avanzadas",
          "Account manager dedicado",
          "Reportería ejecutiva personalizada",
          "Integración con sistemas legacy",
          "API empresarial con SLA garantizado",
          "Consultoría estratégica trimestral"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "facturacion-ilimitada",
        name: "Facturación Electrónica Ilimitada",
        description: "Plan premium sin límites de comprobantes, ideal para empresas de gran escala con volúmenes variables.",
        shortDescription: "Comprobantes ilimitados - Plan premium",
        price: "44.80",
        category: "Facturación Electrónica",
        features: [
          "Comprobantes electrónicos ilimitados",
          "Infraestructura premium dedicada",
          "Configuraciones empresariales ilimitadas",
          "Soporte 24/7 con SLA premium",
          "Dashboards ejecutivos en tiempo real",
          "Integraciones empresariales sin límite",
          "API empresarial de alta disponibilidad",
          "Consultoría estratégica mensual"
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
      // SERVICIOS CORPORATIVOS - Como solicitó el usuario
      {
        id: "cesion-acciones",
        name: "Cesión de Acciones",
        description: "Traspaso legal de acciones entre socios con todos los trámites registrales y documentación oficial requerida.",
        shortDescription: "Traspaso legal de acciones - Documentación completa",
        price: "180.00",
        category: "Servicios Corporativos",
        features: [
          "Elaboración de contrato de cesión",
          "Inscripción en Registro Mercantil",
          "Actualización de libro de accionistas",
          "Nuevos certificados de acciones",
          "Asesoría legal especializada",
          "Trámites registrales completos"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "aumento-capital",
        name: "Aumento de Capital",
        description: "Incremento del capital social de tu empresa con todos los procedimientos legales y registrales correspondientes.",
        shortDescription: "Aumento de capital social - Trámites completos",
        price: "220.00",
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
        id: "cambio-nombre",
        name: "Cambio de Nombre Empresarial",
        description: "Modificación de la razón social de tu empresa con todos los trámites legales y actualización de documentos.",
        shortDescription: "Cambio de razón social - Trámites legales",
        price: "150.00",
        category: "Servicios Corporativos",
        features: [
          "Verificación de disponibilidad",
          "Reforma de estatutos",
          "Inscripción registral",
          "Actualización RUC",
          "Nuevos documentos societarios",
          "Asesoría en proceso completo"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "aumento-actividad-economica",
        name: "Aumento de Actividad Económica",
        description: "Ampliación del objeto social de tu empresa para incluir nuevas actividades económicas permitidas.",
        shortDescription: "Ampliación objeto social - Nuevas actividades",
        price: "140.00",
        category: "Servicios Corporativos",
        features: [
          "Análisis de actividades propuestas",
          "Reforma de estatutos sociales",
          "Trámites en Registro Mercantil",
          "Actualización en SRI",
          "Documentos actualizados",
          "Asesoría en clasificación CIIU"
        ],
        isActive: 1,
        imageUrl: null
      },
      {
        id: "renovacion-nombramiento",
        name: "Renovación de Nombramiento",
        description: "Renovación de nombramientos de representantes legales y administradores con inscripción registral.",
        shortDescription: "Renovación de nombramientos - Representantes legales",
        price: "120.00",
        category: "Servicios Corporativos",
        features: [
          "Junta general de accionistas",
          "Actas de nombramiento",
          "Inscripción en Registro Mercantil",
          "Certificados actualizados",
          "Poderes notariales si aplica",
          "Asesoría en procedimientos"
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
}

export const storage = new MemStorage();
