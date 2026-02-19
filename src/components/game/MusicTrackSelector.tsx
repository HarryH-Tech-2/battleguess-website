import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MusicTrack } from '../../hooks/useBackgroundMusic';

interface MusicTrackSelectorProps {
  tracks: MusicTrack[];
  currentTrackId: string;
  onChangeTrack: (trackId: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function MusicTrackSelector({ tracks, currentTrackId, onChangeTrack, isMuted, onToggleMute }: MusicTrackSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentTrack = tracks.find(t => t.id === currentTrackId);

  return (
    <div className="relative">
      {/* Main music button row */}
      <div className="flex items-center gap-2">
        {/* Mute/unmute button */}
        <button
          onClick={onToggleMute}
          className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
            isMuted
              ? 'bg-primary-50 text-primary-400 hover:bg-primary-100 hover:text-primary-600'
              : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
          }`}
          title={isMuted ? 'Enable music' : 'Mute music'}
        >
          {isMuted ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        {/* Track selector toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 text-sm font-medium transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <span className="max-w-[120px] truncate">{currentTrack?.name || 'Select Track'}</span>
          <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 left-0 right-0 min-w-[220px] bg-white rounded-xl shadow-lg border border-primary-100 overflow-hidden"
          >
            <div className="py-1">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => {
                    onChangeTrack(track.id);
                    setIsOpen(false);
                    // If muted, unmute when selecting a track
                    if (isMuted) onToggleMute();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left ${
                    track.id === currentTrackId
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  {/* Playing indicator */}
                  <span className="w-4 flex-shrink-0 text-center">
                    {track.id === currentTrackId && !isMuted ? (
                      <span className="inline-flex gap-px items-end h-3">
                        <motion.span
                          className="w-[2px] bg-primary-500 rounded-full"
                          animate={{ height: ['4px', '12px', '6px', '10px', '4px'] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.span
                          className="w-[2px] bg-primary-500 rounded-full"
                          animate={{ height: ['10px', '4px', '12px', '4px', '8px'] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        />
                        <motion.span
                          className="w-[2px] bg-primary-500 rounded-full"
                          animate={{ height: ['6px', '10px', '4px', '12px', '6px'] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                        />
                      </span>
                    ) : track.id === currentTrackId ? (
                      <svg className="w-3.5 h-3.5 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 3l14 9-14 9V3z" />
                      </svg>
                    ) : null}
                  </span>
                  <span className="truncate">{track.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
