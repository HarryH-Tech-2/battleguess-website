import { motion } from 'framer-motion';
import type { CivilizationId } from '../../types';
import { civilizations } from '../../data/civilizations';

interface CivilizationSelectorProps {
  selected: CivilizationId | 'all';
  onSelect: (civilization: CivilizationId | 'all') => void;
  disabled?: boolean;
}

const shortNames: Record<string, string> = {
  'ancient-egypt-mesopotamia': 'Egypt',
  'ancient-greece-rome': 'Greece & Rome',
  'medieval-europe': 'Medieval',
  'ottoman-islamic': 'Ottoman',
  'east-asia': 'East Asia',
  'colonial-napoleonic': 'Colonial',
  'american-wars': 'American',
  'world-wars': 'World Wars',
};

const items = [
  { id: 'all' as const, name: 'All Battles', shortName: 'All', icon: '\u{1F30D}' },
  ...civilizations.map(c => ({
    id: c.id,
    name: c.name,
    shortName: shortNames[c.id] || c.name,
    icon: c.icon,
  })),
];

export function CivilizationSelector({
  selected,
  onSelect,
  disabled = false,
}: CivilizationSelectorProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1.5 sm:gap-2 pb-1 sm:flex-wrap sm:justify-center w-max sm:w-auto">
        {items.map(item => {
          const isSelected = selected === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => !disabled && onSelect(item.id)}
              className={`
                flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium
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
              <span className="sm:hidden">{item.shortName}</span>
              <span className="hidden sm:inline">{item.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
