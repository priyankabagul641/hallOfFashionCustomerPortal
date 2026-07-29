'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function CinematicBanner() {
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
          {/* Background Image */}
          <Image
            src="products/groom-collection-2.png"
            alt="Men's Heritage Collection"
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
          <div className="relative h-full flex items-center justify-start px-8 md:px-16">
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
                Groom Collection
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white/80 text-lg mb-8 font-light"
              >
                Handcrafted sherwanis and Indo-western attire for your special day
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Link href="/collection/groom">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#D8C3A5' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-accent text-luxury-black font-bold rounded-lg transition-all duration-300 hover:shadow-premium"
                  >
                    Explore Groom Wear
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
