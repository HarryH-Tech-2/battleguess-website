import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, initializeDatabase } from '../lib/db.js';
import { signToken } from '../lib/jwt.js';
import { verifyPassword } from '../lib/password.js';

interface LoginBody {
  email: string;
  password: string;
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  password_hash: string | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = (req.body ?? {}) as Partial<LoginBody>;

    if (!email || !password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    await initializeDatabase();

    const { rows } = await sql<UserRow>`
      SELECT id, email, name, avatar_url, password_hash
      FROM users
      WHERE LOWER(email) = ${normalizedEmail}
      LIMIT 1
    `;

    // Same generic response for no-such-user, Google-only account, or bad
    // password — don't leak which emails are registered or how.
    if (rows.length === 0 || !rows[0].password_hash) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const ok = await verifyPassword(password, user.password_hash!);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

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
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
}
