'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { blogPosts } from '@/data/products';

export default function BlogSection() {
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
            FASHION INSIGHTS
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Luxury Fashion Stories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover styling tips, designer spotlights, and couture trends from our editorial team.
          </p>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          variants={itemVariants}
          className="mb-16"
        >
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-premium-lg mb-8">
            <Image
              src="/blog/wedding-trends.jpg"
              alt={blogPosts[0].title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-12">
              <p className="text-accent text-sm font-semibold mb-4">{blogPosts[0].date}</p>
              <h3 className="font-playfair text-4xl font-bold text-white mb-4">
                {blogPosts[0].title}
              </h3>
              <p className="text-white/90 text-lg mb-6">{blogPosts[0].excerpt}</p>
              <Link href="/blog/wedding-trends">
                <button className="flex items-center gap-2 text-accent hover:text-white transition-colors font-semibold">
                  Read Story <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {blogPosts.slice(1).map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className="group"
            >
              <Link href={`/blog/${post.id}`}>
                <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-premium">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-accent font-semibold uppercase">
                    {post.date}
                  </p>
                  <h3 className="font-playfair text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-xs text-muted-foreground">
                      {post.readTime} read
                    </span>
                    <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center mt-16">
          <Link href="/blog">
            <button className="inline-block px-8 py-4 bg-primary text-background font-semibold rounded-xl hover:shadow-premium-lg transition-all hover:scale-105">
              Read All Stories
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
