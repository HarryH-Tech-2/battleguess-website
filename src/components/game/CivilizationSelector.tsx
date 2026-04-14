import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { CivilizationId } from '../../types';
import { civilizations } from '../../data/civilizations';

interface CivilizationSelectorProps {
  selected: CivilizationId | 'all';
  onSelect: (civilization: CivilizationId | 'all') => void;
  disabled?: boolean;
}

export function CivilizationSelector({
  selected,
  onSelect,
  disabled = false,
}: CivilizationSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const items = [
    { id: 'all' as const, name: t('civilizations.allBattles'), icon: '\u{1F30D}' },
    ...civilizations.map(c => ({
      id: c.id,
      name: t(`civilizations.${c.id}`),
      icon: c.icon,
    })),
  ];

  const selectedItem = items.find(i => i.id === selected);

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
          transition-all duration-150 min-w-0 sm:min-w-[180px] justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className="flex items-center gap-2">
          <span>{selectedItem?.icon}</span>
          <span>{selectedItem?.name}</span>
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
            className="absolute z-50 mt-1.5 left-0 w-56 sm:w-60 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-h-[60vh] overflow-y-auto"
          >
            {items.map((item) => {
              const isSelected = selected === item.id;
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
                  <span>{item.icon}</span>
                  <span className="flex-1 text-left">{item.name}</span>
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
