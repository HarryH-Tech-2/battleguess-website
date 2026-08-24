import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { analytics } from '../../utils/analytics';

interface SignUpModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
}

type Mode = 'login' | 'register';

export function SignUpModal({ isOpen, onDismiss, onSuccess }: SignUpModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setName('');
    setError('');
    setLoading(false);
    setMode('login');
  };

  const handleDismiss = () => {
    resetForm();
    onDismiss();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login'
      ? { email, password }
      : { email, password, name };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? (mode === 'login' ? 'Invalid email or password' : 'Registration failed'));
      }

      const data = await res.json() as { token: string; user: { id: string; email: string; name: string; avatarUrl: string | null } };
      signIn(data.token, data.user);
      if (mode === 'login') analytics.login('email'); else analytics.signUp('email');
      resetForm();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5"
          >
            {/* Icon */}
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'login' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Track streaks, scores, and compete with friends
              </p>
            </div>

            {/* Google sign-in */}
            <GoogleSignInButton
              width={260}
              onSuccess={() => { resetForm(); onSuccess(); }}
              onError={(message) => setError(message)}
            />

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium uppercase">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Email/password form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              {mode === 'register' && (
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm transition-colors"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm transition-colors"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    // eye-off
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.83M9.88 4.24A10.05 10.05 0 0112 4c4.477 0 8.268 2.943 9.543 7a9.97 9.97 0 01-4.132 5.411M6.1 6.1A10.026 10.026 0 002.457 11c1.274 4.057 5.065 7 9.543 7 1.657 0 3.223-.402 4.6-1.112" />
                    </svg>
                  ) : (
                    // eye
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Toggle mode */}
            <p className="text-sm text-gray-500">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Portal to document.body so the modal escapes Layout's `z-10` wrapper
  // stacking context; otherwise the Feedback FAB (z-40, rendered outside
  // that wrapper) sits above us.
  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}
