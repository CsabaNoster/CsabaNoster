import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { signToken } from '../../../lib/auth';

const dbPromise = open({
  filename: './db/users.sqlite',
  driver: sqlite3.Database
});

export const POST: APIRoute = async ({ request }) => {
  // Accept either JSON or form-encoded bodies
  let body: any = null;
  try {
    const raw = await request.text();
    if (!raw) return new Response(JSON.stringify({ error: 'Invalid or empty JSON body' }), { status: 400 });
    try {
      body = JSON.parse(raw);
    } catch (_) {
      const params = new URLSearchParams(raw);
      if (params && params.toString()) body = Object.fromEntries(params.entries());
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid or empty JSON body' }), { status: 400 });
  }
  const { username, email, password, adminCode } = body || {};
  if (!username || !email || !password) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }
  try {
    const db = await dbPromise;
    await db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      admin_code TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    const exists = await db.get('SELECT id FROM users WHERE username = ? OR email = ?', username, email);
    if (exists) {
      return new Response(JSON.stringify({ error: 'Username or email already used' }), { status: 400 });
    }
    const password_hash = await bcrypt.hash(password, 10);
    await db.run(
      'INSERT INTO users (username, email, password_hash, admin_code) VALUES (?, ?, ?, ?)',
      username, email, password_hash, adminCode || null
    );
    // issue JWT and set HttpOnly cookie
  const token = signToken({ username });
  const res = new Response(JSON.stringify({ success: true }), { status: 201 });
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.headers.set('Set-Cookie', `auth=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${secureFlag}`);
  return res;
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
};
