'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <main className="bg-background text-foreground min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center pt-28">
        <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
          {/* Animated 404 */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-9xl font-playfair font-bold text-accent/20"
          >
            404
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl font-playfair font-bold">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              The page you&apos;re looking for doesn&apos;t exist. It might have been moved or 
              the URL might be incorrect.
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-premium transition-all"
              >
                Back to Home
              </motion.button>
            </Link>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Continue Shopping
              </motion.button>
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-6xl"
          >
            ✨
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
