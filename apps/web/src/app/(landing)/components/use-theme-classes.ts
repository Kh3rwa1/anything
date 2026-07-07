/**
 * Centralizes all dark/light theme class mappings for the landing page.
 * Eliminates the 20+ inline ternary expressions that were in page.tsx.
 */
export function useThemeClasses(isDark: boolean) {
  return {
    isDark,
    bg: isDark ? 'bg-brand-dark-bg text-[#f3f4f6]' : 'bg-[#f8fafc] text-[#0f172a]',
    text: isDark ? 'text-[#f3f4f6]' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
    border: isDark ? 'border-white/[0.06]' : 'border-slate-200',
    nav: isDark ? 'bg-brand-dark-bg/65 border-white/[0.06]' : 'bg-white/80 border-slate-200',
    navLink: isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900',
    logoText: isDark ? 'from-white via-slate-100 to-slate-400' : 'from-slate-900 via-slate-800 to-slate-600',
    card: isDark ? 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.04]' : 'bg-white border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50/50',
    featureCard: isDark ? 'bg-white/[0.02] border-white/[0.06] hover:border-brand-primary/30 hover:bg-white/[0.04]' : 'bg-white border-slate-200 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5',
    catalogCard: isDark ? 'bg-white/[0.01] border-white/[0.06] hover:border-white/[0.12]' : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xl',
    grid: isDark ? 'bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]',
    tabButtonActive: isDark ? 'bg-white/[0.03] border-brand-primary/40 shadow-lg shadow-brand-primary/5 text-white' : 'bg-indigo-50/75 border-brand-primary/30 shadow-sm shadow-brand-primary/5 text-indigo-900',
    tabButtonInactive: isDark ? 'bg-transparent border-transparent hover:bg-white/[0.01] text-slate-300' : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-700',
    faqRow: isDark ? 'bg-white/[0.01] border-white/[0.05]' : 'bg-white border-slate-200',
    faqQuestion: isDark ? 'text-[#f3f4f6]' : 'text-slate-900',
    faqAnswer: isDark ? 'text-slate-400' : 'text-slate-600',
    cta: isDark ? 'from-[#12102E] via-[#1E1B4B] to-[#312E81] border-white/[0.06]' : 'from-[#EEF2FF] via-[#E2E8F0] to-[#C7D2FE] border-brand-primary/20 shadow-md',
    ctaTitle: isDark ? 'text-white' : 'text-indigo-950',
    ctaSubtitle: isDark ? 'text-indigo-200' : 'text-indigo-950/80',
    ctaButton: isDark ? 'text-indigo-950 bg-brand-accent hover:bg-brand-accent/90' : 'text-white bg-brand-primary hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20',
  } as const;
}

export type ThemeClasses = ReturnType<typeof useThemeClasses>;
