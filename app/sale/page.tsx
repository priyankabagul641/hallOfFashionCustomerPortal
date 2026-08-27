'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ProductLoadError from '@/components/products/ProductLoadError';
import { getPublicSales, getPublicSaleProducts, PublicSale, SaleProduct } from '@/lib/api/sales';

function toProductCardProps(p: SaleProduct) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    mrp: p.mrp,
    discountedPrice: p.discountedPrice,
    salePrice: p.salePrice,
    saleDiscountPercent: p.saleDiscountPercent,
    images: p.images,
    designer: p.category,
    rating: 0,
    reviews: 0,
  };
}

function formatEndsIn(endDate: string) {
  const diffMs = new Date(endDate).getTime() - Date.now();
  if (diffMs <= 0) return null;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  if (days > 0) return `Ends in ${days}d ${hours}h`;
  return `Ends in ${hours}h`;
}

function SaleSection({ sale }: { sale: PublicSale }) {
  const [products, setProducts] = useState<SaleProduct[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPublicSaleProducts(sale.id, { page: 1, pageSize: 100 })
      .then((res) => { if (!cancelled) setProducts(res.data.products); })
      .catch(() => { if (!cancelled) setProducts([]); });
    return () => { cancelled = true; };
  }, [sale.id]);

  if (products !== null && products.length === 0) return null;

  const endsIn = formatEndsIn(sale.endDate);

  return (
    <section className="mb-16">
      <div className="mb-8 pb-5 border-b border-border">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-2">
          {sale.name}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {sale.description && <p>{sale.description}</p>}
          {endsIn && <span className="text-accent font-semibold">{endsIn}</span>}
        </div>
      </div>

      {products === null ? (
        <ProductGridSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={toProductCardProps(product)} />
          ))}
        </motion.div>
      )}
    </section>
  );
}

export default function SalePage() {
  const [sales, setSales] = useState<PublicSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getPublicSales()
      .then((res) => { if (!cancelled) { setSales(res.data.sales); setError(null); } })
      .catch(() => { if (!cancelled) setError('Failed to load sales. Please refresh.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  return (
    <main className="bg-background text-foreground">
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-4">Sale</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Limited-time offers across our curated collections
            </p>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : error ? (
            <ProductLoadError message={error} onRetry={handleRetry} />
          ) : sales.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-playfair text-xl font-semibold mb-2">No active sales right now</p>
              <p className="text-muted-foreground text-sm">Check back soon for upcoming offers</p>
            </div>
          ) : (
            sales.map((sale) => <SaleSection key={sale.id} sale={sale} />)
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
