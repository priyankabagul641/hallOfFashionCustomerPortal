'use client';

import { orders as seedOrders, Order } from '@/data/orders';
import { CartItem } from '@/context/CartContext';

const STORAGE_KEY = 'hof_saved_orders';

export function loadStoredOrders(): Order[] {
  if (typeof window === 'undefined') {
    return seedOrders;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return seedOrders;
    }

    const parsed = JSON.parse(stored) as Order[];
    return parsed.length > 0 ? parsed : seedOrders;
  } catch {
    return seedOrders;
  }
}

export function saveStoredOrder(order: Order) {
  if (typeof window === 'undefined') return;

  const currentOrders = loadStoredOrders();
  const nextOrders = [order, ...currentOrders.filter((item) => item.id !== order.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
}

export function createOrderFromCart(params: {
  cartItems: CartItem[];
  shippingAddress: Order['shippingAddress'];
  paymentMethod: string;
  total: number;
}): Order {
  const { cartItems, shippingAddress, paymentMethod, total } = params;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const shipping = subtotal > 10000 ? 0 : 500;

  return {
    id: `ORD-${Date.now()}`,
    orderNumber: `HOF-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Processing',
    items: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
      size: item.isCustomSize ? 'Custom Size' : item.size,
      designer: item.designer,
      customized: !!item.isCustomSize,
      measurementProfileId: item.measurementProfileId,
      measurementProfileName: item.measurementProfileName,
      measurementType: item.measurementType,
      measurementUnit: item.measurementUnit,
      measurementSnapshot: item.measurementSnapshot,
    })),
    subtotal,
    discount,
    shipping,
    total: total || subtotal + shipping,
    paymentMethod,
    paymentStatus: 'Pending',
    shippingAddress,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tracking: [
      {
        date: new Date().toDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Order Placed',
        description: 'Your custom order has been placed and is awaiting confirmation.',
        completed: true,
      },
    ],
  };
}
