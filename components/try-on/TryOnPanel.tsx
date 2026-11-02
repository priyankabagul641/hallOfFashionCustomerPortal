'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, ShoppingBag, Sparkles, X } from 'lucide-react';
import { Product } from '@/lib/api/products';
import {
  loadImage,
  preloadTryOnModels,
  proxiedProductImageUrl,
  renderTryOn,
  resizeImageFile,
  TryOnError,
} from '@/lib/try-on/overlay';
import { safeImageSrc } from '@/lib/utils';
import PhotoUpload from './PhotoUpload';

const PHOTO_STORAGE_KEY = 'hof_tryon_photo';

function loadStoredPhoto(): string | null {
  try {
    return localStorage.getItem(PHOTO_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storePhoto(dataUrl: string | null) {
  try {
    if (dataUrl) localStorage.setItem(PHOTO_STORAGE_KEY, dataUrl);
    else localStorage.removeItem(PHOTO_STORAGE_KEY);
  } catch {
    // localStorage unavailable/full — the photo still works for this session.
  }
}

interface TryOnPanelProps {
  product: Product | null;
  productImageUrl: string | null;
  // Present when the panel is already open on that product's own page (the
  // product-detail dialog) — "buy" then just closes the dialog instead of
  // navigating. Omitted from the hub, where "buy" links to the product page.
  onClose?: () => void;
}

export default function TryOnPanel({ product, productImageUrl, onClose }: TryOnPanelProps) {
  const safeProductImageUrl = productImageUrl ? safeImageSrc(productImageUrl) : null;

  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  useEffect(() => {
    preloadTryOnModels();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhoto(loadStoredPhoto());
  }, []);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setPhotoError(null);
    setResultUrl(null);
    try {
      const resized = await resizeImageFile(file);
      setPhoto(resized);
      storePhoto(resized);
    } catch {
      setPhotoError('Could not use that photo. Please try a different image.');
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setResultUrl(null);
    storePhoto(null);
  };

  const handleGenerate = async () => {
    if (!photo || !safeProductImageUrl) return;
    setGenerating(true);
    setGenError(null);
    setResultUrl(null);
    try {
      const [customerImg, productImg] = await Promise.all([
        loadImage(photo),
        loadImage(proxiedProductImageUrl(safeProductImageUrl)),
      ]);
      const canvas = await renderTryOn(customerImg, productImg);
      setResultUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      setGenError(err instanceof TryOnError ? err.message : 'Something went wrong generating the preview. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'try-on-preview.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      <PhotoUpload
        photo={photo}
        error={photoError}
        label="Your photo"
        prompt="Upload a full-body photo"
        hint="Front-facing, full body, plain background, and good light works best."
        note="Your photo stays on your device."
        capture="user"
        onFile={handleFile}
        onRemove={handleRemovePhoto}
      />

      {product && safeProductImageUrl && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3">
          <div className="relative h-16 w-12 rounded-lg overflow-hidden shrink-0">
            <Image src={safeProductImageUrl} alt={product.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{product.name}</p>
            <p className="text-xs text-muted-foreground truncate">{product.designer}</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!photo || !safeProductImageUrl || generating}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
      >
        <Sparkles size={18} />
        {generating ? 'Generating preview…' : 'Generate try-on preview'}
      </button>

      {!product && <p className="text-xs text-muted-foreground text-center">Pick a product above to continue.</p>}
      {genError && <p className="text-sm text-destructive text-center">{genError}</p>}

      {resultUrl && photo && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Your photo</p>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element -- local data URL */}
                <img src={photo} alt="Your photo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-accent mb-1 uppercase tracking-wide">Try-on preview</p>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-accent">
                {/* eslint-disable-next-line @next/next/no-img-element -- generated canvas data URL */}
                <img src={resultUrl} alt="Try-on preview" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Preview only — not a guide to fit or size.{' '}
            <Link href="/measurements" className="text-accent hover:underline">
              See Size Guide / Measurements
            </Link>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="py-2.5 rounded-lg border border-border font-semibold flex items-center justify-center gap-2 hover:bg-card transition-colors text-sm"
            >
              <Download size={16} /> Download
            </button>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 rounded-lg bg-accent text-luxury-black font-semibold flex items-center justify-center gap-2 hover:bg-gold transition-colors text-sm"
              >
                <ShoppingBag size={16} /> Choose size &amp; buy
              </button>
            ) : (
              product && (
                <Link
                  href={`/product/${product.id}`}
                  className="py-2.5 rounded-lg bg-accent text-luxury-black font-semibold flex items-center justify-center gap-2 hover:bg-gold transition-colors text-sm"
                >
                  <ShoppingBag size={16} /> Choose size &amp; buy
                </Link>
              )
            )}
            <button
              type="button"
              onClick={() => {
                setResultUrl(null);
                setGenError(null);
              }}
              className="py-2.5 rounded-lg border border-border font-semibold flex items-center justify-center gap-2 hover:bg-card transition-colors text-sm"
            >
              <X size={16} /> Try another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
