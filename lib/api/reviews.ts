import { apiGet, apiPost } from "@/lib/api-client";

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface ReviewsMeta {
  total: number;
  page: number;
  pageSize: number;
}

export type ReviewSortBy = "newest" | "oldest" | "highest" | "lowest";

export function getProductReviews(
  productId: string,
  params?: { page?: number; pageSize?: number; sortBy?: ReviewSortBy }
) {
  return apiGet<{ reviews: Review[]; meta: ReviewsMeta }>(
    `/products/${productId}/reviews`,
    params as Record<string, string | number | boolean> | undefined
  );
}

export interface SubmitReviewPayload {
  rating: number;
  title?: string;
  comment: string;
}

export function submitProductReview(productId: string, payload: SubmitReviewPayload) {
  return apiPost<{ id: string; status: string }>(
    `/products/${productId}/reviews`,
    payload
  );
}
