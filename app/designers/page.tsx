'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { designers } from '@/data/products';

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function DesignersPage() {
  return (
    <main className="bg-background text-foreground">
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-4">
              Master Designers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Meet the visionary designers behind STYLEKART&apos;s most coveted collections. 
              Each brings their unique artistry and heritage to every creation.
            </p>
          </motion.div>

          {/* Designers */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-20"
          >
            {designers.map((designer, idx) => (
              <motion.div
                key={designer.id}
                variants={itemVariants}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                  idx % 2 === 1 ? 'md:grid-flow-dense' : ''
                }`}
              >
                {/* Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-premium-lg"
                >
                  <Image
                    src={designer.image}
                    alt={designer.name}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>

                {/* Content */}
                <Link href={`/designer/${designer.id}`}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="space-y-6 cursor-pointer"
                  >
                    <div>
                      <span className="inline-block text-accent text-sm font-medium tracking-widest uppercase mb-4">
                        {designer.location}
                      </span>
                      <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
                        {designer.name}
                      </h2>
                      <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                        {designer.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-accent">
                          {designer.location}
                        </p>
                        <p className="text-sm text-muted-foreground">Based In</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-accent">
                          {designer.awards.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Awards</p>
                      </div>
                    </div>

                    {/* Awards */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Recognition</p>
                      <ul className="space-y-1">
                        {designer.awards.map((award) => (
                          <li key={award} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="text-accent">✓</span> {award}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-premium transition-all"
                    >
                      Explore Collections →
                    </motion.button>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
