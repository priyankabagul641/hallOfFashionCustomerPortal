'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPublicCollections, PublicCollection } from '@/lib/api/collections';
import { safeImageSrc } from '@/lib/utils';

export default function WeddingCollection() {
  const [collections, setCollections] = useState<PublicCollection[]>([]);

  useEffect(() => {
    let cancelled = false;
    getPublicCollections('groom_counter')
      .then((res) => { if (!cancelled) setCollections(res.data.collections.slice(0, 2)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  if (collections.length === 0) return null;

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-background via-background to-muted/10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <p className="text-accent text-sm font-semibold tracking-widest mb-4">
            GROOM COUTURE
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your Royal Moment Awaits
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Bespoke groom ensembles crafted by master artisans. Every stitch tells a story of heritage and devotion.
          </p>
        </motion.div>

        {/* Wedding Grid */}
        <div className={`grid grid-cols-1 ${collections.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-8 mb-12`}>
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              variants={itemVariants}
              className="relative h-96 md:h-full md:min-h-[500px] rounded-2xl overflow-hidden group shadow-premium-lg"
            >
              <Image
                src={safeImageSrc(collection.image)}
                alt={collection.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-playfair text-3xl font-bold text-white mb-2">
                  {collection.name}
                </h3>
                <p className="text-white/80 mb-4 line-clamp-2">{collection.description}</p>
                <Link href={`/collection/${collection.id}`}>
                  <button className="flex items-center gap-2 text-accent hover:text-white transition-colors">
                    Explore Now <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: '👔',
              title: 'Bespoke Tailoring',
              description: 'Custom measurements for your perfect fit',
            },
            {
              icon: '✨',
              title: 'Premium Embroidery',
              description: 'Intricate zardozi and kundan work',
            },
            {
              icon: '🎩',
              title: 'Complete Ensemble',
              description: 'Matching accessories and styling consultation',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="glass rounded-xl p-8 text-center hover:shadow-premium transition-all"
              whileHover={{ y: -5 }}
            >
              <p className="text-4xl mb-4">{feature.icon}</p>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
