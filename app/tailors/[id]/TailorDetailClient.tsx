'use client';

import { use, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import { tailors } from '@/data/tailors';
import {
  Star, MapPin, Clock, Award, CheckCircle, Globe,
  ShoppingBag, MessageCircle, Calendar, ChevronLeft,
  Scissors, Shield, Zap
} from 'lucide-react';

const availabilityColor = {
  'Available': 'bg-emerald-100 text-emerald-700',
  'Busy': 'bg-red-100 text-red-700',
  'Appointment Only': 'bg-amber-100 text-amber-700',
};

export default function TailorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tailor = tailors.find((t) => t.id === id);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'info'>('portfolio');
  const [bookingOpen, setBookingOpen] = useState(false);

  if (!tailor) return notFound();

  const mockReviews = [
    { name: 'Arjun Mehta', rating: 5, date: 'Dec 2024', text: 'Absolutely stunning work. My wedding sherwani was a masterpiece. Every detail was perfect.' },
    { name: 'Vikram Singh', rating: 5, date: 'Nov 2024', text: 'Masterji understood my vision perfectly. The fit was impeccable and delivered ahead of schedule.' },
    { name: 'Rohan Kapoor', rating: 4, date: 'Oct 2024', text: 'Excellent craftsmanship. Highly recommend for anyone looking for quality ethnic wear.' },
  ];

  return (
    <main className="min-h-screen bg-background">

      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link href="/tailors" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-8 transition-colors">
            <ChevronLeft size={16} /> Back to Tailor Marketplace
          </Link>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
          >
            {/* Left - Profile */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl overflow-hidden shadow-premium border border-border sticky top-28">
                <div className="relative h-64">
                  <img src={tailor.image} alt={tailor.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${availabilityColor[tailor.availability]}`}>
                    {tailor.availability}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-accent text-luxury-black text-xs font-bold px-3 py-1 rounded-full">
                      {tailor.badge}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h1 className="font-playfair text-2xl font-bold mb-1">{tailor.name}</h1>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin size={13} /> {tailor.location}
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="fill-accent text-accent" size={16} />
                      <span className="font-bold">{tailor.rating}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">({tailor.reviews} reviews)</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm">{tailor.completedOrders.toLocaleString()} orders</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-muted/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="font-semibold text-sm">{tailor.experience}</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">Delivery</p>
                      <p className="font-semibold text-sm">{tailor.deliveryTime}</p>
                    </div>
                    <div className="col-span-2 bg-accent/10 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">Price Range</p>
                      <p className="font-bold text-accent">{tailor.priceRange}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link href="/customize">
                      <button className="w-full py-3 bg-luxury-black text-luxury-ivory font-semibold rounded-xl hover:bg-accent hover:text-luxury-black transition-all flex items-center justify-center gap-2">
                        <Scissors size={18} /> Book for Custom Order
                      </button>
                    </Link>
                    <button
                      onClick={() => setBookingOpen(true)}
                      className="w-full py-3 border border-border font-semibold rounded-xl hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar size={18} /> Schedule Appointment
                    </button>
                    <Link href="/support">
                      <button className="w-full py-3 border border-border font-semibold rounded-xl hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2">
                        <MessageCircle size={18} /> Send Message
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="font-playfair text-2xl font-bold mb-4">About the Artisan</h2>
                <p className="text-muted-foreground leading-relaxed text-base">{tailor.bio}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                  {[
                    { icon: Globe, label: 'Languages', value: tailor.languages.join(', ') },
                    { icon: Clock, label: 'Delivery', value: tailor.deliveryTime },
                    { icon: ShoppingBag, label: 'Orders Done', value: tailor.completedOrders.toLocaleString() },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-muted/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <Icon size={14} /> {label}
                      </div>
                      <p className="font-semibold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Certifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <h3 className="font-playfair text-lg font-semibold mb-4 flex items-center gap-2">
                    <Scissors size={18} className="text-accent" /> Craft Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tailor.skills.map((skill) => (
                      <span key={skill} className="bg-luxury-black text-luxury-ivory text-xs px-3 py-1.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <h3 className="font-playfair text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award size={18} className="text-accent" /> Certifications
                  </h3>
                  <div className="space-y-2">
                    {tailor.certifications.map((cert) => (
                      <div key={cert} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={14} className="text-accent shrink-0" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Shield, label: 'Quality Guaranteed', desc: 'All work inspected' },
                  { icon: Zap, label: 'On-Time Delivery', desc: '98% on-time rate' },
                  { icon: CheckCircle, label: 'Verified Artisan', desc: 'Background checked' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-center">
                    <Icon className="mx-auto mb-2 text-accent" size={24} />
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="flex border-b border-border">
                  {(['portfolio', 'reviews', 'info'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-accent border-b-2 border-accent'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeTab === 'portfolio' && (
                    <div className="grid grid-cols-2 gap-4">
                      {tailor.portfolio.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="relative rounded-xl overflow-hidden group cursor-pointer"
                        >
                          <img src={item.image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <div>
                              <p className="text-white font-semibold text-sm">{item.title}</p>
                              <p className="text-white/70 text-xs">{item.category}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {mockReviews.map((review, i) => (
                        <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold">{review.name}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, j) => (
                                <Star key={j} size={12} className="fill-accent text-accent" />
                              ))}
                              <span className="text-xs text-muted-foreground ml-1">{review.date}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'info' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Specializations</h4>
                        <div className="flex flex-wrap gap-2">
                          {tailor.specializations.map((s) => (
                            <span key={s} className="bg-muted text-sm px-3 py-1 rounded-full">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Working Process</h4>
                        <ol className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex gap-3"><span className="bg-accent text-luxury-black rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">1</span>Initial consultation & measurement</li>
                          <li className="flex gap-3"><span className="bg-accent text-luxury-black rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">2</span>Fabric selection & design approval</li>
                          <li className="flex gap-3"><span className="bg-accent text-luxury-black rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">3</span>Tailoring & embroidery work</li>
                          <li className="flex gap-3"><span className="bg-accent text-luxury-black rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">4</span>Fitting trial (if local)</li>
                          <li className="flex gap-3"><span className="bg-accent text-luxury-black rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">5</span>Quality check & dispatch</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Appointment Modal */}
      {bookingOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBookingOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-8 max-w-md w-full shadow-premium-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-playfair text-2xl font-bold mb-2">Schedule Appointment</h3>
            <p className="text-muted-foreground text-sm mb-6">Book a consultation with {tailor.name}</p>
            <div className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
              <input type="tel" placeholder="Phone Number" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
              <input type="date" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
              <textarea placeholder="What do you need tailored?" rows={3} className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-none" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setBookingOpen(false)} className="flex-1 py-3 border border-border rounded-xl font-semibold hover:border-accent transition-colors">Cancel</button>
              <button onClick={() => { alert('Appointment request sent!'); setBookingOpen(false); }} className="flex-1 py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all">Confirm</button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </main>
  );
}
