import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, FileText, CreditCard, Play, AlertCircle, CheckCircle } from "lucide-react";
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
  currentStep: number;
  isFormComplete: boolean;
  paymentStatus: string;
  isStarted: boolean;
}

interface LaunchProgress {
  logoStatus: string;
  logoProgress: number;
  websiteStatus: string;
  websiteProgress: number;
  socialMediaStatus: string;
  socialMediaProgress: number;
  companyStatus: string;
  companyProgress: number;
  invoicingStatus: string;
  invoicingProgress: number;
  signatureStatus: string;
  signatureProgress: number;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch user session
  const { data: sessionData, isLoading: isLoadingSession } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/session"],
  });

  // Fetch launch request
  const { data: launchRequest, isLoading: isLoadingRequest } = useQuery<LaunchRequest>({
    queryKey: ["/api/launch/my-request"],
    enabled: !!sessionData?.user,
  });

  // Fetch launch progress
  const { data: progress } = useQuery<LaunchProgress>({
    queryKey: ["/api/launch/progress"],
    enabled: !!launchRequest?.isStarted,
  });

  useEffect(() => {
    if (!isLoadingSession && !sessionData) {
      setLocation('/login');
    }
  }, [sessionData, isLoadingSession, setLocation]);

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

  const handleStartLaunch = async () => {
    try {
      await apiRequest("POST", "/api/launch/start");
      await queryClient.invalidateQueries({ queryKey: ["/api/launch/my-request"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/launch/progress"] });
      
      toast({
        title: "¡Iniciado!",
        description: "Tu solicitud ha sido enviada al equipo de Lo Simple",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al iniciar el proceso",
        variant: "destructive",
      });
    }
  };

  if (isLoadingSession || isLoadingRequest) {
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
  if (!user) return null;

  const formProgress = launchRequest ? Math.round((launchRequest.currentStep / 8) * 100) : 0;
  const isPaid = launchRequest?.paymentStatus === 'completed';
  const canStart = launchRequest?.isFormComplete && isPaid;
  const hasStarted = launchRequest?.isStarted;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lo Simple</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Launch Dashboard</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
            <User className="w-5 h-5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.fullName}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          {launchRequest && (
            <div className="space-y-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan:</span>
                <Badge variant="default" data-testid="badge-plan">
                  Launch
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pago:</span>
                <Badge variant={isPaid ? "default" : "secondary"} data-testid="badge-payment">
                  {isPaid ? 'Completado' : 'Pendiente'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado:</span>
                <Badge variant={hasStarted ? "default" : "outline"} data-testid="badge-status">
                  {hasStarted ? 'Iniciado' : 'No iniciado'}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">¡Hola, {user.fullName}!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bienvenido a tu panel de control de Launch
            </p>
          </div>

          {/* Status Card */}
          {!launchRequest || !launchRequest.isFormComplete ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Información del formulario
                </CardTitle>
                <CardDescription>
                  {launchRequest ? 
                    `Paso ${launchRequest.currentStep} de 8 completado` : 
                    'Comienza llenando tu información'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {launchRequest && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso del formulario</span>
                      <span>{formProgress}%</span>
                    </div>
                    <Progress value={formProgress} data-testid="progress-form" />
                  </div>
                )}
                <Button 
                  onClick={() => setLocation('/launch-form')}
                  className="w-full"
                  data-testid="button-continue-form"
                >
                  {launchRequest ? 'Continuar llenando información' : 'Comenzar formulario'}
                </Button>
              </CardContent>
            </Card>
          ) : !isPaid ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pago requerido
                </CardTitle>
                <CardDescription>
                  Completa el pago para poder iniciar tu Launch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setLocation('/launch-payment')}
                  className="w-full"
                  data-testid="button-go-payment"
                >
                  Ir a Pago
                </Button>
              </CardContent>
            </Card>
          ) : !hasStarted ? (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  ¡Todo listo para empezar!
                </CardTitle>
                <CardDescription>
                  Información completa y pago confirmado. Haz clic en "Empezar" para enviar tu solicitud al equipo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleStartLaunch}
                  className="w-full"
                  data-testid="button-start-launch"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Empezar mi Launch
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Estado de tu Launch</CardTitle>
                  <CardDescription>
                    El equipo de Lo Simple está trabajando en tu proyecto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Logo', status: progress?.logoStatus, progress: progress?.logoProgress },
                      { name: 'Sitio Web', status: progress?.websiteStatus, progress: progress?.websiteProgress },
                      { name: 'Redes Sociales', status: progress?.socialMediaStatus, progress: progress?.socialMediaProgress },
                      { name: 'Constitución de Compañía', status: progress?.companyStatus, progress: progress?.companyProgress },
                      { name: 'Facturación Electrónica', status: progress?.invoicingStatus, progress: progress?.invoicingProgress },
                      { name: 'Firma Electrónica', status: progress?.signatureStatus, progress: progress?.signatureProgress },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2" data-testid={`delivery-${index}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.name}</span>
                          <Badge 
                            variant={
                              item.status === 'completed' ? 'default' : 
                              item.status === 'in_progress' ? 'secondary' : 
                              'outline'
                            }
                          >
                            {item.status === 'completed' ? 'Completado' : 
                             item.status === 'in_progress' ? 'En progreso' : 
                             'Pendiente'}
                          </Badge>
                        </div>
                        <Progress value={item.progress || 0} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>
                    Descarga los archivos entregados por el equipo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Los documentos aparecerán aquí cuando estén disponibles
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
