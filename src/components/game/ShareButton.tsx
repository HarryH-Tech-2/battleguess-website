import { useState } from 'react';
import { type ShareCardData } from '../../utils/shareCard';
import { ShareModal } from './ShareModal';

interface ShareButtonProps {
  data: ShareCardData;
  className?: string;
}

export function ShareButton({ data, className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-bold rounded-xl shadow-lg shadow-yellow-500/25 transition-all duration-200 hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-[0.98]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Score
      </button>
      <ShareModal isOpen={isOpen} data={data} onClose={() => setIsOpen(false)} />
    </div>
  );
}
