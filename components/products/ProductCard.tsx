'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    designer: string;
    rating: number;
    reviews: number;
    stock?: number;
    sizes?: string[];
    gstRate?: number;
    shippingCharge?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images[0],
        designer: product.designer,
      });
      toast.success('Added to wishlist!', {
        action: {
          label: 'View Wishlist',
          onClick: () => router.push('/wishlist'),
        },
      });
    }
  };

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Quick-add uses default color/size — full variant picker lives on the
    // product detail page.
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColor = 'Default';

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: 1,
      image: product.images[0],
      size: defaultSize,
      color: defaultColor,
      designer: product.designer,
      gstRate: product.gstRate,
      shippingCharge: product.shippingCharge,
    });

    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${defaultSize}`,
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart'),
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/product/${product.id}`}>
        <motion.div className="cursor-pointer">
          {/* Image Container */}
          <div className="relative h-80 rounded-xl overflow-hidden mb-4 shadow-premium hover:shadow-premium-lg transition-all duration-500 bg-card">
            <Image
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Discount Badge */}
            {product.discountPrice && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </div>
            )}

            {/* Overlay Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40 flex items-end justify-between p-4"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlistToggle}
                className={`p-3 rounded-full backdrop-blur-md transition-colors ${
                  isWishlisted
                    ? 'bg-accent text-luxury-black'
                    : 'bg-white/20 text-white hover:bg-white/40'
                }`}
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? 'currentColor' : 'none'}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickAddToCart}
                className="p-3 rounded-full bg-white/20 text-white hover:bg-accent hover:text-luxury-black backdrop-blur-md transition-colors"
              >
                <ShoppingBag size={20} />
              </motion.button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-light">
              {product.designer}
            </p>

            <h3 className="font-playfair text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(product.rating)
                        ? 'fill-accent text-accent'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-accent font-semibold text-lg">
                ₹{product.discountPrice ? product.discountPrice.toLocaleString('en-IN') : product.price.toLocaleString('en-IN')}
              </p>
              {product.discountPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              )}
            </div>
            {product.stock !== undefined && product.stock < 5 && product.stock > 0 && (
              <p className="text-xs text-orange-600 font-semibold">
                Only {product.stock} left in stock
              </p>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
