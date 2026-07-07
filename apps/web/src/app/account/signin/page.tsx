/**
 * ⚠ ANYTHING PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 auth scaffolding. Same contract as signup/page.tsx: <form
 * onSubmit>, e.preventDefault(), and window.location.href redirect are all
 * load-bearing for the mobile WebView. DO NOT replace <form onSubmit> with
 * <button onClick> — that broke signin platform-wide in a prior AI rewrite.
 *
 *   Safe:   restyle, rewrite copy, add form fields.
 *   Unsafe: replacing <form>, removing preventDefault, bypassing
 *           authClient.signIn.email, changing the callbackUrl redirect.
 */
'use client';

import { useSearchParams } from 'next/navigation';
import { type FormEvent, Suspense, useState, useEffect } from 'react';
import { SocialSignInButtons } from '@/components/SocialSignInButtons';
import { authClient, useSession } from '@/lib/auth-client';

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      const redirectUrl = session.user.role === 'admin' ? '/admin' : callbackUrl;
      window.location.href = redirectUrl;
    }
  }, [session, isPending, callbackUrl]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await authClient.signIn.email({
      email,
      password,
    });

    if (result.error) {
      setError(result.error.message ?? 'Sign in failed');
      setLoading(false);
      return;
    }

    if (typeof window !== 'undefined') {
      const redirectUrl = result.data?.user?.role === 'admin' ? '/admin' : callbackUrl;
      window.location.href = redirectUrl;
    } else {
      console.warn('signin: window is undefined; cannot redirect to callbackUrl');
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#0A0A0F] p-[16px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.15)_0%,_transparent_60%)]" />
      <form
        onSubmit={(e) => {
          void onSubmit(e);
        }}
        className="relative flex w-full max-w-[420px] flex-col gap-[20px] rounded-[24px] bg-[#111118] p-[32px] shadow-2xl border border-[#2D2D4E]"
      >
        <div className="flex items-center gap-[10px] mb-[4px]">
          <div className="w-[36px] h-[36px] bg-[#F59E0B] rounded-[10px] flex items-center justify-center font-black text-[13px] text-[#0A0A0F]">
            IA
          </div>
          <div>
            <p className="font-bold text-[15px] text-white leading-none">IAs Academy</p>
            <p className="text-[10px] text-[#4B5563] mt-[2px]">Simple Learning & Job Prep App</p>
          </div>
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-white tracking-tight">Welcome back 👋</h1>
          <p className="text-[13px] text-[#4B5563] mt-[4px]">
            Sign in to continue your classes
          </p>
        </div>
        <label className="flex flex-col gap-[6px]">
          <span className="font-semibold text-[#64748B] text-[11px] uppercase tracking-wider">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-[12px] border border-[#2D2D4E] bg-[#1A1A2E] p-[12px] text-[14px] text-white placeholder-[#374151] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
          />
        </label>
        <label className="flex flex-col gap-[6px]">
          <span className="font-semibold text-[#64748B] text-[11px] uppercase tracking-wider">
            Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-[12px] border border-[#2D2D4E] bg-[#1A1A2E] p-[12px] text-[14px] text-white placeholder-[#374151] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
          />
        </label>
        {error && (
          <div className="rounded-[12px] bg-red-500/10 border border-red-500/20 p-[12px] text-[13px] text-red-400">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-[12px] bg-gradient-to-r from-indigo-600 to-violet-600 p-[14px] text-[14px] font-bold text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
        <SocialSignInButtons callbackUrl={callbackUrl} />
        <a
          href={`/account/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="text-center text-[13px] text-[#4B5563] hover:text-[#818CF8] transition-colors"
        >
          No account? <span className="text-[#818CF8] font-semibold">Create one free</span>
        </a>
      </form>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
