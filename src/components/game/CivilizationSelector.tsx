import { motion } from 'framer-motion';
import type { CivilizationId } from '../../types';
import { civilizations } from '../../data/civilizations';

interface CivilizationSelectorProps {
  selected: CivilizationId | 'all';
  onSelect: (civilization: CivilizationId | 'all') => void;
  disabled?: boolean;
}

const items = [
  { id: 'all' as const, name: 'All Battles', icon: '\u{1F30D}' },
  ...civilizations.map(c => ({ id: c.id, name: c.name, icon: c.icon })),
];

export function CivilizationSelector({
  selected,
  onSelect,
  disabled = false,
}: CivilizationSelectorProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 pb-1 min-w-max justify-center">
        {items.map(item => {
          const isSelected = selected === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => !disabled && onSelect(item.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                transition-colors duration-200 whitespace-nowrap
                ${isSelected
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'bg-white text-primary-600 border border-primary-200 hover:border-primary-300 shadow-sm'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              whileHover={disabled ? {} : { scale: 1.05 }}
              whileTap={disabled ? {} : { scale: 0.95 }}
              disabled={disabled}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
