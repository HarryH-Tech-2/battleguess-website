import { motion } from 'framer-motion';
import type { GameMode } from '../../types';

interface ModeSelectorProps {
  selected: GameMode;
  onSelect: (mode: GameMode) => void;
  disabled?: boolean;
}

const modes: { id: GameMode; label: string; icon: string; description: string; highlight?: boolean }[] = [
  { id: 'daily', label: 'Daily', icon: '📆', description: 'Same 5 battles for everyone today', highlight: true },
  { id: 'classic', label: 'Classic', icon: '🎯', description: 'Guess the battle from the image' },
  { id: 'timed', label: 'Timed', icon: '⏱️', description: 'Race against the clock' },
  { id: 'reverse-year', label: 'Year', icon: '📅', description: 'Name the year it happened' },
  { id: 'reverse-location', label: 'Location', icon: '📍', description: 'Name where it happened' },
  { id: 'timeline', label: 'Timeline', icon: '📜', description: 'Sort battles chronologically' },
  { id: 'campaign', label: 'Campaign', icon: '🗺️', description: 'Follow a narrative through history' },
  { id: 'challenge', label: 'Challenge', icon: '⚔️', description: 'Challenge a friend' },
];

export function ModeSelector({ selected, onSelect, disabled }: ModeSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
        Game Mode
      </h3>
      <div className="flex gap-1.5 justify-center flex-wrap">
        {modes.map((mode) => {
          const isActive = selected === mode.id;
          return (
            <motion.button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              disabled={disabled}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : mode.highlight && !isActive
                    ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-300'
                    : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 border border-gray-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              whileHover={!disabled ? { scale: 1.03 } : undefined}
              whileTap={!disabled ? { scale: 0.97 } : undefined}
              title={mode.description}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mode-indicator"
                  className="absolute inset-0 rounded-xl bg-primary-600 -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
