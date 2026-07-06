/**
 * ⚠ ANYTHING PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 auth scaffolding. The <form onSubmit>, e.preventDefault(), and
 * window.location.href redirect are load-bearing for the mobile WebView auth
 * flow (AuthWebView intercepts the navigation to capture the session). A
 * prior AI rewrite replaced <form onSubmit> with <button onClick> and broke
 * signup platform-wide — "credentials cleared" / "button does nothing" for
 * every user until a human reverted it. DO NOT repeat that mistake.
 *
 *   Safe:   restyle, rewrite copy, add form fields (pass `name` explicitly).
 *   Unsafe: replacing <form>, removing preventDefault, bypassing
 *           authClient.signUp.email, changing the callbackUrl redirect.
 */
'use client';

import { useSearchParams } from 'next/navigation';
import { type FormEvent, Suspense, useState } from 'react';
import { SocialSignInButtons } from '@/components/SocialSignInButtons';
import { authClient } from '@/lib/auth-client';

function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // The server backfills `name` from the email local-part when it's missing,
    // so email + password is enough.
    const { error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name: '',
    });

    if (signUpError) {
      setError(signUpError.message ?? 'Sign up failed');
      setLoading(false);
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.href = callbackUrl;
    } else {
      console.warn('signup: window is undefined; cannot redirect to callbackUrl');
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
          <h1 className="text-[24px] font-bold text-white tracking-tight">Start for free 🚀</h1>
          <p className="text-[13px] text-[#4B5563] mt-[4px]">
            Create your free account to start learning
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
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
          {loading ? 'Creating account…' : 'Create Account →'}
        </button>
        <SocialSignInButtons callbackUrl={callbackUrl} />
        <a
          href={`/account/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="text-center text-[13px] text-[#4B5563] hover:text-[#818CF8] transition-colors"
        >
          Already have an account? <span className="text-[#818CF8] font-semibold">Sign in</span>
        </a>
      </form>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
