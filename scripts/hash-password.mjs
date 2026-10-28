#!/usr/bin/env node
/**
 * Generates a PBKDF2 password hash for an account, to paste into .env.local.
 * Usage: node scripts/hash-password.mjs "your-password"
 *        node scripts/hash-password.mjs --secret   (prints a random SESSION_SECRET)
 * Must stay in sync with src/lib/auth/password.ts (algorithm + iterations).
 */
import { webcrypto, randomBytes } from 'node:crypto';

const ITERATIONS = 210000;
const arg = process.argv[2];

if (!arg) {
  console.error('Usage: node scripts/hash-password.mjs "<password>" | --secret');
  process.exit(1);
}

if (arg === '--secret') {
  console.log(randomBytes(32).toString('base64url'));
  process.exit(0);
}

if (arg.length < 10) {
  console.error('Password must be at least 10 characters.');
  process.exit(1);
}

const salt = randomBytes(16);
const key = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(arg), 'PBKDF2', false, ['deriveBits']);
const bits = await webcrypto.subtle.deriveBits(
  { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS },
  key,
  256
);
console.log(`pbkdf2$${ITERATIONS}$${salt.toString('base64url')}$${Buffer.from(bits).toString('base64url')}`);
