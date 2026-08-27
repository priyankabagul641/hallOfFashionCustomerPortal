import { apiGet, ApiResponse } from "@/lib/api-client";

export interface PublicSale {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  productCount: number;
}

export interface SaleProduct {
  id: string;
  name: string;
  sku: string;
  images: string[];
  category: string;
  price: number;
  mrp?: number | null;
  discountedPrice?: number | null;
  salePrice?: number | null;
  saleDiscountPercent?: number | null;
}

export interface SaleProductsFilters {
  page?: number;
  pageSize?: number;
}

export function getPublicSales() {
  return apiGet<{ sales: PublicSale[] }>("/sales/public");
}

export function getPublicSaleProducts(
  saleId: string,
  filters?: SaleProductsFilters,
) {
  return apiGet<{ products: SaleProduct[] }>(
    `/sales/public/${saleId}/products`,
    filters as Record<string, string | number>,
  );
}

export type { ApiResponse };
