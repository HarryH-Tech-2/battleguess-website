import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { GameMode } from '../../types';

interface ReverseGuessInputProps {
  mode: GameMode;
  onSubmit: (guess: string) => boolean;
  disabled?: boolean;
  onGiveUp: () => void;
  actualYear?: number;
}

export function ReverseGuessInput({ mode, onSubmit, disabled, onGiveUp, actualYear }: ReverseGuessInputProps) {
  const [guess, setGuess] = useState('');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastYearGuess, setLastYearGuess] = useState<number | null>(null);

  const isYear = mode === 'reverse-year';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || disabled) return;

    if (isYear) {
      setLastYearGuess(parseInt(guess, 10));
    }

    const isCorrect = onSubmit(guess);
    if (!isCorrect) {
      setShake(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => setShake(false), 500);
    }
    setGuess('');
  };

  // Year direction hint
  const getYearHint = () => {
    if (!isYear || !actualYear || lastYearGuess === null || attempts === 0) return null;
    const diff = actualYear - lastYearGuess;
    if (Math.abs(diff) <= 10) return null; // Already close enough or correct
    if (diff > 50) return 'Much later...';
    if (diff > 0) return 'A bit later...';
    if (diff < -50) return 'Much earlier...';
    return 'A bit earlier...';
  };

  const yearHint = getYearHint();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <Input
            type={isYear ? 'number' : 'text'}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={isYear ? 'Enter year (e.g. 1815)...' : 'Enter location...'}
            disabled={disabled}
            error={shake}
            autoComplete="off"
          />
        </motion.div>
        <AnimatePresence>
          {attempts > 0 && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-6 left-0 flex items-center gap-2"
            >
              <span className="text-sm text-red-500">Not quite!</span>
              {yearHint && (
                <span className="text-sm text-primary-500 font-medium">{yearHint}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isYear && (
        <p className="text-xs text-gray-400 text-center">
          Within 10 years counts as correct
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={disabled || !guess.trim()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Submit Guess
        </Button>
        <Button
          type="button"
          variant="danger"
          size="lg"
          onClick={onGiveUp}
          disabled={disabled}
        >
          Give Up
        </Button>
      </div>
    </form>
  );
}
