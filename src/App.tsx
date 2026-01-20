import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { DonationPopup } from './components/ui/DonationPopup';
import { BattleImage } from './components/game/BattleImage';
import { GuessInput } from './components/game/GuessInput';
import { HintDisplay } from './components/game/HintDisplay';
import { ResultFeedback } from './components/game/ResultFeedback';
import { ScoreDisplay } from './components/game/ScoreDisplay';
import { useGame } from './hooks/useGame';
import { useImageGeneration } from './hooks/useImageGeneration';
import { calculateScore } from './utils/scoring';
import './index.css';

// Update this with your actual Buy Me a Coffee URL
const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/harryhh";

function App() {
  const { state, actions } = useGame();
  const { getImageForBattle } = useImageGeneration();
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const hasShownPopup = useRef(false);

  // Load image when a new battle starts
  useEffect(() => {
    if (state.currentBattle && state.gameStatus === 'playing' && !state.imageUrl) {
      const imageUrl = getImageForBattle(state.currentBattle.id);
      actions.setImage(imageUrl);
    }
  }, [state.currentBattle, state.gameStatus, state.imageUrl, actions, getImageForBattle]);

  // Show donation popup after 5 completed questions (only once per session)
  useEffect(() => {
    if (state.totalGuesses === 5 && !hasShownPopup.current) {
      hasShownPopup.current = true;
      // Small delay to let the result screen show first
      const timer = setTimeout(() => {
        setShowDonationPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.totalGuesses]);

  const handleStartGame = () => {
    actions.startGame();
  };

  const handleNextBattle = () => {
    actions.nextBattle();
  };

  const isPlaying = state.gameStatus === 'playing';
  const isResult = state.gameStatus === 'won' || state.gameStatus === 'lost';

  return (
    <Layout buyMeACoffeeUrl={BUY_ME_A_COFFEE_URL}>
      <div className="space-y-6 pb-8">
        {/* Score Display - Always visible after game starts */}
        {(state.score > 0 || state.streak > 0 || state.bestStreak > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ScoreDisplay
              score={state.score}
              streak={state.streak}
              bestStreak={state.bestStreak}
            />
          </motion.div>
        )}

        {/* Main Game Card */}
        <Card variant="elevated" glow={isPlaying}>
          <AnimatePresence mode="wait">
            {/* Idle State - Welcome Screen */}
            {state.gameStatus === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <BattleImage imageUrl={null} isLoading={false} />

                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-primary-800">
                    Welcome to BattleGuess!
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    You'll be shown an AI-generated image of a famous historical battle.
                    Try to guess which battle it depicts!
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleStartGame}
                    className="w-full sm:w-auto px-12"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Game
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {state.gameStatus === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <BattleImage imageUrl={null} isLoading={true} />
                <p className="mt-4 text-primary-600">Preparing your battle...</p>
              </motion.div>
            )}

            {/* Playing State */}
            {isPlaying && state.currentBattle && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Battle Image */}
                <BattleImage
                  imageUrl={state.imageUrl}
                  isLoading={state.isImageLoading}
                  battleName={state.currentBattle.name}
                  battleYear={state.currentBattle.year}
                />

                {/* Difficulty Badge */}
                <div className="flex items-center justify-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    state.currentBattle.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    state.currentBattle.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {state.currentBattle.difficulty.charAt(0).toUpperCase() + state.currentBattle.difficulty.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    • Potential: {calculateScore(0, state.currentBattle.difficulty, state.streak)} pts
                  </span>
                </div>

                {/* Guess Input */}
                <GuessInput
                  onSubmit={actions.submitGuess}
                  disabled={!state.imageUrl}
                  onGiveUp={actions.giveUp}
                />

                {/* Hints */}
                <HintDisplay
                  hints={state.currentBattle.hints}
                  revealedHints={state.revealedHints}
                  onRevealHint={actions.revealHint}
                  disabled={!state.imageUrl}
                />
              </motion.div>
            )}

            {/* Result State */}
            {isResult && state.currentBattle && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Show the battle image */}
                <div className="mb-6">
                  <BattleImage
                    imageUrl={state.imageUrl}
                    isLoading={false}
                    battleName={state.currentBattle.name}
                    battleYear={state.currentBattle.year}
                  />
                </div>

                <ResultFeedback
                  isWin={state.gameStatus === 'won'}
                  battle={state.currentBattle}
                  score={calculateScore(state.hintsUsed, state.currentBattle.difficulty, state.streak - 1)}
                  hintsUsed={state.hintsUsed}
                  streak={state.streak}
                  onNextBattle={handleNextBattle}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Game Stats (when playing) */}
        {(isPlaying || isResult) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-primary-400"
          >
            {state.correctGuesses} correct out of {state.totalGuesses} battles
          </motion.div>
        )}
      </div>

      {/* Donation Popup */}
      <DonationPopup
        isOpen={showDonationPopup}
        onClose={() => setShowDonationPopup(false)}
        buyMeACoffeeUrl={BUY_ME_A_COFFEE_URL}
      />
    </Layout>
  );
}

export default App;
