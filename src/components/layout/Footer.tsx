import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { allBattles } from '../../data/battles/index';
import { battleFacts } from '../../data/battleFacts';

// Curated short quotes from battle facts (under 15 words each, paraphrased as teasers)
const footerTeasers = [
  { text: 'Did you know? The marathon race is based on a legendary run from Marathon to Athens.', id: 10 },
  { text: 'The word "Armageddon" comes from the ancient battlefield of Megiddo.', id: 32 },
  { text: 'Kamikaze means "divine wind" — named after typhoons that sank Mongol fleets.', id: 127 },
  { text: 'The first peace treaty in history was signed after the Battle of Kadesh.', id: 31 },
  { text: 'Tanks were first deployed at the Battle of the Somme in 1916.', id: 9 },
  { text: 'Paris taxi drivers ferried troops to the Battle of the Marne in 1914.', id: 185 },
  { text: 'Sun Tzu may have personally advised the army at the Battle of Boju.', id: 137 },
  { text: 'The Coral Sea was the first naval battle where ships never saw each other.', id: 193 },
  { text: 'Alexander the Great built a causeway to Tyre that turned an island into a peninsula.', id: 41 },
  { text: 'The word "Caporetto" became Italian slang for a catastrophic defeat.', id: 188 },
  { text: 'At Midway, five crucial minutes changed the entire course of the Pacific War.', id: 11 },
  { text: 'A lost cigar wrapper revealed Lee\'s battle plans before Antietam.', id: 163 },
  { text: 'Joan of Arc pulled an arrow from her own shoulder and kept fighting at Orleans.', id: 91 },
  { text: 'The Bayeux Tapestry depicting Hastings is actually an embroidery, not a tapestry.', id: 4 },
  { text: 'Admiral Yi\'s 13 ships destroyed 31 Japanese warships at Myeongnyang.', id: 125 },
  { text: 'Don Quixote\'s author Cervantes fought at the Battle of Lepanto.', id: 17 },
  { text: 'Eisenhower carried a failure letter in his wallet on D-Day, just in case.', id: 6 },
  { text: 'Washington\'s troops crossed the Delaware on Christmas night 1776.', id: 170 },
  { text: 'General McAuliffe\'s reply to the German surrender demand at Bastogne: "NUTS!"', id: 24 },
  { text: 'Khalid ibn al-Walid never lost a single battle in his entire career.', id: 95 },
];

export function Footer() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [scanLinePos, setScanLinePos] = useState(0);
  const animFrameRef = useRef<number>(0);
  const { t } = useTranslation();

  // Rotate facts
  useEffect(() => {
    const startIndex = Math.floor(Math.random() * footerTeasers.length);
    setCurrentFactIndex(startIndex);

    const interval = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % footerTeasers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Radar scan line animation
  useEffect(() => {
    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      setScanLinePos((elapsed * 0.02) % 100);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const totalBattles = allBattles.length;
  const totalFacts = Object.keys(battleFacts).length;
  const eras = 8;
  const currentFact = footerTeasers[currentFactIndex];

  return (
    <div className="relative py-8 px-4">
      {/* Radar scan line */}
      <div
        className="absolute top-0 h-full w-px opacity-30 pointer-events-none"
        style={{
          left: `${scanLinePos}%`,
          background: 'linear-gradient(to bottom, transparent, #22c55e, transparent)',
          boxShadow: '0 0 8px #22c55e, 0 0 20px #22c55e40',
        }}
      />

      <div className="max-w-4xl mx-auto space-y-5">
        {/* Battle intel ticker */}
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3 justify-center">
            {/* Blinking dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-lg sm:text-xl font-mono font-bold uppercase tracking-[0.2em] text-white drop-shadow-md">
              {t('footer.battleIntelFeed')}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentFactIndex}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.5 }}
              className="relative text-center"
            >
              <p className="text-xl sm:text-2xl text-white leading-relaxed italic drop-shadow-md">
                &ldquo;{currentFact.text}&rdquo;
              </p>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Divider with crosshairs */}
        <div className="flex items-center gap-3 opacity-50">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/60" />
          <svg className="w-3.5 h-3.5 text-white/70" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6" cy="6" r="4" />
            <line x1="6" y1="0" x2="6" y2="3" />
            <line x1="6" y1="9" x2="6" y2="12" />
            <line x1="0" y1="6" x2="3" y2="6" />
            <line x1="9" y1="6" x2="12" y2="6" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/60" />
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="text-xl font-bold font-mono text-white drop-shadow-sm">{totalBattles}</div>
            <div className="text-xs uppercase tracking-widest text-white/60 font-medium">{t('footer.battles')}</div>
          </motion.div>

          <div className="w-px h-8 bg-white/20" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <div className="text-xl font-bold font-mono text-white drop-shadow-sm">{eras}</div>
            <div className="text-xs uppercase tracking-widest text-white/60 font-medium">{t('footer.eras')}</div>
          </motion.div>

          <div className="w-px h-8 bg-white/20" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="text-xl font-bold font-mono text-white drop-shadow-sm">{totalFacts}</div>
            <div className="text-xs uppercase tracking-widest text-white/60 font-medium">{t('footer.facts')}</div>
          </motion.div>

          <div className="w-px h-8 bg-white/20" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <div className="text-xl font-bold font-mono text-white drop-shadow-sm">5000+</div>
            <div className="text-xs uppercase tracking-widest text-white/60 font-medium">{t('footer.years')}</div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
