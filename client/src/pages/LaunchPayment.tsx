import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Error en el pago",
          description: error.message,
          variant: "destructive",
        });
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirmar pago en el backend
        await apiRequest("POST", "/api/launch/confirm-payment", {
          paymentIntentId: paymentIntent.id
        });

        await queryClient.invalidateQueries({ queryKey: ["/api/launch/my-request"] });

        toast({
          title: "¡Pago exitoso!",
          description: "Tu pago ha sido procesado correctamente",
        });

        setLocation('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al procesar el pago",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit"
        className="w-full" 
        size="lg"
        disabled={!stripe || isProcessing}
        data-testid="button-confirm-payment"
      >
        {isProcessing ? "Procesando..." : "Confirmar pago - $688.85"}
      </Button>
    </form>
  );
};

export default function LaunchPayment() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isTestPaymentProcessing, setIsTestPaymentProcessing] = useState(false);
  const { toast } = useToast();

  // Verificar sesión
  const { data: sessionData, isLoading: isLoadingSession, isError: isSessionError } = useQuery<{ user: any }>({
    queryKey: ["/api/auth/session"],
  });

  useEffect(() => {
    // Esperar a que la sesión se cargue
    if (isLoadingSession) return;

    // Si hay error en la sesión o no hay usuario, redirigir al login
    if (isSessionError || !sessionData?.user) {
      setLocation('/login');
      return;
    }

    // Crear PaymentIntent
    apiRequest("POST", "/api/launch/payment-intent", {})
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error: any) => {
        console.error('Error creating payment intent:', error);
        const errorMessage = error.message || 'Error al preparar el pago';
        setPaymentError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      });
  }, [sessionData, isLoadingSession, setLocation, toast]);

  const handleTestPayment = async () => {
    setIsTestPaymentProcessing(true);
    
    try {
      // apiRequest throws if response is not ok (status >= 400)
      const res = await apiRequest("POST", "/api/launch/test-complete-payment", {});
      const data = await res.json();
      
      // Invalidate cache to refresh launch request data
      await queryClient.invalidateQueries({ queryKey: ["/api/launch/my-request"] });
      
      toast({
        title: "¡Pago de prueba completado!",
        description: `Se ha registrado un pago de prueba de $${data.totalAmount}`,
      });
      
      // Redirect to dashboard to see completed payment
      setLocation('/dashboard');
    } catch (error: any) {
      // Handle errors from backend (e.g., form not complete, auth issues)
      const errorMessage = error.message || "Error al completar pago de prueba";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsTestPaymentProcessing(false);
    }
  };

  const plan = {
    name: 'Plan Launch',
    price: 599,
    features: [
      'Constitución de tu empresa SAS en Ecuador',
      'Diseño de identidad visual y logo profesional',
      'Página web corporativa completa',
      'Redes sociales configuradas',
      'Sistema de facturación electrónica',
      'Firma electrónica',
      'Bonus: Cierre de todo sin costo adicional, incluida la liquidación de la empresa durante el primer año siempre que esté al día'
    ]
  };

  const tax = plan.price * 0.15;
  const total = plan.price + tax;

  if (!clientSecret && !paymentError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Preparando pago...</p>
        </div>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" onClick={() => setLocation('/dashboard')} className="mb-6" data-testid="button-back">
            ← Volver al Dashboard
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error al preparar el pago</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{paymentError}</p>
              <Button onClick={() => setLocation('/dashboard')} data-testid="button-go-dashboard">
                Ir al Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => setLocation('/dashboard')} className="mb-6" data-testid="button-back">
          ← Volver al Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Pago Plan Launch</h1>

        <div className="space-y-6">
          {/* Plan Launch */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-2xl">Plan Launch</CardTitle>
                <CardDescription className="mt-3">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-lg"> + IVA</span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-lg">
                  <span>{plan.name}</span>
                  <span>${plan.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>IVA (15%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span data-testid="text-total">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Stripe Payment Form */}
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>

              {/* Test Payment Option */}
              <div className="mt-6 pt-6 border-t">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                    Modo de Prueba
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Mientras no publiques, puedes simular el pago para verificar el dashboard y las funcionalidades.
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={handleTestPayment}
                  disabled={isTestPaymentProcessing}
                  className="w-full"
                  data-testid="button-test-payment"
                >
                  {isTestPaymentProcessing ? "Procesando..." : "Simular Pago de Prueba"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
