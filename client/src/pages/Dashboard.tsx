import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LogOut, User, FileText, CreditCard, Play, AlertCircle, CheckCircle, MessageSquare, Send, Check, Gift, ShoppingBag, Package, Building2, Users, MapPin, PlusCircle, FilePlus, XCircle } from "lucide-react";
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
  companyName1?: string;
  billingIdNumber?: string;
  fiscalCity?: string;
  province?: string;
  shareholders?: Array<{
    fullName: string;
    idNumber: string;
    participation: number;
    email: string;
    phone: string;
  }>;
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

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  services: Array<{ serviceId: string; quantity: number; price: string }>;
  totalAmount: string;
  status: string;
  createdAt: string;
}

type TabType = 'perfil' | 'estado';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<TabType>('perfil');
  const [legalRepresentative, setLegalRepresentative] = useState("");
  const [legalRepresentativeId, setLegalRepresentativeId] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Ecuador");
  const [shareholdersInput, setShareholdersInput] = useState<Array<{ name: string; percentage: string }>>([
    { name: "", percentage: "" }
  ]);

  const { data: sessionData, isLoading: isLoadingSession } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/session"],
  });

  const { data: launchRequest, isLoading: isLoadingRequest } = useQuery<LaunchRequest>({
    queryKey: ["/api/launch/my-request"],
    enabled: !!sessionData?.user,
  });

  const { data: progress } = useQuery<LaunchProgress>({
    queryKey: ["/api/launch/progress"],
    enabled: !!launchRequest?.isStarted,
  });
  
  const { data: messages = [] } = useQuery<TeamMessage[]>({
    queryKey: ["/api/launch/messages"],
    enabled: !!launchRequest?.isStarted,
  });

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["/api/user/orders"],
    enabled: !!sessionData?.user,
  });

  const { data: services = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/services"],
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

  const addShareholder = () => {
    setShareholdersInput([...shareholdersInput, { name: "", percentage: "" }]);
  };

  const removeShareholder = (index: number) => {
    if (shareholdersInput.length > 1) {
      setShareholdersInput(shareholdersInput.filter((_, i) => i !== index));
    }
  };

  const updateShareholder = (index: number, field: 'name' | 'percentage', value: string) => {
    const updated = [...shareholdersInput];
    updated[index][field] = value;
    setShareholdersInput(updated);
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
  const isLaunchCompany = launchRequest?.paymentStatus !== 'not_required';
  const canStart = launchRequest?.isFormComplete && isPaid;
  const hasStarted = launchRequest?.isStarted;

  const companyName = launchRequest?.companyName1 || "Mi Empresa S.A.S.";
  const rucNumber = launchRequest?.billingIdNumber || "Sin RUC registrado";
  const location = launchRequest?.fiscalCity && launchRequest?.province 
    ? `${launchRequest.fiscalCity}, ${launchRequest.province}`
    : "Ecuador";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lo Simple</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Panel de Control</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
            <User className="w-5 h-5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.fullName}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="space-y-2">
            <Button
              variant={activeTab === 'perfil' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('perfil')}
              data-testid="tab-mi-empresa"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Mi Empresa
            </Button>
            <Button
              variant={activeTab === 'estado' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('estado')}
              data-testid="tab-estado"
            >
              <FileText className="w-4 h-4 mr-2" />
              Estado
            </Button>
          </div>

          {launchRequest && (
            <div className="space-y-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan:</span>
                <Badge variant="default" data-testid="badge-plan">
                  {isLaunchCompany ? 'Launch' : 'SAS Existente'}
                </Badge>
              </div>
              {isLaunchCompany && (
                <>
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
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {isLaunchCompany && isPaid && (
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
              Bienvenido a tu panel de control
            </p>
          </div>

          {/* Tab Content: Mi Empresa (Perfil) */}
          {activeTab === 'perfil' && (
            <>
              {/* Company Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Perfil de la Empresa
                  </CardTitle>
                  <CardDescription>
                    Información de tu empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Razón Social de la Empresa
                      </label>
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium" data-testid="text-company-name">{companyName}</p>
                      </div>
                    </div>

                    {/* RUC */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Número de RUC
                      </label>
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium" data-testid="text-ruc">{rucNumber}</p>
                      </div>
                    </div>

                    {/* Legal Representative */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Representante Legal Actual
                      </label>
                      <Input
                        value={legalRepresentative}
                        onChange={(e) => setLegalRepresentative(e.target.value)}
                        placeholder="Ingresa el nombre del representante legal"
                        data-testid="input-legal-representative"
                      />
                    </div>

                    {/* Legal Representative ID */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cédula del Representante Legal
                      </label>
                      <Input
                        value={legalRepresentativeId}
                        onChange={(e) => setLegalRepresentativeId(e.target.value)}
                        placeholder="Número de cédula"
                        data-testid="input-legal-representative-id"
                      />
                    </div>

                    {/* Location - City and Country */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Localidad y País
                      </label>
                      <div className="flex gap-3">
                        <Input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Ciudad"
                          className="flex-1"
                          data-testid="input-city"
                        />
                        <Input
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="País"
                          className="flex-1"
                          data-testid="input-country"
                        />
                      </div>
                    </div>

                    {/* Shareholders - Full width */}
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Accionistas Actuales
                      </label>
                      {shareholdersInput.map((shareholder, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <Input
                            value={shareholder.name}
                            onChange={(e) => updateShareholder(index, 'name', e.target.value)}
                            placeholder="Nombre del accionista"
                            className="flex-1"
                            data-testid={`input-shareholder-name-${index}`}
                          />
                          <Input
                            value={shareholder.percentage}
                            onChange={(e) => updateShareholder(index, 'percentage', e.target.value)}
                            placeholder="%"
                            className="w-20"
                            data-testid={`input-shareholder-percentage-${index}`}
                          />
                          {shareholdersInput.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeShareholder(index)}
                              data-testid={`button-remove-shareholder-${index}`}
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addShareholder}
                        data-testid="button-add-shareholder"
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Agregar Accionista
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setLocation('/launch')}
                  data-testid="button-open-another-company"
                >
                  <PlusCircle className="w-6 h-6" />
                  <span>Abrir Otra Empresa</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setLocation('/')}
                  data-testid="button-create-documents"
                >
                  <FilePlus className="w-6 h-6" />
                  <span>Crear documentos adicionales</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  data-testid="button-close-company"
                >
                  <XCircle className="w-6 h-6" />
                  <span>Cerrar Empresa</span>
                </Button>
              </div>

              {/* Order History Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Historial de Compras
                  </CardTitle>
                  <CardDescription>
                    Tus compras y servicios contratados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const getServiceName = (serviceId: string) => {
                          const service = services.find(s => s.id === serviceId);
                          return service?.name || 'Servicio';
                        };
                        
                        const getStatusBadge = (status: string) => {
                          switch (status) {
                            case 'completed':
                              return <Badge className="bg-green-500" data-testid={`badge-order-status-${order.id}`}>Completado</Badge>;
                            case 'pending':
                              return <Badge variant="secondary" data-testid={`badge-order-status-${order.id}`}>Pendiente</Badge>;
                            case 'cancelled':
                              return <Badge variant="destructive" data-testid={`badge-order-status-${order.id}`}>Cancelado</Badge>;
                            default:
                              return <Badge variant="outline" data-testid={`badge-order-status-${order.id}`}>{status}</Badge>;
                          }
                        };

                        return (
                          <div 
                            key={order.id} 
                            className="border rounded-lg p-4 space-y-3"
                            data-testid={`order-card-${order.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-sm">
                                  Orden #{order.id.slice(0, 8)}
                                </span>
                              </div>
                              {getStatusBadge(order.status)}
                            </div>
                            
                            <div className="space-y-1">
                              {order.services.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {getServiceName(item.serviceId)} x{item.quantity}
                                  </span>
                                  <span>${parseFloat(item.price).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString('es-EC', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                              <span className="font-semibold">
                                Total: ${parseFloat(order.totalAmount).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground" data-testid="text-no-orders">
                        No tienes compras registradas aún
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setLocation('/')}
                        data-testid="button-explore-services"
                      >
                        Explorar Servicios
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Tab Content: Estado */}
          {activeTab === 'estado' && (
            <>
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
              ) : !isPaid && isLaunchCompany ? (
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
              ) : !hasStarted && isLaunchCompany ? (
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
              ) : !isLaunchCompany ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Empresa Registrada
                    </CardTitle>
                    <CardDescription>
                      Tu empresa SAS existente está registrada en nuestro sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Puedes acceder a nuestros servicios desde la pestaña "Mi Empresa" o explorar servicios adicionales.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => setLocation('/')}
                      className="w-full"
                      data-testid="button-explore-services-estado"
                    >
                      Explorar Servicios
                    </Button>
                  </CardContent>
                </Card>
              ) : hasStarted ? (
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
              ) : null}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
