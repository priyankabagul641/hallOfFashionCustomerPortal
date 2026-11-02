import { apiGet, apiPost } from "@/lib/api-client";

export interface PublicCampaign {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  campaignType: string;
  bannerImageUrl: string | null;
  termsAndConditions: string | null;
  startDate: string;
  endDate: string;
  discountType: "PERCENTAGE" | "FLAT" | null;
  discountPercentage: number | null;
  flatDiscountAmount: number | null;
}

export function getPublicCampaigns() {
  return apiGet<{ campaigns: PublicCampaign[] }>("/campaigns/public");
}

export interface CheckoutQuoteRequestItem {
  productId: string;
  variantId?: string;
  quantity: number;
  // Cached price the cart currently shows for this line — used only to
  // compute `changed`, never trusted for pricing.
  clientPrice?: number;
}

export interface CheckoutQuoteResultItem {
  productId: string;
  variantId?: string;
  currentPrice: number;
  changed: boolean;
}

// Real-time per-line repricing, same pricing code path checkout uses.
// Requires a logged-in customer (backend route is customer-role-guarded).
export function quoteCheckout(items: CheckoutQuoteRequestItem[]) {
  return apiPost<{ items: CheckoutQuoteResultItem[] }>("/orders/checkout/quote", { items });
}
