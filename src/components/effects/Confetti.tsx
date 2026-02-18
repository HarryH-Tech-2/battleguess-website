import { motion } from 'framer-motion';

interface ConfettiProps {
  count?: number;
  variant?: 'win' | 'celebration';
}

const winColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#fbbf24', '#34d399'];
const celebrationColors = ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#eab308', '#8b5cf6'];

export function Confetti({ count = 50, variant = 'win' }: ConfettiProps) {
  const colors = variant === 'celebration' ? celebrationColors : winColors;
  const particleCount = variant === 'celebration' ? Math.max(count, 60) : count;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(particleCount)].map((_, i) => {
        const isRect = variant === 'celebration' && i % 3 === 0;
        const size = variant === 'celebration'
          ? `${2 + Math.random() * 4}px`
          : '12px';

        return (
          <motion.div
            key={i}
            className={`absolute ${isRect ? 'rounded-sm' : 'rounded-full'}`}
            style={{
              background: colors[i % colors.length],
              width: size,
              height: isRect ? `${4 + Math.random() * 6}px` : size,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 20 : 1000,
              opacity: 0,
              rotate: Math.random() * 720 - 360,
              x: (Math.random() - 0.5) * 200,
            }}
            transition={{
              duration: variant === 'celebration' ? 2.5 + Math.random() * 2 : 2 + Math.random() * 2,
              delay: Math.random() * (variant === 'celebration' ? 1.5 : 0.5),
              ease: 'easeIn',
            }}
          />
        );
      })}
    </div>
  );
}
