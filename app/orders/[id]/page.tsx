'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';
import { getMyOrder, Order } from '@/lib/api/orders';
import {
  Package, Clock, CheckCircle, Truck, MapPin,
  RotateCcw, Star, X, ChevronLeft
} from 'lucide-react';

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Package }> = {
  'Processing': { color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
  'Confirmed': { color: 'text-blue-700', bg: 'bg-blue-100', icon: CheckCircle },
  'In Tailoring': { color: 'text-purple-700', bg: 'bg-purple-100', icon: Package },
  'Quality Check': { color: 'text-indigo-700', bg: 'bg-indigo-100', icon: CheckCircle },
  'Shipped': { color: 'text-teal-700', bg: 'bg-teal-100', icon: Truck },
  'Out for Delivery': { color: 'text-orange-700', bg: 'bg-orange-100', icon: Truck },
  'Delivered': { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle },
  'Cancelled': { color: 'text-red-700', bg: 'bg-red-100', icon: X },
  'Returned': { color: 'text-gray-700', bg: 'bg-gray-100', icon: RotateCcw },
};
const defaultStatus = { color: 'text-muted-foreground', bg: 'bg-muted', icon: Package };

function Check({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { isLoading } = useAuthGuard();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (isLoading || !params?.id) return;
    getMyOrder(params.id)
      .then((res) => setOrder(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setOrderLoading(false));
  }, [isLoading, params?.id]);

  if (isLoading || orderLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center py-24">
          <Package className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="font-playfair text-xl font-semibold mb-2">Order not found</h3>
          <Link href="/orders" className="text-accent font-semibold text-sm">Back to Orders</Link>
        </div>
      </main>
    );
  }

  const status = statusConfig[order.status] ?? defaultStatus;
  const StatusIcon = status.icon;

  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="pt-28 pb-12 bg-luxury-black text-luxury-ivory">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/orders" className="inline-flex items-center gap-1 text-accent text-sm mb-4 hover:underline">
              <ChevronLeft size={16} /> Back to Orders
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-playfair text-3xl md:text-4xl font-bold">{order.orderNumber}</span>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>
                <StatusIcon size={12} />
                {order.status}
              </span>
            </div>
            {order.status === 'Cancelled' && order.cancellationReason && (
              <p className="mb-3 text-sm font-medium text-red-400 bg-red-950/40 rounded-lg px-3 py-1.5 inline-block">
                Cancelled: {order.cancellationReason}
              </p>
            )}
            <p className="text-luxury-beige/70 text-sm">
              Placed on {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              {order.estimatedDelivery && (
                <>{' · '}Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</>
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Items */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h4 className="font-playfair font-semibold text-lg mb-4">Items</h4>
            <div className="space-y-3">
              {order.items.map((item) => {
                const thumbnail = (
                  <img
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.jpg'; }}
                  />
                );
                const details = (
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.designer} · Size: {item.size}{item.color ? ` · Color: ${item.color}` : ''}
                    </p>
                    {item.customized && (
                      <span className="text-xs bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full">Customized</span>
                    )}
                  </div>
                );
                return (
                  <div key={item.id} className="flex items-center gap-4 bg-muted/20 rounded-xl p-3">
                    {item.productId ? (
                      <Link href={`/product/${item.productId}`} className="flex items-center gap-4 flex-1 min-w-0">
                        {thumbnail}
                        {details}
                      </Link>
                    ) : (
                      <>
                        {thumbnail}
                        {details}
                      </>
                    )}
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tracking Timeline */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h4 className="font-playfair font-semibold text-lg mb-4 flex items-center gap-2">
                <Truck size={18} className="text-accent" /> Order Tracking
              </h4>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-4">
                  {order.tracking.map((event, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                        event.completed
                          ? 'bg-accent border-accent'
                          : 'bg-card border-border'
                      }`}>
                        {event.completed
                          ? <Check size={14} className="text-luxury-black" />
                          : <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        }
                      </div>
                      <div className={`pb-4 flex-1 ${event.completed ? '' : 'opacity-50'}`}>
                        <p className="font-semibold text-sm">{event.status}</p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                        {event.date && (
                          <p className="text-xs text-muted-foreground mt-0.5">{event.date} · {event.time}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <h4 className="font-playfair font-semibold text-lg mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-accent" /> Delivery Address
                </h4>
                <div className="bg-muted/20 rounded-xl p-4 text-sm space-y-1">
                  <p className="font-semibold">{order.shippingAddress.name}</p>
                  <p className="text-muted-foreground">
                    {[order.shippingAddress.line1 ?? order.shippingAddress.address, order.shippingAddress.line2]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <h4 className="font-playfair font-semibold text-lg mb-3">Price Breakdown</h4>
                <div className="bg-muted/20 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
                  {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>- ₹{order.discount.toLocaleString('en-IN')}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>₹{order.tax.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span></div>
                  <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
                    <span>Total</span><span className="text-accent">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border shadow-sm p-6 text-sm space-y-1">
                <p><span className="text-muted-foreground">Payment:</span> <span className="font-semibold">{order.paymentMethod}</span></p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.paymentStatus}
                  </span>
                </p>
              </div>

              {order.status === 'Delivered' && (
                <button className="w-full py-2.5 border border-accent text-accent rounded-xl font-semibold text-sm hover:bg-accent hover:text-luxury-black transition-all flex items-center justify-center gap-2">
                  <Star size={15} /> Write a Review
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
