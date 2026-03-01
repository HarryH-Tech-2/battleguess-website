import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { GameMode } from '../../types';

interface ModeSelectorProps {
  selected: GameMode;
  onSelect: (mode: GameMode) => void;
  disabled?: boolean;
}

const modes: { id: GameMode; icon: string; slug: string; highlight?: boolean }[] = [
  { id: 'daily', icon: '📆', slug: 'daily', highlight: true },
  { id: 'classic', icon: '🎯', slug: 'classic' },
  { id: 'reverse-year', icon: '📅', slug: 'reverse-year' },
  { id: 'campaign', icon: '🗺️', slug: 'campaign' },
  { id: 'challenge', icon: '⚔️', slug: 'challenge' },
];

export function ModeSelector({ selected, onSelect, disabled }: ModeSelectorProps) {
  const { t } = useTranslation();
  const selectedMode = modes.find(m => m.id === selected);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
        {t('game.gameMode')}
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
              title={t(`gameModesData.${mode.slug}.shortDesc`)}
            >
              <span>{mode.icon}</span>
              <span>{t(`gameModesData.${mode.slug}.label`)}</span>
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
            {t(`gameModesData.${selectedMode.slug}.longDesc`)}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
