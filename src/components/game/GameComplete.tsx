import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface GameCompleteProps {
  score: number;
  correctGuesses: number;
  totalGuesses: number;
  bestStreak: number;
  totalBattles: number;
  onPlayAgain: () => void;
}

function getRankTitle(correctGuesses: number, totalBattles: number): { rank: string; message: string } {
  const ratio = correctGuesses / totalBattles;
  if (ratio >= 0.9) return { rank: 'Field Marshal', message: 'A legendary tactician! You truly know your history.' };
  if (ratio >= 0.75) return { rank: 'General', message: 'Outstanding command of military history!' };
  if (ratio >= 0.6) return { rank: 'Colonel', message: 'A fine officer with sharp knowledge!' };
  if (ratio >= 0.4) return { rank: 'Captain', message: 'Good instincts, soldier. Keep studying!' };
  if (ratio >= 0.2) return { rank: 'Sergeant', message: 'You\'re learning the ropes. Keep at it!' };
  return { rank: 'Private', message: 'Every great commander started somewhere!' };
}

export function GameComplete({
  score,
  correctGuesses,
  totalGuesses,
  bestStreak,
  totalBattles,
  onPlayAgain,
}: GameCompleteProps) {
  const { rank, message } = getRankTitle(correctGuesses, totalBattles);
  const accuracy = totalGuesses > 0 ? Math.round((correctGuesses / totalGuesses) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-4"
    >
      {/* Mascot - A decorated general character */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.1 }}
        className="relative mx-auto w-40 h-40"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Hat */}
          <ellipse cx="100" cy="52" rx="55" ry="12" fill="#1e3a5f" />
          <rect x="55" y="25" width="90" height="27" rx="4" fill="#1e3a5f" />
          <rect x="70" y="18" width="60" height="12" rx="3" fill="#2c5282" />
          {/* Hat emblem */}
          <circle cx="100" cy="38" r="8" fill="#d4af37" />
          <polygon points="100,30 103,36 110,36 104,40 106,47 100,43 94,47 96,40 90,36 97,36" fill="#fbbf24" />
          {/* Face */}
          <circle cx="100" cy="85" r="30" fill="#f0c9a0" />
          {/* Eyes */}
          <ellipse cx="89" cy="80" rx="4" ry="4.5" fill="#1a202c" />
          <ellipse cx="111" cy="80" rx="4" ry="4.5" fill="#1a202c" />
          <circle cx="90.5" cy="79" r="1.5" fill="white" />
          <circle cx="112.5" cy="79" r="1.5" fill="white" />
          {/* Eyebrows */}
          <path d="M83 73 Q89 69 95 73" stroke="#4a3728" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M105 73 Q111 69 117 73" stroke="#4a3728" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Smile */}
          <path d="M90 95 Q100 107 110 95" stroke="#8b5e3c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Mustache */}
          <path d="M88 90 Q94 86 100 90 Q106 86 112 90" stroke="#4a3728" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Uniform body */}
          <path d="M65 115 Q100 108 135 115 L140 175 Q100 180 60 175 Z" fill="#1e3a5f" />
          {/* Collar */}
          <path d="M80 112 L100 125 L120 112" stroke="#d4af37" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Epaulettes */}
          <ellipse cx="68" cy="118" rx="12" ry="6" fill="#d4af37" />
          <ellipse cx="132" cy="118" rx="12" ry="6" fill="#d4af37" />
          {/* Medals */}
          <circle cx="85" cy="140" r="5" fill="#d4af37" stroke="#b8860b" strokeWidth="1" />
          <circle cx="100" cy="138" r="5" fill="#c0c0c0" stroke="#a0a0a0" strokeWidth="1" />
          <circle cx="115" cy="140" r="5" fill="#cd7f32" stroke="#a0522d" strokeWidth="1" />
          {/* Medal ribbons */}
          <rect x="83" y="131" width="4" height="5" rx="1" fill="#dc2626" />
          <rect x="98" y="129" width="4" height="5" rx="1" fill="#2563eb" />
          <rect x="113" y="131" width="4" height="5" rx="1" fill="#16a34a" />
          {/* Buttons */}
          <circle cx="100" cy="152" r="2.5" fill="#d4af37" />
          <circle cx="100" cy="165" r="2.5" fill="#d4af37" />
        </svg>
      </motion.div>

      {/* Rank Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm uppercase tracking-widest text-primary-400 font-medium">You have been promoted to</p>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 bg-clip-text text-transparent mt-1">
          {rank}
        </h2>
        <p className="text-gray-600 mt-2 max-w-sm mx-auto">{message}</p>
      </motion.div>

      {/* Mission Complete Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-4"
      >
        <p className="text-lg font-bold">Mission Complete!</p>
        <p className="text-primary-100 text-sm">
          You conquered all {totalBattles} battles in this campaign
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="bg-white rounded-xl p-4 shadow-md border border-primary-100">
          <p className="text-3xl font-bold text-primary-600">{score.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Total Score</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-primary-100">
          <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
          <p className="text-xs text-gray-500 mt-1">Accuracy</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-primary-100">
          <p className="text-3xl font-bold text-orange-500">{bestStreak}</p>
          <p className="text-xs text-gray-500 mt-1">Best Streak</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-primary-100">
          <p className="text-3xl font-bold text-primary-600">{correctGuesses}/{totalBattles}</p>
          <p className="text-xs text-gray-500 mt-1">Battles Won</p>
        </div>
      </motion.div>

      {/* Celebration confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              width: i % 3 === 0 ? '8px' : '6px',
              height: i % 3 === 0 ? '8px' : '14px',
              borderRadius: i % 3 === 0 ? '50%' : '2px',
              background: ['#d4af37', '#3b82f6', '#dc2626', '#16a34a', '#fbbf24', '#8b5cf6'][i % 6],
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 20,
              opacity: 0,
              rotate: Math.random() * 720 - 360,
            }}
            transition={{
              duration: 2.5 + Math.random() * 2,
              delay: Math.random() * 1.5,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>

      {/* Play Again Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button variant="primary" size="lg" onClick={onPlayAgain} className="w-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Campaign
        </Button>
      </motion.div>
    </motion.div>
  );
}
