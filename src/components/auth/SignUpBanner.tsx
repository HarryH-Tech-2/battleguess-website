import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SignUpModal } from './SignUpModal';

/**
 * Always-visible banner for unauthenticated users explaining that progress
 * isn't being saved. Dismissal is persisted so users who have decided don't
 * keep seeing it, but it reappears automatically if they sign out.
 */
export function SignUpBanner() {
  const { isAuthenticated } = useAuth();
  const [dismissed, setDismissed] = useLocalStorage<boolean>(
    'battleguess-signup-banner-dismissed',
    false,
  );
  const [modalOpen, setModalOpen] = useState(false);

  if (isAuthenticated || dismissed) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="relative flex items-center gap-3 bg-gradient-to-r from-primary-50 via-emerald-50 to-primary-50 border border-primary-200 rounded-xl px-4 py-3 shadow-sm"
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary-900 leading-tight">
              Sign up to save your progress
            </p>
            <p className="text-xs text-primary-700/80 leading-tight mt-0.5">
              Your scores, streaks, and achievements only stick with an account.
            </p>
          </div>
          <motion.button
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0 inline-flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            Sign up
          </motion.button>
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-primary-400 hover:text-primary-700 transition-colors p-1 -mr-1"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      </AnimatePresence>

      <SignUpModal
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
      />
    </>
  );
}
