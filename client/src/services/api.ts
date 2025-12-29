// ============================================
// API SERVICES - Funciones asíncronas REST
// ============================================

import { supabase } from "@/integrations/supabase/client";
import type {
  LoginPayload,
  AuthSession,
  User,
  Company,
  UserCompany,
  SystemUser,
  Payment,
  AdminUser,
  DashboardStats,
  Membership,
  ApiResponse,
  System,
} from "@/types";

// Simulación de delay para demostrar loaders
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// SYSTEM SERVICES
// ============================================

export async function fetchSystems(): Promise<ApiResponse<System[]>> {
  const { data, error } = await supabase
    .from("v_system")
    .select("id, name, descripcion, state")
    .eq("state", true)
    .order("name");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data ?? [] };
}

// ============================================
// AUTH SERVICES
// ============================================

export async function loginUser(
  payload: LoginPayload
): Promise<ApiResponse<AuthSession>> {
  await delay(1200);

  // Mock: Validar credenciales
  if (
    payload.email === "admin@example.com" &&
    payload.password === "admin123"
  ) {
    return {
      success: true,
      data: {
        user: {
          id: "1",
          email: payload.email,
          name: "Super Admin",
          role: "SUPERADMIN",
          status: "active",
          createdAt: new Date().toISOString(),
        },
        token: "mock-jwt-token-12345",
        companies: [],
      },
    };
  }

  return {
    success: false,
    error: "Credenciales inválidas",
  };
}

export async function validateUserRole(
  userId: string
): Promise<ApiResponse<{ role: string; isValid: boolean }>> {
  await delay(500);

  return {
    success: true,
    data: {
      role: "SUPERADMIN",
      isValid: true,
    },
  };
}

export async function fetchUserCompanies(
  userId: string
): Promise<ApiResponse<UserCompany[]>> {
  await delay(800);

  const mockCompanies: UserCompany[] = [
    {
      userId,
      companyId: "1",
      company: {
        id: "1",
        name: "TechCorp Solutions",
        status: "active",
        usersCount: 150,
        createdAt: "2024-01-15",
      },
      role: "SUPERADMIN",
    },
    {
      userId,
      companyId: "2",
      company: {
        id: "2",
        name: "Digital Innovations",
        status: "active",
        usersCount: 85,
        createdAt: "2024-02-20",
      },
      role: "SUPERADMIN",
    },
    {
      userId,
      companyId: "3",
      company: {
        id: "3",
        name: "CloudFirst Services",
        status: "active",
        usersCount: 200,
        createdAt: "2023-11-10",
      },
      role: "SUPERADMIN",
    },
  ];

  return {
    success: true,
    data: mockCompanies,
  };
}

export async function logoutUser(): Promise<ApiResponse<void>> {
  await delay(300);
  return { success: true };
}

// ============================================
// DASHBOARD SERVICES
// ============================================

export async function fetchDashboardStats(): Promise<
  ApiResponse<DashboardStats>
> {
  await delay(1000);

  return {
    success: true,
    data: {
      totalUsers: 2847,
      totalCompanies: 45,
      totalRevenue: 156780.5,
      pendingPayments: 23,
      activeSubscriptions: 1892,
      newUsersThisMonth: 234,
    },
  };
}

// ============================================
// USERS SERVICES
// ============================================

export async function fetchUsers(filters?: {
  system?: string;
  companyId?: string;
  search?: string;
}): Promise<ApiResponse<SystemUser[]>> {
  await delay(1000);

  const mockUsers: SystemUser[] = [
    {
      id: "1",
      email: "john.doe@techcorp.com",
      name: "John Doe",
      status: "active",
      system: "a3a4c5a9-b957-4134-b530-31ceb26866fa",
      companyId: "1",
      companyName: "TechCorp Solutions",
      memberships: [
        {
          id: "m1",
          userId: "1",
          name: "Plan Premium",
          status: "active",
          startDate: "2024-01-01",
          endDate: "2025-01-01",
          system: "facturacion",
          price: 99.99,
        },
      ],
      currentMembership: {
        id: "m1",
        userId: "1",
        name: "Plan Premium",
        status: "active",
        startDate: "2024-01-01",
        endDate: "2025-01-01",
        system: "facturacion",
        price: 99.99,
      },
      createdAt: "2024-01-15",
      lastActivity: "2024-12-07",
      activityHistory: [
        {
          id: "a1",
          action: "login",
          description: "Inicio de sesión",
          timestamp: "2024-12-07T10:30:00Z",
        },
        {
          id: "a2",
          action: "invoice_created",
          description: "Factura #1234 creada",
          timestamp: "2024-12-07T11:15:00Z",
        },
      ],
    },
    {
      id: "2",
      email: "jane.smith@digital.io",
      name: "Jane Smith",
      status: "active",
      system: "9ffd0f46-6582-413a-bf64-af4265fe2246",
      companyId: "2",
      companyName: "Digital Innovations",
      memberships: [
        {
          id: "m2",
          userId: "2",
          name: "Plan Básico",
          status: "active",
          startDate: "2024-03-01",
          endDate: "2024-09-01",
          system: "sassi",
          price: 49.99,
        },
      ],
      currentMembership: {
        id: "m2",
        userId: "2",
        name: "Plan Básico",
        status: "active",
        startDate: "2024-03-01",
        endDate: "2024-09-01",
        system: "sassi",
        price: 49.99,
      },
      createdAt: "2024-03-01",
      lastActivity: "2024-12-06",
      activityHistory: [],
    },
    {
      id: "3",
      email: "carlos.rodriguez@cloud.com",
      name: "Carlos Rodríguez",
      status: "blocked",
      system: "9ffd0f46-6582-413a-bf64-af4265fe2246",
      companyId: "3",
      companyName: "CloudFirst Services",
      memberships: [],
      createdAt: "2024-02-10",
      lastActivity: "2024-11-20",
      activityHistory: [],
    },
    {
      id: "4",
      email: "maria.garcia@techcorp.com",
      name: "María García",
      status: "inactive",
      system: "9ffd0f46-6582-413a-bf64-af4265fe2246",
      companyId: "1",
      companyName: "TechCorp Solutions",
      memberships: [
        {
          id: "m3",
          userId: "4",
          name: "Plan Empresarial",
          status: "expired",
          startDate: "2023-06-01",
          endDate: "2024-06-01",
          system: "inventario",
          price: 149.99,
        },
      ],
      createdAt: "2023-06-01",
      lastActivity: "2024-06-01",
      activityHistory: [],
    },
  ];

  let filteredUsers = [...mockUsers];

  if (filters?.system) {
    filteredUsers = filteredUsers.filter((u) => u.system === filters.system);
  }
  if (filters?.companyId) {
    filteredUsers = filteredUsers.filter(
      (u) => u.companyId === filters.companyId
    );
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
    );
  }

  return {
    success: true,
    data: filteredUsers,
  };
}

export async function resetUserPassword(
  userId: string
): Promise<ApiResponse<void>> {
  await delay(800);
  return { success: true, message: "Contraseña reseteada exitosamente" };
}

export async function resetUserProfile(
  userId: string
): Promise<ApiResponse<void>> {
  await delay(800);
  return { success: true, message: "Perfil reseteado exitosamente" };
}

export async function unlockUser(userId: string): Promise<ApiResponse<void>> {
  await delay(800);
  return { success: true, message: "Usuario desbloqueado exitosamente" };
}

export async function createMembership(
  userId: string,
  membership: Partial<Membership>
): Promise<ApiResponse<Membership>> {
  await delay(1000);

  return {
    success: true,
    data: {
      id: `m-${Date.now()}`,
      userId,
      name: membership.name || "Nueva Membresía",
      status: "active",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      system: membership.system || "general",
      price: membership.price || 0,
    },
  };
}

export async function toggleMembershipStatus(
  membershipId: string,
  enabled: boolean
): Promise<ApiResponse<void>> {
  await delay(600);
  return {
    success: true,
    message: enabled ? "Membresía habilitada" : "Membresía deshabilitada",
  };
}

// ============================================
// PAYMENTS / CONCILIATION SERVICES
// ============================================

export async function fetchPayments(filters?: {
  year?: number;
  month?: number;
  week?: number;
  day?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<Payment[]>> {
  await delay(1200);

  const mockPayments: Payment[] = [
    {
      id: "PAY-001",
      date: "2024-12-07",
      amount: 1250.0,
      companyId: "1",
      companyName: "TechCorp Solutions",
      status: "pending",
      paymentMethod: "Transferencia Bancaria",
      receiptImage:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
      metadata: { reference: "REF-123456", bank: "Banco Nacional" },
    },
    {
      id: "PAY-002",
      date: "2024-12-06",
      amount: 850.5,
      companyId: "2",
      companyName: "Digital Innovations",
      status: "approved",
      paymentMethod: "Tarjeta de Crédito",
      metadata: { reference: "CC-789012" },
    },
    {
      id: "PAY-003",
      date: "2024-12-05",
      amount: 2100.0,
      companyId: "3",
      companyName: "CloudFirst Services",
      status: "rejected",
      paymentMethod: "Transferencia Bancaria",
      receiptImage:
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400",
      metadata: { reference: "REF-456789", bank: "Banco Central" },
    },
    {
      id: "PAY-004",
      date: "2024-12-04",
      amount: 499.99,
      companyId: "1",
      companyName: "TechCorp Solutions",
      status: "approved",
      paymentMethod: "PayPal",
    },
    {
      id: "PAY-005",
      date: "2024-12-03",
      amount: 1750.0,
      companyId: "2",
      companyName: "Digital Innovations",
      status: "pending",
      paymentMethod: "Transferencia Bancaria",
      receiptImage:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400",
      metadata: { reference: "REF-111222", bank: "Banco Popular" },
    },
  ];

  return {
    success: true,
    data: mockPayments,
  };
}

export async function updatePaymentStatus(
  paymentId: string,
  status: "pending" | "approved" | "rejected"
): Promise<ApiResponse<void>> {
  await delay(800);
  return { success: true, message: `Pago actualizado a: ${status}` };
}

// ============================================
// ADMIN USERS SERVICES
// ============================================

export async function fetchAdminUsers(): Promise<ApiResponse<AdminUser[]>> {
  await delay(1000);

  const mockAdmins: AdminUser[] = [
    {
      id: "admin-1",
      email: "superadmin@system.com",
      name: "Super Administrador",
      status: "active",
      permissions: ["all"],
      createdAt: "2023-01-01",
      lastLogin: "2024-12-07",
      actionsLog: [
        {
          id: "log1",
          action: "user_created",
          description: "Creó usuario john.doe@example.com",
          timestamp: "2024-12-07T09:00:00Z",
        },
        {
          id: "log2",
          action: "payment_approved",
          description: "Aprobó pago PAY-002",
          timestamp: "2024-12-06T15:30:00Z",
        },
      ],
    },
    {
      id: "admin-2",
      email: "admin.soporte@system.com",
      name: "Admin Soporte",
      status: "active",
      permissions: ["users.view", "users.edit", "payments.view"],
      createdAt: "2024-03-15",
      lastLogin: "2024-12-06",
      actionsLog: [],
    },
    {
      id: "admin-3",
      email: "admin.finanzas@system.com",
      name: "Admin Finanzas",
      status: "inactive",
      permissions: ["payments.view", "payments.edit", "reports.view"],
      createdAt: "2024-06-01",
      lastLogin: "2024-11-20",
      actionsLog: [],
    },
  ];

  return {
    success: true,
    data: mockAdmins,
  };
}

export async function createAdminUser(
  admin: Partial<AdminUser>
): Promise<ApiResponse<AdminUser>> {
  await delay(1000);

  return {
    success: true,
    data: {
      id: `admin-${Date.now()}`,
      email: admin.email || "",
      name: admin.name || "",
      status: "active",
      permissions: admin.permissions || [],
      createdAt: new Date().toISOString(),
      actionsLog: [],
    },
  };
}

export async function toggleAdminStatus(
  adminId: string,
  active: boolean
): Promise<ApiResponse<void>> {
  await delay(600);
  return {
    success: true,
    message: active ? "Admin activado" : "Admin desactivado",
  };
}

export async function updateAdminPermissions(
  adminId: string,
  permissions: string[]
): Promise<ApiResponse<void>> {
  await delay(800);
  return { success: true, message: "Permisos actualizados" };
}

export async function fetchAdminActivityLog(
  adminId: string
): Promise<ApiResponse<AdminUser["actionsLog"]>> {
  await delay(800);
  return {
    success: true,
    data: [
      {
        id: "1",
        action: "login",
        description: "Inicio de sesión",
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

// ============================================
// CLIENTES TYPEFORM SERVICES
// ============================================

import type {
  EmpresaFormulario,
  EmpresaBitacora,
  EmpresaObservacion,
  TipoObservacion,
  EmpresaAnticipo,
} from "@/types";

export async function fetchClientesTypeform(filters?: {
  estado?: string;
  especialista?: string;
  search?: string;
}): Promise<ApiResponse<EmpresaFormulario[]>> {
  const { data, error } = await supabase
    .from("v_empresas_formulario" as any)
    .select("*")
    .order("empresa_created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }
  console.log("Fetched clientes from supabase:", data);

  let filteredData = (data ?? []) as unknown as EmpresaFormulario[];

  // Apply filters in memory (for flexibility with nested data)
  if (filters?.estado && filters.estado !== "all") {
    filteredData = filteredData.filter(
      (item) => item.empresas_bitacora?.estado_actual === filters.estado
    );
  }
  if (filters?.especialista && filters.especialista !== "all") {
    filteredData = filteredData.filter(
      (item) =>
        item.empresas_bitacora?.especialista_asignado === filters.especialista
    );
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        item.razon_social?.toLowerCase().includes(search) ||
        item.email_empresa?.toLowerCase().includes(search) ||
        item.nombre_comercial?.toLowerCase().includes(search)
    );
  }

  return { success: true, data: filteredData };
}

export async function updateBitacora(
  bitacoraId: string,
  updates: Partial<EmpresaBitacora>
): Promise<ApiResponse<EmpresaBitacora>> {
  const { data, error } = await supabase
    .from("empresas_bitacora" as any)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", bitacoraId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as unknown as EmpresaBitacora };
}

export async function fetchEspecialistas(): Promise<ApiResponse<string[]>> {
  const { data, error } = await supabase
    .from("especialistas" as any)
    .select("nombre");

  if (error) {
    return { success: false, error: error.message };
  }
  console.log("Fetched especialistas from supabase:", data);
  const records = (data as unknown as { nombre: string | null }[]) ?? [];
  return { success: true, data: records.map((d) => d.nombre as string) };
}

// ============================================
// OBSERVACIONES SERVICES
// ============================================

export async function fetchObservaciones(
  empresaId: string
): Promise<ApiResponse<EmpresaObservacion[]>> {
  const { data, error } = await supabase
    .from("empresas_observaciones" as any)
    .select("*")
    .eq("empresas_formulario_id", empresaId)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as unknown as EmpresaObservacion[] };
}

export async function createObservacion(
  observacion: Omit<EmpresaObservacion, "id" | "created_at">
): Promise<ApiResponse<EmpresaObservacion>> {
  const { data, error } = await supabase
    .from("empresas_observaciones" as any)
    .insert(observacion)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as unknown as EmpresaObservacion };
}

// ============================================
// ANTICIPOS SERVICES
// ============================================

export async function fetchAnticipos(
  empresaId: string
): Promise<ApiResponse<EmpresaAnticipo[]>> {
  const { data, error } = await supabase
    .from("empresas_anticipos" as any)
    .select("*")
    .eq("empresas_formulario_id", empresaId)
    .order("fecha_pago", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as unknown as EmpresaAnticipo[] };
}

export async function createAnticipo(
  anticipo: Omit<EmpresaAnticipo, "id" | "created_at">
): Promise<ApiResponse<EmpresaAnticipo>> {
  const { data, error } = await supabase
    .from("empresas_anticipos" as any)
    .insert({ ...anticipo, estado: "Pendiente" })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as unknown as EmpresaAnticipo };
}
