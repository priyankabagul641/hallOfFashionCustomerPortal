'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts, getDisplayPrice, Product } from '@/lib/api/products';

export default function CompleteTheLook({ category }: { category?: string }) {
  const [complementary, setComplementary] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    getProducts({ pageSize: 20 }).then((res) => {
      if (cancelled) return;
      const picks = res.data.products
        .filter((p) => p.category !== category)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      setComplementary(picks);
    });
    return () => { cancelled = true; };
  }, [category]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 border-t border-border">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h3 className="font-playfair text-2xl font-bold mb-8">Complete the Look</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {complementary.map((product) => {
            const { effectivePrice, mrp, percentOff } = getDisplayPrice(product);
            return (
              <motion.div key={product.id} variants={itemVariants}>
                <Link href={`/product/${product.id}`}>
                  <div className="group relative h-48 rounded-lg overflow-hidden mb-4 shadow-premium cursor-pointer">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    {percentOff !== undefined && percentOff > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                        {percentOff}% OFF
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{product.designer}</p>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className="text-accent font-semibold text-sm">
                      ₹{effectivePrice.toLocaleString('en-IN')}
                    </p>
                    {mrp > effectivePrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        ₹{mrp.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
