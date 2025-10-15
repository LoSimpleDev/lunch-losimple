import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const TOTAL_STEPS = 9;

interface LaunchRequest {
  id: string;
  currentStep: number;
  isFormComplete: boolean;
  // Add other fields as needed
  [key: string]: any;
}

export default function LaunchForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Fetch existing launch request
  const { data: launchRequest, isLoading } = useQuery<LaunchRequest>({
    queryKey: ["/api/launch/my-request"],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});

  // Initialize form data from existing request
  useEffect(() => {
    if (launchRequest) {
      setCurrentStep(launchRequest.currentStep || 1);
      setFormData(launchRequest);
    }
  }, [launchRequest]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/launch/request", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/launch/my-request"] });
    }
  });

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({
        ...formData,
        currentStep,
        isFormComplete: currentStep === TOTAL_STEPS
      });
      
      toast({
        title: "Guardado",
        description: "Tu progreso ha sido guardado",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar",
        variant: "destructive",
      });
    }
  };

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      try {
        await saveMutation.mutateAsync({
          ...formData,
          currentStep: nextStep,
          isFormComplete: nextStep === TOTAL_STEPS
        });
        
        setCurrentStep(nextStep);
        
        toast({
          title: "Guardado",
          description: "Tu progreso ha sido guardado",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Error al guardar",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = async () => {
    await handleSave();
    setLocation('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const progress = Math.round((currentStep / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Formulario Launch</h1>
            <Button variant="ghost" onClick={handleSaveAndExit} data-testid="button-save-exit">
              Guardar y salir
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Paso {currentStep} de {TOTAL_STEPS}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} data-testid="progress-form" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Bienvenida"}
              {currentStep === 2 && "Datos Personales"}
              {currentStep === 3 && "Datos de Socios"}
              {currentStep === 4 && "Datos de la Compañía"}
              {currentStep === 5 && "Identidad Visual"}
              {currentStep === 6 && "Página Web"}
              {currentStep === 7 && "Membresía y Pago"}
              {currentStep === 8 && "Facturación"}
              {currentStep === 9 && "Confirmación"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "¡Bienvenido al Plan Launch Lo Simple!"}
              {currentStep > 1 && "Completa la información requerida"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px]">
              <p className="text-gray-600 dark:text-gray-400">
                Contenido del paso {currentStep} - En desarrollo
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                data-testid="button-previous"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStep === TOTAL_STEPS}
                data-testid="button-next"
              >
                {currentStep === TOTAL_STEPS ? "Finalizar" : "Siguiente"}
                {currentStep < TOTAL_STEPS && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
