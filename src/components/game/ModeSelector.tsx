import { motion, AnimatePresence } from 'framer-motion';
import type { GameMode } from '../../types';

interface ModeSelectorProps {
  selected: GameMode;
  onSelect: (mode: GameMode) => void;
  disabled?: boolean;
}

const modes: { id: GameMode; label: string; icon: string; shortDesc: string; longDesc: string; highlight?: boolean }[] = [
  { id: 'daily', label: 'Daily', icon: '📆', shortDesc: 'Same 5 battles for everyone today', longDesc: 'Everyone gets the same 5 battles each day. Compare your score on the daily leaderboard!', highlight: true },
  { id: 'classic', label: 'Classic', icon: '🎯', shortDesc: 'Guess the battle from the image', longDesc: 'See an AI-generated image of a famous battle and try to guess which one it is. Use hints if you get stuck!' },
  { id: 'timed', label: 'Timed', icon: '⏱️', shortDesc: 'Race against the clock', longDesc: 'Same as Classic, but with a countdown timer. Guess faster to earn bonus points!' },
  { id: 'reverse-year', label: 'Year', icon: '📅', shortDesc: 'Guess when it happened', longDesc: "You'll be given a battle name \u2014 guess the year it took place. Within 10 years counts as correct." },
  { id: 'reverse-location', label: 'Location', icon: '📍', shortDesc: 'Guess where it happened', longDesc: "You'll be given a battle name \u2014 type the location where it took place." },
  { id: 'timeline', label: 'Timeline', icon: '📜', shortDesc: 'Sort battles chronologically', longDesc: 'Drag and drop 5 battles into the correct chronological order. Perfect order earns a bonus!' },
  { id: 'campaign', label: 'Campaign', icon: '🗺️', shortDesc: 'Play through history', longDesc: 'Follow a narrative through historical campaigns like Rise of Rome or Napoleon\u2019s Gambit.' },
  { id: 'challenge', label: 'Challenge', icon: '⚔️', shortDesc: 'Challenge a friend', longDesc: 'Play a set of battles, then share a link. Your friend plays the same battles and tries to beat your score!' },
];

export function ModeSelector({ selected, onSelect, disabled }: ModeSelectorProps) {
  const selectedMode = modes.find(m => m.id === selected);

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
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300'
                    : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 border border-gray-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              whileHover={!disabled ? { scale: 1.03 } : undefined}
              whileTap={!disabled ? { scale: 0.97 } : undefined}
              title={mode.shortDesc}
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

      {/* Description of selected mode */}
      <AnimatePresence mode="wait">
        {selectedMode && (
          <motion.p
            key={selectedMode.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="text-sm text-center text-primary-700 font-medium bg-primary-50 border border-primary-200 rounded-lg px-4 py-2.5 max-w-md mx-auto leading-relaxed"
          >
            {selectedMode.longDesc}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
