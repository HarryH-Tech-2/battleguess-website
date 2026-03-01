import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isSupportedLanguage } from './i18n';
import App from './App';

const FAQ = lazy(() => import('./pages/FAQ'));
const About = lazy(() => import('./pages/About'));
const GameModes = lazy(() => import('./pages/GameModes'));
const GameModeDetail = lazy(() => import('./pages/GameModeDetail'));
const BattleEncyclopedia = lazy(() => import('./pages/BattleEncyclopedia'));
const BattleDetail = lazy(() => import('./pages/BattleDetail'));
const BattleCollections = lazy(() => import('./pages/BattleCollections'));
const BattleCollectionDetail = lazy(() => import('./pages/BattleCollectionDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const BlogTopic = lazy(() => import('./pages/BlogTopic'));
const Stats = lazy(() => import('./pages/Stats'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-green-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <span className="text-primary-600 font-medium">Loading...</span>
      </div>
    </div>
  );
}

function LanguageLayout() {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();
  const targetLang = lang && isSupportedLanguage(lang) ? lang : 'en';

  // Sync language from URL (handles back/forward navigation and direct URL access)
  useEffect(() => {
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
  }, [targetLang, i18n]);

  return <Outlet />;
}

const contentRoutes = (
  <>
    <Route index element={<App />} />
    <Route path="faq" element={<FAQ />} />
    <Route path="about" element={<About />} />
    <Route path="modes" element={<GameModes />} />
    <Route path="modes/:modeId" element={<GameModeDetail />} />
    <Route path="battles" element={<BattleEncyclopedia />} />
    <Route path="battles/:battleId" element={<BattleDetail />} />
    <Route path="collections" element={<BattleCollections />} />
    <Route path="collections/:slug" element={<BattleCollectionDetail />} />
    <Route path="blog" element={<Blog />} />
    <Route path="blog/topics/:topicId" element={<BlogTopic />} />
    <Route path="blog/:slug" element={<BlogPost />} />
    <Route path="stats" element={<Stats />} />
    <Route path="*" element={<App />} />
  </>
);

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* English (default, no prefix) */}
        <Route element={<LanguageLayout />}>
          {contentRoutes}
        </Route>

        {/* Language-prefixed routes (fr, es) */}
        <Route path=":lang" element={<LanguageLayout />}>
          {contentRoutes}
        </Route>
      </Routes>
    </Suspense>
  );
}
