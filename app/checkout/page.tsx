'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, MapPin, Lock, CheckCircle } from 'lucide-react';
import { createOrderFromCart, saveStoredOrder } from '@/lib/order-history';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const { cartTotal, cartItems, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const tax = cartTotal * 0.18;
  const shipping = 500;
  const finalTotal = cartTotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 'shipping') {
      setStep('payment');
    } else if (step === 'payment') {
      const order = createOrderFromCart({
        cartItems,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: 'card',
        total: finalTotal,
      });
      saveStoredOrder(order);
      setOrderNumber(order.orderNumber);
      setStep('confirmation');
      clearCart();
    }
  };

  return (
    <main className="bg-background text-foreground">
      <div className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              {[
                { label: 'Shipping', value: 'shipping' },
                { label: 'Payment', value: 'payment' },
                { label: 'Confirmation', value: 'confirmation' },
              ].map((s, idx) => (
                <div key={s.value} className="flex items-center flex-1">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      step === s.value
                        ? 'bg-accent text-luxury-black shadow-premium'
                        : 'bg-card text-muted-foreground border border-border'
                    }`}
                  >
                    {idx + 1}
                  </motion.div>
                  <div className={`mx-4 flex-1 h-1 transition-colors ${
                    idx < 2 && (step === 'payment' || step === 'confirmation')
                      ? 'bg-accent'
                      : 'bg-border'
                  }`} />
                  <span className="text-sm font-semibold">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Forms */}
            <div className="lg:col-span-2">
              {step === 'shipping' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl font-playfair font-bold mb-6 flex items-center gap-3">
                      <MapPin className="w-8 h-8 text-accent" />
                      Delivery Address
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="text"
                        placeholder="Full Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option>India</option>
                      </select>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    className="w-full mt-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-premium transition-all"
                  >
                    Continue to Payment
                  </motion.button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl font-playfair font-bold mb-6 flex items-center gap-3">
                      <Lock className="w-8 h-8 text-accent" />
                      Payment Method
                    </h2>

                    <div className="space-y-4">
                      {[
                        { id: 'card', label: 'Credit/Debit Card' },
                        { id: 'upi', label: 'UPI' },
                        { id: 'wallet', label: 'Digital Wallet' },
                        { id: 'emi', label: 'EMI' },
                      ].map((method) => (
                        <label
                          key={method.id}
                          className="flex items-center gap-4 p-6 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition-colors"
                        >
                          <input type="radio" name="payment" defaultChecked={method.id === 'card'} />
                          <span className="font-semibold">{method.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-8 space-y-4">
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="w-full px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    className="w-full mt-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-premium transition-all"
                  >
                    Complete Purchase
                  </motion.button>
                </motion.div>
              )}

              {step === 'confirmation' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-8 py-12"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle className="w-20 h-20 text-accent mx-auto" />
                  </motion.div>
                  <div>
                    <h2 className="text-4xl font-playfair font-bold mb-4">
                      Order Confirmed!
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Thank you for your purchase. Your order number is <span className="font-bold text-foreground">#{orderNumber}</span>
                    </p>
                  </div>
                  <Link href="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-premium"
                    >
                      Back to Home
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-32 space-y-6 bg-card p-8 rounded-2xl shadow-premium">
                <h3 className="text-2xl font-playfair font-bold flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Order Summary
                </h3>

                <div className="space-y-3 max-h-64 overflow-y-auto border-b border-border pb-6">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="space-y-1 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      {item.isCustomSize && item.measurementProfileName && (
                        <p className="text-xs text-accent">
                          Custom fit: {item.measurementProfileName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-sm pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-accent">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
