import type { ThemeClasses } from './use-theme-classes';

interface FooterProps {
  theme: ThemeClasses;
}

export function Footer({ theme }: FooterProps) {
  const { isDark } = theme;

  return (
    <footer className={`border-t ${theme.border} ${isDark ? 'bg-[#020205]/40' : 'bg-white'} py-16 px-6 relative transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-primary via-purple-600 to-brand-accent rounded-xl flex items-center justify-center">
              <span className="font-black text-xs text-white">IA</span>
            </div>
            <span className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>IAs Academy</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
            © 2026 IAs Academy. Made with ❤️ in India 🇮🇳
          </p>
          <nav aria-label="Footer navigation" className="flex items-center gap-6">
            {[
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
              ['Support Center', 'mailto:support@ias-academy.in'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
