import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CheckoutForm } from "@/components/CheckoutForm";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";

interface CartProps {
  onCheckout?: () => void;
}

export function Cart({ onCheckout }: CartProps) {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(serviceId);
      return;
    }
    updateQuantity(serviceId, newQuantity);
  };

  const handleRemoveItem = (serviceId: string, serviceName: string) => {
    removeFromCart(serviceId);
    toast({
      title: "Servicio eliminado",
      description: `${serviceName} se ha eliminado del carrito`,
    });
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      setShowCheckout(true);
    }
  };
  
  const handleCheckoutSuccess = (orderId: string) => {
    setShowCheckout(false);
    setIsOpen(false);
    toast({
      title: "¡Pedido creado!",
      description: `Tu pedido #${orderId} ha sido procesado exitosamente`,
    });
  };

  const handleCancelCheckout = () => {
    setShowCheckout(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
          data-testid="button-open-cart"
        >
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              data-testid="badge-cart-count"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg" data-testid="cart-panel">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Tu Carrito ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </SheetTitle>
          <SheetDescription>
            Revisa tus servicios seleccionados y procede al checkout
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-auto">
          {showCheckout ? (
            <CheckoutForm 
              onSuccess={handleCheckoutSuccess}
              onCancel={handleCancelCheckout}
            />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center" data-testid="empty-cart">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
              <p className="text-muted-foreground">Agrega algunos servicios para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.service.id} data-testid={`cart-item-${item.service.id}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm" data-testid={`cart-item-name-${item.service.id}`}>
                          {item.service.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.service.category}
                        </p>
                        <p className="text-lg font-bold text-primary mt-1">
                          ${parseFloat(item.service.price).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.service.id, item.service.name)}
                        data-testid={`button-remove-item-${item.service.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.service.id, item.quantity - 1)}
                          data-testid={`button-decrease-${item.service.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold" data-testid={`quantity-${item.service.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.service.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.service.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm font-semibold">
                        Subtotal: ${(parseFloat(item.service.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && !showCheckout && (
          <div className="border-t pt-4 mt-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary" data-testid="cart-total">
                ${total.toFixed(2)}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="flex-1"
                data-testid="button-clear-cart"
              >
                Vaciar Carrito
              </Button>
              <Button 
                onClick={handleCheckout}
                className="flex-1"
                data-testid="button-checkout"
              >
                Proceder al Pago
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}