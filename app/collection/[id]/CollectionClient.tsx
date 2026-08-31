'use client';

import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import {
  getPublicCollection,
  getPublicCollectionProducts,
  CollectionProduct,
  PublicCollection,
} from '@/lib/api/collections';
import { safeImageSrc } from '@/lib/utils';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ProductLoadError from '@/components/products/ProductLoadError';
import { ChevronLeft, Tag } from 'lucide-react';

const FALLBACK_BANNER =
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80';

function toProductCardProps(p: CollectionProduct) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    mrp: p.mrp,
    discountedPrice: p.discountedPrice,
    salePrice: p.salePrice,
    saleDiscountPercent: p.saleDiscountPercent,
    images: p.images,
    designer: p.vendorName,
    rating: 0,
    reviews: 0,
    stock: p.stock,
  };
}

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [collection, setCollection] = useState<PublicCollection | null>(null);
  const [products, setProducts] = useState<CollectionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getPublicCollection(id),
      getPublicCollectionProducts(id, { page: 1, pageSize: 100 }),
    ])
      .then(([collectionRes, productsRes]) => {
        if (cancelled) return;
        setCollection(collectionRes.data);
        setProducts(productsRes.data.products);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load this collection. Please refresh.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const title = collection?.name ?? 'Collection';
  const description =
    collection?.description ?? 'Explore this curated collection of premium men\'s fashion.';
  const banner = safeImageSrc(collection?.image, FALLBACK_BANNER);

  return (
    <main className="min-h-screen bg-background">

      {/* Hero Banner */}
      <section className="relative h-72 md:h-96 overflow-hidden pt-20">
        <Image
          src={banner}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-8 pb-10 max-w-7xl mx-auto left-0 right-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/collections" className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-3 transition-colors w-fit">
              <ChevronLeft size={15} /> All Collections
            </Link>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-2">{title}</h1>
            <p className="text-white/70 text-sm md:text-base max-w-xl">{description}</p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 pb-5 border-b border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground text-base">{products.length}</span> pieces in this collection
            </p>
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-accent" />
              <span className="text-xs text-muted-foreground">Free shipping on orders above ₹2,000</span>
            </div>
          </div>

          {/* Grid */}
          {loading && products.length === 0 ? (
            <ProductGridSkeleton />
          ) : error ? (
            <ProductLoadError message={error} onRetry={handleRetry} />
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-playfair text-xl font-semibold mb-2">No products found</p>
              <p className="text-muted-foreground text-sm mb-6">Check back soon for new arrivals</p>
              <Link href="/shop">
                <button className="px-8 py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all">
                  Browse All Products
                </button>
              </Link>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                >
                  <ProductCard product={toProductCardProps(product)} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA */}
          <div className="text-center mt-14 pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm mb-4">Looking for something specific?</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/shop">
                <button className="px-8 py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all">
                  Browse All Products
                </button>
              </Link>
              <Link href="/customize">
                <button className="px-8 py-3 border border-border rounded-xl font-semibold hover:border-accent hover:text-accent transition-all">
                  Custom Order
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
