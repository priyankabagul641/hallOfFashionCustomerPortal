'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import { Star, Award, Heart, Zap } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Star,
      title: 'Heritage',
      description: 'Celebrating centuries of Indian craftsmanship and tradition',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Uncompromising quality in every stitch and detail',
    },
    {
      icon: Heart,
      title: 'Authenticity',
      description: 'Genuine designs from master craftsmen and designers',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Blending tradition with contemporary aesthetics',
    },
  ];

  return (
    <main className="bg-background text-foreground">
      <div className="pt-28">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden mb-20">
          <Image
            src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1400&q=80"
            alt="Hall of Fashion Heritage"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-7xl font-playfair font-bold text-white mb-4">
                HALL OF FASHION
              </h1>
              <p className="text-xl text-gray-100 max-w-2xl mx-auto">
                Premium Men&apos;s Couture
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Story */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-5xl font-playfair font-bold">Our Story</h2>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  Hall of Fashion was founded with a singular vision: to celebrate the timeless elegance 
                  of men&apos;s ethnic and contemporary fashion. We believe that every piece of clothing 
                  tells a story—one of craftsmanship, tradition, and masculine refinement.
                </p>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  By partnering with master artisans and renowned designers, we create sherwanis, 
                  kurtas, and Indo-western pieces that transcend fashion to become treasured heirlooms. 
                  Each collection represents years of dedication to excellence and authenticity.
                </p>
              </div>
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-premium-lg">
                <Image
                  src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80"
                  alt="Our Heritage"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.section>

          {/* Values */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-5xl font-playfair font-bold text-center mb-16">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="space-y-4 text-center"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                    <value.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-playfair font-bold">{value.title}</h3>
                  <p className="text-muted-foreground font-light">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Commitment */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-12 text-center shadow-premium"
          >
            <h2 className="text-4xl font-playfair font-bold mb-6">Our Commitment</h2>
            <p className="text-lg text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              We are committed to sustainability, fair trade practices, and supporting local artisans. 
              Every purchase supports families, preserves traditional crafts, and celebrates the rich 
              cultural heritage of India. At Hall of Fashion, luxury is not just about fashion—it&apos;s about 
              creating a positive impact while helping the modern gentleman look his absolute best.
            </p>
          </motion.section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
