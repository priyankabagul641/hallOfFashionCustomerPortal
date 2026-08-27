'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { getProduct, getDisplayPrice, ProductDetail } from '@/lib/api/products';
import { getProductReviews, submitProductReview, Review } from '@/lib/api/reviews';
import { ApiError } from '@/lib/api-client';
import ProductLoadError from '@/components/products/ProductLoadError';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';

import { MeasurementProfile, summarizeMeasurementProfile } from '@/data/measurements';
import MeasurementProfilePickerModal from '@/components/measurements/MeasurementProfilePickerModal';
import { Heart, ShoppingBag, Share2, Check, Star, Truck, RotateCcw, CheckCircle, ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColorOption, setSelectedColorOption] = useState<{ name: string; hex: string; images: string[] } | null>(null);
  const [activeInfoTab, setActiveInfoTab] = useState<'details' | 'shipping' | 'support'>('details');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [selectedMeasurementProfile, setSelectedMeasurementProfile] = useState<MeasurementProfile | null>(null);
  const [showCustomSizePicker, setShowCustomSizePicker] = useState(false);

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsPage, setReviewsPage] = useState(1);
  const REVIEWS_PAGE_SIZE = 10;

  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState<string | null>(null);

  const visibleReviews = reviews.slice(0, 4);

  const loadReviews = (productId: string, page: number) => {
    setReviewsLoading(true);
    getProductReviews(productId, { page, pageSize: REVIEWS_PAGE_SIZE, sortBy: 'newest' })
      .then((res) => {
        setReviews((prev) => (page === 1 ? res.data.reviews : [...prev, ...res.data.reviews]));
        setReviewsTotal(res.data.meta.total);
        setReviewsPage(page);
      })
      .catch(() => {
        if (page === 1) {
          setReviews([]);
          setReviewsTotal(0);
        }
      })
      .finally(() => setReviewsLoading(false));
  };

  const handleLoadMoreReviews = () => {
    if (!product) return;
    loadReviews(product.id, reviewsPage + 1);
  };

  const handleSubmitReview = () => {
    if (!product) return;
    if (!reviewComment.trim()) {
      setReviewSubmitError('Please write a comment.');
      return;
    }
    setReviewSubmitting(true);
    setReviewSubmitError(null);
    submitProductReview(product.id, {
      rating: reviewRating,
      title: reviewTitle.trim() || undefined,
      comment: reviewComment.trim(),
    })
      .then(() => {
        toast.success('Review submitted! It will appear after moderation.');
        setShowWriteReview(false);
        setReviewTitle('');
        setReviewComment('');
        setReviewRating(5);
      })
      .catch((err: ApiError) => {
        setReviewSubmitError(err?.message ?? 'Failed to submit review.');
      })
      .finally(() => setReviewSubmitting(false));
  };

  useEffect(() => {
    const productId = params.id as string;
    let cancelled = false;
    getProduct(productId)
      .then((res) => {
        if (cancelled) return;
        const foundProduct = res.data;
        setProduct(foundProduct);
        setNotFound(false);
        setError(null);
        const firstColor = foundProduct.colorOptions?.[0];
        const firstColorName = firstColor?.color ?? 'Default';
        setSelectedColorOption(
          firstColor
            ? { name: firstColor.color, hex: firstColor.colorCode || '#c8a56b', images: firstColor.images }
            : { name: 'Default', hex: '#c8a56b', images: foundProduct.images }
        );
        const sizesForFirstColor = (foundProduct.variants ?? [])
          .filter((v) => v.color === firstColorName && v.stock > 0)
          .map((v) => v.size);
        setSelectedSize(sizesForFirstColor[0] ?? '');
        setSelectedImage(0);
        setLoadedImages({});
        loadReviews(foundProduct.id, 1);
      })
      .catch((err: ApiError) => {
        if (cancelled) return;
        if (err?.status === 404) setNotFound(true);
        else setError('Failed to load product. Please refresh.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [params.id, reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const { effectivePrice, mrp, percentOff } = product
    ? getDisplayPrice(product)
    : { effectivePrice: 0, mrp: 0, percentOff: undefined };

  const isWishlisted = product ? isInWishlist(product.id) : false;
  const availableColors = product?.colorOptions?.length
    ? product.colorOptions.map((c) => ({ name: c.color, hex: c.colorCode || '#c8a56b', images: c.images }))
    : product
      ? [{ name: 'Default', hex: '#c8a56b', images: product.images }]
      : [];
  const activeImages = selectedColorOption?.images?.length ? selectedColorOption.images : product?.images ?? [];
  const availableSizes: { size: string; inStock: boolean }[] = selectedColorOption
    ? Array.from(
        (product?.variants ?? [])
          .filter((v) => v.color === selectedColorOption.name)
          .reduce((map, v) => {
            const existing = map.get(v.size);
            map.set(v.size, existing ? existing || v.stock > 0 : v.stock > 0);
            return map;
          }, new Map<string, boolean>())
      ).map(([size, inStock]) => ({ size, inStock }))
    : [];

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (selectedSize === 'custom' && !selectedMeasurementProfile) {
      toast.error('Please select or create a custom size profile');
      return;
    }

    if (!selectedColorOption) {
      toast.error('Please select a color');
      return;
    }

    const matchedVariant = product.variants?.find(
      (v) => v.color === selectedColorOption.name && v.size === selectedSize
    );
    const variantId = matchedVariant?.variantId;

    addToCart({
      productId: product.id,
      variantId,
      name: product.name,
      price: effectivePrice,
      mrp: mrp !== effectivePrice ? mrp : undefined,
      quantity: quantity,
      image: activeImages[0] || product.images[0],
      size: selectedSize,
      color: selectedColorOption.name,
      designer: product.designer,
      isCustomSize: selectedSize === 'custom',
      gstRate: product.gstRate,
      shippingCharge: product.shippingCharge,
      measurementProfileId: selectedMeasurementProfile?.id,
      measurementProfileName: selectedMeasurementProfile?.name,
      measurementType: selectedMeasurementProfile?.measurementType,
      measurementUnit: selectedMeasurementProfile?.unit,
      measurementSnapshot: selectedMeasurementProfile?.measurements,
    });

    setIsAddedToCart(true);
    toast.success(`${product.name} added to cart!`, {
      description:
        selectedSize === 'custom' && selectedMeasurementProfile
          ? `${selectedMeasurementProfile.name}, Qty: ${quantity}`
          : `Size: ${selectedSize}, Qty: ${quantity}`,
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart'),
      },
    });

    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: effectivePrice,
        mrp: mrp !== effectivePrice ? mrp : undefined,
        image: product.images[0],
        designer: product.designer,
        gstRate: product.gstRate,
        shippingCharge: product.shippingCharge,
      });
      toast.success('Added to wishlist!', {
        action: {
          label: 'View Wishlist',
          onClick: () => router.push('/wishlist'),
        },
      });
    }
  };

  const handleShare = async () => {
    if (!product) return;

    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} by ${product.designer}`,
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCustomSizeSelect = (profile: MeasurementProfile) => {
    setSelectedSize('custom');
    setSelectedMeasurementProfile(profile);
    setShowCustomSizePicker(false);
  };

  if (loading) {
    return (
      <main className="bg-background text-foreground min-h-screen flex flex-col">
        <div className="flex-1 pt-28 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
              ))}
            </div>
            <div className="lg:col-span-5 space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-background text-foreground">
        <div className="flex items-center justify-center pt-28 pb-32">
          <ProductLoadError message={error} onRetry={handleRetry} />
        </div>
        <Footer />
      </main>
    );
  }

  if (!product || notFound) {
    return (
      <main className="bg-background text-foreground">
        <div className="flex items-center justify-center pt-28 pb-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-playfair font-bold">Product Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The product you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-premium transition-all"
              >
                Browse Collection
              </motion.button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground">
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/shop" className="flex items-center gap-2 text-accent hover:underline">
              <ArrowLeft size={18} /> Back to Shop
            </Link>
          </motion.div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-12"> */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Image Gallery */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {activeImages.map((img, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative aspect-[4/5] rounded-2xl overflow-hidden border bg-card shadow-premium transition-all ${selectedImage === idx
                      ? 'border-accent ring-1 ring-accent/30'
                      : 'border-border hover:border-accent/50'
                      }`}
                  >
                    {!loadedImages[idx] && (
                      <div className="absolute inset-0 bg-muted/50 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10" />
                      </div>
                    )}
                    <Image
                      src={img}
                      alt={`${product.name} image ${idx + 1}`}
                      fill
                      className={`object-cover transition-opacity duration-300 ${loadedImages[idx] ? 'opacity-100' : 'opacity-0'}`}
                      priority={idx === 0}
                      onLoadingComplete={() =>
                        setLoadedImages((current) => ({ ...current, [idx]: true }))
                      }
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              // className="space-y-6"
              className="lg:col-span-5 space-y-6 sticky top-28 self-start"
            >
              {/* Header */}
              <div>
                <p className="text-sm text-accent font-medium mb-2 uppercase tracking-wider">
                  {product.designer}
                </p>
                <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <button
                  type="button"
                  onClick={() => setShowReviews(true)}
                  className="inline-flex items-center gap-3 mb-6 rounded-full border border-border bg-card px-4 py-2.5 text-left transition-colors hover:border-accent hover:bg-accent/5 cursor-pointer"
                >
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${i < Math.floor(product.rating)
                          ? 'fill-accent text-accent'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground transition-colors">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </button>
              </div>

              {/* Price */}
              <div className="space-y-2 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-bold text-accent">
                    ₹{effectivePrice.toLocaleString()}
                  </p>
                  {mrp > effectivePrice && (
                    <>
                      <p className="text-xl text-muted-foreground line-through">
                        ₹{mrp.toLocaleString()}
                      </p>
                      {percentOff !== undefined && percentOff > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {percentOff}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
              </div>

              {/* Color Selection */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <label className="text-sm font-semibold">Select Color</label>
                    <span className="text-sm text-muted-foreground">
                      {selectedColorOption?.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => {
                      const isActive = selectedColorOption?.name === color.name;
                      return (
                        <motion.button
                          key={color.name}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedColorOption(color);
                            setSelectedImage(0);
                            const sizesForColor = (product?.variants ?? [])
                              .filter((v) => v.color === color.name && v.stock > 0)
                              .map((v) => v.size);
                            if (!sizesForColor.includes(selectedSize)) {
                              setSelectedSize(sizesForColor[0] ?? '');
                            }
                          }}
                          className={`flex items-center gap-3 rounded-full border px-3 py-2 transition-all ${isActive
                            ? 'border-accent bg-accent/10 shadow-sm'
                            : 'border-border hover:border-accent hover:bg-card'
                            }`}
                        >
                          <span
                            className="h-7 w-7 rounded-full border border-black/10 shadow-inner"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-sm font-medium">{color.name}</span>
                          {isActive && <Check size={14} className="text-accent" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold">
                      Select Size
                    </label>

                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-accent text-sm font-semibold hover:underline"
                    >
                      Size Guide
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {availableSizes.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No sizes available for this product
                      </p>
                    )}
                    {availableSizes.map(({ size, inStock }) => (
                      <motion.button
                        key={size}
                        disabled={!inStock}
                        whileHover={inStock ? { scale: 1.05 } : undefined}
                        whileTap={inStock ? { scale: 0.95 } : undefined}
                        onClick={() => {
                          if (!inStock) return;
                          setSelectedSize(size);
                          setSelectedMeasurementProfile(null);
                        }}
                        className={`min-w-[75px] h-12 rounded-xl border-2 font-semibold transition-all ${!inStock
                            ? 'border-border text-muted-foreground line-through opacity-50 cursor-not-allowed'
                            : selectedSize === size
                              ? 'border-accent bg-accent text-white shadow-lg'
                              : 'border-border hover:border-accent'
                          }`}
                      >
                        {size}
                      </motion.button>
                    ))}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedSize('custom');
                        setShowCustomSizePicker(true);
                      }}
                      className={`min-w-[140px] h-12 rounded-xl border-2 font-semibold transition-all ${selectedSize === 'custom'
                          ? 'border-accent bg-accent text-white shadow-lg'
                          : 'border-dashed border-border hover:border-accent'
                        }`}
                    >
                      Custom Size
                    </motion.button>
                  </div>
                </div>

                {selectedSize === 'custom' && (
                  <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">Custom Size</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedMeasurementProfile
                            ? summarizeMeasurementProfile(selectedMeasurementProfile)
                            : 'Choose a saved profile or add a new one'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCustomSizePicker(true)}
                        className="text-sm font-semibold text-accent hover:underline"
                      >
                        {selectedMeasurementProfile ? 'Change Profile' : 'Select Profile'}
                      </button>
                    </div>

                    {selectedMeasurementProfile && (
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border border-border px-3 py-1">
                          {selectedMeasurementProfile.measurementType === 'shirt'
                            ? 'Shirt'
                            : selectedMeasurementProfile.measurementType === 'pant'
                              ? 'Pant'
                              : 'Shirt + Pant'}
                        </span>
                        <span className="rounded-full border border-border px-3 py-1">
                          {selectedMeasurementProfile.unit === 'in' ? 'Inches' : 'Centimeters'}
                        </span>
                        <span className="rounded-full border border-border px-3 py-1">
                          {selectedMeasurementProfile.isDefault ? 'Default profile' : 'Saved profile'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Size Guide Link */}
                {/* <Link href="/size-guide" className="text-sm text-accent hover:underline">
                  Size Guide →
                </Link> */}
                {/* <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-accent text-sm font-semibold hover:underline"
                >
                  Size Guide
                </button> */}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Quantity</label>
                <div className="flex items-center gap-4 w-fit">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-border rounded hover:bg-card transition-colors"
                  >
                    −
                  </motion.button>
                  <span className="w-8 text-center font-semibold">
                    {quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    // ponytail: no stock count on public product endpoint yet, cap at 10
                    // as a sane default; switch to Math.min(product.stock, quantity + 1)
                    // once stock is exposed.
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-4 py-2 border border-border rounded hover:bg-card transition-colors"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isAddedToCart}
                  className={`w-full px-8 py-4 font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${isAddedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-primary text-primary-foreground hover:shadow-premium'
                    }`}
                >
                  {isAddedToCart ? (
                    <>
                      <CheckCircle size={20} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Add to Cart
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWishlistToggle}
                  className={`w-full px-8 py-4 border-2 font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${isWishlisted
                    ? 'border-accent bg-accent text-luxury-black'
                    : 'border-primary text-primary hover:bg-primary/5'
                    }`}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  {isWishlisted ? 'In Wishlist' : 'Save'}
                </motion.button>
              </div>

              {/* Share */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleShare}
                className="w-full py-3 border border-border rounded-lg flex items-center justify-center gap-2 hover:bg-card transition-colors"
              >
                <Share2 size={20} />
                Share
              </motion.button>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                {[
                  { icon: Truck, label: 'Free Shipping', desc: 'On orders over ₹10,000' },
                  { icon: RotateCcw, label: '30-Day Returns', desc: 'No questions asked' },
                  { icon: Check, label: 'Authentic', desc: 'Guaranteed authentic' },
                ].map((feature, idx) => (
                  <div key={idx} className="text-center space-y-2">
                    <feature.icon className="w-6 h-6 mx-auto text-accent" />
                    <p className="text-sm font-semibold">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* Product Information Tabs */}
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'details', label: 'Product Details' },
                    { id: 'shipping', label: 'Shipping & Returns' },
                    { id: 'support', label: 'Customer Support' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveInfoTab(tab.id as 'details' | 'shipping' | 'support')}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeInfoTab === tab.id
                        ? 'bg-accent text-luxury-black'
                        : 'border border-border text-muted-foreground hover:border-accent hover:text-accent'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeInfoTab === 'details' && (
                  <div className="space-y-4 rounded-2xl border border-border bg-card/40 p-5">
                    <div>
                      <h3 className="font-bold mb-2">Crafted Details</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Fabric & Material</h3>
                      <p className="text-muted-foreground text-sm">
                        {product.fabricDetails}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Care Instructions</h3>
                      <ul className="text-muted-foreground text-sm space-y-1">
                        <li>• Dry clean only</li>
                        <li>• Store in a cool, dry place</li>
                        <li>• Avoid direct sunlight</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeInfoTab === 'shipping' && (
                  <div className="rounded-2xl border border-border bg-card/40 p-5 space-y-4 text-sm text-muted-foreground">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Delivery</h3>
                      <p>{product.deliveryTime}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Returns</h3>
                      <p>We offer free returns within 30 days for unused items in original condition. Custom-tailored pieces may be eligible for exchange only.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Shipping</h3>
                      <p>Complimentary shipping on orders over ₹10,000. Express delivery is available for select locations.</p>
                    </div>
                  </div>
                )}

                {activeInfoTab === 'support' && (
                  <div className="rounded-2xl border border-border bg-card/40 p-5 space-y-4 text-sm text-muted-foreground">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Need help?</h3>
                      <p>Our styling experts are available to assist with fit, color, and delivery questions before and after purchase.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Contact options</h3>
                      <p>Email: hello@halloffashion.com</p>
                      <p>Call: +91 98765 43210</p>
                      <p>Live chat: Available daily from 10 AM to 8 PM.</p>
                    </div>
                  </div>
                )}
              </div>


              <div className="pt-8 border-t border-border">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h3 className="text-xl font-bold">
                    Customer Reviews
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => (isAuthenticated ? setShowWriteReview(true) : toast.info('Sign in to write a review'))}
                      className="inline-flex items-center rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/5"
                    >
                      Write a Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviews(true)}
                      className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-accent/5"
                    >
                      View more
                    </button>
                  </div>
                </div>

                {reviewsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </div>
                ) : visibleReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground border border-dashed border-border rounded-xl p-4 bg-card/40">
                    No reviews yet — be the first to review this product.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {visibleReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-border rounded-xl p-4 bg-card/40"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            {review.rating} ★
                          </span>

                          <div>
                            <span className="font-semibold block">
                              {review.customerName}
                              {review.verifiedPurchase && (
                                <span className="ml-2 text-xs text-accent font-normal">Verified Purchase</span>
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {review.title && (
                          <p className="text-sm font-semibold mb-1">{review.title}</p>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        </div>
      </div>

      <MeasurementProfilePickerModal
        open={showCustomSizePicker}
        onClose={() => setShowCustomSizePicker(false)}
        onSelect={handleCustomSizeSelect}
        initialType="combined"
      />

      <AnimatePresence>
        {showReviews && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowReviews(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:w-[720px] max-w-[calc(100vw-2rem)] max-h-[85vh] bg-background rounded-2xl shadow-2xl overflow-hidden border border-border"
            >
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-card/40">
                <div>
                  <h2 className="text-2xl font-bold">All Reviews</h2>
                  <p className="text-sm text-muted-foreground">
                    {product.rating} rating · {product.reviews} reviews
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReviews(false)}
                  className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors"
                  aria-label="Close reviews"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-4">
                {reviews.length === 0 && !reviewsLoading && (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet — be the first to review this product.
                  </p>
                )}
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-border p-4 bg-card/40">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="font-semibold">
                          {review.customerName}
                          {review.verifiedPurchase && (
                            <span className="ml-2 text-xs text-accent font-normal">Verified Purchase</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                        <Star size={12} className="fill-white text-white" />
                        {review.rating}
                      </div>
                    </div>
                    {review.title && <p className="text-sm font-semibold mb-1">{review.title}</p>}
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                ))}

                {reviews.length < reviewsTotal && (
                  <button
                    type="button"
                    onClick={handleLoadMoreReviews}
                    disabled={reviewsLoading}
                    className="w-full py-3 rounded-lg border border-border text-sm font-semibold hover:bg-card transition-colors disabled:opacity-50"
                  >
                    {reviewsLoading ? 'Loading...' : 'Load more'}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}

        {showWriteReview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowWriteReview(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:w-[480px] max-w-[calc(100vw-2rem)] bg-background rounded-2xl shadow-2xl overflow-hidden border border-border"
            >
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-card/40">
                <h2 className="text-xl font-bold">Write a Review</h2>
                <button
                  type="button"
                  onClick={() => setShowWriteReview(false)}
                  className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors"
                  aria-label="Close write review"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Rating</label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} type="button" onClick={() => setReviewRating(i + 1)}>
                        <Star
                          size={24}
                          className={i < reviewRating ? 'fill-accent text-accent' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Title (optional)</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    placeholder="Summarize your experience"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Your Review</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    placeholder="Share details about fit, fabric, and delivery"
                  />
                </div>

                {reviewSubmitError && (
                  <p className="text-sm text-red-500">{reviewSubmitError}</p>
                )}

                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={reviewSubmitting}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </motion.div>
          </>
        )}

        {showSizeGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowSizeGuide(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-background z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Size Guide
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Compare chest measurements with the recommended standard size to get the best fit.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowSizeGuide(false)}
                    className="text-2xl leading-none rounded-full h-10 w-10 border border-border hover:bg-card transition-colors"
                    aria-label="Close size guide"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Measure chest', value: 'Wrap a measuring tape around the fullest part of your chest.' },
                    { label: 'Keep it comfortable', value: 'Add a little ease if you prefer a relaxed festive fit.' },
                    { label: 'Match the chart', value: 'Choose the standard size that aligns closest to your chest size.' },
                  ].map((step) => (
                    <div key={step.label} className="rounded-xl border border-border bg-card/40 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-border overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead className="bg-card/60">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Chest (in)
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Standard
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Fit Note
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {[
                        ["34", "XS", "Slim fit"],
                        ["36", "S", "Regular fit"],
                        ["38", "M", "Comfort fit"],
                        ["40", "L", "Comfort fit"],
                        ["42", "XL", "Relaxed fit"],
                        ["44", "XXL", "Relaxed fit"],
                        ["46", "3XL", "Loose fit"],
                        ["48", "4XL", "Loose fit"],
                        ["50", "5XL", "Loose fit"]
                      ].map(([chest, standard, fitNote], idx) => (
                        <tr key={chest} className={idx % 2 === 0 ? 'bg-background' : 'bg-card/30'}>
                          <td className="px-4 py-3 text-sm border-t border-border">
                            {chest}
                          </td>
                          <td className="px-4 py-3 text-sm border-t border-border font-semibold">
                            {standard}
                          </td>
                          <td className="px-4 py-3 text-sm border-t border-border text-muted-foreground">
                            {fitNote}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-card/30 p-4">
                  <p className="text-sm font-semibold mb-1">Need help choosing?</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you are between two sizes, pick the larger one for a more comfortable ethnic wear fit.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Footer />
    </main>
  );
}
