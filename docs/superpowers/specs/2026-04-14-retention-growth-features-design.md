# BattleGuess Retention & Growth Features — Design Spec

**Date:** 2026-04-14
**Status:** Approved

## Overview

Add Google Sign-In, a post-game signup modal, share score mechanics, and targeted performance improvements to BattleGuess. The goal is to increase sign-ups, retention, and viral sharing while preserving the existing anonymous-first gameplay experience.

**Not in scope (already exists):** Streak system, Daily Challenge, Progress Tracking, Hint System.

---

## 1. Architecture

### Backend: Vercel Serverless Functions

New API routes deployed as Vercel Serverless Functions (`/api/*`) in the same repo. No separate server.

### Database: Vercel Postgres

Three tables:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  total_games INTEGER DEFAULT 0,
  battles_discovered INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_played_date DATE
);

CREATE TABLE game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  game_mode TEXT NOT NULL,
  score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  total_count INTEGER NOT NULL,
  played_at TIMESTAMP DEFAULT NOW()
);
```

### Frontend additions

- `AuthContext` — React context providing `user`, `isAuthenticated`, `signIn`, `signOut`
- `SignUpModal` — post-game modal triggered after 3rd battle
- `ShareScore` — clipboard + X share on results screens
- `GoogleSignInButton` — reusable GIS button component

### Data flow

- Anonymous play remains 100% localStorage (no changes to existing behavior)
- Signed-in users: localStorage continues to work as primary store; API calls sync data to DB as an enhancement
- On first sign-in: existing localStorage stats are migrated to DB via `/api/auth/migrate`
- If API calls fail, the app continues to work — DB sync is fire-and-forget

---

## 2. Google Sign-In

### Google Cloud Setup (prerequisites)

1. Create a Google Cloud project at console.cloud.google.com
2. Enable "Google Identity" API
3. Create OAuth 2.0 Client ID (Web application type)
4. Add authorized origins: `https://battleguess.app`, `http://localhost:5173`
5. Add authorized redirect URIs: `https://battleguess.app`, `http://localhost:5173`
6. Copy the Client ID → set as `VITE_GOOGLE_CLIENT_ID` env var

### Frontend

- Load Google Identity Services script: `https://accounts.google.com/gsi/client` with `async` attribute
- `GoogleSignInButton` component:
  - Calls `google.accounts.id.initialize({ client_id, callback })` on mount
  - Renders Google-styled button via `google.accounts.id.renderButton`
  - On callback: receives `credential` (JWT ID token from Google)
  - POSTs credential to `/api/auth/google`
  - On success: stores returned session JWT in localStorage, updates AuthContext
- `AuthContext`:
  - Reads JWT from localStorage on mount
  - Decodes JWT payload (no verification needed client-side) to get user profile
  - Exposes: `user`, `isAuthenticated`, `signIn(jwt)`, `signOut()`
  - `signOut` clears JWT from localStorage

### Backend: `/api/auth/google` (POST)

1. Receive `{ credential }` from request body
2. Verify the Google ID token by calling `https://oauth2.googleapis.com/tokeninfo?id_token=<credential>`
3. Validate: `aud` matches our Client ID, `iss` is `accounts.google.com` or `https://accounts.google.com`
4. Extract: `sub` (google_id), `email`, `name`, `picture` (avatar_url)
5. Upsert into `users` table (INSERT ON CONFLICT google_id DO UPDATE name, avatar_url)
6. Ensure `user_stats` row exists for user
7. Sign a session JWT with `JWT_SECRET` env var (payload: `{ userId, email, name, avatarUrl }`, expiry: 30 days)
8. Return `{ token, user: { id, email, name, avatarUrl } }`

### Backend: `/api/auth/migrate` (POST)

1. Authenticate via `Authorization: Bearer <token>` header
2. Receive localStorage stats payload: `{ totalGames, battlesDiscovered, currentStreak, longestStreak, lastPlayedDate }`
3. Update `user_stats` for the authenticated user (only if DB values are lower — don't overwrite better server-side data)
4. Return `{ success: true }`

### Environment variables needed

- `VITE_GOOGLE_CLIENT_ID` — Google OAuth Client ID (frontend, prefixed for Vite)
- `JWT_SECRET` — Secret for signing session JWTs (backend only)
- `POSTGRES_URL` — Vercel Postgres connection string (auto-set by Vercel when linking DB)

---

## 3. Post-Game Signup Modal

### Trigger

- In the `useGame` hook (or a wrapper), track battles completed in the current game session
- After the 3rd battle resolves (correct or incorrect), check:
  - `isAuthenticated === false` (from AuthContext)
  - `modalDismissedThisSession === false` (React state, not localStorage)
- If both conditions met: set `showSignUpModal = true`

### UI

- Full-screen overlay with backdrop blur (`bg-black/50 backdrop-blur-sm`)
- Centered card matching existing app styling (dark card, green accents)
- Content:
  - Headline: "Save your progress"
  - Subtext: "Track streaks, scores, and compete with friends"
  - `GoogleSignInButton` component
  - "Maybe later" text link below (dismisses modal)
- Framer Motion: fade-in overlay + scale-up card animation

### Behavior

- Shows once per browser session (dismissing prevents re-showing until next visit)
- Signing in via modal: modal closes, game continues with no interruption
- Current battle remains loaded behind the modal
- Modal does NOT pause any timer if one is running

---

## 4. Share Score

### Where

- Final results screen for all game modes (Classic, Reverse Year, Campaign, Daily Challenge, Challenge)
- Daily Challenge gets a date-specific format

### Generated text

Classic/Campaign/Reverse Year/Challenge:
```
Battle Guess Score: {correct}/{total}
Streak: {streak} days
Can you beat me?
https://battleguess.app
```

Daily Challenge:
```
Battle Guess Daily - {Mon DD, YYYY}
Score: {correct}/{total}
Streak: {streak} days
Can you beat me?
https://battleguess.app
```

If streak is 0 or user has no streak data, omit the streak line.

### UI

- `ShareScore` component placed on results screens
- Primary button: "Share" (copy icon)
  - On click: `navigator.clipboard.writeText(shareText)`
  - Button text changes to "Copied!" for 2 seconds
- Secondary link: "Share on X"
  - Opens `https://twitter.com/intent/tweet?text={encodeURIComponent(shareText)}` in new tab

### No spoilers

Share text excludes battle names to avoid ruining the daily challenge for others.

---

## 5. Performance Improvements

### Preload first battle image

- After battle selection (in `useGame` or game loading phase), create `new Image().src = firstBattleImageUrl` to start the fetch early
- Alternatively, inject `<link rel="preload" as="image" href="...">` into `<head>`

### Verify lazy loading

- Confirm `FloatingOrbs`, `ParticleBackground`, `Confetti`, `DefeatAnimation` are lazy-loaded with `React.lazy`
- Confirm page-level components (FAQ, About, Blog, Stats, Battles) are code-split
- Fix any that aren't

### Non-blocking scripts

- Google Identity Services script loaded with `async` attribute
- Analytics script deferred if not already

---

## 6. File Structure (new files)

```
/api/
  auth/
    google.ts          — Google token verification + user upsert
    migrate.ts         — localStorage → DB migration
  lib/
    db.ts              — Vercel Postgres client wrapper
    jwt.ts             — JWT sign/verify helpers
    auth.ts            — extractUser middleware helper

/src/
  contexts/
    AuthContext.tsx     — Auth state provider

  components/
    auth/
      GoogleSignInButton.tsx  — GIS button wrapper
      SignUpModal.tsx          — Post-game signup modal

    game/
      ShareScore.tsx           — Share score clipboard + X button
```

---

## 7. Dependencies

### New npm packages

- `jose` — JWT signing/verification (edge-runtime compatible, works in Vercel Serverless Functions unlike `jsonwebtoken` which requires Node.js crypto)
- `@vercel/postgres` — Vercel Postgres client

### No new frontend dependencies

Google Identity Services is loaded via script tag, not npm. Everything else uses existing React, Framer Motion, and Tailwind.
