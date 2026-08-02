'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { useCart, cartItemKey } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const tax = cartTotal * 0.18;
  const shipping = cartTotal > 10000 ? 0 : 500;
  const finalTotal = cartTotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <main className="bg-background text-foreground">
        <div className="flex items-center justify-center pt-28 pb-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-playfair font-bold">Your Cart is Empty</h1>
            <p className="text-muted-foreground text-lg">
              Discover our premium collection and add something special
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-premium transition-all"
              >
                Continue Shopping
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
            <h1 className="text-5xl font-playfair font-bold">Shopping Bag</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={cartItemKey(item)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-6 pb-6 border-b border-border"
                  >
                    {/* Product Image */}
                    <div className="w-32 h-40 rounded-lg overflow-hidden flex-shrink-0 shadow-premium">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={128}
                        height={160}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {item.designer}
                        </p>
                        <h3 className="font-playfair text-lg font-bold mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Size: <span className="font-semibold text-foreground">{item.isCustomSize ? 'Custom Size' : item.size}</span>
                        </p>
                        {item.isCustomSize && item.measurementProfileName && (
                          <div className="mb-3 rounded-lg border border-dashed border-border bg-card/40 px-3 py-2">
                            <p className="text-xs font-semibold text-accent mb-1">Custom Profile</p>
                            <p className="text-sm font-semibold text-foreground">{item.measurementProfileName}</p>
                            {item.measurementType && (
                              <p className="text-xs text-muted-foreground">
                                {item.measurementType === 'shirt' ? 'Shirt' : item.measurementType === 'pant' ? 'Pant' : 'Shirt + Pant'} · {item.measurementUnit === 'cm' ? 'Centimeters' : 'Inches'}
                              </p>
                            )}
                          </div>
                        )}
                        <p className="text-accent font-bold text-lg">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFromCart(cartItemKey(item))}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </motion.button>

                      <div className="flex items-center gap-3 bg-card rounded-lg p-1 border border-border">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(cartItemKey(item), item.quantity - 1)}
                          className="p-1 hover:bg-background rounded transition-colors"
                        >
                          <Minus size={16} />
                        </motion.button>
                        <span className="w-6 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(cartItemKey(item), item.quantity + 1)}
                          className="p-1 hover:bg-background rounded transition-colors"
                        >
                          <Plus size={16} />
                        </motion.button>
                      </div>

                      <p className="font-bold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-32 space-y-6 bg-card p-8 rounded-2xl shadow-premium">
                <h2 className="text-2xl font-playfair font-bold">Order Summary</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (est. 18%)</span>
                    <span className="font-semibold">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Shipping (est.) {shipping === 0 && <span className="text-accent">(Free)</span>}
                    </span>
                    <span className="font-semibold">
                      ₹{shipping.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-lg">Estimated Total</span>
                    <span className="font-bold text-2xl text-accent">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">
                    Final tax and total are calculated at checkout.
                  </p>

                  <Link href="/checkout">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-premium transition-all"
                    >
                      Proceed to Checkout
                    </motion.button>
                  </Link>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => clearCart()}
                  className="w-full py-2 border border-border text-muted-foreground hover:text-foreground rounded-lg transition-colors text-sm"
                >
                  Clear Cart
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
