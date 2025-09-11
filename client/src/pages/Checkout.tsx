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

const CheckoutForm = ({ 
  onSuccess, 
  onFallback 
}: { 
  onSuccess: () => void;
  onFallback: () => void; 
}) => {
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
              onFallback();
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
  const { items, subtotal, discounts, discountAmount, discountCode, total, clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    // DISABLED: Try Elements first, show checkout page normally
    if (items.length > 0) {
      console.log('Checkout - Loading checkout page with items:', items.length, 'discountCode:', discountCode);
      setIsLoading(false);
    } else {
      console.log('Checkout - No items in cart');
      setIsLoading(false);
    }
  }, [items, discountCode, toast]);

  const handleHostedCheckout = async (cartItems: any[]) => {
    try {
      console.log('Checkout - Creating hosted checkout session');
      const response = await apiRequest("POST", "/api/create-checkout-session", { 
        items: cartItems,
        discountCode: discountCode || ''
      });
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

  // TEMPORARILY DISABLED: Don't require clientSecret to show checkout page
  // if (!clientSecret) {
  //   return error page
  // }

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
                {/* Items */}
                <div className="space-y-3">
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
                </div>
                
                {/* Totales */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Descuentos */}
                  {discounts.map((discount) => (
                    <div key={discount.id} className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>{discount.name}:</span>
                      <span>-${discount.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                    <span>Total a pagar:</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Leyenda explicativa sobre el descuento de anticipo */}
                {discounts.some(d => d.id === 'advance-50') && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-600 dark:text-blue-400">
                        <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Información sobre el Descuento Anticipo 50%
                        </h4>
                        <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                          El Descuento Anticipo 50% se realiza porque trabajamos con la mitad de anticipo, 
                          recuerda que debes cancelar ese segundo 50% una vez terminado el trámite y que de 
                          ninguna manera la operación de cálculo de anticipo representa un descuento final.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                <div className="space-y-4">
                  <p className="text-muted-foreground text-center">
                    Serás redirigido a Stripe para completar tu pago de forma segura.
                  </p>
                  <Button 
                    onClick={() => {
                      const cartItems = items.map(item => ({
                        serviceId: item.service.id,
                        quantity: item.quantity
                      }));
                      console.log('Manual hosted checkout with discountCode:', discountCode);
                      handleHostedCheckout(cartItems);
                    }}
                    className="w-full"
                    size="lg"
                    data-testid="button-complete-payment"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pagar con Stripe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}