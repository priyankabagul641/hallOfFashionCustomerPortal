'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getOccasions, PublicOccasion } from '@/lib/api/products';
import { safeImageSrc } from '@/lib/utils';

export default function OccasionSection() {
  const [occasions, setOccasions] = useState<PublicOccasion[]>([]);

  useEffect(() => {
    let cancelled = false;
    getOccasions()
      .then((res) => { if (!cancelled) setOccasions(res.data.occasions.slice(0, 5)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (occasions.length === 0) return null;

  const [featured, ...rest] = occasions;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-14"
        >
          <span className="text-accent uppercase tracking-[0.35em] text-xs">
            Shop By Occasion
          </span>
          <h2 className="text-display font-playfair mt-4 mb-4">
            Dressed For The Moment
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From weddings to festive nights, find the look that fits your occasion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Large featured tile */}
          <Link href={`/shop?occasion=${encodeURIComponent(featured.name)}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
              whileHover={{ y: -8 }}
              className="group relative h-80 md:h-[34rem] rounded-2xl overflow-hidden cursor-pointer shadow-premium hover:shadow-premium-lg transition-all duration-500 bg-card"
            >
              <Image
                src={safeImageSrc(featured.imageUrl)}
                alt={featured.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-3xl font-playfair font-bold text-white mb-1">
                  {featured.name}
                </h3>
                <p className="text-white/70 text-sm font-light">
                  {featured.productCount}+ Styles &rarr;
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Smaller tiles */}
          <div className="grid grid-cols-2 gap-6 lg:gap-8">
            {rest.map((occasion, index) => (
              <Link key={occasion.id} href={`/shop?occasion=${encodeURIComponent(occasion.name)}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  whileHover={{ y: -6 }}
                  className="group relative h-40 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-premium hover:shadow-premium-lg transition-all duration-500 bg-card"
                >
                  <Image
                    src={safeImageSrc(occasion.imageUrl)}
                    alt={occasion.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <h3 className="text-lg font-playfair font-bold text-white">
                      {occasion.name}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
