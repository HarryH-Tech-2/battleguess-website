import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Confetti } from '../effects/Confetti';

interface CampaignCompleteProps {
  campaignName: string;
  campaignIcon: string;
  score: number;
  correctGuesses: number;
  totalBattles: number;
  onBackToSelect: () => void;
}

export function CampaignComplete({
  campaignName,
  campaignIcon,
  score,
  correctGuesses,
  totalBattles,
  onBackToSelect,
}: CampaignCompleteProps) {
  const accuracy = totalBattles > 0 ? Math.round((correctGuesses / totalBattles) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-4"
    >
      <Confetti variant="celebration" count={50} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="text-5xl"
      >
        {campaignIcon}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs uppercase tracking-widest text-primary-400 font-medium">Campaign Complete</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{campaignName}</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-2"
      >
        <div className="bg-white rounded-xl p-3 shadow-md border border-primary-100">
          <p className="text-2xl font-bold text-primary-600">{score}</p>
          <p className="text-xs text-gray-500">Total Score</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-md border border-primary-100">
          <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
          <p className="text-xs text-gray-500">Accuracy</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-md border border-primary-100">
          <p className="text-2xl font-bold text-primary-600">{correctGuesses}/{totalBattles}</p>
          <p className="text-xs text-gray-500">Battles Won</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button variant="primary" size="lg" onClick={onBackToSelect} className="w-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          More Campaigns
        </Button>
      </motion.div>
    </motion.div>
  );
}
