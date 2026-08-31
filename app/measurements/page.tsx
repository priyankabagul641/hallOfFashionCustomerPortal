'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import { measurementGuide, MeasurementProfile } from '@/data/measurements';
import { useMeasurements } from '@/context/MeasurementContext';
import MeasurementProfileFormModal from '@/components/measurements/MeasurementProfileFormModal';
import { Ruler, Plus, Edit3, Trash2, ChevronRight, Video } from 'lucide-react';

type Tab = 'profiles' | 'guide' | 'history';

const videoTutorials = [
  { title: 'How to Measure Chest & Waist', duration: '3:24', thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { title: 'Shoulder & Sleeve Measurements', duration: '2:58', thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
  { title: 'Full Body Measurement Guide', duration: '8:15', thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4c4e?w=400&q=80' },
];

export default function MeasurementsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profiles');
  const { profiles, deleteProfile, setDefaultProfile } = useMeasurements();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<MeasurementProfile | null>(null);

  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="pt-28 pb-12 bg-luxury-black text-luxury-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Ruler className="text-accent" size={24} />
              <span className="text-accent font-cormorant text-lg tracking-widest uppercase">Precision Fit</span>
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-3">
              My <span className="text-accent">Measurements</span>
            </h1>
            <p className="text-luxury-beige/70 text-base max-w-xl">
              Save and manage your body measurements for a perfectly tailored fit every time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-border bg-card sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0">
            {([['profiles', 'My Profiles'], ['guide', 'Size Guide'], ['history', 'Video Tutorials']] as [Tab, string][]).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Profiles Tab */}
          {activeTab === 'profiles' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-playfair text-2xl font-bold">Saved Profiles</h2>
                  <p className="text-muted-foreground text-sm mt-1">Manage your measurement profiles</p>
                </div>
                  <button
                    onClick={() => {
                      setEditingProfile(null);
                      setShowProfileForm(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all text-sm"
                  >
                    <Plus size={16} /> Add Profile
                  </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {profiles.map((profile, idx) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-card rounded-2xl border shadow-sm overflow-hidden ${
                      profile.isDefault ? 'border-accent' : 'border-border'
                    }`}
                  >
                    <div className={`p-5 flex items-center justify-between ${profile.isDefault ? 'bg-accent/10' : 'bg-muted/20'}`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-playfair text-lg font-semibold">{profile.name}</h3>
                          {profile.isDefault && (
                            <span className="bg-accent text-luxury-black text-xs font-bold px-2 py-0.5 rounded-full">Default</span>
                          )}
                          <span className="bg-background/70 text-xs font-semibold px-2 py-0.5 rounded-full border border-border">
                            {profile.measurementType === 'shirt' ? 'Shirt' : profile.measurementType === 'pant' ? 'Pant' : 'Shirt + Pant'}
                          </span>
                          <span className="bg-background/70 text-xs font-semibold px-2 py-0.5 rounded-full border border-border">
                            {profile.unit === 'in' ? 'Inches' : 'Centimeters'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Updated {profile.updatedAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!profile.isDefault && (
                          <button
                            onClick={() => setDefaultProfile(profile.id)}
                            className="text-xs text-muted-foreground hover:text-accent transition-colors"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingProfile(profile);
                            setShowProfileForm(true);
                          }}
                          className="p-2 hover:text-accent transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => deleteProfile(profile.id)}
                          className="p-2 hover:text-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {Object.entries(profile.measurements).slice(0, 8).map(([key, value]) => (
                          <div key={key} className="text-center bg-muted/30 rounded-xl py-3">
                            <p className="text-lg font-bold text-accent">{value}<span className="text-xs">{profile.unit}</span></p>
                            <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          </div>
                        ))}
                      </div>
                      {profile.notes && (
                        <p className="text-xs text-muted-foreground mt-4 bg-muted/20 rounded-xl p-3 italic">
                          &ldquo;{profile.notes}&rdquo;
                        </p>
                      )}
                      <div className="mt-4 pt-4 border-t border-border flex gap-3">
                        <Link href="/customize" className="flex-1">
                          <button className="w-full py-2.5 bg-luxury-black text-luxury-ivory rounded-xl text-sm font-semibold hover:bg-accent hover:text-luxury-black transition-all flex items-center justify-center gap-2">
                            Use for Custom Order <ChevronRight size={14} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {profiles.length === 0 && (
                <div className="text-center py-24">
                  <Ruler className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <p className="font-playfair text-xl font-semibold mb-2">No measurement profiles yet</p>
                  <p className="text-muted-foreground text-sm mb-6">Add your measurements for a perfect custom fit</p>
                  <button
                    onClick={() => {
                      setEditingProfile(null);
                      setShowProfileForm(true);
                    }}
                    className="px-8 py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all"
                  >
                    Add Your First Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Size Guide Tab */}
          {activeTab === 'guide' && (
            <div>
              <h2 className="font-playfair text-2xl font-bold mb-8">How to Measure Yourself</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {measurementGuide.map((guide, idx) => (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card rounded-2xl p-6 border border-border shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{guide.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{guide.label} <span className="text-muted-foreground text-sm font-normal">({guide.unit})</span></h3>
                        <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-sm">
                          <span className="font-semibold text-accent">Tip: </span>
                          {guide.tip}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Size Chart */}
              <div className="mt-12">
                <h2 className="font-playfair text-2xl font-bold mb-6">Standard Size Chart</h2>
                <div className="bg-card rounded-2xl border border-border overflow-x-auto shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-luxury-black text-luxury-ivory">
                        {['Size', 'Chest (in)', 'Waist (in)', 'Hips (in)', 'Shoulder (in)', 'Height (cm)'].map((h) => (
                          <th key={h} className="px-5 py-4 text-left font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['XS', '34–36', '28–30', '34–36', '15.5–16', '160–165'],
                        ['S', '36–38', '30–32', '36–38', '16–16.5', '165–170'],
                        ['M', '38–40', '32–34', '38–40', '16.5–17', '170–175'],
                        ['L', '40–42', '34–36', '40–42', '17–17.5', '175–180'],
                        ['XL', '42–44', '36–38', '42–44', '17.5–18', '178–182'],
                        ['XXL', '44–46', '38–40', '44–46', '18–18.5', '180–185'],
                      ].map(([size, ...vals], i) => (
                        <tr key={size} className={i % 2 === 0 ? 'bg-muted/20' : 'bg-card'}>
                          <td className="px-5 py-4 font-bold text-accent">{size}</td>
                          {vals.map((v, j) => <td key={j} className="px-5 py-4">{v}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Video Tutorials Tab */}
          {activeTab === 'history' && (
            <div>
              <h2 className="font-playfair text-2xl font-bold mb-8">Video Measurement Guides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoTutorials.map((video, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm group cursor-pointer"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                          <Video className="text-luxury-black ml-1" size={24} />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-sm">{video.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">Hall of Fashion Tutorial</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <MeasurementProfileFormModal
        open={showProfileForm}
        onClose={() => setShowProfileForm(false)}
        profile={editingProfile}
      />

      <Footer />
    </main>
  );
}
