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
