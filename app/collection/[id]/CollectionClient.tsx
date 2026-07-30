'use client';

import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { getAllProducts, Product } from '@/lib/api/products';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ProductLoadError from '@/components/products/ProductLoadError';
import { ChevronLeft, Tag } from 'lucide-react';

// Map every slug used across the codebase to a display config.
// matchFn only reads category/subcategory — occasion/tags aren't returned by
// the public product-list endpoint (only on the detail endpoint).
const COLLECTION_MAP: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  banner: string;
  matchFn: (p: Product) => boolean;
}> = {
  // numeric ids from CollectionsGrid
  '1': {
    title: 'Sherwanis',
    subtitle: 'Royal Bridal Collection',
    description: 'Magnificent sherwanis crafted for wedding ceremonies. Each piece embodies royal Indian heritage with hand-embroidered motifs and premium fabrics.',
    banner: '/products/sherwani-collection.png',
    matchFn: (p) => p.category?.toLowerCase().includes('sherwani') || p.subcategory?.toLowerCase().includes('sherwani'),
  },
  '2': {
    title: 'Indo-Western',
    subtitle: 'Fusion Couture',
    description: 'Where Indian tradition meets contemporary fashion. Bandhgalas, Nehru jackets, and fusion silhouettes for the modern gentleman.',
    banner: '/products/Indo-western-collection.png',
    matchFn: (p) => p.category?.toLowerCase().includes('indo') || p.subcategory?.toLowerCase().includes('bandhgala') || p.subcategory?.toLowerCase().includes('nehru'),
  },
  '3': {
    title: 'Kurtas',
    subtitle: 'Festive Ethnic Wear',
    description: 'From silk festive kurtas to casual linen styles — our kurta collection covers every occasion with effortless elegance.',
    banner: '/products/kurtas-collection.png',
    matchFn: (p) => p.category?.toLowerCase().includes('kurta') || p.subcategory?.toLowerCase().includes('kurta'),
  },
  '4': {
    title: 'Blazers & Suits',
    subtitle: 'Premium Formal Wear',
    description: 'Impeccably tailored blazers and suits for the discerning gentleman. Classic cuts, premium fabrics, and perfect finishing.',
    banner: '/products/blazer-suits-collection.png',
    matchFn: (p) => p.category?.toLowerCase().includes('blazer') || p.category?.toLowerCase().includes('suit') || p.subcategory?.toLowerCase().includes('blazer'),
  },
  // named slugs from Navbar, Footer, banners
  'sherwanis': {
    title: 'Sherwanis',
    subtitle: 'Royal Bridal Collection',
    description: 'Magnificent sherwanis crafted for wedding ceremonies. Each piece embodies royal Indian heritage with hand-embroidered motifs and premium fabrics.',
    banner: '/products/sherwani-collection.png',
    matchFn: (p) => p.category?.toLowerCase().includes('sherwani') || p.subcategory?.toLowerCase().includes('sherwani'),
  },
  'indo-western': {
    title: 'Indo-Western',
    subtitle: 'Fusion Couture',
    description: 'Where Indian tradition meets contemporary fashion. Bandhgalas, Nehru jackets, and fusion silhouettes for the modern gentleman.',
    banner: '/products/Indo-western-collection.png',
    matchFn: (p) => p.category?.toLowerCase().includes('indo') || p.subcategory?.toLowerCase().includes('bandhgala') || p.subcategory?.toLowerCase().includes('nehru'),
  },
  'kurtas': {
    title: 'Kurtas',
    subtitle: 'Festive Ethnic Wear',
    description: 'From silk festive kurtas to casual linen styles — our kurta collection covers every occasion with effortless elegance.',
    banner: '/products/kurtas-collection.png',
    matchFn: (p) => p.category?.toLowerCase().includes('kurta') || p.subcategory?.toLowerCase().includes('kurta'),
  },
  'blazers': {
    title: 'Blazers & Suits',
    subtitle: 'Premium Formal Wear',
    description: 'Impeccably tailored blazers and suits for the discerning gentleman.',
    banner: '/products/blazer-suits-collection.png',
    matchFn: (p) => p.category?.toLowerCase().includes('blazer') || p.subcategory?.toLowerCase().includes('blazer'),
  },
  'waistcoat': {
    title: 'Waistcoats',
    subtitle: 'Refined Classics',
    description: 'Elegant waistcoats that add sophistication to any ensemble — from ornate embroidered pieces to clean minimalist cuts.',
    banner: 'https://images.unsplash.com/photo-1617606002768-8082e0a73a5b?w=1200&q=80',
    matchFn: (p) => p.category?.toLowerCase().includes('waistcoat') || p.subcategory?.toLowerCase().includes('waistcoat'),
  },
  'festive': {
    title: 'Festive Collection',
    subtitle: 'Celebrate in Style',
    description: 'Vibrant, richly embellished outfits designed for Diwali, Eid, Navratri, and all festive celebrations. Colour, craft, and joy.',
    banner: '/products/Festive-collection.png',
    matchFn: (p) => p.category?.toLowerCase().includes('festive') || p.subcategory?.toLowerCase().includes('festive'),
  },
  'groom': {
    title: 'Groom Collection',
    subtitle: 'Your Perfect Wedding Look',
    description: 'Curated exclusively for the groom. Statement sherwanis, bespoke suits, and timeless Indo-western sets to make your wedding day unforgettable.',
    banner: '/products/groom-collection-3.png',
    matchFn: (p) => p.category?.toLowerCase().includes('groom') || p.subcategory?.toLowerCase().includes('groom') || p.subcategory?.toLowerCase().includes('sherwani'),
  },
  'accessories': {
    title: 'Accessories',
    subtitle: 'Complete Your Look',
    description: 'From heritage silk stoles to luxury leather mojaris — our accessories collection helps you perfect every outfit.',
    banner: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=80',
    matchFn: (p) => p.category?.toLowerCase().includes('accessor'),
  },
};

const FALLBACK = {
  title: 'Collection',
  subtitle: 'Premium Men\'s Fashion',
  description: 'Explore our premium curated selection of men\'s ethnic and designer wear.',
  banner: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80',
  matchFn: () => true,
};

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const config = COLLECTION_MAP[id] ?? FALLBACK;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getAllProducts()
      .then((products) => { if (!cancelled) { setProducts(products); setError(null); } })
      .catch(() => { if (!cancelled) setError('Failed to load products. Please refresh.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const collectionProducts = products.filter(config.matchFn);
  // Fallback: show all products if no matches (e.g. unknown slug)
  const displayProducts = collectionProducts.length > 0 ? collectionProducts : products;

  return (
    <main className="min-h-screen bg-background">

      {/* Hero Banner */}
      <section className="relative h-72 md:h-96 overflow-hidden pt-20">
        <img
          src={config.banner}
          alt={config.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-8 pb-10 max-w-7xl mx-auto left-0 right-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/collections" className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-3 transition-colors w-fit">
              <ChevronLeft size={15} /> All Collections
            </Link>
            <p className="text-accent font-cormorant text-base tracking-widest uppercase mb-1">{config.subtitle}</p>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-2">{config.title}</h1>
            <p className="text-white/70 text-sm md:text-base max-w-xl">{config.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 pb-5 border-b border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground text-base">{displayProducts.length}</span> pieces in this collection
            </p>
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-accent" />
              <span className="text-xs text-muted-foreground">Free shipping on orders above ₹2,000</span>
            </div>
          </div>

          {/* Grid */}
          {loading && products.length === 0 ? (
            <ProductGridSkeleton />
          ) : error && products.length === 0 ? (
            <ProductLoadError message={error} onRetry={handleRetry} />
          ) : displayProducts.length === 0 ? (
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
              {displayProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                >
                  <ProductCard product={product} />
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
