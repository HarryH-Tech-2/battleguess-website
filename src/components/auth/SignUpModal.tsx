import { motion, AnimatePresence } from 'framer-motion';
import { GoogleSignInButton } from './GoogleSignInButton';

interface SignUpModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
}

export function SignUpModal({ isOpen, onDismiss, onSuccess }: SignUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onDismiss}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Copy */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">Save your progress</h2>
              <p className="text-sm text-gray-500 mt-2">
                Track streaks, scores, and compete with friends
              </p>
            </div>

            {/* Google button */}
            <GoogleSignInButton onSuccess={onSuccess} />

            {/* Dismiss */}
            <button
              onClick={onDismiss}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
