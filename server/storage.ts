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
        isActive: 1,
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
      }
    ];

    sampleServices.forEach(service => {
      this.services.set(service.id, service);
    });
  }
}

export const storage = new MemStorage();
