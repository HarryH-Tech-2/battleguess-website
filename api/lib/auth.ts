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
