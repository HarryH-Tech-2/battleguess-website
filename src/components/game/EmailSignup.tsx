import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function EmailSignup() {
  const [dismissed, setDismissed] = useLocalStorage('battleguess-email-signup-dismissed', false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  if (dismissed || status === 'sent') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/mjgppvjg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'newsletter' }),
      });
      if (res.ok) {
        setStatus('sent');
        setDismissed(true);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-gradient-to-r from-primary-50 to-emerald-50 border border-primary-200 rounded-xl px-5 py-4"
      >
        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 pr-5">
          <p className="text-base text-primary-800 font-medium text-center">
            <span className="hidden sm:inline">🎯 Guess 3 new battles every day — get notified when new battles drop!</span>
            <span className="sm:hidden">🎯 Get notified when new battles drop!</span>
          </p>
          <div className="flex w-full gap-2 max-w-sm">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === 'sending'}
              className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white"
            />
            <button
              type="submit"
              disabled={status === 'sending' || !email.trim()}
              className="shrink-0 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              {status === 'sending' ? 'Joining...' : status === 'error' ? 'Retry' : 'Join'}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
