import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, initializeDatabase } from '../lib/db.js';
import { signToken } from '../lib/jwt.js';
import { hashPassword } from '../lib/password.js';

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  password_hash: string | null;
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = (req.body ?? {}) as Partial<RegisterBody>;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing email, password, or name' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    if (!trimmedName) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }

    await initializeDatabase();

    // Look up any existing account by email (case-insensitive).
    const existing = await sql<UserRow>`
      SELECT id, email, name, avatar_url, password_hash
      FROM users
      WHERE LOWER(email) = ${normalizedEmail}
      LIMIT 1
    `;

    let user: UserRow;
    const passwordHash = await hashPassword(password);

    if (existing.rows.length === 0) {
      // Brand-new account.
      const inserted = await sql<UserRow>`
        INSERT INTO users (email, name, password_hash)
        VALUES (${normalizedEmail}, ${trimmedName}, ${passwordHash})
        RETURNING id, email, name, avatar_url, password_hash
      `;
      user = inserted.rows[0];
      await sql`
        INSERT INTO user_stats (user_id) VALUES (${user.id})
        ON CONFLICT (user_id) DO NOTHING
      `;
    } else if (existing.rows[0].password_hash) {
      // Account already has a password — treat as duplicate registration.
      return res.status(409).json({
        message: 'An account with this email already exists. Please sign in.',
      });
    } else {
      // Existing Google-only account: link a password to it.
      const updated = await sql<UserRow>`
        UPDATE users
        SET password_hash = ${passwordHash}
        WHERE id = ${existing.rows[0].id}
        RETURNING id, email, name, avatar_url, password_hash
      `;
      user = updated.rows[0];
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
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
}
