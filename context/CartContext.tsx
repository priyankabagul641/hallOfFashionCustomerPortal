'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MeasurementFieldKey, MeasurementType, MeasurementUnit } from '@/data/measurements';

const CART_STORAGE_KEY = 'hof_cart_items';

// Cart entries key off productId + variantId when a real product_variants row
// matched, otherwise fall back to productId + color + size (see cartItemKey)
// since variantId is omitted (undefined) rather than faked for checkout.
export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color?: string;
  designer: string;
  gstRate?: number;
  shippingCharge?: number;
  isCustomSize?: boolean;
  measurementProfileId?: string;
  measurementProfileName?: string;
  measurementType?: MeasurementType;
  measurementUnit?: MeasurementUnit;
  measurementSnapshot?: Partial<Record<MeasurementFieldKey, number>>;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  designer: string;
}

// Unique key for a cart line item. Falls back to color+size when there's no
// real variantId, so two distinct custom-size/color entries for the same
// product don't collide.
export function cartItemKey(item: Pick<CartItem, 'productId' | 'variantId' | 'color' | 'size'>): string {
  return item.variantId ? `${item.productId}::${item.variantId}` : `${item.productId}::${item.color ?? ''}::${item.size}`;
}

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlistCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Hydrate from localStorage after mount to avoid SSR/client markup mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartItems(loadCartFromStorage());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    const key = cartItemKey(item);
    setCartItems((prev) => {
      const existing = prev.find((i) => cartItemKey(i) === key);
      if (existing) {
        return prev.map((i) => (cartItemKey(i) === key ? { ...i, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (key: string) => {
    setCartItems((prev) => prev.filter((item) => cartItemKey(item) !== key));
  };

  const updateQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(key);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (cartItemKey(item) === key ? { ...item, quantity } : item))
    );
  };

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (!existing) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearCart,
        cartTotal,
        cartCount,
        wishlistCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
