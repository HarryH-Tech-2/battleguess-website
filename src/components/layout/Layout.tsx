import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FeedbackWidget } from './FeedbackWidget';

const ParticleBackground = lazy(() =>
  import('../effects/ParticleBackground').then(m => ({ default: m.ParticleBackground }))
);
const FloatingOrbs = lazy(() =>
  import('../effects/ParticleBackground').then(m => ({ default: m.FloatingOrbs }))
);

interface LayoutProps {
  children: ReactNode;
  buyMeACoffeeUrl?: string;
  dailyStreak?: number;
  onOpenStats?: () => void;
  onOpenAchievements?: () => void;
  achievementCount?: { unlocked: number; total: number };
  onLogoClick?: () => void;
}

export function Layout({ children, buyMeACoffeeUrl, dailyStreak, onOpenStats, onOpenAchievements, achievementCount, onLogoClick }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background effects - lazy loaded */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-slate-50 to-green-100" />
      <Suspense fallback={null}>
        <FloatingOrbs />
        <ParticleBackground />
      </Suspense>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar buyMeACoffeeUrl={buyMeACoffeeUrl} dailyStreak={dailyStreak} onOpenStats={onOpenStats} onOpenAchievements={onOpenAchievements} achievementCount={achievementCount} onLogoClick={onLogoClick} />

        <main className="flex-1 container mx-auto px-3 sm:px-4 lg:px-8 max-w-3xl lg:max-w-4xl xl:max-w-5xl py-4 sm:py-6">
          {children}
        </main>

        {/* Footer with military gradient background */}
        <footer className="relative mt-auto overflow-hidden">
          {/* Main gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-800 via-emerald-700/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 via-emerald-600/30 to-green-900/40" />

          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/15 to-transparent" />

          {/* Top border glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-900 via-emerald-500 to-green-900" />

          <div className="relative">
            <Footer />
          </div>
        </footer>
      </div>

      {/* Floating feedback button + modal, portaled to body */}
      <FeedbackWidget />
    </div>
  );
}
