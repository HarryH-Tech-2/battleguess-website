import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface BattleImageProps {
  imageUrl: string | null;
  isLoading: boolean;
  battleName?: string;
  battleYear?: number;
}

function formatYear(year?: number): string {
  if (!year) return '';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year}`;
}

function PlaceholderVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  // Set `muted` imperatively via a ref callback so the HTML attribute is
  // present on the element the moment iOS Safari evaluates autoplay
  // eligibility (React's `muted` prop sets the property but the attribute
  // timing has historically been unreliable for autoplay gating).
  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) {
      el.muted = true;
      el.setAttribute('muted', '');
      el.defaultMuted = true;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const gestureEvents = ['pointerdown', 'touchstart', 'keydown'] as const;

    const removeGestureListeners = () => {
      gestureEvents.forEach((e) => window.removeEventListener(e, attemptPlay));
    };

    function attemptPlay() {
      if (!video || cancelled) return;
      // Re-assert muted in case anything has toggled it.
      video.muted = true;
      const result = video.play();
      if (result === undefined) return;
      result
        .then(() => {
          if (cancelled) return;
          setShowFallback(false);
          removeGestureListeners();
        })
        .catch(() => {
          if (cancelled) return;
          // Autoplay blocked or not enough data yet. Show the poster and keep
          // retrying: on the next `canplay` tick and on the first user gesture.
          setShowFallback(true);
        });
    }

    const onCanPlay = () => attemptPlay();

    // If the video isn't ready yet (common on cold cache / fresh page load),
    // wait for it rather than calling play() prematurely — a too-early play()
    // on mobile often rejects with a NotAllowedError because the browser
    // hasn't decoded enough data to grant silent autoplay.
    if (video.readyState >= 2 /* HAVE_CURRENT_DATA */) {
      attemptPlay();
    } else {
      video.addEventListener('canplay', onCanPlay);
    }

    // Last-resort: if autoplay really is blocked (iOS Low Power Mode etc.),
    // the first user gesture anywhere on the page will be allowed to start it.
    gestureEvents.forEach((e) =>
      window.addEventListener(e, attemptPlay, { passive: true }),
    );

    return () => {
      cancelled = true;
      video.removeEventListener('canplay', onCanPlay);
      removeGestureListeners();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <motion.video
        ref={setVideoRef}
        src="/battle-placeholder-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/welcome-placeholder.webp"
        className="w-full h-full object-cover object-top"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />
      <AnimatePresence>
        {showFallback && (
          <motion.img
            key="poster-fallback"
            src="/welcome-placeholder.webp"
            alt="Welcome to BattleGuess"
            className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export function BattleImage({ imageUrl, isLoading, battleName, battleYear }: BattleImageProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      {/* Image Container — square aspect ratio matches the 1080x1080 source images.
          Cap at 70vh on both width and height so the square shrinks (not clips)
          on short viewports. */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-square max-h-[70vh] max-w-[70vh] mx-auto">
          <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200"
                >
                  <div className="relative">
                    <motion.div
                      className="w-16 h-16 border-4 border-primary-300 border-t-primary-600 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                  <motion.p
                    className="mt-4 text-primary-600 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {t('game.loadingBattleScene')}
                  </motion.p>
                </motion.div>
              ) : imageUrl ? (
                <motion.img
                  key="image"
                  src={imageUrl}
                  alt={battleName ? `Battle scene of ${battleName}` : 'Historical battle scene'}
                  width={1080}
                  height={1080}
                  className="w-full h-full object-contain"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <PlaceholderVideo />
              )}
            </AnimatePresence>
      </div>

      {/* Date display below image */}
      {battleYear && imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium border border-primary-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatYear(battleYear)}
          </span>
        </motion.div>
      )}
    </div>
  );
}
