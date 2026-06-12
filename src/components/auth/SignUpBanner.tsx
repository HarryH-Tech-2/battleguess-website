import { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

// Lazy-loaded — the auth modal (and its internal GoogleSignInButton + jose
// dependency chain) is only needed once the user clicks "Sign up", not on
// every page load.
const SignUpModal = lazy(() => import('./SignUpModal').then(m => ({ default: m.SignUpModal })));

/**
 * Always-visible banner for unauthenticated users explaining that progress
 * isn't being saved. Dismissal is persisted so users who have decided don't
 * keep seeing it, but it reappears automatically if they sign out.
 */
export function SignUpBanner() {
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (isAuthenticated) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="relative flex items-center gap-3 bg-gradient-to-r from-primary-50 via-emerald-50 to-primary-50 border border-primary-200 rounded-xl px-4 py-3 shadow-sm"
        >
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-lg font-semibold text-primary-900 leading-tight">
              Sign up to save your progress
            </p>
            <p className="text-sm sm:text-base text-primary-700/80 leading-tight mt-0.5">
              Your scores, streaks, and achievements only stick with an account.
            </p>
          </div>
          <motion.button
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0 inline-flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white text-base sm:text-lg font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors"
          >
            Sign up
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {modalOpen && (
        <Suspense fallback={null}>
          <SignUpModal
            isOpen={modalOpen}
            onDismiss={() => setModalOpen(false)}
            onSuccess={() => setModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
