import { apiGet, apiPost, ApiResponse } from "@/lib/api-client";

export interface BannerRow {
  id: string;
  bannerTitle: string;
  bannerType: string;
  subtitle: string | null;
  ctaLabel: string | null;
  desktopImageUrl: string;
  mobileImageUrl: string;
  clickAction: string;
  clickActionTarget: string | null;
  displayLocations: string[];
  priority: number;
}

export function getHomeBanners() {
  return apiGet<{ banners: BannerRow[] }>("/banners/home");
}

export function recordImpression(bannerId: string) {
  return apiPost<void>(`/banners/${bannerId}/impression`);
}

export function recordClick(bannerId: string) {
  return apiPost<void>(`/banners/${bannerId}/click`);
}

export type { ApiResponse };
