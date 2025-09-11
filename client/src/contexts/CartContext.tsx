import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service } from '@shared/schema';

export interface CartItem {
  service: Service;
  quantity: number;
}

export interface CartDiscount {
  id: string;
  name: string;
  amount: number;
  type: 'percentage' | 'fixed';
}

interface CartContextType {
  items: CartItem[];
  discounts: CartDiscount[];
  discountCode: string;
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscountCode: (code: string) => boolean;
  removeDiscountCode: () => void;
  subtotal: number;
  discountAmount: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'losimple_cart_items';
const DISCOUNT_STORAGE_KEY = 'losimple_discount_code';

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart from localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedItems = localStorage.getItem(CART_STORAGE_KEY);
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Initialize discount code from localStorage
  const [discountCode, setDiscountCode] = useState<string>(() => {
    try {
      const savedCode = localStorage.getItem(DISCOUNT_STORAGE_KEY);
      return savedCode || '';
    } catch (error) {
      console.error('Error loading discount code from localStorage:', error);
      return '';
    }
  });

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Save discount code to localStorage whenever it changes
  useEffect(() => {
    try {
      if (discountCode) {
        localStorage.setItem(DISCOUNT_STORAGE_KEY, discountCode);
      } else {
        localStorage.removeItem(DISCOUNT_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving discount code to localStorage:', error);
    }
  }, [discountCode]);

  const addToCart = (service: Service) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.service.id === service.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setItems(prevItems => prevItems.filter(item => item.service.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.service.id === serviceId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode('');
    // Also clear from localStorage
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(DISCOUNT_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  };

  const applyDiscountCode = (code: string): boolean => {
    const validCodes = {
      'NEWSDESAS': { percentage: 10, name: 'Descuento NEWSDESAS 10%' }
    };
    
    if (validCodes[code as keyof typeof validCodes]) {
      setDiscountCode(code);
      return true;
    }
    return false;
  };

  const removeDiscountCode = () => {
    setDiscountCode('');
  };

  // Calculate subtotal (before any discounts)
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.service.price) * item.quantity), 0);
  
  // Create automatic discount for 50% advance payment
  const discounts: CartDiscount[] = [];
  
  if (subtotal > 0) {
    // Always add 50% advance discount
    discounts.push({
      id: 'advance-50',
      name: 'Descuento Anticipo 50%',
      amount: subtotal * 0.5,
      type: 'fixed'
    });
    
    // Add discount code if applied
    if (discountCode === 'NEWSDESAS') {
      const advanceAmount = subtotal * 0.5; // 50% advance
      discounts.push({
        id: 'promo-newsdesas',
        name: 'Descuento NEWSDESAS 10%',
        amount: advanceAmount * 0.1, // 10% off the advance amount
        type: 'fixed'
      });
    }
  }

  const discountAmount = discounts.reduce((sum, discount) => sum + discount.amount, 0);
  const total = subtotal - discountAmount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      discounts,
      discountCode,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyDiscountCode,
      removeDiscountCode,
      subtotal,
      discountAmount,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}