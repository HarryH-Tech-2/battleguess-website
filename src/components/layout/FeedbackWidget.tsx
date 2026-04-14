import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function FeedbackWidget() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    setFeedbackStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/mjgppvjg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: feedbackMessage,
        }),
      });
      if (res.ok) {
        setFeedbackStatus('sent');
        setFeedbackMessage('');
        setTimeout(() => { setShowFeedback(false); setFeedbackStatus('idle'); }, 2000);
      } else {
        setFeedbackStatus('error');
      }
    } catch {
      setFeedbackStatus('error');
    }
  };

  const closeModal = () => { setShowFeedback(false); setFeedbackStatus('idle'); };

  const modal = (
    <AnimatePresence>
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-primary-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{t('navbar.feedback')}</h2>
              <button onClick={closeModal} className="text-white/70 hover:text-white transition-colors" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <p className="text-sm text-gray-500">{t('navbar.feedbackDesc')}</p>
              <textarea
                value={feedbackMessage}
                onChange={e => setFeedbackMessage(e.target.value)}
                placeholder={t('navbar.feedbackPlaceholder')}
                className="w-full h-32 px-3 py-2 border border-primary-100 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={feedbackStatus === 'sending' || feedbackStatus === 'sent'}
              />
              {feedbackStatus === 'error' && (
                <p className="text-sm text-red-500">{t('navbar.feedbackError')}</p>
              )}
              {feedbackStatus === 'sent' ? (
                <p className="text-sm text-primary-700 font-medium">{t('navbar.feedbackSuccess')}</p>
              ) : (
                <button
                  type="submit"
                  disabled={feedbackStatus === 'sending' || !feedbackMessage.trim()}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium rounded-xl transition-colors shadow-md shadow-primary-200"
                >
                  {feedbackStatus === 'sending' ? t('navbar.feedbackSending') : t('navbar.feedbackSubmit')}
                </button>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setShowFeedback(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold pl-4 pr-5 py-3 rounded-full shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 border border-primary-400/40 transition-shadow duration-200"
        aria-label={t('navbar.feedback')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="text-sm sm:text-base">{t('navbar.feedback')}</span>
      </motion.button>

      {/* Portal the modal to document.body to escape backdrop-filter containing blocks */}
      {typeof document !== 'undefined' && createPortal(modal, document.body)}
    </>
  );
}
