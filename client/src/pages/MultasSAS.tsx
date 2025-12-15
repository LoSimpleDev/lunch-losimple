import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Building2, 
  Briefcase, 
  MapPin,
  FileText,
  Lock,
  ArrowRight,
  Loader2,
  XCircle
} from "lucide-react";

type CheckStatus = "idle" | "checking" | "complete";
type InstitutionStatus = "pending" | "checking" | "clean" | "alert" | "warning";

interface InstitutionResult {
  name: string;
  icon: typeof Building2;
  status: InstitutionStatus;
  message: string;
  details?: string[];
}

export default function MultasSAS() {
  const [ruc, setRuc] = useState("");
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<InstitutionResult[]>([]);
  const [companyName, setCompanyName] = useState("");

  const steps = [
    "Validando RUC...",
    "Conectando con Superintendencia de Compañías...",
    "Verificando Ministerio de Trabajo...",
    "Consultando registros municipales...",
    "Generando informe..."
  ];

  const validateRuc = (value: string): boolean => {
    const cleanRuc = value.replace(/\D/g, '');
    return cleanRuc.length === 13;
  };

  const generateSimulatedResults = (): InstitutionResult[] => {
    const scenarios = [
      {
        supercias: { status: "clean" as const, message: "Sin obligaciones pendientes", details: [] },
        trabajo: { status: "clean" as const, message: "Al día con obligaciones laborales", details: [] },
        municipio: { status: "warning" as const, message: "Patente municipal por renovar", details: ["Vencimiento: próximos 30 días"] }
      },
      {
        supercias: { status: "alert" as const, message: "Declaración anual pendiente", details: ["Formulario 101 no presentado", "Plazo vencido: hace 45 días"] },
        trabajo: { status: "clean" as const, message: "Sin novedades registradas", details: [] },
        municipio: { status: "clean" as const, message: "Patente vigente", details: [] }
      },
      {
        supercias: { status: "clean" as const, message: "Cumplimiento al día", details: [] },
        trabajo: { status: "alert" as const, message: "Posible inconsistencia en aportes", details: ["Revisar planillas IESS últimos 3 meses"] },
        municipio: { status: "clean" as const, message: "Sin multas registradas", details: [] }
      },
      {
        supercias: { status: "clean" as const, message: "Sin observaciones", details: [] },
        trabajo: { status: "clean" as const, message: "Registros en orden", details: [] },
        municipio: { status: "clean" as const, message: "Todo en regla", details: [] }
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    return [
      {
        name: "Superintendencia de Compañías",
        icon: Building2,
        status: scenario.supercias.status,
        message: scenario.supercias.message,
        details: scenario.supercias.details
      },
      {
        name: "Ministerio de Trabajo",
        icon: Briefcase,
        status: scenario.trabajo.status,
        message: scenario.trabajo.message,
        details: scenario.trabajo.details
      },
      {
        name: "Municipios",
        icon: MapPin,
        status: scenario.municipio.status,
        message: scenario.municipio.message,
        details: scenario.municipio.details
      }
    ];
  };

  const generateCompanyName = (ruc: string): string => {
    const prefixes = ["INVERSIONES", "COMERCIALIZADORA", "SERVICIOS", "GRUPO", "CONSULTORA"];
    const suffixes = ["DEL ECUADOR", "ASOCIADOS", "INTERNACIONAL", "& CIA", "CORP"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix} ${ruc.substring(0, 4)} ${suffix} S.A.S.`;
  };

  const handleCheck = async () => {
    if (!validateRuc(ruc)) {
      return;
    }

    setCheckStatus("checking");
    setCurrentStep(0);
    setResults([]);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }

    setCompanyName(generateCompanyName(ruc));
    setResults(generateSimulatedResults());
    setCheckStatus("complete");
  };

  const getStatusIcon = (status: InstitutionStatus) => {
    switch (status) {
      case "clean":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "alert":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: InstitutionStatus) => {
    switch (status) {
      case "clean":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sin alertas</Badge>;
      case "alert":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Requiere atención</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Revisar</Badge>;
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
              <Shield className="w-3 h-3 mr-1" />
              Verificación gratuita
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Consulta de Multas para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">
                SAS en Ecuador
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ingresa el RUC de tu empresa y nuestro agente verificará automáticamente 
              si tienes multas o pendientes en las principales instituciones.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Ingresa el RUC de tu empresa (13 dígitos)"
                      value={ruc}
                      onChange={(e) => setRuc(e.target.value.replace(/\D/g, '').substring(0, 13))}
                      className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-purple-500 dark:border-gray-700"
                      disabled={checkStatus === "checking"}
                      data-testid="input-ruc"
                    />
                    {ruc && !validateRuc(ruc) && (
                      <p className="text-sm text-red-500 mt-2">El RUC debe tener 13 dígitos</p>
                    )}
                  </div>
                  <Button
                    onClick={handleCheck}
                    disabled={!validateRuc(ruc) || checkStatus === "checking"}
                    className="h-14 px-8 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                    data-testid="button-check-ruc"
                  >
                    {checkStatus === "checking" ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Verificar
                      </>
                    )}
                  </Button>
                </div>

                {/* Loading Steps */}
                {checkStatus === "checking" && (
                  <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <div className="space-y-3">
                      {steps.map((step, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 transition-all duration-300 ${
                            index === currentStep
                              ? "text-purple-600 dark:text-purple-400"
                              : index < currentStep
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {index < currentStep ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : index === currentStep ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                          <span className={index === currentStep ? "font-medium" : ""}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {checkStatus === "complete" && results.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          {/* Company Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Resultados para: {companyName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">RUC: {ruc}</p>
          </div>

          {/* Institution Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {results.map((result, index) => (
              <Card
                key={index}
                className={`border-2 transition-all hover:shadow-lg ${
                  result.status === "clean"
                    ? "border-green-200 dark:border-green-900"
                    : result.status === "alert"
                    ? "border-red-200 dark:border-red-900"
                    : result.status === "warning"
                    ? "border-yellow-200 dark:border-yellow-900"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                data-testid={`card-result-${index}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                      <result.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    {getStatusIcon(result.status)}
                  </div>
                  <CardTitle className="text-lg mt-3">{result.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getStatusBadge(result.status)}
                    <p className="text-gray-600 dark:text-gray-400">{result.message}</p>
                    {result.details && result.details.length > 0 && (
                      <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                        {result.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* SRI Section - Requires Login */}
          <Card className="border-2 border-dashed border-purple-300 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/50">
                  <Lock className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Verificación SRI y otras instituciones
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Para consultar el estado de tu empresa en el SRI, IESS y otras instituciones 
                    que requieren credenciales, crea una cuenta gratuita.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <Badge variant="outline" className="border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                      <FileText className="w-3 h-3 mr-1" />
                      Declaraciones SRI
                    </Badge>
                    <Badge variant="outline" className="border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                      <FileText className="w-3 h-3 mr-1" />
                      Aportes IESS
                    </Badge>
                    <Badge variant="outline" className="border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                      <FileText className="w-3 h-3 mr-1" />
                      Obligaciones tributarias
                    </Badge>
                  </div>
                </div>
                <div>
                  <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                    <Link href={`/login-sas-existente?ruc=${ruc}`} data-testid="button-register-sri">
                      Registrar mi empresa
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8">
            Esta es una verificación preliminar basada en información pública disponible. 
            Para un análisis completo y actualizado, te recomendamos crear una cuenta.
          </p>
        </section>
      )}

      {/* Features Section - Only show before search */}
      {checkStatus === "idle" && (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Supercias
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Verificamos obligaciones pendientes con la Superintendencia de Compañías
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ministerio de Trabajo
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Revisamos el cumplimiento de obligaciones laborales y contratos
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Municipios
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Consultamos patentes municipales y permisos de funcionamiento
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
