'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useBanners } from '@/hooks/use-banners';
import { resolveBannerHref } from '@/lib/banner-link';

export default function HeroCarousel() {
  const { banners, loading, error, recordImpression, recordClick } = useBanners('homepage');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [href, setHref] = useState<string | null>(null);

  const activeSlide = banners.length > 0 ? currentSlide % banners.length : 0;

  useEffect(() => {
    const banner = banners[activeSlide];
    if (banner) recordImpression(banner.id).catch(() => {});
  }, [activeSlide, banners, recordImpression]);

  useEffect(() => {
    let cancelled = false;
    const banner = banners[activeSlide];
    if (!banner) return;
    resolveBannerHref(banner).then((h) => {
      if (!cancelled) setHref(h);
    });
    return () => {
      cancelled = true;
    };
  }, [banners, activeSlide]);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => (prev + newDirection + banners.length) % banners.length);
  };

  if (loading && banners.length === 0) {
    return (
      <div className="relative w-full h-[85vh] flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (error || banners.length === 0) {
    return null;
  }

  const banner = banners[activeSlide];

  const slideBody = (
    <>
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <motion.img
          key={`${banner.id}-desktop`}
          src={banner.desktopImageUrl}
          alt={banner.bannerTitle}
          className="hidden md:block w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{
            duration: 6,
            ease: 'easeOut',
          }}
        />
        <motion.img
          key={`${banner.id}-mobile`}
          src={banner.mobileImageUrl || banner.desktopImageUrl}
          alt={banner.bannerTitle}
          className="block md:hidden w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{
            duration: 6,
            ease: 'easeOut',
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Luxury Gradient */}
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-6 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-3xl text-left"
        >
          <p className="
mb-4
inline-flex
items-center
rounded-full
border
border-white/30
bg-black/20
backdrop-blur-md
px-4
py-1.5
text-xs
md:text-sm
font-medium
uppercase
tracking-[0.28em]
text-white
shadow-[0_8px_30px_rgba(0,0,0,0.45)]
">
            Luxury Fashion Edit
          </p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="
text-5xl
md:text-7xl
font-playfair
font-bold
text-white
mb-5
leading-tight
drop-shadow-[0_8px_25px_rgba(0,0,0,0.95)]
"
          >
            {banner.bannerTitle}
          </motion.h1>

          {banner.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="
text-lg
md:text-2xl
text-white
font-cormorant
mb-8
font-light
max-w-2xl
drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]
"
            >
              {banner.subtitle}
            </motion.p>
          )}

          {banner.ctaLabel && href && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(200, 169, 107, 0.3)',
                }}
                whileTap={{ scale: 0.98 }}
                className="
px-12
py-4
bg-accent
text-luxury-black
font-poppins
font-semibold
rounded-full
hover:bg-gold
transition-all
duration-300
text-lg
shadow-[0_15px_40px_rgba(0,0,0,0.35)]
"
              >
                {banner.ctaLabel}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-20 left-0 right-0 flex justify-center gap-10 md:gap-24"
        >
          {[
            { label: '500+', value: 'Designers' },
            { label: '50K+', value: 'Customers' },
            { label: '10K+', value: 'Products' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-playfair font-bold text-accent">{stat.label}</p>
              <p className="text-sm md:text-base text-muted font-inter">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );

  return (
    <div className="relative w-full h-[85vh] overflow-hidden px-4 md:px-6 lg:px-8 py-4">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={banner.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="
absolute
inset-y-0
left-4
right-4
md:left-6
md:right-6
lg:left-8
lg:right-8
rounded-[36px]
overflow-hidden
shadow-[0_35px_80px_rgba(0,0,0,0.28)]
border
border-white/10
"
        >
          {href ? (
            <Link
              href={href}
              onClick={() => recordClick(banner.id).catch(() => {})}
              className="absolute inset-0 block"
            >
              {slideBody}
            </Link>
          ) : (
            slideBody
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {banners.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(-1)}
            className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
          >
            <ChevronLeft size={24} className="text-ivory" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(1)}
            className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
          >
            <ChevronRight size={24} className="text-ivory" />
          </motion.button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {banners.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setDirection(idx > activeSlide ? 1 : -1);
                  setCurrentSlide(idx);
                }}
                className={`h-2 rounded-full transition-all ${idx === activeSlide ? 'bg-accent w-8' : 'bg-white/30 w-2'
                  }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
