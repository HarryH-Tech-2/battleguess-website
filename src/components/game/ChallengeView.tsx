import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Confetti } from '../effects/Confetti';
import type { Challenge, ChallengeAttempt } from '../../services/firebase';

interface ChallengeInviteProps {
  challenge: Challenge;
  onAccept: () => void;
  onDecline: () => void;
  isLoading: boolean;
}

export function ChallengeInvite({ challenge, onAccept, onDecline, isLoading }: ChallengeInviteProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
        <p className="mt-3 text-gray-500 text-sm">Loading challenge...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-5"
    >
      {/* Crossed swords icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </motion.div>

      <div>
        <h2 className="text-2xl font-bold text-primary-800">Challenge!</h2>
        <p className="text-gray-600 mt-1">
          <span className="font-semibold text-primary-600">{challenge.creatorName}</span> challenges you!
        </p>
      </div>

      <div className="bg-primary-50 rounded-xl p-4 space-y-2">
        <div className="flex justify-center gap-6">
          <div>
            <p className="text-2xl font-bold text-primary-600">{challenge.creatorScore}</p>
            <p className="text-xs text-gray-500">Their Score</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-600">{challenge.creatorCorrect}/{challenge.battleIds.length}</p>
            <p className="text-xs text-gray-500">Their Correct</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">{challenge.battleIds.length} battles to guess</p>
      </div>

      <p className="text-sm text-gray-500">Can you beat their score?</p>

      <div className="flex gap-3">
        <Button variant="primary" size="lg" onClick={onAccept} className="flex-1">
          Accept Challenge
        </Button>
        <Button variant="secondary" size="lg" onClick={onDecline}>
          Decline
        </Button>
      </div>
    </motion.div>
  );
}

// Challenge progress during gameplay
interface ChallengeProgressProps {
  creatorName: string;
  creatorScore: number;
  current: number;
  total: number;
  playerScore: number;
}

export function ChallengeProgress({ creatorName, creatorScore, current, total, playerScore }: ChallengeProgressProps) {
  const ahead = playerScore >= creatorScore;
  return (
    <div className="flex items-center justify-between bg-purple-50 rounded-lg px-3 py-2 border border-purple-200">
      <div className="flex items-center gap-2">
        <span className="text-purple-500 font-bold text-xs">VS {creatorName.split(' ')[0]}</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < current ? 'bg-purple-400' : i === current ? 'bg-purple-300 animate-pulse' : 'bg-purple-100'
              }`}
            />
          ))}
        </div>
      </div>
      <span className={`text-sm font-medium ${ahead ? 'text-green-600' : 'text-red-500'}`}>
        {playerScore} / {creatorScore}
      </span>
    </div>
  );
}

// Challenge Result
interface ChallengeResultProps {
  challenge: Challenge;
  playerScore: number;
  playerCorrect: number;
  attempts: ChallengeAttempt[];
  onCreateNew: () => void;
  onBack: () => void;
}

export function ChallengeResult({ challenge, playerScore, playerCorrect, attempts, onCreateNew, onBack }: ChallengeResultProps) {
  const won = playerScore > challenge.creatorScore;
  const tied = playerScore === challenge.creatorScore;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-5"
    >
      {won && <Confetti variant="celebration" count={40} />}

      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            won ? 'bg-green-100' : tied ? 'bg-yellow-100' : 'bg-red-100'
          }`}
        >
          <span className="text-3xl">{won ? '🏆' : tied ? '🤝' : '😤'}</span>
        </motion.div>
        <h2 className={`text-2xl font-bold mt-3 ${
          won ? 'text-green-600' : tied ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {won ? 'You Win!' : tied ? "It's a Tie!" : 'They Win!'}
        </h2>
      </div>

      {/* Score comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-md border border-primary-100 text-center">
          <p className="text-xs text-gray-400 mb-1">You</p>
          <p className="text-2xl font-bold text-primary-600">{playerScore}</p>
          <p className="text-xs text-gray-500">{playerCorrect}/{challenge.battleIds.length} correct</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-md border border-gray-200 text-center">
          <p className="text-xs text-gray-400 mb-1">{challenge.creatorName}</p>
          <p className="text-2xl font-bold text-gray-600">{challenge.creatorScore}</p>
          <p className="text-xs text-gray-500">{challenge.creatorCorrect}/{challenge.battleIds.length} correct</p>
        </div>
      </div>

      {/* Other attempts */}
      {attempts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-xs text-gray-500 uppercase">All Challengers</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-40 overflow-y-auto">
            {attempts.map((attempt, i) => (
              <div key={attempt.playerId} className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">{i + 1}</span>
                  <span className="text-sm text-gray-700">{attempt.playerName}</span>
                </div>
                <span className="font-semibold text-sm text-primary-600">{attempt.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="primary" size="lg" onClick={onCreateNew} className="flex-1">
          Create Your Challenge
        </Button>
        <Button variant="secondary" size="lg" onClick={onBack}>
          Back
        </Button>
      </div>
    </motion.div>
  );
}

// Challenge Share Link screen (shown after creator finishes playing)
interface ChallengeShareProps {
  url: string;
  score: number;
  correctGuesses: number;
  totalBattles: number;
  onDone: () => void;
}

export function ChallengeShare({ url, score, correctGuesses, totalBattles, onDone }: ChallengeShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BattleGuess Challenge',
          text: `I scored ${score} points on BattleGuess! Can you beat me?`,
          url,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-5"
    >
      <Confetti variant="celebration" count={30} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <span className="text-3xl">🔗</span>
      </motion.div>

      <div>
        <h2 className="text-2xl font-bold text-primary-800">Challenge Created!</h2>
        <p className="text-gray-600 text-sm mt-2">
          You scored <span className="font-bold text-primary-600">{score}</span> points ({correctGuesses}/{totalBattles} correct)
        </p>
      </div>

      <p className="text-sm text-gray-500">Share this link with a friend to challenge them:</p>

      {/* Link box */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={url}
          className="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"
          onClick={e => (e.target as HTMLInputElement).select()}
        />
        <button
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            copied
              ? 'bg-green-100 text-green-700'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="flex gap-3">
        <Button variant="primary" size="lg" onClick={handleShare} className="flex-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Challenge
        </Button>
        <Button variant="secondary" size="lg" onClick={onDone}>
          Done
        </Button>
      </div>
    </motion.div>
  );
}
