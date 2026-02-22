import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';

const steps = [
  {
    number: 1,
    title: 'Choose Your Settings',
    description: 'Select your preferred era, difficulty level, and game mode. Whether you want a quick daily challenge or a full campaign, there is a mode for you.',
  },
  {
    number: 2,
    title: 'Study the Battle Image',
    description: 'Examine the AI-generated artwork depicting a famous historical battle. Look for visual clues like armor, weapons, terrain, and formations.',
  },
  {
    number: 3,
    title: 'Use Hints If Needed',
    description: 'Stuck? Reveal up to three progressive hints to help narrow down the battle. Each hint costs points, so use them wisely.',
  },
  {
    number: 4,
    title: 'Submit Your Guess',
    description: 'Type the name of the battle and submit your answer. Correct answers earn points based on difficulty, hints used, and your current streak.',
  },
  {
    number: 5,
    title: 'Climb the Leaderboard',
    description: 'Build your streak, earn achievements, and compete on the global leaderboard. Share your results with friends and challenge them to beat your score.',
  },
];

const features = [
  {
    icon: '🎨',
    title: 'AI-Generated Artwork',
    description: 'Every battle is brought to life with unique, atmospheric AI-generated images crafted to capture the essence of each historical engagement.',
  },
  {
    icon: '🎮',
    title: '8 Game Modes',
    description: 'From Classic guessing to Timeline sorting, Timed challenges, Campaigns, and Daily challenges, there is always a new way to play.',
  },
  {
    icon: '⚔️',
    title: '200+ Battles',
    description: 'Explore over 200 historically accurate battles spanning thousands of years of military history, from ancient chariot warfare to modern combat.',
  },
  {
    icon: '🏛️',
    title: '8 Historical Eras',
    description: 'Journey through Ancient Egypt, Greece & Rome, Medieval Europe, the Ottoman Empire, East Asia, the Colonial era, American Wars, and the World Wars.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Play BattleGuess',
  description: 'Learn how to play BattleGuess, the history trivia game where you identify famous battles from AI-generated images.',
  step: steps.map(step => ({
    '@type': 'HowToStep',
    position: step.number,
    name: step.title,
    text: step.description,
  })),
};

function About() {
  const { t } = useTranslation();

  return (
    <ContentLayout
      title="About BattleGuess | How to Play"
      description="Learn how to play BattleGuess and discover what makes it the ultimate history trivia game. 200+ battles, 8 eras, 8 game modes, and AI-generated artwork."
      canonical="https://battleguess.app/about"
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
              key={feature.title}
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
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-200 transition-all duration-200"
          >
            {t('nav.playNow')}
          </Link>
        </div>
      </motion.div>
    </ContentLayout>
  );
}

export default About;
