'use client';

import HeroCarousel from '@/components/sections/HeroCarousel';
import CollectionsGrid from '@/components/sections/CollectionsGrid';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import WeddingCollection from '@/components/sections/WeddingCollection';
import FestivalCollection from '@/components/sections/FestivalCollection';
import DesignersShowcase from '@/components/sections/DesignersShowcase';
import CinematicBanner from '@/components/sections/CinematicBanner';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogSection from '@/components/sections/BlogSection';
import InstagramGallery from '@/components/sections/InstagramGallery';
import NewsletterSection from '@/components/sections/NewsletterSection';
import Footer from '@/components/layout/Footer';
import CategorySection from '@/components/sections/CategorySection';
import OccasionSection from '@/components/sections/OccasionSection';

export default function Home() {
  return (
    <main className="bg-background text-foreground pt-28 md:pt-20">
      <HeroCarousel />
      <CategorySection />
      <OccasionSection />
      <CollectionsGrid />
      <FeaturedProducts />
      <WeddingCollection />
      <FestivalCollection />
      {/* <DesignersShowcase /> */}
      <CinematicBanner />
      <TestimonialsSection />
      <BlogSection />
      <InstagramGallery />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
