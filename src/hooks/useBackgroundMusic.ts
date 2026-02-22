import { useEffect, useRef, useState, useCallback } from 'react';

export interface MusicTrack {
  id: string;
  name: string;
  src: string;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'drum-tune', name: 'War Drums', src: '/drum-tune.mp3' },
  { id: 'iron-crown', name: 'Iron Crown, Empty Throne', src: '/iron-crown-empty-throne.mp3' },
  { id: 'marble-ember', name: 'Marble And Ember', src: '/marble-and-ember.mp3' },
  { id: 'jade-river', name: 'Jade River Dream', src: '/jade-river-dream.mp3' },
];

export function useBackgroundMusic(defaultSrc: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem('battleguess-music-muted');
    return stored === null ? true : stored === 'true';
  });
  const [currentTrackId, setCurrentTrackId] = useState(() => {
    const stored = localStorage.getItem('battleguess-music-track');
    if (stored) return stored;
    // Find the track matching defaultSrc, or use first track
    const match = MUSIC_TRACKS.find(t => t.src === defaultSrc);
    return match ? match.id : MUSIC_TRACKS[0].id;
  });
  const hasInteracted = useRef(false);

  const currentTrack = MUSIC_TRACKS.find(t => t.id === currentTrackId) || MUSIC_TRACKS[0];

  // Create/replace audio element when track changes
  useEffect(() => {
    const audio = new Audio(currentTrack.src);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // If music is playing (not muted and user has interacted), start the new track
    if (!isMuted && hasInteracted.current) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack.src]);

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

  // Pause music when page is hidden (mobile tab switch / browser minimize)
  const wasPlayingBeforeHidden = useRef(false);
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        wasPlayingBeforeHidden.current = !isMuted && hasInteracted.current;
        audio.pause();
      } else {
        if (wasPlayingBeforeHidden.current && !isMuted) {
          audio.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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

  const changeTrack = useCallback((trackId: string) => {
    setCurrentTrackId(trackId);
    localStorage.setItem('battleguess-music-track', trackId);
  }, []);

  return { isMuted, toggleMute, currentTrackId, changeTrack, tracks: MUSIC_TRACKS };
}
