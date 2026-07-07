import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import type { ThemeClasses } from './use-theme-classes';
import { STATS } from './constants';
import { useSession } from '@/lib/auth-client';

interface HeroProps {
  theme: ThemeClasses;
  onInstallClick: () => void;
}

export function Hero({ theme, onInstallClick }: HeroProps) {
  const { isDark } = theme;
  const { data: session } = useSession();

  let ctaLink = '/account/signup';
  let ctaText = 'Start Learning Free';

  if (session?.user) {
    if (session.user.role === 'admin') {
      ctaLink = '/admin';
      ctaText = 'Go to Admin Panel';
    } else {
      ctaLink = '#experience';
      ctaText = 'Open Learning App';
    }
  }

  return (
    <section className="pt-40 pb-28 px-6 relative">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Accent Pill */}
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary dark:text-brand-primary text-[10px] sm:text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full mb-8 shadow-[0_0_15px_rgba(99,91,255,0.05)] animate-hero-fade-up">
          <Zap className="w-3.5 h-3.5 fill-brand-primary/60 text-brand-primary" />
          Simple Learning & Job Prep App
        </div>

        {/* Main Title */}
        <h1 className={`text-4xl sm:text-6xl md:text-8xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tighter leading-[1.02] mb-8 select-none animate-hero-fade-up [animation-delay:150ms]`}>
          Aapki Job Prep
          <br />
          <span className="text-indigo-600">
            Ab Aur Bhi Aasan!
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12 font-medium animate-hero-fade-up [animation-delay:300ms]">
          Get ready for TCS, Infosys, JPSC, UPSC and other top exams. Simple video classes, easy notes, and mock tests designed specifically for you.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 animate-hero-fade-up [animation-delay:450ms]">
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-200 shadow-sm active:scale-95 group"
          >
            {ctaText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <button
            onClick={onInstallClick}
            className="px-8 py-4 text-base font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all duration-200"
          >
            Install PWA Client
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto reveal-on-scroll">
          {STATS.map((s, i) => (
            <div
              key={i}
              className={`${theme.card} border rounded-2xl px-6 py-5 text-center backdrop-blur-md transition-all duration-200`}
            >
              <p className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.val}</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
