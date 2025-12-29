import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  FileText,
  IdCard,
  LogOut,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: "client" | "simplificador" | "superadmin";
}

interface TeamUser {
  id: string;
  email: string;
  fullName: string;
  role: "simplificador" | "superadmin";
}

interface LaunchRequest {
  id: string;
  userId: string;
  fullName?: string;
  personalEmail?: string;
  currentStep: number;
  isFormComplete: boolean;
  paymentStatus: string;
  isStarted: boolean;
  adminStatus: string;
  assignedTo?: string;
  createdAt: string;
}

export default function AdminLaunch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Fetch user session
  const { data: sessionData, isLoading: isLoadingSession } = useQuery<{
    user: User;
  }>({
    queryKey: ["/api/auth/session"],
  });

  // Fetch team users (for superadmin assignment)
  const { data: teamUsers } = useQuery<TeamUser[]>({
    queryKey: ["/api/admin/team"],
    enabled: !!sessionData?.user && sessionData.user.role === "superadmin",
  });

  // Fetch unassigned requests (for simplificadores to take)
  const { data: unassignedRequests } = useQuery<LaunchRequest[]>({
    queryKey: ["/api/admin/unassigned"],
    enabled: !!sessionData?.user && sessionData.user.role === "simplificador",
  });

  // Fetch launch requests
  const { data: requests, isLoading: isLoadingRequests } = useQuery<
    LaunchRequest[]
  >({
    queryKey: ["/api/admin/requests", selectedStatus],
    enabled:
      !!sessionData?.user &&
      (sessionData.user.role === "superadmin" ||
        sessionData.user.role === "simplificador"),
  });

  useEffect(() => {
    if (
      !isLoadingSession &&
      (!sessionData ||
        (sessionData.user.role !== "superadmin" &&
          sessionData.user.role !== "simplificador"))
    ) {
      setLocation("/");
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos de administrador",
        variant: "destructive",
      });
    }
  }, [sessionData, isLoadingSession, setLocation, toast]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      await queryClient.invalidateQueries();
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive",
      });
    }
  };

  if (isLoadingSession || isLoadingRequests) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  const user = sessionData?.user;
  if (!user || (user.role !== "superadmin" && user.role !== "simplificador"))
    return null;

  const isSuperadmin = user.role === "superadmin";

  // Find team member name for assigned requests
  const getAssignedName = (assignedTo?: string) => {
    if (!assignedTo) return null;
    if (assignedTo === user.id) return "Tú";
    const assignee = teamUsers?.find((u) => u.id === assignedTo);
    return assignee?.fullName || "Asignado";
  };

  // Group requests by status
  const requestsByStatus = {
    new: requests?.filter((r) => r.adminStatus === "new") || [],
    reviewing: requests?.filter((r) => r.adminStatus === "reviewing") || [],
    in_progress: requests?.filter((r) => r.adminStatus === "in_progress") || [],
    completed: requests?.filter((r) => r.adminStatus === "completed") || [],
  };

  const statusLabels = {
    new: "Nuevo",
    reviewing: "En Revisión",
    in_progress: "En Proceso",
    completed: "Completado",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Launch</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSuperadmin ? "Superadmin" : "Simplificador"} - Panel de
              administración
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/clients")}
              data-testid="button-clients"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Constituciones
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/conciliation")}
              data-testid="button-conciliation"
            >
              <IdCard className="w-4 h-4 mr-2" />
              Financiero
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/admin-blog")}
              data-testid="button-admin-blog"
            >
              <FileText className="w-4 h-4 mr-2" />
              Blog
            </Button>
            {isSuperadmin && (
              <Button
                variant="outline"
                onClick={() => setLocation("/admin-users")}
                data-testid="button-admin-users"
              >
                <Users className="w-4 h-4 mr-2" />
                Equipo
              </Button>
            )}
            <div className="text-right">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Unassigned Requests for Simplificadores */}
      {!isSuperadmin && unassignedRequests && unassignedRequests.length > 0 && (
        <div className="p-6 pb-0">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-yellow-900 dark:text-yellow-100">
              Solicitudes Disponibles ({unassignedRequests.length})
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              Estas solicitudes están sin asignar. Haz clic en "Tomar" para
              asignártela.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {unassignedRequests.map((request) => (
                <Card
                  key={request.id}
                  data-testid={`card-unassigned-${request.id}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {request.fullName || "Sin nombre"}
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                      {request.personalEmail || "Sin email"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={async () => {
                        try {
                          await apiRequest(
                            "PATCH",
                            `/api/admin/requests/${request.id}/assign`,
                            { assignedTo: user.id }
                          );
                          await queryClient.invalidateQueries({
                            queryKey: ["/api/admin/requests"],
                          });
                          await queryClient.invalidateQueries({
                            queryKey: ["/api/admin/unassigned"],
                          });
                          toast({
                            title: "Solicitud asignada",
                            description: "La solicitud ha sido asignada a ti",
                          });
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "No se pudo asignar la solicitud",
                            variant: "destructive",
                          });
                        }
                      }}
                      data-testid={`button-take-${request.id}`}
                    >
                      Tomar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(requestsByStatus).map(([status, statusRequests]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  {statusLabels[status as keyof typeof statusLabels]}
                </h3>
                <Badge
                  variant="secondary"
                  data-testid={`badge-count-${status}`}
                >
                  {statusRequests.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {statusRequests.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-sm text-gray-500">
                      Sin solicitudes
                    </CardContent>
                  </Card>
                ) : (
                  statusRequests.map((request) => {
                    const assignedName = getAssignedName(request.assignedTo);
                    return (
                      <Card
                        key={request.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() =>
                          setLocation(`/adminlaunch/${request.id}`)
                        }
                        data-testid={`card-request-${request.id}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base truncate">
                                {request.fullName || "Sin nombre"}
                              </CardTitle>
                              <CardDescription className="truncate">
                                {request.personalEmail || "Sin email"}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              Launch
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {assignedName && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Users className="w-4 h-4" />
                              <span>{assignedName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FileText className="w-4 h-4" />
                            <span>Paso {request.currentStep}/8</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Badge
                              variant={
                                request.isFormComplete ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {request.isFormComplete
                                ? "Completo"
                                : "Incompleto"}
                            </Badge>
                            <Badge
                              variant={
                                request.paymentStatus === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {request.paymentStatus === "completed"
                                ? "Pagado"
                                : "Sin pagar"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
