import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeneralMascotProps {
  hints: string[];
  revealedHints: number[];
  onRevealHint: (index: number) => void;
  disabled?: boolean;
}

export function GeneralMascot({ hints, revealedHints, onRevealHint, disabled }: GeneralMascotProps) {
  const [showBubble, setShowBubble] = useState(false);
  const nextHintIndex = revealedHints.length;
  const canRevealMore = nextHintIndex < hints.length;
  const hintsRemaining = hints.length - revealedHints.length;

  const handleRevealHint = () => {
    if (canRevealMore && !disabled) {
      onRevealHint(nextHintIndex);
    }
  };

  return (
    <div className="fixed right-2 sm:right-4 bottom-20 sm:bottom-28 z-40 flex flex-col items-end">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-xl shadow-lg border-2 border-primary-200 p-3 max-w-[220px] sm:max-w-[280px] mb-3 max-h-[50vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={() => setShowBubble(false)}
              className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs transition-colors"
            >
              x
            </button>

            <p className="text-xs font-bold text-primary-700 mb-2">
              Intel ({revealedHints.length}/{hints.length})
            </p>

            {/* Revealed hints list */}
            {revealedHints.length > 0 && (
              <div className="space-y-2 mb-3">
                {[...revealedHints].sort((a, b) => a - b).map((hintIndex) => (
                  <motion.div
                    key={hintIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-1.5"
                  >
                    <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">
                      {hintIndex + 1}
                    </span>
                    <p className="text-xs text-primary-800 leading-relaxed">{hints[hintIndex]}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {revealedHints.length === 0 && (
              <p className="text-xs text-primary-400 italic mb-3">
                Click below to gather intel, soldier!
              </p>
            )}

            {/* Reveal button */}
            {canRevealMore && !disabled && (
              <button
                onClick={handleRevealHint}
                className="w-full py-1.5 px-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                Gather Intel (-25 pts)
              </button>
            )}

            {!canRevealMore && (
              <p className="text-[10px] text-primary-500 italic text-center font-medium">
                All intel gathered!
              </p>
            )}

            {/* Speech bubble pointer */}
            <div className="absolute -bottom-2 right-5 w-3 h-3 bg-white border-r-2 border-b-2 border-primary-200 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Character */}
      <motion.button
        onClick={() => setShowBubble(!showBubble)}
        className="relative group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={showBubble ? {} : { y: [0, -4, 0] }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        title={`${hintsRemaining} hints remaining`}
      >
        {/* Hint count badge */}
        {hintsRemaining > 0 && (
          <motion.span
            className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center z-10 shadow-md"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {hintsRemaining}
          </motion.span>
        )}

        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-full bg-primary-400/0 group-hover:bg-primary-400/20 transition-colors blur-md" />

        {/* The General SVG */}
        <svg width="52" height="66" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body / uniform */}
          <rect x="20" y="62" width="40" height="30" rx="6" fill="#15803d" />
          {/* Uniform stripe */}
          <rect x="36" y="62" width="8" height="30" fill="#166534" />
          {/* Epaulets */}
          <rect x="16" y="62" width="12" height="6" rx="3" fill="#eab308" />
          <rect x="52" y="62" width="12" height="6" rx="3" fill="#eab308" />
          {/* Buttons */}
          <circle cx="40" cy="72" r="2" fill="#eab308" />
          <circle cx="40" cy="80" r="2" fill="#eab308" />
          <circle cx="40" cy="88" r="2" fill="#eab308" />
          {/* Medal */}
          <circle cx="30" cy="76" r="3.5" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
          <rect x="28" y="70" width="4" height="4" rx="1" fill="#dc2626" />
          {/* Neck */}
          <rect x="34" y="56" width="12" height="10" rx="4" fill="#D2A67A" />
          {/* Head */}
          <circle cx="40" cy="42" r="18" fill="#E8C39E" />
          {/* Ears */}
          <ellipse cx="22" cy="42" rx="3" ry="4" fill="#D2A67A" />
          <ellipse cx="58" cy="42" rx="3" ry="4" fill="#D2A67A" />
          {/* Hat brim */}
          <ellipse cx="40" cy="28" rx="24" ry="4" fill="#166534" />
          {/* Hat body */}
          <rect x="22" y="14" width="36" height="16" rx="4" fill="#166534" />
          {/* Hat band */}
          <rect x="22" y="24" width="36" height="4" fill="#14532d" />
          {/* Hat top ridge */}
          <rect x="26" y="12" width="28" height="6" rx="3" fill="#14532d" />
          {/* Gold star on hat */}
          <polygon
            points="40,16 41.8,20.5 46.5,20.5 42.8,23.2 44,27.5 40,25 36,27.5 37.2,23.2 33.5,20.5 38.2,20.5"
            fill="#eab308"
          />
          {/* Eyes */}
          <circle cx="33" cy="40" r="2.5" fill="#1a1a1a" />
          <circle cx="47" cy="40" r="2.5" fill="#1a1a1a" />
          {/* Eye shine */}
          <circle cx="34" cy="39" r="1" fill="white" />
          <circle cx="48" cy="39" r="1" fill="white" />
          {/* Eyebrows */}
          <path d="M28 36 Q33 33 37 36" stroke="#5C3A1E" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M43 36 Q47 33 52 36" stroke="#5C3A1E" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Mustache */}
          <path d="M30 48 Q34 53 40 48 Q46 53 50 48" stroke="#5C3A1E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Smile under mustache */}
          <path d="M36 52 Q40 54 44 52" stroke="#c9a77a" strokeWidth="1" fill="none" strokeLinecap="round" />
          {/* Cheek blush */}
          <ellipse cx="27" cy="46" rx="3" ry="2" fill="#F4A6A0" opacity="0.4" />
          <ellipse cx="53" cy="46" rx="3" ry="2" fill="#F4A6A0" opacity="0.4" />
        </svg>
      </motion.button>
    </div>
  );
}
