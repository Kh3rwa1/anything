/**
 * Central API helper for the mobile app.
 *
 * - Prepends EXPO_PUBLIC_API_URL to all paths so calls work on native devices
 * - Automatically attaches the JWT Bearer token from the auth store
 * - Returns parsed JSON with type safety
 */
import { getJwt } from './auth/getSession';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

export async function api<T = any>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const jwt = getJwt();
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');
  if (jwt && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${jwt}`);
  }
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
