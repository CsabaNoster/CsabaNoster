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
  // Accept either JSON or form-encoded bodies (some browsers/pages submit form data)
  let body: any = null;
  try {
    const raw = await request.text();
    if (!raw) {
      console.error('Empty request body');
      return new Response(JSON.stringify({ error: 'Invalid or empty JSON body' }), { status: 400 });
    }
    try {
      body = JSON.parse(raw);
    } catch (_) {
      // try parsing as URL-encoded form
      const params = new URLSearchParams(raw);
      if (params && params.toString()) {
        body = Object.fromEntries(params.entries());
      }
    }
  } catch (err) {
    console.error('Failed to read request body:', err);
    return new Response(JSON.stringify({ error: 'Invalid or empty JSON body' }), { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    console.error('Body is not a valid object:', body);
    return new Response(JSON.stringify({ error: 'Body is not a valid object' }), { status: 400 });
  }
  const { username, password } = body;
  if (!username || !password) {
    console.error('Missing username or password:', body);
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
    const user = await db.get('SELECT password_hash FROM users WHERE username = ?', username);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }
    const token = signToken({ username });
    const res = new Response(JSON.stringify({ success: true }), { status: 200 });
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.headers.set('Set-Cookie', `auth=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${secureFlag}`);
    return res;
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
};
  let body;
