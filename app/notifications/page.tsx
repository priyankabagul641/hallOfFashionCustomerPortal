'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { notifications as initialNotifications, Notification } from '@/data/notifications';
import { Bell, BellOff, Check, Trash2, ChevronRight, Package, Tag, Settings, Heart, Scissors, CreditCard } from 'lucide-react';

const typeConfig: Record<Notification['type'], { icon: typeof Bell; color: string; bg: string }> = {
  order: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
  offer: { icon: Tag, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  system: { icon: Bell, color: 'text-purple-600', bg: 'bg-purple-100' },
  wishlist: { icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100' },
  tailor: { icon: Scissors, color: 'text-amber-600', bg: 'bg-amber-100' },
  payment: { icon: CreditCard, color: 'text-teal-600', bg: 'bg-teal-100' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | Notification['type']>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  const markRead = (id: string) => setNotifications(notifications.map((n) => n.id === id ? { ...n, isRead: true } : n));
  const deleteNotification = (id: string) => setNotifications(notifications.filter((n) => n.id !== id));

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="pt-28 pb-12 bg-luxury-black text-luxury-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Bell className="text-accent" size={24} />
                <span className="text-accent font-cormorant text-lg tracking-widest uppercase">Stay Updated</span>
              </div>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2">
                <span className="text-accent">Notifications</span>
              </h1>
              {unreadCount > 0 && (
                <p className="text-luxury-beige/70 text-sm">
                  You have <span className="text-accent font-semibold">{unreadCount} unread</span> notifications
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="mt-1 text-sm text-accent border border-accent/40 rounded-xl px-4 py-2 hover:bg-accent hover:text-luxury-black transition-all"
              >
                Mark All Read
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="border-b border-border bg-card sticky top-20 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-0">
            {([
              ['all', 'All'],
              ['unread', `Unread (${unreadCount})`],
              ['order', 'Orders'],
              ['offer', 'Offers'],
              ['tailor', 'Tailor'],
              ['payment', 'Payments'],
              ['wishlist', 'Wishlist'],
            ] as [string, string][]).map(([filter, label]) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeFilter === filter
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 && (
            <div className="text-center py-24">
              <BellOff className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="font-playfair text-xl font-semibold mb-2">No notifications</p>
              <p className="text-muted-foreground text-sm">You're all caught up!</p>
            </div>
          )}

          <div className="space-y-3">
            {filtered.map((notification, idx) => {
              const config = typeConfig[notification.type];
              const TypeIcon = config.icon;

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => markRead(notification.id)}
                  className={`group relative bg-card rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                    !notification.isRead
                      ? 'border-accent/30 bg-accent/5'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl ${config.bg}`}>
                      <span>{notification.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className={`font-semibold text-sm ${!notification.isRead ? 'text-foreground' : 'text-foreground/80'}`}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => { e.stopPropagation(); markRead(notification.id); }}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-accent"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {notification.actionLabel && notification.actionHref && (
                        <Link
                          href={notification.actionHref}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-accent hover:underline"
                        >
                          {notification.actionLabel} <ChevronRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {notifications.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setNotifications([])}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2 mx-auto"
              >
                <Trash2 size={14} /> Clear All Notifications
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-xl font-bold flex items-center gap-2">
                <Settings size={20} className="text-accent" /> Notification Preferences
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Order Updates', desc: 'Shipping, delivery, and status changes', enabled: true },
                { label: 'Offers & Promotions', desc: 'Exclusive deals and discount codes', enabled: true },
                { label: 'Wishlist Alerts', desc: 'Price drops on saved items', enabled: true },
                { label: 'Tailor Messages', desc: 'Updates from your assigned tailor', enabled: true },
                { label: 'New Collections', desc: 'Latest arrivals and launches', enabled: false },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-semibold text-sm">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={pref.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
