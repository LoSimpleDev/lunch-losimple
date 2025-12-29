import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { FileText, LogOut, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: "client" | "simplificador" | "superadmin";
}

export default function AdminLegal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Fetch user session
  const { data: sessionData, isLoading: isLoadingSession } = useQuery<{
    user: User;
  }>({
    queryKey: ["/api/auth/session"],
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

  if (isLoadingSession) {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSuperadmin ? "Superadmin" : "Simplificador"} - Panel de
              administración
            </p>
          </div>
          <div className="flex items-center gap-4">
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

      <Button
        variant="outline"
        onClick={() => setLocation("/clients")}
        data-testid="button-clients"
      >
        <FileText className="w-4 h-4 mr-2" />
        Constituciones
      </Button>
      <Button
        variant="outline"
        onClick={() => setLocation("/adminlaunch")}
        data-testid="button-adminlaunch"
      >
        <FileText className="w-4 h-4 mr-2" />
        Lunch
      </Button>
    </div>
  );
}
