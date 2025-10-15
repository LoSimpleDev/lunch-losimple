import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Check } from "lucide-react";

export default function LaunchPayment() {
  const [, setLocation] = useLocation();

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

  const handleProceedToPayment = () => {
    // TODO: Integrate Stripe payment
    console.log('Proceeding to payment with Plan Launch');
  };

  const tax = plan.price * 0.15;
  const total = plan.price + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => setLocation('/dashboard')} className="mb-6" data-testid="button-back">
          ← Volver al Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Confirmar pago Plan Launch</h1>

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

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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

              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={handleProceedToPayment}
                data-testid="button-proceed-payment"
              >
                Proceder al pago - ${total.toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
