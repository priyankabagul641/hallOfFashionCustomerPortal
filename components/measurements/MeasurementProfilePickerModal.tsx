'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Edit3, Plus, Ruler, X } from 'lucide-react';
import { MeasurementProfile, MeasurementType, summarizeMeasurementProfile } from '@/data/measurements';
import { useMeasurements } from '@/context/MeasurementContext';
import MeasurementProfileFormModal from '@/components/measurements/MeasurementProfileFormModal';

interface MeasurementProfilePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (profile: MeasurementProfile) => void;
  initialType?: MeasurementType;
}

export default function MeasurementProfilePickerModal({
  open,
  onClose,
  onSelect,
  initialType = 'shirt',
}: MeasurementProfilePickerModalProps) {
  const { profiles, defaultProfile } = useMeasurements();
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<MeasurementProfile | null>(null);

  const visibleProfiles = useMemo(() => profiles, [profiles]);

  const openNewProfileForm = () => {
    setEditingProfile(null);
    setShowForm(true);
  };

  const openEditProfileForm = (profile: MeasurementProfile) => {
    setEditingProfile(profile);
    setShowForm(true);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto w-full max-w-3xl max-h-[85vh] -translate-y-1/2 overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-border bg-card/40 px-6 py-5">
                <div>
                  <h2 className="text-2xl font-bold">Select Custom Size</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose a saved profile or add a new one before adding to cart.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-card transition-colors"
                  aria-label="Close custom size picker"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[calc(85vh-84px)] overflow-y-auto p-6 space-y-4">
                {visibleProfiles.length > 0 ? (
                  visibleProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`rounded-2xl border p-4 transition-all ${profile.isDefault ? 'border-accent bg-accent/5' : 'border-border bg-card/30'
                        }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold">{profile.name}</h3>
                            {profile.isDefault && (
                              <span className="rounded-full bg-accent px-2 py-1 text-xs font-bold text-luxury-black">
                                Default
                              </span>
                            )}
                            <span className="rounded-full border border-border px-2 py-1 text-xs font-semibold text-muted-foreground">
                              {profile.measurementType === 'shirt'
                                ? 'Shirt'
                                : profile.measurementType === 'pant'
                                  ? 'Pant'
                                  : 'Shirt + Pant'}
                            </span>
                            <span className="rounded-full border border-border px-2 py-1 text-xs font-semibold text-muted-foreground">
                              {profile.unit === 'in' ? 'Inches' : 'Centimeters'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{summarizeMeasurementProfile(profile)}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProfileForm(profile)}
                            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-card transition-colors"
                          >
                            <Edit3 size={15} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelect(profile)}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:shadow-premium transition-all"
                          >
                            <Check size={15} />
                            Use This Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center">
                    <Ruler className="mx-auto mb-4 text-muted-foreground" size={40} />
                    <h3 className="text-lg font-semibold">No custom profiles found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create a custom measurement profile to use with this product.
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">Add a new custom size</p>
                    <p className="text-sm text-muted-foreground">
                      Create a shirt, pant, or combined profile and reuse it later from My Measurements.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openNewProfileForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-luxury-black hover:shadow-premium transition-all"
                  >
                    <Plus size={16} />
                    Add Custom Size
                  </button>
                </div>

                {defaultProfile && (
                  <p className="text-xs text-muted-foreground">
                    Default profile: {defaultProfile.name}
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <MeasurementProfileFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        profile={editingProfile}
        initialType={initialType}
        onSaved={(savedProfile) => {
          onSelect(savedProfile);
          setShowForm(false);
        }}
      />
    </>
  );
}
