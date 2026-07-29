'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { products } from '@/data/products';

export default function FestivalCollection() {
  const festivalProducts = products.filter(p => p.occasion?.includes('Festive') && p.category === 'men').slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-background">
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
            FESTIVE COLLECTION
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6">
            Celebrate in Style
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Elevate your festive moments with our exclusive collection of kurtas and ethnic wear for Diwali, Holi, and celebrations.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {festivalProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative h-80 rounded-xl overflow-hidden mb-4 shadow-premium group-hover:shadow-premium-lg transition-all">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                  {product.discountPrice && (
                    <div className="absolute top-4 right-4 bg-accent text-primary px-3 py-1 rounded-full text-xs font-bold">
                      Sale
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{product.designer}</p>
                <h3 className="font-playfair text-lg font-semibold text-foreground group-hover:text-accent transition-colors mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-accent font-semibold">
                    ₹{product.discountPrice ? product.discountPrice.toLocaleString('en-IN') : product.price.toLocaleString('en-IN')}
                  </p>
                  {product.discountPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center">
          <Link href="/collection/festive">
            <button className="inline-block px-8 py-4 bg-accent text-primary font-semibold rounded-xl hover:shadow-premium-lg transition-all hover:scale-105">
              View Full Festival Collection
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
