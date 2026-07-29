'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Mail, ArrowLeft, Check } from 'lucide-react';

type Step = 'email' | 'sent';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await forgotPassword(email);
      setStep('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
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
          {step === 'email' && (
            <>
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-2">
                Reset Your Password
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Enter your email address and we&apos;ll send you a link to reset your password.
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 px-6 py-3 bg-accent text-luxury-black font-semibold rounded-lg hover:bg-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </motion.button>
              </form>

              {/* Back to Login */}
              <Link href="/auth/login">
                <motion.button
                  whileHover={{ x: -4 }}
                  type="button"
                  className="w-full mt-3 px-6 py-3 border border-border rounded-lg hover:border-accent hover:bg-background/50 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Back to Sign In
                </motion.button>
              </Link>
            </>
          )}

          {step === 'sent' && (
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
                Email Sent!
              </h2>
              <p className="text-muted-foreground mb-4">
                We&apos;ve sent a password reset link to <br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Check your inbox and follow the link to reset your password. The link will expire in 24 hours.
              </p>

              <Link href="/auth/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full px-6 py-3 bg-accent text-luxury-black font-semibold rounded-lg hover:bg-gold transition-all"
                >
                  Back to Sign In
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-accent hover:text-gold transition-colors font-medium">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
