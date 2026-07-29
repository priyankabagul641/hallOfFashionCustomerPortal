'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { tailors } from '@/data/tailors';
import { Star, MapPin, Clock, Award, ChevronRight, Search, Filter, Scissors } from 'lucide-react';

const cities = ['All', 'Delhi', 'Hyderabad', 'Bengaluru', 'Jaipur', 'Mumbai', 'Lucknow'];
const specializations = ['All', 'Sherwanis', 'Kurta Sets', 'Indo-Western', 'Chikankari', 'Bespoke Suits', 'Bandhgala'];

const availabilityColor = {
  'Available': 'bg-emerald-100 text-emerald-700',
  'Busy': 'bg-red-100 text-red-700',
  'Appointment Only': 'bg-amber-100 text-amber-700',
};

export default function TailorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSpec, setSelectedSpec] = useState('All');

  const filtered = tailors.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCity = selectedCity === 'All' || t.city === selectedCity;
    const matchSpec = selectedSpec === 'All' || t.specializations.includes(selectedSpec);
    return matchSearch && matchCity && matchSpec;
  });

  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="pt-28 pb-16 bg-luxury-black text-luxury-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scissors className="text-accent" size={28} />
              <span className="text-accent font-cormorant text-lg tracking-widest uppercase">Master Artisans</span>
            </div>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">
              Tailor <span className="text-accent">Marketplace</span>
            </h1>
            <p className="text-luxury-beige text-lg max-w-2xl mx-auto">
              Connect with India's finest master tailors and artisans. Handpicked for their craftsmanship, heritage expertise, and excellence.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter size={16} />
              <span>City:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedCity === city
                      ? 'bg-accent text-luxury-black border-accent'
                      : 'border-border hover:border-accent hover:text-accent'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center mt-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Scissors size={16} />
              <span>Specialty:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpec(spec)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedSpec === spec
                      ? 'bg-luxury-black text-luxury-ivory border-luxury-black'
                      : 'border-border hover:border-luxury-black hover:text-luxury-black'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground mb-8">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> artisans
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((tailor, idx) => (
              <motion.div
                key={tailor.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/tailors/${tailor.id}`}>
                  <div className="bg-card rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-lg transition-all group border border-border hover:border-accent/30">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={tailor.image}
                        alt={tailor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${availabilityColor[tailor.availability]}`}>
                        {tailor.availability}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-accent text-luxury-black text-xs font-bold px-3 py-1 rounded-full">
                          {tailor.badge}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-playfair text-xl font-semibold group-hover:text-accent transition-colors">
                          {tailor.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <Star className="fill-accent text-accent" size={14} />
                          <span>{tailor.rating}</span>
                          <span className="text-muted-foreground font-normal">({tailor.reviews})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin size={13} />
                        <span>{tailor.location}</span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{tailor.bio}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {tailor.specializations.slice(0, 3).map((s) => (
                          <span key={s} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Price Range</p>
                          <p className="text-sm font-semibold text-accent">{tailor.priceRange}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Experience</p>
                          <p className="text-sm font-semibold">{tailor.experience}</p>
                        </div>
                        <div className="flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-2 transition-all">
                          View Profile <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <Scissors className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-xl font-playfair font-semibold mb-2">No artisans found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
