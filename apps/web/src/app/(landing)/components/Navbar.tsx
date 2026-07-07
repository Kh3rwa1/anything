import Link from 'next/link';
import { Sun, Moon, Menu, X } from 'lucide-react';
import type { ThemeClasses } from './use-theme-classes';
import { useSession } from '@/lib/auth-client';

interface NavbarProps {
  theme: ThemeClasses;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onThemeToggle: () => void;
  showInstallBtn: boolean;
  onInstallClick: () => void;
}

export function Navbar({
  theme,
  mobileMenuOpen,
  setMobileMenuOpen,
  onThemeToggle,
  showInstallBtn,
  onInstallClick,
}: NavbarProps) {
  const { isDark } = theme;
  const { data: session } = useSession();

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 ${theme.nav} backdrop-blur-xl border-b px-6 py-4 transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary via-purple-600 to-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 border border-white/10">
            <span className="font-black text-sm text-white tracking-tight">IA</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            IAs Academy
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#courses" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200">
            Courses
          </a>
          <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200">
            Platform Features
          </a>
          <a href="#experience" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200">
            Mobile App
          </a>
          <a href="#faq" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200">
            FAQ
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {showInstallBtn && (
            <button
              onClick={onInstallClick}
              aria-label="Install app"
              className={`text-sm font-extrabold px-3 py-1.5 rounded-lg border transition-all active:scale-95 flex items-center gap-1.5 ${
                isDark
                  ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent hover:bg-brand-accent/20'
                  : 'bg-indigo-50 border-indigo-200 text-brand-primary hover:bg-indigo-100'
              }`}
            >
              Install App
            </button>
          )}

          {session?.user ? (
            <>
              {session.user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="px-5 py-2.5 text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/account/logout"
                className={`text-sm font-bold ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors duration-200`}
              >
                Sign Out
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/account/signin"
                className={`text-sm font-bold ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors duration-200`}
              >
                Sign In
              </Link>
              <Link
                href="/account/signup"
                className="px-5 py-2.5 text-sm font-extrabold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-xl transition-all duration-200 border border-white/10 hover:shadow-lg hover:shadow-brand-primary/25 active:scale-95"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Panel */}
        <div className="flex items-center gap-3 md:hidden">
          {showInstallBtn && (
            <button
              onClick={onInstallClick}
              aria-label="Install app"
              className={`text-xs font-extrabold px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 ${
                isDark
                  ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent hover:bg-brand-accent/20'
                  : 'bg-indigo-50 border-indigo-200 text-brand-primary hover:bg-indigo-100'
              }`}
            >
              Install
            </button>
          )}
          <button
            onClick={onThemeToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-white/[0.03] border-white/[0.08] text-brand-accent'
                : 'bg-slate-100 border-slate-200 text-brand-primary'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className={`p-2 ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'} transition-colors`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 pb-2 border-t border-white/[0.06] flex flex-col gap-4 animate-fadeIn">
          <a
            href="#courses"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm font-semibold ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} px-2`}
          >
            Courses
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm font-semibold ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} px-2`}
          >
            Platform Features
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm font-semibold ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} px-2`}
          >
            Mobile App
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm font-semibold ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} px-2`}
          >
            FAQ
          </a>
          {showInstallBtn && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onInstallClick();
              }}
              className={`text-sm font-extrabold py-2.5 rounded-xl border text-center mx-2 transition-all ${
                isDark
                  ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent'
                  : 'bg-indigo-50 border-indigo-200 text-brand-primary'
              }`}
            >
              Install App PWA
            </button>
          )}
          <div className={`h-px ${isDark ? 'bg-white/[0.06]' : 'bg-slate-200'} my-1`} />
          <div className="flex flex-col gap-2.5 px-2">
            {session?.user ? (
              <>
                {session.user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/account/logout"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-center py-2.5 text-sm font-bold ${isDark ? 'text-slate-300 border-white/[0.08] bg-white/[0.02]' : 'text-slate-700 border-slate-200 bg-slate-50'} border rounded-xl`}
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/account/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-center py-2.5 text-sm font-bold ${isDark ? 'text-slate-300 border-white/[0.08] bg-white/[0.02]' : 'text-slate-700 border-slate-200 bg-slate-50'} border rounded-xl`}
                >
                  Sign In
                </Link>
                <Link
                  href="/account/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-white bg-brand-primary rounded-xl"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
