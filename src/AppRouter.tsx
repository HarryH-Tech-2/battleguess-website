import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
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

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/modes" element={<GameModes />} />
        <Route path="/modes/:modeId" element={<GameModeDetail />} />
        <Route path="/battles" element={<BattleEncyclopedia />} />
        <Route path="/battles/:battleId" element={<BattleDetail />} />
        <Route path="/collections" element={<BattleCollections />} />
        <Route path="/collections/:slug" element={<BattleCollectionDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/topics/:topicId" element={<BlogTopic />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<App />} />
      </Routes>
    </Suspense>
  );
}
