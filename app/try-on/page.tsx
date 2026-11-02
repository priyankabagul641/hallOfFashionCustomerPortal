'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import TryOnPanel from '@/components/try-on/TryOnPanel';
import ImageSearchPanel from '@/components/try-on/ImageSearchPanel';
import { getProduct, getProducts, isAccessoryProduct, Product, ProductDetail } from '@/lib/api/products';
import { safeImageSrc } from '@/lib/utils';
import { Camera, Search, Sparkles, X } from 'lucide-react';

function firstImage(product: Product | ProductDetail): string {
  const withColors = product as ProductDetail;
  return withColors.colorOptions?.[0]?.images?.[0] || product.images[0];
}

function TryOnPageInner() {
  const searchParams = useSearchParams();
  const preselectId = searchParams.get('product');

  const [pickerMode, setPickerMode] = useState<'text' | 'image'>('text');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Product | ProductDetail | null>(null);

  useEffect(() => {
    if (!preselectId) return;
    getProduct(preselectId)
      .then((res) => setSelected(res.data))
      .catch(() => {});
  }, [preselectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearching(true);
    const timeout = setTimeout(() => {
      getProducts({ search: query || undefined, pageSize: 20 })
        .then((res) => setResults(res.data.products.filter((p) => !isAccessoryProduct(p))))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <main className="min-h-screen bg-background">
      <section className="pt-28 pb-12 bg-luxury-black text-luxury-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="text-accent" size={24} />
              <span className="text-accent font-cormorant text-lg tracking-widest uppercase">Preview Before You Buy</span>
              <span className="rounded-full bg-accent/20 border border-accent px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent">
                Beta
              </span>
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-3">
              Virtual <span className="text-accent">Try-On</span>
            </h1>
            <p className="text-luxury-beige/70 text-base max-w-xl">
              Upload a photo and see a quick preview of how an outfit sits on you — right in your browser, nothing uploaded anywhere.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="text-lg font-bold">1. Pick a product</h2>

          {selected ? (
            <div className="flex items-center gap-3 rounded-xl border border-accent bg-card/40 p-3">
              <div className="relative h-20 w-16 rounded-lg overflow-hidden shrink-0">
                <Image src={safeImageSrc(firstImage(selected))} alt={selected.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{selected.name}</p>
                <p className="text-sm text-muted-foreground truncate">{selected.designer}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 rounded-full hover:bg-card transition-colors"
                aria-label="Change product"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPickerMode('text')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    pickerMode === 'text' ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:border-accent'
                  }`}
                >
                  <Search size={15} /> Search by text
                </button>
                <button
                  type="button"
                  onClick={() => setPickerMode('image')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    pickerMode === 'image' ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:border-accent'
                  }`}
                >
                  <Camera size={15} /> Search by image
                </button>
              </div>

              {pickerMode === 'text' ? (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search products…"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {searching && <p className="text-sm text-muted-foreground">Searching…</p>}
                    {!searching && results.length === 0 && (
                      <p className="text-sm text-muted-foreground">No products found.</p>
                    )}
                    {results.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => setSelected(product)}
                        className="w-full flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3 text-left hover:border-accent transition-colors"
                      >
                        <div className="relative h-16 w-12 rounded-lg overflow-hidden shrink-0">
                          <Image src={safeImageSrc(product.images[0])} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{product.designer}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <ImageSearchPanel onSelectProduct={(product) => setSelected(product)} />
              )}
            </>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">2. Your photo &amp; preview</h2>
          <TryOnPanel product={selected} productImageUrl={selected ? safeImageSrc(firstImage(selected)) : null} />
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function TryOnPage() {
  return (
    <Suspense fallback={null}>
      <TryOnPageInner />
    </Suspense>
  );
}
