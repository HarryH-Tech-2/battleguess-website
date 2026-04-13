// =============================================
// Local utilities (no backend/Firebase dependency)
// =============================================

// Player ID (anonymous, persistent via localStorage)
function getPlayerId(): string {
  const key = 'battleguess-player-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function getPlayerName(): string {
  return localStorage.getItem('battleguess-player-name') || 'Anonymous Commander';
}

export function setPlayerName(name: string) {
  localStorage.setItem('battleguess-player-name', name);
}

// =============================================
// Daily Challenge
// =============================================

export function getDailyDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Deterministic daily battle selection (seeded by date)
export function getDailyBattleIds(dateKey: string): number[] {
  // Simple hash from date string to get a seed
  let seed = 0;
  for (let i = 0; i < dateKey.length; i++) {
    seed = ((seed << 5) - seed + dateKey.charCodeAt(i)) | 0;
  }

  // Use seed to select 5 battle IDs from 1-200
  const ids: number[] = [];
  let s = Math.abs(seed);
  while (ids.length < 5) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const id = (s % 200) + 1;
    if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

// =============================================
// Challenge Mode (URL-based, no backend needed)
// =============================================

export interface Challenge {
  challengeId: string;
  creatorId: string;
  creatorName: string;
  battleIds: number[];
  creatorScore: number;
  creatorCorrect: number;
  difficulty: string;
  civilization: string;
  createdAt: number;
}

export interface ChallengeAttempt {
  playerId: string;
  playerName: string;
  score: number;
  correctGuesses: number;
  timestamp: number;
}

export function createChallenge(
  battleIds: number[],
  creatorScore: number,
  creatorCorrect: number,
  difficulty: string,
  civilization: string
): string {
  const data = { b: battleIds, s: creatorScore, c: creatorCorrect, d: difficulty, v: civilization, n: getPlayerName() };
  return btoa(JSON.stringify(data));
}

export function getChallenge(challengeId: string): Challenge | null {
  try {
    const decoded = JSON.parse(atob(challengeId));
    if (decoded.b && Array.isArray(decoded.b)) {
      return {
        challengeId,
        creatorId: 'offline',
        creatorName: decoded.n || 'A Commander',
        battleIds: decoded.b,
        creatorScore: decoded.s || 0,
        creatorCorrect: decoded.c || 0,
        difficulty: decoded.d || 'all',
        civilization: decoded.v || 'all',
        createdAt: Date.now(),
      };
    }
  } catch {
    // Invalid challenge data
  }
  return null;
}
