import { useState } from 'react';
import { BookOpen, Play, Lock, ShieldCheck, CheckCircle } from 'lucide-react';
import type { ThemeClasses } from './use-theme-classes';

interface AppPreviewProps {
  theme: ThemeClasses;
}

export function AppPreview({ theme }: AppPreviewProps) {
  const { isDark } = theme;
  const [mockAppTab, setMockAppTab] = useState<'syllabus' | 'audio' | 'iap'>('syllabus');

  const tabs = [
    {
      id: 'syllabus' as const,
      title: 'Dynamic Syllabus Sync',
      desc: 'Instantly updates lessons, completed progress, and certificates in real-time across both web console and mobile dashboards.',
      icon: <BookOpen className="w-5 h-5 text-brand-primary" />,
    },
    {
      id: 'audio' as const,
      title: 'Offline Video & Notes',
      desc: 'Store complete lessons directly to local filesystem storage for continuous education during transit.',
      icon: <Play className="w-5 h-5 text-purple-500 dark:text-purple-400" />,
    },
    {
      id: 'iap' as const,
      title: 'RevenueCat Integration',
      desc: 'Sync native store purchases and in-app upgrades with your central learner credentials securely.',
      icon: <ShieldCheck className="w-5 h-5 text-brand-accent" />,
    },
  ];

  return (
    <section id="experience" className={`py-28 px-6 border-t ${theme.border} scroll-mt-20 relative`}>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center reveal-on-scroll">

          {/* Context Switcher & Details */}
          <div className="order-2 lg:order-1">
            <p className="text-brand-primary font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
              MOBILE LEARNING APP
            </p>
            <h2 className={`text-3xl sm:text-5xl font-black ${theme.text} tracking-tight leading-tight mb-6`}>
              Study Anywhere on Your Phone
            </h2>
            <p className={`${theme.textMuted} leading-relaxed font-medium mb-8`}>
              Prepare for exams on the go. We built a fast and lightweight mobile app so you can watch classes, read notes, and track your progress from anywhere in Jharkhand.
            </p>

            {/* Tabs */}
            <div className="space-y-4">
              {tabs.map((tab) => {
                const isActive = mockAppTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMockAppTab(tab.id)}
                    aria-expanded={isActive}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 hover:translate-x-1 ${
                      isActive
                        ? theme.tabButtonActive
                        : theme.tabButtonInactive
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border transition-colors ${
                      isActive ? 'bg-brand-primary/10 border-brand-primary/20' : 'bg-slate-200/50 border-slate-300/80 dark:bg-white/[0.02] dark:border-white/[0.06]'
                    }`}>
                      {tab.icon}
                    </div>
                    <div>
                      <h4 className={`font-bold text-base transition-colors ${isActive ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-300' : 'text-slate-700')}`}>
                        {tab.title}
                      </h4>
                      {isActive && (
                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mt-1.5 leading-relaxed font-medium animate-fadeIn`}>
                          {tab.desc}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean Feature Dashboard Preview Card */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="premium-lift w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-md shadow-slate-100/50">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Mobile Companion App</span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">Syllabus Overview</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">Offline Ready</span>
              </div>

              <div className="space-y-3">
                <div className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40">
                  <div>
                    <p className="text-xs font-bold text-slate-800">1. Welcome & Jharkhand Govt Syllabus</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Syllabus intro · 8m</p>
                  </div>
                  <CheckCircle size={16} className="text-emerald-500" />
                </div>
                <div className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/40">
                  <div>
                    <p className="text-xs font-bold text-slate-800">2. Time & Work Shortcut Theorems</p>
                    <p className="text-[10px] text-indigo-600 font-medium mt-0.5">Aptitude core · 22m</p>
                  </div>
                  <Play size={14} className="text-indigo-600 fill-indigo-600" />
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between opacity-60">
                  <div>
                    <p className="text-xs font-bold text-slate-800">3. Jharkhand History & JPSC Prep</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">General Studies · 45m</p>
                  </div>
                  <Lock size={14} className="text-slate-400" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
