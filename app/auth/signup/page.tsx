'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Check } from 'lucide-react';

type SignupStep = 'form' | 'otp' | 'complete';

export default function SignupPage() {
  const router = useRouter();
  const { sendOTP, verifyOTP, isLoading } = useAuth();
  const [step, setStep] = useState<SignupStep>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState('');
  const [error, setError] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { otpId: id } = await sendOTP(formData.phone);
      setOtpId(id);
      setStep('otp');
      setOtpTimer(60);

      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await verifyOTP(otpId, otp);
      setStep('complete');
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    }
  };

  const handleResendOTP = async () => {
    try {
      const { otpId: id } = await sendOTP(formData.phone);
      setOtpId(id);
      setOtpTimer(60);
      setOtp('');

      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-playfair font-bold text-foreground hover:text-accent transition-colors">
              HALL OF FASHION
            </h1>
          </Link>
          <p className="text-muted-foreground mt-2 font-light">Premium Men&apos;s Couture</p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl p-8 shadow-premium-lg"
        >
          {step === 'form' && (
            <>
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-6">
                Create Account
              </h2>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-4 p-4 rounded-lg bg-red-500/10 text-red-600 text-sm border border-red-500/30"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSendOTP} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleFormChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(200, 169, 107, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 px-6 py-3 bg-accent text-luxury-black font-semibold rounded-lg hover:bg-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending OTP...' : 'Continue'}
                </motion.button>
              </form>

              {/* Login Link */}
              <p className="text-center mt-6 text-muted-foreground text-sm">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-accent hover:text-gold font-medium transition-colors">
                  Sign In
                </Link>
              </p>
            </>
          )}

          {step === 'otp' && (
            <>
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-2">
                Verify Your Phone
              </h2>
              <p className="text-muted-foreground mb-6">
                We&apos;ve sent a verification code to {formData.phone}
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-4 p-4 rounded-lg bg-red-500/10 text-red-600 text-sm border border-red-500/30"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg bg-background border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full mt-6 px-6 py-3 bg-accent text-luxury-black font-semibold rounded-lg hover:bg-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </motion.button>
              </form>

              <div className="text-center mt-4">
                {otpTimer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend code in <span className="text-accent font-semibold">{otpTimer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    className="text-sm text-accent hover:text-gold font-medium transition-colors"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </>
          )}

          {step === 'complete' && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40"
              >
                <Check size={32} className="text-emerald-500" />
              </motion.div>
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-2">
                Welcome to Hall of Fashion!
              </h2>
              <p className="text-muted-foreground">Your account has been created successfully.</p>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-accent hover:text-gold transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-accent hover:text-gold transition-colors">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
