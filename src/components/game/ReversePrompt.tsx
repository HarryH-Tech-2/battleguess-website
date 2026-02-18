import { motion } from 'framer-motion';
import type { GameMode } from '../../types';

interface ReversePromptProps {
  battleName: string;
  mode: GameMode;
}

export function ReversePrompt({ battleName, mode }: ReversePromptProps) {
  const isYear = mode === 'reverse-year';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-3"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200">
        <span className="text-lg">{isYear ? '📅' : '📍'}</span>
        <span className="text-sm font-medium text-primary-700">
          {isYear ? 'Reverse Mode: Year' : 'Reverse Mode: Location'}
        </span>
      </div>

      <div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{battleName}</h3>
        <p className="text-gray-500 mt-2">
          {isYear
            ? 'What year did this battle take place?'
            : 'Where did this battle take place?'
          }
        </p>
      </div>
    </motion.div>
  );
}
