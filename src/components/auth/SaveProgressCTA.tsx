import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { analytics } from '../../utils/analytics';

const SignUpModal = lazy(() => import('./SignUpModal').then(m => ({ default: m.SignUpModal })));

interface SaveProgressCTAProps {
  /** Analytics label for where this prompt appeared (e.g. "daily_result"). */
  placement: string;
  title: string;
  message: string;
  ctaLabel?: string;
  /** Heading shown inside the modal so it continues the same pitch. */
  modalHeading?: string;
  modalSubheading?: string;
  className?: string;
}

/**
 * Post-game sign-up prompt. Only rendered for anonymous players, at the
 * moment they have something concrete to keep (a streak, a score). Replaces
 * the old mid-game interrupt modal, which nobody completed.
 */
export function SaveProgressCTA({
  placement,
  title,
  message,
  ctaLabel = 'Create free account',
  modalHeading,
  modalSubheading,
  className = '',
}: SaveProgressCTAProps) {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) analytics.signUpPromptShown(placement);
  }, [isAuthenticated, placement]);

  if (isAuthenticated) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 text-left flex flex-col sm:flex-row sm:items-center gap-3 ${className}`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-amber-900">{title}</p>
          <p className="text-xs text-amber-800/80 mt-0.5">{message}</p>
        </div>
        <button
          onClick={() => {
            analytics.signUpPromptClick(placement);
            setOpen(true);
          }}
          className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          {ctaLabel}
        </button>
      </motion.div>

      {open && (
        <Suspense fallback={null}>
          <SignUpModal
            isOpen={open}
            heading={modalHeading}
            subheading={modalSubheading}
            initialMode="register"
            onDismiss={() => setOpen(false)}
            onSuccess={() => setOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
