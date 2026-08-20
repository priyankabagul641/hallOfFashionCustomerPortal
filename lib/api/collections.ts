import { apiGet, ApiResponse } from "@/lib/api-client";

export interface PublicCollection {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  productCount: number;
  section?: CollectionSection | null;
}

export type CollectionSection = "occasions" | "premium_mens" | "groom_counter" | "festive" | "collections";

export interface CollectionProduct {
  id: string;
  name: string;
  sku: string;
  images: string[];
  category: string;
  productType: string;
  price: number;
  mrp?: number | null;
  discountedPrice?: number | null;
  salePrice?: number | null;
  saleDiscountPercent?: number | null;
  status: string;
  stock: number;
  lowStockThreshold: number;
  variantCount: number;
  vendorName: string;
  collectionDisplayOrder: number;
  addedAt: string;
}

export interface CollectionProductsFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export function getPublicCollections(section?: CollectionSection) {
  return apiGet<{ collections: PublicCollection[] }>(
    "/collections/public",
    section ? { section } : undefined,
  );
}

export function getPublicCollection(id: string) {
  return apiGet<PublicCollection>(`/collections/public/${id}`);
}

export function getPublicCollectionProducts(
  id: string,
  filters?: CollectionProductsFilters,
) {
  return apiGet<{
    products: CollectionProduct[];
  }>(
    `/collections/public/${id}/products`,
    filters as Record<string, string | number>,
  );
}

export type { ApiResponse };
