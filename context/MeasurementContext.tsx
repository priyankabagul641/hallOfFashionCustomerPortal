'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  MeasurementFieldKey,
  MeasurementProfile,
  MeasurementProfileInput,
  MeasurementType,
  MeasurementUnit,
  createBlankMeasurements,
  legacyMeasurementProfiles,
} from '@/data/measurements';

interface MeasurementContextType {
  profiles: MeasurementProfile[];
  defaultProfile: MeasurementProfile | null;
  currentUserId: string;
  getProfile: (profileId: string) => MeasurementProfile | undefined;
  addProfile: (profile: MeasurementProfileInput) => MeasurementProfile;
  updateProfile: (profileId: string, profile: MeasurementProfileInput) => MeasurementProfile;
  deleteProfile: (profileId: string) => void;
  setDefaultProfile: (profileId: string) => void;
  cloneProfileForUnit: (profileId: string, unit: MeasurementUnit) => MeasurementProfile | null;
}

const STORAGE_PREFIX = 'hof_measurement_profiles';

const MeasurementContext = createContext<MeasurementContextType | undefined>(undefined);

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`;
}

function parseStoredProfiles(rawValue: string | null) {
  if (!rawValue) return null;
  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? (parsed as MeasurementProfile[]) : null;
  } catch {
    return null;
  }
}

function getSeedProfiles(userId: string) {
  const seedProfiles = legacyMeasurementProfiles.map((profile, index) => ({
    ...profile,
    userId,
    isDefault: index === 0,
  }));

  if (seedProfiles.length === 0) {
    return [
      {
        id: 'seed-1',
        userId,
        name: 'My Default Profile',
        measurementType: 'shirt' as MeasurementType,
        unit: 'in' as MeasurementUnit,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        measurements: createBlankMeasurements(),
      },
    ];
  }

  return seedProfiles;
}

function normalizeProfiles(profiles: MeasurementProfile[]) {
  return profiles.map((profile, index) => ({
    ...profile,
    isDefault: index === 0 ? true : profile.isDefault,
    measurements: profile.measurements ?? createBlankMeasurements(),
  }));
}

export function MeasurementProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? 'guest';
  const [profiles, setProfiles] = useState<MeasurementProfile[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = parseStoredProfiles(localStorage.getItem(getStorageKey(currentUserId)));
    const nextProfiles = stored && stored.length > 0 ? normalizeProfiles(stored) : getSeedProfiles(currentUserId);
    setProfiles(nextProfiles);
    setHydrated(true);
  }, [currentUserId]);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    localStorage.setItem(getStorageKey(currentUserId), JSON.stringify(profiles));
  }, [currentUserId, profiles, hydrated]);

  const defaultProfile = useMemo(
    () => profiles.find((profile) => profile.isDefault) ?? profiles[0] ?? null,
    [profiles]
  );

  const getProfile = (profileId: string) => profiles.find((profile) => profile.id === profileId);

  const addProfile = (profile: MeasurementProfileInput) => {
    const now = new Date().toISOString();
    const nextProfile: MeasurementProfile = {
      ...profile,
      id: `profile_${Date.now()}`,
      userId: currentUserId,
      createdAt: now,
      updatedAt: now,
      measurements: profile.measurements ?? createBlankMeasurements(),
      isDefault: profiles.length === 0 ? true : profile.isDefault,
    };

    setProfiles((current) => {
      const nextProfiles = profile.isDefault
        ? current.map((item) => ({ ...item, isDefault: false })).concat(nextProfile)
        : [...current, nextProfile];
      if (nextProfile.isDefault) {
        return nextProfiles.map((item) => (item.id === nextProfile.id ? item : { ...item, isDefault: false }));
      }
      return nextProfiles;
    });

    return nextProfile;
  };

  const updateProfile = (profileId: string, profile: MeasurementProfileInput) => {
    const updatedProfile: MeasurementProfile = {
      ...profile,
      id: profileId,
      userId: currentUserId,
      createdAt: getProfile(profileId)?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      measurements: profile.measurements ?? createBlankMeasurements(),
    };

    setProfiles((current) =>
      current.map((item) => (item.id === profileId ? updatedProfile : profile.isDefault ? { ...item, isDefault: false } : item))
    );

    return updatedProfile;
  };

  const deleteProfile = (profileId: string) => {
    setProfiles((current) => {
      const remaining = current.filter((item) => item.id !== profileId);
      if (remaining.length === 0) return remaining;
      if (!remaining.some((item) => item.isDefault)) {
        return remaining.map((item, index) => ({ ...item, isDefault: index === 0 }));
      }
      return remaining;
    });
  };

  const setDefaultProfile = (profileId: string) => {
    setProfiles((current) => current.map((item) => ({ ...item, isDefault: item.id === profileId })));
  };

  const cloneProfileForUnit = (profileId: string, unit: MeasurementUnit) => {
    const profile = getProfile(profileId);
    if (!profile) return null;

    if (profile.unit === unit) {
      return profile;
    }

    const factor = profile.unit === 'in' ? 2.54 : 1 / 2.54;
    return {
      ...profile,
      unit,
      measurements: Object.fromEntries(
        Object.entries(profile.measurements).map(([key, value]) => [key, typeof value === 'number' ? Number((value * factor).toFixed(2)) : value])
      ) as Partial<Record<MeasurementFieldKey, number>>,
    };
  };

  const value: MeasurementContextType = {
    profiles,
    defaultProfile,
    currentUserId,
    getProfile,
    addProfile,
    updateProfile,
    deleteProfile,
    setDefaultProfile,
    cloneProfileForUnit,
  };

  return <MeasurementContext.Provider value={value}>{children}</MeasurementContext.Provider>;
}

export function useMeasurements() {
  const context = useContext(MeasurementContext);
  if (!context) {
    throw new Error('useMeasurements must be used within MeasurementProvider');
  }
  return context;
}