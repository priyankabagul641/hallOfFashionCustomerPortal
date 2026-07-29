'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-primary via-primary to-secondary">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Header */}
        <p className="text-accent text-sm font-semibold tracking-widest mb-4">
          STAY UPDATED
        </p>
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
          Exclusive Access to New Collections
        </h2>
        <p className="text-white/90 text-lg mb-12">
          Be the first to discover new men&apos;s designer collections, exclusive launches, and luxury fashion events. Subscribe to our newsletter for insider previews.
        </p>

        {/* Newsletter Form */}
        <motion.form
          onSubmit={handleSubscribe}
          className="flex flex-col md:flex-row gap-4 mb-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-white/40 focus:outline-none transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-8 py-4 bg-accent text-primary font-semibold rounded-xl hover:shadow-premium-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubscribed ? (
              <>
                <Check size={20} />
                Subscribed
              </>
            ) : (
              'Subscribe'
            )}
          </motion.button>
        </motion.form>

        {/* Trust Statement */}
        <p className="text-white/70 text-sm">
          Join 50,000+ gentlemen. No spam, curated men&apos;s fashion content only.
        </p>

        {/* Benefits */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20"
          variants={containerVariants}
        >
          {[
            { icon: '🎁', title: 'Exclusive Offers', desc: 'Member-only discounts' },
            { icon: '✨', title: 'Early Access', desc: 'New collections first' },
            { icon: '📧', title: 'Style Tips', desc: 'Expert fashion advice' },
          ].map((benefit, idx) => (
            <motion.div
              key={idx}
              className="text-white"
              whileHover={{ y: -5 }}
            >
              <p className="text-3xl mb-2">{benefit.icon}</p>
              <h4 className="font-semibold mb-1">{benefit.title}</h4>
              <p className="text-white/70 text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
