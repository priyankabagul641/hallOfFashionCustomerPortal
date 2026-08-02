import { apiGet, apiPost } from "@/lib/api-client";

export interface CheckoutItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CheckoutPayload {
  items: CheckoutItem[];
  shippingAddress: Record<string, string>;
  paymentMethod: "cod";
}

export interface CheckoutOrderResult {
  id: string;
  orderNumber: string;
  vendorId: string;
  subtotal: number;
  discountAmount: number;
  gstAmount: number;
  deliveryCharges: number;
  total: number;
}

export function checkout(payload: CheckoutPayload) {
  return apiPost<{ orders: CheckoutOrderResult[]; message?: string }>(
    "/orders/checkout",
    payload
  );
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  color: string | null;
  quantity: number;
  price: number;
  size: string;
  designer: string;
  customized: boolean;
}

export interface TrackingEvent {
  date: string;
  time: string;
  status: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  cancellationReason: string | null;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: Record<string, string>;
  estimatedDelivery: string | null;
  tracking: TrackingEvent[];
}

export function getMyOrders() {
  return apiGet<{ orders: Order[] }>("/orders/mine");
}

export function getMyOrder(id: string) {
  return apiGet<Order>(`/orders/mine/${id}`);
}
