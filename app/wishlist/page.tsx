'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WishlistPage() {
  const router = useRouter();
  const { isLoading } = useAuthGuard();
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </main>
    );
  }

  const handleMoveToCart = (item: typeof wishlistItems[0]) => {
    // ponytail: sizes/colors aren't on the public product payload yet, default them.
    const defaultSize = 'M';
    const defaultColor = 'Default';

    addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      size: defaultSize,
      color: defaultColor,
      designer: item.designer,
    });

    removeFromWishlist(item.id);

    toast.success(`${item.name} moved to cart!`, {
      description: `Size: ${defaultSize}`,
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart'),
      },
    });
  };

  const handleRemoveFromWishlist = (id: string) => {
    removeFromWishlist(id);
    toast.info('Removed from wishlist');
  };

  if (wishlistItems.length === 0) {
    return (
      <main className="bg-background text-foreground">
        <div className="flex items-center justify-center pt-28 pb-32">
          <div className="text-center space-y-6">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground/30" />
            <h1 className="text-4xl font-playfair font-bold">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground text-lg">
              Save your favorite items to view them later
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-premium transition-all"
              >
                Explore Collection
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href="/shop" className="flex items-center gap-2 text-accent mb-6 hover:underline">
              <ArrowLeft size={20} /> Continue Shopping
            </Link>
            <h1 className="text-5xl font-playfair font-bold">My Wishlist</h1>
            <p className="text-muted-foreground mt-2">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
            </p>
          </motion.div>

          {/* Wishlist Items Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {wishlistItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="cursor-pointer">
                  {/* Product Image */}
                  <div className="relative h-80 rounded-xl overflow-hidden mb-4 shadow-premium hover:shadow-premium-lg transition-all duration-500">
                    <Link href={`/product/${item.id}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </Link>

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
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={20} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMoveToCart(item)}
                        className="p-3 rounded-full bg-accent text-luxury-black hover:bg-accent/90 transition-colors"
                      >
                        <ShoppingBag size={20} />
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <Link href={`/product/${item.id}`}>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-light">
                        {item.designer}
                      </p>

                      <h3 className="font-playfair text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {item.name}
                      </h3>

                      <p className="text-accent font-semibold text-lg">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </Link>

                  {/* Quick Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMoveToCart(item)}
                    className="w-full mt-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 hover:shadow-premium transition-all"
                  >
                    <ShoppingBag size={18} />
                    Move to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
