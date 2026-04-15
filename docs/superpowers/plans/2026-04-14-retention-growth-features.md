# Retention & Growth Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Google Sign-In, post-game signup modal, enhanced share score with daily challenge support, and performance optimizations to BattleGuess.

**Architecture:** Vercel Serverless Functions (`/api/*`) for auth backend with Vercel Postgres. Frontend additions: AuthContext, SignUpModal, enhanced ShareScore for daily results. All features are additive — existing anonymous gameplay stays untouched.

**Tech Stack:** React 19, TypeScript, Vercel Serverless Functions, Vercel Postgres (`@vercel/postgres`), `jose` (JWT), Google Identity Services (script tag), Framer Motion, Tailwind CSS.

---

### Task 1: Install dependencies and configure project for Vercel Serverless Functions

**Files:**
- Modify: `package.json`
- Create: `api/tsconfig.json`

- [ ] **Step 1: Install new dependencies**

```bash
npm install @vercel/postgres jose
```

- [ ] **Step 2: Create tsconfig for API routes**

Vercel Serverless Functions in TypeScript need their own tsconfig. Create `api/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "../.vercel/output",
    "rootDir": ".",
    "types": ["node"]
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Update vercel.json to exclude API routes from SPA rewrites**

Add API route handling before the SPA rewrites. Edit `vercel.json` — add CORS headers for API routes at the top of the `headers` array:

```json
{
  "source": "/api/(.*)",
  "headers": [
    { "key": "Access-Control-Allow-Origin", "value": "*" },
    { "key": "Access-Control-Allow-Methods", "value": "GET, POST, OPTIONS" },
    { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json api/tsconfig.json vercel.json
git commit -m "chore: add vercel postgres, jose deps and API tsconfig"
```

---

### Task 2: Create database schema and helper utilities

**Files:**
- Create: `api/lib/db.ts`
- Create: `api/lib/jwt.ts`
- Create: `api/lib/auth.ts`

- [ ] **Step 1: Create database client wrapper**

Create `api/lib/db.ts`:

```typescript
import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      google_id TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_stats (
      user_id UUID PRIMARY KEY REFERENCES users(id),
      total_games INTEGER DEFAULT 0,
      battles_discovered INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_played_date DATE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS game_results (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      game_mode TEXT NOT NULL,
      score INTEGER NOT NULL,
      correct_count INTEGER NOT NULL,
      total_count INTEGER NOT NULL,
      played_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export { sql };
```

- [ ] **Step 2: Create JWT helper**

Create `api/lib/jwt.ts`:

```typescript
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as JWTPayload;
}
```

- [ ] **Step 3: Create auth middleware helper**

Create `api/lib/auth.ts`:

```typescript
import type { VercelRequest } from '@vercel/node';
import { verifyToken, type JWTPayload } from './jwt.js';

export async function extractUser(req: VercelRequest): Promise<JWTPayload | null> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;

  try {
    return await verifyToken(header.slice(7));
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add api/lib/db.ts api/lib/jwt.ts api/lib/auth.ts
git commit -m "feat: add database schema, JWT, and auth helpers for API"
```

---

### Task 3: Create Google auth API endpoint

**Files:**
- Create: `api/auth/google.ts`

- [ ] **Step 1: Create the Google auth endpoint**

Create `api/auth/google.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, initializeDatabase } from '../lib/db.js';
import { signToken } from '../lib/jwt.js';

interface GoogleTokenInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
  aud: string;
  iss: string;
}

async function verifyGoogleToken(credential: string): Promise<GoogleTokenInfo> {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
  );
  if (!res.ok) throw new Error('Invalid Google token');

  const data = await res.json() as GoogleTokenInfo;

  const clientId = process.env.VITE_GOOGLE_CLIENT_ID;
  if (data.aud !== clientId) throw new Error('Token audience mismatch');

  const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
  if (!validIssuers.includes(data.iss)) throw new Error('Invalid token issuer');

  return data;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { credential } = req.body as { credential: string };
    if (!credential) {
      return res.status(400).json({ error: 'Missing credential' });
    }

    await initializeDatabase();

    const googleUser = await verifyGoogleToken(credential);

    // Upsert user
    const { rows } = await sql`
      INSERT INTO users (google_id, email, name, avatar_url)
      VALUES (${googleUser.sub}, ${googleUser.email}, ${googleUser.name}, ${googleUser.picture})
      ON CONFLICT (google_id)
      DO UPDATE SET name = ${googleUser.name}, avatar_url = ${googleUser.picture}
      RETURNING id, email, name, avatar_url
    `;

    const user = rows[0];

    // Ensure user_stats row exists
    await sql`
      INSERT INTO user_stats (user_id)
      VALUES (${user.id})
      ON CONFLICT (user_id) DO NOTHING
    `;

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
    });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add api/auth/google.ts
git commit -m "feat: add Google OAuth verification API endpoint"
```

---

### Task 4: Create migration API endpoint

**Files:**
- Create: `api/auth/migrate.ts`

- [ ] **Step 1: Create the migration endpoint**

Create `api/auth/migrate.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, initializeDatabase } from '../lib/db.js';
import { extractUser } from '../lib/auth.js';

interface MigrationPayload {
  totalGames: number;
  battlesDiscovered: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await extractUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await initializeDatabase();

    const { totalGames, battlesDiscovered, currentStreak, longestStreak, lastPlayedDate } =
      req.body as MigrationPayload;

    // Only update if incoming values are higher (don't overwrite better server data)
    await sql`
      UPDATE user_stats SET
        total_games = GREATEST(total_games, ${totalGames}),
        battles_discovered = GREATEST(battles_discovered, ${battlesDiscovered}),
        current_streak = GREATEST(current_streak, ${currentStreak}),
        longest_streak = GREATEST(longest_streak, ${longestStreak}),
        last_played_date = CASE
          WHEN ${lastPlayedDate}::DATE > COALESCE(last_played_date, '1970-01-01'::DATE)
          THEN ${lastPlayedDate}::DATE
          ELSE last_played_date
        END
      WHERE user_id = ${user.userId}
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({ error: 'Migration failed' });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add api/auth/migrate.ts
git commit -m "feat: add localStorage-to-DB migration API endpoint"
```

---

### Task 5: Create AuthContext and Google Sign-In button

**Files:**
- Create: `src/contexts/AuthContext.tsx`
- Create: `src/components/auth/GoogleSignInButton.tsx`

- [ ] **Step 1: Create AuthContext**

Create `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_TOKEN_KEY = 'battleguess-auth-token';
const AUTH_USER_KEY = 'battleguess-auth-user';

function decodeUser(): { token: string; user: User } | null {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    if (!token || !userJson) return null;

    const user = JSON.parse(userJson) as User;

    // Check token expiry (JWT payload is base64url in the middle segment)
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      return null;
    }

    return { token, user };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = decodeUser();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
  }, []);

  const signIn = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

- [ ] **Step 2: Create GoogleSignInButton**

Create `src/components/auth/GoogleSignInButton.tsx`:

```typescript
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme: string; size: string; width?: number; text?: string }
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  width?: number;
}

export function GoogleSignInButton({ onSuccess, width = 300 }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { signIn } = useAuth();

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      if (!res.ok) throw new Error('Auth failed');

      const data = await res.json() as { token: string; user: { id: string; email: string; name: string; avatarUrl: string | null } };
      signIn(data.token, data.user);

      // Migrate localStorage stats to DB
      migrateLocalStats(data.token);

      onSuccess?.();
    } catch (err) {
      console.error('Sign-in failed:', err);
    }
  }, [signIn, onSuccess]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !buttonRef.current) return;

    const renderButton = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width,
        text: 'continue_with',
      });
    };

    // If GIS script already loaded
    if (window.google) {
      renderButton();
      return;
    }

    // Load GIS script if not present
    const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = renderButton;
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', renderButton);
    }
  }, [handleCredentialResponse, width]);

  return <div ref={buttonRef} className="flex justify-center" />;
}

async function migrateLocalStats(token: string) {
  try {
    const statsJson = localStorage.getItem('battleguess-detailed-stats');
    const streakJson = localStorage.getItem('battleguess-daily-streak');

    const stats = statsJson ? JSON.parse(statsJson) as Array<{ battleId: number; correct: boolean }> : [];
    const streak = streakJson ? JSON.parse(streakJson) as { currentStreak: number; longestStreak: number; lastPlayDate: string } : null;

    const uniqueBattles = new Set(stats.filter(s => s.correct).map(s => s.battleId));

    await fetch('/api/auth/migrate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        totalGames: stats.length,
        battlesDiscovered: uniqueBattles.size,
        currentStreak: streak?.currentStreak ?? 0,
        longestStreak: streak?.longestStreak ?? 0,
        lastPlayedDate: streak?.lastPlayDate ?? null,
      }),
    });
  } catch {
    // Fire and forget — migration failure is not critical
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/contexts/AuthContext.tsx src/components/auth/GoogleSignInButton.tsx
git commit -m "feat: add AuthContext and GoogleSignInButton component"
```

---

### Task 6: Create post-game signup modal

**Files:**
- Create: `src/components/auth/SignUpModal.tsx`

- [ ] **Step 1: Create SignUpModal component**

Create `src/components/auth/SignUpModal.tsx`:

```typescript
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleSignInButton } from './GoogleSignInButton';

interface SignUpModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
}

export function SignUpModal({ isOpen, onDismiss, onSuccess }: SignUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onDismiss}
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5"
          >
            {/* Icon */}
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Copy */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">Save your progress</h2>
              <p className="text-sm text-gray-500 mt-2">
                Track streaks, scores, and compete with friends
              </p>
            </div>

            {/* Google button */}
            <GoogleSignInButton onSuccess={onSuccess} />

            {/* Dismiss */}
            <button
              onClick={onDismiss}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/auth/SignUpModal.tsx
git commit -m "feat: add post-game signup modal component"
```

---

### Task 7: Wire AuthProvider into app and add SignUpModal trigger

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Wrap app with AuthProvider**

Edit `src/main.tsx` to wrap `BrowserRouter` with `AuthProvider`:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppRouter } from './AppRouter'
import './i18n'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 2: Add SignUpModal trigger to App.tsx**

In `src/App.tsx`, add the following changes:

Add imports at the top of the file (after existing imports):

```typescript
import { SignUpModal } from './components/auth/SignUpModal';
import { useAuth } from './contexts/AuthContext';
```

Inside the `App()` function, after the existing `const` declarations (around line 68), add:

```typescript
const { isAuthenticated } = useAuth();
const [showSignUpModal, setShowSignUpModal] = useState(false);
const signUpModalDismissed = useRef(false);
```

Add an effect to trigger the modal after the 3rd battle completes. Add this after the existing donation popup effect (after line 241):

```typescript
// Show sign-up modal after 3rd battle (once per session, only if not authenticated)
useEffect(() => {
  if (
    state.totalGuesses === 3 &&
    !isAuthenticated &&
    !signUpModalDismissed.current
  ) {
    const timer = setTimeout(() => setShowSignUpModal(true), 500);
    return () => clearTimeout(timer);
  }
}, [state.totalGuesses, isAuthenticated]);
```

Add the SignUpModal component right before the closing `</Layout>` tag (after the AchievementsList Suspense block, around line 920):

```typescript
{/* Sign Up Modal */}
<SignUpModal
  isOpen={showSignUpModal}
  onDismiss={() => {
    setShowSignUpModal(false);
    signUpModalDismissed.current = true;
  }}
  onSuccess={() => {
    setShowSignUpModal(false);
    signUpModalDismissed.current = true;
  }}
/>
```

- [ ] **Step 3: Commit**

```bash
git add src/main.tsx src/App.tsx
git commit -m "feat: wire AuthProvider and signup modal trigger after 3rd battle"
```

---

### Task 8: Add share button to DailyResult

**Files:**
- Modify: `src/components/game/DailyChallenge.tsx`

- [ ] **Step 1: Add ShareButton to DailyResult**

In `src/components/game/DailyChallenge.tsx`, add the import for ShareButton at the top:

```typescript
import { ShareButton } from './ShareButton';
```

In the `DailyResult` component, add a ShareButton between the stats grid and the "Back to Menu" button. Replace the section from the stats grid closing `</div>` to the `<Button>`:

Find:
```typescript
      </div>

      <Button variant="primary" size="lg" onClick={onBack} className="w-full">
        Back to Menu
      </Button>
```

Replace with:
```typescript
      </div>

      <ShareButton
        data={{
          score,
          accuracy,
          streak: 0,
          rank: 'Daily Challenge',
          battlesWon: correctGuesses,
          totalBattles,
          battleResults: [],
        }}
        className="w-full"
      />

      <Button variant="primary" size="lg" onClick={onBack} className="w-full">
        Back to Menu
      </Button>
```

- [ ] **Step 2: Pass streak data to DailyResult for better share text**

The DailyResult currently has no access to streak data. Update the interface and props to accept it.

In `DailyChallenge.tsx`, update the `DailyResultProps` interface:

Find:
```typescript
interface DailyResultProps {
  score: number;
  correctGuesses: number;
  totalBattles: number;
  onBack: () => void;
}
```

Replace with:
```typescript
interface DailyResultProps {
  score: number;
  correctGuesses: number;
  totalBattles: number;
  dailyStreak: number;
  onBack: () => void;
}
```

Update the function signature:

Find:
```typescript
export function DailyResult({ score, correctGuesses, totalBattles, onBack }: DailyResultProps) {
```

Replace with:
```typescript
export function DailyResult({ score, correctGuesses, totalBattles, dailyStreak, onBack }: DailyResultProps) {
```

Update the ShareButton `data` prop to use the streak:

Find:
```typescript
          streak: 0,
```

Replace with:
```typescript
          streak: dailyStreak,
```

- [ ] **Step 3: Pass dailyStreak prop in App.tsx**

In `src/App.tsx`, find the `<DailyResult` usage (around line 492):

Find:
```typescript
                <DailyResult
                  score={daily.state.score}
                  correctGuesses={daily.state.correctGuesses}
                  totalBattles={daily.state.battles.length}
                  onBack={() => {
```

Replace with:
```typescript
                <DailyResult
                  score={daily.state.score}
                  correctGuesses={daily.state.correctGuesses}
                  totalBattles={daily.state.battles.length}
                  dailyStreak={dailyStreak}
                  onBack={() => {
```

- [ ] **Step 4: Commit**

```bash
git add src/components/game/DailyChallenge.tsx src/App.tsx
git commit -m "feat: add share button to daily challenge results"
```

---

### Task 9: Enhance share text with daily challenge format

**Files:**
- Modify: `src/utils/shareCard.ts`

- [ ] **Step 1: Add daily-specific share text generation**

In `src/utils/shareCard.ts`, update the `ShareCardData` interface and `generateShareText` function.

Add a new optional field to `ShareCardData`:

Find:
```typescript
export interface ShareCardData {
  score: number;
  accuracy: number;
  streak: number;
  rank: string;
  battlesWon: number;
  totalBattles: number;
  battleResults: BattleRoundResult[];
}
```

Replace with:
```typescript
export interface ShareCardData {
  score: number;
  accuracy: number;
  streak: number;
  rank: string;
  battlesWon: number;
  totalBattles: number;
  battleResults: BattleRoundResult[];
  isDaily?: boolean;
}
```

Update `generateShareText` to support daily format:

Find:
```typescript
export function generateShareText(data: ShareCardData): string {
  const lines: string[] = [];

  // Header
  lines.push(`🎖️ BattleGuess — ${data.rank}`);
  lines.push(`⭐ ${data.score.toLocaleString()} pts | 🎯 ${data.accuracy}% | 🔥 ${data.streak} streak`);
  lines.push('');
```

Replace with:
```typescript
export function generateShareText(data: ShareCardData): string {
  const lines: string[] = [];

  // Header — different for daily vs standard
  if (data.isDaily) {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    lines.push(`Battle Guess Daily - ${today}`);
    lines.push(`Score: ${data.battlesWon}/${data.totalBattles}`);
  } else {
    lines.push(`🎖️ BattleGuess — ${data.rank}`);
    lines.push(`⭐ ${data.score.toLocaleString()} pts | 🎯 ${data.accuracy}% | 🔥 ${data.streak} streak`);
  }

  // Streak line (both modes, skip if 0)
  if (data.isDaily && data.streak > 0) {
    lines.push(`Streak: ${data.streak} days`);
  }
  lines.push('');
```

- [ ] **Step 2: Set isDaily flag in DailyResult's ShareButton**

In `src/components/game/DailyChallenge.tsx`, update the ShareButton data to include `isDaily: true`:

Find (in the DailyResult ShareButton):
```typescript
          battleResults: [],
```

Replace with:
```typescript
          battleResults: [],
          isDaily: true,
```

- [ ] **Step 3: Commit**

```bash
git add src/utils/shareCard.ts src/components/game/DailyChallenge.tsx
git commit -m "feat: add daily challenge-specific share text format"
```

---

### Task 10: Add "Share on X" button to ShareButton component

**Files:**
- Modify: `src/components/game/ShareButton.tsx`

- [ ] **Step 1: Add X/Twitter share link below the main share button**

In `src/components/game/ShareButton.tsx`, update the component to include a secondary X link.

Replace the entire component:

Find:
```typescript
export function ShareButton({ data, className = '' }: ShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'shared' | 'copied' | 'failed'>('idle');

  const handleShare = async () => {
    const result = await shareResult(data);
    setStatus(result);
    setTimeout(() => setStatus('idle'), 2500);
  };

  const feedbackText = status === 'shared' ? 'Shared!' : status === 'copied' ? 'Copied to clipboard!' : status === 'failed' ? 'Share failed' : '';

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-bold rounded-xl shadow-lg shadow-yellow-500/25 transition-all duration-200 hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-[0.98]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Score
      </button>
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute -top-9 left-1/2 -translate-x-1/2 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg ${
              status === 'failed' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {feedbackText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

Replace with:
```typescript
export function ShareButton({ data, className = '' }: ShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'shared' | 'copied' | 'failed'>('idle');

  const handleShare = async () => {
    const result = await shareResult(data);
    setStatus(result);
    setTimeout(() => setStatus('idle'), 2500);
  };

  const handleShareX = () => {
    const text = generateShareText(data);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const feedbackText = status === 'shared' ? 'Shared!' : status === 'copied' ? 'Copied to clipboard!' : status === 'failed' ? 'Share failed' : '';

  return (
    <div className={`relative space-y-2 ${className}`}>
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-bold rounded-xl shadow-lg shadow-yellow-500/25 transition-all duration-200 hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-[0.98]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Score
      </button>
      <button
        onClick={handleShareX}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </button>
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute -top-9 left-1/2 -translate-x-1/2 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg ${
              status === 'failed' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {feedbackText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

Also add the `generateShareText` import at the top of the file:

Find:
```typescript
import { shareResult, type ShareCardData } from '../../utils/shareCard';
```

Replace with:
```typescript
import { shareResult, generateShareText, type ShareCardData } from '../../utils/shareCard';
```

- [ ] **Step 2: Commit**

```bash
git add src/components/game/ShareButton.tsx
git commit -m "feat: add Share on X button to share component"
```

---

### Task 11: Performance improvements

**Files:**
- Modify: `index.html`
- Modify: `src/App.tsx` (verify existing optimizations)

- [ ] **Step 1: Add GIS script preconnect to index.html**

In `index.html`, add a preconnect hint for Google Identity Services (helps the GIS script load faster when eventually needed). Add after the existing font preload (line 54):

Find:
```html
    <link rel="preload" href="/welcome-placeholder.webp" as="image" type="image/webp" />
```

Replace with:
```html
    <link rel="preload" href="/welcome-placeholder.webp" as="image" type="image/webp" />

    <!-- Preconnect to Google Identity Services (loaded async on first sign-in prompt) -->
    <link rel="preconnect" href="https://accounts.google.com" />
    <link rel="preconnect" href="https://oauth2.googleapis.com" />
```

- [ ] **Step 2: Verify lazy loading of heavy components**

In `src/App.tsx`, confirm that `StatsPanel` and `AchievementsList` are already lazy-loaded (they are — lines 30-31). Confirm `FloatingOrbs` and `ParticleBackground` are lazy-loaded in `Layout.tsx`. Read `Layout.tsx` to verify.

The existing code already has:
- Lazy-loaded StatsPanel and AchievementsList
- Image prefetching for upcoming battles (lines 97-112)
- Image preloading on battle start (lines 87-95)
- Code-split routes in AppRouter.tsx

No additional changes needed — the app already follows good performance patterns.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "perf: add preconnect hints for Google Identity Services"
```

---

### Task 12: Add Google Cloud setup instructions

**Files:**
- Create: `docs/GOOGLE_AUTH_SETUP.md`

- [ ] **Step 1: Write setup guide**

Create `docs/GOOGLE_AUTH_SETUP.md`:

```markdown
# Google OAuth Setup for BattleGuess

## Prerequisites
- Google Cloud account

## Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "New Project" → name it "BattleGuess" → Create

### 2. Configure OAuth Consent Screen
1. Go to APIs & Services → OAuth consent screen
2. Select "External" → Create
3. Fill in:
   - App name: BattleGuess
   - User support email: your email
   - Developer contact: your email
4. Click Save and Continue through scopes (no extra scopes needed)
5. Add test users if needed, then publish the app

### 3. Create OAuth Client ID
1. Go to APIs & Services → Credentials
2. Click "+ Create Credentials" → "OAuth client ID"
3. Application type: Web application
4. Name: BattleGuess Web
5. Authorized JavaScript origins:
   - `https://battleguess.app`
   - `http://localhost:5173` (for local dev)
6. Authorized redirect URIs:
   - `https://battleguess.app`
   - `http://localhost:5173`
7. Click Create → Copy the **Client ID**

### 4. Set Environment Variables

#### Vercel Dashboard
Go to your Vercel project → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Your Google Client ID | All |
| `JWT_SECRET` | Random 64-char string (use `openssl rand -hex 32`) | All |
| `POSTGRES_URL` | Auto-set when you link Vercel Postgres | All |

#### Local Development
Create `.env.local`:
```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
JWT_SECRET=your-local-secret
POSTGRES_URL=your-local-postgres-url
```

### 5. Set Up Vercel Postgres
1. Go to Vercel Dashboard → Storage → Create Database → Postgres
2. Link it to your BattleGuess project
3. The `POSTGRES_URL` env var is auto-configured

### 6. Deploy
Push to main. The API routes in `/api/` are automatically deployed as serverless functions.
```

- [ ] **Step 2: Add .env.local to .gitignore if not already there**

Check `.gitignore` for `.env.local`. If missing, add it:

```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 3: Commit**

```bash
git add docs/GOOGLE_AUTH_SETUP.md .gitignore
git commit -m "docs: add Google OAuth setup instructions"
```

---

### Task 13: Verify build and types

**Files:** None (verification only)

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc -b --noEmit
```

Expected: No errors. If there are errors, fix them before proceeding.

- [ ] **Step 2: Run the dev build**

```bash
npm run build:quick
```

Expected: Successful build with no errors. The API routes in `/api/` are NOT part of the Vite build — Vercel compiles them separately during deployment.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Fix any lint errors that arise from the new code.

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve type/lint issues from new features"
```
