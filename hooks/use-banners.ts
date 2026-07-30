"use client";

import { useEffect, useState } from "react";
import {
  BannerRow,
  getHomeBanners,
  recordClick,
  recordImpression,
} from "@/lib/api/banners";

export function useBanners(location?: string, bannerType?: string) {
  const [banners, setBanners] = useState<BannerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getHomeBanners()
      .then((res) => {
        if (cancelled) return;
        let filtered = res.data.banners;
        if (location) filtered = filtered.filter((b) => b.displayLocations.includes(location));
        if (bannerType) filtered = filtered.filter((b) => b.bannerType === bannerType);
        setBanners(filtered);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? "Failed to load banners");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [location, bannerType]);

  return { banners, loading, error, recordImpression, recordClick };
}
