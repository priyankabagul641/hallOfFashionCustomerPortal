'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getPublicCollections, PublicCollection, CollectionSection } from '@/lib/api/collections';
import { safeImageSrc } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

interface SectionCollectionsProps {
  section: CollectionSection;
  eyebrow: string;
  title: string;
  subtitle: string;
}

export default function SectionCollections({ section, eyebrow, title, subtitle }: SectionCollectionsProps) {
  const [collections, setCollections] = useState<PublicCollection[]>([]);

  useEffect(() => {
    let cancelled = false;
    getPublicCollections(section)
      .then((res) => { if (!cancelled) setCollections(res.data.collections.slice(0, 4)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [section]);

  if (collections.length === 0) return null;

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
          <span className="text-accent uppercase tracking-[0.35em] text-xs">{eyebrow}</span>
          <h2 className="text-display font-playfair mt-4 mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {collections.map((collection) => (
            <motion.div key={collection.id} variants={itemVariants}>
              <Link href={`/collection/${collection.id}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative h-80 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-premium hover:shadow-premium-lg transition-all duration-500 bg-card"
                >
                  <Image
                    src={safeImageSrc(collection.image)}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-playfair font-bold text-white mb-1">
                      {collection.name}
                    </h3>
                    <p className="text-white/70 text-sm font-light">
                      {collection.productCount}+ Styles &rarr;
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
