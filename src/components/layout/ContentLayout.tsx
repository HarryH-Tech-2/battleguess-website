import type { ReactNode } from 'react';
import { ContentNavbar } from './ContentNavbar';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';

interface ContentLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  canonical: string;
  jsonLd?: object;
}

export function ContentLayout({ children, title, description, canonical, jsonLd }: ContentLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <SEOHead title={title} description={description} canonical={canonical} jsonLd={jsonLd} />

      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-slate-50 to-green-100 -z-10" />

      <ContentNavbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
        {children}
      </main>

      <footer className="relative mt-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-800 via-emerald-700/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 via-emerald-600/30 to-green-900/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/15 to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-900 via-emerald-500 to-green-900" />
        <div className="relative">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
