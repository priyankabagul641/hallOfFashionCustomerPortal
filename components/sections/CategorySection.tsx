'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    count: number;
}

const categories: Category[] = [
    {
        id: 1,
        name: 'Sherwanis',
        slug: 'sherwanis',
        image: 'products/sherwani-2-1.jpg',
        count: 145,
    },
    {
        id: 2,
        name: 'Bandhgalas',
        slug: 'bandhgalas',
        image: 'products/Bandhgalas.png',
        count: 82,
    },
    {
        id: 3,
        name: 'Indo Western',
        slug: 'indo-western',
        image: 'products/Indo-western.png',
        count: 96,
    },
    {
        id: 4,
        name: 'Kurtas',
        slug: 'kurtas',
        image: 'products/kurta-2-1.jpg',
        count: 178,
    },
    {
        id: 5,
        name: 'Blazers',
        slug: 'blazers',
        image: 'products/Blazer.png',
        count: 68,
    },
    {
        id: 6,
        name: 'Suits',
        slug: 'suits',
        image: 'products/suits.png',
        count: 59,
    },
    {
        id: 7,
        name: 'Wedding Wear',
        slug: 'wedding-wear',
        image: 'products/wedding wear.png',
        count: 124,
    },
    {
        id: 8,
        name: 'Nehru Jackets',
        slug: 'nehru-jackets',
        image: 'products/nehru-1-1.jpg',
        count: 88,
    },
];

export default function CategorySection() {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % categories.length);
    };

    const prevSlide = () => {
        setActiveIndex(
            (prev) => (prev - 1 + categories.length) % categories.length
        );
    };

    const getCategoryLink = (category: Category) => {
        switch (category.slug) {
            case 'wedding-wear':
                return '/collection/groom';

            case 'indo-western':
                return '/collection/indo-western';

            case 'blazers':
            case 'suits':
                return '/collection/blazers';

            case 'sherwanis':
                return '/collection/sherwanis';

            case 'kurtas':
                return '/collection/kurtas';

            default:
                return `/shop?category=${category.slug}`;
        }
    };

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
                    <div className="relative h-[190px] overflow-hidden">

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
                                        opacity: Math.abs(position) > 3 ? 0 : 1,
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
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                fill
                                                className="
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-110
                        "
                                            />

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

// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// interface Category {
//     id: number;
//     name: string;
//     slug: string;
//     image: string;
//     count: number;
// }

// const categories: Category[] = [
//     {
//         id: 1,
//         name: 'Sherwanis',
//         slug: 'sherwanis',
//         image: '/categories/sherwani.jpg',
//         count: 145,
//     },
//     {
//         id: 2,
//         name: 'Bandhgalas',
//         slug: 'bandhgalas',
//         image: '/categories/bandhgala.jpg',
//         count: 82,
//     },
//     {
//         id: 3,
//         name: 'Indo Western',
//         slug: 'indo-western',
//         image: '/categories/indo-western.jpg',
//         count: 96,
//     },
//     {
//         id: 4,
//         name: 'Kurtas',
//         slug: 'kurtas',
//         image: '/categories/kurta.jpg',
//         count: 178,
//     },
//     {
//         id: 5,
//         name: 'Blazers',
//         slug: 'blazers',
//         image: '/categories/blazer.jpg',
//         count: 68,
//     },
//     {
//         id: 6,
//         name: 'Suits',
//         slug: 'suits',
//         image: '/categories/suit.jpg',
//         count: 59,
//     },
//     {
//         id: 7,
//         name: 'Wedding Wear',
//         slug: 'wedding-wear',
//         image: '/categories/wedding.jpg',
//         count: 124,
//     },
//     {
//         id: 8,
//         name: 'Nehru Jackets',
//         slug: 'nehru-jackets',
//         image: '/categories/nehru.jpg',
//         count: 88,
//     },
// ];

// export default function CategorySection() {
//     const [activeIndex, setActiveIndex] = useState(0);

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setActiveIndex((prev) => (prev + 1) % categories.length);
//         }, 4000);

//         return () => clearInterval(timer);

//     }, []);

//     const nextSlide = () => {
//         setActiveIndex((prev) => (prev + 1) % categories.length);
//     };

//     const prevSlide = () => {
//         setActiveIndex(
//             (prev) => (prev - 1 + categories.length) % categories.length
//         );
//     };

//     const getPosition = (offset: number) => {
//         const positions: Record<number, any> = {
//             0: {
//                 x: 0,
//                 y: 0,
//                 scale: 1,
//                 opacity: 1,
//                 zIndex: 50,
//             },

//             1: {
//                 x: 300,
//                 y: -120,
//                 scale: 0.8,
//                 opacity: 0.95,
//                 zIndex: 40,
//             },

//             2: {
//                 x: 520,
//                 y: 40,
//                 scale: 0.62,
//                 opacity: 0.65,
//                 zIndex: 30,
//             },

//             3: {
//                 x: 350,
//                 y: 240,
//                 scale: 0.5,
//                 opacity: 0.35,
//                 zIndex: 20,
//             },

//             '-1': {
//                 x: -300,
//                 y: -120,
//                 scale: 0.8,
//                 opacity: 0.95,
//                 zIndex: 40,
//             },

//             '-2': {
//                 x: -520,
//                 y: 40,
//                 scale: 0.62,
//                 opacity: 0.65,
//                 zIndex: 30,
//             },

//             '-3': {
//                 x: -350,
//                 y: 240,
//                 scale: 0.5,
//                 opacity: 0.35,
//                 zIndex: 20,
//             },
//         };

//         return (
//             positions[offset] || {
//                 x: 0,
//                 y: 0,
//                 scale: 0,
//                 opacity: 0,
//                 zIndex: 0,
//             }
//         );

//     };

//     return (<section className="py-28 bg-background overflow-hidden"> <div className="max-w-7xl mx-auto px-4">

//         <div className="text-center mb-16">
//             <span className="text-accent uppercase tracking-[0.35em] text-xs">
//                 Shop By Style
//             </span>

//             <h2 className="text-display font-playfair mt-4 mb-4">
//                 Explore Categories
//             </h2>

//             <p className="text-muted-foreground max-w-2xl mx-auto">
//                 Discover curated collections crafted for weddings,
//                 celebrations and modern gentlemen.
//             </p>
//         </div>

//         <div className="relative h-[700px]">

//             {/* Decorative Orbit Rings */}

//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

//                 <div className="absolute w-[700px] h-[700px] rounded-full border border-accent/10" />

//                 <div className="absolute w-[500px] h-[500px] rounded-full border border-accent/10" />

//                 <div className="absolute w-[300px] h-[300px] rounded-full border border-accent/10" />

//             </div>

//             {/* Navigation */}

//             <button
//                 onClick={prevSlide}
//                 className="absolute left-0 top-1/2 -translate-y-1/2 z-[100] w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/20 transition"
//             >
//                 <ChevronLeft size={20} />
//             </button>

//             <button
//                 onClick={nextSlide}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 z-[100] w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/20 transition"
//             >
//                 <ChevronRight size={20} />
//             </button>

//             {categories.map((category, index) => {

//                 let offset =
//                     (index - activeIndex + categories.length) %
//                     categories.length;

//                 if (offset > categories.length / 2) {
//                     offset -= categories.length;
//                 }

//                 const position = getPosition(offset);

//                 const isActive = offset === 0;

//                 return (
//                     <motion.div
//                         key={category.id}
//                         animate={{
//                             x: position.x,
//                             y: position.y,
//                             scale: position.scale,
//                             opacity: position.opacity,
//                         }}
//                         transition={{
//                             duration: 1,
//                             ease: [0.22, 1, 0.36, 1],
//                         }}
//                         style={{
//                             zIndex: position.zIndex,
//                         }}
//                         className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
//                     >
//                         <Link href={`/category/${category.slug}`}>

//                             <motion.div
//                                 whileHover={{
//                                     y: -8,
//                                     scale: isActive ? 1.04 : 1.08,
//                                 }}
//                                 className={`
//                   relative
//                   rounded-full
//                   overflow-hidden
//                   cursor-pointer
//                   border
//                   border-white/10
//                   shadow-[0_20px_80px_rgba(0,0,0,0.35)]
//                   backdrop-blur-xl
//                   ${isActive
//                                         ? 'w-[260px] h-[260px]'
//                                         : 'w-[180px] h-[180px]'
//                                     }
//                 `}
//                             >
//                                 <Image
//                                     src={category.image}
//                                     alt={category.name}
//                                     fill
//                                     className="object-cover"
//                                 />

//                                 <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/75" />

//                                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
//                                     <h3 className="text-white font-playfair text-2xl font-bold">
//                                         {category.name}
//                                     </h3>

//                                     <p className="text-accent text-sm mt-2 tracking-widest uppercase">
//                                         {category.count}+ Styles
//                                     </p>
//                                 </div>

//                                 {isActive && (
//                                     <>
//                                         <div className="absolute inset-0 rounded-full border-[3px] border-accent" />

//                                         <motion.div
//                                             animate={{
//                                                 scale: [1, 1.08, 1],
//                                                 opacity: [0.4, 0.8, 0.4],
//                                             }}
//                                             transition={{
//                                                 repeat: Infinity,
//                                                 duration: 3,
//                                             }}
//                                             className="absolute inset-0 rounded-full border border-accent"
//                                         />
//                                     </>
//                                 )}
//                             </motion.div>

//                         </Link>
//                     </motion.div>
//                 );
//             })}
//         </div>
//     </div>
//     </section>
//     );
// }
