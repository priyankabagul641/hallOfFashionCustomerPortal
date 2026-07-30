'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const designers = [
  {
    id: 1,
    name: 'Regal Loom',
    category: 'Royal Menswear',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
    description: 'Premium sherwanis and ethnic wear for the modern gentleman',
  },
  {
    id: 2,
    name: 'House of Aryav',
    category: 'Contemporary Couture',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80',
    description: 'Minimalist luxury with modern sensibilities',
  },
  {
    id: 3,
    name: 'Aurum Legacy',
    category: 'Heritage Collection',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80',
    description: 'Opulent designs celebrating royal Indian heritage',
  },
];

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

export default function DesignersShowcase() {
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
          <span className="inline-block text-accent text-sm font-medium tracking-widest uppercase mb-4">
            Master Craftsmen
          </span>
          <h2 className="text-display font-playfair mb-4">
            Featured Designers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Meet the visionary designers behind Hall of Fashion&apos;s most coveted men&apos;s collections
          </p>
        </motion.div>

        {/* Designers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {designers.map((designer) => (
            <motion.div key={designer.id} variants={itemVariants}>
              <Link href={`/designer/${designer.id}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer"
                >
                  {/* Designer Image */}
                  <div className="relative h-96 rounded-2xl overflow-hidden mb-6 shadow-premium hover:shadow-premium-lg transition-all duration-500">
                    <Image
                      src={designer.image}
                      alt={designer.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors duration-500" />

                    {/* Hover Content */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                    >
                      <p className="text-white/90 text-sm font-light mb-4">
                        {designer.description}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-accent text-luxury-black font-semibold rounded-lg hover:shadow-premium transition-all duration-300"
                      >
                        Explore
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Designer Info */}
                  <div className="text-center">
                    <h3 className="text-2xl font-playfair font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {designer.name}
                    </h3>
                    <p className="text-muted-foreground text-sm font-light">
                      {designer.category}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Designers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/designers">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              View All Designers
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
