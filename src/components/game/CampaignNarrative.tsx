import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface CampaignNarrativeProps {
  text: string;
  campaignName: string;
  battleIndex: number;
  totalBattles: number;
  isOutro?: boolean;
  onContinue: () => void;
}

export function CampaignNarrative({
  text,
  campaignName,
  battleIndex,
  totalBattles,
  isOutro = false,
  onContinue,
}: CampaignNarrativeProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text]);

  const handleSkip = () => {
    setDisplayedText(text);
    setIsTyping(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Campaign header */}
      <div className="text-center">
        <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">{campaignName}</p>
        {!isOutro && (
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {Array.from({ length: totalBattles }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < battleIndex ? 'bg-green-400' : i === battleIndex ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Narrative text with typewriter effect */}
      <div className="bg-gradient-to-b from-primary-50 to-white rounded-xl p-4 sm:p-6 border border-primary-100 min-h-[120px]">
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic">
          "{displayedText}"
          {isTyping && (
            <span className="inline-block w-0.5 h-5 bg-primary-500 ml-0.5 animate-pulse" />
          )}
        </p>
      </div>

      {/* Continue button */}
      <div className="flex justify-center gap-3">
        {isTyping && (
          <Button variant="secondary" size="md" onClick={handleSkip}>
            Skip
          </Button>
        )}
        <Button
          variant="primary"
          size="lg"
          onClick={onContinue}
          className={isTyping ? 'opacity-50' : ''}
        >
          {isOutro ? 'View Results' : `Battle ${battleIndex + 1} of ${totalBattles}`}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </div>
    </motion.div>
  );
}
