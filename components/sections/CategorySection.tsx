'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategories, PublicCategory } from '@/lib/api/products';

interface Category {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    count: number;
}

export default function CategorySection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const clipRef = useRef<HTMLDivElement>(null);
    const [clipWidth, setClipWidth] = useState(0);

    // Card spacing is 220px, card is 180px wide (90px half-width). Only cards
    // whose full circle fits inside the measured clip container should render
    // visible — otherwise outer cards get clipped mid-circle (see CATEGORY-CAROUSEL-CLIP bug).
    const maxVisible = clipWidth
        ? Math.max(0, Math.floor((clipWidth / 2 - 90) / 220))
        : 3;

    useEffect(() => {
        const el = clipRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setClipWidth(entry.contentRect.width);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        getCategories()
            .then((res) => {
                const fetched = res.data.categories.map((c: PublicCategory) => ({
                    id: c.id,
                    name: c.name,
                    slug: c.slug,
                    image: c.imageUrl,
                    count: c.productCount,
                }));
                setCategories(fetched);
            })
            .catch(() => setCategories([]));
    }, []);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % categories.length);
    };

    const prevSlide = () => {
        setActiveIndex(
            (prev) => (prev - 1 + categories.length) % categories.length
        );
    };

    // Category filtering on /shop matches by exact category name (see
    // getPublicProducts' `category ILIKE` and FilterSidebar), so link with
    // the real category name — not a hardcoded slug that may not exist in
    // the admin-managed categories table.
    const getCategoryLink = (category: Category) => {
        if (category.slug === 'all') return '/shop';
        return `/shop?category=${encodeURIComponent(category.name)}`;
    };

    if (categories.length === 0) return null;

    return (
        <section className="py-20 pb-8 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-14">
                    <span className="text-accent uppercase tracking-[0.35em] text-xs">
                        Shop By Style
                    </span>

                    <h2 className="text-display font-playfair mt-4 mb-4">
                        Explore Categories
                    </h2>

                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Curated collections crafted for weddings,
                        celebrations and modern gentlemen.
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative">

                    {/* Left Arrow */}
                    <button
                        onClick={prevSlide}
                        className="
              absolute
              left-0
              md:left-4
              top-1/2
              -translate-y-1/2
              z-30
              w-12
              h-12
              rounded-full
              bg-white/10
              backdrop-blur-xl
              border
              border-white/10
              flex
              items-center
              justify-center
              hover:bg-white/20
              transition-all
            "
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={nextSlide}
                        className="
              absolute
              right-0
              md:right-4
              top-1/2
              -translate-y-1/2
              z-30
              w-12
              h-12
              rounded-full
              bg-white/10
              backdrop-blur-xl
              border
              border-white/10
              flex
              items-center
              justify-center
              hover:bg-white/20
              transition-all
            "
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Categories */}
                    <div ref={clipRef} className="relative h-[190px] overflow-hidden">

                        {categories.map((category, index) => {
                            const offset =
                                (index - activeIndex + categories.length) %
                                categories.length;

                            let position = offset;

                            if (position > categories.length / 2) {
                                position -= categories.length;
                            }

                            return (
                                <motion.div
                                    key={category.id}
                                    animate={{
                                        x: position * 220,
                                        opacity: Math.abs(position) > maxVisible ? 0 : 1,
                                        scale: 1,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: 'easeInOut',
                                    }}
                                    className="
                    absolute
                    left-1/2
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    will-change-transform
                  "
                                >
                                    <Link href={getCategoryLink(category)}>
                                        <div
                                            className="
                        group
                        relative
                        w-[180px]
                        h-[180px]
                        rounded-full
                        overflow-hidden
                        border
                        border-white/10
                        shadow-2xl
                        cursor-pointer
                        bg-card
                      "
                                        >
                                            {category.image ? (
                                                <Image
                                                    src={category.image}
                                                    alt={category.name}
                                                    fill
                                                    sizes="180px"
                                                    className="
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-110
                        "
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted" />
                                            )}

                                            <div className="absolute inset-0 bg-black/45" />

                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                                <h3 className="text-white font-playfair font-bold text-lg">
                                                    {category.name}
                                                </h3>

                                                <p className="text-accent text-sm mt-2">
                                                    {category.count}+ Styles
                                                </p>
                                            </div>

                                            {position === 0 && (
                                                <div className="absolute inset-0 rounded-full border-[3px] border-accent" />
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
