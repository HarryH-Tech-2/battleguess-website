import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Confetti } from '../effects/Confetti';
import { ShareButton } from './ShareButton';

interface GameCompleteProps {
  score: number;
  correctGuesses: number;
  totalGuesses: number;
  bestStreak: number;
  totalBattles: number;
  onPlayAgain: () => void;
}

function getRankTitle(correctGuesses: number, totalBattles: number): { rank: string; message: string; quote: string } {
  const ratio = correctGuesses / totalBattles;
  if (ratio >= 0.9) return { rank: 'Field Marshal', message: 'A legendary tactician! You truly know your history.', quote: '"Impossible is a word to be found only in the dictionary of fools." - Napoleon' };
  if (ratio >= 0.75) return { rank: 'General', message: 'Outstanding command of military history!', quote: '"In war, the moral is to the physical as three is to one." - Napoleon' };
  if (ratio >= 0.6) return { rank: 'Colonel', message: 'A fine officer with sharp knowledge!', quote: '"Victory belongs to the most persevering." - Napoleon' };
  if (ratio >= 0.4) return { rank: 'Captain', message: 'Good instincts, soldier. Keep studying!', quote: '"Courage isn\'t having the strength to go on - it is going on when you don\'t have strength." - Napoleon' };
  if (ratio >= 0.2) return { rank: 'Sergeant', message: 'You\'re learning the ropes. Keep at it!', quote: '"The battlefield is a scene of constant chaos." - Napoleon' };
  return { rank: 'Private', message: 'Every great commander started somewhere!', quote: '"Glory is fleeting, but obscurity is forever." - Napoleon' };
}

export function GameComplete({
  score,
  correctGuesses,
  totalGuesses,
  bestStreak,
  totalBattles,
  onPlayAgain,
}: GameCompleteProps) {
  const { rank, message, quote } = getRankTitle(correctGuesses, totalBattles);
  const accuracy = totalGuesses > 0 ? Math.round((correctGuesses / totalGuesses) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-4 sm:space-y-6 py-2 sm:py-4"
    >
      {/* Napoleon-style mascot */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.1 }}
        className="relative mx-auto w-32 h-36 sm:w-40 sm:h-44"
      >
        <svg viewBox="0 0 200 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Napoleon's bicorne hat (sideways) */}
          <path d="M40 55 Q50 10 100 20 Q150 10 160 55 Q130 48 100 50 Q70 48 40 55 Z" fill="#1a1a2e" />
          <path d="M45 52 Q55 18 100 26 Q145 18 155 52 Q128 46 100 48 Q72 46 45 52 Z" fill="#16213e" />
          {/* Hat cockade (rosette) */}
          <circle cx="100" cy="35" r="7" fill="#1e3a5f" />
          <circle cx="100" cy="35" r="5" fill="#dc2626" />
          <circle cx="100" cy="35" r="3" fill="white" />
          <circle cx="100" cy="35" r="1.5" fill="#2563eb" />
          {/* Hat brim highlight */}
          <path d="M50 53 Q100 60 150 53" stroke="#d4af37" strokeWidth="2" fill="none" />
          {/* Face */}
          <ellipse cx="100" cy="85" rx="28" ry="30" fill="#f0c9a0" />
          {/* Sideburns */}
          <path d="M73 72 Q70 85 74 95" stroke="#5c4033" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M127 72 Q130 85 126 95" stroke="#5c4033" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Eyes - determined look */}
          <ellipse cx="90" cy="80" rx="3.5" ry="4" fill="#1a202c" />
          <ellipse cx="110" cy="80" rx="3.5" ry="4" fill="#1a202c" />
          <circle cx="91" cy="79" r="1.2" fill="white" />
          <circle cx="111" cy="79" r="1.2" fill="white" />
          {/* Strong eyebrows */}
          <path d="M83 73 Q90 68 97 73" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M103 73 Q110 68 117 73" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Nose */}
          <path d="M100 82 L98 90 L102 90" stroke="#d4a574" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Confident smile */}
          <path d="M92 97 Q100 104 108 97" stroke="#8b5e3c" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Uniform - high-collared Napoleonic coat */}
          <path d="M62 115 Q100 105 138 115 L145 200 Q100 210 55 200 Z" fill="#1e3a5f" />
          {/* White waistcoat V */}
          <path d="M88 112 L100 145 L112 112" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
          {/* High collar */}
          <rect x="82" y="106" width="8" height="14" rx="2" fill="#d4af37" />
          <rect x="110" y="106" width="8" height="14" rx="2" fill="#d4af37" />
          {/* Epaulettes with fringe */}
          <ellipse cx="65" cy="118" rx="12" ry="5" fill="#d4af37" />
          <ellipse cx="135" cy="118" rx="12" ry="5" fill="#d4af37" />
          {/* Epaulette fringe lines */}
          <line x1="56" y1="122" x2="54" y2="128" stroke="#b8860b" strokeWidth="1.5" />
          <line x1="60" y1="122" x2="58" y2="128" stroke="#b8860b" strokeWidth="1.5" />
          <line x1="64" y1="123" x2="62" y2="129" stroke="#b8860b" strokeWidth="1.5" />
          <line x1="68" y1="122" x2="66" y2="128" stroke="#b8860b" strokeWidth="1.5" />
          <line x1="132" y1="122" x2="134" y2="128" stroke="#b8860b" strokeWidth="1.5" />
          <line x1="136" y1="122" x2="138" y2="128" stroke="#b8860b" strokeWidth="1.5" />
          <line x1="140" y1="122" x2="142" y2="128" stroke="#b8860b" strokeWidth="1.5" />
          <line x1="144" y1="122" x2="146" y2="128" stroke="#b8860b" strokeWidth="1.5" />
          {/* Sash across chest */}
          <path d="M75 125 L120 165" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          {/* Hand tucked in coat (Napoleon's iconic pose) */}
          <ellipse cx="95" cy="155" rx="8" ry="6" fill="#f0c9a0" transform="rotate(-10 95 155)" />
          {/* Medals on chest */}
          <circle cx="80" cy="140" r="4.5" fill="#d4af37" stroke="#b8860b" strokeWidth="1" />
          <polygon points="80,135 81.5,139 85,139 82.5,141.5 83.5,145.5 80,143 76.5,145.5 77.5,141.5 75,139 78.5,139" fill="#fbbf24" />
          <circle cx="92" cy="135" r="3.5" fill="#c0c0c0" stroke="#a0a0a0" strokeWidth="1" />
          {/* Gold buttons */}
          <circle cx="100" cy="155" r="2" fill="#d4af37" />
          <circle cx="100" cy="168" r="2" fill="#d4af37" />
          <circle cx="100" cy="181" r="2" fill="#d4af37" />
        </svg>
      </motion.div>

      {/* Rank Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs sm:text-sm uppercase tracking-widest text-primary-400 font-medium">You have been promoted to</p>
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 bg-clip-text text-transparent mt-1">
          {rank}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-sm mx-auto">{message}</p>
      </motion.div>

      {/* Napoleon quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="px-2"
      >
        <p className="text-xs sm:text-sm text-primary-500 italic max-w-sm mx-auto">{quote}</p>
      </motion.div>

      {/* Mission Complete Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-3 sm:p-4"
      >
        <p className="text-base sm:text-lg font-bold">Mission Complete!</p>
        <p className="text-primary-100 text-xs sm:text-sm">
          You conquered all {totalBattles} battles in this campaign
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-2 sm:gap-3"
      >
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-primary-100">
          <p className="text-2xl sm:text-3xl font-bold text-primary-600">{score.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Total Score</p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-primary-100">
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{accuracy}%</p>
          <p className="text-xs text-gray-500 mt-1">Accuracy</p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-primary-100">
          <p className="text-2xl sm:text-3xl font-bold text-primary-500">{bestStreak}</p>
          <p className="text-xs text-gray-500 mt-1">Best Streak</p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-primary-100">
          <p className="text-2xl sm:text-3xl font-bold text-primary-600">{correctGuesses}/{totalBattles}</p>
          <p className="text-xs text-gray-500 mt-1">Battles Won</p>
        </div>
      </motion.div>

      <Confetti variant="celebration" count={60} />

      {/* Play Again + Share */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex gap-3"
      >
        <Button variant="primary" size="lg" onClick={onPlayAgain} className="flex-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Campaign
        </Button>
        <ShareButton
          data={{
            score,
            accuracy,
            streak: bestStreak,
            rank,
            battlesWon: correctGuesses,
            totalBattles,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
