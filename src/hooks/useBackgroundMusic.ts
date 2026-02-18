import { useEffect, useRef, useState, useCallback } from 'react';

export function useBackgroundMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem('battleguess-music-muted');
    return stored === 'true';
  });
  const hasInteracted = useRef(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  // Handle mute state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.pause();
    } else if (hasInteracted.current) {
      audio.play().catch(() => {});
    }

    localStorage.setItem('battleguess-music-muted', String(isMuted));
  }, [isMuted]);

  // Start playback on first user interaction (browsers require this)
  useEffect(() => {
    const startPlayback = () => {
      if (hasInteracted.current) return;
      hasInteracted.current = true;

      if (!isMuted && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    };

    document.addEventListener('click', startPlayback, { once: false });
    document.addEventListener('keydown', startPlayback, { once: false });

    return () => {
      document.removeEventListener('click', startPlayback);
      document.removeEventListener('keydown', startPlayback);
    };
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { isMuted, toggleMute };
}
