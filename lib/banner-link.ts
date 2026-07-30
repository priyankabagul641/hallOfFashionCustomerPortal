import { getCategories } from "@/lib/api/products";
import { BannerRow } from "@/lib/api/banners";

let categoriesPromise: ReturnType<typeof getCategories> | null = null;
function loadCategories() {
  if (!categoriesPromise) categoriesPromise = getCategories();
  return categoriesPromise;
}

// Resolves a banner's clickAction/clickActionTarget into a route href,
// or null when the banner isn't clickable / target can't be resolved.
export async function resolveBannerHref(banner: BannerRow): Promise<string | null> {
  const target = banner.clickActionTarget;
  if (!target || banner.clickAction === "none") return null;

  switch (banner.clickAction) {
    case "external_url":
      return target;
    case "product":
      return `/product/${target}`;
    case "category": {
      const res = await loadCategories();
      const category = res.data.categories.find((c) => c.id === target);
      return category ? `/shop?category=${encodeURIComponent(category.name)}` : null;
    }
    default:
      return null;
  }
}
