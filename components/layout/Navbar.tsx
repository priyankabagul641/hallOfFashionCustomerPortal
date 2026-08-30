'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingBag, Menu, X, Search, ChevronDown, User,
  Bell, Ruler, Package, MessageCircle, LogOut,
  Sparkles, Store, Eye, ArrowRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/use-notifications';
import { safeImageSrc } from '@/lib/utils';
import { getPublicCollections, CollectionSection, PublicCollection } from '@/lib/api/collections';
import { getSearchSuggestions, getPopularSearches, SearchSuggestion } from '@/lib/api/search';
import { useRouter } from 'next/navigation';

const RECENT_SEARCHES_KEY = 'hof_recent_searches';

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const existing = getRecentSearches().filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([trimmed, ...existing].slice(0, 5)));
}

// ─── Menu data ────────────────────────────────────────────────────────────────

const COLLECTIONS_SECTIONS: { key: CollectionSection; label: string }[] = [
  { key: 'premium_mens', label: "Premium Men's Collection" },
  { key: 'groom_counter', label: 'Groom Counter' },
  { key: 'festive', label: 'Festive Collection' },
  { key: 'occasions', label: 'Occasions' },
];

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
  { label: 'Services', key: 'Services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Sale', href: '/sale' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [activeCollectionsIndex, setActiveCollectionsIndex] = useState(0);
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
                      {item.key === 'Services' && <ServicesPanel close={() => setActiveMegaMenu(null)} />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* ── Right Icons ── */}
          <div className="flex items-center gap-0.5">
            <SearchBox />

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
                  ? <Image src={user.avatar} alt={user.name} width={28} height={28} className="w-7 h-7 rounded-full object-cover border-2 border-accent/40" />
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
                          {user.avatar && <Image src={user.avatar} alt={user.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover" />}
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
                    {user.avatar && <Image src={user.avatar} alt={user.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />}
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
                  { label: 'Sale', href: '/sale' },
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

function SearchBox() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [popular, setPopular] = useState<string[] | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    // Clear stale results from the previous query immediately so the dropdown
    // never shows a prior query's matches while the new debounced fetch is
    // still in flight — legitimate effect use (syncing UI to a changing input
    // value ahead of an async result), not derivable from render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuggestions([]);
    const timer = setTimeout(() => {
      getSearchSuggestions(trimmed)
        .then((res) => setSuggestions(res.data.suggestions))
        .catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  const submitSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    saveRecentSearch(trimmed);
    setOpen(false);
    setQuery('');
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="relative" ref={containerRef}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setRecent(getRecentSearches());
          if (popular === null) {
            getPopularSearches()
              .then((res) => setPopular(res.data.queries))
              .catch(() => setPopular([]));
          }
          setOpen((o) => !o);
        }}
        className="p-2.5 hover:text-accent rounded-lg hover:bg-accent/8 transition-colors"
      >
        <Search size={19} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-96 bg-card rounded-2xl shadow-premium-lg border border-border overflow-hidden"
          >
            <div className="p-3 border-b border-border">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitSearch(query)}
                placeholder="Search products, designers..."
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-accent text-sm"
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              {!query.trim() && recent.length > 0 && (
                <div className="p-3 border-b border-border">
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">Recent Searches</p>
                  {recent.map((q) => (
                    <button
                      key={q}
                      onClick={() => submitSearch(q)}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-accent/8 text-sm transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {!query.trim() && popular && popular.length > 0 && (
                <div className="p-3 border-b border-border">
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">Popular Searches</p>
                  {popular.map((q) => (
                    <button
                      key={q}
                      onClick={() => submitSearch(q)}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-accent/8 text-sm transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {query.trim() && (
                suggestions.length > 0 ? (
                  <div className="p-3">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => submitSearch(s.name)}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent/8 transition-colors text-left"
                      >
                        <Image src={safeImageSrc(s.image)} alt={s.name} width={36} height={36} className="rounded-lg object-cover shrink-0" />
                        <span className="text-sm">{s.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-sm text-muted-foreground">No suggestions found</p>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-panels ───────────────────────────────────────────────────────────────

function CollectionsPanel({ close, activeIndex, onIndexChange }: { close: () => void; activeIndex: number; onIndexChange: (index: number) => void }) {
  const [collectionsBySection, setCollectionsBySection] = useState<Record<string, PublicCollection[] | undefined>>({});
  const activeSection = COLLECTIONS_SECTIONS[activeIndex] ?? COLLECTIONS_SECTIONS[0];

  useEffect(() => {
    if (collectionsBySection[activeSection.key] !== undefined) return;
    let cancelled = false;
    getPublicCollections(activeSection.key)
      .then((res) => { if (!cancelled) setCollectionsBySection((prev) => ({ ...prev, [activeSection.key]: res.data.collections })); })
      .catch(() => { if (!cancelled) setCollectionsBySection((prev) => ({ ...prev, [activeSection.key]: [] })); });
    return () => { cancelled = true; };
  }, [activeSection.key, collectionsBySection]);

  const activeCollections = collectionsBySection[activeSection.key];

  return (
    <div className="bg-card rounded-2xl shadow-premium-lg border border-border overflow-hidden w-[680px]">
      <div className="grid grid-cols-3 gap-0">
        {/* Sections */}
        <div className="col-span-1 p-4 border-r border-border">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">Collections</p>
          <div className="flex flex-col gap-1">
            {COLLECTIONS_SECTIONS.map((section, index) => (
              <div
                key={section.key}
                onMouseEnter={() => onIndexChange(index)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                  index === activeIndex ? 'bg-accent/10 text-accent' : 'hover:bg-accent/8'
                }`}
              >
                <span className="text-sm font-semibold">{section.label}</span>
                <ArrowRight size={12} className={index === activeIndex ? 'opacity-100' : 'opacity-0'} />
              </div>
            ))}
          </div>
        </div>

        {/* Flyout */}
        <div className="col-span-2 p-6">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-4">{activeSection.label}</p>
          {activeCollections === undefined ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : activeCollections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No collections yet</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {activeCollections.map((col) => (
                <Link key={col.id} href={`/collection/${col.id}`} onClick={close}>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/8 group cursor-pointer transition-colors">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image src={safeImageSrc(col.image)} alt={col.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold group-hover:text-accent transition-colors">{col.name}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{col.productCount}+ Styles</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link href="/collections" onClick={close}>
            <button className="mt-4 w-full py-2 bg-luxury-black text-luxury-ivory text-xs font-semibold rounded-lg hover:bg-accent hover:text-luxury-black transition-all flex items-center justify-center gap-1">
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
