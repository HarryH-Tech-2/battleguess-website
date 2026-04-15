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
