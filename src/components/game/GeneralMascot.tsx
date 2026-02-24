import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeneralMascotProps {
  hints: string[];
  revealedHints: number[];
  onRevealHint: (index: number) => void;
  disabled?: boolean;
  side?: 'left' | 'right';
  mascotImage?: string;
  mascotAlt?: string;
}

export function GeneralMascot({
  hints,
  revealedHints,
  onRevealHint,
  disabled,
  side = 'right',
  mascotImage = '/mascot-roman.png',
  mascotAlt = 'Battle Guide mascot',
}: GeneralMascotProps) {
  const [showBubble, setShowBubble] = useState(false);
  const nextHintIndex = revealedHints.length;
  const canRevealMore = nextHintIndex < hints.length;
  const hintsRemaining = hints.length - revealedHints.length;

  useEffect(() => {
    setShowBubble(false);
  }, [side]);

  const handleRevealHint = () => {
    if (canRevealMore && !disabled) {
      onRevealHint(nextHintIndex);
    }
  };

  const handleMascotClick = () => {
    if (!showBubble) {
      if (revealedHints.length === 0 && canRevealMore && !disabled) {
        onRevealHint(0);
      }
      setShowBubble(true);
    } else {
      setShowBubble(false);
    }
  };

  const isLeft = side === 'left';

  return (
    <div
      className={`fixed z-40 bottom-2 xl:bottom-[28%]
        ${isLeft ? 'left-1 sm:left-2 xl:left-[8%] 2xl:left-[10%]' : 'right-1 sm:right-2 xl:right-[8%] 2xl:right-[10%]'}
      `}
    >
      {/* Speech Bubble - absolutely positioned above mascot so it doesn't push it */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`absolute bottom-full mb-2 ${isLeft ? 'left-0' : 'right-0'} bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-amber-200 p-3 sm:p-4 xl:p-5 w-[260px] sm:w-[300px] xl:w-[360px] max-h-[50vh] overflow-y-auto`}
          >
            {/* Close button */}
            <button
              onClick={() => setShowBubble(false)}
              className="absolute top-2 right-2 w-6 h-6 xl:w-7 xl:h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold transition-colors"
            >
              <svg className="w-3 h-3 xl:w-3.5 xl:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-2 mb-2 xl:mb-3">
              <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-4 h-4 xl:w-5 xl:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-sm sm:text-base xl:text-base font-bold text-amber-800">
                Intel Report ({revealedHints.length}/{hints.length})
              </p>
            </div>

            {revealedHints.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {[...revealedHints].sort((a, b) => a - b).map((hintIndex) => (
                  <motion.div
                    key={hintIndex}
                    initial={{ opacity: 0, x: isLeft ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2 bg-amber-50 rounded-lg p-2 xl:p-3 border border-amber-100"
                  >
                    <span className="flex-shrink-0 w-5 h-5 xl:w-6 xl:h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] xl:text-xs font-bold mt-0.5">
                      {hintIndex + 1}
                    </span>
                    <p className="text-xs sm:text-sm xl:text-sm text-amber-900 leading-relaxed">{hints[hintIndex]}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {canRevealMore && !disabled && (
              <motion.button
                onClick={handleRevealHint}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 xl:py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm xl:text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Gather Intel (-25 pts)
              </motion.button>
            )}

            {!canRevealMore && (
              <div className="text-center py-1">
                <p className="text-xs xl:text-sm text-amber-500 font-medium">
                  All intel gathered, sir!
                </p>
              </div>
            )}

            {/* Speech bubble pointer */}
            <div className={`absolute -bottom-2 ${isLeft ? 'left-6' : 'right-6'} w-3 h-3 bg-white/95 border-r-2 border-b-2 border-amber-200 transform rotate-45`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Character - position never changes */}
      <motion.button
        onClick={handleMascotClick}
        className="relative cursor-pointer"
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } }}
        title={`${hintsRemaining} hints remaining – click for intel!`}
      >
        {hintsRemaining > 0 && (
          <motion.span
            className={`absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs xl:text-xl font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 xl:w-12 xl:h-12 flex items-center justify-center z-10 shadow-lg border-2 xl:border-[3px] border-white`}
          >
            {hintsRemaining}
          </motion.span>
        )}

        <img
          src={mascotImage}
          alt={mascotAlt}
          className="w-[80px] h-[96px] sm:w-[100px] sm:h-[120px] xl:w-[440px] xl:h-[528px] 2xl:w-[500px] 2xl:h-[600px] object-contain select-none pointer-events-none"
          draggable={false}
        />
      </motion.button>
    </div>
  );
}
