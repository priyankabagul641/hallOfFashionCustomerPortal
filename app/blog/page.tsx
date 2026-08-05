'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { getPublicBlogs, PublicBlog } from '@/lib/api/blogs';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ProductLoadError from '@/components/products/ProductLoadError';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState<PublicBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getPublicBlogs()
      .then((res) => { if (!cancelled) { setPosts(res.data.blogs); setError(null); } })
      .catch(() => { if (!cancelled) setError('Failed to load blog posts. Please refresh.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

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
    <main className="bg-background text-foreground">

      {/* Header */}
      <section className="pt-32 pb-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-muted/20 to-background">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="font-playfair text-5xl md:text-7xl font-bold mb-6"
          >
            Fashion Stories & Insights
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-xl max-w-2xl mx-auto"
          >
            Explore luxury fashion trends, designer spotlights, and styling advice from our editorial team.
          </motion.p>
        </motion.div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <ProductGridSkeleton />
          ) : error ? (
            <ProductLoadError message={error} onRetry={handleRetry} />
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-playfair text-xl font-semibold mb-2">No stories yet</p>
              <p className="text-muted-foreground text-sm">Check back soon for new articles</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-premium bg-card">
                      <Image
                        src={post.thumbnailUrl || '/placeholder.jpg'}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        {post.readTime && (
                          <>
                            <span>•</span>
                            <span>{post.readTime} min</span>
                          </>
                        )}
                      </div>
                      <h2 className="font-playfair text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground line-clamp-2">
                        {post.summary}
                      </p>
                      <div className="flex items-center gap-2 text-accent font-semibold pt-4">
                        Read Article <ArrowRight size={18} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
