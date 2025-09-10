import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { CreditCard, CheckCircle, Loader2 } from "lucide-react";

interface CheckoutFormProps {
  onSuccess?: (orderId: string) => void;
  onCancel?: () => void;
}

interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    serviceId: string;
    quantity: number;
  }>;
}

export function CheckoutForm({ onSuccess, onCancel }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });
  
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CreateOrderRequest) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error creando el pedido');
      }
      
      return response.json();
    },
    onSuccess: (order: any) => {
      clearCart();
      toast({
        title: "¡Pedido creado exitosamente!",
        description: `Tu pedido #${order.id} ha sido procesado por un total de $${order.totalAmount}`,
      });
      
      if (onSuccess) {
        onSuccess(order.id);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error al crear el pedido",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim() || !formData.customerEmail.trim() || !formData.customerPhone.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const orderData: CreateOrderRequest = {
      customerName: formData.customerName.trim(),
      customerEmail: formData.customerEmail.trim(),
      customerPhone: formData.customerPhone.trim(),
      items: items.map(item => ({
        serviceId: item.service.id,
        quantity: item.quantity,
      })),
    };

    createOrderMutation.mutate(orderData);
  };

  return (
    <Card className="w-full" data-testid="checkout-form">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Información de Contacto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nombre Completo *</Label>
            <Input
              id="customerName"
              type="text"
              placeholder="Tu nombre completo"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              disabled={createOrderMutation.isPending}
              data-testid="input-customer-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email *</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="tu@email.com"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              disabled={createOrderMutation.isPending}
              data-testid="input-customer-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Teléfono *</Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="+593 99 999 9999"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              disabled={createOrderMutation.isPending}
              data-testid="input-customer-phone"
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center text-lg font-bold mb-4">
              <span>Total a pagar:</span>
              <span className="text-primary" data-testid="checkout-total">
                ${total.toFixed(2)}
              </span>
            </div>
            
            <div className="flex gap-3">
              {onCancel && (
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={onCancel}
                  disabled={createOrderMutation.isPending}
                  className="flex-1"
                  data-testid="button-cancel-checkout"
                >
                  Cancelar
                </Button>
              )}
              
              <Button 
                type="submit"
                disabled={createOrderMutation.isPending}
                className="flex-1"
                data-testid="button-submit-order"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Crear Pedido
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded">
          <strong>Nota:</strong> Al crear tu pedido, nos contactaremos contigo por WhatsApp 
          para coordinar los detalles y el pago. No se procesará ningún cargo hasta confirmarlo contigo.
        </div>
      </CardContent>
    </Card>
  );
}