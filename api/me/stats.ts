import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeDatabase } from '../lib/db.js';
import { extractUser } from '../lib/auth.js';
import { getUserStreak } from '../lib/daily.js';

/**
 * GET /api/me/stats — the signed-in user's server-side streak, used to
 * hydrate a fresh browser after sign-in.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await extractUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await initializeDatabase();
    const streak = await getUserStreak(user.userId);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ streak });
  } catch (error) {
    console.error('Me stats error:', error);
    return res.status(500).json({ error: 'Could not load stats' });
  }
}
