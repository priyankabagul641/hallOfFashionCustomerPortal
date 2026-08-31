'use client';

import { useEffect, useState } from 'react';
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
    // Categories load async and the clip div doesn't exist until then (see
    // `if (categories.length === 0) return null` below), so a plain useRef +
    // effect-on-mount misses it — the div mounts on a later render, after the
    // once-only effect already ran against a null ref. A callback ref re-fires
    // whenever the node actually attaches, whenever that happens.
    const [clipEl, setClipEl] = useState<HTMLDivElement | null>(null);
    const [clipWidth, setClipWidth] = useState(0);
    // Lags one frame behind clipWidth on purpose: flips true only *after* the
    // fallback→measured jump has already painted, so that jump renders with
    // duration 0 (no pop-in fade) and only later changes (nav, resize) animate.
    // Deferred via rAF (a callback, not the effect body) — satisfies
    // react-hooks/set-state-in-effect and gives the needed one-tick lag for free.
    const [hasMeasured, setHasMeasured] = useState(false);
    useEffect(() => {
        if (clipWidth === 0) return;
        const id = requestAnimationFrame(() => setHasMeasured(true));
        return () => cancelAnimationFrame(id);
    }, [clipWidth]);

    // Card spacing is 220px, card is 180px wide (90px half-width). Only cards
    // whose full circle fits inside the measured clip container should render
    // visible — otherwise outer cards get clipped mid-circle (see CATEGORY-CAROUSEL-CLIP bug).
    // Fallback is 0 (not a guess) so nothing can render clipped before the first measurement.
    const maxVisible = clipWidth
        ? Math.max(0, Math.floor((clipWidth / 2 - 90) / 220))
        : 0;

    useEffect(() => {
        if (!clipEl) return;
        const ro = new ResizeObserver(([entry]) => {
            setClipWidth(entry.contentRect.width);
        });
        ro.observe(clipEl);
        return () => ro.disconnect();
    }, [clipEl]);

    useEffect(() => {
        getCategories()
            .then((res) => {
                // Homepage-only visibility toggle (admin-managed); missing/undefined
                // treated as visible since the backend default is true.
                const fetched = res.data.categories
                    .filter((c: PublicCategory) => c.showOnHomepage !== false)
                    .map((c: PublicCategory) => ({
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
                    <div ref={setClipEl} className="relative h-[190px] overflow-hidden">

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
                                        // Skip the fade on the fallback→measured jump (0 duration)
                                        // so first paint shows the correct card count instantly;
                                        // real interactions (nav, resize) still animate normally.
                                        duration: hasMeasured ? 0.6 : 0,
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
