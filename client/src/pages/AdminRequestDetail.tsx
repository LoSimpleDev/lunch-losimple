import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Phone, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RequestDetail {
  request: any;
  progress: any;
  documents: any[];
  notes: any[];
}

export default function AdminRequestDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/adminlaunch/:id");
  const { toast } = useToast();
  const [editedSteps, setEditedSteps] = useState<any>({});
  
  const { data, isLoading } = useQuery<RequestDetail>({
    queryKey: [`/api/admin/requests/${params?.id}`],
    enabled: !!params?.id,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (updates: any) => {
      const res = await apiRequest("PATCH", `/api/admin/progress/${params?.id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/requests/${params?.id}`] });
      toast({
        title: "Actualizado",
        description: "El progreso se ha actualizado correctamente",
      });
      setEditedSteps({});
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar progreso",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  const request = data?.request;
  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Solicitud no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/adminlaunch')}
          className="mb-6"
          data-testid="button-back-to-kanban"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Kanban
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Solicitud de Launch</CardTitle>
                  <CardDescription>{request.fullName || 'Sin nombre'}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={request.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                    {request.paymentStatus === 'completed' ? 'Pagado' : 'Sin pagar'}
                  </Badge>
                  <Badge variant={request.isFormComplete ? 'default' : 'secondary'}>
                    {request.isFormComplete ? 'Completo' : 'Incompleto'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{request.fullName || 'No proporcionado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{request.personalEmail || 'No proporcionado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{request.phone || 'No proporcionado'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Plan: </span>
                  <span className="text-sm">Launch</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Empresa:</strong> {request.companyName1 || 'No proporcionado'}</p>
                <p><strong>Actividad:</strong> {request.mainActivity || 'No proporcionado'}</p>
                <p><strong>Marca:</strong> {request.brandName || 'No proporcionado'}</p>
                <p><strong>Dominio:</strong> {request.desiredDomain || 'No proporcionado'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos de Constitución</CardTitle>
              <CardDescription>Documentos necesarios para el proceso legal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-sm">Pago de servicio básico</h4>
                {request.utilityBillUrl ? (
                  <a 
                    href={request.utilityBillUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm truncate block"
                    data-testid="link-utility-bill"
                  >
                    {request.utilityBillUrl}
                  </a>
                ) : (
                  <p className="text-sm text-gray-500" data-testid="text-no-utility-bill">No se ha cargado documento</p>
                )}
              </div>

              {request.numberOfShareholders > 1 && (
                <div>
                  <h4 className="font-medium mb-3 text-sm">Accionistas ({request.numberOfShareholders})</h4>
                  {request.shareholders && request.shareholders.length > 0 ? (
                    <div className="space-y-3">
                      {request.shareholders.map((shareholder: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{shareholder.fullName || `Accionista ${index + 1}`}</p>
                            <span className="text-xs text-gray-500">{shareholder.participation}%</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            <p>Cédula: {shareholder.idNumber || 'No proporcionado'}</p>
                            {shareholder.email && <p>Email: {shareholder.email}</p>}
                            {shareholder.phone && <p>Teléfono: {shareholder.phone}</p>}
                          </div>
                          <div className="flex gap-2 pt-2">
                            {shareholder.idCardUrl && (
                              <a 
                                href={shareholder.idCardUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                data-testid={`link-shareholder-id-card-${index}`}
                              >
                                Ver cédula
                              </a>
                            )}
                            {shareholder.votingCardUrl && (
                              <a 
                                href={shareholder.votingCardUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                data-testid={`link-shareholder-voting-card-${index}`}
                              >
                                Ver papeleta
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500" data-testid="text-no-shareholders">No se ha cargado información de accionistas</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {data.progress && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Progreso de Entregas</CardTitle>
                  <CardDescription>Actualiza el paso actual y siguiente para cada deliverable</CardDescription>
                </div>
                <Button 
                  onClick={() => updateProgressMutation.mutate(editedSteps)}
                  disabled={Object.keys(editedSteps).length === 0 || updateProgressMutation.isPending}
                  data-testid="button-save-progress"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProgressMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { 
                      name: 'Logo', 
                      status: data.progress.logoStatus, 
                      progress: data.progress.logoProgress,
                      currentStepKey: 'logoCurrentStep',
                      nextStepKey: 'logoNextStep',
                      currentStep: data.progress.logoCurrentStep,
                      nextStep: data.progress.logoNextStep
                    },
                    { 
                      name: 'Sitio Web', 
                      status: data.progress.websiteStatus, 
                      progress: data.progress.websiteProgress,
                      currentStepKey: 'websiteCurrentStep',
                      nextStepKey: 'websiteNextStep',
                      currentStep: data.progress.websiteCurrentStep,
                      nextStep: data.progress.websiteNextStep
                    },
                    { 
                      name: 'Redes Sociales', 
                      status: data.progress.socialMediaStatus, 
                      progress: data.progress.socialMediaProgress,
                      currentStepKey: 'socialMediaCurrentStep',
                      nextStepKey: 'socialMediaNextStep',
                      currentStep: data.progress.socialMediaCurrentStep,
                      nextStep: data.progress.socialMediaNextStep
                    },
                    { 
                      name: 'Compañía', 
                      status: data.progress.companyStatus, 
                      progress: data.progress.companyProgress,
                      currentStepKey: 'companyCurrentStep',
                      nextStepKey: 'companyNextStep',
                      currentStep: data.progress.companyCurrentStep,
                      nextStep: data.progress.companyNextStep
                    },
                    { 
                      name: 'Facturación', 
                      status: data.progress.invoicingStatus, 
                      progress: data.progress.invoicingProgress,
                      currentStepKey: 'invoicingCurrentStep',
                      nextStepKey: 'invoicingNextStep',
                      currentStep: data.progress.invoicingCurrentStep,
                      nextStep: data.progress.invoicingNextStep
                    },
                    { 
                      name: 'Firma', 
                      status: data.progress.signatureStatus, 
                      progress: data.progress.signatureProgress,
                      currentStepKey: 'signatureCurrentStep',
                      nextStepKey: 'signatureNextStep',
                      currentStep: data.progress.signatureCurrentStep,
                      nextStep: data.progress.signatureNextStep
                    },
                  ].map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                          {item.status || 'pending'} - {item.progress || 0}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${item.currentStepKey}-${index}`}>Paso Actual</Label>
                          <Input
                            id={`${item.currentStepKey}-${index}`}
                            value={editedSteps[item.currentStepKey] ?? item.currentStep ?? ''}
                            onChange={(e) => setEditedSteps({
                              ...editedSteps,
                              [item.currentStepKey]: e.target.value
                            })}
                            placeholder="Describe el paso actual..."
                            data-testid={`input-${item.currentStepKey}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${item.nextStepKey}-${index}`}>Paso Siguiente</Label>
                          <Input
                            id={`${item.nextStepKey}-${index}`}
                            value={editedSteps[item.nextStepKey] ?? item.nextStep ?? ''}
                            onChange={(e) => setEditedSteps({
                              ...editedSteps,
                              [item.nextStepKey]: e.target.value
                            })}
                            placeholder="Describe el paso siguiente..."
                            data-testid={`input-${item.nextStepKey}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
