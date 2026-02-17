import { motion } from 'framer-motion';
import type { Difficulty } from '../../types';

interface DifficultySelectorProps {
  selected: Difficulty | 'all';
  onSelect: (difficulty: Difficulty | 'all') => void;
  disabled?: boolean;
}

const items: { id: Difficulty | 'all'; name: string; icon: string; color: string }[] = [
  { id: 'all', name: 'All Levels', icon: '🎯', color: '' },
  { id: 'easy', name: 'Easy', icon: '🟢', color: 'from-green-500 to-green-600' },
  { id: 'medium', name: 'Medium', icon: '🟡', color: 'from-yellow-500 to-yellow-600' },
  { id: 'hard', name: 'Hard', icon: '🔴', color: 'from-red-500 to-red-600' },
];

export function DifficultySelector({
  selected,
  onSelect,
  disabled = false,
}: DifficultySelectorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 justify-center">
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
                  ? item.color
                    ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
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
