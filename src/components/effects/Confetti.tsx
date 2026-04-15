import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  count?: number;
  variant?: 'win' | 'celebration';
}

const winColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#fbbf24', '#34d399'];
const celebrationColors = ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#eab308', '#8b5cf6'];

/** Simple seeded PRNG so confetti is deterministic per-render. */
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function Confetti({ count = 50, variant = 'win' }: ConfettiProps) {
  const colors = variant === 'celebration' ? celebrationColors : winColors;
  const particleCount = variant === 'celebration' ? Math.max(count, 60) : count;

  const particles = useMemo(() => {
    const rng = makeRng(42);
    return Array.from({ length: particleCount }, (_, i) => {
      const isRect = variant === 'celebration' && i % 3 === 0;
      const sizeVal = variant === 'celebration' ? `${2 + rng() * 4}px` : '12px';
      return {
        isRect,
        size: sizeVal,
        height: isRect ? `${4 + rng() * 6}px` : sizeVal,
        left: `${rng() * 100}%`,
        rotate: rng() * 720 - 360,
        x: (rng() - 0.5) * 200,
        duration: variant === 'celebration' ? 2.5 + rng() * 2 : 2 + rng() * 2,
        delay: rng() * (variant === 'celebration' ? 1.5 : 0.5),
      };
    });
  }, [particleCount, variant]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute ${p.isRect ? 'rounded-sm' : 'rounded-full'}`}
          style={{
            background: colors[i % colors.length],
            width: p.size,
            height: p.height,
            left: p.left,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 20 : 1000,
            opacity: 0,
            rotate: p.rotate,
            x: p.x,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}
