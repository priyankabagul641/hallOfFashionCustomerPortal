'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';
import Footer from '@/components/layout/Footer';
import { User, ShoppingBag, Heart, MapPin, Settings, LogOut, Package, Award, LucideIcon } from 'lucide-react';
import { loadStoredOrders } from '@/lib/order-history';
import { Order } from '@/data/orders';

type ActiveTab = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { isLoading } = useAuthGuard();
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [orders] = useState<Order[]>(() => loadStoredOrders());

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="pt-32 pb-20">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-4xl font-playfair font-bold mb-4">Please Sign In</h1>
            <p className="text-muted-foreground mb-8">You need to be logged in to access your account</p>
            <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-accent text-luxury-black font-semibold rounded-lg hover:bg-gold transition-all"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const tabs: { id: ActiveTab; label: string; icon: LucideIcon }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

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
            <h1 className="text-display font-playfair mb-2">My Account</h1>
            <p className="text-muted-foreground">
              Welcome back, <span className="text-foreground font-semibold">{user.name}</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="glass rounded-2xl p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ x: 4 }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? 'bg-accent text-luxury-black font-semibold'
                            : 'text-foreground hover:bg-background/50'
                        }`}
                      >
                        <Icon size={20} />
                        <span>{tab.label}</span>
                      </motion.button>
                    );
                  })}
                  <div className="border-t border-border my-4 pt-4">
                    <motion.button
                      onClick={logout}
                      whileHover={{ x: 4 }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                </nav>
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-2xl p-8"
                  >
                    <h2 className="text-2xl font-playfair font-semibold mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          placeholder={user.phone || '+91 98765 43210'}
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Member Since</label>
                        <input
                          type="text"
                          defaultValue="January 2024"
                          disabled
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-muted-foreground"
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 px-8 py-3 bg-accent text-luxury-black font-semibold rounded-lg hover:bg-gold transition-all"
                    >
                      Save Changes
                    </motion.button>
                  </motion.div>

                  {/* Membership Status */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-playfair font-semibold">Hall of Fashion Rewards</h3>
                      <Award className="w-8 h-8 text-accent" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Loyalty Points</p>
                        <p className="text-3xl font-playfair font-bold text-accent">2,450</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">Redeem 500 points for ₹500 discount</p>
                        <div className="w-full bg-border rounded-full h-2">
                          <div className="bg-accent h-2 rounded-full" style={{ width: '49%' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-playfair font-semibold mb-6">My Orders</h2>
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass rounded-2xl p-6 flex items-center justify-between hover:shadow-premium-lg transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Package className="w-8 h-8 text-accent" />
                        <div>
                          <p className="font-semibold">Order #{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                          {order.items.some((item) => item.customized) && (
                            <p className="text-xs text-accent mt-1">
                              {order.items.find((item) => item.customized)?.measurementProfileName || 'Includes custom measurement profile'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-accent">₹{order.total.toLocaleString()}</p>
                        <p className="text-sm text-emerald-600 font-medium">
                          {order.status}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-playfair font-semibold mb-6">Saved Items</h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-2xl p-8 text-center"
                  >
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">No items saved yet</p>
                    <Link href="/shop">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="px-6 py-2 bg-accent text-luxury-black font-semibold rounded-lg"
                      >
                        Start Shopping
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-playfair font-semibold">Saved Addresses</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-accent text-luxury-black font-semibold rounded-lg"
                    >
                      Add New
                    </motion.button>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-2xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold">Home</p>
                        <p className="text-sm text-muted-foreground mt-2">123 Main Street, Mumbai, MH 400001</p>
                      </div>
                      <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                        Default
                      </span>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-2xl p-8 space-y-6"
                >
                  <h2 className="text-2xl font-playfair font-semibold mb-6">Settings</h2>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 hover:bg-background/50 rounded-lg transition-all cursor-pointer">
                      <span className="font-medium">Email Notifications</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent" />
                    </label>

                    <label className="flex items-center justify-between p-4 hover:bg-background/50 rounded-lg transition-all cursor-pointer">
                      <span className="font-medium">SMS Notifications</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent" />
                    </label>

                    <label className="flex items-center justify-between p-4 hover:bg-background/50 rounded-lg transition-all cursor-pointer">
                      <span className="font-medium">Marketing Emails</span>
                      <input type="checkbox" className="w-5 h-5 accent-accent" />
                    </label>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-4">Danger Zone</h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 border border-red-500 text-red-600 font-semibold rounded-lg hover:bg-red-500/10 transition-all"
                    >
                      Delete Account
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
