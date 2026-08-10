'use client';

import HeroCarousel from '@/components/sections/HeroCarousel';
import CollectionsGrid from '@/components/sections/CollectionsGrid';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import SectionCollections from '@/components/sections/SectionCollections';
import DesignersShowcase from '@/components/sections/DesignersShowcase';
import CinematicBanner from '@/components/sections/CinematicBanner';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogSection from '@/components/sections/BlogSection';
import InstagramGallery from '@/components/sections/InstagramGallery';
import NewsletterSection from '@/components/sections/NewsletterSection';
import Footer from '@/components/layout/Footer';
import CategorySection from '@/components/sections/CategorySection';
import OccasionSection from '@/components/sections/OccasionSection';
import WeddingCollection from '@/components/sections/WeddingCollection';

export default function Home() {
  return (
    <main className="bg-background text-foreground pt-28 md:pt-20">
      <HeroCarousel />
      <CategorySection />
      <OccasionSection />
      <CollectionsGrid />
      <FeaturedProducts />
      <SectionCollections
        section="premium_mens"
        eyebrow="Premium Men's Collection"
        title="Refined For Him"
        subtitle="Tailored ethnic and designer wear for the modern man"
      />
      <WeddingCollection />
      <SectionCollections
        section="festive"
        eyebrow="Festive Collection"
        title="Celebrate In Style"
        subtitle="Elevate your festive moments with our exclusive collection"
      />
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
