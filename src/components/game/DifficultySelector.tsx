import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Difficulty } from '../../types';

interface DifficultySelectorProps {
  selected: Difficulty | 'all';
  onSelect: (difficulty: Difficulty | 'all') => void;
  disabled?: boolean;
}

const items: { id: Difficulty | 'all'; icon: string; dotColor: string }[] = [
  { id: 'all', icon: '🎯', dotColor: 'bg-gray-400' },
  { id: 'easy', icon: '🟢', dotColor: 'bg-green-500' },
  { id: 'medium', icon: '🟡', dotColor: 'bg-yellow-500' },
  { id: 'hard', icon: '🔴', dotColor: 'bg-red-500' },
];

export function DifficultySelector({
  selected,
  onSelect,
  disabled = false,
}: DifficultySelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find(i => i.id === selected);
  const selectedName = selectedItem?.id === 'all' ? t('difficulty.allLevels') : t(`difficulty.${selectedItem?.id}`);

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
          transition-all duration-150 min-w-0 sm:min-w-[140px] justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${selectedItem?.dotColor}`} />
          <span>{selectedName}</span>
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
            className="absolute z-50 mt-1.5 left-0 w-40 sm:w-44 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >
            {items.map((item) => {
              const isSelected = selected === item.id;
              const name = item.id === 'all' ? t('difficulty.allLevels') : t(`difficulty.${item.id}`);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors
                    ${isSelected
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
                  <span className="flex-1 text-left">{name}</span>
                  {isSelected && (
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
