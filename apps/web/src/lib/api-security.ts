import { auth, type Session } from '@/lib/auth';
import { headers } from 'next/headers';

type AccessResult =
  | { ok: true; session: Session }
  | { ok: false; response: Response };

export async function requireSession(): Promise<AccessResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      ok: false,
      response: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { ok: true, session };
}

export async function requireAdmin(): Promise<AccessResult> {
  const access = await requireSession();
  if (!access.ok) return access;
  if (access.session.user.role !== 'admin') {
    return {
      ok: false,
      response: Response.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }
  return access;
}

// Browsers include Origin on cross-site state-changing requests. Bearer-token
// clients may omit it, so an absent Origin is allowed while a mismatched one is
// rejected. This supplements, rather than replaces, authentication and RBAC.
export function rejectCrossOrigin(request: Request): Response | null {
  const origin = request.headers.get('origin');
  if (!origin) return null;

  const requestUrl = new URL(request.url);
  const allowed = new Set(
    [
      requestUrl.origin,
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_CREATE_BASE_URL,
      process.env.EXPO_PUBLIC_PROXY_BASE_URL,
    ].filter((value): value is string => Boolean(value))
  );

  if (!allowed.has(origin)) {
    return Response.json({ error: 'Invalid request origin' }, { status: 403 });
  }
  return null;
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 64_000) throw new ApiInputError('Request body is too large', 413);

  let value: unknown;
  try {
    value = await request.json();
  } catch {
    throw new ApiInputError('Invalid JSON body');
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiInputError('Expected a JSON object');
  }
  return value as Record<string, unknown>;
}

export class ApiInputError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
  }
}

export function inputErrorResponse(error: unknown, fallback: string): Response {
  if (error instanceof ApiInputError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error(fallback, error);
  return Response.json({ error: fallback }, { status: 500 });
}

export function requiredString(
  value: unknown,
  field: string,
  maxLength = 500
): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ApiInputError(`${field} is required`);
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) throw new ApiInputError(`${field} is too long`);
  return normalized;
}

export function optionalString(value: unknown, field: string, maxLength = 2_000): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new ApiInputError(`${field} must be a string`);
  const normalized = value.trim();
  if (normalized.length > maxLength) throw new ApiInputError(`${field} is too long`);
  return normalized || null;
}

export function integer(value: unknown, field: string, options: { min?: number; max?: number } = {}) {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(parsed)) throw new ApiInputError(`${field} must be an integer`);
  if (options.min !== undefined && parsed < options.min) throw new ApiInputError(`${field} is too small`);
  if (options.max !== undefined && parsed > options.max) throw new ApiInputError(`${field} is too large`);
  return parsed;
}

export function finiteNumber(
  value: unknown,
  field: string,
  options: { min?: number; max?: number } = {}
) {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) throw new ApiInputError(`${field} must be a number`);
  if (options.min !== undefined && parsed < options.min) throw new ApiInputError(`${field} is too small`);
  if (options.max !== undefined && parsed > options.max) throw new ApiInputError(`${field} is too large`);
  return parsed;
}
