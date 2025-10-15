import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, FileText, User, Calendar } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface LaunchRequest {
  id: string;
  userId: string;
  fullName?: string;
  personalEmail?: string;
  selectedPlan?: string;
  currentStep: number;
  isFormComplete: boolean;
  paymentStatus: string;
  isStarted: boolean;
  adminStatus: string;
  createdAt: string;
}

export default function AdminLaunch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Fetch user session
  const { data: sessionData, isLoading: isLoadingSession } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/session"],
  });

  // Fetch launch requests
  const { data: requests, isLoading: isLoadingRequests } = useQuery<LaunchRequest[]>({
    queryKey: ["/api/admin/requests", selectedStatus],
    enabled: !!sessionData?.user && sessionData.user.role === 'admin',
  });

  useEffect(() => {
    if (!isLoadingSession && (!sessionData || sessionData.user.role !== 'admin')) {
      setLocation('/');
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
      setLocation('/');
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
  if (!user || user.role !== 'admin') return null;

  // Group requests by status
  const requestsByStatus = {
    new: requests?.filter(r => r.adminStatus === 'new') || [],
    reviewing: requests?.filter(r => r.adminStatus === 'reviewing') || [],
    in_progress: requests?.filter(r => r.adminStatus === 'in_progress') || [],
    completed: requests?.filter(r => r.adminStatus === 'completed') || [],
  };

  const statusLabels = {
    new: 'Nuevo',
    reviewing: 'En Revisión',
    in_progress: 'En Proceso',
    completed: 'Completado'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Launch</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Panel de administración</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} data-testid="button-admin-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(requestsByStatus).map(([status, statusRequests]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{statusLabels[status as keyof typeof statusLabels]}</h3>
                <Badge variant="secondary" data-testid={`badge-count-${status}`}>
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
                  statusRequests.map((request) => (
                    <Card 
                      key={request.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setLocation(`/adminlaunch/${request.id}`)}
                      data-testid={`card-request-${request.id}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base truncate">
                              {request.fullName || 'Sin nombre'}
                            </CardTitle>
                            <CardDescription className="truncate">
                              {request.personalEmail || 'Sin email'}
                            </CardDescription>
                          </div>
                          {request.selectedPlan && (
                            <Badge variant="outline" className="ml-2">
                              {request.selectedPlan === 'fundador' ? 'Fundador' : 'Pro'}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FileText className="w-4 h-4" />
                          <span>Paso {request.currentStep}/9</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={request.isFormComplete ? "default" : "secondary"} className="text-xs">
                            {request.isFormComplete ? 'Completo' : 'Incompleto'}
                          </Badge>
                          <Badge variant={request.paymentStatus === 'completed' ? "default" : "secondary"} className="text-xs">
                            {request.paymentStatus === 'completed' ? 'Pagado' : 'Sin pagar'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
