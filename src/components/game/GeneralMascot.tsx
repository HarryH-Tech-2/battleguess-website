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
    <div
      className="fixed z-40 flex flex-col items-center
        right-2 bottom-16
        sm:right-3 sm:bottom-20
        xl:right-8 xl:top-1/2 xl:-translate-y-1/2 xl:bottom-auto
        2xl:right-16"
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-amber-200 p-3 sm:p-4 max-w-[220px] sm:max-w-[280px] xl:max-w-[300px] mb-2 xl:mb-3 max-h-[50vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={() => setShowBubble(false)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-800">
                Intel Report ({revealedHints.length}/{hints.length})
              </p>
            </div>

            {/* Revealed hints list */}
            {revealedHints.length > 0 && (
              <div className="space-y-2 mb-3">
                {[...revealedHints].sort((a, b) => a - b).map((hintIndex) => (
                  <motion.div
                    key={hintIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2 bg-amber-50 rounded-lg p-2 border border-amber-100"
                  >
                    <span className="flex-shrink-0 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">
                      {hintIndex + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">{hints[hintIndex]}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {revealedHints.length === 0 && (
              <p className="text-xs text-amber-400 italic mb-3 text-center py-2">
                Ready for orders, sir! Click below for intel.
              </p>
            )}

            {/* Reveal button */}
            {canRevealMore && !disabled && (
              <motion.button
                onClick={handleRevealHint}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Gather Intel (-25 pts)
              </motion.button>
            )}

            {!canRevealMore && (
              <div className="text-center py-1">
                <p className="text-xs text-amber-500 font-medium">
                  All intel gathered, sir!
                </p>
              </div>
            )}

            {/* Speech bubble pointer */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 border-r-2 border-b-2 border-amber-200 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Character */}
      <motion.button
        onClick={() => setShowBubble(!showBubble)}
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={showBubble ? {} : { y: [0, -8, 0] }}
        transition={{
          y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        title={`${hintsRemaining} hints remaining – click for intel!`}
      >
        {/* Hint count badge */}
        {hintsRemaining > 0 && (
          <motion.span
            className="absolute top-2 right-0 sm:top-3 sm:right-1 xl:top-6 xl:right-2 2xl:top-8 2xl:right-4 bg-red-500 text-white text-xs sm:text-sm xl:text-xl 2xl:text-2xl font-bold rounded-full w-6 h-6 sm:w-8 sm:h-8 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 flex items-center justify-center z-10 shadow-lg border-2 xl:border-[3px] border-white"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {hintsRemaining}
          </motion.span>
        )}

        {/* Platform shadow */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 sm:w-40 xl:w-72 2xl:w-80 h-4 xl:h-8 bg-black/15 rounded-full blur-lg"
          animate={showBubble ? {} : { scaleX: [1, 0.8, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Mascot image */}
        <img
          src="/mascot.png"
          alt="Battle Guide mascot"
          className="w-[160px] h-[192px] sm:w-[200px] sm:h-[240px] lg:w-[260px] lg:h-[312px] xl:w-[440px] xl:h-[528px] 2xl:w-[520px] 2xl:h-[624px] object-contain select-none pointer-events-none drop-shadow-xl"
          draggable={false}
        />
      </motion.button>
    </div>
  );
}
