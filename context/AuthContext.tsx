'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { apiGet, apiPost, storeSession, clearSession, ApiError } from '@/lib/api-client';

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
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  sendOTP: (phone: string) => Promise<{ otpId: string }>;
  verifyOTP: (otpId: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface MeResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUser(u: MeResponse): User {
  return { id: u.id, email: u.email, name: u.name, avatar: u.avatar };
}

function errorMessage(err: unknown): string {
  const apiErr = err as ApiError;
  return apiErr?.message ?? 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hydrate session from backend on mount (token lives in sessionStorage via api-client)
  useEffect(() => {
    apiGet<MeResponse>('/auth/me')
      .then((res) => setUser(toUser(res.data)))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiPost<AuthTokens & { user: MeResponse }>('/auth/login', { email, password });
      storeSession(res.data.accessToken, res.data.refreshToken);
      setUser(toUser(res.data.user));
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [firstName, ...rest] = name.trim().split(' ');
      const lastName = rest.join(' ');
      const res = await apiPost<AuthTokens & { user: MeResponse }>('/auth/register', {
        email,
        phone,
        firstName,
        lastName,
        password,
        role: 'customer',
      });
      storeSession(res.data.accessToken, res.data.refreshToken);
      setUser(toUser(res.data.user));
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const sendOTP = useCallback(async (phone: string) => {
    setError(null);
    try {
      await apiPost('/auth/otp/send', { phone });
      return { otpId: phone };
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    }
  }, []);

  const verifyOTP = useCallback(async (otpId: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiPost<AuthTokens & { user: MeResponse }>('/auth/otp/verify', {
        phone: otpId,
        otp,
      });
      storeSession(res.data.accessToken, res.data.refreshToken);
      setUser(toUser(res.data.user));
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await apiPost('/auth/forgot-password', { email });
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setError(null);
    try {
      await apiPost('/auth/reset-password', { token, newPassword, confirmPassword: newPassword });
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
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
