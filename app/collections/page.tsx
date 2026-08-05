'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { getPublicCollections, PublicCollection } from '@/lib/api/collections';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ProductLoadError from '@/components/products/ProductLoadError';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<PublicCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getPublicCollections()
      .then((res) => { if (!cancelled) { setCollections(res.data.collections); setError(null); } })
      .catch(() => { if (!cancelled) setError('Failed to load collections. Please refresh.'); })
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-4">
              All Collections
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Explore our complete range of curated collections, each designed to
              celebrate your unique style and special moments
            </p>
          </motion.div>

          {loading ? (
            <ProductGridSkeleton />
          ) : error ? (
            <ProductLoadError message={error} onRetry={handleRetry} />
          ) : collections.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-playfair text-xl font-semibold mb-2">No collections yet</p>
              <p className="text-muted-foreground text-sm mb-6">Check back soon for new curated collections</p>
              <Link href="/shop">
                <button className="px-8 py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all">
                  Browse All Products
                </button>
              </Link>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {collections.map((collection) => (
                <motion.div key={collection.id} variants={itemVariants}>
                  <Link href={`/collection/${collection.id}`}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="group cursor-pointer"
                    >
                      {/* Image */}
                      <div className="relative h-96 rounded-2xl overflow-hidden mb-6 shadow-premium hover:shadow-premium-lg transition-all duration-500 bg-card">
                        <Image
                          src={collection.image || '/placeholder.jpg'}
                          alt={collection.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors duration-500" />

                        {/* Hover Content */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                        >
                          <p className="text-white/90 text-sm font-light mb-4">
                            {collection.description}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="px-6 py-2 bg-accent text-luxury-black font-semibold rounded-lg"
                          >
                            Explore
                          </motion.button>
                        </motion.div>
                      </div>

                      {/* Collection Info */}
                      <div>
                        <h3 className="text-2xl font-playfair font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                          {collection.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {collection.description}
                        </p>
                        <p className="text-sm text-accent font-medium">
                          {collection.productCount} pieces
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
