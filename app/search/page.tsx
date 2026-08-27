'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import FilterSidebar, { FilterState } from '@/components/products/FilterSidebar';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ProductLoadError from '@/components/products/ProductLoadError';
import { searchProducts, recordSearchEvent } from '@/lib/api/search';
import { Product } from '@/lib/api/products';
import { Search as SearchIcon } from 'lucide-react';

const PAGE_SIZE = 24;

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'popularity' | 'rating' | 'price_asc' | 'price_desc'>('relevance');
  const [filters, setFilters] = useState<FilterState>({
    categories: [], designers: [], fabrics: [], occasions: [], sizes: [], colors: [],
    ratings: [], priceMin: 0, priceMax: 150000, inStockOnly: false,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const eventLoggedRef = useRef<string | null>(null);

  const fetchPage = useCallback((pageNum: number, append: boolean) => {
    if (!query.trim()) { setProducts([]); setTotal(0); setLoading(false); return; }
    (append ? setLoadingMore : setLoading)(true);
    searchProducts({
      search: query,
      category: filters.categories[0],
      brand: filters.designers[0],
      minPrice: filters.priceMin > 0 ? filters.priceMin : undefined,
      maxPrice: filters.priceMax < 150000 ? filters.priceMax : undefined,
      rating: filters.ratings.length > 0 ? Math.min(...filters.ratings) : undefined,
      size: filters.sizes[0],
      color: filters.colors[0],
      availability: filters.inStockOnly ? 'in_stock' : undefined,
      sortBy,
      page: pageNum,
      pageSize: PAGE_SIZE,
    })
      .then((res) => {
        setProducts((prev) => (append ? [...prev, ...res.data.products] : res.data.products));
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
        setError(null);

        // Only log once per query load (not on filter/sort tweaks or load-more).
        if (!append && eventLoggedRef.current !== query) {
          eventLoggedRef.current = query;
          recordSearchEvent({ query, resultsCount: res.data.total });
        }
      })
      .catch(() => setError('Failed to load search results. Please try again.'))
      .finally(() => { setLoading(false); setLoadingMore(false); });
  }, [query, filters, sortBy]);

  useEffect(() => {
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters, sortBy, reloadKey]);

  const handleRetry = () => setReloadKey((k) => k + 1);
  const handleLoadMore = () => fetchPage(page + 1, true);

  const handleProductClick = (productId: string) => {
    if (query.trim()) recordSearchEvent({ query, clickedProductId: productId });
  };

  return (
    <main className="bg-background text-foreground pt-28 md:pt-20">
      <div className="pt-28 pb-0 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent font-cormorant text-base tracking-widest uppercase mb-1">Search</p>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2">
              {query ? `Results for "${query}"` : 'Search'}
            </h1>
            {!loading && query && (
              <p className="text-muted-foreground">{total} products found</p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!query.trim() ? (
          <div className="text-center py-24">
            <SearchIcon className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">Type a search query to find products.</p>
          </div>
        ) : (
          <div className="flex gap-8">
            <aside className="hidden lg:block w-72 shrink-0 self-start">
              <div className="lg:sticky lg:top-24">
                <FilterSidebar onFiltersChange={setFilters} totalResults={total} />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{total}</span> products
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="newest">Newest First</option>
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              {loading && products.length === 0 ? (
                <ProductGridSkeleton />
              ) : error && products.length === 0 ? (
                <ProductLoadError message={error} onRetry={handleRetry} />
              ) : products.length === 0 ? (
                <div className="text-center py-24">
                  <SearchIcon className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <h3 className="font-playfair text-xl font-semibold mb-2">No results for &quot;{query}&quot;</h3>
                  <p className="text-muted-foreground text-sm">Try different keywords, or check for typos.</p>
                </div>
              ) : (
                <>
                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                        onClickCapture={() => handleProductClick(product.id)}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>

                  {page < totalPages && (
                    <div className="text-center mt-14">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-10 py-4 border-2 border-luxury-black text-luxury-black font-semibold rounded-xl hover:bg-luxury-black hover:text-luxury-ivory transition-all disabled:opacity-50"
                      >
                        {loadingMore ? 'Loading...' : 'Load More Products'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <SearchPageInner />
    </Suspense>
  );
}
