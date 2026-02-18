import { Reorder, motion } from 'framer-motion';
import type { Battle } from '../../types';
import { Button } from '../ui/Button';

interface TimelineBoardProps {
  battles: Battle[];
  onReorder: (newOrder: Battle[]) => void;
  onSubmit: () => void;
}

export function TimelineBoard({ battles, onReorder, onSubmit }: TimelineBoardProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-gray-800">
          Arrange these battles chronologically
        </h3>
        <p className="text-sm text-gray-500">
          Drag to reorder from earliest (top) to latest (bottom)
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-primary-200 z-0" />

        <Reorder.Group
          axis="y"
          values={battles}
          onReorder={onReorder}
          className="space-y-2 relative z-10"
        >
          {battles.map((battle, index) => (
            <Reorder.Item
              key={battle.id}
              value={battle}
              className="cursor-grab active:cursor-grabbing"
            >
              <motion.div
                layout
                className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Order number */}
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>

                {/* Battle info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{battle.name}</p>
                  <p className="text-xs text-gray-500 truncate">{battle.location}</p>
                </div>

                {/* Drag handle */}
                <div className="text-gray-300 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8-16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                  </svg>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={onSubmit}
        className="w-full"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Submit Order
      </Button>
    </div>
  );
}
