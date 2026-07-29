'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  image?: string;
}

// const heroBanners: HeroBanner[] = [
//   {
//     id: 1,
//     title: "Premium Men's Couture",
//     subtitle: "Discover curated sherwanis and ethnic wear from master designers",
//     cta: "Explore Collection",
//     ctaLink: "/collections",
//     image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=90",
//   },
//   {
//     id: 2,
//     title: "Regal. Refined. Remarkable.",
//     subtitle: "Experience the finest men's fashion marketplace",
//     cta: "Shop Designers",
//     ctaLink: "/designers",
//     image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=90",
//   },
//   {
//     id: 3,
//     title: "Indo-Western Excellence",
//     subtitle: "Limited edition blazers and bandhgalas",
//     cta: "View New Arrivals",
//     ctaLink: "/shop",
//     image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=90",
//   },
//   {
//     id: 4,
//     title: "The Season's Edit",
//     subtitle: "Tailored silhouettes, statement layers, and elevated occasion wear",
//     cta: "Discover More",
//     ctaLink: "/shop",
//     image: "https://images.unsplash.com/photo-1529139574466-a303027d0b12?auto=format&fit=crop&w=1600&q=90",
//   },
// ];

const heroBanners: HeroBanner[] = [
  {
    id: 1,
    title: 'Exclusive Groom Collection',
    subtitle: 'Curated groom wear featuring premium sherwanis, bandhgalas, tuxedos and wedding ensembles',
    cta: 'Explore Groom Wear',
    ctaLink: '/collection/groom',
    image: 'products/groom-collection-1.png',
  },
  {
    id: 2,
    title: 'Premium Formal Collection',
    subtitle: 'Sophisticated formalwear crafted for modern gentlemen and special occasions',
    cta: 'Explore Collection',
    ctaLink: '/collections',
    image: 'products/hero-formal.png',
  },

  {
    id: 3,
    title: 'Royal Sherwani Collection',
    subtitle: 'Regal sherwanis featuring intricate craftsmanship for weddings and celebrations',
    cta: 'Shop Sherwanis',
    ctaLink: '/collection/sherwanis',
    image: 'products/hero-sherwani.png',
  },

  {
    id: 4,
    title: 'Designer Kurta Collection',
    subtitle: 'Elegant festive kurtas blending timeless tradition with contemporary style',
    cta: 'Explore Kurtas',
    ctaLink: '/collection/kurtas',
    image: 'products/hero-kurta.png',
  },

  {
    id: 5,
    title: 'Blazers & Wedding Suits',
    subtitle: 'Luxury tailored blazers and suits designed for receptions and formal occasions',
    cta: 'Shop Blazers',
    ctaLink: '/collection/blazers',
    image: 'products/hero-blazer.png',
  },

  {
    id: 6,
    title: 'Smart Casual Collection',
    subtitle: 'Contemporary menswear combining comfort, versatility and refined style',
    cta: 'Explore Casual Wear',
    ctaLink: '/casual-wear',
    image: 'products/hero-casual.png',
  },
];
export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
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

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => (prev + newDirection + heroBanners.length) % heroBanners.length);
  };

  return (
    // <div className="relative w-full h-screen overflow-hidden bg-background">
    <div className="relative w-full h-[85vh] overflow-hidden px-4 md:px-6 lg:px-8 py-4">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          // className="absolute inset-0"
          className="
absolute
inset-y-0
left-4
right-4
md:left-6
md:right-6
lg:left-8
lg:right-8
rounded-[36px]
overflow-hidden
shadow-[0_35px_80px_rgba(0,0,0,0.28)]
border
border-white/10
"
        >
          {/* Dark Gradient Overlay */}
          {/* <div className={`absolute inset-0 bg-gradient-to-br ${heroBanners[currentSlide].bgColor} opacity-90`} /> */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <motion.img
              key={heroBanners[currentSlide].image}
              src={heroBanners[currentSlide].image}
              alt={heroBanners[currentSlide].title}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{
                duration: 6,
                ease: "easeOut",
              }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/15" />

            {/* Luxury Gradient */}
            <div className="absolute inset-0 bg-black/15" />
            {/* bg-gradient-to-r from-black/78 via-black/38 to-transparent */}
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center px-6 md:px-16 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-3xl text-left"
            >
              <p className="
mb-4
inline-flex
items-center
rounded-full
border
border-white/30
bg-black/20
backdrop-blur-md
px-4
py-1.5
text-xs
md:text-sm
font-medium
uppercase
tracking-[0.28em]
text-white
shadow-[0_8px_30px_rgba(0,0,0,0.45)]
">
                Luxury Fashion Edit
              </p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="
text-5xl
md:text-7xl
font-playfair
font-bold
text-white
mb-5
leading-tight
drop-shadow-[0_8px_25px_rgba(0,0,0,0.95)]
"
              >
                {heroBanners[currentSlide].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="
text-lg
md:text-2xl
text-white
font-cormorant
mb-8
font-light
max-w-2xl
drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]
"
              >
                {heroBanners[currentSlide].subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Link href={heroBanners[currentSlide].ctaLink}>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 20px 40px rgba(200, 169, 107, 0.3)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="
px-12
py-4
bg-accent
text-luxury-black
font-poppins
font-semibold
rounded-full
hover:bg-gold
transition-all
duration-300
text-lg
shadow-[0_15px_40px_rgba(0,0,0,0.35)]
"
                  >
                    {heroBanners[currentSlide].cta}
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-20 left-0 right-0 flex justify-center gap-10 md:gap-24"
            >
              {[
                { label: '500+', value: 'Designers' },
                { label: '50K+', value: 'Customers' },
                { label: '10K+', value: 'Products' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <p className="text-2xl md:text-3xl font-playfair font-bold text-accent">{stat.label}</p>
                  <p className="text-sm md:text-base text-muted font-inter">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => paginate(-1)}
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
      >
        <ChevronLeft size={24} className="text-ivory" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => paginate(1)}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
      >
        <ChevronRight size={24} className="text-ivory" />
      </motion.button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {heroBanners.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => {
              setDirection(idx > currentSlide ? 1 : -1);
              setCurrentSlide(idx);
            }}
            className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-accent w-8' : 'bg-white/30 w-2'
              }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
}
