import { useState } from 'react';
import { motion } from 'framer-motion';
import { SignUpModal } from './SignUpModal';

interface SignUpCTAProps {
  title: string;
  message: string;
  /** Optional: override the "Sign up" button label. */
  ctaLabel?: string;
}

/**
 * Gated-feature placeholder. Rendered in place of stats/achievements content
 * when the viewer is not authenticated. Clicking the CTA opens the shared
 * sign-up modal.
 */
export function SignUpCTA({ title, message, ctaLabel = 'Sign up' }: SignUpCTAProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center px-6 py-10 sm:py-14 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 max-w-sm">{message}</p>
        </div>
        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-colors"
        >
          {ctaLabel}
        </motion.button>
      </div>

      <SignUpModal
        isOpen={open}
        onDismiss={() => setOpen(false)}
        onSuccess={() => setOpen(false)}
      />
    </>
  );
}
