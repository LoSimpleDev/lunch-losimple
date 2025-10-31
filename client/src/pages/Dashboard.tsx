import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, User, FileText, CreditCard, Play, AlertCircle, CheckCircle, MessageSquare, Send, Check, Gift } from "lucide-react";
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
  logoCurrentStep?: string;
  logoNextStep?: string;
  websiteStatus: string;
  websiteProgress: number;
  websiteCurrentStep?: string;
  websiteNextStep?: string;
  socialMediaStatus: string;
  socialMediaProgress: number;
  socialMediaCurrentStep?: string;
  socialMediaNextStep?: string;
  companyStatus: string;
  companyProgress: number;
  companyCurrentStep?: string;
  companyNextStep?: string;
  invoicingStatus: string;
  invoicingProgress: number;
  invoicingCurrentStep?: string;
  invoicingNextStep?: string;
  signatureStatus: string;
  signatureProgress: number;
  signatureCurrentStep?: string;
  signatureNextStep?: string;
}

interface TeamMessage {
  id: string;
  launchRequestId: string;
  message: string;
  senderRole: string;
  senderName: string;
  clientResponse?: string;
  isResolved: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

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
  
  // Fetch team messages
  const { data: messages = [] } = useQuery<TeamMessage[]>({
    queryKey: ["/api/launch/messages"],
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
  
  const respondMutation = useMutation({
    mutationFn: async ({ messageId, response }: { messageId: string; response: string }) => {
      const res = await apiRequest("PATCH", `/api/messages/${messageId}/respond`, { response });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/launch/messages"] });
      toast({
        title: "Respuesta enviada",
        description: "Tu respuesta ha sido registrada",
      });
      setResponses({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al enviar respuesta",
        variant: "destructive",
      });
    }
  });
  
  const resolveMutation = useMutation({
    mutationFn: async ({ messageId, isResolved }: { messageId: string; isResolved: boolean }) => {
      const res = await apiRequest("PATCH", `/api/messages/${messageId}/resolve`, { isResolved });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/launch/messages"] });
      toast({
        title: variables.isResolved ? "Marcado como resuelto" : "Marcado como pendiente",
        description: "El estado del mensaje ha sido actualizado",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al actualizar el estado",
        variant: "destructive",
      });
    }
  });

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

        <div className="space-y-3">
          {isPaid && (
            <Button 
              className="w-full" 
              style={{ backgroundColor: '#FEC817' }}
              onClick={() => setLocation('/beneficios')}
              data-testid="button-benefits"
            >
              <Gift className="w-4 h-4 mr-2" />
              Canje Beneficios
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
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
                  <div className="space-y-6">
                    {[
                      { 
                        name: 'Logo', 
                        status: progress?.logoStatus, 
                        progress: progress?.logoProgress,
                        currentStep: progress?.logoCurrentStep || 'Revisión inicial de brief',
                        nextStep: progress?.logoNextStep || 'Desarrollo de conceptos creativos'
                      },
                      { 
                        name: 'Sitio Web', 
                        status: progress?.websiteStatus, 
                        progress: progress?.websiteProgress,
                        currentStep: progress?.websiteCurrentStep || 'Análisis de requerimientos',
                        nextStep: progress?.websiteNextStep || 'Diseño de wireframes'
                      },
                      { 
                        name: 'Redes Sociales', 
                        status: progress?.socialMediaStatus, 
                        progress: progress?.socialMediaProgress,
                        currentStep: progress?.socialMediaCurrentStep || 'Configuración de perfiles',
                        nextStep: progress?.socialMediaNextStep || 'Estrategia de contenido'
                      },
                      { 
                        name: 'Constitución de Compañía', 
                        status: progress?.companyStatus, 
                        progress: progress?.companyProgress,
                        currentStep: progress?.companyCurrentStep || 'Revisión de documentación',
                        nextStep: progress?.companyNextStep || 'Preparación de estatutos'
                      },
                      { 
                        name: 'Facturación Electrónica', 
                        status: progress?.invoicingStatus, 
                        progress: progress?.invoicingProgress,
                        currentStep: progress?.invoicingCurrentStep || 'Registro en SRI',
                        nextStep: progress?.invoicingNextStep || 'Configuración del sistema'
                      },
                      { 
                        name: 'Firma Electrónica', 
                        status: progress?.signatureStatus, 
                        progress: progress?.signatureProgress,
                        currentStep: progress?.signatureCurrentStep || 'Solicitud de certificado',
                        nextStep: progress?.signatureNextStep || 'Instalación y activación'
                      },
                    ].map((item, index) => (
                      <div key={index} className="border rounded-lg p-4" data-testid={`delivery-${index}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Columna 1: Progreso */}
                          <div className="space-y-3">
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
                            
                            {/* Progress bar with checkpoints */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                <span>0%</span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100%</span>
                              </div>
                              <div className="relative">
                                <Progress value={item.progress || 0} className="h-3" />
                                {/* Checkpoint markers */}
                                <div className="absolute top-0 left-0 right-0 flex justify-between px-[1px]">
                                  {[0, 25, 50, 75, 100].map((checkpoint) => (
                                    <div 
                                      key={checkpoint}
                                      className={`w-1 h-3 ${
                                        (item.progress || 0) >= checkpoint 
                                          ? 'bg-primary' 
                                          : 'bg-gray-300 dark:bg-gray-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-semibold">{item.progress || 0}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Columna 2: Pasos */}
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Paso Actual</p>
                              <p className="text-sm">{item.currentStep}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Paso Siguiente</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{item.nextStep}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mensajes del Equipo Lo Simple */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Mensajes del Equipo Lo Simple
                  </CardTitle>
                  <CardDescription>
                    Comunicación directa con el equipo de Lo Simple
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`border rounded-lg p-4 ${msg.isResolved ? 'bg-gray-50 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}
                          data-testid={`message-${msg.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{msg.senderName}</span>
                                <Badge variant={msg.senderRole === 'admin' ? 'default' : 'secondary'} className="text-xs">
                                  {msg.senderRole === 'admin' ? 'Equipo' : 'Tú'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(msg.createdAt).toLocaleDateString('es-EC', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant={msg.isResolved ? "outline" : "default"}
                              onClick={() => resolveMutation.mutate({ messageId: msg.id, isResolved: !msg.isResolved })}
                              disabled={resolveMutation.isPending}
                              data-testid={`button-resolve-${msg.id}`}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              {msg.isResolved ? 'Resuelto' : 'Marcar resuelto'}
                            </Button>
                          </div>
                          
                          <p className="text-sm mb-3 whitespace-pre-wrap">{msg.message}</p>
                          
                          {msg.clientResponse && (
                            <div className="bg-white dark:bg-gray-700 rounded p-3 mb-3 border-l-4 border-primary">
                              <p className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Tu respuesta:</p>
                              <p className="text-sm">{msg.clientResponse}</p>
                            </div>
                          )}
                          
                          {!msg.clientResponse && !msg.isResolved && (
                            <div className="space-y-2">
                              <Textarea
                                value={responses[msg.id] || ''}
                                onChange={(e) => setResponses({ ...responses, [msg.id]: e.target.value })}
                                placeholder="Escribe tu respuesta..."
                                className="text-sm"
                                rows={2}
                                data-testid={`textarea-response-${msg.id}`}
                              />
                              <Button 
                                size="sm" 
                                onClick={() => {
                                  if (responses[msg.id]?.trim()) {
                                    respondMutation.mutate({ messageId: msg.id, response: responses[msg.id] });
                                  }
                                }}
                                disabled={!responses[msg.id]?.trim() || respondMutation.isPending}
                                data-testid={`button-send-response-${msg.id}`}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Enviar respuesta
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400" data-testid="text-no-messages">
                      No hay mensajes del equipo aún
                    </p>
                  )}
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
