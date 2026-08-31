import { apiGet, ApiResponse } from "@/lib/api-client";

export interface ProductColorOption {
  color: string;
  colorCode: string | null;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  designer: string;
  category: string;
  subcategory: string;
  price: number;
  mrp?: number | null;
  discountedPrice?: number | null;
  salePrice?: number | null;
  saleDiscountPercent?: number | null;
  images: string[];
  rating: number;
  reviews: number;
  deliveryTime: string;
  description: string;
  gstRate: number;
  shippingCharge: number;
  minOrderQuantity: number;
}

// Best price to show for a product card/detail: sale price and marketing
// discount are mutually exclusive at order time, but if both are present for
// display purposes, show whichever is lower rather than stacking badges.
// mrp/percentOff fall back to a plain price comparison — never recompute the
// discounted/sale price itself, only the strike-through/badge derived from it.
export function getDisplayPrice(
  product: Pick<Product, "price" | "mrp" | "discountedPrice" | "salePrice">
) {
  const mrp = product.mrp ?? product.price;
  const { discountedPrice, salePrice } = product;

  const effectivePrice =
    salePrice != null && (discountedPrice == null || salePrice <= discountedPrice)
      ? salePrice
      : discountedPrice ?? product.price;

  return {
    effectivePrice,
    mrp,
    percentOff: effectivePrice < mrp ? Math.round(((mrp - effectivePrice) / mrp) * 100) : undefined,
  };
}

export interface ProductVariant {
  variantId: string;
  color: string;
  size: string;
  stock: number;
}

export interface ProductDetail extends Product {
  fabricDetails: string;
  tags: string[];
  colorOptions: ProductColorOption[];
  variants?: ProductVariant[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  // ponytail: public list endpoint doesn't accept this yet (whitelist-only
  // DTO) — passing it 400s until backend adds occasion filtering. Callers
  // must catch and degrade to an empty result, not an error banner.
  occasion?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest";
}

export function getProducts(filters?: ProductFilters) {
  return apiGet<{
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>("/products/public", filters as Record<string, string | number>);
}

export function getProduct(id: string) {
  return apiGet<ProductDetail>(`/products/public/${id}`);
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  displayOrder: number;
  productCount: number;
  showOnHomepage: boolean;
}

export function getCategories() {
  return apiGet<{ categories: PublicCategory[] }>("/products/public/categories");
}

// Pages through the full catalog. Only use where the caller genuinely needs
// every product (shop listing, collection filtering, static params) — not
// for bounded "show N" sections, which should keep using getProducts directly.
export async function getAllProducts(filters?: Omit<ProductFilters, "page" | "pageSize">) {
  const products: Product[] = [];
  let page = 1;
  const pageSize = 100;
  while (true) {
    const res = await getProducts({ ...filters, page, pageSize });
    products.push(...res.data.products);
    if (page >= res.data.totalPages) break;
    page++;
  }
  return products;
}

export type { ApiResponse };
