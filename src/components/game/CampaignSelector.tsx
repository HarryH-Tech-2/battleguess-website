import { motion } from 'framer-motion';
import type { Campaign } from '../../data/campaigns';
import type { CampaignProgress } from '../../hooks/useCampaignGame';

interface CampaignSelectorProps {
  campaigns: Campaign[];
  progress: CampaignProgress;
  onSelect: (campaignId: string) => void;
}

export function CampaignSelector({ campaigns, progress, onSelect }: CampaignSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-gray-800">Choose Your Campaign</h3>
        <p className="text-sm text-gray-500">
          Follow historical narratives through a series of battles
        </p>
      </div>

      <div className="space-y-2">
        {campaigns.map((campaign, index) => {
          const cp = progress[campaign.id];
          const isCompleted = cp?.completed;

          return (
            <motion.button
              key={campaign.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(campaign.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-green-50 border-green-200 hover:border-green-300'
                  : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{campaign.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-800">{campaign.name}</h4>
                    {isCompleted && (
                      <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{campaign.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{campaign.battleIds.length} battles</span>
                    {cp && (
                      <span>Score: {cp.score} | {cp.correctGuesses}/{cp.totalBattles} correct</span>
                    )}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
