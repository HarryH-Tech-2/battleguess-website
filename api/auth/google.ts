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
  if (!res.ok) throw new Error(`Invalid Google token (tokeninfo ${res.status})`);

  const data = await res.json() as GoogleTokenInfo;

  const clientId = process.env.VITE_GOOGLE_CLIENT_ID ?? process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('Server missing VITE_GOOGLE_CLIENT_ID env var');
  }
  if (data.aud !== clientId) {
    throw new Error(`Audience mismatch: token aud=${data.aud}, expected=${clientId}`);
  }

  const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
  if (!validIssuers.includes(data.iss)) throw new Error(`Invalid issuer: ${data.iss}`);

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
    const normalizedEmail = googleUser.email.trim().toLowerCase();

    // Look up by google_id first — normal returning-Google-user path.
    const byGoogle = await sql`
      SELECT id, email, name, avatar_url
      FROM users
      WHERE google_id = ${googleUser.sub}
      LIMIT 1
    `;

    let user;
    let isNewUser = false;
    if (byGoogle.rows.length > 0) {
      const updated = await sql`
        UPDATE users
        SET name = ${googleUser.name}, avatar_url = ${googleUser.picture}
        WHERE google_id = ${googleUser.sub}
        RETURNING id, email, name, avatar_url
      `;
      user = updated.rows[0];
    } else {
      // First time we've seen this Google account. Check whether there's an
      // existing email/password account with the same email to link onto,
      // rather than failing on the unique email index.
      const byEmail = await sql`
        SELECT id FROM users WHERE LOWER(email) = ${normalizedEmail} LIMIT 1
      `;
      if (byEmail.rows.length > 0) {
        const linked = await sql`
          UPDATE users
          SET google_id = ${googleUser.sub},
              avatar_url = COALESCE(avatar_url, ${googleUser.picture})
          WHERE id = ${byEmail.rows[0].id}
          RETURNING id, email, name, avatar_url
        `;
        user = linked.rows[0];
      } else {
        const inserted = await sql`
          INSERT INTO users (google_id, email, name, avatar_url)
          VALUES (${googleUser.sub}, ${normalizedEmail}, ${googleUser.name}, ${googleUser.picture})
          RETURNING id, email, name, avatar_url
        `;
        user = inserted.rows[0];
        isNewUser = true;
      }
    }

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
      isNewUser,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return res.status(401).json({ error: message });
  }
}
