import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

interface GeneralMascotProps {
  hints: string[];
  revealedHints: number[];
  onRevealHint: (index: number) => void;
  disabled?: boolean;
  side?: 'left' | 'right';
  mascotImage?: string;
  mascotAlt?: string;
}

// Enable drag on screens >= 1024px (lg breakpoint)
const DRAG_BREAKPOINT = 1024;

// Module-level storage — survives component unmount/remount between questions
const savedPosition = { x: 0, y: 0 };

export function GeneralMascot({
  hints,
  revealedHints,
  onRevealHint,
  disabled,
  side = 'right',
  mascotImage = '/mascot-roman.png',
  mascotAlt = 'Battle Guide mascot',
}: GeneralMascotProps) {
  const [showBubble, setShowBubble] = useState(false);
  // Initialise synchronously so the first frame already has the correct style
  const [canDrag, setCanDrag] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= DRAG_BREAKPOINT
  );
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextHintIndex = revealedHints.length;
  const canRevealMore = nextHintIndex < hints.length;
  const hintsRemaining = hints.length - revealedHints.length;

  // Motion values initialised from saved position so drag persists across remounts
  const dragX = useMotionValue(savedPosition.x);
  const dragY = useMotionValue(savedPosition.y);

  useEffect(() => {
    const check = () => setCanDrag(window.innerWidth >= DRAG_BREAKPOINT);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close bubble when the question changes (new hints = new question)
  const hintsKey = hints.join('|');
  useEffect(() => {
    setShowBubble(false);
  }, [hintsKey]);

  const handleRevealHint = () => {
    if (canRevealMore && !disabled) {
      onRevealHint(nextHintIndex);
    }
  };

  const handleMascotClick = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }
    if (!showBubble) {
      if (revealedHints.length === 0 && canRevealMore && !disabled) {
        onRevealHint(0);
      }
      setShowBubble(true);
    } else {
      setShowBubble(false);
    }
  }, [showBubble, revealedHints.length, canRevealMore, disabled, onRevealHint]);

  const isLeft = side === 'left';

  // Viewport drag constraints — computed after mount when the ref is available,
  // and kept up-to-date on window resize. Uses generous initial values so drag
  // works even on the very first frame before the effect runs.
  const [dragBounds, setDragBounds] = useState({
    top: -window.innerHeight,
    left: -window.innerWidth,
    right: window.innerWidth,
    bottom: window.innerHeight,
  });

  useEffect(() => {
    if (!canDrag) return;
    const recalc = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = dragX.get();
      const cy = dragY.get();
      // Subtract current drag offset to get the CSS layout position
      setDragBounds({
        top: -(rect.top - cy),
        left: -(rect.left - cx),
        right: window.innerWidth - (rect.right - cx),
        bottom: window.innerHeight - (rect.bottom - cy),
      });
    };
    // Run after paint so the ref is guaranteed to be set
    requestAnimationFrame(recalc);
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [canDrag, dragX, dragY]);

  return (
    <motion.div
      ref={containerRef}
      drag={canDrag}
      dragConstraints={canDrag ? dragBounds : undefined}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={() => {
        isDraggingRef.current = false;
      }}
      onDrag={(_, info) => {
        if (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5) {
          isDraggingRef.current = true;
        }
      }}
      onDragEnd={() => {
        // Persist position so it survives unmount/remount between questions
        savedPosition.x = dragX.get();
        savedPosition.y = dragY.get();
        // Small delay so the click handler can check isDraggingRef
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 100);
      }}
      style={canDrag ? { x: dragX, y: dragY, cursor: 'grab', touchAction: 'none' } : undefined}
      whileDrag={canDrag ? { cursor: 'grabbing', scale: 1.05 } : undefined}
      className={`fixed z-40 bottom-2 lg:bottom-4
        ${canDrag
          ? 'right-1 sm:right-2 lg:right-[8%] 2xl:right-[10%]'
          : isLeft
            ? 'left-1 sm:left-2 lg:left-[8%] 2xl:left-[10%]'
            : 'right-1 sm:right-2 lg:right-[8%] 2xl:right-[10%]'
        }
      `}
    >
      {/* Speech Bubble - absolutely positioned above mascot */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`absolute bottom-full mb-2 ${canDrag ? 'right-0' : isLeft ? 'left-0' : 'right-0'} bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border-2 border-amber-200 p-2 sm:p-4 lg:p-5 w-[200px] sm:w-[300px] lg:w-[360px] max-h-[45vh] sm:max-h-[50vh] overflow-y-auto`}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowBubble(false)}
              className="absolute top-2 right-2 w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold transition-colors"
            >
              <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 lg:mb-3">
              <div className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm lg:text-base font-bold text-amber-800">
                Intel Report ({revealedHints.length}/{hints.length})
              </p>
            </div>

            {revealedHints.length > 0 && (
              <div className="space-y-1 sm:space-y-1.5 mb-1.5 sm:mb-2">
                {[...revealedHints].sort((a, b) => a - b).map((hintIndex) => (
                  <motion.div
                    key={hintIndex}
                    initial={{ opacity: 0, x: (canDrag || !isLeft) ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-1.5 sm:gap-2 bg-amber-50 rounded-md sm:rounded-lg p-1.5 sm:p-2 lg:p-3 border border-amber-100"
                  >
                    <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-[8px] sm:text-[10px] lg:text-xs font-bold mt-0.5">
                      {hintIndex + 1}
                    </span>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-amber-900 leading-snug sm:leading-relaxed">{hints[hintIndex]}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {canRevealMore && !disabled && (
              <button
                onClick={handleRevealHint}
                className="w-full py-1.5 sm:py-2 lg:py-2.5 px-2 sm:px-3 rounded-md sm:rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-[10px] sm:text-xs lg:text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Gather Intel (-25 pts)
              </button>
            )}

            {!canRevealMore && (
              <div className="text-center py-1">
                <p className="text-xs lg:text-sm text-amber-500 font-medium">
                  All intel gathered, sir!
                </p>
              </div>
            )}

            <div className={`absolute -bottom-2 ${canDrag ? 'right-6' : isLeft ? 'left-6' : 'right-6'} w-3 h-3 bg-white/95 border-r-2 border-b-2 border-amber-200 transform rotate-45`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Character */}
      <motion.div
        onClick={handleMascotClick}
        className="relative"
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } }}
        title={canDrag
          ? `${hintsRemaining} hints remaining – click for intel, drag to move!`
          : `${hintsRemaining} hints remaining – click for intel!`
        }
      >
        {hintsRemaining > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs lg:text-lg font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 flex items-center justify-center z-10 shadow-lg border-2 lg:border-[3px] border-white"
          >
            {hintsRemaining}
          </span>
        )}

        <img
          src={mascotImage}
          alt={mascotAlt}
          className="w-[80px] h-[96px] sm:w-[100px] sm:h-[120px] lg:w-[340px] lg:h-[408px] 2xl:w-[400px] 2xl:h-[480px] object-contain select-none pointer-events-none"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}
