'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingBag, Menu, X, Search, ChevronDown, User,
  Bell, Scissors, Ruler, Package, MessageCircle, LogOut, Settings,
  Sparkles, Store, Eye, ArrowRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/use-notifications';
import { getOccasions, PublicOccasion } from '@/lib/api/products';
import { safeImageSrc } from '@/lib/utils';

// ─── Menu data ────────────────────────────────────────────────────────────────

const COLLECTIONS_MENU = {
  categories: [
    { label: 'Sherwanis', desc: 'Royal wedding wear', href: '/shop?category=sherwani', image: '/products/Indo-western-collection.png' },
    { label: 'Kurta Sets', desc: 'Festive & casual styles', href: '/shop?category=kurta', image: '/products/Occassion-featured.png' },
    { label: 'Bandhgalas', desc: 'Modern ceremonial tailoring', href: '/shop?category=indo-western', image: '/products/Indo-western-collection.png' },
    { label: 'Blazers & Suits', desc: 'Premium formal wear', href: '/shop?category=blazer', image: '/products/Occassion-featured.png' },
    { label: 'Nehru Jackets', desc: 'Refined layering', href: '/shop?category=indo-western', image: '/products/Indo-western-collection.png' },
    { label: 'Accessories', desc: 'Complete your look', href: '/shop?category=accessories', image: '/products/Occassion-featured.png' },
  ],
  occasions: [
    { label: 'Wedding', href: '/shop?category=groom', image: '/products/Indo-western-collection.png' },
    { label: 'Festive', href: '/shop?category=festive', image: '/products/Occassion-featured.png' },
    { label: 'Formal', href: '/shop?category=blazer', image: '/products/Indo-western-collection.png' },
    { label: 'Casual', href: '/shop', image: '/products/Occassion-featured.png' },
  ],
  featured: {
    title: 'New In Menswear',
    desc: 'Heritage Groom 2025 Collection',
    href: '/collections',
    image: '/products/Indo-western-collection.png',
  },
};

const OCCASIONS_FEATURED = {
  href: '/collections',
  desc: 'Build a look for every men\'s celebration',
};

const DESIGNERS_MENU = [
  { name: 'House of Aryav', location: 'New Delhi', href: '/designers', initial: 'A' },
  { name: 'Regal Loom', location: 'Hyderabad', href: '/designers', initial: 'R' },
  { name: 'Aurum Legacy', location: 'Lucknow', href: '/designers', initial: 'Au' },
  { name: 'Vardhan Atelier', location: 'New Delhi', href: '/designers', initial: 'V' },
  { name: 'Noor Heritage', location: 'Bengaluru', href: '/designers', initial: 'N' },
  { name: 'The Ivory Thread', location: 'Jaipur', href: '/designers', initial: 'IT' },
];

const SERVICES_MENU = [
  // {
  //   icon: Scissors,
  //   label: 'Customization Studio',
  //   desc: 'Design your outfit from scratch in 12 guided steps',
  //   href: '/customize',
  //   accent: true,
  // },
  {
    icon: Store,
    label: 'Tailor Marketplace',
    desc: 'Connect with India\'s finest master artisans',
    href: '/tailors',
    accent: false,
  },
  {
    icon: Ruler,
    label: 'Measurements',
    desc: 'Save your measurements for a perfect fit every time',
    href: '/measurements',
    accent: false,
  },
  {
    icon: Eye,
    label: 'Virtual Try-On',
    desc: 'Preview how outfits look before you buy',
    href: '/measurements',
    accent: false,
  },
  {
    icon: Package,
    label: 'Order Tracking',
    desc: 'Follow your purchase from atelier to delivery',
    href: '/orders',
    accent: false,
  },
];

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'New In', href: '/shop' },
  { label: 'Collections', key: 'Collections' },
  // { label: 'Designers', key: 'Designers' },
  { label: 'Occasions', key: 'Occasions' },
  { label: 'Services', key: 'Services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Sale', href: '/shop' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [activeCollectionsIndex, setActiveCollectionsIndex] = useState(0);
  const [activeOccasionsIndex, setActiveOccasionsIndex] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { cartCount, wishlistCount } = useCart();
  const { unreadCount: unreadNotifCount } = useNotifications();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openMenu = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMegaMenu(key);
    if (key === 'Collections') setActiveCollectionsIndex(0);
    if (key === 'Occasions') setActiveOccasionsIndex(0);
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setActiveMegaMenu(null), 120);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-premium' : 'bg-background/90 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-18">

          {/* ── Logo ── */}
          <Link href="/" className="shrink-0">
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="block text-xl font-playfair font-bold text-luxury-black tracking-wide"
            >
              HALL OF FASHION
            </motion.span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => 'key' in item && item.key && openMenu(item.key)}
                onMouseLeave={closeMenu}
              >
                {'key' in item ? (
                  <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeMegaMenu === item.key
                      ? 'text-accent bg-accent/8'
                      : 'text-foreground hover:text-accent hover:bg-accent/5'
                  }`}>
                    {item.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${activeMegaMenu === item.key ? 'rotate-180 text-accent' : ''}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={(item as { label: string; href: string }).href}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-accent hover:bg-accent/5 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}

                {/* ── Mega Menus ── */}
                <AnimatePresence>
                  {'key' in item && activeMegaMenu === item.key && (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      onMouseEnter={() => openMenu(item.key)}
                      onMouseLeave={closeMenu}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50"
                    >
                      {item.key === 'Collections' && (
                        <CollectionsPanel
                          close={() => setActiveMegaMenu(null)}
                          activeIndex={activeCollectionsIndex}
                          onIndexChange={setActiveCollectionsIndex}
                        />
                      )}
                      {item.key === 'Designers' && <DesignersPanel close={() => setActiveMegaMenu(null)} />}
                      {item.key === 'Occasions' && (
                        <OccasionsPanel
                          close={() => setActiveMegaMenu(null)}
                          activeIndex={activeOccasionsIndex}
                          onIndexChange={setActiveOccasionsIndex}
                        />
                      )}
                      {item.key === 'Services' && <ServicesPanel close={() => setActiveMegaMenu(null)} />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* ── Right Icons ── */}
          <div className="flex items-center gap-0.5">
            <Link href="/search">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2.5 hover:text-accent rounded-lg hover:bg-accent/8 transition-colors">
                <Search size={19} />
              </motion.button>
            </Link>

            <Link href="/notifications">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative p-2.5 hover:text-accent rounded-lg hover:bg-accent/8 transition-colors">
                <Bell size={19} />
                {unreadNotifCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 bg-accent text-luxury-black text-[10px] font-bold rounded-full min-w-[17px] min-h-[17px] flex items-center justify-center px-0.5">
                    {unreadNotifCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            <Link href="/wishlist">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative p-2.5 hover:text-accent rounded-lg hover:bg-accent/8 transition-colors">
                <Heart size={19} />
                {wishlistCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 bg-accent text-luxury-black text-[10px] font-bold rounded-full min-w-[17px] min-h-[17px] flex items-center justify-center px-0.5">
                    {wishlistCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            <Link href="/cart">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative p-2.5 hover:text-accent rounded-lg hover:bg-accent/8 transition-colors">
                <ShoppingBag size={19} />
                {cartCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 bg-accent text-luxury-black text-[10px] font-bold rounded-full min-w-[17px] min-h-[17px] flex items-center justify-center px-0.5">
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* Account dropdown */}
            <div className="relative ml-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 hover:text-accent rounded-lg hover:bg-accent/8 transition-colors"
              >
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border-2 border-accent/40" />
                  : <User size={19} />
                }
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-card rounded-2xl shadow-premium-lg border border-border overflow-hidden"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    {user ? (
                      <>
                        <div className="px-5 py-4 bg-accent/10 border-b border-border flex items-center gap-3">
                          {user.avatar && <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />}
                          <div>
                            <p className="font-semibold text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="py-1.5">
                          {[
                            { icon: User, label: 'My Profile', href: '/account' },
                            { icon: Package, label: 'My Orders', href: '/orders' },
                            // { icon: Scissors, label: 'Customization Studio', href: '/customize' },
                            { icon: Ruler, label: 'Measurements', href: '/measurements' },
                            { icon: Heart, label: 'Wishlist', href: '/wishlist' },
                            { icon: Bell, label: 'Notifications', href: '/notifications' },
                            { icon: MessageCircle, label: 'Support', href: '/support' },
                          ].map(({ icon: Icon, label, href }) => (
                            <Link key={label} href={href} onClick={() => setUserMenuOpen(false)}>
                              <div className="flex items-center gap-3 px-5 py-2.5 hover:bg-accent/8 transition-colors cursor-pointer">
                                <Icon size={14} className="text-muted-foreground" />
                                <span className="text-sm">{label}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-border py-1.5">
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="flex items-center gap-3 px-5 py-2.5 w-full hover:bg-red-50 text-destructive transition-colors"
                          >
                            <LogOut size={14} /><span className="text-sm">Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-5">
                        <p className="text-sm text-muted-foreground mb-4">Sign in to access your account</p>
                        <Link href="/auth/login" onClick={() => setUserMenuOpen(false)}>
                          <button className="w-full py-2.5 bg-luxury-black text-luxury-ivory rounded-xl font-semibold text-sm hover:bg-accent hover:text-luxury-black transition-all">Sign In</button>
                        </Link>
                        <Link href="/auth/signup" onClick={() => setUserMenuOpen(false)}>
                          <button className="w-full py-2.5 border border-border rounded-xl font-semibold text-sm hover:border-accent hover:text-accent transition-all mt-2">Create Account</button>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile toggle */}
            <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors ml-1" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="px-4 py-5 space-y-0.5">
                {user && (
                  <div className="flex items-center gap-3 py-3 mb-3 border-b border-border">
                    {user.avatar && <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}
                {[
                  { label: 'Home', href: '/' },
                  { label: 'New In', href: '/shop' },
                  { label: 'Shop All', href: '/shop' },
                  { label: 'Collections', href: '/collections' },
                  // { label: 'Designers', href: '/designers' },
                  { label: 'Wedding', href: '/shop?category=groom' },
                  { label: 'Festive', href: '/shop?category=festive' },
                  // { label: '✂️  Customization Studio', href: '/customize' },
                  { label: '🧵  Tailor Marketplace', href: '/tailors' },
                  { label: '📐  Measurements', href: '/measurements' },
                  { label: 'My Orders', href: '/orders' },
                  { label: 'Wishlist', href: '/wishlist' },
                  { label: 'Notifications', href: '/notifications' },
                  { label: 'Support', href: '/support' },
                  { label: 'Blog', href: '/blog' },
                ].map(({ label, href }) => (
                  <Link key={label} href={href} onClick={() => setIsOpen(false)}>
                    <div className="py-3 px-2 text-sm font-medium hover:text-accent transition-colors border-b border-border/40 last:border-0">
                      {label}
                    </div>
                  </Link>
                ))}
                {user ? (
                  <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-2 w-full text-left py-3 px-2 text-sm font-medium text-destructive mt-1">
                    <LogOut size={14} /> Sign Out
                  </button>
                ) : (
                  <div className="pt-4 flex gap-3">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)} className="flex-1">
                      <button className="w-full py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold text-sm">Sign In</button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="flex-1">
                      <button className="w-full py-3 border border-border rounded-xl font-semibold text-sm">Sign Up</button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

// ─── Sub-panels ───────────────────────────────────────────────────────────────

function CollectionsPanel({ close, activeIndex, onIndexChange }: { close: () => void; activeIndex: number; onIndexChange: (index: number) => void }) {
  const highlightItems = [
    ...COLLECTIONS_MENU.categories.map((item) => ({ ...item, type: 'category' as const })),
    ...COLLECTIONS_MENU.occasions.map((item) => ({ ...item, type: 'occasion' as const }))
  ];
  const featuredItem = highlightItems[activeIndex] ?? highlightItems[0];
  const featuredDescription = 'desc' in featuredItem ? featuredItem.desc : 'Curated for this edit';

  return (
    <div className="bg-card rounded-2xl shadow-premium-lg border border-border overflow-hidden w-[680px]">
      <div className="grid grid-cols-3 gap-0">
        {/* Categories */}
        <div className="col-span-2 p-6 border-r border-border">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-4">Shop by Category</p>
          <div className="grid grid-cols-2 gap-1">
            {COLLECTIONS_MENU.categories.map((cat, index) => (
              <Link key={cat.label} href={cat.href} onClick={close}>
                <div
                  onMouseEnter={() => onIndexChange(index)}
                  className="flex flex-col p-3 rounded-xl hover:bg-accent/8 group cursor-pointer transition-colors"
                >
                  <span className="text-sm font-semibold group-hover:text-accent transition-colors">{cat.label}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{cat.desc}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">Shop by Occasion</p>
            <div className="flex gap-2 flex-wrap">
              {COLLECTIONS_MENU.occasions.map((occ, index) => (
                <Link key={occ.label} href={occ.href} onClick={close}>
                  <span
                    onMouseEnter={() => onIndexChange(COLLECTIONS_MENU.categories.length + index)}
                    className="px-3 py-1.5 border border-border rounded-full text-xs font-medium hover:border-accent hover:text-accent transition-colors cursor-pointer"
                  >
                    {occ.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Featured */}
        <div className="p-4 flex flex-col">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">Featured</p>
          <Link href={COLLECTIONS_MENU.featured.href} onClick={close} className="flex-1 flex flex-col">
            <div className="relative rounded-xl overflow-hidden flex-1 min-h-32">
              <img src={featuredItem.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-xs font-bold leading-tight">{featuredItem.label}</p>
                <p className="text-white/70 text-[10px] mt-0.5">{featuredDescription}</p>
              </div>
            </div>
          </Link>
          <Link href="/collections" onClick={close}>
            <button className="mt-3 w-full py-2 bg-luxury-black text-luxury-ivory text-xs font-semibold rounded-lg hover:bg-accent hover:text-luxury-black transition-all flex items-center justify-center gap-1">
              All Collections <ArrowRight size={12} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function DesignersPanel({ close }: { close: () => void }) {
  return (
    <div className="bg-card rounded-2xl shadow-premium-lg border border-border overflow-hidden w-80">
      <div className="px-5 py-4 border-b border-border bg-luxury-black/5">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Featured Designers</p>
      </div>
      <div className="p-3">
        {DESIGNERS_MENU.map((designer) => (
          <Link key={designer.name} href={designer.href} onClick={close}>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/8 group cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-luxury-black text-luxury-ivory flex items-center justify-center text-[10px] font-bold shrink-0">
                {designer.initial}
              </div>
              <div>
                <p className="text-sm font-semibold group-hover:text-accent transition-colors">{designer.name}</p>
                <p className="text-xs text-muted-foreground">{designer.location}</p>
              </div>
            </div>
          </Link>
        ))}
        <div className="mt-2 px-3">
          <Link href="/designers" onClick={close}>
            <button className="w-full py-2 border border-border rounded-xl text-xs font-semibold hover:border-accent hover:text-accent transition-colors mt-1 flex items-center justify-center gap-1">
              View All Designers <ArrowRight size={12} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function OccasionsPanel({ close, activeIndex, onIndexChange }: { close: () => void; activeIndex: number; onIndexChange: (index: number) => void }) {
  const [occasions, setOccasions] = useState<PublicOccasion[]>([]);

  useEffect(() => {
    let cancelled = false;
    getOccasions()
      .then((res) => { if (!cancelled) setOccasions(res.data.occasions); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const featuredItem = occasions[activeIndex] ?? occasions[0];

  if (occasions.length === 0) {
    return (
      <div className="bg-card rounded-2xl shadow-premium-lg border border-border overflow-hidden w-[420px] p-6 text-center">
        <p className="text-sm text-muted-foreground">No occasions available yet — check back soon.</p>
        <Link href="/shop" onClick={close}>
          <button className="mt-4 px-5 py-2 bg-luxury-black text-luxury-ivory text-xs font-semibold rounded-lg hover:bg-accent hover:text-luxury-black transition-all">
            Browse All Products
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-premium-lg border border-border overflow-hidden w-[680px]">
      <div className="grid grid-cols-3 gap-0">
        <div className="col-span-2 p-6 border-r border-border">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-4">Shop by Occasion</p>
          <div className="grid grid-cols-2 gap-1">
            {occasions.map((occ, index) => (
              <Link key={occ.id} href={`/shop?occasion=${encodeURIComponent(occ.name)}`} onClick={close}>
                <div
                  onMouseEnter={() => onIndexChange(index)}
                  className="flex flex-col p-3 rounded-xl hover:bg-accent/8 group cursor-pointer transition-colors"
                >
                  <span className="text-sm font-semibold group-hover:text-accent transition-colors">{occ.name}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{occ.productCount}+ Styles</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 flex flex-col">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">Featured</p>
          <Link href={OCCASIONS_FEATURED.href} onClick={close} className="flex-1 flex flex-col">
            <div className="relative rounded-xl overflow-hidden flex-1 min-h-32">
              <img src={safeImageSrc(featuredItem?.imageUrl)} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-xs font-bold leading-tight">{featuredItem?.name}</p>
                <p className="text-white/70 text-[10px] mt-0.5">{OCCASIONS_FEATURED.desc}</p>
              </div>
            </div>
          </Link>
          <Link href="/shop" onClick={close}>
            <button className="mt-3 w-full py-2 bg-luxury-black text-luxury-ivory text-xs font-semibold rounded-lg hover:bg-accent hover:text-luxury-black transition-all flex items-center justify-center gap-1">
              Explore Occasion Wear <ArrowRight size={12} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ServicesPanel({ close }: { close: () => void }) {
  return (
    <div className="bg-card rounded-2xl shadow-premium-lg border border-border overflow-hidden w-[480px]">
      {/* Header */}
      <div className="px-6 py-4 bg-luxury-black flex items-center justify-between">
        <div>
          <p className="text-white font-playfair font-semibold text-base">Our Services</p>
          <p className="text-luxury-beige/60 text-xs mt-0.5">Bespoke fashion, crafted for you</p>
        </div>
        <Sparkles className="text-accent" size={20} />
      </div>

      {/* Service items */}
      <div className="p-3">
        {SERVICES_MENU.map(({ icon: Icon, label, desc, href, accent }) => (
          <Link key={label} href={href} onClick={close}>
            <div className={`flex items-start gap-4 px-4 py-4 rounded-xl group cursor-pointer transition-all ${
              accent ? 'bg-accent/8 hover:bg-accent/15' : 'hover:bg-muted/50'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                accent
                  ? 'bg-accent group-hover:bg-accent text-luxury-black'
                  : 'bg-luxury-black/8 group-hover:bg-luxury-black text-foreground group-hover:text-luxury-ivory'
              }`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold transition-colors ${
                    accent ? 'text-accent' : 'group-hover:text-accent'
                  }`}>{label}</p>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA banner */}
      <div className="mx-3 mb-3 rounded-xl bg-gradient-to-r from-luxury-black to-luxury-emerald p-4 flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-semibold">Start Your Custom Order</p>
          <p className="text-white/60 text-xs mt-0.5">Free consultation • 100% bespoke</p>
        </div>
        <Link href="/customize" onClick={close}>
          <button className="bg-accent text-luxury-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors whitespace-nowrap">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
