'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import FilterSidebar, { FilterState } from '@/components/products/FilterSidebar';
import { products as allProducts } from '@/data/products';
import { SlidersHorizontal, Grid3X3, List, X, Search } from 'lucide-react';

export default function ShopPage() {
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const productsSectionRef = useRef<HTMLDivElement | null>(null);
  const initialRenderRef = useRef(true);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    designers: [],
    fabrics: [],
    occasions: [],
    ratings: [],
    priceMin: 0,
    priceMax: 150000,
  });

  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    const target = productsSectionRef.current;
    if (!target) return;

    const topOffset = 120;
    const topPosition = target.getBoundingClientRect().top + window.scrollY - topOffset;

    window.scrollTo({ top: Math.max(topPosition, 0), behavior: 'smooth' });
  }, [filters, searchQuery, sortBy]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.designer.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        filters.categories.some((c) =>
          p.category?.toLowerCase().includes(c) ||
          p.subcategory?.toLowerCase().includes(c)
        )
      );
    }

    // Designer
    if (filters.designers.length > 0) {
      result = result.filter((p) =>
        filters.designers.some((d) => p.designer?.toLowerCase().includes(d.replace(/-/g, ' ')))
      );
    }

    // Fabric
    if (filters.fabrics.length > 0) {
      result = result.filter((p) =>
        filters.fabrics.some((f) => p.fabricDetails?.toLowerCase().includes(f))
      );
    }

    // Occasion
    if (filters.occasions.length > 0) {
      result = result.filter((p) =>
        filters.occasions.some((o) => p.occasion?.toLowerCase().includes(o))
      );
    }

    // Rating
    if (filters.ratings.length > 0) {
      const minRating = Math.min(...filters.ratings);
      result = result.filter((p) => p.rating >= minRating);
    }

    // Price
    result = result.filter(
      (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    // Sort
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'popular': result.sort((a, b) => b.reviews - a.reviews); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
    }

    return result;
  }, [filters, sortBy, searchQuery]);

  const activeFilterCount =
    filters.categories.length +
    filters.designers.length +
    filters.fabrics.length +
    filters.occasions.length +
    filters.ratings.length +
    (filters.priceMin > 0 || filters.priceMax < 150000 ? 1 : 0);

  return (
    <main className="bg-background text-foreground pt-28 md:pt-20">
      {/* Page Header */}
      <div className="pt-28 pb-0 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <p className="text-accent font-cormorant text-base tracking-widest uppercase mb-1">Explore</p>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2">Men&apos;s Collection</h1>
            <p className="text-muted-foreground">
              {allProducts.length} premium pieces — sherwanis, kurtas, indo-western & more
            </p>
          </motion.div>

          {/* Search bar */}
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
            <input
              type="text"
              placeholder="Search by name, designer, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 border border-border rounded-xl bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar — Desktop */}
          <aside className="hidden lg:block w-72 shrink-0 self-start">
            <div className="lg:sticky lg:top-24">
              <FilterSidebar onFiltersChange={handleFiltersChange} totalResults={filteredProducts.length} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0" ref={productsSectionRef}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-border">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-semibold hover:border-accent hover:text-accent transition-all"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-accent text-luxury-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{filteredProducts.length}</span> products
                  {activeFilterCount > 0 && (
                    <span className="text-accent ml-1">({activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active)</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* View toggle */}
                <div className="hidden sm:flex border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-luxury-black text-luxury-ivory' : 'hover:bg-muted'}`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-luxury-black text-luxury-ivory' : 'hover:bg-muted'}`}
                  >
                    <List size={16} />
                  </button>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid / List */}
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <Search className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="font-playfair text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={() => { setFilters({ categories: [], designers: [], fabrics: [], occasions: [], ratings: [], priceMin: 0, priceMax: 150000 }); setSearchQuery(''); }}
                  className="px-8 py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Load more */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-14">
                <button className="px-10 py-4 border-2 border-luxury-black text-luxury-black font-semibold rounded-xl hover:bg-luxury-black hover:text-luxury-ivory transition-all">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-background z-50 lg:hidden flex flex-col shadow-premium-lg"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-luxury-black text-luxury-ivory">
                <span className="font-playfair font-bold">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 hover:text-accent transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
                <FilterSidebar onFiltersChange={handleFiltersChange} totalResults={filteredProducts.length} />
              </div>
              <div className="sticky bottom-0 p-4 bg-background border-t border-border">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
