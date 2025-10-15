import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Phone } from "lucide-react";

interface RequestDetail {
  request: any;
  progress: any;
  documents: any[];
  notes: any[];
}

export default function AdminRequestDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/adminlaunch/:id");
  
  const { data, isLoading } = useQuery<RequestDetail>({
    queryKey: [`/api/admin/requests/${params?.id}`],
    enabled: !!params?.id,
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

          {data.progress && (
            <Card>
              <CardHeader>
                <CardTitle>Progreso de Entregas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Logo', status: data.progress.logoStatus, progress: data.progress.logoProgress },
                    { name: 'Sitio Web', status: data.progress.websiteStatus, progress: data.progress.websiteProgress },
                    { name: 'Redes Sociales', status: data.progress.socialMediaStatus, progress: data.progress.socialMediaProgress },
                    { name: 'Compañía', status: data.progress.companyStatus, progress: data.progress.companyProgress },
                    { name: 'Facturación', status: data.progress.invoicingStatus, progress: data.progress.invoicingProgress },
                    { name: 'Firma', status: data.progress.signatureStatus, progress: data.progress.signatureProgress },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                        {item.status || 'pending'}
                      </Badge>
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
