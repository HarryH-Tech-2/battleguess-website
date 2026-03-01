import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { allBattles } from '../../data/battles/index';
import { battleFacts } from '../../data/battleFacts';
import { LocaleLink } from '../ui/LocaleLink';

const TEASER_COUNT = 20;
const TEASER_IDS = [10, 32, 127, 31, 9, 185, 137, 193, 41, 188, 11, 163, 91, 4, 125, 17, 6, 170, 24, 95];

export function Footer() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [scanLinePos, setScanLinePos] = useState(0);
  const animFrameRef = useRef<number>(0);
  const { t } = useTranslation();

  // Rotate facts
  useEffect(() => {
    const startIndex = Math.floor(Math.random() * TEASER_COUNT);
    setCurrentFactIndex(startIndex);

    const interval = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % TEASER_COUNT);
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
                &ldquo;{t(`footerTeasers.${currentFactIndex}`)}&rdquo;
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

        {/* Explore links */}
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

        {/* Footer Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/40 font-medium mb-2">{t('footer.explore')}</div>
            <div className="space-y-1">
              <LocaleLink to="/battles" className="block text-sm text-white/70 hover:text-white transition-colors">{t('nav.battles')}</LocaleLink>
              <LocaleLink to="/collections" className="block text-sm text-white/70 hover:text-white transition-colors">{t('nav.collections')}</LocaleLink>
              <LocaleLink to="/modes" className="block text-sm text-white/70 hover:text-white transition-colors">{t('nav.gameModes')}</LocaleLink>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-white/40 font-medium mb-2">{t('footer.learn')}</div>
            <div className="space-y-1">
              <LocaleLink to="/blog/topics/ancient-warfare" className="block text-sm text-white/70 hover:text-white transition-colors">{t('footer.ancientWarfare')}</LocaleLink>
              <LocaleLink to="/blog/topics/wars-and-conflicts" className="block text-sm text-white/70 hover:text-white transition-colors">{t('footer.warsConflicts')}</LocaleLink>
              <LocaleLink to="/blog/topics/military-strategy" className="block text-sm text-white/70 hover:text-white transition-colors">{t('footer.strategyTactics')}</LocaleLink>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-white/40 font-medium mb-2">{t('footer.read')}</div>
            <div className="space-y-1">
              <LocaleLink to="/blog/topics/military-technology" className="block text-sm text-white/70 hover:text-white transition-colors">{t('footer.militaryTechnology')}</LocaleLink>
              <LocaleLink to="/blog/topics/game-guides" className="block text-sm text-white/70 hover:text-white transition-colors">{t('footer.gameGuides')}</LocaleLink>
              <LocaleLink to="/blog" className="block text-sm text-white/70 hover:text-white transition-colors">{t('footer.allArticles')}</LocaleLink>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-white/40 font-medium mb-2">{t('footer.info')}</div>
            <div className="space-y-1">
              <LocaleLink to="/about" className="block text-sm text-white/70 hover:text-white transition-colors">{t('nav.about')}</LocaleLink>
              <LocaleLink to="/faq" className="block text-sm text-white/70 hover:text-white transition-colors">{t('nav.faq')}</LocaleLink>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
