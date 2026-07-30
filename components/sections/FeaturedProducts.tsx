'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag } from 'lucide-react';
import { getProducts, Product } from '@/lib/api/products';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ProductLoadError from '@/components/products/ProductLoadError';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const productVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export default function FeaturedProducts() {
  const router = useRouter();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getProducts({ sortBy: 'rating', pageSize: 4 })
      .then((res) => { if (!cancelled) { setProducts(res.data.products); setError(null); } })
      .catch(() => { if (!cancelled) setError('Failed to load products. Please refresh.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
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

  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultSize = 'M';

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      size: defaultSize,
      designer: product.designer,
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent text-sm font-medium tracking-widest uppercase mb-4">
            Featured
          </span>
          <h2 className="text-display font-playfair mb-4">
            Curated Selection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Handpicked pieces from our finest designers and collections
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <ProductGridSkeleton count={4} />
        ) : error && products.length === 0 ? (
          <ProductLoadError message={error} onRetry={handleRetry} />
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No products found</p>
        ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={productVariants}>
              <Link href={`/product/${product.id}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer"
                >
                  {/* Product Image Container */}
                  <div className="relative h-80 rounded-xl overflow-hidden mb-4 shadow-premium hover:shadow-premium-lg transition-all duration-500">
                    <Image
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

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
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className={`p-3 rounded-full backdrop-blur-md transition-colors ${
                          isInWishlist(product.id)
                            ? 'bg-accent text-luxury-black'
                            : 'bg-white/20 text-white hover:bg-white/40'
                        }`}
                      >
                        <Heart
                          size={20}
                          fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                        />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleQuickAddToCart(e, product)}
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
                    <div className="flex items-center gap-2">
                      <p className="text-accent font-semibold">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        )}

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:shadow-premium transition-all duration-300"
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
