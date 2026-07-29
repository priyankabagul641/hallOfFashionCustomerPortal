'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  sendOTP: (phone: string) => Promise<{ otpId: string }>;
  verifyOTP: (otpId: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

// Static mock users for demo (no API required)
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'user_1',
    email: 'demo@halloffashion.com',
    password: 'demo123',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    id: 'user_2',
    email: 'prj200597@gmail.com',
    password: 'admin123',
    name: 'Priyanka',
    phone: '+91 99887 76655',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=100&q=80',
  },
];

const STORAGE_KEY = 'hof_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistUser = (u: User) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800)); // simulate network
      const found = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) throw new Error('Invalid email or password. Try demo@halloffashion.com / demo123');
      const { password: _, ...safeUser } = found;
      persistUser(safeUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, phone: string, _password: string) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        phone,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      };
      persistUser(newUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const sendOTP = useCallback(async (_phone: string) => {
    await new Promise((r) => setTimeout(r, 600));
    return { otpId: 'mock_otp_' + Date.now() };
  }, []);

  const verifyOTP = useCallback(async (_otpId: string, otp: string) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      // Accept any 6-digit OTP for demo
      if (otp.length !== 6) throw new Error('Invalid OTP. Enter any 6 digits for demo.');
      const demoUser: User = {
        id: 'user_otp',
        email: 'otp@halloffashion.com',
        name: 'OTP User',
        phone: 'verified',
      };
      persistUser(demoUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (_email: string) => {
    await new Promise((r) => setTimeout(r, 800));
    // In demo mode, always succeed
  }, []);

  const resetPassword = useCallback(async (_token: string, _newPassword: string) => {
    await new Promise((r) => setTimeout(r, 800));
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    sendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
