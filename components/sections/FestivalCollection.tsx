'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getProducts, getOccasions, Product } from '@/lib/api/products';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ProductLoadError from '@/components/products/ProductLoadError';

const FALLBACK_OCCASION_NAME = 'Festive';

export default function FestivalCollection() {
  const [festivalProducts, setFestivalProducts] = useState<Product[]>([]);
  const [occasionName, setOccasionName] = useState(FALLBACK_OCCASION_NAME);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getOccasions()
      .then((res) => {
        const festive = res.data.occasions.find((o) => o.parentId === null && /festiv/i.test(o.name));
        if (cancelled) return;
        if (!festive) {
          setFestivalProducts([]);
          setLoading(false);
          return;
        }
        setOccasionName(festive.name);
        // ponytail: public list endpoint doesn't support occasion filtering
        // yet — 400s until backend adds it. Degrade to empty state, not an
        // error banner, since that's a missing feature, not a real failure.
        getProducts({ occasion: festive.name, sortBy: 'newest', pageSize: 6 })
          .then((r) => { if (!cancelled) { setFestivalProducts(r.data.products); setError(null); } })
          .catch(() => { if (!cancelled) setFestivalProducts([]); })
          .finally(() => { if (!cancelled) setLoading(false); });
      })
      .catch(() => { if (!cancelled) { setError('Failed to load products. Please refresh.'); setLoading(false); } });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-background">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <p className="text-accent text-sm font-semibold tracking-widest mb-4">
            FESTIVE COLLECTION
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6">
            Celebrate in Style
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Elevate your festive moments with our exclusive collection of kurtas and ethnic wear for Diwali, Holi, and celebrations.
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading && festivalProducts.length === 0 ? (
          <div className="mb-12"><ProductGridSkeleton count={6} /></div>
        ) : error && festivalProducts.length === 0 ? (
          <ProductLoadError message={error} onRetry={handleRetry} />
        ) : festivalProducts.length === 0 ? (
          <p className="text-center text-muted-foreground py-16 mb-12">No products found</p>
        ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {festivalProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative h-80 rounded-xl overflow-hidden mb-4 shadow-premium group-hover:shadow-premium-lg transition-all">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">{product.designer}</p>
                <h3 className="font-playfair text-lg font-semibold text-foreground group-hover:text-accent transition-colors mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-accent font-semibold">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        )}

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center">
          <Link href={`/shop?occasion=${encodeURIComponent(occasionName)}`}>
            <button className="inline-block px-8 py-4 bg-accent text-primary font-semibold rounded-xl hover:shadow-premium-lg transition-all hover:scale-105">
              View Full Festival Collection
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
