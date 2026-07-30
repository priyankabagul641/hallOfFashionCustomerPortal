'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useBanners } from '@/hooks/use-banners';
import { resolveBannerHref } from '@/lib/banner-link';

export default function CinematicBanner() {
  const { banners, loading, error, recordImpression, recordClick } = useBanners('homepage', 'promotion');
  const banner = banners[0];
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    if (banner) recordImpression(banner.id).catch(() => {});
  }, [banner, recordImpression]);

  useEffect(() => {
    let cancelled = false;
    if (!banner) return;
    resolveBannerHref(banner).then((h) => {
      if (!cancelled) setHref(h);
    });
    return () => {
      cancelled = true;
    };
  }, [banner]);

  if (loading || error || !banner) return null;

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-premium-lg"
        >
          {href && (
            <Link
              href={href}
              onClick={() => recordClick(banner.id).catch(() => {})}
              className="absolute inset-0 z-0 block"
              aria-label={banner.bannerTitle}
            />
          )}
          {/* Background Image */}
          <Image
            src={banner.desktopImageUrl}
            alt={banner.bannerTitle}
            fill
            className="object-cover"
            quality={85}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          {/* Animated Background Elements */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-accent to-transparent rounded-full blur-3xl"
          />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-start px-8 md:px-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-6"
              >
                <div className="flex items-center gap-2">
                  <div className="w-12 h-px bg-gradient-to-r from-accent to-transparent" />
                  <span className="text-accent text-sm font-medium tracking-widest uppercase">
                    Heritage Collection
                  </span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 leading-tight"
              >
                {banner.bannerTitle}
              </motion.h2>

              {/* Description */}
              {banner.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-white/80 text-lg mb-8 font-light"
                >
                  {banner.subtitle}
                </motion.p>
              )}

              {/* CTA */}
              {href && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative z-10"
                >
                  <Link href={href} onClick={() => recordClick(banner.id).catch(() => {})}>
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: '#D8C3A5' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-4 bg-accent text-luxury-black font-bold rounded-lg transition-all duration-300 hover:shadow-premium"
                    >
                      {banner.ctaLabel || 'Shop Now'}
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
