'use client';

import { useState, useEffect } from 'react';
import {
  Navbar,
  Hero,
  Features,
  CourseCatalog,
  AppPreview,
  FAQ,
  CTA,
  Footer,
  useThemeClasses,
} from './(landing)/components';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';
  const tc = useThemeClasses(isDark);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-hidden selection:bg-indigo-600/30 selection:text-white relative">
      <Navbar
        theme={tc}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onThemeToggle={() => setTheme(isDark ? 'light' : 'dark')}
        showInstallBtn={showInstallBtn}
        onInstallClick={handleInstallClick}
      />
      <main role="main">
        <Hero theme={tc} onInstallClick={handleInstallClick} />
        <CourseCatalog theme={tc} />
        <Features theme={tc} />
        <AppPreview theme={tc} />
        <FAQ theme={tc} />
        <CTA theme={tc} />
      </main>
      <Footer theme={tc} />
    </div>
  );
}
