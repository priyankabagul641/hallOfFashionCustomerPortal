'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories, PublicCategory } from '@/lib/api/products';

export default function InstagramGallery() {
  const [categories, setCategories] = useState<PublicCategory[]>([]);

  useEffect(() => {
    getCategories()
      .then((res) => {
        const sorted = [...res.data.categories]
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .slice(0, 6);
        setCategories(sorted);
      })
      .catch(() => setCategories([]));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  const getCategoryLink = (category: PublicCategory) =>
    `/shop?category=${encodeURIComponent(category.name)}`;

  if (categories.length < 6) return null;

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 bg-background">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <p className="text-accent text-sm font-semibold tracking-widest mb-4">
            INSTAGRAM @HALLOFFASHION
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Follow Our Fashion Journey
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
            Discover premium men&apos;s fashion moments, styling inspiration, and behind-the-scenes couture on our Instagram.
          </p>
          <Link href="https://instagram.com" target="_blank">
            <button className="inline-block px-6 py-3 bg-accent text-primary font-semibold rounded-full hover:shadow-premium-lg transition-all">
              Follow on Instagram
            </button>
          </Link>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-12 gap-4 h-[580px]"
        >
          {/* Left Side */}
          <div className="col-span-3 flex flex-col gap-4">
            {[categories[0], categories[1]].map((category) => (
              <Link key={category.id} href={getCategoryLink(category)} className="flex-1">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group relative h-full rounded-[28px] overflow-hidden cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)] transition-all duration-500"
                >
                  {category.imageUrl && (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/25" />

                  <div className="absolute bottom-5 left-5">
                    <h3 className="text-white font-playfair text-2xl font-bold drop-shadow-lg">
                      {category.name}
                    </h3>

                    <p className="text-white/80 text-sm">
                      {category.productCount}+ Styles
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Center Hero */}
          <Link href={getCategoryLink(categories[5])} className="col-span-6">
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative h-full rounded-[36px] overflow-hidden cursor-pointer shadow-[0_25px_70px_rgba(0,0,0,0.18)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.30)] transition-all duration-500"
            >
              {categories[5].imageUrl && (
                <Image
                  src={categories[5].imageUrl}
                  alt={categories[5].name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="absolute bottom-8 left-8">
                <p className="text-accent tracking-[0.3em] uppercase text-xs mb-3">
                  Hall Of Fashion
                </p>

                <h2 className="font-playfair text-5xl font-bold text-white mb-4 drop-shadow-xl">
                  {categories[5].name}
                </h2>

                <p className="text-accent mt-4 font-medium">
                  {categories[5].productCount}+ Styles
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Right Side */}
          <div className="col-span-3 flex flex-col gap-4">
            {[categories[3], categories[4]].map((category) => (
              <Link key={category.id} href={getCategoryLink(category)} className="flex-1">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group relative h-full rounded-[28px] overflow-hidden cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)] transition-all duration-500"
                >
                  {category.imageUrl && (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/25" />

                  <div className="absolute bottom-5 left-5">
                    <h3 className="text-white font-playfair text-2xl font-bold drop-shadow-lg">
                      {category.name}
                    </h3>

                    <p className="text-white/80 text-sm">
                      {category.productCount}+ Styles
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
