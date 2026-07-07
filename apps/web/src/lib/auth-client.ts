'use client';

import { useEffect, useState } from 'react';

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  image?: string;
};

type AuthSession = {
  user: AuthUser;
  session: {
    id: string;
  };
};

type AuthResult = {
  data?: { jwt: string; user: AuthUser } | null;
  error?: { message: string } | null;
};

async function postAuth(path: string, body?: Record<string, unknown>): Promise<AuthResult> {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { data: null, error: { message: json.error || 'Authentication failed' } };
    }
    return { data: json, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return { data: null, error: { message } };
  }
}

export const authClient = {
  signIn: {
    email: ({ email, password }: { email: string; password: string }) =>
      postAuth('/api/auth/email/signin', { email, password }),
    social: ({ provider, callbackURL }: { provider: string; callbackURL?: string }) =>
      postAuth(`/api/auth/social/${provider}`, { callbackURL }),
  },
  signUp: {
    email: ({ email, password, name }: { email: string; password: string; name?: string }) =>
      postAuth('/api/auth/email/signup', { email, password, name }),
  },
  signOut: () => postAuth('/api/auth/logout'),
};

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;

export function useSession() {
  const [data, setData] = useState<AuthSession | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch('/api/session');
        if (!response.ok) {
          if (!cancelled) setData(null);
          return;
        }
        const json = await response.json();
        if (!cancelled) setData(json);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) setIsPending(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, isPending };
}
