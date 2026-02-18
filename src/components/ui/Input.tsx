import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps {
  error?: boolean;
  className?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, disabled, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative">
        {/* Animated glow effect */}
        <AnimatePresence>
          {isFocused && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 rounded-2xl blur-md"
              style={{ zIndex: -1 }}
            />
          )}
        </AnimatePresence>

        {/* Animated border gradient */}
        <motion.div
          className={`absolute inset-0 rounded-xl ${error ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-400' : 'bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300'}`}
          animate={isFocused ? {
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
            padding: '2px',
            borderRadius: '0.75rem',
          }}
        >
          <div className="w-full h-full bg-white rounded-xl" />
        </motion.div>

        {/* Sparkle effects on focus */}
        <AnimatePresence>
          {isFocused && !error && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary-400 rounded-full"
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: '50%',
                    y: '50%',
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  style={{ zIndex: 10 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.input
          ref={ref}
          className={`
            relative w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl border-2 bg-white/90 backdrop-blur-sm text-base sm:text-lg
            outline-none transition-all duration-300 z-10
            placeholder:text-gray-400
            ${error
              ? 'border-red-400 focus:border-red-500 focus:shadow-red-200'
              : 'border-transparent focus:border-primary-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.02 }}
          animate={error ? {
            x: [0, -5, 5, -5, 5, 0],
          } : {}}
          transition={error ? { duration: 0.4 } : {}}
          {...props}
        />

        {/* Typing indicator dots */}
        <AnimatePresence>
          {isFocused && props.value && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 z-20"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-primary-400 rounded-full"
                  animate={{
                    y: [0, -4, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
