/**
 * ⚠ ANYTHING PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 auth scaffolding. The useEffect-on-mount → authClient.signOut →
 * window.location.href redirect is load-bearing for the mobile WebView's
 * "sign out" flow. Safe to restyle the spinner / copy; unsafe to bypass
 * authClient.signOut or change the redirect behavior.
 */
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

function LogoutHandler() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { error: signOutError } = await authClient.signOut();
      if (cancelled) return;
      if (signOutError) {
        setError(signOutError.message ?? 'Sign out failed');
        return;
      }
      if (typeof window !== 'undefined') {
        window.location.href = callbackUrl;
      } else {
        console.warn('logout: window is undefined; cannot redirect to callbackUrl');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [callbackUrl]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#0A0A0F]">
      <div className="flex flex-col items-center gap-[16px]">
        <div className="w-[48px] h-[48px] bg-[#F59E0B] rounded-[14px] flex items-center justify-center font-black text-[18px] text-[#0A0A0F]">
          IA
        </div>
        {error ? (
          <p className="text-red-400 text-[14px] font-medium">{error}</p>
        ) : (
          <>
            <div
              className="w-[24px] h-[24px] border-[3px] border-[#4F46E5] border-t-transparent rounded-full"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
            <p className="text-[#4B5563] text-[14px] font-medium">Signing you out…</p>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutHandler />
    </Suspense>
  );
}
