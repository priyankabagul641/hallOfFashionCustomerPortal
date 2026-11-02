'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ProductLoadError from '@/components/products/ProductLoadError';
import { getPublicCampaigns, PublicCampaign } from '@/lib/api/campaigns';
import { getAllProducts, Product } from '@/lib/api/products';
import { safeImageSrc } from '@/lib/utils';

function formatEndsIn(endDate: string) {
  const diffMs = new Date(endDate).getTime() - Date.now();
  if (diffMs <= 0) return null;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  if (days > 0) return `Ends in ${days}d ${hours}h`;
  return `Ends in ${hours}h`;
}

export default function CampaignLandingPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<PublicCampaign | null | undefined>(undefined);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getPublicCampaigns()
      .then(async (res) => {
        if (cancelled) return;
        const found = res.data.campaigns.find((c) => c.id === campaignId) ?? null;
        setCampaign(found);
        setError(null);
        if (!found) return;

        // No backend "products in campaign X" endpoint exists today —
        // match by campaignId as a client-side filter over the full catalog.
        // ponytail: O(n) full-catalog fetch, swap for a server-side
        // campaignId filter if catalog size ever makes this slow.
        const all = await getAllProducts();
        if (cancelled) return;
        setProducts(all.filter((p) => p.campaignBadge?.campaignId === found.id));
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load campaign. Please refresh.');
      });

    return () => { cancelled = true; };
  }, [campaignId, reloadKey]);

  const handleRetry = () => setReloadKey((k) => k + 1);

  if (error) {
    return (
      <main className="bg-background text-foreground">
        <div className="flex items-center justify-center pt-28 pb-32">
          <ProductLoadError message={error} onRetry={handleRetry} />
        </div>
        <Footer />
      </main>
    );
  }

  if (campaign === null) {
    return (
      <main className="bg-background text-foreground">
        <div className="text-center pt-28 pb-32">
          <h1 className="text-4xl font-playfair font-bold mb-4">Campaign Not Found</h1>
          <p className="text-muted-foreground">This campaign is no longer active.</p>
        </div>
        <Footer />
      </main>
    );
  }

  const endsIn = campaign ? formatEndsIn(campaign.endDate) : null;

  return (
    <main className="bg-background text-foreground">
      {campaign === undefined ? (
        <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGridSkeleton />
        </div>
      ) : (
        <>
          <div className="relative w-full h-[320px] md:h-[420px] bg-card">
            {campaign.bannerImageUrl && (
              <Image
                src={safeImageSrc(campaign.bannerImageUrl)}
                alt={campaign.name}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full"
              >
                <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-3">
                  {campaign.name}
                </h1>
                {campaign.description && (
                  <p className="text-white/80 max-w-2xl mb-2">{campaign.description}</p>
                )}
                {endsIn && (
                  <span className="inline-block bg-accent text-luxury-black px-3 py-1 rounded-full text-sm font-semibold">
                    {endsIn}
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          <div className="pt-12 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {products === null ? (
                <ProductGridSkeleton />
              ) : products.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-playfair text-xl font-semibold mb-2">No products in this campaign yet</p>
                  <p className="text-muted-foreground text-sm">Check back soon</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </>
      )}
      <Footer />
    </main>
  );
}
