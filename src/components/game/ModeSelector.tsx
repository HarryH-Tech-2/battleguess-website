import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { GameMode } from '../../types';

interface ModeSelectorProps {
  selected: GameMode;
  onSelect: (mode: GameMode) => void;
  disabled?: boolean;
}

const modes: { id: GameMode; icon: string; slug: string }[] = [
  { id: 'daily', icon: '📆', slug: 'daily' },
  { id: 'classic', icon: '🎯', slug: 'classic' },
  { id: 'reverse-year', icon: '📅', slug: 'reverse-year' },
  { id: 'campaign', icon: '🗺️', slug: 'campaign' },
  { id: 'challenge', icon: '⚔️', slug: 'challenge' },
];

export function ModeSelector({ selected, onSelect, disabled }: ModeSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedMode = modes.find(m => m.id === selected);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium
          bg-white text-gray-700 border border-gray-300 shadow-sm
          hover:bg-gray-50 hover:border-gray-400
          transition-all duration-150 min-w-0 sm:min-w-[160px] justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className="flex items-center gap-2">
          <span>{selectedMode?.icon}</span>
          <span>{selectedMode ? t(`gameModesData.${selectedMode.slug}.label`) : ''}</span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 text-[10px]"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-1.5 left-0 w-48 sm:w-52 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >
            {modes.map((mode) => {
              const isActive = selected === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    onSelect(mode.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors
                    ${isActive
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <span>{mode.icon}</span>
                  <span className="flex-1 text-left">{t(`gameModesData.${mode.slug}.label`)}</span>
                  {isActive && (
                    <span className="text-gray-400 text-xs">&#10003;</span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
