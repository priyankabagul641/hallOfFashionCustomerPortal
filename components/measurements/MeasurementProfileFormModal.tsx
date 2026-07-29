'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import {
  MeasurementFieldKey,
  MeasurementProfile,
  MeasurementProfileInput,
  MeasurementType,
  MeasurementUnit,
  convertMeasurementValue,
  getMeasurementFields,
  measurementFieldConfigs,
  validateMeasurementProfile,
} from '@/data/measurements';
import { useMeasurements } from '@/context/MeasurementContext';

interface MeasurementProfileFormModalProps {
  open: boolean;
  onClose: () => void;
  profile?: MeasurementProfile | null;
  initialType?: MeasurementType;
  onSaved?: (profile: MeasurementProfile) => void;
}

const measurementTypes: { id: MeasurementType; label: string; description: string }[] = [
  { id: 'shirt', label: 'Shirt Only', description: 'Neck, chest, sleeves and shirt fit' },
  { id: 'pant', label: 'Pant Only', description: 'Waist, hip, rise and trouser fit' },
  { id: 'combined', label: 'Shirt + Pant', description: 'Full tailoring profile for coordinated sets' },
];

export default function MeasurementProfileFormModal({
  open,
  onClose,
  profile,
  initialType = 'shirt',
  onSaved,
}: MeasurementProfileFormModalProps) {
  const { addProfile, updateProfile, profiles } = useMeasurements();
  const isEditing = !!profile;

  const [name, setName] = useState('');
  const [measurementType, setMeasurementType] = useState<MeasurementType>(initialType);
  const [unit, setUnit] = useState<MeasurementUnit>('in');
  const [measurements, setMeasurements] = useState<Partial<Record<MeasurementFieldKey, string>>>({});
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    if (!open) return;

    const source = profile ?? null;
    setName(source?.name ?? '');
    setMeasurementType(source?.measurementType ?? initialType);
    setUnit(source?.unit ?? 'in');
    setNotes(source?.notes ?? '');
    setIsDefault(source?.isDefault ?? profiles.length === 0);

    const nextMeasurements: Partial<Record<MeasurementFieldKey, string>> = {};
    if (source) {
      Object.entries(source.measurements).forEach(([key, value]) => {
        if (typeof value === 'number') {
          nextMeasurements[key as MeasurementFieldKey] = value.toFixed(2).replace(/\.00$/, '');
        }
      });
    }
    setMeasurements(nextMeasurements);
    setErrors({});
  }, [open, profile, initialType, profiles.length]);

  const visibleFields = useMemo(() => getMeasurementFields(measurementType), [measurementType]);

  const handleUnitToggle = (nextUnit: MeasurementUnit) => {
    if (nextUnit === unit) return;

    const converted: Partial<Record<MeasurementFieldKey, string>> = { ...measurements };
    Object.entries(measurements).forEach(([key, value]) => {
      const numericValue = Number(value);
      if (!Number.isNaN(numericValue) && value !== '') {
        const convertedValue = convertMeasurementValue(numericValue, unit, nextUnit);
        converted[key as MeasurementFieldKey] = Number(convertedValue.toFixed(2)).toString();
      }
    });
    setUnit(nextUnit);
    setMeasurements(converted);
  };

  const handleSave = () => {
    const payload = {
      name: name.trim(),
      measurementType,
      unit,
      isDefault,
      notes: notes.trim() || undefined,
      measurements: Object.fromEntries(
        Object.entries(measurements).map(([key, value]) => [key, value === '' ? undefined : Number(value)])
      ) as Partial<Record<MeasurementFieldKey, number>>,
    } satisfies MeasurementProfileInput;

    const validationErrors = validateMeasurementProfile({
      profiles,
      profile: payload,
      editingId: profile?.id,
    });

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const savedProfile = isEditing
      ? updateProfile(profile!.id, payload)
      : addProfile(payload);

    onSaved?.(savedProfile);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto w-full max-w-4xl max-h-[88vh] overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 bg-card/40">
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditing ? 'Edit Measurement Profile' : 'Add Custom Size'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Save shirt, pant, or combined measurements for future orders.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-card transition-colors"
                aria-label="Close measurement form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(88vh-84px)] overflow-y-auto p-6 space-y-6">
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4 rounded-2xl border border-border p-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">Profile Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Wedding Shirt Fit"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold">Measurement Type</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {measurementTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setMeasurementType(type.id)}
                          className={`rounded-xl border p-3 text-left transition-all ${measurementType === type.id
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                            }`}
                        >
                          <p className="font-semibold">{type.label}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{type.description}</p>
                        </button>
                      ))}
                    </div>
                    {errors.measurementType && <p className="mt-2 text-xs text-red-500">{errors.measurementType}</p>}
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-border p-4">
                  <div>
                    <p className="mb-2 text-sm font-semibold">Unit</p>
                    <div className="inline-flex rounded-full border border-border p-1">
                      {(['in', 'cm'] as MeasurementUnit[]).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleUnitToggle(value)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${unit === value ? 'bg-accent text-luxury-black' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          {value === 'in' ? 'Inches' : 'Centimeters'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                    <span className="text-sm font-semibold">Set as default profile</span>
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="h-5 w-5 accent-accent"
                    />
                  </label>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      placeholder="Optional fit notes for the tailor"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">Measurements</h3>
                    <p className="text-sm text-muted-foreground">Required fields update automatically based on the selected measurement type.</p>
                  </div>
                  <div className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {visibleFields.length} fields
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleFields.map((field) => {
                    const config = measurementFieldConfigs[field];
                    return (
                      <div key={field} className="space-y-1">
                        <label className="block text-sm font-semibold">
                          {config.label} <span className="text-muted-foreground font-normal">({unit})</span>
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          min={unit === 'cm' ? convertMeasurementValue(config.minIn, 'in', 'cm') : config.minIn}
                          max={unit === 'cm' ? convertMeasurementValue(config.maxIn, 'in', 'cm') : config.maxIn}
                          step={unit === 'cm' ? 1 : config.step ?? 0.5}
                          value={measurements[field] ?? ''}
                          onChange={(e) => {
                            const nextValue = e.target.value;
                            if (nextValue === '') {
                              setMeasurements((current) => ({ ...current, [field]: '' }));
                              return;
                            }
                            if (!/^\d*(\.\d*)?$/.test(nextValue)) return;
                            setMeasurements((current) => ({ ...current, [field]: nextValue }));
                          }}
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <p className="text-xs text-muted-foreground">{config.helper}</p>
                        {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:bg-card transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:shadow-premium transition-all"
                >
                  <Check size={16} />
                  {isEditing ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}