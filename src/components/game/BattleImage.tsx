import { motion, AnimatePresence } from 'framer-motion';

interface BattleImageProps {
  imageUrl: string | null;
  isLoading: boolean;
  battleName?: string;
  battleYear?: number;
}

function formatYear(year?: number): string {
  if (!year) return '';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year}`;
}

export function BattleImage({ imageUrl, isLoading, battleName, battleYear }: BattleImageProps) {
  return (
    <div className="space-y-3">
      {/* Image Container - Square aspect ratio for 1080x1080 images */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gray-900">
          <div className="aspect-square">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200"
                >
                  <div className="relative">
                    <motion.div
                      className="w-16 h-16 border-4 border-primary-300 border-t-primary-600 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                  <motion.p
                    className="mt-4 text-primary-600 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Loading battle scene...
                  </motion.p>
                </motion.div>
              ) : imageUrl ? (
                <motion.img
                  key="image"
                  src={imageUrl}
                  alt={battleName ? `Battle scene of ${battleName}` : 'Historical battle scene'}
                  className="w-full h-full object-contain bg-gray-900"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <motion.img
                  key="placeholder"
                  src="/welcome-placeholder.png"
                  alt="BattleGuess - Can you name the battle?"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </AnimatePresence>
          </div>
      </div>

      {/* Date display below image */}
      {battleYear && imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium border border-primary-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatYear(battleYear)}
          </span>
        </motion.div>
      )}
    </div>
  );
}
