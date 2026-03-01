import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { LocaleLink } from '../components/ui/LocaleLink';

function About() {
  const { t } = useTranslation();

  const steps = [
    { number: 1, title: t('pages.about.step1Title'), description: t('pages.about.step1Desc') },
    { number: 2, title: t('pages.about.step2Title'), description: t('pages.about.step2Desc') },
    { number: 3, title: t('pages.about.step3Title'), description: t('pages.about.step3Desc') },
    { number: 4, title: t('pages.about.step4Title'), description: t('pages.about.step4Desc') },
    { number: 5, title: t('pages.about.step5Title'), description: t('pages.about.step5Desc') },
  ];

  const features = [
    { icon: '\uD83C\uDFA8', title: t('pages.about.features.aiImages'), description: t('pages.about.featureAiDesc') },
    { icon: '\uD83C\uDFAE', title: t('pages.about.features.gameModes'), description: t('pages.about.featureModesDesc') },
    { icon: '\u2694\uFE0F', title: t('pages.about.features.battles'), description: t('pages.about.featureBattlesDesc') },
    { icon: '\uD83C\uDFDB\uFE0F', title: t('pages.about.features.eras'), description: t('pages.about.featureErasDesc') },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('pages.about.howToPlay'),
    description: t('pages.about.description'),
    step: steps.map(step => ({
      '@type': 'HowToStep',
      position: step.number,
      name: step.title,
      text: step.description,
    })),
  };

  return (
    <ContentLayout
      title="About BattleGuess | How to Play"
      description="Learn how to play BattleGuess and discover what makes it the ultimate history trivia game. 200+ battles, 8 eras, 8 game modes, and AI-generated artwork."
      canonical="https://battleguess.app/about"
      path="/about"
      jsonLd={jsonLd}
    >
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
          {t('pages.about.title')}
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
          {t('pages.about.description')}
        </p>
      </motion.div>

      {/* How to Play */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
          {t('pages.about.howToPlay')}
        </h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow-md shadow-primary-200">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg mb-1">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* What Makes BattleGuess Special */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
          {t('pages.about.whatMakesSpecial')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + index * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-slate-800 text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <div className="bg-gradient-to-br from-primary-50 to-emerald-100/50 rounded-2xl p-8 border border-primary-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {t('pages.about.cta')}
          </h2>
          <p className="text-slate-600 mb-5">
            {t('pages.about.ctaSubtitle')}
          </p>
          <LocaleLink
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-200 transition-all duration-200"
          >
            {t('nav.playNow')}
          </LocaleLink>
        </div>
      </motion.div>
    </ContentLayout>
  );
}

export default About;
