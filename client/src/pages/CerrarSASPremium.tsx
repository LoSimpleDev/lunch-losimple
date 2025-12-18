import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  Upload,
  FileText,
  Lock,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Calendar
} from "lucide-react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useToast } from "@/hooks/use-toast";

const requisitosDocumentos = [
  {
    id: "supercias",
    name: "Certificado de no adeudar a la Superintendencia de Compañías",
    description: "Emitido por la Superintendencia de Compañías, Valores y Seguros"
  },
  {
    id: "sercop",
    name: "Certificado de no ser contratista incumplido",
    description: "Emitido por el SERCOP"
  },
  {
    id: "iess",
    name: "Certificado de no adeudar al IESS",
    description: "Emitido por el Instituto Ecuatoriano de Seguridad Social"
  },
  {
    id: "terceros",
    name: "Declaración juramentada de no adeudar a terceros",
    description: "Documento notariado firmado por el representante legal"
  },
  {
    id: "sri",
    name: "Certificado de no adeudar al SRI",
    description: "Emitido por el Servicio de Rentas Internas"
  }
];

const requisitosLegales = [
  "La empresa no debe tener operaciones activas",
  "No debe existir litigios pendientes",
  "Los socios deben estar de acuerdo en la disolución",
  "El balance final debe reflejar pasivos en cero"
];

export default function CerrarSASPremium() {
  const { toast } = useToast();
  const [files, setFiles] = useState<Record<string, File | null>>({
    supercias: null,
    sercop: null,
    iess: null,
    terceros: null,
    sri: null
  });
  const [loSimpleCertificate, setLoSimpleCertificate] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingLeft, setIsSubmittingLeft] = useState(false);

  const handleFileChange = (id: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [id]: file }));
  };

  const allFilesUploaded = Object.values(files).every(file => file !== null);
  const hasLoSimpleCertificate = loSimpleCertificate !== null;

  const handleSubmitRight = async () => {
    if (!allFilesUploaded) {
      toast({
        title: "Documentos incompletos",
        description: "Por favor, sube todos los documentos requeridos.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Documentos recibidos",
        description: "Hemos recibido tus documentos. Te contactaremos pronto para continuar con el proceso.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleSubmitLeft = async () => {
    if (!hasLoSimpleCertificate) {
      toast({
        title: "Certificado requerido",
        description: "Por favor, sube el certificado Lo Simple.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingLeft(true);
    
    setTimeout(() => {
      toast({
        title: "Certificado recibido",
        description: "Hemos recibido tu certificado Lo Simple. Te contactaremos pronto para continuar con el proceso.",
      });
      setIsSubmittingLeft(false);
    }, 1500);
  };

  return (
    <>
      <SEO 
        title="Proceso Premium de Cierre SAS | Lo Simple"
        description="Inicia el proceso premium de cierre de tu empresa SAS en Ecuador. Sube la documentación requerida y cierra tu empresa en 4 días."
        canonical="/cerrar-sas-premium"
        keywords="cerrar SAS premium, cierre rápido SAS Ecuador, documentos cierre empresa"
        noindex={true}
      />

      <div className="min-h-screen bg-background">
        <section className="py-12 lg:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <Breadcrumbs 
              items={[
                { label: "Servicios", href: "/#services" },
                { label: "Cerrar SAS", href: "/cerrar-sas" },
                { label: "Proceso Premium" }
              ]}
              className="mb-6"
            />

            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Proceso Premium de Cierre SAS
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Con nuestra asesoría especializada, tu preocupación por la empresa que ya no quieres tener puede terminar en tan solo 4 días hábiles.
              </p>
            </div>

            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-950/30 dark:to-cyan-950/30 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Requisitos para el Proceso Premium
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {requisitosLegales.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-2 border-dashed border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50/50 to-cyan-50/50 dark:from-purple-950/20 dark:to-cyan-950/20">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                      <Lock className="h-8 w-8 text-[#6C5CE7]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        ¿No tienes estos documentos?
                      </h3>
                      <p className="text-muted-foreground">
                        Te ayudamos a verificar el estado de tu empresa
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Para consultar el estado de tu empresa en el SRI, IESS, Superintendencia de Compañías y otras instituciones que requieren credenciales, crea una cuenta gratuita en nuestra plataforma.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      <FileText className="h-4 w-4" />
                      Estado SRI
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      <FileText className="h-4 w-4" />
                      Aportes IESS
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      <FileText className="h-4 w-4" />
                      Superintendencia
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      <FileText className="h-4 w-4" />
                      SERCOP
                    </span>
                  </div>

                  <Link href="/login">
                    <Button 
                      size="lg"
                      className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white font-semibold h-14 text-lg"
                      data-testid="button-register-empresa"
                    >
                      Registrar mi empresa
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Esta es una verificación preliminar basada en información pública disponible. Para un análisis completo y actualizado, te recomendamos crear una cuenta.
                  </p>

                  <div className="mt-8 pt-6 border-t border-purple-200 dark:border-purple-700">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#6C5CE7]" />
                      ¿Ya tienes el certificado Lo Simple?
                    </h4>
                    
                    <div className="space-y-3">
                      <Label htmlFor="losimple-cert" className="text-sm font-medium flex items-start gap-2">
                        {loSimpleCertificate ? (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span>Certificado Lo Simple</span>
                      </Label>
                      <Input
                        id="losimple-cert"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setLoSimpleCertificate(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                        data-testid="input-file-losimple-cert"
                      />
                      <p className="text-xs text-muted-foreground">El certificado emitido por nuestra plataforma que confirma que cumples todos los requisitos</p>
                    </div>

                    <Button 
                      size="lg"
                      className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold h-14 text-lg"
                      onClick={handleSubmitLeft}
                      disabled={!hasLoSimpleCertificate || isSubmittingLeft}
                      data-testid="button-submit-losimple-cert"
                    >
                      {isSubmittingLeft ? (
                        "Enviando..."
                      ) : (
                        <>
                          Iniciar Proceso de Cierre
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Upload className="h-6 w-6 text-[#6C5CE7]" />
                    <h3 className="text-xl font-bold">Carga tu Documentación</h3>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Si ya tienes los certificados, súbelos aquí para iniciar el proceso de cierre:
                  </p>

                  <div className="space-y-4">
                    {requisitosDocumentos.map((doc) => (
                      <div key={doc.id} className="space-y-2">
                        <Label htmlFor={doc.id} className="text-sm font-medium flex items-start gap-2">
                          {files[doc.id] ? (
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          )}
                          <span>{doc.name}</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id={doc.id}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(doc.id, e.target.files?.[0] || null)}
                            className="cursor-pointer"
                            data-testid={`input-file-${doc.id}`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{doc.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        Documentos cargados: {Object.values(files).filter(f => f !== null).length} de {requisitosDocumentos.length}
                      </span>
                      {allFilesUploaded && (
                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Completo
                        </span>
                      )}
                    </div>

                    <Button 
                      size="lg"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-14 text-lg"
                      onClick={handleSubmitRight}
                      disabled={!allFilesUploaded || isSubmitting}
                      data-testid="button-submit-documents"
                    >
                      {isSubmitting ? (
                        "Enviando..."
                      ) : (
                        <>
                          Iniciar Proceso de Cierre
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    {!allFilesUploaded && (
                      <p className="text-xs text-amber-600 text-center mt-3 flex items-center justify-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Sube todos los documentos para continuar
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                ¿No cumples con los requisitos?
              </p>
              <Link href="/preparar-cierre-sas">
                <Button variant="outline" data-testid="button-agenda-cita">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agenda una cita
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
