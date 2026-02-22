import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeneralMascotProps {
  hints: string[];
  revealedHints: number[];
  onRevealHint: (index: number) => void;
  disabled?: boolean;
}

function GeneralSVG() {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      <defs>
        {/* 3D skin gradient */}
        <radialGradient id="skinGrad" cx="0.45" cy="0.38" r="0.55">
          <stop offset="0%" stopColor="#F5D5B5" />
          <stop offset="60%" stopColor="#E8C39E" />
          <stop offset="100%" stopColor="#C9A072" />
        </radialGradient>
        {/* Hat gradient for depth */}
        <linearGradient id="hatGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a7a3d" />
          <stop offset="50%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#0d5c2b" />
        </linearGradient>
        {/* Hat top */}
        <linearGradient id="hatTopGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a8a44" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        {/* Uniform gradient */}
        <linearGradient id="uniformGrad" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#1a8a44" />
          <stop offset="40%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#0a4f22" />
        </linearGradient>
        {/* Epaulet gold gradient */}
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        {/* Medal shine */}
        <radialGradient id="medalGrad" cx="0.35" cy="0.3" r="0.65">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </radialGradient>
        {/* Star gradient */}
        <radialGradient id="starGrad" cx="0.4" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="40%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
        {/* Eye gradient */}
        <radialGradient id="eyeGrad" cx="0.4" cy="0.35" r="0.6">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </radialGradient>
        {/* Drop shadow filter */}
        <filter id="dropShadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.25" />
        </filter>
        {/* Inner shadow for hat brim */}
        <filter id="brimShadow" x="-5%" y="-50%" width="110%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.3" />
        </filter>
        {/* Button shine */}
        <radialGradient id="buttonGrad" cx="0.35" cy="0.3" r="0.65">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
        {/* Cheek blush */}
        <radialGradient id="blushGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f87171" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* === BODY / UNIFORM === */}
      <g filter="url(#dropShadow)">
        {/* Main body */}
        <path d="M35 98 C35 94, 38 90, 42 90 L78 90 C82 90, 85 94, 85 98 L87 148 C87 152, 84 155, 80 155 L40 155 C36 155, 33 152, 33 148 Z" fill="url(#uniformGrad)" />
        {/* Lapel fold left */}
        <path d="M42 90 L55 110 L55 90 Z" fill="#0d5c2b" opacity="0.4" />
        {/* Lapel fold right */}
        <path d="M78 90 L65 110 L65 90 Z" fill="#0d5c2b" opacity="0.4" />
        {/* Center stripe */}
        <rect x="57" y="90" width="6" height="65" fill="#0d5c2b" opacity="0.3" rx="1" />
        {/* Belt */}
        <rect x="33" y="130" width="54" height="6" rx="2" fill="#78350f" />
        <rect x="33" y="130" width="54" height="3" rx="1" fill="#92400e" />
        {/* Belt buckle */}
        <rect x="53" y="128" width="14" height="10" rx="2" fill="url(#goldGrad)" />
        <rect x="56" y="131" width="8" height="4" rx="1" fill="#78350f" />

        {/* Epaulets - left */}
        <ellipse cx="35" cy="93" rx="10" ry="5" fill="url(#goldGrad)" />
        <path d="M27 91 L27 96 C27 96 30 99 35 99 C40 99 43 96 43 96 L43 91 Z" fill="#ca8a04" opacity="0.4" />
        {/* Epaulet fringe left */}
        <rect x="26" y="95" width="2.5" height="6" rx="1" fill="#eab308" />
        <rect x="30" y="96" width="2.5" height="5" rx="1" fill="#eab308" />
        <rect x="34" y="96" width="2.5" height="5" rx="1" fill="#eab308" />
        <rect x="38" y="95" width="2.5" height="6" rx="1" fill="#eab308" />

        {/* Epaulets - right */}
        <ellipse cx="85" cy="93" rx="10" ry="5" fill="url(#goldGrad)" />
        <path d="M77 91 L77 96 C77 96 80 99 85 99 C90 99 93 96 93 96 L93 91 Z" fill="#ca8a04" opacity="0.4" />
        {/* Epaulet fringe right */}
        <rect x="78" y="95" width="2.5" height="6" rx="1" fill="#eab308" />
        <rect x="82" y="96" width="2.5" height="5" rx="1" fill="#eab308" />
        <rect x="86" y="96" width="2.5" height="5" rx="1" fill="#eab308" />
        <rect x="90" y="95" width="2.5" height="6" rx="1" fill="#eab308" />

        {/* Buttons */}
        <circle cx="60" cy="104" r="3" fill="url(#buttonGrad)" />
        <circle cx="60" cy="104" r="1.5" fill="#fef9c3" opacity="0.4" />
        <circle cx="60" cy="116" r="3" fill="url(#buttonGrad)" />
        <circle cx="60" cy="116" r="1.5" fill="#fef9c3" opacity="0.4" />
        <circle cx="60" cy="128" r="3" fill="url(#buttonGrad)" />
        <circle cx="60" cy="128" r="1.5" fill="#fef9c3" opacity="0.4" />

        {/* Medal ribbon */}
        <path d="M42 98 L48 98 L48 107 L45 104 L42 107 Z" fill="#dc2626" />
        <path d="M42 98 L45 98 L45 107 L42 107 Z" fill="#b91c1c" />
        {/* Medal */}
        <circle cx="45" cy="112" r="5" fill="url(#medalGrad)" />
        <circle cx="45" cy="112" r="3" fill="url(#goldGrad)" stroke="#a16207" strokeWidth="0.5" />
        {/* Medal star */}
        <polygon points="45,109.5 45.8,111.5 48,111.5 46.3,112.8 47,114.8 45,113.5 43,114.8 43.7,112.8 42,111.5 44.2,111.5" fill="#fef08a" />
      </g>

      {/* === NECK === */}
      <rect x="50" y="80" width="20" height="14" rx="6" fill="url(#skinGrad)" />

      {/* === HEAD === */}
      <g filter="url(#dropShadow)">
        {/* Head shape */}
        <ellipse cx="60" cy="58" rx="26" ry="28" fill="url(#skinGrad)" />
        {/* Jaw definition */}
        <ellipse cx="60" cy="68" rx="20" ry="14" fill="#E0B88A" opacity="0.3" />

        {/* Ears */}
        <ellipse cx="34" cy="58" rx="5" ry="7" fill="url(#skinGrad)" />
        <ellipse cx="34" cy="58" rx="3" ry="5" fill="#D4A574" opacity="0.5" />
        <ellipse cx="86" cy="58" rx="5" ry="7" fill="url(#skinGrad)" />
        <ellipse cx="86" cy="58" rx="3" ry="5" fill="#D4A574" opacity="0.5" />
      </g>

      {/* === HAT === */}
      <g filter="url(#dropShadow)">
        {/* Hat brim shadow on face */}
        <ellipse cx="60" cy="40" rx="32" ry="3" fill="#000" opacity="0.08" />

        {/* Hat brim */}
        <ellipse cx="60" cy="38" rx="34" ry="6" fill="url(#hatGrad)" filter="url(#brimShadow)" />
        <ellipse cx="60" cy="37" rx="32" ry="4" fill="#1a8a44" opacity="0.4" />

        {/* Hat body */}
        <path d="M34 38 L34 18 C34 14, 38 10, 44 10 L76 10 C82 10, 86 14, 86 18 L86 38 Z" fill="url(#hatGrad)" />
        {/* Hat body highlight */}
        <path d="M38 38 L38 20 C38 16, 42 13, 48 13 L60 13 L60 38 Z" fill="#1a8a44" opacity="0.3" />

        {/* Hat top crown */}
        <path d="M38 14 L38 8 C38 5, 42 3, 48 3 L72 3 C78 3, 82 5, 82 8 L82 14 Z" fill="url(#hatTopGrad)" />
        <path d="M40 12 L40 8 C40 6, 44 5, 50 5 L60 5 L60 12 Z" fill="#1a8a44" opacity="0.3" />

        {/* Hat band */}
        <rect x="34" y="32" width="52" height="6" fill="#14532d" />
        <rect x="34" y="32" width="52" height="2" fill="#1a6b35" opacity="0.5" />

        {/* Gold hat badge/star */}
        <circle cx="60" cy="22" r="9" fill="url(#medalGrad)" />
        <circle cx="60" cy="22" r="7.5" fill="url(#hatGrad)" />
        <polygon
          points="60,14.5 62.2,19.5 67.5,19.5 63.2,22.8 64.8,28 60,25 55.2,28 56.8,22.8 52.5,19.5 57.8,19.5"
          fill="url(#starGrad)"
        />
      </g>

      {/* === FACE DETAILS === */}
      {/* Eyebrows */}
      <path d="M42 49 Q48 44 54 49" stroke="#4a2c17" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M66 49 Q72 44 78 49" stroke="#4a2c17" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Eye whites */}
      <ellipse cx="49" cy="55" rx="6" ry="5.5" fill="white" />
      <ellipse cx="71" cy="55" rx="6" ry="5.5" fill="white" />

      {/* Iris */}
      <circle cx="50" cy="55.5" r="4" fill="url(#eyeGrad)" />
      <circle cx="72" cy="55.5" r="4" fill="url(#eyeGrad)" />

      {/* Pupil */}
      <circle cx="50.5" cy="55" r="2" fill="#000" />
      <circle cx="72.5" cy="55" r="2" fill="#000" />

      {/* Eye highlights */}
      <circle cx="52" cy="53.5" r="1.5" fill="white" />
      <circle cx="74" cy="53.5" r="1.5" fill="white" />
      <circle cx="49" cy="56.5" r="0.7" fill="white" opacity="0.6" />
      <circle cx="71" cy="56.5" r="0.7" fill="white" opacity="0.6" />

      {/* Eye lower lid line */}
      <path d="M44 58 Q49 60 55 58" stroke="#C9A072" strokeWidth="0.8" fill="none" />
      <path d="M65 58 Q71 60 77 58" stroke="#C9A072" strokeWidth="0.8" fill="none" />

      {/* Nose */}
      <path d="M58 60 Q60 64 62 60" stroke="#C9A072" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="57" cy="61" r="0.8" fill="#C9A072" opacity="0.5" />
      <circle cx="63" cy="61" r="0.8" fill="#C9A072" opacity="0.5" />

      {/* Mustache - thick and distinguished */}
      <path d="M44 67 Q48 63 52 66 Q56 69 60 65 Q64 69 68 66 Q72 63 76 67"
        stroke="#4a2c17" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M46 68 Q50 65 54 67 Q57 69 60 66.5 Q63 69 66 67 Q70 65 74 68"
        stroke="#5C3A1E" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Smile */}
      <path d="M52 72 Q60 77 68 72" stroke="#B8956A" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Cheek blush */}
      <ellipse cx="40" cy="63" rx="5" ry="3.5" fill="url(#blushGrad)" />
      <ellipse cx="80" cy="63" rx="5" ry="3.5" fill="url(#blushGrad)" />

      {/* Chin dimple */}
      <path d="M59 76 Q60 77.5 61 76" stroke="#C9A072" strokeWidth="0.7" fill="none" />
    </svg>
  );
}

export function GeneralMascot({ hints, revealedHints, onRevealHint, disabled }: GeneralMascotProps) {
  const [showBubble, setShowBubble] = useState(false);
  const nextHintIndex = revealedHints.length;
  const canRevealMore = nextHintIndex < hints.length;
  const hintsRemaining = hints.length - revealedHints.length;

  const handleRevealHint = () => {
    if (canRevealMore && !disabled) {
      onRevealHint(nextHintIndex);
    }
  };

  return (
    <div className="fixed right-2 sm:right-4 lg:right-6 bottom-16 sm:bottom-24 lg:bottom-28 z-40 flex flex-col items-end">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-primary-200 p-3 sm:p-4 max-w-[220px] sm:max-w-[280px] lg:max-w-[320px] mb-3 max-h-[50vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={() => setShowBubble(false)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-bold text-primary-700">
                Intel Report ({revealedHints.length}/{hints.length})
              </p>
            </div>

            {/* Revealed hints list */}
            {revealedHints.length > 0 && (
              <div className="space-y-2 mb-3">
                {[...revealedHints].sort((a, b) => a - b).map((hintIndex) => (
                  <motion.div
                    key={hintIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2 bg-primary-50 rounded-lg p-2"
                  >
                    <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">
                      {hintIndex + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-primary-800 leading-relaxed">{hints[hintIndex]}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {revealedHints.length === 0 && (
              <p className="text-xs text-primary-400 italic mb-3 text-center py-2">
                Ready for orders, sir! Click below for intel.
              </p>
            )}

            {/* Reveal button */}
            {canRevealMore && !disabled && (
              <motion.button
                onClick={handleRevealHint}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Gather Intel (-25 pts)
              </motion.button>
            )}

            {!canRevealMore && (
              <div className="text-center py-1">
                <p className="text-xs text-primary-500 font-medium">
                  All intel gathered, sir!
                </p>
              </div>
            )}

            {/* Speech bubble pointer */}
            <div className="absolute -bottom-2.5 right-6 sm:right-8 lg:right-10 w-4 h-4 bg-white/95 border-r-2 border-b-2 border-primary-200 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Character */}
      <motion.button
        onClick={() => setShowBubble(!showBubble)}
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={showBubble ? {} : { y: [0, -5, 0] }}
        transition={{
          y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        title={`${hintsRemaining} hints remaining – click for intel!`}
      >
        {/* Hint count badge */}
        {hintsRemaining > 0 && (
          <motion.span
            className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center z-10 shadow-lg border-2 border-white"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {hintsRemaining}
          </motion.span>
        )}

        {/* Ambient glow */}
        <motion.div
          className="absolute -inset-2 sm:-inset-3 rounded-full bg-primary-400/20 blur-lg"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Platform shadow */}
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 sm:w-14 lg:w-16 h-2 sm:h-3 bg-black/10 rounded-full blur-sm"
          animate={showBubble ? {} : { scaleX: [1, 0.85, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* The General — responsive sizing */}
        <div className="w-[60px] h-[80px] sm:w-[80px] sm:h-[107px] lg:w-[100px] lg:h-[133px]">
          <GeneralSVG />
        </div>
      </motion.button>
    </div>
  );
}
