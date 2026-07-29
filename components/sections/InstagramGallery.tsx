'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';

const instagramPosts = [
  {
    id: 1,
    image: 'products/sherwani-2-1.jpg',
    title: 'Sherwanis',
    subtitle: 'Royal Wedding Collection',
    count: '145+ Styles',
  },
  {
    id: 2,
    image: 'products/Indo-western.png',
    title: 'Indo Western',
    subtitle: 'Contemporary Ethnic Wear',
    count: '96+ Styles',
  },
  {
    id: 3,
    image: 'products/kurta-2-1.jpg',
    title: 'Kurtas',
    subtitle: 'Festive & Occasion Wear',
    count: '178+ Styles',
  },
  {
    id: 4,
    image: 'products/Blazer.png',
    title: 'Blazers',
    subtitle: 'Luxury Tailored Fits',
    count: '68+ Styles',
  },
  {
    id: 5,
    image: 'products/suits.png',
    title: 'Suits',
    subtitle: 'Discover luxury sherwanis, suits, blazers and handcrafted Indo-western collections.',
    count: '59+ Styles',
  },
  {
    id: 6,
    image: 'products/wedding wear.png',
    title: 'Wedding Wear',
    subtitle: 'Exclusive Groom Edit',
    count: '124+ Styles',
  },
];

export default function InstagramGallery() {
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

            <motion.div
              whileHover={{ y: -6 }}
              className="group relative flex-1 rounded-[28px] overflow-hidden cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)] transition-all duration-500"
            >
              <Image
                src={instagramPosts[0].image}
                alt="{instagramPosts[0].title}"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-black/25" />

              <div className="absolute bottom-5 left-5">
                <h3 className="text-white font-playfair text-2xl font-bold drop-shadow-lg">
                  {instagramPosts[0].title}
                </h3>

                <p className="text-white/80 text-sm">
                  {instagramPosts[0].count}
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="group relative flex-1 rounded-[28px] overflow-hidden cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)] transition-all duration-500"
            >
              <Image
                src={instagramPosts[1].image}
                alt={instagramPosts[1].title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-black/25" />

              <div className="absolute bottom-5 left-5">
                <h3 className="text-white font-playfair text-2xl font-bold drop-shadow-lg">
                  {instagramPosts[1].title}
                </h3>

                <p className="text-white/80 text-sm">
                  {instagramPosts[1].count}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Center Hero */}
          <motion.div
            whileHover={{ y: -8 }}
            className="group relative col-span-6 rounded-[36px] overflow-hidden cursor-pointer shadow-[0_25px_70px_rgba(0,0,0,0.18)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.30)] transition-all duration-500"
          >
            <Image
              src={instagramPosts[5].image}
              alt={instagramPosts[5].title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000"
            />


            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            <div className="absolute bottom-8 left-8">
              <p className="text-accent tracking-[0.3em] uppercase text-xs mb-3">
                Hall Of Fashion
              </p>

              <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-white mb-4">
                Premium Menswear
              </h2>

              <h2 className="font-playfair text-5xl font-bold text-white mb-4 drop-shadow-xl">
                {instagramPosts[5].title}
              </h2>

              <p className="text-white/90 text-lg max-w-md">
                {instagramPosts[5].subtitle}
              </p>

              <p className="text-accent mt-4 font-medium">
                {instagramPosts[5].count}
              </p>
            </div>
          </motion.div>

          {/* Right Side */}
          <div className="col-span-3 flex flex-col gap-4">

            <motion.div
              whileHover={{ y: -6 }}
              className="group relative flex-1 rounded-[28px] overflow-hidden cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)] transition-all duration-500"
            >
              <Image
                src={instagramPosts[3].image}
                alt={instagramPosts[3].title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute bottom-5 left-5">
                <h3 className="text-white font-playfair text-2xl font-bold drop-shadow-lg">
                  {instagramPosts[3].title}
                </h3>

                <p className="text-white/80 text-sm">
                  {instagramPosts[3].count}
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="group relative flex-1 rounded-[28px] overflow-hidden cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)] transition-all duration-500"
            >
              <Image
                src={instagramPosts[4].image}
                alt={instagramPosts[4].title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute bottom-5 left-5">
                <h3 className="text-white font-playfair text-2xl font-bold drop-shadow-lg">
                  {instagramPosts[4].title}
                </h3>

                <p className="text-white/80 text-sm">
                  {instagramPosts[4].count}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
