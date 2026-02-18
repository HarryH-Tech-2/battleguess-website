import { motion } from 'framer-motion';

export function DefeatAnimation() {
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
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-gray-400/60"
          style={{
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: -10, opacity: 0.6 }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 10 : 1000,
            opacity: 0,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 1,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
