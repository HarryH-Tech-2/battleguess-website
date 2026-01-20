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

        {/* Simple footer */}
        <footer className="py-4 text-center text-xs text-primary-400">
          <p>Images generated with AI. Built with React & Framer Motion.</p>
        </footer>
      </div>
    </div>
  );
}
