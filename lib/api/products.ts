import { apiGet, ApiResponse } from "@/lib/api-client";

export interface ProductColorOption {
  color: string;
  colorCode: string | null;
  images: string[];
}

// Resolved winner (sale vs campaign vs marketing discount) for one variant —
// backend-computed, never recompute precedence client-side.
export type PricingSource = "sale" | "campaign" | "discount" | null;

export interface VariantPricing {
  finalPrice: number;
  discountPercent: number;
  source: PricingSource;
  sourceId: string | null;
  campaignName?: string;
  endsAt?: string;
}

export type VariantPricingMap = Record<string, VariantPricing>;

export interface CampaignBadge {
  campaignId: string;
  name: string;
  discountPercent: number;
  endsAt: string;
  // Resolved best price (sale vs campaign, floored/rounded) — only present
  // when appliesToAllVariants is true. Use directly, never recompute.
  finalPrice: number | null;
  // False when discount only applies to specific colors/sizes — card can't
  // know which variant a generic add-to-cart picks, so show badge as
  // informational only ("up to X% off"), no specific price.
  appliesToAllVariants: boolean;
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
  saleVariantIds?: string[] | null;
  scopedSaleDiscountPercent?: number | null;
  scopedSalePrice?: number | null;
  // Card-level: best campaign discount applying to any variant. Empty/absent
  // on list reads only when no campaign applies — not a separate fetch.
  campaignBadge?: CampaignBadge | null;
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
// When a sale is variant-scoped (saleVariantIds non-null), salePrice arrives
// null from the backend — pass the id of the variant the shopper actually
// has selected so we can use scopedSalePrice, the backend-computed final
// price (already floored at cost price, which this portal never sees).
// scopedSaleDiscountPercent is display-only (e.g. "X% off" label), never
// used to compute price. Omit selectedVariantId (listing cards, quick-add)
// and a scoped sale never shows a price — never guess which variant.
export function getDisplayPrice(
  product: Pick<
    Product,
    "price" | "mrp" | "discountedPrice" | "salePrice" | "saleVariantIds" | "scopedSalePrice"
  >,
  selectedVariantId?: string | null
) {
  const mrp = product.mrp ?? product.price;
  const { discountedPrice, salePrice, saleVariantIds, scopedSalePrice } = product;

  let effectiveSalePrice = salePrice ?? null;
  if (saleVariantIds != null) {
    effectiveSalePrice =
      selectedVariantId && saleVariantIds.includes(selectedVariantId) ? scopedSalePrice ?? null : null;
  }

  const effectivePrice =
    effectiveSalePrice != null && (discountedPrice == null || effectiveSalePrice <= discountedPrice)
      ? effectiveSalePrice
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
  // Per-variant pricing map, only populated on the single-product read (list/
  // search/collection reads have no per-variant data, rely on campaignBadge).
  variantPricing?: VariantPricingMap;
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
