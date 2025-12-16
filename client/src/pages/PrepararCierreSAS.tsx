import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";
import veronicaUrl from "@assets/accounting_simple_1765904253176.png";

export default function PrepararCierreSAS() {
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
      await apiRequest("POST", "/api/contact/preparar-cierre", formData);
      
      toast({
        title: "Mensaje enviado",
        description: "Te redirigiremos a WhatsApp para continuar la conversación"
      });

      const decisionText = formData.decision === "decidido" 
        ? "Estoy decidido y quiero una cotización" 
        : "No me interesa este servicio";
      
      const mensaje = encodeURIComponent(
        `Hola Dra. Verónica, vengo de la página de cierre de SAS.\n\n` +
        `*Nombre:* ${formData.nombre}\n` +
        `*Email:* ${formData.email}\n` +
        `*WhatsApp:* ${formData.whatsapp}\n` +
        `*Estado:* ${decisionText}\n\n` +
        `Mi empresa no cumple con los requisitos del cierre abreviado y necesito asesoría para prepararla.`
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Link href="/">
          <div className="mb-8 flex justify-center cursor-pointer">
            <img 
              src={logoUrl} 
              alt="Lo Simple" 
              className="h-12 md:h-16 w-auto"
              data-testid="img-logo-preparar-cierre"
            />
          </div>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Asesoría para preparar el cierre de tu SAS en Ecuador
        </h1>

        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-500 shadow-lg">
            <img 
              src={veronicaUrl} 
              alt="Dra. Verónica" 
              className="w-full h-full object-cover"
              data-testid="img-asesora"
            />
          </div>
        </div>

        <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
          Hola, te saluda la <strong>Dra. Verónica</strong>, asesora legal en Lo Simple. 
          Si tu empresa <strong>no cumple los requisitos</strong> del cierre abreviado, 
          te ayudamos a prepararla. Completa el formulario y escríbeme por WhatsApp.
        </p>

        <Card className="shadow-xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-base">
                  Nombre del solicitante <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ejemplo: Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="h-12"
                  data-testid="input-nombre"
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
                    data-testid="input-email"
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
                    data-testid="input-whatsapp"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base">
                  ¿Deseas recibir una cotización por escrito? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.decision}
                  onValueChange={(value) => setFormData({ ...formData, decision: value })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="decidido" id="decidido" data-testid="radio-decidido" />
                    <Label htmlFor="decidido" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Estoy decidido, quiero una cotización
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="indeciso" id="indeciso" data-testid="radio-indeciso" />
                    <Label htmlFor="indeciso" className="flex items-center gap-2 cursor-pointer flex-1">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      No me interesa este servicio
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
                disabled={isSubmitting}
                data-testid="button-submit-whatsapp"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Consultar por WhatsApp
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Tu información será tratada con total confidencialidad. 
          <Link href="/politica-privacidad-datos-lo-simple" className="underline ml-1">
            Política de privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}
