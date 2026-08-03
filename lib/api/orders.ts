import { apiGet, apiPost } from "@/lib/api-client";

export type ReturnRequestType = "return" | "refund" | "exchange";

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
  // Snapshotted at purchase time. Backend returns these on /orders/mine/:id
  // (see mapOrderForCustomer). Optional so callers still default to true if absent.
  allowReturn?: boolean;
  allowRefund?: boolean;
  allowExchange?: boolean;
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
  // Backend returns these on /orders/mine/:id (orders.return_eligible /
  // return_end_date). Optional so callers still fall back to status ===
  // 'delivered' alone if absent.
  returnEligible?: boolean;
  returnEndDate?: string | null;
}

export function getMyOrders() {
  return apiGet<{ orders: Order[] }>("/orders/mine");
}

export function getMyOrder(id: string) {
  return apiGet<Order>(`/orders/mine/${id}`);
}

export interface CreateReturnPayload {
  type: ReturnRequestType;
  reason: string;
  photos?: string[];
  items?: { orderItemId: string; quantity: number; restockable?: boolean }[];
}

export function createReturnRequest(orderId: string, payload: CreateReturnPayload) {
  return apiPost<{ id: string; status: string }>(
    `/orders/${orderId}/returns`,
    payload
  );
}
