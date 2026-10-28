/**
 * Stateless signed session tokens (HMAC-SHA256), safe to verify in Edge middleware.
 * Token format: <payloadB64url>.<signatureB64url>
 * The client can read nothing it can forge: changing the role breaks the signature.
 */
import { base64UrlDecode, base64UrlEncode, timingSafeEqual } from './password';
import type { UserRole } from '@/types';

export const SESSION_COOKIE = 'seo_pilot_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface SessionPayload extends SessionUser {
  exp: number; // unix seconds
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const VALID_ROLES: readonly UserRole[] = ['owner', 'office', 'user'];

async function getKey(secret: string): Promise<CryptoKey> {
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET is missing or shorter than 32 characters. See README → Environment Variables.');
  }
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

async function sign(data: string, secret: string): Promise<Uint8Array> {
  const key = await getKey(secret);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(data)));
}

export async function createSessionToken(
  user: SessionUser,
  secret: string,
  now: number = Math.floor(Date.now() / 1000)
): Promise<string> {
  const payload: SessionPayload = { ...user, exp: now + SESSION_TTL_SECONDS };
  const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signature = base64UrlEncode(await sign(body, secret));
  return `${body}.${signature}`;
}

/** Returns the session user, or null if the token is missing, tampered with, or expired. */
export async function verifySessionToken(
  token: string | undefined,
  secret: string,
  now: number = Math.floor(Date.now() / 1000)
): Promise<SessionUser | null> {
  if (!token) return null;
  const [body, signature, extra] = token.split('.');
  if (!body || !signature || extra !== undefined) return null;

  try {
    const expected = await sign(body, secret);
    if (!timingSafeEqual(expected, base64UrlDecode(signature))) return null;

    const payload = JSON.parse(decoder.decode(base64UrlDecode(body))) as Partial<SessionPayload>;
    if (typeof payload.exp !== 'number' || payload.exp <= now) return null;
    if (!payload.role || !VALID_ROLES.includes(payload.role)) return null;
    if (typeof payload.id !== 'string' || typeof payload.email !== 'string') return null;

    return { id: payload.id, email: payload.email, name: payload.name ?? '', role: payload.role };
  } catch (error) {
    // A missing secret is a deployment bug, not a bad token — surface it.
    if (error instanceof Error && error.message.startsWith('SESSION_SECRET')) throw error;
    return null;
  }
}
