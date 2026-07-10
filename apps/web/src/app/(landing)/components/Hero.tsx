import Link from 'next/link';
import { ArrowRight, Check, Play, Sparkles, Zap } from 'lucide-react';
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
    <section className="landing-hero pt-36 sm:pt-44 pb-24 sm:pb-32 px-6 relative isolate">
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="hero-grid absolute inset-x-0 top-0 h-[620px] -z-10 opacity-70" />
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Accent Pill */}
        <div className="hero-status inline-flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full mb-7 animate-hero-fade-up">
          <Zap className="w-3.5 h-3.5 fill-brand-primary/60 text-brand-primary" />
          Simple Learning & Job Prep App
        </div>

        {/* Main Title */}
        <h1 className={`text-4xl sm:text-6xl md:text-[5.5rem] lg:text-[6.4rem] font-black ${isDark ? 'text-white' : 'text-slate-950'} tracking-[-0.065em] leading-[0.94] mb-8 select-none animate-hero-fade-up [animation-delay:150ms]`}>
          Aapki Job Prep
          <br />
          <span className="hero-gradient-text">
            Ab Aur Bhi Aasan!
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12 font-medium animate-hero-fade-up [animation-delay:300ms]">
          Get ready for TCS, Infosys, JPSC, UPSC and other top exams. Simple video classes, easy notes, and mock tests designed specifically for you.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-7 animate-hero-fade-up [animation-delay:450ms]">
          <Link
            href={ctaLink}
            className="premium-primary inline-flex items-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-bold text-white rounded-2xl active:scale-[0.98] group"
          >
            {ctaText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <button
            onClick={onInstallClick}
            className={`premium-secondary inline-flex items-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-bold rounded-2xl active:scale-[0.98] ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
          >
            <Play className="w-4 h-4 fill-current" />
            Install PWA Client
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 mb-16 animate-hero-fade-up [animation-delay:520ms]">
          {['Learn at your pace', 'Mock tests included', 'Works on every phone'].map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" />{item}</span>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="hero-stat-shell grid grid-cols-2 md:grid-cols-4 gap-px max-w-4xl mx-auto reveal-on-scroll">
          {STATS.map((s, i) => (
            <div
              key={i}
              className={`hero-stat ${theme.card} px-5 sm:px-6 py-5 text-center backdrop-blur-md transition-all duration-300`}
            >
              <div className="mx-auto mb-2 grid size-7 place-items-center rounded-lg bg-indigo-500/10 text-indigo-600"><Sparkles className="size-3.5" /></div>
              <p className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.val}</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
