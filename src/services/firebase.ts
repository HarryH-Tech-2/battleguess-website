import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
  type Firestore,
} from 'firebase/firestore';

// Firebase config - replace with your own from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

function isConfigured(): boolean {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId;
}

function getDb(): Firestore | null {
  if (!isConfigured()) return null;
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

// =============================================
// Player ID (anonymous, persistent via localStorage)
// =============================================

function getPlayerId(): string {
  const key = 'battleguess-player-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function getPlayerName(): string {
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

export interface DailyScore {
  playerId: string;
  playerName: string;
  score: number;
  correctGuesses: number;
  totalBattles: number;
  timestamp: number;
}

export async function submitDailyScore(score: number, correctGuesses: number, totalBattles: number): Promise<boolean> {
  const firestore = getDb();
  if (!firestore) return false;

  try {
    const dateKey = getDailyDateKey();
    const playerId = getPlayerId();
    await setDoc(doc(firestore, 'daily', dateKey, 'scores', playerId), {
      playerId,
      playerName: getPlayerName(),
      score,
      correctGuesses,
      totalBattles,
      timestamp: Date.now(),
    });
    return true;
  } catch {
    return false;
  }
}

export async function getDailyLeaderboard(dateKey?: string): Promise<DailyScore[]> {
  const firestore = getDb();
  if (!firestore) return [];

  try {
    const key = dateKey || getDailyDateKey();
    const q = query(
      collection(firestore, 'daily', key, 'scores'),
      orderBy('score', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as DailyScore);
  } catch {
    return [];
  }
}

// =============================================
// Global Leaderboard (all-time)
// =============================================

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  totalScore: number;
  gamesPlayed: number;
  bestStreak: number;
  accuracy: number;
  updatedAt: number;
}

export async function submitLeaderboardScore(entry: Omit<LeaderboardEntry, 'playerId' | 'playerName' | 'updatedAt'>): Promise<boolean> {
  const firestore = getDb();
  if (!firestore) return false;

  try {
    const playerId = getPlayerId();
    const docRef = doc(firestore, 'leaderboard', playerId);
    const existing = await getDoc(docRef);

    // Only update if new score is higher
    if (existing.exists()) {
      const data = existing.data() as LeaderboardEntry;
      if (data.totalScore >= entry.totalScore) return true;
    }

    await setDoc(docRef, {
      playerId,
      playerName: getPlayerName(),
      ...entry,
      updatedAt: Date.now(),
    });
    console.log('[BattleGuess] Leaderboard score submitted:', entry.totalScore);
    return true;
  } catch (err) {
    console.error('[BattleGuess] Leaderboard submit error:', err);
    return false;
  }
}

export async function getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
  const firestore = getDb();
  if (!firestore) {
    console.warn('[BattleGuess] Firebase not configured — leaderboard disabled');
    return [];
  }

  try {
    const q = query(
      collection(firestore, 'leaderboard'),
      orderBy('totalScore', 'desc'),
      limit(100)
    );
    const snapshot = await getDocs(q);
    console.log(`[BattleGuess] Leaderboard: fetched ${snapshot.docs.length} entries`);
    return snapshot.docs.map(d => d.data() as LeaderboardEntry);
  } catch (err) {
    console.error('[BattleGuess] Leaderboard fetch error:', err);
    return [];
  }
}

// =============================================
// Challenge Mode (URL-based multiplayer)
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

function generateChallengeId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createChallenge(
  battleIds: number[],
  creatorScore: number,
  creatorCorrect: number,
  difficulty: string,
  civilization: string
): Promise<string | null> {
  const firestore = getDb();
  const challengeId = generateChallengeId();

  if (!firestore) {
    // Fallback: encode challenge in URL params
    const data = { b: battleIds, s: creatorScore, c: creatorCorrect, d: difficulty, v: civilization, n: getPlayerName() };
    return btoa(JSON.stringify(data));
  }

  try {
    await setDoc(doc(firestore, 'challenges', challengeId), {
      challengeId,
      creatorId: getPlayerId(),
      creatorName: getPlayerName(),
      battleIds,
      creatorScore,
      creatorCorrect,
      difficulty,
      civilization,
      createdAt: Date.now(),
    });
    return challengeId;
  } catch {
    return null;
  }
}

export async function getChallenge(challengeId: string): Promise<Challenge | null> {
  // Check if it's a base64-encoded fallback
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
    // Not base64 - try Firebase
  }

  const firestore = getDb();
  if (!firestore) return null;

  try {
    const docSnap = await getDoc(doc(firestore, 'challenges', challengeId));
    return docSnap.exists() ? (docSnap.data() as Challenge) : null;
  } catch {
    return null;
  }
}

export async function submitChallengeAttempt(challengeId: string, score: number, correctGuesses: number): Promise<boolean> {
  const firestore = getDb();
  if (!firestore) return false;

  try {
    const playerId = getPlayerId();
    await setDoc(doc(firestore, 'challenges', challengeId, 'attempts', playerId), {
      playerId,
      playerName: getPlayerName(),
      score,
      correctGuesses,
      timestamp: Date.now(),
    });
    return true;
  } catch {
    return false;
  }
}

export async function getChallengeAttempts(challengeId: string): Promise<ChallengeAttempt[]> {
  const firestore = getDb();
  if (!firestore) return [];

  try {
    const q = query(
      collection(firestore, 'challenges', challengeId, 'attempts'),
      orderBy('score', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as ChallengeAttempt);
  } catch {
    return [];
  }
}

export { isConfigured as isFirebaseConfigured };
