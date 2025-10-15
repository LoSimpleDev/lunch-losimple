import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

export default function LaunchPayment() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<'fundador' | 'pro'>('fundador');

  const plans = {
    fundador: {
      name: 'Plan Fundador Anual',
      price: 599,
      features: [
        'Constitución de empresa',
        'Logo profesional',
        'Sitio web básico',
        'Redes sociales verificadas',
        'Facturación electrónica',
        'Acompañamiento anual',
        'Garantía de cierre primer año'
      ]
    },
    pro: {
      name: 'Plan Pro Anual',
      price: 699,
      features: [
        'Todo lo del Plan Fundador',
        'Hosting incluido (1 año)',
        'Firma electrónica incluida',
        'Dominio personalizado',
        'Soporte prioritario'
      ]
    }
  };

  const handleProceedToPayment = () => {
    // TODO: Integrate Stripe payment
    console.log('Proceeding to payment with plan:', selectedPlan);
  };

  const selectedPlanData = plans[selectedPlan];
  const tax = selectedPlanData.price * 0.15;
  const total = selectedPlanData.price + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => setLocation('/dashboard')} className="mb-6" data-testid="button-back">
          ← Volver al Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-8">Elige tu plan Launch</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Plan Fundador */}
          <Card 
            className={`cursor-pointer transition-all ${selectedPlan === 'fundador' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedPlan('fundador')}
            data-testid="card-plan-fundador"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Plan Fundador</CardTitle>
                  <CardDescription className="mt-2">
                    <span className="text-3xl font-bold text-foreground">${plans.fundador.price}</span>
                    <span className="text-sm"> + IVA / año</span>
                  </CardDescription>
                </div>
                {selectedPlan === 'fundador' && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plans.fundador.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Plan Pro */}
          <Card 
            className={`cursor-pointer transition-all ${selectedPlan === 'pro' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedPlan('pro')}
            data-testid="card-plan-pro"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>Plan Pro</CardTitle>
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Popular</span>
                  </div>
                  <CardDescription className="mt-2">
                    <span className="text-3xl font-bold text-foreground">${plans.pro.price}</span>
                    <span className="text-sm"> + IVA / año</span>
                  </CardDescription>
                </div>
                {selectedPlan === 'pro' && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plans.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{selectedPlanData.name}</span>
                <span>${selectedPlanData.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>IVA (15%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span data-testid="text-total">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full mt-6" 
              onClick={handleProceedToPayment}
              data-testid="button-proceed-payment"
            >
              Proceder al pago
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
