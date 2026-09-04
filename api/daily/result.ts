import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeDatabase } from '../lib/db.js';
import { extractUser } from '../lib/auth.js';
import { validateDailyResult } from '../lib/dailyStats.js';
import { getDailyCommunity, recordUserStreak, upsertDailyResult } from '../lib/daily.js';

/**
 * POST /api/daily/result
 * Body: { dateKey, anonId, score, correct, marks }
 * Optional Bearer token. Records the day's result (first submission wins),
 * advances the signed-in user's streak, and returns the community stats.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const parsed = validateDailyResult(req.body);
  if (!parsed.ok) return res.status(400).json({ error: parsed.error });

  try {
    const user = await extractUser(req);
    await initializeDatabase();

    await upsertDailyResult(parsed.value, user?.userId ?? null);
    const community = await getDailyCommunity(parsed.value.dateKey, parsed.value.anonId, user?.userId ?? null);
    const streak = user ? await recordUserStreak(user.userId, parsed.value.dateKey) : null;

    return res.status(200).json({ ...community, streak });
  } catch (error) {
    console.error('Daily result error:', error);
    return res.status(500).json({ error: 'Could not record result' });
  }
}
