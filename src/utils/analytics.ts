declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function event(name: string, params?: Record<string, string | number | boolean>) {
  window.gtag?.('event', name, params);
}

export const analytics = {
  gameStart(mode: string, difficulty: string, civilization: string) {
    event('game_start', { game_mode: mode, difficulty, civilization });
  },
  battleWon(difficulty: string, hintsUsed: number, streak: number) {
    event('battle_won', { difficulty, hints_used: hintsUsed, streak });
  },
  battleLost(difficulty: string, hintsUsed: number) {
    event('battle_lost', { difficulty, hints_used: hintsUsed });
  },
  gameCompleted(mode: string, score: number, correctGuesses: number) {
    event('game_completed', { game_mode: mode, score, correct_guesses: correctGuesses });
  },
  challengeCreated() {
    event('challenge_created');
  },
  challengeAccepted() {
    event('challenge_accepted');
  },
  achievementUnlocked(achievementId: string) {
    event('achievement_unlocked', { achievement_id: achievementId });
  },
  // GA4 recommended auth events — `method` shows up as a standard dimension.
  signUp(method: 'email' | 'google') {
    event('sign_up', { method });
  },
  login(method: 'email' | 'google') {
    event('login', { method });
  },
  // Inline quiz widget on blog posts.
  blogQuizAnswered(postSlug: string, battleId: number, correct: boolean) {
    event('blog_quiz_answered', { post_slug: postSlug, battle_id: battleId, correct });
  },
  blogQuizPlayClick(postSlug: string) {
    event('blog_quiz_play_click', { post_slug: postSlug });
  },
};
