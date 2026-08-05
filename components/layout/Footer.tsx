'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Collections: [
    { label: 'Sherwanis', href: '/shop?category=sherwani' },
    { label: 'Indo-Western', href: '/shop?category=indo-western' },
    { label: 'Kurtas', href: '/shop?category=kurta' },
    { label: 'Blazers & Suits', href: '/shop?category=blazer' },
  ],
  Designers: [
    { label: 'All Designers', href: '/designers' },
    { label: 'Regal Loom', href: '/designer/1' },
    { label: 'House of Aryav', href: '/designer/2' },
  ],
  Support: [
    { label: 'Customer Service', href: '/support' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '/press' },
    { label: 'Careers', href: '/careers' },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 pb-16 border-b border-primary-foreground/20"
        >
          <div className="max-w-2xl">
            <h3 className="text-3xl font-playfair font-bold mb-4">
              Stay Updated
            </h3>
            <p className="text-primary-foreground/70 mb-6 font-light">
              Subscribe to our newsletter for exclusive previews and special offers
            </p>
            <form className="flex gap-2 sm:gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-primary-foreground text-primary rounded-lg placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:shadow-premium transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </motion.div> */}

        {/* Links Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={itemVariants}>
              <h4 className="text-lg font-playfair font-bold mb-6">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <motion.span
                        whileHover={{ x: 4, color: '#C8A96B' }}
                        className="text-primary-foreground/70 hover:text-accent transition-colors font-light inline-block"
                      >
                        {link.label}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pb-16 border-b border-primary-foreground/20"
        >
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
            <div>
              <h5 className="font-bold mb-2">Address</h5>
              <p className="text-primary-foreground/70 font-light">
                Luxury Fashion District<br />
                New Delhi, India
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
            <div>
              <h5 className="font-bold mb-2">Phone</h5>
              <p className="text-primary-foreground/70 font-light">
                +91 (0) 11 4000 0000
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
            <div>
              <h5 className="font-bold mb-2">Email</h5>
              <p className="text-primary-foreground/70 font-light">
                hello@halloffashion.com
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-primary-foreground/60 text-sm font-light"
        >
          <p>&copy; 2024 HALL OF FASHION. Premium Men&apos;s Couture.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/cookies" className="hover:text-accent transition-colors">
              Cookie Settings
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
