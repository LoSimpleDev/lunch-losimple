import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageCircle, CheckCircle, AlertCircle, Building2 } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";
import veronicaUrl from "@assets/accounting_simple_1765904253176.png";
import { SEO } from "@/components/SEO";

export default function CotizarCreacionSAS() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    whatsapp: "",
    decision: "decidido"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.whatsapp) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/contact/cotizar-sas", formData);
      
      toast({
        title: "Mensaje enviado",
        description: "Te redirigiremos a WhatsApp para continuar la conversación"
      });

      const decisionText = formData.decision === "decidido" 
        ? "Estoy decidido y quiero crear mi SAS" 
        : "Solo quiero información por ahora";
      
      const mensaje = encodeURIComponent(
        `Hola Dra. Verónica, vengo de la página de cotización de creación de SAS.\n\n` +
        `*Nombre:* ${formData.nombre}\n` +
        `*Email:* ${formData.email}\n` +
        `*WhatsApp:* ${formData.whatsapp}\n` +
        `*Estado:* ${decisionText}\n\n` +
        `Quiero recibir información sobre cómo constituir mi empresa SAS en Ecuador.`
      );

      setTimeout(() => {
        window.open(`https://wa.me/593958613237?text=${mensaje}`, '_blank');
      }, 1500);

    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el formulario. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Cotización Creación SAS Ecuador | Lo Simple"
        description="Solicita tu cotización para crear una empresa SAS en Ecuador. Constitución en 5 días, desde $1 de capital, 100% digital."
        canonical="/cotizar-creacion-sas"
        keywords="cotización SAS Ecuador, crear empresa Ecuador, constituir SAS, emprender Ecuador"
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <Link href="/">
            <div className="mb-8 flex justify-center cursor-pointer">
              <img 
                src={logoUrl} 
                alt="Lo Simple" 
                className="h-12 md:h-16 w-auto"
                data-testid="img-logo-cotizar-sas"
              />
            </div>
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Cotización para crear tu empresa SAS
            </h1>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-500 shadow-lg">
              <img 
                src={veronicaUrl} 
                alt="Dra. Verónica" 
                className="w-full h-full object-cover"
                data-testid="img-asesora-cotizar"
              />
            </div>
          </div>

          <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Hola, soy la <strong>Dra. Verónica</strong>, asesora legal en Lo Simple. 
            ¿Sabías que en Ecuador ya van constituidas más de <strong>75.000 SAS</strong>? 
            Tú también puedes tener tu empresa legal desde <strong>$1 de capital</strong>, 
            sin notarios y en solo <strong>5 días</strong>. Completa el formulario y te envío la cotización.
          </p>

          <Card className="shadow-xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-base">
                    Nombre completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    placeholder="Ejemplo: Juan Pérez"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="h-12"
                    data-testid="input-nombre-cotizar"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">
                      Correo electrónico <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Ej.: john@doe.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12"
                      data-testid="input-email-cotizar"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-base">
                      WhatsApp <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="Ej. 0990446644"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="h-12"
                      data-testid="input-whatsapp-cotizar"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base">
                    ¿Listo para emprender? <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.decision}
                    onValueChange={(value) => setFormData({ ...formData, decision: value })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <RadioGroupItem value="decidido" id="decidido" data-testid="radio-decidido-cotizar" />
                      <Label htmlFor="decidido" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Estoy decidido, quiero crear mi SAS
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <RadioGroupItem value="indeciso" id="indeciso" data-testid="radio-indeciso-cotizar" />
                      <Label htmlFor="indeciso" className="flex items-center gap-2 cursor-pointer flex-1">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Solo quiero información por ahora
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting}
                  data-testid="button-submit-cotizar"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Solicitar cotización por WhatsApp
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <h3 className="font-semibold text-lg mb-3 text-center">¿Qué incluye crear tu SAS con Lo Simple?</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Compañía SAS legalmente constituida</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Títulos de Acción</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Firma Electrónica de Empresa</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Soporte por 1 año</span>
              </li>
            </ul>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            Tu información será tratada con total confidencialidad. 
            <Link href="/politica-privacidad-datos-lo-simple" className="underline ml-1">
              Política de privacidad
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
