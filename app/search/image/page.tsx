'use client';

import { motion } from 'framer-motion';
import Footer from '@/components/layout/Footer';
import ImageSearchPanel from '@/components/try-on/ImageSearchPanel';
import { Camera } from 'lucide-react';

export default function ImageSearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-28 pb-12 bg-luxury-black text-luxury-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Camera className="text-accent" size={24} />
              <span className="text-accent font-cormorant text-lg tracking-widest uppercase">Snap &amp; Shop</span>
              <span className="rounded-full bg-accent/20 border border-accent px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent">
                Beta
              </span>
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-3">
              Search by <span className="text-accent">Image</span>
            </h1>
            <p className="text-luxury-beige/70 text-base max-w-xl">
              Upload or snap a photo of an outfit and we&apos;ll find it in our catalogue — or the closest designs and
              colours we carry. Runs right in your browser.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ImageSearchPanel />
      </div>

      <Footer />
    </main>
  );
}
