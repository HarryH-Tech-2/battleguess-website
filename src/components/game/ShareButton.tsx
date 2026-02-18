import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { shareResult, type ShareCardData } from '../../utils/shareCard';

interface ShareButtonProps {
  data: ShareCardData;
}

export function ShareButton({ data }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    await shareResult(data);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="relative">
      <Button variant="secondary" size="md" onClick={handleShare}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </Button>
      <AnimatePresence>
        {shared && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap"
          >
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
