import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface GuessInputProps {
  onSubmit: (guess: string) => boolean;
  disabled?: boolean;
  onGiveUp: () => void;
}

export function GuessInput({ onSubmit, disabled, onGiveUp }: GuessInputProps) {
  const [guess, setGuess] = useState('');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || disabled) return;

    const isCorrect = onSubmit(guess);
    if (!isCorrect) {
      setShake(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => setShake(false), 500);
    }
    setGuess('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <Input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter battle name..."
            disabled={disabled}
            error={shake}
            autoComplete="off"
          />
        </motion.div>
        <AnimatePresence>
          {attempts > 0 && !disabled && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-6 left-0 text-sm text-red-500"
            >
              Not quite! Try again or use a hint.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

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
