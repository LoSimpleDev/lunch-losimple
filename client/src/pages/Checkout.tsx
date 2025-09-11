import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Debug logging for Stripe state
  useEffect(() => {
    console.log('CheckoutForm - Stripe:', !!stripe, 'Elements:', !!elements);
    if (stripe && elements) {
      setIsReady(true);
      console.log('CheckoutForm - Ready to process payments');
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('CheckoutForm - Submit attempt, Stripe:', !!stripe, 'Elements:', !!elements);

    if (!stripe || !elements) {
      console.error('CheckoutForm - Stripe not ready');
      toast({
        title: "Error",
        description: "Sistema de pago no disponible. Recarga la página.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('CheckoutForm - Confirming payment...');
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        console.error('CheckoutForm - Payment error:', error);
        toast({
          title: "Error en el pago",
          description: error.message || "Ocurrió un error procesando el pago",
          variant: "destructive",
        });
        setIsProcessing(false);
      } else {
        console.log('CheckoutForm - Payment successful');
        toast({
          title: "¡Pago exitoso!",
          description: "Tu pago ha sido procesado correctamente",
        });
        onSuccess();
      }
    } catch (err) {
      console.error('CheckoutForm - Unexpected error:', err);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error inesperado. Intenta nuevamente.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg bg-muted/30 min-h-[200px]" data-testid="payment-container">
        {!stripe || !elements ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Cargando formulario de pago...</p>
            </div>
          </div>
        ) : (
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
            onReady={() => {
              console.log('PaymentElement - Ready');
              setIsReady(true);
            }}
            onLoadError={(error) => {
              console.error('PaymentElement - Load error:', error);
              // Trigger hosted checkout fallback immediately on load error
              const cartItems = items.map(item => ({
                serviceId: item.service.id,
                quantity: item.quantity
              }));
              handleHostedCheckout(cartItems);
            }}
          />
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || !elements || !isReady || isProcessing} 
        className="w-full"
        size="lg"
        data-testid="button-complete-payment"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Procesando...
          </div>
        ) : !stripe || !elements || !isReady ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            Cargando...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Completar Pago
          </>
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    // Try Elements first, fallback to hosted checkout if CSP blocks it
    if (items.length > 0) {
      console.log('Checkout - Creating PaymentIntent for items:', items.length);
      // Send cart items to server for secure amount calculation
      const cartItems = items.map(item => ({
        serviceId: item.service.id,
        quantity: item.quantity
      }));

      console.log('Checkout - Sending items to server:', cartItems);
      apiRequest("POST", "/api/create-payment-intent", { items: cartItems })
        .then((res) => res.json())
        .then((data) => {
          console.log('Checkout - PaymentIntent created:', !!data.clientSecret);
          setClientSecret(data.clientSecret);
          setIsLoading(false);
          
          // Set timeout to check if PaymentElement initializes within 3 seconds
          setTimeout(() => {
            // If no PaymentElement ready event has been fired, fallback to hosted checkout
            const paymentContainer = document.querySelector('[data-testid="payment-container"]');
            const stripeFrame = document.querySelector('iframe[name^="__privateStripeFrame"]');
            
            if (!stripeFrame || !paymentContainer) {
              console.log('Checkout - PaymentElement not rendered, falling back to hosted checkout');
              handleHostedCheckout(cartItems);
            }
          }, 3000);
        })
        .catch((error) => {
          console.error("Checkout - Error creating payment intent:", error);
          console.log('Checkout - Falling back to hosted checkout');
          handleHostedCheckout(cartItems);
        });
    } else {
      console.log('Checkout - No items in cart');
      setIsLoading(false);
    }
  }, [items, toast]);

  const handleHostedCheckout = async (cartItems: any[]) => {
    try {
      console.log('Checkout - Creating hosted checkout session');
      const response = await apiRequest("POST", "/api/create-checkout-session", { items: cartItems });
      const { sessionId } = await response.json();
      
      // Load stripe and redirect to hosted checkout
      const stripe = await import('@stripe/stripe-js').then(m => m.loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY));
      if (stripe) {
        console.log('Checkout - Redirecting to Stripe hosted checkout');
        stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Checkout - Error with hosted checkout:', error);
      toast({
        title: "Error",
        description: "No se pudo inicializar el pago. Intenta nuevamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    // Redirect could be handled by Stripe or manually here
  };

  if (total === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <h1 className="text-2xl font-bold mb-4">Carrito Vacío</h1>
              <p className="text-muted-foreground mb-6">
                No hay servicios en tu carrito para procesar el pago.
              </p>
              <Button asChild>
                <a href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Servicios
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                <p className="text-muted-foreground">Inicializando pago...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <h1 className="text-2xl font-bold mb-4 text-destructive">Error de Pago</h1>
              <p className="text-muted-foreground mb-6">
                No se pudo inicializar el proceso de pago. Por favor, intenta nuevamente.
              </p>
              <Button asChild>
                <a href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Servicios
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
  };

  const elementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.service.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.service.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold">
                      ${(parseFloat(item.service.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={elementsOptions}>
                  <CheckoutForm onSuccess={handlePaymentSuccess} />
                </Elements>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}