import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
const { Pool } = pkg;

// Express router removed; now handled by Astro API routes

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/myownsite'
});
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';
const ADMIN_CODE = process.env.ADMIN_CODE || 'supersecret';

fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});



