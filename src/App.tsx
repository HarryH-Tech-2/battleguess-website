import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { DonationPopup } from './components/ui/DonationPopup';
import { BattleImage } from './components/game/BattleImage';
import { GuessInput } from './components/game/GuessInput';
import { ReverseGuessInput } from './components/game/ReverseGuessInput';
import { ReversePrompt } from './components/game/ReversePrompt';
import { HintDisplay } from './components/game/HintDisplay';
import { ResultFeedback } from './components/game/ResultFeedback';
import { ScoreDisplay } from './components/game/ScoreDisplay';
import { MusicTrackSelector } from './components/game/MusicTrackSelector';
import { CivilizationSelector } from './components/game/CivilizationSelector';
import { DifficultySelector } from './components/game/DifficultySelector';
import { ModeSelector } from './components/game/ModeSelector';
import { TimerDisplay } from './components/game/TimerDisplay';
import { TimelineBoard } from './components/game/TimelineBoard';
import { TimelineResult } from './components/game/TimelineResult';
import { CampaignSelector } from './components/game/CampaignSelector';
import { CampaignNarrative } from './components/game/CampaignNarrative';
import { CampaignComplete } from './components/game/CampaignComplete';
import { GameComplete } from './components/game/GameComplete';
import { DailyChallengeIntro, DailyProgress, DailyResult } from './components/game/DailyChallenge';
import { ChallengeInvite, ChallengeProgress, ChallengeResult, ChallengeShare } from './components/game/ChallengeView';
import { Leaderboard } from './components/game/Leaderboard';
import { PlayerNameInput } from './components/game/PlayerNameInput';
import { StatsPanel } from './components/stats/StatsPanel';
import { AchievementPopup } from './components/achievements/AchievementPopup';
import { AchievementsList } from './components/achievements/AchievementsList';
import { useGame } from './hooks/useGame';
import { useImageGeneration } from './hooks/useImageGeneration';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { useSoundEffects } from './hooks/useSoundEffects';
import { useStats } from './hooks/useStats';
import { useDailyStreak } from './hooks/useDailyStreak';
import { useTimer } from './hooks/useTimer';
import { useTimelineGame } from './hooks/useTimelineGame';
import { useCampaignGame } from './hooks/useCampaignGame';
import { useAchievements } from './hooks/useAchievements';
import { useDailyChallenge } from './hooks/useDailyChallenge';
import { useChallengeMode } from './hooks/useChallengeMode';
import { getDailyBattleIds, getDailyDateKey, getPlayerName } from './services/firebase';
import { calculateScore, calculateTimedBonus, getTimerDuration } from './utils/scoring';
import { AchievementProgress } from './components/game/AchievementProgress';
import './index.css';

// Update this with your actual Buy Me a Coffee URL
const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/harryhh";

function App() {
  const { state, actions, totalBattlesInPool, battlesPlayed } = useGame();
  const { getImageForBattle } = useImageGeneration();
  const { isMuted, toggleMute, currentTrackId, changeTrack, tracks } = useBackgroundMusic('/drum-tune.mp3');
  const { play: playSound } = useSoundEffects(isMuted);
  const { recordResult, total, accuracy, avgHints, byCivilization, byDifficulty } = useStats();
  const { currentStreak: dailyStreak, recordPlay } = useDailyStreak();
  const timeline = useTimelineGame();
  const campaign = useCampaignGame();
  const achievementsSystem = useAchievements();
  const daily = useDailyChallenge();
  const challenge = useChallengeMode();
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [timedBonus, setTimedBonus] = useState(0);
  const hasShownPopup = useRef(false);
  const prevGameStatus = useRef(state.gameStatus);
  const prevRevealedHints = useRef(state.revealedHints.length);

  const handleTimerExpire = useCallback(() => {
    if (state.gameStatus === 'playing') {
      actions.giveUp();
    }
  }, [state.gameStatus, actions]);

  const timer = useTimer({ onExpire: handleTimerExpire });

  const isTimedMode = state.gameMode === 'timed';
  const isReverseMode = state.gameMode === 'reverse-year' || state.gameMode === 'reverse-location';

  // Load image when a new battle starts
  useEffect(() => {
    if (state.currentBattle && state.gameStatus === 'playing' && !state.imageUrl) {
      const imageUrl = getImageForBattle(state.currentBattle.id);
      actions.setImage(imageUrl);
    }
  }, [state.currentBattle, state.gameStatus, state.imageUrl, actions, getImageForBattle]);

  // Track battle IDs when creating a challenge
  useEffect(() => {
    if (challenge.state.phase === 'creating' && state.currentBattle && state.gameStatus === 'playing') {
      challenge.recordBattlePlayed(state.currentBattle.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentBattle?.id, state.gameStatus]);

  // Start timer when a timed game begins playing
  useEffect(() => {
    if (state.gameStatus === 'playing' && isTimedMode && state.currentBattle) {
      const duration = getTimerDuration(state.currentBattle.difficulty);
      timer.start(duration);
    } else if (state.gameStatus !== 'playing') {
      timer.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameStatus, isTimedMode, state.currentBattle]);

  // Sound effects & stats recording based on game status changes
  useEffect(() => {
    const prev = prevGameStatus.current;
    const curr = state.gameStatus;
    prevGameStatus.current = curr;

    if (prev === 'playing' && curr === 'won') {
      // Calculate timed bonus if applicable
      let bonus = 0;
      if (isTimedMode) {
        bonus = calculateTimedBonus(timer.timeRemaining, timer.totalTime);
        setTimedBonus(bonus);
      } else {
        setTimedBonus(0);
      }

      if (state.streak >= 3) {
        playSound('streak');
      } else {
        playSound('correct');
      }
      // Record stats
      if (state.currentBattle) {
        recordResult({
          battleId: state.currentBattle.id,
          civilization: state.currentBattle.civilization,
          difficulty: state.currentBattle.difficulty,
          correct: true,
          hintsUsed: state.hintsUsed,
          timestamp: Date.now(),
        });
        achievementsSystem.recordGameResult({
          correct: true,
          hintsUsed: state.hintsUsed,
          difficulty: state.currentBattle.difficulty,
          civilization: state.currentBattle.civilization,
          streak: state.streak,
        });
        actions.recordBattleResult({
          battleId: state.currentBattle.id,
          correct: true,
          hintsUsed: state.hintsUsed,
          difficulty: state.currentBattle.difficulty,
        });
      }
    } else if (prev === 'playing' && curr === 'lost') {
      setTimedBonus(0);
      playSound('giveUp');
      if (state.currentBattle) {
        recordResult({
          battleId: state.currentBattle.id,
          civilization: state.currentBattle.civilization,
          difficulty: state.currentBattle.difficulty,
          correct: false,
          hintsUsed: state.hintsUsed,
          timestamp: Date.now(),
        });
        achievementsSystem.recordGameResult({
          correct: false,
          hintsUsed: state.hintsUsed,
          difficulty: state.currentBattle.difficulty,
          civilization: state.currentBattle.civilization,
          streak: 0,
        });
        actions.recordBattleResult({
          battleId: state.currentBattle.id,
          correct: false,
          hintsUsed: state.hintsUsed,
          difficulty: state.currentBattle.difficulty,
        });
      }
    } else if (curr === 'completed') {
      playSound('complete');
      // If we were creating a challenge, finish it and generate the share link
      if (challenge.state.phase === 'creating') {
        challenge.finishCreating(
          state.score,
          state.correctGuesses,
          state.selectedDifficulty,
          state.selectedCivilization
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameStatus, state.streak, state.currentBattle, state.hintsUsed, playSound, recordResult]);

  // Sound for hint reveals
  useEffect(() => {
    if (state.revealedHints.length > prevRevealedHints.current) {
      playSound('hint');
    }
    prevRevealedHints.current = state.revealedHints.length;
  }, [state.revealedHints.length, playSound]);

  // Sound for wrong answers (gameStatus stays 'playing' but totalGuesses increases)
  const prevTotalGuesses = useRef(state.totalGuesses);
  useEffect(() => {
    if (state.totalGuesses > prevTotalGuesses.current && state.gameStatus === 'playing') {
      playSound('incorrect');
    }
    prevTotalGuesses.current = state.totalGuesses;
  }, [state.totalGuesses, state.gameStatus, playSound]);

  // Show donation popup after 5 completed questions (only once per session)
  useEffect(() => {
    if (state.totalGuesses === 5 && !hasShownPopup.current) {
      hasShownPopup.current = true;
      const timer = setTimeout(() => {
        setShowDonationPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.totalGuesses]);

  const isDailyMode = state.gameMode === 'daily';
  const isChallengeMode = state.gameMode === 'challenge';
  const isDailyPlaying = isDailyMode && daily.state.phase === 'playing';
  const isChallengePlaying = isChallengeMode && challenge.state.phase === 'playing';

  const handleStartGame = () => {
    recordPlay();
    if (state.gameMode === 'timeline') {
      timeline.actions.startRound(state.selectedCivilization, state.selectedDifficulty);
    } else if (isDailyPlaying) {
      // Daily mode - load next daily battle via startBattleById
      const battle = daily.getCurrentBattle();
      if (battle) actions.startBattleById(battle.id);
    } else if (isChallengePlaying) {
      // Challenge mode - load next challenge battle
      const battle = challenge.getCurrentBattle();
      if (battle) actions.startBattleById(battle.id);
    } else {
      actions.startGame();
    }
  };

  const handleNextBattle = () => {
    if (isCampaignActive && campaign.state.phase === 'playing') {
      const isWin = state.gameStatus === 'won';
      const battleScore = state.currentBattle
        ? calculateScore(state.hintsUsed, state.currentBattle.difficulty, state.streak - (isWin ? 1 : 0))
        : 0;
      campaign.actions.recordResult(isWin, isWin ? battleScore : 0);
      campaign.actions.advanceFromResult();
      return;
    }
    if (isDailyPlaying) {
      // Daily mode - record result and advance
      const isWin = state.gameStatus === 'won';
      const battleScore = state.currentBattle
        ? calculateScore(state.hintsUsed, state.currentBattle.difficulty, state.streak - (isWin ? 1 : 0))
        : 0;
      daily.recordBattleResult(isWin, isWin ? battleScore : 0);
      daily.advanceToNext();
      // Start next battle if there is one
      const nextBattle = daily.getCurrentBattle();
      if (nextBattle && daily.state.currentIndex < daily.state.battles.length - 1) {
        actions.startBattleById(daily.state.battles[daily.state.currentIndex + 1].id);
      }
      return;
    }
    if (isChallengePlaying) {
      const isWin = state.gameStatus === 'won';
      const battleScore = state.currentBattle
        ? calculateScore(state.hintsUsed, state.currentBattle.difficulty, state.streak - (isWin ? 1 : 0))
        : 0;
      challenge.recordBattleResult(isWin, isWin ? battleScore : 0);
      challenge.advanceToNext();
      const nextBattle = challenge.getCurrentBattle();
      if (nextBattle && challenge.state.currentIndex < challenge.state.battles.length - 1) {
        actions.startBattleById(challenge.state.battles[challenge.state.currentIndex + 1].id);
      }
      return;
    }
    actions.nextBattle();
  };

  const isTimelineActive = state.gameMode === 'timeline' && timeline.state.status !== 'idle';
  const isCampaignActive = state.gameMode === 'campaign' && campaign.state.phase !== 'select';
  const isDailyActive = isDailyMode && daily.state.phase !== 'intro';
  const isChallengeActive = isChallengeMode && challenge.state.phase !== 'idle';
  const isPlaying = state.gameStatus === 'playing';
  const isResult = state.gameStatus === 'won' || state.gameStatus === 'lost';
  const isIdle = state.gameStatus === 'idle' && !isTimelineActive && !isCampaignActive && !isDailyActive && !isChallengeActive;

  return (
    <Layout
      buyMeACoffeeUrl={BUY_ME_A_COFFEE_URL}
      dailyStreak={dailyStreak}
      onOpenStats={() => setShowStatsPanel(true)}
      onOpenAchievements={() => setShowAchievements(true)}
      achievementCount={{ unlocked: achievementsSystem.unlockedCount, total: achievementsSystem.totalAchievements }}
      onOpenLeaderboard={() => setShowLeaderboard(true)}
      onOpenNameInput={() => setShowNameInput(true)}
      playerName={getPlayerName()}
    >
      <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-8">
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
            <div className="mt-2">
              <AchievementProgress
                stats={achievementsSystem.achievementStats}
                unlockedIds={new Set(achievementsSystem.unlocked.map(u => u.id))}
              />
            </div>
          </motion.div>
        )}

        {/* Mode Selector - visible when idle or between rounds */}
        {(isIdle || isResult || state.gameStatus === 'completed' || (isTimelineActive && timeline.state.status === 'submitted') || (state.gameMode === 'campaign' && campaign.state.phase === 'select') || (isCampaignActive && campaign.state.phase === 'complete')) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <ModeSelector
              selected={state.gameMode}
              onSelect={actions.setMode}
              disabled={state.gameStatus === 'loading'}
            />
          </motion.div>
        )}

        {/* Civilization Selector - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CivilizationSelector
            selected={state.selectedCivilization}
            onSelect={actions.selectCivilization}
            disabled={state.gameStatus === 'playing' || state.gameStatus === 'loading'}
          />
        </motion.div>

        {/* Difficulty Selector - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <DifficultySelector
            selected={state.selectedDifficulty}
            onSelect={actions.selectDifficulty}
            disabled={state.gameStatus === 'loading'}
          />
        </motion.div>

        {/* Main Game Card */}
        <Card variant="elevated" glow={isPlaying}>
          <AnimatePresence mode="wait">
            {/* Campaign Selector */}
            {state.gameStatus === 'idle' && state.gameMode === 'campaign' && campaign.state.phase === 'select' && (
              <motion.div
                key="campaign-select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CampaignSelector
                  campaigns={campaign.campaigns}
                  progress={campaign.progress}
                  onSelect={campaign.actions.selectCampaign}
                />
              </motion.div>
            )}

            {/* Campaign Narrative */}
            {isCampaignActive && (campaign.state.phase === 'narrative-pre' || campaign.state.phase === 'narrative-post') && campaign.state.campaign && (
              <motion.div
                key={`campaign-narrative-${campaign.state.currentBattleIndex}-${campaign.state.phase}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CampaignNarrative
                  text={campaign.state.narrativeText}
                  campaignName={campaign.state.campaign.name}
                  battleIndex={campaign.state.currentBattleIndex}
                  totalBattles={campaign.state.totalBattles}
                  isOutro={campaign.state.phase === 'narrative-post'}
                  onContinue={() => {
                    if (campaign.state.phase === 'narrative-post') {
                      campaign.actions.completeCampaign();
                    } else {
                      campaign.actions.startBattle();
                      // Start the regular game engine with the specific campaign battle
                      if (campaign.state.campaign) {
                        const battleId = campaign.state.campaign.battleIds[campaign.state.currentBattleIndex];
                        recordPlay();
                        actions.startBattleById(battleId);
                      }
                    }
                  }}
                />
              </motion.div>
            )}

            {/* Campaign Complete */}
            {isCampaignActive && campaign.state.phase === 'complete' && campaign.state.campaign && (
              <motion.div
                key="campaign-complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CampaignComplete
                  campaignName={campaign.state.campaign.name}
                  campaignIcon={campaign.state.campaign.icon}
                  score={campaign.state.score}
                  correctGuesses={campaign.state.correctGuesses}
                  totalBattles={campaign.state.totalBattles}
                  onBackToSelect={campaign.actions.backToSelect}
                />
              </motion.div>
            )}

            {/* Daily Challenge Intro */}
            {isDailyMode && daily.state.phase === 'intro' && state.gameStatus === 'idle' && (
              <motion.div
                key="daily-intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DailyChallengeIntro
                  onStart={() => {
                    daily.startDaily();
                    // Start first daily battle
                    const battleIds = getDailyBattleIds(getDailyDateKey());
                    if (battleIds.length > 0) {
                      recordPlay();
                      actions.startBattleById(battleIds[0]);
                    }
                  }}
                  isCompleted={daily.isCompletedToday}
                  todayResult={daily.todayResult}
                  battleCount={5}
                />
              </motion.div>
            )}

            {/* Daily Challenge Result */}
            {isDailyMode && daily.state.phase === 'result' && (
              <motion.div
                key="daily-result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DailyResult
                  score={daily.state.score}
                  correctGuesses={daily.state.correctGuesses}
                  totalBattles={daily.state.battles.length}
                  leaderboard={daily.state.leaderboard}
                  isLoadingLeaderboard={daily.state.isLoadingLeaderboard}
                  onBack={() => {
                    daily.reset();
                    actions.resetGame();
                  }}
                />
              </motion.div>
            )}

            {/* Challenge Invite (someone shared a challenge link) */}
            {isChallengeMode && challenge.state.phase === 'viewing' && challenge.state.challenge && (
              <motion.div
                key="challenge-invite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChallengeInvite
                  challenge={challenge.state.challenge}
                  isLoading={challenge.state.isLoading}
                  onAccept={() => {
                    challenge.startChallenge();
                    if (challenge.state.battles[0]) {
                      recordPlay();
                      actions.startBattleById(challenge.state.battles[0].id);
                    }
                  }}
                  onDecline={() => {
                    challenge.reset();
                    actions.setMode('classic');
                  }}
                />
              </motion.div>
            )}

            {/* Challenge Result */}
            {isChallengeMode && challenge.state.phase === 'result' && challenge.state.challenge && (
              <motion.div
                key="challenge-result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChallengeResult
                  challenge={challenge.state.challenge}
                  playerScore={challenge.state.score}
                  playerCorrect={challenge.state.correctGuesses}
                  attempts={challenge.state.attempts}
                  onCreateNew={() => {
                    // Create a challenge from the current game state
                    challenge.reset();
                    actions.setMode('classic');
                  }}
                  onBack={() => {
                    challenge.reset();
                    actions.setMode('classic');
                    actions.resetGame();
                  }}
                />
              </motion.div>
            )}

            {/* Challenge Mode - idle, create a challenge */}
            {isChallengeMode && challenge.state.phase === 'idle' && state.gameStatus === 'idle' && (
              <motion.div
                key="challenge-create"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <span className="text-3xl">⚔️</span>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-800">Challenge a Friend</h2>
                  <p className="text-gray-600 text-sm mt-2 max-w-sm mx-auto">
                    Play 5 battles, then share a challenge link. Your friend will play the same battles and try to beat your score!
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      challenge.startCreating();
                      recordPlay();
                      actions.startGame();
                    }}
                    className="w-full"
                  >
                    Start Challenge
                  </Button>
                  <button
                    onClick={() => setShowNameInput(true)}
                    className="text-sm text-primary-500 hover:text-primary-700 underline"
                  >
                    Set your commander name
                  </button>
                </div>
              </motion.div>
            )}

            {/* Idle State - Welcome Screen (non-campaign, non-daily, non-challenge) */}
            {isIdle && state.gameMode !== 'campaign' && state.gameMode !== 'daily' && state.gameMode !== 'challenge' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <BattleImage imageUrl={null} isLoading={false} />

                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-primary-800">
                    Welcome to BattleGuess!
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                    {state.gameMode === 'classic' || state.gameMode === 'timed'
                      ? "You'll be shown an AI-generated image of a famous historical battle. Try to guess which battle it depicts!"
                      : state.gameMode === 'reverse-year'
                        ? "You'll be given a battle name — can you guess the year it took place?"
                        : state.gameMode === 'reverse-location'
                          ? "You'll be given a battle name — can you guess where it took place?"
                          : "You'll be given 5 battles — arrange them in chronological order!"
                    }
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
                  <div className="flex justify-center">
                    <MusicTrackSelector
                      tracks={tracks}
                      currentTrackId={currentTrackId}
                      onChangeTrack={changeTrack}
                      isMuted={isMuted}
                      onToggleMute={toggleMute}
                    />
                  </div>
                  <button
                    onClick={() => setShowNameInput(true)}
                    className="text-sm text-primary-500 hover:text-primary-700 underline"
                  >
                    Set your commander name
                  </button>
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

            {/* Timeline Playing State */}
            {isTimelineActive && timeline.state.status === 'playing' && (
              <motion.div
                key="timeline-playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TimelineBoard
                  battles={timeline.state.playerOrder}
                  onReorder={timeline.actions.reorderBattles}
                  onSubmit={timeline.actions.submitOrder}
                />
              </motion.div>
            )}

            {/* Timeline Result State */}
            {isTimelineActive && timeline.state.status === 'submitted' && timeline.state.score && (
              <motion.div
                key="timeline-result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TimelineResult
                  playerOrder={timeline.state.playerOrder}
                  correctOrder={timeline.state.correctOrder}
                  score={timeline.state.score}
                  totalScore={timeline.state.totalScore}
                  roundsPlayed={timeline.state.roundsPlayed}
                  onNextRound={() => timeline.actions.nextRound(state.selectedCivilization, state.selectedDifficulty)}
                  onReset={() => timeline.actions.reset()}
                />
              </motion.div>
            )}

            {/* Daily/Challenge Progress Bar */}
            {isPlaying && isDailyPlaying && (
              <DailyProgress
                current={daily.state.currentIndex}
                total={daily.state.battles.length}
                score={daily.state.score}
              />
            )}
            {isPlaying && isChallengePlaying && challenge.state.challenge && (
              <ChallengeProgress
                creatorName={challenge.state.challenge.creatorName}
                creatorScore={challenge.state.challenge.creatorScore}
                current={challenge.state.currentIndex}
                total={challenge.state.battles.length}
                playerScore={challenge.state.score}
              />
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
                {/* Timer Display for timed mode */}
                {isTimedMode && (
                  <div className="flex justify-center">
                    <TimerDisplay
                      timeRemaining={timer.timeRemaining}
                      totalTime={timer.totalTime}
                      isRunning={timer.isRunning}
                    />
                  </div>
                )}

                {/* Reverse mode: show battle name + question */}
                {isReverseMode ? (
                  <ReversePrompt
                    battleName={state.currentBattle.name}
                    mode={state.gameMode}
                  />
                ) : (
                  /* Classic/Timed: show battle image */
                  <BattleImage
                    imageUrl={state.imageUrl}
                    isLoading={state.isImageLoading}
                    battleName={state.currentBattle.name}
                    battleYear={state.currentBattle.year}
                  />
                )}

                {/* Difficulty Badge + Music Toggle */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    state.currentBattle.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    state.currentBattle.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {state.currentBattle.difficulty.charAt(0).toUpperCase() + state.currentBattle.difficulty.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    • Potential: {calculateScore(0, state.currentBattle.difficulty, state.streak)} pts
                    {isTimedMode && ' + time bonus'}
                  </span>
                  <MusicTrackSelector
                    tracks={tracks}
                    currentTrackId={currentTrackId}
                    onChangeTrack={changeTrack}
                    isMuted={isMuted}
                    onToggleMute={toggleMute}
                  />
                </div>

                {/* Guess Input - varies by mode */}
                {isReverseMode ? (
                  <ReverseGuessInput
                    mode={state.gameMode}
                    onSubmit={actions.submitGuess}
                    disabled={false}
                    onGiveUp={actions.giveUp}
                    actualYear={state.currentBattle.year}
                  />
                ) : (
                  <GuessInput
                    onSubmit={actions.submitGuess}
                    disabled={!state.imageUrl}
                    onGiveUp={actions.giveUp}
                  />
                )}

                {/* Hints - only in classic/timed modes */}
                {!isReverseMode && (
                  <HintDisplay
                    hints={state.currentBattle.hints}
                    revealedHints={state.revealedHints}
                    onRevealHint={actions.revealHint}
                    disabled={!state.imageUrl}
                  />
                )}
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
                  timedBonus={timedBonus}
                />
              </motion.div>
            )}

            {/* Challenge Share Link */}
            {challenge.state.phase === 'share' && challenge.state.challengeUrl && (
              <motion.div
                key="challenge-share"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChallengeShare
                  url={challenge.state.challengeUrl}
                  score={challenge.state.score}
                  correctGuesses={challenge.state.correctGuesses}
                  totalBattles={challenge.state.playedBattleIds.length}
                  onDone={() => {
                    challenge.reset();
                    actions.resetGame();
                  }}
                />
              </motion.div>
            )}

            {/* Completed State - All battles finished */}
            {state.gameStatus === 'completed' && challenge.state.phase !== 'share' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GameComplete
                  score={state.score}
                  correctGuesses={state.correctGuesses}
                  totalGuesses={state.totalGuesses}
                  bestStreak={state.bestStreak}
                  totalBattles={totalBattlesInPool}
                  battleResults={state.battleResults}
                  onPlayAgain={actions.resetGame}
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
            className="text-center text-sm text-primary-400 space-y-1"
          >
            <div>{state.correctGuesses} correct out of {state.totalGuesses} battles</div>
            <div className="text-primary-300">
              Battle {battlesPlayed} of {totalBattlesInPool}
            </div>
          </motion.div>
        )}
      </div>

      {/* Donation Popup */}
      <DonationPopup
        isOpen={showDonationPopup}
        onClose={() => setShowDonationPopup(false)}
        buyMeACoffeeUrl={BUY_ME_A_COFFEE_URL}
      />

      {/* Stats Panel */}
      <StatsPanel
        isOpen={showStatsPanel}
        onClose={() => setShowStatsPanel(false)}
        total={total}
        accuracy={accuracy}
        avgHints={avgHints}
        byCivilization={byCivilization}
        byDifficulty={byDifficulty}
        bestStreak={state.bestStreak}
      />

      {/* Achievements */}
      <AchievementPopup
        achievement={achievementsSystem.newlyUnlocked}
        onDismiss={achievementsSystem.dismissPopup}
      />
      <AchievementsList
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        unlocked={achievementsSystem.unlocked}
      />

      {/* Global Leaderboard */}
      <Leaderboard
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />

      {/* Player Name Input */}
      <PlayerNameInput
        isOpen={showNameInput}
        onClose={() => setShowNameInput(false)}
        currentName={localStorage.getItem('battleguess-player-name') || 'Anonymous Commander'}
      />
    </Layout>
  );
}

export default App;
