import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ContentLayout } from '../components/layout/ContentLayout';
import { faqItems } from '../data/faqData';

type Category = 'all' | 'gameplay' | 'account' | 'technical' | 'content';

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'gameplay', label: 'Gameplay' },
  { value: 'account', label: 'Account' },
  { value: 'technical', label: 'Technical' },
  { value: 'content', label: 'Content' },
];

function FAQ() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return faqItems;
    return faqItems.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const toggleItem = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <ContentLayout
      title="FAQ | BattleGuess"
      description="Find answers to frequently asked questions about BattleGuess, the history trivia game where you identify battles from AI-generated images."
      canonical="https://battleguess.app/faq"
      jsonLd={jsonLd}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Everything you need to know about BattleGuess
        </p>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => {
              setActiveCategory(cat.value);
              setOpenIndex(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.value
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* FAQ List */}
      <div className="space-y-3 max-w-3xl mx-auto">
        {filteredItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={`${activeCategory}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-800 pr-4">
                  {item.question}
                </span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                    isOpen
                      ? 'bg-amber-500 text-white rotate-45'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 text-center"
      >
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-8 border border-amber-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Still have questions?
          </h2>
          <p className="text-slate-600 mb-5">
            Start playing and discover the answers!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-200 transition-all duration-200"
          >
            Play BattleGuess
          </Link>
        </div>
      </motion.div>
    </ContentLayout>
  );
}

export default FAQ;
