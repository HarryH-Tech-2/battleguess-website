import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeDatabase } from '../lib/db.js';
import { extractUser } from '../lib/auth.js';
import { getDailyCommunity } from '../lib/daily.js';

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const ANON_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;

/**
 * GET /api/daily/leaderboard?date=YYYY-MM-DD&anonId=...
 * Read-only community view for a day. Optional Bearer token marks "you".
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const date = typeof req.query.date === 'string' ? req.query.date : '';
  if (!DATE_KEY_RE.test(date) || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'Invalid date' });
  }
  const anonId = typeof req.query.anonId === 'string' && ANON_ID_RE.test(req.query.anonId) ? req.query.anonId : null;

  try {
    const user = await extractUser(req);
    await initializeDatabase();
    const community = await getDailyCommunity(date, anonId, user?.userId ?? null);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(community);
  } catch (error) {
    console.error('Daily leaderboard error:', error);
    return res.status(500).json({ error: 'Could not load leaderboard' });
  }
}
