import { motion } from 'framer-motion';

interface TimerDisplayProps {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
}

export function TimerDisplay({ timeRemaining, totalTime, isRunning }: TimerDisplayProps) {
  if (!isRunning && timeRemaining === 0) return null;

  const progress = totalTime > 0 ? timeRemaining / totalTime : 0;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Color based on time remaining
  const getColor = () => {
    if (progress > 0.5) return { stroke: '#22c55e', text: 'text-green-600', bg: 'bg-green-50' };
    if (progress > 0.25) return { stroke: '#eab308', text: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { stroke: '#ef4444', text: 'text-red-600', bg: 'bg-red-50' };
  };

  const colors = getColor();
  const isLow = progress <= 0.25 && isRunning;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} border border-gray-100 shadow-sm`}
    >
      {/* Circular progress ring */}
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 48 48">
          {/* Background circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <motion.circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </svg>
        {/* Time text in center */}
        <motion.span
          className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${colors.text}`}
          animate={isLow ? { scale: [1, 1.1, 1] } : {}}
          transition={isLow ? { duration: 0.5, repeat: Infinity } : {}}
        >
          {timeRemaining}
        </motion.span>
      </div>

      <span className={`text-sm font-medium ${colors.text}`}>
        {timeRemaining > 0 ? `${timeRemaining}s` : "Time's up!"}
      </span>
    </motion.div>
  );
}
