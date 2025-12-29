// ============================================
// TYPES - Sistema de Administración Multiempresa
// ============================================

export interface System {
  id: string;
  name: string;
  descripcion?: string;
  state: boolean;
  update_at?: string;
  created_at?: string;
}

// ============================================
// CLIENTES TYPEFORM
// ============================================

export interface EmpresaFormulario {
  id: string; // Alias for empresa_id (required for DataTable)
  empresa_id: string;
  row_number?: number;
  origen_contacto?: string;
  firma_electronica?: string;
  respaldo_pago?: string;
  fecha_fundacion?: string;
  razon_social?: string;
  nombre_comercial?: string;
  provincia_canton?: string;
  ciudad_parroquia?: string;
  direccion_exacta?: string;
  documento_direccion?: string;
  referencia_direccion?: string;
  telefono_fijo?: number;
  telefono_celular?: number;
  email_empresa?: string;
  gerente_es_accionista?: string;
  cedula_gerente?: string;
  nombre_accionista?: string;
  email_accionista?: string;
  gerente_general?: string;
  duracion_cargo_gerente?: number;
  capital_inicial?: number;
  actividad_economica?: string;
  cedulas?: string;
  valoracion_formulario?: number;
  acuerdo_metodo?: number;
  submitted_at?: string;
  token?: string;
  url_comprobante?: string;
  comprobante?: string;
  empresa_created_at?: string;
  empresa_updated_at?: string;
  empresas_bitacora?: EmpresaBitacora;
}

export interface EmpresaBitacora {
  bitacora_id: string;
  empresa_id: string;
  nombre_asignado?: string;
  nombre_grupo?: string;
  punto_contacto?: string;
  estado_actual?: EstadoActual;
  estado_tramite?: EstadoTramite;
  tags?: string;
  estado_contacto?: string;
  dias_estado_actual?: string;
  duracion?: string;
  motivo?: string;
  acciones_solucion?: string;
  fecha_sobre_entregado?: string;
  sobre_entregado?: string;
  clave_cias?: string;
  link?: string;
  num_tramite_sri?: string;
  clave_sri?: string;
  especialista_asignado?: string;
  bitacora_created_at?: string;
  bitacora_updated_at?: string;
  valor_tramite?: number;
  saldo_pendiente?: number; 
}

// Anticipos de pago
export interface EmpresaAnticipo {
  id: string;
  empresas_formulario_id: string;
  estado?: string;
  monto: number;
  fecha_pago: string;
  fecha_max_pago?: string;
  metodo_pago?: string;
  orden_pago?: string;
  comprobante_url?: string;
  descripcion?: string;
  creado_por: string;
  created_at: string;
}

// Histórico de cambios de estado
export interface EstadoHistorico {
  id: string;
  empresas_formulario_id: string;
  estado_anterior?: string;
  estado_nuevo: string;
  fecha_cambio: string;
  duracion_estado_anterior?: string;
  cambiado_por?: string;
  notas?: string;
  created_at: string;
}

// Observaciones históricas
export interface EmpresaObservacion {
  id: string;
  empresas_formulario_id: string;
  especialista: string;
  observacion: string;
  tipo: TipoObservacion;
  created_at: string;
}

export type TipoObservacion = 'nota' | 'seguimiento' | 'alerta' | 'resolucion';

export const TIPOS_OBSERVACION: { value: TipoObservacion; label: string; color: string }[] = [
  { value: 'nota', label: 'Nota', color: 'bg-muted text-muted-foreground' },
  { value: 'seguimiento', label: 'Seguimiento', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'alerta', label: 'Alerta', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'resolucion', label: 'Resolución', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
];

export type EstadoActual =
  | 'PENDIENTE' 
  | 'ASIGNADO'  
  | 'EN PROCESO' 
  | 'FINALIZADO'
  | 'ENVIAR_FACTURACION'
  | 'FACTURADO';

export type EstadoTramite = 
  | 'Datos recibidos'
  | 'Reserva de Nombre'
  | 'Creación de Cuenta en Super cia'
  | 'Listo para la Firma Electrónica'
  | 'Pactado llamada para firma'
  | 'Firmado Ok'
  | 'En espera por claves'
  | 'Obtenido Claves'
  | 'Elaborado libros sociales'
  | 'Entregado'
  | 'TAG FINALIZADO SAS';

export const ESTADOS_ACTUALES: EstadoActual[] = [
  'PENDIENTE',
  'ASIGNADO', 
  'EN PROCESO',
  'FINALIZADO',
  'ENVIAR_FACTURACION',
  'FACTURADO',
];

export const ESTADOS_TRAMITE: EstadoTramite[] = [
  'Datos recibidos',
  'Reserva de Nombre',
  'Creación de Cuenta en Super cia',
  'Listo para la Firma Electrónica',
  'Pactado llamada para firma',
  'Firmado Ok',
  'En espera por claves',
  'Obtenido Claves',
  'Elaborado libros sociales',
  'Entregado',
  'TAG FINALIZADO SAS',
];

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'USER';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  status: 'active' | 'inactive';
  usersCount: number;
  createdAt: string;
}

export interface UserCompany {
  userId: string;
  companyId: string;
  company: Company;
  role: string;
}

export interface Membership {
  id: string;
  userId: string;
  name: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  system: string;
  price: number;
}

export interface SystemUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'blocked';
  system: string;
  companyId: string;
  companyName: string;
  memberships: Membership[];
  currentMembership?: Membership;
  createdAt: string;
  lastActivity?: string;
  activityHistory: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  companyId: string;
  companyName: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: string;
  receiptImage?: string;
  metadata?: {
    reference?: string;
    bank?: string;
    accountNumber?: string;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  status: 'active' | 'inactive';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  actionsLog: ActivityLog[];
}

export interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  totalRevenue: number;
  pendingPayments: number;
  activeSubscriptions: number;
  newUsersThisMonth: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
  companies: UserCompany[];
  activeCompany?: Company;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
