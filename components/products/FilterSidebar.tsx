'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { getCategories } from '@/lib/api/products';

export interface FilterState {
  categories: string[];
  designers: string[];
  fabrics: string[];
  occasions: string[];
  ratings: number[];
  priceMin: number;
  priceMax: number;
}

interface FilterSidebarProps {
  onFiltersChange: (filters: FilterState) => void;
  totalResults: number;
  initialCategory?: string;
}

// Category options come from the live categories API (see effect below) —
// options must be real category names since the public product list only
// filters by exact category-name match, not a hardcoded slug set.
const STATIC_FILTER_SECTIONS = [
  {
    id: 'designers',
    label: 'Designer',
    options: [
      { label: 'House of Aryav', value: 'house-of-aryav' },
      { label: 'Regal Loom', value: 'regal-loom' },
      { label: 'Vardhan Atelier', value: 'vardhan-atelier' },
      { label: 'Aurum Legacy', value: 'aurum-legacy' },
      { label: 'Noor Heritage', value: 'noor-heritage' },
      { label: 'The Ivory Thread', value: 'ivory-thread' },
    ],
  },
  // ponytail: fabric/occasion sections removed — the public product list
  // endpoint doesn't return those fields (only product detail does), so
  // filtering on them silently matched nothing. Re-add once /products/public
  // includes fabricDetails/occasion, or filter server-side.
];

const PRICE_MIN = 0;
const PRICE_MAX = 150000;

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  designers: [],
  fabrics: [],
  occasions: [],
  ratings: [],
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
};

export default function FilterSidebar({ onFiltersChange, totalResults, initialCategory }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
  }));
  const [expanded, setExpanded] = useState<string[]>(['categories', 'designers']);
  const [priceInputMin, setPriceInputMin] = useState('');
  const [priceInputMax, setPriceInputMax] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategoryOptions(res.data.categories.map((c) => ({ label: c.name, value: c.name })));
      })
      .catch(() => setCategoryOptions([]));
  }, []);

  const FILTER_SECTIONS = useMemo(
    () => [{ id: 'categories', label: 'Category', options: categoryOptions }, ...STATIC_FILTER_SECTIONS],
    [categoryOptions]
  );

  // Emit changes upstream
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const toggleSection = (id: string) =>
    setExpanded((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const toggleMulti = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const toggleRating = (star: number) => {
    setFilters((prev) => ({
      ...prev,
      ratings: prev.ratings.includes(star)
        ? prev.ratings.filter((r) => r !== star)
        : [...prev.ratings, star],
    }));
  };

  const applyPriceInput = () => {
    const min = priceInputMin ? Math.max(PRICE_MIN, Number(priceInputMin)) : PRICE_MIN;
    const max = priceInputMax ? Math.min(PRICE_MAX, Number(priceInputMax)) : PRICE_MAX;
    setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }));
  };

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setPriceInputMin('');
    setPriceInputMax('');
  };

  const totalActive = filters.categories.length + filters.designers.length +
    filters.fabrics.length + filters.occasions.length + filters.ratings.length +
    (filters.priceMin > PRICE_MIN || filters.priceMax < PRICE_MAX ? 1 : 0);

  const pricePercent = ((filters.priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-luxury-black text-luxury-ivory">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-accent" />
          <span className="font-playfair font-semibold text-base">Filters</span>
          {totalActive > 0 && (
            <span className="bg-accent text-luxury-black text-xs font-bold px-2 py-0.5 rounded-full">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-luxury-beige hover:text-accent transition-colors"
          >
            <RotateCcw size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="px-5 py-3 bg-accent/5 border-b border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-accent text-sm">{totalResults}</span> products found
        </p>
      </div>

      {/* Active filter chips */}
      {totalActive > 0 && (
        <div className="px-5 py-3 border-b border-border flex flex-wrap gap-2">
          {(Object.entries({
            categories: filters.categories,
            designers: filters.designers,
            fabrics: filters.fabrics,
            occasions: filters.occasions,
          }) as [keyof FilterState, string[]][]).flatMap(([key, vals]) =>
            vals.map((v) => (
              <button
                key={`${key}-${v}`}
                onClick={() => toggleMulti(key, v)}
                className="flex items-center gap-1 bg-accent/15 text-accent text-xs font-medium px-2.5 py-1 rounded-full hover:bg-accent/25 transition-colors"
              >
                {FILTER_SECTIONS.find((s) => s.id === key)?.options.find((o) => o.value === v)?.label ?? v}
                <X size={10} />
              </button>
            ))
          )}
          {filters.ratings.map((r) => (
            <button
              key={`rating-${r}`}
              onClick={() => toggleRating(r)}
              className="flex items-center gap-1 bg-accent/15 text-accent text-xs font-medium px-2.5 py-1 rounded-full hover:bg-accent/25 transition-colors"
            >
              {r}★+ <X size={10} />
            </button>
          ))}
          {(filters.priceMin > PRICE_MIN || filters.priceMax < PRICE_MAX) && (
            <button
              onClick={() => { setFilters((p) => ({ ...p, priceMin: PRICE_MIN, priceMax: PRICE_MAX })); setPriceInputMin(''); setPriceInputMax(''); }}
              className="flex items-center gap-1 bg-accent/15 text-accent text-xs font-medium px-2.5 py-1 rounded-full hover:bg-accent/25 transition-colors"
            >
              ₹{(filters.priceMin / 1000).toFixed(0)}k–₹{(filters.priceMax / 1000).toFixed(0)}k <X size={10} />
            </button>
          )}
        </div>
      )}

      <div className="divide-y divide-border">
        {/* Price Range */}
        <div className="px-5 py-4">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between mb-0 group"
          >
            <span className="font-semibold text-sm">Price Range</span>
            <ChevronDown
              size={16}
              className={`text-muted-foreground transition-transform duration-200 ${expanded.includes('price') ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {expanded.includes('price') !== false && (
              <motion.div
                initial={false}
                className="mt-4 space-y-4"
              >
                {/* Preset price ranges */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Under ₹25k', min: 0, max: 25000 },
                    { label: '₹25k–₹50k', min: 25000, max: 50000 },
                    { label: '₹50k–₹1L', min: 50000, max: 100000 },
                    { label: 'Above ₹1L', min: 100000, max: 150000 },
                  ].map((preset) => {
                    const isActive = filters.priceMin === preset.min && filters.priceMax === preset.max;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => setFilters((p) => ({ ...p, priceMin: preset.min, priceMax: preset.max }))}
                        className={`text-xs px-2 py-2 rounded-lg border font-medium transition-all ${isActive
                            ? 'bg-accent text-luxury-black border-accent'
                            : 'border-border hover:border-accent hover:text-accent text-muted-foreground'
                          }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Slider */}
                <div className="space-y-2">
                  <div className="relative h-1.5 bg-border rounded-full">
                    <div
                      className="absolute h-full bg-accent rounded-full"
                      style={{
                        left: `${(filters.priceMin / PRICE_MAX) * 100}%`,
                        right: `${100 - (filters.priceMax / PRICE_MAX) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={1000}
                      value={filters.priceMin}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), filters.priceMax - 1000);
                        setFilters((p) => ({ ...p, priceMin: val }));
                      }}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                    />
                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={1000}
                      value={filters.priceMax}
                      onChange={(e) => {
                        const val = Math.max(Number(e.target.value), filters.priceMin + 1000);
                        setFilters((p) => ({ ...p, priceMax: val }));
                      }}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹{filters.priceMin.toLocaleString('en-IN')}</span>
                    <span>₹{filters.priceMax.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Custom min/max input */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Min price
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="₹0"
                      value={priceInputMin}
                      onChange={(e) => setPriceInputMin(e.target.value)}
                      onBlur={applyPriceInput}
                      onKeyDown={(e) => e.key === 'Enter' && applyPriceInput()}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Max price
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="₹150000"
                      value={priceInputMax}
                      onChange={(e) => setPriceInputMax(e.target.value)}
                      onBlur={applyPriceInput}
                      onKeyDown={(e) => e.key === 'Enter' && applyPriceInput()}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>
                {/* <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={priceInputMin}
                    onChange={(e) => setPriceInputMin(e.target.value)}
                    onBlur={applyPriceInput}
                    onKeyDown={(e) => e.key === 'Enter' && applyPriceInput()}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-muted-foreground/60"
                  />
                  <span className="text-muted-foreground text-xs">–</span>
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={priceInputMax}
                    onChange={(e) => setPriceInputMax(e.target.value)}
                    onBlur={applyPriceInput}
                    onKeyDown={(e) => e.key === 'Enter' && applyPriceInput()}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-muted-foreground/60"
                  />
                </div> */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating */}
        <div className="px-5 py-4">
          <button
            onClick={() => toggleSection('rating')}
            className="w-full flex items-center justify-between mb-0"
          >
            <span className="font-semibold text-sm">Rating</span>
            <ChevronDown
              size={16}
              className={`text-muted-foreground transition-transform duration-200 ${expanded.includes('rating') ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {expanded.includes('rating') !== false && (
              <div className="mt-4 space-y-2">
                {[4, 3, 2].map((star) => {
                  const isChecked = filters.ratings.includes(star);
                  return (
                    <label key={star} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRating(star)}
                        className="sr-only"
                      />
                      <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${isChecked
                          ? 'bg-accent border-accent'
                          : 'border-border group-hover:border-accent'
                        }`}>
                        {isChecked && (
                          <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                            <path d="M1 5l3 3 7-7" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < star ? 'text-accent' : 'text-muted-foreground/30'}>★</span>
                        ))}
                        <span className="text-muted-foreground text-xs ml-1">& above</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic sections */}
        {FILTER_SECTIONS.map((section) => {
          const selected = filters[section.id as keyof FilterState] as string[];
          const isOpen = expanded.includes(section.id);

          return (
            <div key={section.id} className="px-5 py-4">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{section.label}</span>
                  {selected.length > 0 && (
                    <span className="bg-accent text-luxury-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {selected.length}
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-2.5">
                      {section.options.map((option) => {
                        const isChecked = selected.includes(option.value);
                        return (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleMulti(section.id as keyof FilterState, option.value)}
                              className="sr-only"
                            />
                            <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${isChecked
                                ? 'bg-accent border-accent'
                                : 'border-border group-hover:border-accent/60'
                              }`}>
                              {isChecked && (
                                <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                                  <path d="M1 5l3 3 7-7" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                            <span className={`text-sm transition-colors ${isChecked ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Clear all footer */}
      {totalActive > 0 && (
        <div className="px-5 py-4 border-t border-border bg-muted/20">
          <button
            onClick={clearAll}
            className="w-full py-2.5 border border-border text-sm font-semibold rounded-xl hover:border-destructive hover:text-destructive transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} /> Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
