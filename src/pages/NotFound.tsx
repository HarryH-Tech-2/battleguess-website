import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { LocaleLink } from '../components/ui/LocaleLink';

function NotFound() {
  const { t } = useTranslation();

  return (
    <ContentLayout
      title="Page Not Found | BattleGuess"
      description="The page you were looking for doesn't exist. Head back to BattleGuess and keep exploring the history of warfare."
      canonical="https://battleguess.app/404"
      robots="noindex, follow"
    >
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
          404 — Page Not Found
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8">
          The page you were looking for doesn't exist or has been moved.
          Try one of the links below or head back to the homepage.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <LocaleLink
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all"
          >
            {t('nav.playNow', 'Play now')}
          </LocaleLink>
          <LocaleLink
            to="/battles"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-primary-300 text-slate-700 font-semibold px-5 py-3 rounded-xl shadow-sm transition-all"
          >
            Battle Encyclopedia
          </LocaleLink>
          <LocaleLink
            to="/blog"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-primary-300 text-slate-700 font-semibold px-5 py-3 rounded-xl shadow-sm transition-all"
          >
            Blog
          </LocaleLink>
        </div>
      </div>
    </ContentLayout>
  );
}

export default NotFound;
