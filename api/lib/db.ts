import pg from 'pg';

const { Pool } = pg;

function resolveConnectionString(): string {
  const url =
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL_NON_POOLING;
  if (!url) {
    throw new Error(
      'No Postgres connection string found. Set POSTGRES_URL or DATABASE_URL in .env.local.',
    );
  }
  return url;
}

// One pool per process. In a long-running dev server this persists across
// requests; in a Vercel Function invocation this is a fresh pool each time,
// which is fine — `pg` reuses sockets via the pooler URL in production.
let pool: pg.Pool | undefined;

function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: resolveConnectionString(),
      // Neon, Supabase, Vercel Postgres all require SSL. sslmode in the URL
      // handles it, but enabling here is a safe belt-and-braces for dev.
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

/**
 * Tagged-template `sql` helper that mimics @vercel/postgres's API so handlers
 * can keep using  sql`SELECT ... ${foo}`  unchanged. Interpolations become $1,
 * $2, ... positional parameters — SQL injection safe.
 */
export function sql<T extends pg.QueryResultRow = pg.QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<pg.QueryResult<T>> {
  let text = '';
  for (let i = 0; i < strings.length; i++) {
    text += strings[i];
    if (i < values.length) text += `$${i + 1}`;
  }
  return getPool().query<T>(text, values);
}

export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      google_id TEXT UNIQUE,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar_url TEXT,
      password_hash TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Evolve existing deployments to the schema above. All statements are
  // idempotent so running them on every cold start is safe.
  await sql`ALTER TABLE users ALTER COLUMN google_id DROP NOT NULL`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique ON users (LOWER(email))`;

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
