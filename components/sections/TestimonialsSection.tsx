'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonials } from '@/data/content';

export default function TestimonialsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-muted/5 to-background">
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
            CUSTOMER LOVE
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Loved by Fashion Connoisseurs
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real stories from our discerning customers who trust Hall of Fashion for their most special moments.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {testimonials.slice(0, 4).map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="glass rounded-2xl p-8 hover:shadow-premium-lg transition-all"
              whileHover={{ y: -5 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground font-light italic mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="pt-6 border-t border-border">
                <p className="font-semibold text-foreground text-sm mb-1">
                  {testimonial.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {testimonial.occasion}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof Stats */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-border"
        >
          {[
            { label: '50K+', value: 'Satisfied Customers' },
            { label: '4.9★', value: 'Average Rating' },
            { label: '98%', value: 'Repeat Customers' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="text-center"
            >
              <p className="font-playfair text-4xl md:text-5xl font-bold text-accent mb-2">
                {stat.label}
              </p>
              <p className="text-muted-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
