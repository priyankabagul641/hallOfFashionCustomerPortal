'use client';

import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { getPublicBlogBySlug, PublicBlogDetail } from '@/lib/api/blogs';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import ProductLoadError from '@/components/products/ProductLoadError';
import { ChevronLeft, Calendar, User, Clock } from 'lucide-react';

const FALLBACK_BANNER =
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80';

export default function BlogClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<PublicBlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getPublicBlogBySlug(slug)
      .then((res) => { if (!cancelled) { setPost(res.data); setError(null); } })
      .catch(() => { if (!cancelled) setError('Failed to load this article. Please refresh.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug, reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <ProductGridSkeleton />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-background pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <ProductLoadError message={error ?? 'Article not found.'} onRetry={handleRetry} />
      </main>
    );
  }

  const banner = post.thumbnailUrl || FALLBACK_BANNER;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative h-72 md:h-96 overflow-hidden pt-20">
        <img src={banner} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-8 pb-10 max-w-4xl mx-auto left-0 right-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/blog" className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-3 transition-colors w-fit">
              <ChevronLeft size={15} /> All Stories
            </Link>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <span className="flex items-center gap-1">
                <User size={14} /> {post.authorName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              {post.readTime && (
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {post.readTime} min read
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-8 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div
            className="prose prose-neutral dark:prose-invert max-w-none font-light"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="text-center mt-16 pt-8 border-t border-border">
            <Link href="/blog">
              <button className="px-8 py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all">
                Back to All Stories
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
