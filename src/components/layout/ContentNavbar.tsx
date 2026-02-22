import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function ContentNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navLinks = [
    { to: '/modes', label: t('nav.gameModes') },
    { to: '/battles', label: t('nav.battles') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/faq', label: t('nav.faq') },
    { to: '/about', label: t('nav.about') },
  ];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary-100/50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-gradient">BattleGuess</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname.startsWith(link.to)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200"
            title={t('nav.language')}
          >
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </button>
          <Link
            to="/"
            className="ml-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            {t('nav.playNow')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden" ref={menuRef}>
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200"
          >
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </button>
          <Link
            to="/"
            className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
          >
            {t('nav.play')}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute top-full right-4 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 overflow-hidden"
              >
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                      location.pathname.startsWith(link.to)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
