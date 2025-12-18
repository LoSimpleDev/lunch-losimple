import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CheckCircle, 
  Upload, 
  Download, 
  AlertTriangle, 
  ArrowLeft,
  Loader2,
  PlusCircle,
  Trash2,
  Shield,
  FileCheck,
  Users,
  Building2,
  ArrowRight,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

interface MultasReport {
  id: string;
  userId: string;
  companyName?: string;
  ruc?: string;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

interface Shareholder {
  fullName: string;
  idNumber: string;
}

export default function EmpezarCierre() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showDeclarationInfo, setShowDeclarationInfo] = useState(false);
  const [showShareholderForm, setShowShareholderForm] = useState(false);
  const [shareholders, setShareholders] = useState<Shareholder[]>([{ fullName: "", idNumber: "" }]);
  const [declarationGenerated, setDeclarationGenerated] = useState(false);
  const [signedDocumentUploaded, setSignedDocumentUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const { data: multasReports = [], isLoading } = useQuery<MultasReport[]>({
    queryKey: ["/api/multas/reports"],
  });

  const downloadedReport = multasReports.find(r => r.isPaid && r.status === 'downloaded');

  useEffect(() => {
    if (!isLoading && !downloadedReport) {
      setLocation('/dashboard');
    }
  }, [isLoading, downloadedReport, setLocation]);

  const handleVerifyReport = async () => {
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsVerified(true);
    setIsVerifying(false);
    toast({
      title: "Informe verificado",
      description: "El informe cumple con las condiciones para continuar con el cierre.",
    });
  };

  const handleAddShareholder = () => {
    setShareholders([...shareholders, { fullName: "", idNumber: "" }]);
  };

  const handleRemoveShareholder = (index: number) => {
    if (shareholders.length > 1) {
      setShareholders(shareholders.filter((_, i) => i !== index));
    }
  };

  const handleShareholderChange = (index: number, field: keyof Shareholder, value: string) => {
    const updated = [...shareholders];
    updated[index][field] = value;
    setShareholders(updated);
  };

  const handleGenerateDeclaration = () => {
    const allValid = shareholders.every(s => s.fullName.trim() && s.idNumber.trim());
    if (!allValid) {
      toast({
        title: "Datos incompletos",
        description: "Por favor complete todos los campos de los accionistas.",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date().toLocaleDateString('es-EC', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    const shareholdersList = shareholders.map(s => `${s.fullName} (C.I. ${s.idNumber})`).join(', ');
    
    const declarationContent = `
DECLARACIÓN JURAMENTADA PARA CIERRE DE SAS

Fecha: ${currentDate}

Los abajo firmantes, en calidad de accionistas de la empresa ${downloadedReport?.companyName || '[Nombre de la Empresa]'} con RUC ${downloadedReport?.ruc || '[RUC]'}, declaramos bajo juramento:

1. Que toda la información presentada por la empresa y sus representantes legales es correcta y veraz.

2. Que no existe ocultamiento de información para simular el cumplimiento de condiciones legales, tributarias o laborales.

3. Que aceptamos la responsabilidad total por cualquier consecuencia legal, administrativa o penal que pudiere derivarse de información falsa, omisión o engaño en esta declaración.

4. Que autorizamos a Lo Simple Ecuador S.A.S. a actuar como cesionarios de las acciones y a realizar todos los trámites necesarios para la liquidación y cierre de la empresa.

ACCIONISTAS DECLARANTES:
${shareholders.map((s, i) => `
${i + 1}. ${s.fullName}
   Cédula de Identidad: ${s.idNumber}
   Firma: ____________________________
`).join('\n')}

Esta declaración se realiza en ejercicio del derecho establecido en la Constitución de la República del Ecuador y bajo las penas previstas en el Código Orgánico Integral Penal para el caso de falsedad en declaraciones.
    `;

    const blob = new Blob([declarationContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'declaracion_juramentada.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDeclarationGenerated(true);
    setShowShareholderForm(false);
    
    toast({
      title: "Declaración generada",
      description: "Descargue el documento, fírmelo con firma electrónica y súbalo aquí.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setSignedDocumentUploaded(true);
      toast({
        title: "Documento cargado",
        description: "La declaración juramentada firmada ha sido cargada exitosamente.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5CE7]"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Empezar Cierre de Empresa | Lo Simple"
        description="Inicia el proceso de cierre de tu SAS de forma rápida y segura"
        canonical="/empezar-cierre"
        noindex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => setLocation('/dashboard')}
            className="mb-6 text-[#6C5CE7] hover:text-[#5a4bd1]"
            data-testid="button-back-dashboard"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Empezar Cierre de Empresa
            </h1>
            <p className="text-muted-foreground">
              Complete los siguientes pasos para iniciar el proceso de cierre
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-purple-100 dark:border-purple-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#6C5CE7]" />
                  Paso 1: Informe de Multas
                </CardTitle>
                <CardDescription>
                  Verificación del informe de multas descargado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="font-medium">Informe de Multas</p>
                      <p className="text-sm text-muted-foreground">
                        {downloadedReport?.companyName || 'Empresa'} - Pagado y Descargado
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isVerified ? (
                      <Badge className="bg-green-500">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verificado
                      </Badge>
                    ) : (
                      <Button
                        onClick={handleVerifyReport}
                        disabled={isVerifying}
                        className="bg-[#6C5CE7] hover:bg-[#5a4bd1]"
                        data-testid="button-verify-report"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verificando...
                          </>
                        ) : (
                          "Revisar"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-purple-100 dark:border-purple-900 ${!isVerified ? 'opacity-60' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#6C5CE7]" />
                  Paso 2: Declaración Juramentada
                </CardTitle>
                <CardDescription>
                  Documento legal requerido para el proceso de cierre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-[#6C5CE7]" />
                    <div>
                      <p className="font-medium">Declaración Juramentada</p>
                      <p className="text-sm text-muted-foreground">
                        Documento que certifica la veracidad de la información
                      </p>
                    </div>
                  </div>
                  {!declarationGenerated ? (
                    <Button
                      onClick={() => setShowDeclarationInfo(true)}
                      disabled={!isVerified}
                      className="bg-[#6C5CE7] hover:bg-[#5a4bd1]"
                      data-testid="button-generate-declaration"
                    >
                      Generar Declaración
                    </Button>
                  ) : (
                    <Badge className="bg-green-500">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Generada
                    </Badge>
                  )}
                </div>

                {declarationGenerated && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                    <div className="text-center">
                      {signedDocumentUploaded ? (
                        <div className="space-y-2">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                          <p className="font-medium text-green-600">Documento firmado cargado</p>
                          <p className="text-sm text-muted-foreground">{uploadedFileName}</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="font-medium mb-2">Subir declaración firmada</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Descargue la declaración, fírmela con su firma electrónica y súbala aquí
                          </p>
                          <label className="cursor-pointer">
                            <Input
                              type="file"
                              accept=".pdf,.p7m"
                              className="hidden"
                              onChange={handleFileUpload}
                              data-testid="input-upload-signed"
                            />
                            <Button variant="outline" className="pointer-events-none">
                              <Upload className="w-4 h-4 mr-2" />
                              Seleccionar archivo
                            </Button>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-[#FFEAA7] bg-gradient-to-r from-[#FFEAA7]/10 to-[#FFEAA7]/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#6C5CE7]" />
                  Cómo funciona el Servicio Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Este <strong>no</strong> es un servicio para quien quiere complicarse o pasar meses (incluso años) 
                  cerrando una empresa. Es un servicio para alguien que quiere <strong>cerrar un capítulo</strong> y 
                  continuar con su siguiente negocio o trabajo.
                </p>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-[#6C5CE7]">Lo que hacemos:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Nos aseguramos que <strong>no tenga riesgos altos</strong> y que la empresa esté al día</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
                      <span>Realizamos una <strong>cesión de acciones</strong> a nuestro nombre</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Building2 className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
                      <span>Ejecutamos el <strong>cambio de representante legal</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
                      <span>Una vez hecho esto, los accionistas pueden <strong>olvidarse del problema</strong></span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#6C5CE7]/10 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="w-6 h-6 text-[#6C5CE7] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#6C5CE7]">Cero riesgo de lado y lado</p>
                    <p className="text-sm text-muted-foreground">
                      La empresa pasa a nuestro nombre para que la liquidemos nosotros. 
                      Usted se libera de la carga administrativa y legal.
                    </p>
                  </div>
                </div>

                {signedDocumentUploaded && (
                  <Button 
                    className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] h-12 text-lg"
                    onClick={() => {
                      toast({
                        title: "Solicitud enviada",
                        description: "Nuestro equipo revisará su documentación y se pondrá en contacto pronto.",
                      });
                      setTimeout(() => setLocation('/dashboard'), 2000);
                    }}
                    data-testid="button-submit-closing"
                  >
                    Continuar con el Cierre
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showDeclarationInfo} onOpenChange={setShowDeclarationInfo}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Declaración Juramentada
            </DialogTitle>
            <DialogDescription>
              Información importante antes de continuar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                Para efectos de este trámite requerimos una <strong>declaración juramentada</strong> que certifique:
              </p>
            </div>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#6C5CE7] font-bold">•</span>
                Que toda la información presentada por la empresa y sus representantes es correcta
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6C5CE7] font-bold">•</span>
                Que no hay ocultamiento de información para simular el cumplimiento de condiciones
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6C5CE7] font-bold">•</span>
                Que los declarantes se harán cargo de cualquier consecuencia penal en caso de engaño u ocultamiento
              </li>
            </ul>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm">
              <p className="text-muted-foreground">
                Al continuar, usted acepta generar este documento que deberá ser firmado 
                electrónicamente por todos los accionistas de la empresa.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeclarationInfo(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#6C5CE7] hover:bg-[#5a4bd1]"
              onClick={() => {
                setShowDeclarationInfo(false);
                setShowShareholderForm(true);
              }}
              data-testid="button-continue-declaration"
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showShareholderForm} onOpenChange={setShowShareholderForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#6C5CE7]" />
              Datos de los Accionistas
            </DialogTitle>
            <DialogDescription>
              Ingrese los nombres completos y números de cédula de todos los accionistas
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {shareholders.map((shareholder, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Accionista {index + 1}</Label>
                  {shareholders.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveShareholder(index)}
                      className="text-red-500 hover:text-red-700"
                      data-testid={`button-remove-shareholder-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Nombres completos</Label>
                  <Input
                    id={`name-${index}`}
                    value={shareholder.fullName}
                    onChange={(e) => handleShareholderChange(index, 'fullName', e.target.value)}
                    placeholder="Juan Carlos Pérez García"
                    data-testid={`input-shareholder-name-${index}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`id-${index}`}>Número de cédula</Label>
                  <Input
                    id={`id-${index}`}
                    value={shareholder.idNumber}
                    onChange={(e) => handleShareholderChange(index, 'idNumber', e.target.value)}
                    placeholder="1712345678"
                    data-testid={`input-shareholder-id-${index}`}
                  />
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={handleAddShareholder}
              className="w-full"
              data-testid="button-add-shareholder"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Agregar otro accionista
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareholderForm(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#6C5CE7] hover:bg-[#5a4bd1]"
              onClick={handleGenerateDeclaration}
              data-testid="button-download-declaration"
            >
              <Download className="w-4 h-4 mr-2" />
              Generar y Descargar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
