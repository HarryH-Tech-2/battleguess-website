import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-6"
    >
      <motion.div
        className="flex items-center justify-center gap-3"
        whileHover={{ scale: 1.02 }}
      >
        {/* Animated Logo */}
        <div className="relative">
          {/* Glow ring */}
          <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur-md opacity-50"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            className="relative w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{
              rotate: [0, -10, 10, 0],
              scale: 1.1,
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated sword/flag icon */}
            <motion.svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
              />
            </motion.svg>

            {/* Sparkle effects */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${20 + i * 25}%`,
                  right: `${10 + i * 15}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Text */}
        <div className="text-left">
          <motion.h1
            className="text-3xl font-extrabold"
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1e40af 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            BattleGuess
          </motion.h1>
          <motion.p
            className="text-sm text-primary-600 font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Guess the Historical Battle
          </motion.p>
        </div>
      </motion.div>
    </motion.header>
  );
}
