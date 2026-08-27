import { apiGet, apiPost } from "@/lib/api-client";
import { Product } from "@/lib/api/products";

export interface SearchFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  rating?: number;
  availability?: string;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "relevance" | "popularity";
  page?: number;
  pageSize?: number;
}

export function searchProducts(filters: SearchFilters) {
  return apiGet<{
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>("/search/products", filters as Record<string, string | number>);
}

export interface SearchSuggestion {
  id: string;
  name: string;
  category: string;
  image: string;
}

export function getSearchSuggestions(q: string) {
  return apiGet<{ suggestions: SearchSuggestion[] }>("/search/suggestions", { q });
}

export interface SearchEventPayload {
  query: string;
  searchType?: "keyword";
  resultsCount?: number;
  clickedProductId?: string;
  addedToCart?: boolean;
  orderId?: string;
  sessionId?: string;
}

// Fire-and-forget — never block UI on this, never retry.
export function recordSearchEvent(payload: SearchEventPayload) {
  apiPost("/search/events", payload).catch(() => {});
}

export function getPopularSearches() {
  return apiGet<{ queries: string[] }>("/search/popular");
}
