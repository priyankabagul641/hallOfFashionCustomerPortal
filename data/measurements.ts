export type MeasurementUnit = 'in' | 'cm';
export type MeasurementType = 'shirt' | 'pant' | 'combined';

export type MeasurementFieldKey =
  | 'neck'
  | 'shoulder'
  | 'chest'
  | 'waist'
  | 'hip'
  | 'shirtLength'
  | 'sleeveLength'
  | 'armhole'
  | 'bicep'
  | 'wrist'
  | 'frontLength'
  | 'backLength'
  | 'cuff'
  | 'thigh'
  | 'knee'
  | 'bottomOpening'
  | 'inseam'
  | 'outseam'
  | 'rise'
  | 'pantLength'
  | 'calf';

export interface MeasurementProfile {
  id: string;
  userId: string;
  name: string;
  measurementType: MeasurementType;
  unit: MeasurementUnit;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  measurements: Partial<Record<MeasurementFieldKey, number>>;
  notes?: string;
}

export type MeasurementProfileInput = Omit<MeasurementProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface MeasurementFieldConfig {
  key: MeasurementFieldKey;
  label: string;
  helper: string;
  requiredFor: MeasurementType[];
  minIn: number;
  maxIn: number;
  step?: number;
}

export const measurementFieldGroups = {
  shirt: ['neck', 'shoulder', 'chest', 'waist', 'hip', 'shirtLength', 'sleeveLength', 'armhole', 'bicep', 'wrist', 'frontLength', 'backLength', 'cuff'] as MeasurementFieldKey[],
  pant: ['waist', 'hip', 'thigh', 'knee', 'bottomOpening', 'inseam', 'outseam', 'rise', 'pantLength', 'calf'] as MeasurementFieldKey[],
} as const;

export const measurementFieldConfigs: Record<MeasurementFieldKey, MeasurementFieldConfig> = {
  neck: { key: 'neck', label: 'Neck', helper: 'Measure around the base of the neck.', requiredFor: ['shirt', 'combined'], minIn: 12, maxIn: 22, step: 0.5 },
  shoulder: { key: 'shoulder', label: 'Shoulder', helper: 'Measure shoulder tip to shoulder tip across the back.', requiredFor: ['shirt', 'combined'], minIn: 14, maxIn: 22, step: 0.5 },
  chest: { key: 'chest', label: 'Chest', helper: 'Measure around the fullest part of the chest.', requiredFor: ['shirt', 'combined'], minIn: 28, maxIn: 60, step: 0.5 },
  waist: { key: 'waist', label: 'Waist', helper: 'Measure at the natural waistline.', requiredFor: ['shirt', 'pant', 'combined'], minIn: 24, maxIn: 60, step: 0.5 },
  hip: { key: 'hip', label: 'Hip', helper: 'Measure around the widest part of the hips.', requiredFor: ['shirt', 'pant', 'combined'], minIn: 30, maxIn: 64, step: 0.5 },
  shirtLength: { key: 'shirtLength', label: 'Shirt Length', helper: 'Measure from shoulder to desired shirt hem.', requiredFor: ['shirt', 'combined'], minIn: 24, maxIn: 42, step: 0.5 },
  sleeveLength: { key: 'sleeveLength', label: 'Sleeve Length', helper: 'Measure from shoulder point to wrist.', requiredFor: ['shirt', 'combined'], minIn: 20, maxIn: 32, step: 0.5 },
  armhole: { key: 'armhole', label: 'Armhole', helper: 'Measure the arm opening around the shoulder and underarm.', requiredFor: ['shirt', 'combined'], minIn: 8, maxIn: 20, step: 0.5 },
  bicep: { key: 'bicep', label: 'Bicep', helper: 'Measure around the fullest part of the upper arm.', requiredFor: ['shirt', 'combined'], minIn: 10, maxIn: 24, step: 0.5 },
  wrist: { key: 'wrist', label: 'Wrist / Cuff', helper: 'Measure around the wrist or cuff opening.', requiredFor: ['shirt', 'combined'], minIn: 5, maxIn: 14, step: 0.25 },
  frontLength: { key: 'frontLength', label: 'Front Length', helper: 'Measure from shoulder to desired front hem.', requiredFor: ['shirt', 'combined'], minIn: 22, maxIn: 42, step: 0.5 },
  backLength: { key: 'backLength', label: 'Back Length', helper: 'Measure from shoulder to back hem.', requiredFor: ['shirt', 'combined'], minIn: 22, maxIn: 44, step: 0.5 },
  cuff: { key: 'cuff', label: 'Cuff Opening', helper: 'Measure the sleeve cuff opening.', requiredFor: ['shirt', 'combined'], minIn: 6, maxIn: 16, step: 0.25 },
  thigh: { key: 'thigh', label: 'Thigh', helper: 'Measure around the fullest part of the thigh.', requiredFor: ['pant', 'combined'], minIn: 16, maxIn: 36, step: 0.5 },
  knee: { key: 'knee', label: 'Knee', helper: 'Measure around the knee area.', requiredFor: ['pant', 'combined'], minIn: 12, maxIn: 28, step: 0.5 },
  bottomOpening: { key: 'bottomOpening', label: 'Bottom Opening', helper: 'Measure the trouser hem opening.', requiredFor: ['pant', 'combined'], minIn: 10, maxIn: 20, step: 0.25 },
  inseam: { key: 'inseam', label: 'Inseam', helper: 'Measure from crotch to hem on the inside leg.', requiredFor: ['pant', 'combined'], minIn: 24, maxIn: 40, step: 0.5 },
  outseam: { key: 'outseam', label: 'Outseam', helper: 'Measure from waist to hem along the outside leg.', requiredFor: ['pant', 'combined'], minIn: 34, maxIn: 50, step: 0.5 },
  rise: { key: 'rise', label: 'Rise', helper: 'Measure from front waistband to crotch.', requiredFor: ['pant', 'combined'], minIn: 8, maxIn: 16, step: 0.25 },
  pantLength: { key: 'pantLength', label: 'Pant Length', helper: 'Measure from waist to desired trouser hem.', requiredFor: ['pant', 'combined'], minIn: 34, maxIn: 52, step: 0.5 },
  calf: { key: 'calf', label: 'Calf', helper: 'Measure around the fullest part of the calf.', requiredFor: ['pant', 'combined'], minIn: 12, maxIn: 24, step: 0.5 },
};

export const measurementGuide = [
  {
    id: 'chest',
    label: 'Chest',
    description: 'Measure around the fullest part of your chest, keeping the tape parallel to the ground.',
    tip: 'Keep one finger under the tape for a comfortable fit.',
    unit: 'inches',
    icon: '👕',
  },
  {
    id: 'waist',
    label: 'Waist',
    description: 'Measure around your natural waistline, above the hips.',
    tip: 'Breathe normally when taking this measurement.',
    unit: 'inches',
    icon: '📏',
  },
  {
    id: 'hips',
    label: 'Hips',
    description: 'Measure around the widest part of your hips.',
    tip: 'Stand with feet together for accurate measurement.',
    unit: 'inches',
    icon: '📐',
  },
  {
    id: 'shoulder',
    label: 'Shoulder Width',
    description: 'Measure from the tip of one shoulder to the other across your upper back.',
    tip: 'Ask someone to help with this measurement.',
    unit: 'inches',
    icon: '↔️',
  },
  {
    id: 'sleeveLength',
    label: 'Sleeve Length',
    description: 'Measure from the center back of your neck, over your shoulder, to your wrist.',
    tip: 'Keep your arm slightly bent when measuring.',
    unit: 'inches',
    icon: '💪',
  },
  {
    id: 'kurtaLength',
    label: 'Outfit Length',
    description: 'Measure from the top of your shoulder to your desired hem length.',
    tip: 'Decide how long you want the outfit before measuring.',
    unit: 'inches',
    icon: '📏',
  },
  {
    id: 'neck',
    label: 'Neck',
    description: 'Measure around the base of your neck.',
    tip: 'Add 0.5 inch for comfortable collar fit.',
    unit: 'inches',
    icon: '🔘',
  },
  {
    id: 'height',
    label: 'Height',
    description: 'Stand straight against a wall and measure from the floor to the top of your head.',
    tip: 'Remove shoes for accurate height.',
    unit: 'cm',
    icon: '📏',
  },
];

export const legacyMeasurementProfiles: MeasurementProfile[] = [
  {
    id: 'M001',
    userId: 'user_1',
    name: 'My Default Profile',
    measurementType: 'shirt',
    unit: 'in',
    isDefault: true,
    createdAt: '2024-09-15',
    updatedAt: '2024-12-01',
    measurements: {
      chest: 40,
      waist: 34,
      hip: 38,
      shoulder: 17,
      sleeveLength: 25,
      shirtLength: 44,
      neck: 15.5,
      bicep: 14,
      wrist: 7,
      inseam: 30,
      thigh: 23,
    },
    notes: 'Slightly broad shoulders. Prefer relaxed fit at waist.',
  },
  {
    id: 'M002',
    userId: 'user_1',
    name: 'Wedding Measurements (2024)',
    measurementType: 'shirt',
    unit: 'in',
    isDefault: false,
    createdAt: '2024-10-20',
    updatedAt: '2024-10-20',
    measurements: {
      chest: 41,
      waist: 35,
      hip: 39,
      shoulder: 17.5,
      sleeveLength: 25.5,
      shirtLength: 45,
      neck: 16,
      bicep: 14.5,
      wrist: 7.2,
      inseam: 30,
      thigh: 23.5,
    },
    notes: 'Measurements taken after gym. Fuller physique.',
  },
];

export const measurementProfiles = legacyMeasurementProfiles;

export const measurementProfileDefaults = {
  shirt: ['neck', 'shoulder', 'chest', 'waist', 'hip', 'shirtLength', 'sleeveLength', 'armhole', 'bicep', 'wrist', 'frontLength', 'backLength', 'cuff'] as MeasurementFieldKey[],
  pant: ['waist', 'hip', 'thigh', 'knee', 'bottomOpening', 'inseam', 'outseam', 'rise', 'pantLength', 'calf'] as MeasurementFieldKey[],
};

export function convertMeasurementValue(value: number, fromUnit: MeasurementUnit, toUnit: MeasurementUnit) {
  if (fromUnit === toUnit) return value;
  return fromUnit === 'in' ? value * 2.54 : value / 2.54;
}

export function formatMeasurementValue(value: number | undefined, unit: MeasurementUnit) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return `${value.toFixed(unit === 'cm' ? 1 : 1)} ${unit === 'in' ? 'in' : 'cm'}`;
}

export function getMeasurementFields(measurementType: MeasurementType) {
  if (measurementType === 'shirt') return measurementProfileDefaults.shirt;
  if (measurementType === 'pant') return measurementProfileDefaults.pant;
  return Array.from(new Set([...measurementProfileDefaults.shirt, ...measurementProfileDefaults.pant]));
}

export function summarizeMeasurementProfile(profile: MeasurementProfile) {
  const fields = getMeasurementFields(profile.measurementType);
  const summary = fields
    .map((field) => {
      const value = profile.measurements[field];
      if (typeof value !== 'number') return null;
      return `${measurementFieldConfigs[field].label}: ${value.toFixed(1)}${profile.unit}`;
    })
    .filter(Boolean)
    .slice(0, 3)
    .join(' • ');

  return summary || 'No measurements saved';
}

export function validateMeasurementProfile(params: {
  profiles: MeasurementProfile[];
  profile: MeasurementProfileInput;
  editingId?: string | null;
}) {
  const { profiles, profile, editingId } = params;
  const errors: Partial<Record<'name' | 'measurementType' | 'measurements' | MeasurementFieldKey, string>> = {};

  if (!profile.name.trim()) {
    errors.name = 'Profile name is required';
  } else {
    const duplicate = profiles.find(
      (item) => item.id !== editingId && item.name.trim().toLowerCase() === profile.name.trim().toLowerCase()
    );
    if (duplicate) {
      errors.name = 'Profile name already exists';
    }
  }

  const requiredFields = getMeasurementFields(profile.measurementType);
  requiredFields.forEach((field) => {
    const value = profile.measurements[field];
    const fieldConfig = measurementFieldConfigs[field];
    if (typeof value !== 'number' || Number.isNaN(value)) {
      errors[field] = `${fieldConfig.label} is required`;
      return;
    }
    const min = profile.unit === 'cm' ? convertMeasurementValue(fieldConfig.minIn, 'in', 'cm') : fieldConfig.minIn;
    const max = profile.unit === 'cm' ? convertMeasurementValue(fieldConfig.maxIn, 'in', 'cm') : fieldConfig.maxIn;
    if (value < min || value > max) {
      errors[field] = `${fieldConfig.label} should be between ${min.toFixed(0)} and ${max.toFixed(0)} ${profile.unit}`;
    }
  });

  return errors;
}

export function createBlankMeasurements() {
  return {} as Partial<Record<MeasurementFieldKey, number>>;
}
