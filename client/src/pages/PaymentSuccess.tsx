import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function PaymentSuccess() {
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    const paymentStatus = urlParams.get('payment_intent_client_secret');
    
    if (paymentIntent) {
      setPaymentIntentId(paymentIntent);
    }
    
    // Clear any payment-related data from localStorage if needed
    // This ensures a clean state after successful payment
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              ¡Pago Exitoso!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <p className="text-lg text-muted-foreground">
              Tu pago ha sido procesado correctamente. Recibirás un email de confirmación
              con los detalles de tu pedido.
            </p>
            
            {paymentIntentId && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>ID de Transacción:</strong> {paymentIntentId}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">¿Qué sigue?</h3>
              <ul className="text-left space-y-2 text-muted-foreground max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Te contactaremos dentro de las próximas 24 horas
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Un especialista revisará los detalles de tu solicitud
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Recibirás actualizaciones regulares sobre el progreso
                </li>
              </ul>
            </div>
            
            <div className="pt-6">
              <Button asChild size="lg" className="min-w-[200px]">
                <a href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Inicio
                </a>
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>
                ¿Tienes preguntas? Contáctanos en{" "}
                <a href="mailto:info@losimple.com" className="text-primary hover:underline">
                  info@losimple.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}