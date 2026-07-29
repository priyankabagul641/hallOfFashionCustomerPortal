'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const heroContent = [
  {
    id: 1,
    title: 'Royal Sherwanis',
    subtitle: 'Handcrafted sherwanis for the modern groom',
    cta: 'Explore Sherwanis',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1400&q=80',
  },
  {
    id: 2,
    title: 'Indo-Western',
    subtitle: 'Premium blazers & bandhgalas for the discerning gentleman',
    cta: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1400&q=80',
  },
  {
    id: 3,
    title: 'Festive Kurtas',
    subtitle: 'Elegant kurtas for celebrations and special occasions',
    cta: 'View Collection',
    image: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=1400&q=80',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % heroContent.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full h-screen overflow-hidden pt-20">
      {/* Background Image Carousel */}
      <motion.div
        key={current}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.5 },
        }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src={heroContent[current].image}
          alt={heroContent[current].title}
          fill
          className="object-cover"
          priority
          quality={85}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          key={`content-${current}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          {/* Subtitle Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-12 h-px bg-gradient-to-r from-accent to-transparent" />
              <span className="text-accent text-sm font-medium tracking-widest uppercase">
                Luxury Collection
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-7xl font-playfair font-bold text-white mb-4 leading-tight"
          >
            {heroContent[current].title}
          </motion.h1>

          {/* Description */}
          <motion.p
            key={`subtitle-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-100 mb-8 font-light"
          >
            {heroContent[current].subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-6"
          >
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#D8C3A5' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-accent text-luxury-black font-semibold rounded-lg transition-all duration-300 hover:shadow-premium"
              >
                {heroContent[current].cta}
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-10">
        {heroContent.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => {
              setDirection(idx > current ? 1 : -1);
              setCurrent(idx);
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'bg-accent w-8' : 'bg-white/50 w-2 hover:bg-white'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 right-8 text-white/60 text-sm"
      >
        <p>Scroll to explore</p>
      </motion.div>
    </section>
  );
}
