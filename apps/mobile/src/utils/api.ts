/**
 * Central API helper for the mobile app.
 *
 * - Prepends EXPO_PUBLIC_API_URL to all paths when configured
 * - Automatically attaches the JWT Bearer token from the auth store
 * - Returns parsed JSON with type safety
 * - Enforces a 15-second request timeout
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';
const REQUEST_TIMEOUT_MS = 15_000;

async function getStoredJwt() {
  try {
    const { getJwt } = await import('./auth/getSession');
    return getJwt();
  } catch {
    return null;
  }
}

export async function api<T = unknown>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const jwt = await getStoredJwt();
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');
  if (jwt && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${jwt}`);
  }
  const url = `${BASE_URL}${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: options?.signal ?? controller.signal,
    });
    if (!res.ok) {
      const err = typeof res.json === 'function'
        ? await res.json().catch(() => ({ error: 'Request failed' }))
        : { error: 'Request failed' };
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return typeof res.json === 'function' ? res.json() : ({} as T);
  } finally {
    clearTimeout(timeout);
  }
}
