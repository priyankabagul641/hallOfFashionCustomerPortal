'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getPublicCollections, PublicCollection } from '@/lib/api/collections';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function CollectionsGrid() {
  const [collections, setCollections] = useState<PublicCollection[]>([]);

  useEffect(() => {
    let cancelled = false;
    getPublicCollections()
      .then((res) => { if (!cancelled) setCollections(res.data.collections.slice(0, 4)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (collections.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-display font-playfair mb-4">
            Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Explore our curated collections of premium men&apos;s ethnic and designer wear,
            each telling a story of heritage and excellence
          </p>
        </motion.div>

        {/* Collections Grid */}
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
                  className="group relative h-96 md:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-premium hover:shadow-premium-lg transition-all duration-500 bg-card"
                >
                  {/* Image */}
                  <Image
                    src={collection.image || '/placeholder.jpg'}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-px bg-accent" />
                        <span className="text-accent text-sm font-medium">
                          {collection.productCount} pieces
                        </span>
                      </div>
                      <h3 className="text-3xl font-playfair font-bold text-white mb-2">
                        {collection.name}
                      </h3>
                      <p className="text-white/70 text-sm font-light mb-2 line-clamp-2">
                        {collection.description}
                      </p>
                      <p className="text-white/70 text-sm font-light">
                        Explore collection &rarr;
                      </p>
                    </motion.div>
                  </div>

                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 border-2 border-accent rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Collections CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/collections">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              View All Collections
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
