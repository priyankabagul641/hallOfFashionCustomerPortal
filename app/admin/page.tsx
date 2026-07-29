'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BarChart3, Users, ShoppingBag, TrendingUp, LogOut } from 'lucide-react';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'users';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isAuthenticated] = useState(true); // Mock auth

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-playfair font-bold mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </main>
    );
  }

  const stats = [
    {
      label: 'Total Revenue',
      value: '₹24,50,000',
      change: '+12.5%',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    {
      label: 'Total Orders',
      value: '1,247',
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'text-accent',
    },
    {
      label: 'Total Users',
      value: '8,942',
      change: '+15.3%',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: 'Active Products',
      value: '2,340',
      change: '+5.1%',
      icon: BarChart3,
      color: 'text-purple-500',
    },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'users', label: 'Users' },
  ] as const;

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 glass border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-playfair font-bold">STYLEKART Admin</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </motion.header>

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ color: '#C8A96B' }}
                className={`px-6 py-4 font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass rounded-2xl p-6 hover:shadow-premium-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <Icon className={`w-8 h-8 ${stat.color}`} />
                        <span className="text-emerald-600 text-sm font-semibold">{stat.change}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                      <p className="text-3xl font-playfair font-bold">{stat.value}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6"
              >
                <h2 className="text-2xl font-playfair font-semibold mb-6">Recent Orders</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((order) => (
                    <div
                      key={order}
                      className="flex items-center justify-between p-4 hover:bg-background/50 rounded-lg transition-all"
                    >
                      <div>
                        <p className="font-semibold">Order #STK-000{order}</p>
                        <p className="text-sm text-muted-foreground">Customer {order}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{75000 + order * 10000}</p>
                        <p className="text-sm text-emerald-600">Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Products View */}
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-playfair font-semibold">Product Management</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 bg-accent text-luxury-black font-semibold rounded-lg"
                >
                  Add Product
                </motion.button>
              </div>
              <p className="text-muted-foreground">Product management features coming soon...</p>
            </motion.div>
          )}

          {/* Orders View */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-2xl font-playfair font-semibold mb-6">Order Management</h2>
              <p className="text-muted-foreground">Order management features coming soon...</p>
            </motion.div>
          )}

          {/* Users View */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-2xl font-playfair font-semibold mb-6">User Management</h2>
              <p className="text-muted-foreground">User management features coming soon...</p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
