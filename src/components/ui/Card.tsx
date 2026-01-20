import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glass';
  glow?: boolean;
}

export function Card({ children, variant = 'default', glow = false, className = '', ...props }: CardProps) {
  const variants = {
    default: 'bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/50 p-6',
    elevated: 'bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-primary-100/50 p-8',
    glass: 'bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6',
  };

  return (
    <div className="relative">
      {/* Animated glow background */}
      {glow && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 rounded-2xl blur-lg opacity-30"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <motion.div
        className={`relative ${variants[variant]} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={{
          y: -2,
          boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.25)',
        }}
        {...props}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {children}
      </motion.div>
    </div>
  );
}
