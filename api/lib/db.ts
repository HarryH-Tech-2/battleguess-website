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
