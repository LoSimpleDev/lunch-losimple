import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Building2, 
  FileText, 
  Shield, 
  Search, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  Lock,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface MultasReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  ruc?: string;
  canton?: string;
}

interface ValidationStatus {
  supercias: 'pending' | 'validating' | 'validated' | 'error';
  sri: 'pending' | 'validating' | 'validated' | 'error';
  iess: 'pending' | 'validating' | 'validated' | 'error';
  municipio: 'pending' | 'validating' | 'validated' | 'error';
  sercop: 'pending' | 'validating' | 'validated' | 'error';
  minTrabajo: 'pending' | 'validating' | 'validated' | 'error';
}

interface MultasReport {
  id: string;
  userId: string;
  companyName?: string;
  ruc?: string;
  status: string;
  validationStatus: ValidationStatus;
  reportUrl?: string;
  isPaid: boolean;
  createdAt: string;
}

const institutions = [
  { key: 'supercias', name: 'Superintendencia de Compañías', icon: Building2 },
  { key: 'sri', name: 'SRI (Servicio de Rentas Internas)', icon: FileText },
  { key: 'iess', name: 'IESS (Seguro Social)', icon: Shield },
  { key: 'municipio', name: 'Municipio', icon: Building2 },
  { key: 'sercop', name: 'SERCOP', icon: Search },
  { key: 'minTrabajo', name: 'Ministerio del Trabajo', icon: FileText },
];

export default function MultasReportModal({ isOpen, onClose, companyName, ruc, canton }: MultasReportModalProps) {
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({
    sri: { username: '', password: '' },
    municipio: { username: '', password: '' },
    iess: { username: '', password: '' }
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [saveCredentials, setSaveCredentials] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    sri: false,
    municipio: false,
    iess: false
  });
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);

  const { data: currentReport, refetch: refetchReport } = useQuery<MultasReport>({
    queryKey: ['/api/multas/reports', currentReportId],
    enabled: !!currentReportId && step === 3,
    refetchInterval: step === 3 ? 2000 : false, // Poll every 2 seconds while on step 3
  });

  const createReportMutation = useMutation({
    mutationFn: async () => {
      const credentialsArray = [
        { institution: 'sri', username: credentials.sri.username, password: credentials.sri.password },
        { institution: 'municipio', username: credentials.municipio.username, password: credentials.municipio.password, canton },
        { institution: 'iess', username: credentials.iess.username, password: credentials.iess.password }
      ];

      const response = await apiRequest('POST', '/api/multas/reports', {
        companyName,
        ruc,
        credentials: credentialsArray,
        saveCredentials
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentReportId(data.id);
      setStep(3);
      queryClient.invalidateQueries({ queryKey: ['/api/multas/reports'] });
    }
  });

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setStep(1);
      setCredentials({
        sri: { username: '', password: '' },
        municipio: { username: '', password: '' },
        iess: { username: '', password: '' }
      });
      setAcceptTerms(false);
      setSaveCredentials(false);
      setCurrentReportId(null);
    }
  }, [isOpen]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'validating':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const allValidated = currentReport?.validationStatus && 
    Object.values(currentReport.validationStatus).every(s => s === 'validated');

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-6 h-6 text-purple-600" />
            Generar Informe de Multas
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Información sobre el proceso de consulta"}
            {step === 2 && "Ingresa tus credenciales institucionales"}
            {step === 3 && "Validando credenciales y generando informe"}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 ${step > s ? 'bg-purple-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">¿Qué consultamos?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Realizamos una búsqueda exhaustiva en las siguientes instituciones para verificar multas, 
                obligaciones pendientes y alertas de cumplimiento próximo:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {institutions.map((inst) => (
                  <div key={inst.key} className="flex items-center gap-2 text-sm">
                    <inst.icon className="w-4 h-4 text-purple-600" />
                    <span>{inst.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Además investigamos
              </h3>
              <p className="text-sm text-muted-foreground">
                Si tu empresa está próxima a incumplir alguna obligación fiscal, tributaria o laboral.
                Recibirás alertas preventivas para que puedas tomar acción a tiempo.
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} className="bg-purple-600 hover:bg-purple-700" data-testid="button-continue-step1">
                Continuar
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Credentials */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-4">
              <p className="text-sm">
                <strong>Importante:</strong> Para consultar tus obligaciones necesitamos las credenciales 
                de acceso a las siguientes instituciones. Los datos serán almacenados de forma encriptada 
                y segura, utilizados únicamente para la consulta solicitada.
              </p>
            </div>

            {/* SRI Credentials */}
            <div className="space-y-3 p-4 border rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                SRI (Servicio de Rentas Internas)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sri-user">Usuario / RUC</Label>
                  <Input
                    id="sri-user"
                    value={credentials.sri.username}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      sri: { ...prev.sri, username: e.target.value }
                    }))}
                    placeholder="Ingresa tu RUC"
                    data-testid="input-sri-username"
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="sri-pass">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="sri-pass"
                      type={showPasswords.sri ? "text" : "password"}
                      value={credentials.sri.password}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        sri: { ...prev.sri, password: e.target.value }
                      }))}
                      placeholder="Contraseña SRI"
                      className="pr-10"
                      data-testid="input-sri-password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords(prev => ({ ...prev, sri: !prev.sri }))}
                    >
                      {showPasswords.sri ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Municipio Credentials */}
            <div className="space-y-3 p-4 border rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Municipio de {canton || 'tu cantón'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="muni-user">Usuario</Label>
                  <Input
                    id="muni-user"
                    value={credentials.municipio.username}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      municipio: { ...prev.municipio, username: e.target.value }
                    }))}
                    placeholder="Usuario municipal"
                    data-testid="input-municipio-username"
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="muni-pass">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="muni-pass"
                      type={showPasswords.municipio ? "text" : "password"}
                      value={credentials.municipio.password}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        municipio: { ...prev.municipio, password: e.target.value }
                      }))}
                      placeholder="Contraseña municipal"
                      className="pr-10"
                      data-testid="input-municipio-password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords(prev => ({ ...prev, municipio: !prev.municipio }))}
                    >
                      {showPasswords.municipio ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* IESS Credentials */}
            <div className="space-y-3 p-4 border rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                IESS (Instituto Ecuatoriano de Seguridad Social)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="iess-user">Usuario / Cédula</Label>
                  <Input
                    id="iess-user"
                    value={credentials.iess.username}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      iess: { ...prev.iess, username: e.target.value }
                    }))}
                    placeholder="Cédula o RUC"
                    data-testid="input-iess-username"
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="iess-pass">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="iess-pass"
                      type={showPasswords.iess ? "text" : "password"}
                      value={credentials.iess.password}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        iess: { ...prev.iess, password: e.target.value }
                      }))}
                      placeholder="Contraseña IESS"
                      className="pr-10"
                      data-testid="input-iess-password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords(prev => ({ ...prev, iess: !prev.iess }))}
                    >
                      {showPasswords.iess ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security notice and checkboxes */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Tus contraseñas serán almacenadas de forma <strong>encriptada y anónima</strong>. 
                  Solo se utilizarán para realizar la consulta solicitada.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox 
                  id="accept-terms" 
                  checked={acceptTerms} 
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  data-testid="checkbox-accept-terms"
                />
                <Label htmlFor="accept-terms" className="text-sm">
                  Acepto que mis credenciales sean utilizadas para realizar esta consulta
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox 
                  id="save-credentials" 
                  checked={saveCredentials} 
                  onCheckedChange={(checked) => setSaveCredentials(checked === true)}
                  data-testid="checkbox-save-credentials"
                />
                <Label htmlFor="save-credentials" className="text-sm">
                  Guardar credenciales para futuras consultas (opcional)
                </Label>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} data-testid="button-back-step2">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button 
                onClick={() => createReportMutation.mutate()}
                disabled={!acceptTerms || createReportMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
                data-testid="button-submit-credentials"
              >
                {createReportMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Generar Informe
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Validation in progress */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Validando credenciales</h3>
              <p className="text-sm text-muted-foreground">
                Estamos verificando tus credenciales en cada institución. 
                Si son válidas, podrás revisar tu informe en el área de <strong>Mis Documentos</strong> 
                del perfil de empresa en aproximadamente 10 minutos.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Estado de validación:</h4>
              {institutions.map((inst) => {
                const status = currentReport?.validationStatus?.[inst.key as keyof ValidationStatus] || 'pending';
                return (
                  <div 
                    key={inst.key} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                    data-testid={`validation-status-${inst.key}`}
                  >
                    <div className="flex items-center gap-3">
                      <inst.icon className="w-5 h-5 text-gray-500" />
                      <span>{inst.name}</span>
                    </div>
                    {getStatusIcon(status)}
                  </div>
                );
              })}
            </div>

            {allValidated && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">¡Validación completada!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tu informe ha sido generado exitosamente. Puedes encontrarlo en la sección 
                  "Mis Documentos" del perfil de empresa.
                </p>
                <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700" data-testid="button-close-modal">
                  Ir a Mis Documentos
                </Button>
              </div>
            )}

            {!allValidated && (
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleClose} data-testid="button-close-processing">
                  Cerrar y continuar en segundo plano
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
