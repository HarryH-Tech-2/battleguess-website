import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

interface HintDisplayProps {
  hints: string[];
  revealedHints: number[];
  onRevealHint: (index: number) => void;
  disabled?: boolean;
}

export function HintDisplay({ hints, revealedHints, onRevealHint, disabled }: HintDisplayProps) {
  const nextHintIndex = revealedHints.length;
  const canRevealMore = nextHintIndex < hints.length;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h3 className="font-semibold text-primary-800 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Hints ({revealedHints.length}/{hints.length})
        </h3>
        {canRevealMore && !disabled && (
          <Button
            variant="hint"
            size="sm"
            onClick={() => onRevealHint(nextHintIndex)}
            className="w-full sm:w-auto"
          >
            Reveal Hint (-25 pts)
          </Button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {revealedHints.length === 0 ? (
          <motion.p
            key="no-hints"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-primary-500 text-sm italic"
          >
            No hints revealed yet. Click "Reveal Hint" if you need help!
          </motion.p>
        ) : (
          <div className="space-y-2">
            {revealedHints
              .sort((a, b) => a - b)
              .map((hintIndex, i) => (
                <motion.div
                  key={hintIndex}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-primary-50 border border-primary-200 rounded-lg p-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {hintIndex + 1}
                    </span>
                    <p className="text-primary-800">{hints[hintIndex]}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </AnimatePresence>

      {/* Hint progress bar */}
      <div className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-primary-500"
          initial={{ width: 0 }}
          animate={{ width: `${(revealedHints.length / hints.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
