import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, Sparkles, Copy, CheckCircle, Lock } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Benefit {
  id: string;
  name: string;
  description: string;
  partnerName: string;
  partnerEmail: string;
  imageUrl?: string;
  isActive: boolean;
}

interface BenefitCode {
  id: string;
  benefitId: string;
  code: string;
  companyName: string;
  isUsed: boolean;
  createdAt: string;
  benefitName?: string;
  benefitPartner?: string;
}

interface LaunchRequest {
  id: string;
  paymentStatus: string;
}

export default function Benefits() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: launchRequest, isLoading: isLoadingLaunch } = useQuery<LaunchRequest>({
    queryKey: ["/api/launch/my-request"],
  });

  const { data: benefits = [], isLoading: isLoadingBenefits } = useQuery<Benefit[]>({
    queryKey: ["/api/benefits"],
  });

  const { data: myCodes = [], isLoading: isLoadingCodes } = useQuery<BenefitCode[]>({
    queryKey: ["/api/benefits/my-codes"],
  });

  const isLaunchCustomer = launchRequest?.paymentStatus !== 'not_required' && launchRequest?.paymentStatus !== undefined;

  const generateCodeMutation = useMutation({
    mutationFn: async (benefitId: string) => {
      const res = await apiRequest("POST", "/api/benefits/generate-code", { benefitId });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/benefits/my-codes"] });
      toast({
        title: "¡Código generado!",
        description: `Tu código ${data.code} ha sido enviado al aliado ${data.benefit}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al generar código",
        variant: "destructive",
      });
    }
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Código copiado",
      description: "El código ha sido copiado al portapapeles",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const hasGeneratedCode = (benefitId: string) => {
    return myCodes.some(code => code.benefitId === benefitId);
  };

  if (isLoadingBenefits || isLoadingCodes || isLoadingLaunch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando beneficios...</p>
        </div>
      </div>
    );
  }

  if (!isLaunchCustomer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto p-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/dashboard')}
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>

          <Card className="border-2 border-amber-200 dark:border-amber-800">
            <CardContent className="py-12 text-center">
              <Lock className="w-16 h-16 mx-auto mb-6 text-amber-500" />
              <h2 className="text-2xl font-bold mb-4">Sección Exclusiva</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Esta sección está reservada únicamente para clientes que han creado empresas con nosotros a través del programa Launch.
              </p>
              <Button 
                onClick={() => setLocation('/launch')}
                style={{ backgroundColor: '#FEC817' }}
                data-testid="button-go-launch"
              >
                <Gift className="w-4 h-4 mr-2" />
                Conocer Launch
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/dashboard')}
            data-testid="button-back-dashboard"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Gift className="w-10 h-10" style={{ color: '#FEC817' }} />
            Canje de Beneficios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Como cliente de Lo Simple, tienes acceso a beneficios exclusivos de nuestros aliados
          </p>
        </div>

        {myCodes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Mis Códigos Generados</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {myCodes.map((code) => (
                <Card key={code.id} className="border-2" style={{ borderColor: '#FEC817' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{code.benefitPartner}</span>
                      {code.isUsed && (
                        <Badge variant="secondary" data-testid={`badge-used-${code.id}`}>
                          Usado
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{code.benefitName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mono text-lg font-bold">
                        {code.code}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyCode(code.code)}
                        data-testid={`button-copy-${code.id}`}
                      >
                        {copiedCode === code.code ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Generado el {new Date(code.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">Beneficios Disponibles</h2>
          {benefits.filter(b => b.isActive).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">
                  No hay beneficios disponibles en este momento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits
                .filter(benefit => benefit.isActive)
                .map((benefit) => {
                  const alreadyGenerated = hasGeneratedCode(benefit.id);
                  
                  return (
                    <Card key={benefit.id} className="flex flex-col">
                      {benefit.imageUrl && (
                        <div className="w-full h-48 overflow-hidden rounded-t-lg">
                          <img 
                            src={benefit.imageUrl} 
                            alt={benefit.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {benefit.name}
                        </CardTitle>
                        <CardDescription className="text-sm font-medium" style={{ color: '#FEC817' }}>
                          {benefit.partnerName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                          {benefit.description}
                        </p>
                        <Button
                          className="w-full"
                          style={{ backgroundColor: alreadyGenerated ? '#6B7280' : '#FEC817' }}
                          onClick={() => generateCodeMutation.mutate(benefit.id)}
                          disabled={generateCodeMutation.isPending || alreadyGenerated}
                          data-testid={`button-generate-${benefit.id}`}
                        >
                          {alreadyGenerated ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Código ya generado
                            </>
                          ) : generateCodeMutation.isPending ? (
                            'Generando...'
                          ) : (
                            <>
                              <Gift className="w-4 h-4 mr-2" />
                              Canjear Beneficio
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
