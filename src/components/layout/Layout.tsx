import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { ParticleBackground, FloatingOrbs } from '../effects/ParticleBackground';

interface LayoutProps {
  children: ReactNode;
  buyMeACoffeeUrl?: string;
}

export function Layout({ children, buyMeACoffeeUrl }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100" />
      <FloatingOrbs />
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar buyMeACoffeeUrl={buyMeACoffeeUrl} />

        <main className="flex-1 container mx-auto px-4 max-w-2xl py-6">
          {children}
        </main>

        {/* Footer with vibrant gradient background */}
        <footer className="relative mt-auto overflow-hidden">
          {/* Main gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-600 via-primary-500/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-700/40 via-amber-500/30 to-primary-700/40" />

          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />

          {/* Top border glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" />

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-700 via-amber-500 to-primary-700" />

          <div className="relative py-10" />
        </footer>
      </div>
    </div>
  );
}
