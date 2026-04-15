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
