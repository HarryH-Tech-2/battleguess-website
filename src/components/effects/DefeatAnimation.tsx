import { useMemo } from 'react';
import { motion } from 'framer-motion';

/** Simple seeded PRNG for deterministic particles. */
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function DefeatAnimation() {
  const particles = useMemo(() => {
    const rng = makeRng(99);
    return Array.from({ length: 20 }, () => ({
      left: `${rng() * 100}%`,
      duration: 3 + rng() * 2,
      delay: rng() * 1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {/* Red vignette flash */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(239, 68, 68, 0.3) 100%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      {/* Dark particles drifting down */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-gray-400/60"
          style={{
            left: p.left,
          }}
          initial={{ y: -10, opacity: 0.6 }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 10 : 1000,
            opacity: 0,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
