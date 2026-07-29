'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { Search, Clock, TrendingUp, X } from 'lucide-react';

const trendingSearches = [
  'Sherwani',
  'Kurta Pajama',
  'Bandhgala',
  'Indo Western',
  'Wedding Collection',
];

const recentSearches = [
  'Black Sherwani',
  'Ivory Kurta',
  'Nehru Jacket',
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockProducts = [
    {
      id: '1',
      name: 'Royal Embroidered Sherwani',
      price: '₹24,999',
      image:
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300&q=80',
      designer: 'Deepak Chhabra',
    },
    {
      id: '2',
      name: 'Classic Ivory Kurta Pajama',
      price: '₹8,999',
      image:
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=300&q=80',
      designer: 'House of Ethnics',
    },
    {
      id: '3',
      name: 'Premium Bandhgala Suit',
      price: '₹18,999',
      image:
        'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=300&q=80',
      designer: 'Diwan Saheb',
    },
  ];

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      const filtered = mockProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.designer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  return (
    <main className="bg-background text-foreground">
      <div className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-display font-playfair mb-8">Find Your Style</h1>

            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for sherwani, kurta, bandhgala, designer..."
                className="w-full pl-12 pr-4 py-4 text-lg rounded-xl bg-card border-2 border-border focus:outline-none focus:border-accent transition-all"
              />
            </div>

            {/* Trending Searches */}
            {!query && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Trending Now
                </h3>
                <div className="flex flex-wrap gap-3">
                  {trendingSearches.map((search) => (
                    <motion.button
                      key={search}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSearch(search)}
                      className="px-4 py-2 rounded-full bg-card border border-border hover:border-accent hover:text-accent transition-all"
                    >
                      {search}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Clock size={16} />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-3">
                  {recentSearches.map((search) => (
                    <motion.button
                      key={search}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSearch(search)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-accent transition-all group"
                    >
                      <Clock size={14} className="text-muted-foreground group-hover:text-accent" />
                      {search}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Search Results */}
          {query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-playfair font-semibold mb-6">
                Results for &quot;{query}&quot;
              </h2>

              {isSearching ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full mx-auto"
                  />
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -4 }}
                        className="glass rounded-2xl overflow-hidden hover:shadow-premium-lg transition-all cursor-pointer"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6">
                          <p className="text-sm text-muted-foreground mb-2">{product.designer}</p>
                          <h3 className="font-playfair font-semibold mb-2">{product.name}</h3>
                          <p className="text-lg text-accent font-semibold">{product.price}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground mb-4">No results found for &quot;{query}&quot;</p>
                  <p className="text-sm text-muted-foreground">
                    Try searching for a different outfit, designer, or occasion.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Suggestions */}
          {!query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-2xl font-playfair font-semibold mb-6">Search Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <p>Search by designer name: "Deepak Chhabra"</p>
                <p>Search by occasion: "Wedding" or "Reception"</p>
                <p>Search by outfit: "Sherwani" or "Kurta Pajama"</p>
                <p>Search by style: "Bandhgala" or "Indo Western"</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
