'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingBag, Sparkles } from 'lucide-react';
import { getAllProducts, getDisplayPrice, Product } from '@/lib/api/products';
import { loadImage, resizeImageFile, TryOnError } from '@/lib/try-on/overlay';
import { ImageSearchMatch, ImageSearchResult, preloadImageSearchModels, searchByImage } from '@/lib/try-on/image-search';
import { safeImageSrc } from '@/lib/utils';
import PhotoUpload from './PhotoUpload';


interface ImageSearchPanelProps {
  // When provided (embedded in the /try-on hub picker), selecting a result
  // hands the product back to the caller instead of navigating away.
  onSelectProduct?: (product: Product) => void;
}

function ResultCard({ match, onSelectProduct }: { match: ImageSearchMatch; onSelectProduct?: (product: Product) => void }) {
  const { product } = match;
  const { effectivePrice } = getDisplayPrice(product);

  return (
    <div className="rounded-xl border border-border bg-card/40 p-3 space-y-2">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
        <Image src={safeImageSrc(product.images[0])} alt={product.name} fill className="object-cover" />
      </div>
      <div>
        <p className="text-sm font-semibold truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground truncate">{product.designer}</p>
        <p className="text-sm font-semibold text-accent mt-1">₹{effectivePrice.toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/product/${product.id}`}
          className="flex-1 text-center py-2 rounded-lg border border-border text-xs font-semibold hover:bg-card transition-colors"
        >
          View
        </Link>
        {onSelectProduct ? (
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="flex-1 py-2 rounded-lg bg-accent text-luxury-black text-xs font-semibold flex items-center justify-center gap-1 hover:bg-gold transition-colors"
          >
            <Sparkles size={13} /> Try it on
          </button>
        ) : (
          <Link
            href={`/try-on?product=${product.id}`}
            className="flex-1 py-2 rounded-lg bg-accent text-luxury-black text-xs font-semibold flex items-center justify-center gap-1 hover:bg-gold transition-colors"
          >
            <Sparkles size={13} /> Try it on
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ImageSearchPanel({ onSelectProduct }: ImageSearchPanelProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<ImageSearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    preloadImageSearchModels();
    // Backend caps pageSize at 100, so page through; searchByImage applies its own CATALOGUE_CAP.
    getAllProducts()
      .then(setProducts)
      .catch(() => {
        setProducts([]);
        setSearchError('Could not load the catalogue. Please refresh and try again.');
      });
  }, []);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setPhotoError(null);
    setResult(null);
    setSearchError(null);
    try {
      setPhoto(await resizeImageFile(file));
    } catch {
      setPhotoError('Could not use that photo. Please try a different image.');
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setResult(null);
    setSearchError(null);
  };

  const handleSearch = async () => {
    if (!photo || !products?.length) return;
    setSearching(true);
    setSearchError(null);
    setResult(null);
    setProgress({ done: 0, total: products.length });
    try {
      const queryImg = await loadImage(photo);
      const found = await searchByImage(queryImg, products, (done, total) => setProgress({ done, total }));
      setResult(found);
    } catch (err) {
      setSearchError(err instanceof TryOnError ? err.message : 'Something went wrong searching. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <PhotoUpload
        photo={photo}
        error={photoError}
        label="Outfit photo"
        prompt="Upload a photo of the outfit"
        hint="A clear, well-lit photo of the garment works best."
        note="Your photo stays on your device."
        capture="environment"
        onFile={handleFile}
        onRemove={handleRemovePhoto}
      />

      <button
        type="button"
        onClick={handleSearch}
        disabled={!photo || !products?.length || searching}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
      >
        <Search size={18} />
        {searching
          ? progress
            ? `Analyzing catalogue… ${progress.done}/${progress.total}`
            : 'Searching…'
          : 'Search by image'}
      </button>

      {products && products.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">No products available to search right now.</p>
      )}
      {searchError && <p className="text-sm text-destructive text-center">{searchError}</p>}

      {result && (
        <div className="space-y-6 pt-4 border-t border-border">
          {result.exactMatches.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ShoppingBag size={16} className="text-accent" /> Exact match
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {result.exactMatches.map((m) => (
                  <ResultCard key={m.product.id} match={m} onSelectProduct={onSelectProduct} />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-bold">No exact match — similar designs</h3>
                {result.similarDesigns.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No similar designs found.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {result.similarDesigns.map((m) => (
                      <ResultCard key={m.product.id} match={m} onSelectProduct={onSelectProduct} />
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold">In this colour</h3>
                {result.similarColors.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No colour matches found.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {result.similarColors.map((m) => (
                      <ResultCard key={`color-${m.product.id}`} match={m} onSelectProduct={onSelectProduct} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
