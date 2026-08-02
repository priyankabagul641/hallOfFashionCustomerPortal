'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';
import { getMyOrders, Order } from '@/lib/api/orders';
import {
  Package, Clock, CheckCircle, Truck,
  ChevronRight, ShoppingBag, X, RotateCcw
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

export default function OrdersPage() {
  const { isLoading } = useAuthGuard();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'delivered'>('all');

  useEffect(() => {
    if (isLoading) return;
    getMyOrders()
      .then((res) => setOrders(res.data.orders))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isLoading]);

  if (isLoading || ordersLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </main>
    );
  }

  const filtered = orders.filter((o) => {
    if (activeFilter === 'active') return !['Delivered', 'Cancelled', 'Returned'].includes(o.status);
    if (activeFilter === 'delivered') return o.status === 'Delivered';
    return true;
  });

  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="pt-28 pb-12 bg-luxury-black text-luxury-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <ShoppingBag className="text-accent" size={24} />
              <span className="text-accent font-cormorant text-lg tracking-widest uppercase">Your Orders</span>
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-3">
              Order <span className="text-accent">History</span>
            </h1>
            <p className="text-luxury-beige/70 text-base">Track your orders, view details, and manage returns.</p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="border-b border-border bg-card sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-0">
          {(['all', 'active', 'delivered'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-4 text-sm font-semibold border-b-2 capitalize transition-colors ${
                activeFilter === filter
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter === 'all' ? 'All Orders' : filter === 'active' ? 'Active Orders' : 'Delivered'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 && (
            <div className="text-center py-24">
              <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="font-playfair text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground text-sm mb-6">Start shopping to see your orders here</p>
              <Link href="/shop">
                <button className="px-8 py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all">
                  Browse Collections
                </button>
              </Link>
            </div>
          )}

          <div className="space-y-6">
            {filtered.map((order, idx) => {
              const status = statusConfig[order.status] ?? defaultStatus;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={`/orders/${order.id}`}
                    className="block bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:border-accent/50 transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-lg font-playfair">{order.orderNumber}</span>
                            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>
                              <StatusIcon size={12} />
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            {order.estimatedDelivery && (
                              <>{' · '}Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                            )}
                          </p>
                          {order.status === 'Cancelled' && order.cancellationReason && (
                            <p className="mt-2 text-xs font-medium text-red-700 bg-red-100 rounded-lg px-3 py-1.5 inline-block">
                              Cancelled: {order.cancellationReason}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Order Total</p>
                          <p className="font-bold text-xl text-accent">₹{order.total.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 bg-muted/20 rounded-xl p-3">
                            <img
                              src={item.image || '/placeholder.jpg'}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover shrink-0"
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.jpg'; }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.designer} · Size: {item.size}</p>
                              {item.customized && (
                                <span className="text-xs bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full">Customized</span>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-semibold text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-muted-foreground py-2 border-t border-border">
                        View Details & Tracking <ChevronRight size={16} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
