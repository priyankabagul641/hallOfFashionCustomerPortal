'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { useCart, cartItemKey } from '@/context/CartContext';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';
import { ShoppingBag, MapPin, Lock, CheckCircle } from 'lucide-react';
import { checkout, CheckoutOrderResult } from '@/lib/api/orders';
import { getAddresses, createAddress, Address } from '@/lib/api/addresses';
import { ApiError } from '@/lib/api-client';
import { toast } from 'sonner';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const { isLoading } = useAuthGuard();
  const { cartTotal, cartItems, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [placedOrders, setPlacedOrders] = useState<CheckoutOrderResult[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  useEffect(() => {
    getAddresses()
      .then((res) => {
        setSavedAddresses(res.data.addresses);
        if (res.data.addresses.length === 0) {
          setShowAddressForm(true);
        } else {
          const defaultAddress = res.data.addresses.find((a) => a.isDefault) ?? res.data.addresses[0];
          setSelectedAddressId(defaultAddress.id);
        }
      })
      .catch(() => setShowAddressForm(true));
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </main>
    );
  }

  // Estimate shown only while filling shipping/payment steps, before real totals exist.
  const estimatedTax = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity * (item.gstRate ?? 0)) / 100,
    0
  );
  const estimatedShipping = cartItems.reduce(
    (sum, item) => sum + (item.shippingCharge ?? 0) * item.quantity,
    0
  );
  const estimatedTotal = cartTotal + estimatedTax + estimatedShipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildShippingAddress = () => {
    if (!showAddressForm && selectedAddressId) {
      const selected = savedAddresses.find((a) => a.id === selectedAddressId);
      if (selected) {
        return {
          name: selected.name,
          phone: selected.phone,
          line1: selected.line1,
          line2: selected.line2 ?? '',
          city: selected.city,
          state: selected.state,
          pincode: selected.pincode,
        };
      }
    }
    return {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      line1: formData.line1,
      line2: formData.line2,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    };
  };

  const placeOrder = async () => {
    setIsPlacing(true);
    try {
      const res = await checkout({
        items: cartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress: buildShippingAddress(),
        paymentMethod: 'cod',
      });
      setPlacedOrders(res.data.orders);
      setConfirmationMessage(
        res.data.message || `${res.data.orders.length} order${res.data.orders.length === 1 ? '' : 's'} placed`
      );
      setStep('confirmation');
      clearCart();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  const handleNextStep = async () => {
    if (step === 'shipping') {
      if (!showAddressForm && !selectedAddressId) {
        toast.error('Please select or add a delivery address.');
        return;
      }
      if (showAddressForm) {
        if (isSavingAddress) return;
        const name = `${formData.firstName} ${formData.lastName}`.trim();
        if (!name || !formData.phone || !formData.line1 || !formData.city || !formData.state || !formData.pincode) {
          toast.error('Please fill in all delivery address fields.');
          return;
        }
        setIsSavingAddress(true);
        try {
          const res = await createAddress({
            label: name,
            name,
            phone: formData.phone,
            line1: formData.line1,
            line2: formData.line2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            isDefault: savedAddresses.length === 0,
          });
          setSavedAddresses((prev) => [...prev, res.data]);
          setSelectedAddressId(res.data.id);
          setShowAddressForm(false);
        } catch {
          // Non-blocking: checkout still proceeds with the entered form data even if saving it fails.
        } finally {
          setIsSavingAddress(false);
        }
      }
      setStep('payment');
    } else if (step === 'payment') {
      placeOrder();
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

                    {!showAddressForm && savedAddresses.length > 0 && (
                      <div className="space-y-4">
                        {savedAddresses.map((address) => (
                          <label
                            key={address.id}
                            className={`block glass rounded-2xl p-6 cursor-pointer transition-all ${
                              selectedAddressId === address.id
                                ? 'border-2 border-accent'
                                : 'border border-border'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <input
                                type="radio"
                                name="savedAddress"
                                checked={selectedAddressId === address.id}
                                onChange={() => setSelectedAddressId(address.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className="font-semibold">{address.label}</p>
                                  {address.isDefault && (
                                    <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm mt-1">{address.name} &middot; {address.phone}</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                  {address.line1}
                                  {address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} {address.pincode}
                                </p>
                              </div>
                            </div>
                          </label>
                        ))}
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(true)}
                          className="w-full text-center py-4 border-2 border-dashed border-border rounded-lg font-semibold text-accent hover:border-accent transition-all"
                        >
                          + Add New Address
                        </button>
                      </div>
                    )}

                    {showAddressForm && (
                      <div className="space-y-4">
                        {savedAddresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="text-sm font-medium text-accent hover:underline"
                          >
                            &larr; Use a saved address
                          </button>
                        )}
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
                            placeholder="Address Line 1"
                            name="line1"
                            value={formData.line1}
                            onChange={handleInputChange}
                            className="px-6 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent md:col-span-2"
                          />
                          <input
                            type="text"
                            placeholder="Address Line 2 (optional)"
                            name="line2"
                            value={formData.line2}
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
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    disabled={isSavingAddress}
                    className="w-full mt-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-premium transition-all disabled:opacity-60"
                  >
                    {isSavingAddress ? 'Saving Address...' : 'Continue to Payment'}
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
                      <label className="flex items-center gap-4 p-6 border-2 border-accent bg-accent/5 rounded-lg cursor-pointer">
                        <input type="radio" name="payment" checked readOnly />
                        <span className="font-semibold">Cash on Delivery</span>
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Pay in cash when your order is delivered. No online payment required.
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    disabled={isPlacing}
                    className="w-full mt-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-premium transition-all disabled:opacity-60"
                  >
                    {isPlacing ? 'Placing Order...' : 'Complete Purchase'}
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
                    <p className="text-muted-foreground text-lg mb-4">
                      {confirmationMessage}
                    </p>
                  </div>

                  <div className="max-w-xl mx-auto space-y-4 text-left">
                    {placedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-card border border-border rounded-lg p-6 space-y-3"
                      >
                        <div className="font-semibold text-sm">#{order.orderNumber}</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{order.subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Discount</span>
                            <span>-₹{order.discountAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">GST</span>
                            <span>₹{order.gstAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Delivery</span>
                            <span>₹{order.deliveryCharges.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="border-t border-border pt-3 flex justify-between font-bold">
                          <span>Total</span>
                          <span className="text-accent">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
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

            {/* Order Summary Sidebar (estimate only, pre-checkout) */}
            {step !== 'confirmation' && (
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
                    <div key={cartItemKey(item)} className="space-y-1 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold flex items-center gap-2">
                          {item.mrp && item.mrp > item.price && (
                            <span className="text-muted-foreground line-through text-xs">
                              ₹{(item.mrp * item.quantity).toLocaleString()}
                            </span>
                          )}
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
                    <span>Tax (estimated)</span>
                    <span>₹{estimatedTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping (estimated)</span>
                    <span>₹{estimatedShipping.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Estimated Total</span>
                    <span className="text-accent">₹{estimatedTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
