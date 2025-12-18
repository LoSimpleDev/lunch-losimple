import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Plus, Trash2, Rocket, AlertTriangle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const TOTAL_STEPS = 8;

interface LaunchRequest {
  id: string;
  currentStep: number;
  isFormComplete: boolean;
  fullName?: string;
  idNumber?: string;
  personalEmail?: string;
  phone?: string;
  address?: string;
  province?: string;
  canton?: string;
  numberOfShareholders?: number;
  shareholders?: Array<{
    fullName: string;
    idNumber: string;
    participation: number;
    email: string;
    phone: string;
    idCardUrl?: string;
    votingCardUrl?: string;
  }>;
  companyName1?: string;
  companyName2?: string;
  companyName3?: string;
  mainActivity?: string;
  secondaryActivities?: string[];
  initialCapital?: string;
  shareDistribution?: Array<{ name: string; shares: number }>;
  fiscalAddress?: string;
  fiscalCity?: string;
  administratorType?: string;
  hasExternalRep?: boolean;
  externalRepName?: string;
  externalRepId?: string;
  externalRepEmail?: string;
  externalRepPhone?: string;
  brandName?: string;
  slogan?: string;
  brandDescription?: string;
  personalityWords?: string[];
  preferredColors?: string[];
  preferredStyles?: string[];
  preferredFonts?: string;
  visualReferences?: string[];
  websiteObjectives?: string[];
  desiredDomain?: string;
  hasDomain?: boolean;
  wantsDomainPurchase?: boolean;
  socialMedia?: { facebook?: string; instagram?: string; linkedin?: string; twitter?: string };
  corporateEmail?: string;
  physicalAddress?: string;
  aboutUsText?: string;
  servicesText?: string;
  businessImages?: string[];
  websiteReference1?: string;
  websiteReference2?: string;
  websiteReference3?: string;
  billingName?: string;
  billingIdNumber?: string;
  billingAddress?: string;
  billingEmail?: string;
  [key: string]: any;
}

export default function LaunchForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Verificar sesión primero
  const { data: sessionData, isLoading: isLoadingSession } = useQuery<{ user: any }>({
    queryKey: ["/api/auth/session"],
  });
  
  const { data: launchRequest, isLoading } = useQuery<LaunchRequest>({
    queryKey: ["/api/launch/my-request"],
    enabled: !!sessionData?.user,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm({
    defaultValues: {},
  });

  const [formData, setFormData] = useState<any>({
    numberOfShareholders: 1,
    shareholders: [],
    secondaryActivities: [],
    shareDistribution: [],
    personalityWords: [],
    preferredColors: [],
    preferredStyles: [],
    visualReferences: [],
    websiteObjectives: [],
    businessImages: [],
    socialMedia: {},
    acceptedTerms: false,
  });

  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!isLoadingSession && !sessionData) {
      setLocation('/login');
    }
  }, [sessionData, isLoadingSession, setLocation]);

  useEffect(() => {
    if (launchRequest) {
      setCurrentStep(launchRequest.currentStep || 1);
      setFormData({ ...formData, ...launchRequest });
      form.reset(launchRequest);
    }
  }, [launchRequest]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/launch/request", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/launch/my-request"] });
    }
  });

  const checkMissingFields = () => {
    const missing: string[] = [];
    
    // Paso 2: Datos personales
    if (!formData.fullName) missing.push("Nombre completo");
    if (!formData.idNumber) missing.push("Número de cédula");
    if (!formData.personalEmail) missing.push("Email personal");
    if (!formData.phone) missing.push("Teléfono");
    if (!formData.address) missing.push("Dirección");
    if (!formData.province) missing.push("Provincia");
    if (!formData.canton) missing.push("Cantón");
    
    // Paso 3: Documentos (siempre requerido)
    if (!formData.utilityBillUrl) missing.push("Enlace a pago de servicio básico");
    
    const numShareholders = parseInt(formData.numberOfShareholders) || 1;
    if (numShareholders > 1) {
      if (!formData.shareholders || formData.shareholders.length === 0) {
        missing.push("Información de accionistas");
      } else {
        // Validar que cada accionista tenga sus documentos
        formData.shareholders.forEach((shareholder: any, index: number) => {
          if (!shareholder.idCardUrl) {
            missing.push(`Cédula del accionista ${index + 1}`);
          }
          if (!shareholder.votingCardUrl) {
            missing.push(`Papeleta de votación del accionista ${index + 1}`);
          }
        });
      }
    }
    
    // Paso 4: Datos de empresa
    if (!formData.companyName1) missing.push("Nombre de empresa");
    if (!formData.mainActivity) missing.push("Actividad principal");
    if (!formData.fiscalAddress) missing.push("Domicilio fiscal");
    if (!formData.fiscalCity) missing.push("Ciudad domicilio fiscal");
    
    // Paso 5: Marca
    if (!formData.brandName) missing.push("Nombre de marca");
    
    // Paso 6: Sitio web
    if (!formData.desiredDomain) missing.push("Dominio deseado");
    if (!formData.corporateEmail) missing.push("Email corporativo");
    
    // Paso 7: Facturación
    if (!formData.billingName) missing.push("Nombre para facturación");
    if (!formData.billingIdNumber) missing.push("RUC/Cédula para facturación");
    if (!formData.billingAddress) missing.push("Dirección de facturación");
    if (!formData.billingEmail) missing.push("Email para factura");
    
    return missing;
  };

  const handleComplete = async () => {
    const missing = checkMissingFields();
    
    if (missing.length > 0) {
      setMissingFields(missing);
      setShowIncompleteWarning(true);
      return;
    }
    
    await completeForm();
  };

  const completeForm = async () => {
    try {
      await saveMutation.mutateAsync({
        ...formData,
        currentStep: TOTAL_STEPS,
        isFormComplete: true
      });
      
      toast({
        title: "Formulario completado",
        description: "Redirigiendo al dashboard...",
      });
      
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1000);
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
    } else if (currentStep === TOTAL_STEPS) {
      await handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = async () => {
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
      
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  if (isLoadingSession || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no hay sesión, el useEffect redirigirá al login
  if (!sessionData?.user) {
    return null;
  }

  const progress = Math.round((currentStep / TOTAL_STEPS) * 100);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Rocket className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">¡Bienvenido a Launch!</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Vamos a construir tu empresa desde cero. Este proceso te tomará unos minutos y podrás guardar tu progreso en cualquier momento.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">¿Qué incluye Launch?</h3>
                <div className="grid md:grid-cols-2 gap-x-4 gap-y-2 text-gray-700 dark:text-gray-300 mb-3">
                  <li>✓ Guía estratégica para SAS</li>
                  <li>✓ Contrato Constitutivo aprobado</li>
                  <li>✓ Títulos de acciones</li>
                  <li>✓ Nombramientos inscritos</li>
                  <li>✓ RUC habilitado</li>
                  <li>✓ Firma electrónica empresarial</li>
                  <li>✓ Balance inicial ante Superintendencia</li>
                  <li>✓ Declaración inicial de patente municipal</li>
                  <li>✓ Acompañamiento en registro marcario</li>
                  <li>✓ Página web profesional con blog</li>
                  <li>✓ Chatbot de recepción integrado</li>
                  <li>✓ Optimización SEO, AEO y AIO</li>
                  <li>✓ Análisis inicial de visibilidad</li>
                  <li>✓ Verificación de presencia digital</li>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <strong>Nota:</strong> Las tasas oficiales de registro marcario y patente municipal (~USD 240) se pagan directamente a las instituciones.
                </p>
                <div className="flex items-start space-x-2 mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptedTerms || false}
                    onCheckedChange={(checked) => updateFormData("acceptedTerms", checked)}
                    data-testid="checkbox-accept-terms"
                  />
                  <Label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    Acepto los términos y condiciones
                  </Label>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Plan Launch:</strong> $1,499 + IVA
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName || ""}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  placeholder="Juan Pérez García"
                  data-testid="input-fullname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">Cédula de identidad *</Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber || ""}
                  onChange={(e) => updateFormData("idNumber", e.target.value)}
                  placeholder="1234567890"
                  data-testid="input-idnumber"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="personalEmail">Email personal *</Label>
                <Input
                  id="personalEmail"
                  type="email"
                  value={formData.personalEmail || ""}
                  onChange={(e) => updateFormData("personalEmail", e.target.value)}
                  placeholder="juan@email.com"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="0999123456"
                  data-testid="input-phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección domiciliaria *</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => updateFormData("address", e.target.value)}
                placeholder="Calle principal #123 y secundaria"
                data-testid="input-address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Provincia *</Label>
                <Select value={formData.province || ""} onValueChange={(value) => updateFormData("province", value)}>
                  <SelectTrigger data-testid="select-province">
                    <SelectValue placeholder="Selecciona provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pichincha">Pichincha</SelectItem>
                    <SelectItem value="guayas">Guayas</SelectItem>
                    <SelectItem value="azuay">Azuay</SelectItem>
                    <SelectItem value="manabi">Manabí</SelectItem>
                    <SelectItem value="otra">Otra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="canton">Cantón *</Label>
                <Input
                  id="canton"
                  value={formData.canton || ""}
                  onChange={(e) => updateFormData("canton", e.target.value)}
                  placeholder="Quito"
                  data-testid="input-canton"
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <Label htmlFor="numberOfShareholders">¿Cuántos accionistas son en total? (incluyéndote) *</Label>
              <Input
                id="numberOfShareholders"
                type="number"
                min="1"
                value={formData.numberOfShareholders || 1}
                onChange={(e) => updateFormData("numberOfShareholders", e.target.value)}
                placeholder="1"
                data-testid="input-number-of-shareholders"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Si eres el único accionista, ingresa 1. Si hay más accionistas, indica el número total.
              </p>
            </div>
          </div>
        );

      case 3:
        const numShareholders = parseInt(formData.numberOfShareholders) || 1;
        const hasMultipleShareholders = numShareholders > 1;
        
        return (
          <div className="space-y-4">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-base">Documentación Requerida</CardTitle>
                <CardDescription>
                  Sube los siguientes documentos para el proceso de constitución
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="utilityBillUrl">Enlace a pago de servicio básico *</Label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Sube el documento que muestre la dirección del negocio (planilla de luz, agua, teléfono) y pega el enlace aquí.
                  </p>
                  <Input
                    id="utilityBillUrl"
                    value={formData.utilityBillUrl || ""}
                    onChange={(e) => updateFormData("utilityBillUrl", e.target.value)}
                    placeholder="https://drive.google.com/file/..."
                    data-testid="input-utility-bill"
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    <strong>Importante:</strong> Asegúrate de que los documentos sean legibles y estén vigentes. Puedes subir tus archivos a Google Drive o Dropbox y compartir el enlace aquí.
                  </p>
                </div>
              </CardContent>
            </Card>

            {hasMultipleShareholders && (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Información de accionistas</h3>
                  <Button
                    type="button"
                    onClick={() => {
                      const shareholders = formData.shareholders || [];
                      updateFormData("shareholders", [...shareholders, { fullName: "", idNumber: "", participation: 0, email: "", phone: "", idCardUrl: "", votingCardUrl: "" }]);
                    }}
                    size="sm"
                    data-testid="button-add-shareholder"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar accionista
                  </Button>
                </div>

                {(formData.shareholders || []).map((shareholder: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Accionista {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const shareholders = [...(formData.shareholders || [])];
                              shareholders.splice(index, 1);
                              updateFormData("shareholders", shareholders);
                            }}
                            data-testid={`button-remove-shareholder-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nombre completo</Label>
                            <Input
                              value={shareholder.fullName || ""}
                              onChange={(e) => {
                                const shareholders = [...(formData.shareholders || [])];
                                shareholders[index].fullName = e.target.value;
                                updateFormData("shareholders", shareholders);
                              }}
                              placeholder="Nombre del accionista"
                              data-testid={`input-shareholder-name-${index}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Cédula</Label>
                            <Input
                              value={shareholder.idNumber || ""}
                              onChange={(e) => {
                                const shareholders = [...(formData.shareholders || [])];
                                shareholders[index].idNumber = e.target.value;
                                updateFormData("shareholders", shareholders);
                              }}
                              placeholder="1234567890"
                              data-testid={`input-shareholder-id-${index}`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Participación (%)</Label>
                            <Input
                              type="number"
                              value={shareholder.participation || ""}
                              onChange={(e) => {
                                const shareholders = [...(formData.shareholders || [])];
                                shareholders[index].participation = parseFloat(e.target.value);
                                updateFormData("shareholders", shareholders);
                              }}
                              placeholder="50"
                              data-testid={`input-shareholder-participation-${index}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={shareholder.email || ""}
                              onChange={(e) => {
                                const shareholders = [...(formData.shareholders || [])];
                                shareholders[index].email = e.target.value;
                                updateFormData("shareholders", shareholders);
                              }}
                              placeholder="accionista@email.com"
                              data-testid={`input-shareholder-email-${index}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input
                              value={shareholder.phone || ""}
                              onChange={(e) => {
                                const shareholders = [...(formData.shareholders || [])];
                                shareholders[index].phone = e.target.value;
                                updateFormData("shareholders", shareholders);
                              }}
                              placeholder="0999123456"
                              data-testid={`input-shareholder-phone-${index}`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-2">
                            <Label>Enlace a cédula *</Label>
                            <Input
                              value={shareholder.idCardUrl || ""}
                              onChange={(e) => {
                                const shareholders = [...(formData.shareholders || [])];
                                shareholders[index].idCardUrl = e.target.value;
                                updateFormData("shareholders", shareholders);
                              }}
                              placeholder="https://drive.google.com/..."
                              data-testid={`input-shareholder-id-card-${index}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Enlace a papeleta de votación actualizada *</Label>
                            <Input
                              value={shareholder.votingCardUrl || ""}
                              onChange={(e) => {
                                const shareholders = [...(formData.shareholders || [])];
                                shareholders[index].votingCardUrl = e.target.value;
                                updateFormData("shareholders", shareholders);
                              }}
                              placeholder="https://drive.google.com/..."
                              data-testid={`input-shareholder-voting-card-${index}`}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Opciones de nombre para tu empresa (3 opciones en orden de preferencia)</Label>
              <Input
                value={formData.companyName1 || ""}
                onChange={(e) => updateFormData("companyName1", e.target.value)}
                placeholder="Primera opción"
                data-testid="input-company-name-1"
              />
              <Input
                value={formData.companyName2 || ""}
                onChange={(e) => updateFormData("companyName2", e.target.value)}
                placeholder="Segunda opción"
                data-testid="input-company-name-2"
              />
              <Input
                value={formData.companyName3 || ""}
                onChange={(e) => updateFormData("companyName3", e.target.value)}
                placeholder="Tercera opción"
                data-testid="input-company-name-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainActivity">Actividad económica principal *</Label>
              <Textarea
                id="mainActivity"
                value={formData.mainActivity || ""}
                onChange={(e) => updateFormData("mainActivity", e.target.value)}
                placeholder="Describe la actividad principal de tu empresa"
                rows={3}
                data-testid="textarea-main-activity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryActivities">Actividades secundarias (separadas por coma)</Label>
              <Input
                id="secondaryActivities"
                value={(formData.secondaryActivities || []).join(", ")}
                onChange={(e) => updateFormData("secondaryActivities", e.target.value.split(",").map((a: string) => a.trim()).filter((a: string) => a))}
                placeholder="Consultoría, Capacitación, Asesoría"
                data-testid="input-secondary-activities"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialCapital">Capital inicial (USD)</Label>
                <Input
                  id="initialCapital"
                  type="number"
                  value={formData.initialCapital || ""}
                  onChange={(e) => updateFormData("initialCapital", e.target.value)}
                  placeholder="400"
                  data-testid="input-initial-capital"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fiscalCity">Ciudad domicilio fiscal</Label>
                <Input
                  id="fiscalCity"
                  value={formData.fiscalCity || ""}
                  onChange={(e) => updateFormData("fiscalCity", e.target.value)}
                  placeholder="Quito"
                  data-testid="input-fiscal-city"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Distribución de acciones</Label>
                <Button
                  type="button"
                  onClick={() => {
                    const shares = formData.shareDistribution || [];
                    updateFormData("shareDistribution", [...shares, { name: "", shares: 0 }]);
                  }}
                  size="sm"
                  variant="outline"
                  data-testid="button-add-share"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar accionista
                </Button>
              </div>
              {(formData.shareDistribution || []).map((share: any, index: number) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs">Nombre del accionista</Label>
                    <Input
                      value={share.name || ""}
                      onChange={(e) => {
                        const shares = [...(formData.shareDistribution || [])];
                        shares[index].name = e.target.value;
                        updateFormData("shareDistribution", shares);
                      }}
                      placeholder="Nombre"
                      data-testid={`input-share-name-${index}`}
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label className="text-xs">Acciones</Label>
                    <Input
                      type="number"
                      value={share.shares || ""}
                      onChange={(e) => {
                        const shares = [...(formData.shareDistribution || [])];
                        shares[index].shares = parseInt(e.target.value) || 0;
                        updateFormData("shareDistribution", shares);
                      }}
                      placeholder="100"
                      data-testid={`input-share-amount-${index}`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const shares = [...(formData.shareDistribution || [])];
                      shares.splice(index, 1);
                      updateFormData("shareDistribution", shares);
                    }}
                    data-testid={`button-remove-share-${index}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiscalAddress">Dirección domicilio fiscal</Label>
              <Input
                id="fiscalAddress"
                value={formData.fiscalAddress || ""}
                onChange={(e) => updateFormData("fiscalAddress", e.target.value)}
                placeholder="Calle principal #123"
                data-testid="input-fiscal-address"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de administración</Label>
              <RadioGroup value={formData.administratorType || "single"} onValueChange={(value) => updateFormData("administratorType", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="admin-single" data-testid="radio-admin-single" />
                  <Label htmlFor="admin-single">Administrador único</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="joint" id="admin-joint" data-testid="radio-admin-joint" />
                  <Label htmlFor="admin-joint">Administración conjunta</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2 pt-4">
              <Label>¿Tendrás un representante legal externo?</Label>
              <RadioGroup value={formData.hasExternalRep ? "yes" : "no"} onValueChange={(value) => updateFormData("hasExternalRep", value === "yes")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="externalRep-yes" data-testid="radio-external-rep-yes" />
                  <Label htmlFor="externalRep-yes">Sí, contrataré un representante externo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="externalRep-no" data-testid="radio-external-rep-no" />
                  <Label htmlFor="externalRep-no">No, seré yo o uno de los accionistas</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.hasExternalRep && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-4">Datos del representante legal externo</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="externalRepName">Nombre completo</Label>
                        <Input
                          id="externalRepName"
                          value={formData.externalRepName || ""}
                          onChange={(e) => updateFormData("externalRepName", e.target.value)}
                          placeholder="Nombre del representante"
                          data-testid="input-external-rep-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="externalRepId">Cédula</Label>
                        <Input
                          id="externalRepId"
                          value={formData.externalRepId || ""}
                          onChange={(e) => updateFormData("externalRepId", e.target.value)}
                          placeholder="1234567890"
                          data-testid="input-external-rep-id"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="externalRepEmail">Email</Label>
                        <Input
                          id="externalRepEmail"
                          type="email"
                          value={formData.externalRepEmail || ""}
                          onChange={(e) => updateFormData("externalRepEmail", e.target.value)}
                          placeholder="representante@email.com"
                          data-testid="input-external-rep-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="externalRepPhone">Teléfono</Label>
                        <Input
                          id="externalRepPhone"
                          value={formData.externalRepPhone || ""}
                          onChange={(e) => updateFormData("externalRepPhone", e.target.value)}
                          placeholder="0999123456"
                          data-testid="input-external-rep-phone"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Nombre de marca comercial</Label>
              <Input
                id="brandName"
                value={formData.brandName || ""}
                onChange={(e) => updateFormData("brandName", e.target.value)}
                placeholder="Nombre con el que operarás comercialmente"
                data-testid="input-brand-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slogan">Slogan (opcional)</Label>
              <Input
                id="slogan"
                value={formData.slogan || ""}
                onChange={(e) => updateFormData("slogan", e.target.value)}
                placeholder="Tu frase distintiva"
                data-testid="input-slogan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandDescription">Descripción de tu marca</Label>
              <Textarea
                id="brandDescription"
                value={formData.brandDescription || ""}
                onChange={(e) => updateFormData("brandDescription", e.target.value)}
                placeholder="¿Qué hace tu marca? ¿Cuál es su propósito?"
                rows={4}
                data-testid="textarea-brand-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredColors">Colores preferidos (separados por coma)</Label>
              <Input
                id="preferredColors"
                value={(formData.preferredColors || []).join(", ")}
                onChange={(e) => updateFormData("preferredColors", e.target.value.split(",").map((c: string) => c.trim()).filter((c: string) => c))}
                placeholder="Azul, Verde, Blanco"
                data-testid="input-preferred-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredStyles">Estilos preferidos (separados por coma)</Label>
              <Input
                id="preferredStyles"
                value={(formData.preferredStyles || []).join(", ")}
                onChange={(e) => updateFormData("preferredStyles", e.target.value.split(",").map((s: string) => s.trim()).filter((s: string) => s))}
                placeholder="Moderno, Minimalista, Profesional"
                data-testid="input-preferred-styles"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalityWords">Palabras que describan la personalidad de tu marca (separadas por coma)</Label>
              <Input
                id="personalityWords"
                value={(formData.personalityWords || []).join(", ")}
                onChange={(e) => updateFormData("personalityWords", e.target.value.split(",").map((w: string) => w.trim()).filter((w: string) => w))}
                placeholder="Innovador, Confiable, Cercano"
                data-testid="input-personality-words"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredFonts">Fuentes tipográficas preferidas</Label>
              <Input
                id="preferredFonts"
                value={formData.preferredFonts || ""}
                onChange={(e) => updateFormData("preferredFonts", e.target.value)}
                placeholder="Montserrat, Roboto, Open Sans"
                data-testid="input-preferred-fonts"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visualReferences">Referencias visuales URLs (separadas por coma)</Label>
              <Textarea
                id="visualReferences"
                value={(formData.visualReferences || []).join(", ")}
                onChange={(e) => updateFormData("visualReferences", e.target.value.split(",").map((r: string) => r.trim()).filter((r: string) => r))}
                placeholder="https://pinterest.com/..., https://dribbble.com/..."
                rows={3}
                data-testid="textarea-visual-references"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="websiteObjectives">Objetivos del sitio web (separados por coma)</Label>
              <Input
                id="websiteObjectives"
                value={(formData.websiteObjectives || []).join(", ")}
                onChange={(e) => updateFormData("websiteObjectives", e.target.value.split(",").map((o: string) => o.trim()).filter((o: string) => o))}
                placeholder="Vender en línea, Captar clientes, Informar sobre servicios"
                data-testid="input-website-objectives"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desiredDomain">Dominio web deseado</Label>
              <Input
                id="desiredDomain"
                value={formData.desiredDomain || ""}
                onChange={(e) => updateFormData("desiredDomain", e.target.value)}
                placeholder="miempresa.com"
                data-testid="input-desired-domain"
              />
            </div>

            <div className="space-y-2">
              <Label>¿Ya tienes el dominio?</Label>
              <RadioGroup value={formData.hasDomain ? "yes" : "no"} onValueChange={(value) => updateFormData("hasDomain", value === "yes")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="hasDomain-yes" data-testid="radio-has-domain-yes" />
                  <Label htmlFor="hasDomain-yes">Sí, ya lo tengo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="hasDomain-no" data-testid="radio-has-domain-no" />
                  <Label htmlFor="hasDomain-no">No, necesito comprarlo</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="corporateEmail">Email corporativo deseado</Label>
              <Input
                id="corporateEmail"
                type="email"
                value={formData.corporateEmail || ""}
                onChange={(e) => updateFormData("corporateEmail", e.target.value)}
                placeholder="info@miempresa.com"
                data-testid="input-corporate-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="physicalAddress">Dirección física del negocio</Label>
              <Input
                id="physicalAddress"
                value={formData.physicalAddress || ""}
                onChange={(e) => updateFormData("physicalAddress", e.target.value)}
                placeholder="Dirección completa de tu negocio"
                data-testid="input-physical-address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aboutUsText">Texto "Acerca de nosotros"</Label>
              <Textarea
                id="aboutUsText"
                value={formData.aboutUsText || ""}
                onChange={(e) => updateFormData("aboutUsText", e.target.value)}
                placeholder="Historia y misión de tu empresa"
                rows={4}
                data-testid="textarea-about-us"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="servicesText">Descripción de servicios/productos</Label>
              <Textarea
                id="servicesText"
                value={formData.servicesText || ""}
                onChange={(e) => updateFormData("servicesText", e.target.value)}
                placeholder="¿Qué ofreces a tus clientes?"
                rows={4}
                data-testid="textarea-services"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessImages">URLs de imágenes del negocio (separadas por coma)</Label>
              <Textarea
                id="businessImages"
                value={(formData.businessImages || []).join(", ")}
                onChange={(e) => updateFormData("businessImages", e.target.value.split(",").map((i: string) => i.trim()).filter((i: string) => i))}
                placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                rows={3}
                data-testid="textarea-business-images"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label>Referencias de sitios web que te gusten (URLs)</Label>
              <Input
                value={formData.websiteReference1 || ""}
                onChange={(e) => updateFormData("websiteReference1", e.target.value)}
                placeholder="https://ejemplo1.com"
                data-testid="input-website-ref-1"
              />
              <Input
                value={formData.websiteReference2 || ""}
                onChange={(e) => updateFormData("websiteReference2", e.target.value)}
                placeholder="https://ejemplo2.com"
                data-testid="input-website-ref-2"
              />
              <Input
                value={formData.websiteReference3 || ""}
                onChange={(e) => updateFormData("websiteReference3", e.target.value)}
                placeholder="https://ejemplo3.com"
                data-testid="input-website-ref-3"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Información para la factura electrónica</p>
            
            <div className="space-y-2">
              <Label htmlFor="billingName">Nombre o razón social para factura *</Label>
              <Input
                id="billingName"
                value={formData.billingName || ""}
                onChange={(e) => updateFormData("billingName", e.target.value)}
                placeholder="Nombre completo o razón social"
                data-testid="input-billing-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingIdNumber">RUC o Cédula *</Label>
              <Input
                id="billingIdNumber"
                value={formData.billingIdNumber || ""}
                onChange={(e) => updateFormData("billingIdNumber", e.target.value)}
                placeholder="1234567890001"
                data-testid="input-billing-id"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingAddress">Dirección *</Label>
              <Input
                id="billingAddress"
                value={formData.billingAddress || ""}
                onChange={(e) => updateFormData("billingAddress", e.target.value)}
                placeholder="Dirección completa"
                data-testid="input-billing-address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingEmail">Email para recibir factura *</Label>
              <Input
                id="billingEmail"
                type="email"
                value={formData.billingEmail || ""}
                onChange={(e) => updateFormData("billingEmail", e.target.value)}
                placeholder="factura@email.com"
                data-testid="input-billing-email"
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Revisión final</h3>
              <p className="text-gray-600 dark:text-gray-400">Revisa tu información antes de continuar al pago</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Datos personales</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>Nombre:</strong> {formData.fullName}</p>
                  <p><strong>Cédula:</strong> {formData.idNumber}</p>
                  <p><strong>Email:</strong> {formData.personalEmail}</p>
                  <p><strong>Teléfono:</strong> {formData.phone}</p>
                  <p><strong>Dirección:</strong> {formData.address}</p>
                  <p><strong>Ubicación:</strong> {formData.province}, {formData.canton}</p>
                </CardContent>
              </Card>

              {formData.shareholders && formData.shareholders.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Accionistas</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    {formData.shareholders.map((shareholder: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary pl-3">
                        <p><strong>{shareholder.fullName}</strong></p>
                        <p>Participación: {shareholder.participation}%</p>
                        <p>Email: {shareholder.email}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Datos de empresa</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>Nombres opciones:</strong></p>
                  <p className="pl-4">1. {formData.companyName1}</p>
                  {formData.companyName2 && <p className="pl-4">2. {formData.companyName2}</p>}
                  {formData.companyName3 && <p className="pl-4">3. {formData.companyName3}</p>}
                  <p><strong>Actividad principal:</strong> {formData.mainActivity}</p>
                  {formData.secondaryActivities && formData.secondaryActivities.length > 0 && (
                    <p><strong>Actividades secundarias:</strong> {formData.secondaryActivities.join(", ")}</p>
                  )}
                  <p><strong>Capital inicial:</strong> ${formData.initialCapital}</p>
                  {formData.shareDistribution && formData.shareDistribution.length > 0 && (
                    <>
                      <p><strong>Distribución de acciones:</strong></p>
                      {formData.shareDistribution.map((share: any, idx: number) => (
                        <p key={idx} className="pl-4">{share.name}: {share.shares} acciones</p>
                      ))}
                    </>
                  )}
                  <p><strong>Domicilio fiscal:</strong> {formData.fiscalAddress}, {formData.fiscalCity}</p>
                  <p><strong>Tipo de administración:</strong> {formData.administratorType === "single" ? "Único" : "Conjunta"}</p>
                  {formData.hasExternalRep && (
                    <p><strong>Rep. legal externo:</strong> {formData.externalRepName}</p>
                  )}
                  {formData.utilityBillUrl ? (
                    <>
                      <p className="pt-2"><strong>Documentos:</strong></p>
                      <p className="pl-4 text-xs">✓ Pago de servicio básico</p>
                      {formData.shareholders && formData.shareholders.length > 0 && (
                        <p className="pl-4 text-xs">✓ {formData.shareholders.length} accionista(s) con documentos</p>
                      )}
                    </>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Marca e identidad</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>Marca comercial:</strong> {formData.brandName}</p>
                  {formData.slogan && <p><strong>Slogan:</strong> {formData.slogan}</p>}
                  {formData.preferredColors && formData.preferredColors.length > 0 && (
                    <p><strong>Colores:</strong> {formData.preferredColors.join(", ")}</p>
                  )}
                  {formData.preferredStyles && formData.preferredStyles.length > 0 && (
                    <p><strong>Estilos:</strong> {formData.preferredStyles.join(", ")}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sitio web</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  {formData.websiteObjectives && formData.websiteObjectives.length > 0 && (
                    <p><strong>Objetivos:</strong> {formData.websiteObjectives.join(", ")}</p>
                  )}
                  <p><strong>Dominio:</strong> {formData.desiredDomain}</p>
                  <p><strong>Email corporativo:</strong> {formData.corporateEmail}</p>
                  {formData.physicalAddress && (
                    <p><strong>Dirección física:</strong> {formData.physicalAddress}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Plan y facturación</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p className="text-lg font-bold text-primary">
                    Plan Launch - $1,499 + IVA
                  </p>
                  <p><strong>Facturación:</strong> {formData.billingName}</p>
                  <p><strong>RUC/Cédula:</strong> {formData.billingIdNumber}</p>
                  <p><strong>Email factura:</strong> {formData.billingEmail}</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Al completar este paso, podrás proceder al pago desde tu dashboard. Una vez confirmado el pago, comenzaremos a trabajar en tu empresa.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulario Launch</h1>
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
              {currentStep === 3 && "Documentación y Accionistas"}
              {currentStep === 4 && "Datos de la Compañía"}
              {currentStep === 5 && "Identidad Visual"}
              {currentStep === 6 && "Página Web"}
              {currentStep === 7 && "Facturación"}
              {currentStep === 8 && "Confirmación"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "¡Bienvenido al Plan Launch de Lo Simple!"}
              {currentStep > 1 && currentStep < 8 && "Completa la información requerida"}
              {currentStep === 8 && "Revisa tu información antes de continuar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px]">
              {renderStepContent()}
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
                disabled={saveMutation.isPending}
                data-testid="button-next"
              >
                {saveMutation.isPending ? "Guardando..." : currentStep === TOTAL_STEPS ? "Finalizar" : "Siguiente"}
                {currentStep < TOTAL_STEPS && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showIncompleteWarning} onOpenChange={setShowIncompleteWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Campos incompletos detectados
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Algunos campos importantes no han sido completados:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
                <p className="pt-2">
                  ¿Deseas completar estos campos ahora o continuar sin ellos? Puedes agregar la información más tarde desde tu dashboard.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-go-back">
              Volver a completar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowIncompleteWarning(false);
                completeForm();
              }}
              data-testid="button-continue-anyway"
            >
              Continuar sin completar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
