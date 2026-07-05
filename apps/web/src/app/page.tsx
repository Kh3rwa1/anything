'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Star,
  Users,
  Zap,
  BookOpen,
  Play,
  Lock,
  ChevronDown,
  Award,
  ShieldCheck,
  CheckCircle,
  Clock,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';

const STATS = [
  { val: 'Expert', label: 'Mentors & IAS Guides' },
  { val: 'Flexible', label: 'Mobile Learning Platform' },
  { val: 'Focused', label: 'Company Placement Prep' },
  { val: 'Practical', label: 'Real-World Case Studies' },
];

const FEATURES = [
  {
    icon: '🎯',
    title: 'Target Company Roadmaps',
    desc: 'Structured curricula custom-tailored for TCS, Infosys, Wipro, Google, Amazon, and 200+ top-tier employers.',
  },
  {
    icon: '🧠',
    title: 'Cognitive Learning Loops',
    desc: 'Bite-sized, focused lessons structured to fit into busy schedules, backed by interactive retrieval quizzes.',
  },
  {
    icon: '🏆',
    title: 'Verifiable Credentials',
    desc: 'Gain industry-recognized completion certificates to showcase on LinkedIn and build your professional resume.',
  },
  {
    icon: '👨‍💼',
    title: 'IAS & Industry Mentors',
    desc: 'Learn through real-world breakdowns from veteran engineers, MBA alumni, and senior civil servants.',
  },
  {
    icon: '📱',
    title: 'PWA & Native App Sync',
    desc: 'Install the web client on any desktop/mobile device or take it on the go with our fully synchronized Expo mobile app.',
  },
  {
    icon: '💼',
    title: 'Interview Command Center',
    desc: 'Simulated mock panels, quantitative aptitude practice, and soft skills training to build ultimate interview day confidence.',
  },
];

const COURSES = [
  {
    emoji: '💻',
    cat: 'SDE PREPARATION',
    title: 'Full Stack SDE BootCamp',
    rating: 4.9,
    students: '12,400',
    price: '₹4,999',
    badge: 'Bestseller',
    badgeColor: 'bg-brand-accent/20 border-brand-accent/30 text-brand-accent dark:text-brand-accent',
    glow: 'group-hover:shadow-brand-accent/10',
  },
  {
    emoji: '🧮',
    cat: 'PLACEMENT CORE',
    title: 'Quantitative Aptitude Master',
    rating: 4.8,
    students: '9,200',
    price: '₹2,999',
    badge: 'Top Rated',
    badgeColor: 'bg-brand-primary/20 border-brand-primary/30 text-brand-primary dark:text-brand-primary',
    glow: 'group-hover:shadow-brand-primary/10',
  },
  {
    emoji: '🏛️',
    cat: 'CIVIL SERVICES',
    title: 'Civil Services Complete 2026',
    rating: 4.9,
    students: '7,800',
    price: '₹7,999',
    badge: 'Premium',
    badgeColor: 'bg-purple-500/20 border-purple-500/30 text-purple-600 dark:text-purple-300',
    glow: 'group-hover:shadow-purple-500/10',
  },
];

const FAQS = [
  {
    q: 'Can I learn offline using the mobile app?',
    a: 'Yes! The native Expo mobile app allows you to download lesson materials and review syllabus contents offline. Progress automatically syncs back once you reconnect.',
  },
  {
    q: 'How do course access codes work?',
    a: 'Access codes are distributed by collaborating colleges, institutes, or during promotions. Entering a valid code during checkout will instantly enroll you in the catalog course for free or at a high discount.',
  },
  {
    q: 'Is there direct mentorship from instructors?',
    a: 'Absolutely. We organize bi-weekly mock panels and Q&A sessions where you can get direct guidance from industry leads and IAS coaches.',
  },
  {
    q: 'Are certificates shareable on professional networks?',
    a: 'Yes, all earned certificates include unique tracking hashes and can be verified and directly embedded into your LinkedIn profile.',
  },
];

const PARTNERS = [
  'TCS', 'Infosys', 'Wipro', 'Google', 'Amazon', 'Microsoft', 
  'Deloitte', 'KPMG', 'Flipkart', 'TATA', 'Reliance'
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mockAppTab, setMockAppTab] = useState<'syllabus' | 'audio' | 'iap'>('syllabus');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
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

  // Conditional theme styling classes with premium custom colors
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-brand-dark-bg text-[#f3f4f6]' : 'bg-[#f8fafc] text-[#0f172a]';
  const textClass = isDark ? 'text-[#f3f4f6]' : 'text-slate-900';
  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderClass = isDark ? 'border-white/[0.06]' : 'border-slate-200';
  const navClass = isDark ? 'bg-brand-dark-bg/65 border-white/[0.06]' : 'bg-white/80 border-slate-200';
  const navLinkClass = isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900';
  const logoTextClass = isDark ? 'from-white via-slate-100 to-slate-400' : 'from-slate-900 via-slate-800 to-slate-600';
  const cardClass = isDark ? 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.04]' : 'bg-white border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50/50';
  const featureCardClass = isDark ? 'bg-white/[0.02] border-white/[0.06] hover:border-brand-primary/30 hover:bg-white/[0.04]' : 'bg-white border-slate-200 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5';
  const catalogCardClass = isDark ? 'bg-white/[0.01] border-white/[0.06] hover:border-white/[0.12]' : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xl';
  const gridClass = isDark ? 'bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]';
  const tabButtonActive = isDark ? 'bg-white/[0.03] border-brand-primary/40 shadow-lg shadow-brand-primary/5 text-white' : 'bg-indigo-50/75 border-brand-primary/30 shadow-sm shadow-brand-primary/5 text-indigo-900';
  const tabButtonInactive = isDark ? 'bg-transparent border-transparent hover:bg-white/[0.01] text-slate-300' : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-700';
  const faqRowClass = isDark ? 'bg-white/[0.01] border-white/[0.05]' : 'bg-white border-slate-200';
  const faqQuestionClass = isDark ? 'text-[#f3f4f6]' : 'text-slate-900';
  const faqAnswerClass = isDark ? 'text-slate-400' : 'text-slate-600';
  const ctaClass = isDark ? 'from-[#12102E] via-[#1E1B4B] to-[#312E81] border-white/[0.06]' : 'from-[#EEF2FF] via-[#E2E8F0] to-[#C7D2FE] border-brand-primary/20 shadow-md';
  const ctaTitleClass = isDark ? 'text-white' : 'text-indigo-950';
  const ctaSubtitleClass = isDark ? 'text-indigo-200' : 'text-indigo-950/80';
  const ctaButtonClass = isDark ? 'text-indigo-950 bg-brand-accent hover:bg-brand-accent/90' : 'text-white bg-brand-primary hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20';

  return (
    <div className={`min-h-screen ${bgClass} font-sans overflow-hidden selection:bg-brand-primary/30 selection:text-white relative transition-colors duration-300`}>
      
      {/* Background Matrix & Grid Mesh */}
      <div className={`absolute inset-0 ${gridClass} pointer-events-none`} />
      
      {isDark && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,91,255,0.12)_0%,_transparent_55%)] pointer-events-none" />
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[30%] left-[-15%] w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[140px] pointer-events-none" />
        </>
      )}

      {/* Premium Header */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${navClass} backdrop-blur-xl border-b px-6 py-4 transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary via-purple-600 to-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 border border-white/10">
              <span className="font-black text-sm text-white tracking-tight">IA</span>
            </div>
            <span className={`font-extrabold text-xl tracking-tight bg-gradient-to-r ${logoTextClass} bg-clip-text text-transparent`}>
              IAs Academy
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#courses" className={`text-sm font-semibold ${navLinkClass} transition-colors duration-200`}>
              Courses
            </a>
            <a href="#features" className={`text-sm font-semibold ${navLinkClass} transition-colors duration-200`}>
              Platform Features
            </a>
            <a href="#experience" className={`text-sm font-semibold ${navLinkClass} transition-colors duration-200`}>
              Mobile App
            </a>
            <a href="#faq" className={`text-sm font-semibold ${navLinkClass} transition-colors duration-200`}>
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-xl border transition-colors ${
                isDark 
                  ? 'bg-white/[0.03] border-white/[0.08] text-brand-accent hover:text-brand-accent/90' 
                  : 'bg-slate-100 border-slate-200 text-brand-primary hover:text-brand-primary/90'
              }`}
              title="Toggle theme mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className={`text-sm font-extrabold px-3 py-1.5 rounded-lg border transition-all active:scale-95 flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent hover:bg-brand-accent/20'
                    : 'bg-indigo-50 border-indigo-200 text-brand-primary hover:bg-indigo-100'
                }`}
              >
                Install App
              </button>
            )}

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
          </div>

          {/* Mobile Toggle Panel */}
          <div className="flex items-center gap-3 md:hidden">
            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
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
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
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
                  handleInstallClick();
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
              <Link
                href="/account/signin"
                className={`w-full text-center py-2.5 text-sm font-bold ${isDark ? 'text-slate-300 border-white/[0.08] bg-white/[0.02]' : 'text-slate-700 border-slate-200 bg-slate-50'} border rounded-xl`}
              >
                Sign In
              </Link>
              <Link
                href="/account/signup"
                className="w-full text-center py-2.5 text-sm font-bold text-white bg-brand-primary rounded-xl"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-28 px-6 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Accent Pill */}
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary dark:text-brand-primary text-[10px] sm:text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full mb-8 shadow-[0_0_15px_rgba(99,91,255,0.05)] animate-hero-fade-up">
            <Zap className="w-3.5 h-3.5 fill-brand-primary/60 text-brand-primary" />
            Pioneering Job Preparation Platform
          </div>

          {/* Main Title */}
          <h1 className={`text-4xl sm:text-6xl md:text-8xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tighter leading-[1.02] mb-8 select-none animate-hero-fade-up [animation-delay:150ms]`}>
            Architecting Your
            <br />
            <span className="bg-gradient-to-r from-brand-primary via-purple-500 to-brand-accent bg-clip-text text-transparent filter drop-shadow-sm">
              Placement Success
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-base sm:text-xl ${textMutedClass} max-w-3xl mx-auto leading-relaxed mb-12 font-medium animate-hero-fade-up [animation-delay:300ms]`}>
            Acquire role-ready competency. Step-by-step masterclasses, expert aptitude roadmaps, 
            and deep-dive syllabus tracking built to help you outshine the competition.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 animate-hero-fade-up [animation-delay:450ms]">
            <Link
              href="/account/signup"
              className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-black text-white bg-gradient-to-r from-brand-primary via-brand-primary to-purple-600 rounded-2xl transition-all duration-300 shadow-xl shadow-brand-primary/35 border border-white/10 hover:shadow-brand-primary/50 hover:scale-[1.02] active:scale-95 group"
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <button
              onClick={handleInstallClick}
              className={`px-8 py-4 text-base font-bold ${isDark ? 'text-slate-300 bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]' : 'text-slate-700 bg-slate-100 border-slate-200 hover:bg-slate-200'} border rounded-2xl transition-all duration-200`}
            >
              Install PWA Client
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto reveal-on-scroll">
            {STATS.map((s, i) => (
              <div
                key={i}
                className={`${cardClass} border rounded-2xl px-6 py-5 text-center backdrop-blur-md transition-all duration-200`}
              >
                <p className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.val}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Placement Slider */}
      <div className={`border-y ${borderClass} ${isDark ? 'bg-[#020205]/40' : 'bg-slate-100/50'} py-8 transition-colors`}>
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-6">
            ALUMNI PLACED AT THE FOREFRONT OF INDUSTRY
          </p>
          <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-12 sm:gap-x-16 opacity-50">
            {PARTNERS.map((p, i) => (
              <span 
                key={i} 
                className={`font-black text-lg tracking-wider transition-opacity cursor-default uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <section id="features" className="py-28 px-6 scroll-mt-20 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20 reveal-on-scroll">
            <p className="text-brand-primary font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
              ACADEMY EDGE
            </p>
            <h2 className={`text-3xl sm:text-5xl font-black ${textClass} tracking-tight leading-tight`}>
              A Complete Platform Ecosystem
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mt-3">
              We did away with the clutter. Explore a platform built with pure utility to accelerate your job prep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-on-scroll">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`group p-8 ${featureCardClass} border rounded-3xl transition-all duration-300 shadow-sm backdrop-blur-md`}
              >
                <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl border border-brand-primary/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(99,91,255,0.2)] transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} text-lg mb-3 tracking-tight`}>{f.title}</h3>
                <p className={`text-sm ${textMutedClass} leading-relaxed font-medium`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section id="courses" className={`py-28 px-6 border-t ${borderClass} ${isDark ? 'bg-gradient-to-b from-[#020205]/40 to-brand-dark-bg' : 'bg-gradient-to-b from-slate-100 to-white'} scroll-mt-20 relative transition-colors`}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 reveal-on-scroll">
            <div>
              <p className="text-brand-primary font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
                CATALOG
              </p>
              <h2 className={`text-3xl sm:text-5xl font-black ${textClass} tracking-tight leading-tight`}>
                Curated Placement Masterclasses
              </h2>
            </div>
            <Link
              href="/account/signup"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary/80 transition-colors group"
            >
              Explore Full Catalog
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-on-scroll">
            {COURSES.map((c, i) => (
              <div
                key={i}
                className={`group ${catalogCardClass} border rounded-3xl overflow-hidden shadow-sm transition-all duration-300 ${c.glow}`}
              >
                {/* Course Header Mock Image */}
                <div className={`h-48 bg-gradient-to-br ${isDark ? 'from-brand-primary/20 via-purple-900/30 to-brand-accent/10 border-b border-white/[0.04]' : 'from-indigo-100 via-indigo-50 to-amber-50/40 border-b border-slate-100'} flex items-center justify-center text-7xl relative group-hover:scale-102 transition-transform duration-300`}>
                  <span className="opacity-95 select-none">{c.emoji}</span>
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${c.badgeColor}`}
                  >
                    {c.badge}
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1.5">
                    {c.cat}
                  </p>
                  <h3 className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} text-xl mb-4 leading-snug tracking-tight`}>
                    {c.title}
                  </h3>
                  
                  {/* Rating + Students details */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-brand-accent text-brand-accent" />
                      {c.rating}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-brand-primary" />
                      {c.students} Students
                    </span>
                  </div>

                  <div className={`flex items-center justify-between border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-100'} pt-5`}>
                    <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.price}</span>
                    <Link 
                      href="/account/signup" 
                      className="px-5 py-2.5 text-xs font-black text-white bg-brand-primary hover:bg-brand-primary/90 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-primary/20 active:scale-95"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Mobile Experience Section (CSS Mockup + App Feature Switcher) */}
      <section id="experience" className={`py-28 px-6 border-t ${borderClass} scroll-mt-20 relative`}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center reveal-on-scroll">
            
            {/* Context Switcher & Details */}
            <div className="order-2 lg:order-1">
              <p className="text-brand-primary font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
                LEARNER APP EXPERIENCE
              </p>
              <h2 className={`text-3xl sm:text-5xl font-black ${textClass} tracking-tight leading-tight mb-6`}>
                Mobile Learning Native Ecosystem
              </h2>
              <p className={`${textMutedClass} leading-relaxed font-medium mb-8`}>
                Take your courses on the road. We engineered a native Expo mobile companion application to keep your curriculum fully accessible on iOS and Android devices.
              </p>

              {/* Tabs */}
              <div className="space-y-4">
                {[
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
                ].map((tab) => {
                  const isActive = mockAppTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setMockAppTab(tab.id)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                        isActive 
                          ? tabButtonActive 
                          : tabButtonInactive
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

            {/* Premium SmartPhone Mockup Component */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-[310px] h-[610px] bg-slate-900 rounded-[50px] p-3 border-4 border-slate-700 shadow-2xl shadow-brand-primary/10 flex-shrink-0">
                {/* Dynamic Screen Area */}
                <div className="w-full h-full bg-[#0a0a0f] rounded-[40px] overflow-hidden border border-slate-800 relative flex flex-col justify-between">
                  
                  {/* Status Bar */}
                  <div className="h-6 px-6 bg-slate-950 flex items-center justify-between z-20 text-[9px] font-bold text-slate-500">
                    <span>10:32 AM</span>
                    <div className="w-16 h-3 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1.5" /> {/* Camera notch */}
                    <div className="flex items-center gap-1.5">
                      <span>LTE</span>
                      <div className="w-4 h-2 bg-slate-600 rounded-sm" />
                    </div>
                  </div>

                  {/* Dynamic Screen Mockup Content */}
                  <div className="flex-1 p-4 overflow-y-auto z-10 flex flex-col justify-between pt-5">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">IA MOBILE</p>
                        <h5 className="text-sm font-extrabold text-white">Course Overview</h5>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs">👤</span>
                    </div>

                    {/* App Tabs Context */}
                    <div className="flex-1 flex flex-col justify-center gap-4 py-3">
                      {mockAppTab === 'syllabus' && (
                        <div className="space-y-2.5 animate-fadeIn">
                          <div className="h-16 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-white">1. Welcome & Environment</p>
                              <p className="text-[10px] text-brand-primary mt-0.5">Syllabus intro · 8m</p>
                            </div>
                            <CheckCircle size={14} className="text-emerald-400" />
                          </div>
                          <div className="h-16 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-white">2. Complexity Analysis</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">DSA core · 22m</p>
                            </div>
                            <Play size={12} className="text-brand-primary fill-brand-primary" />
                          </div>
                          <div className="h-16 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between opacity-55">
                            <div>
                              <p className="text-xs font-bold text-slate-300">3. Master Theorem</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Math core · 18m</p>
                            </div>
                            <Lock size={12} className="text-slate-600" />
                          </div>
                        </div>
                      )}

                      {mockAppTab === 'audio' && (
                        <div className="bg-brand-primary/20 border border-brand-primary/20 rounded-2xl p-4 text-center animate-fadeIn">
                          <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-brand-primary/30">
                            <Clock className="w-5 h-5 text-brand-primary" />
                          </div>
                          <h6 className="text-xs font-extrabold text-white">Download Cache Active</h6>
                          <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                            All SDE lessons downloaded locally. You can study offline during transit.
                          </p>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div className="bg-brand-primary h-full w-2/3 rounded-full" />
                          </div>
                          <span className="text-[9px] text-brand-primary font-bold block mt-2">68% COMPLETE</span>
                        </div>
                      )}

                      {mockAppTab === 'iap' && (
                        <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-2xl p-4 text-center animate-fadeIn">
                          <Award className="w-8 h-8 text-brand-accent mx-auto mb-2" />
                          <h6 className="text-xs font-extrabold text-brand-accent">Lifetime Pass Enabled</h6>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Fully synced with RevenueCat play subscriptions. Unlimited course resets.
                          </p>
                          <span className="inline-block bg-brand-accent text-slate-950 font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider mt-3">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>

                    {/* App Navigation Footer */}
                    <div className="border-t border-white/[0.04] pt-3 flex items-center justify-around text-slate-500">
                      <div className="text-center">
                        <BookOpen size={14} className="mx-auto text-brand-primary" />
                        <span className="text-[8px] font-bold block mt-1 text-brand-primary">Study</span>
                      </div>
                      <div className="text-center">
                        <Star size={14} className="mx-auto" />
                        <span className="text-[8px] font-bold block mt-1">Catalog</span>
                      </div>
                      <div className="text-center">
                        <Award size={14} className="mx-auto" />
                        <span className="text-[8px] font-bold block mt-1">Awards</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faq" className={`py-28 px-6 ${isDark ? 'bg-[#020205]/40' : 'bg-slate-100/50'} scroll-mt-20 relative transition-colors`}>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 reveal-on-scroll">
            <p className="text-brand-primary font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
              COMMON QUESTIONS
            </p>
            <h2 className={`text-3xl sm:text-5xl font-black ${textClass} tracking-tight`}>
              Frequently Answered
            </h2>
          </div>

          <div className="space-y-4 reveal-on-scroll">
            {FAQS.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div
                  key={i}
                  className={`${faqRowClass} border rounded-2xl overflow-hidden transition-colors duration-200`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4"
                  >
                    <span className={`font-extrabold ${faqQuestionClass} text-base sm:text-lg`}>{faq.q}</span>
                    <ChevronDown 
                      size={20} 
                      className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`} 
                    />
                  </button>
                  {isOpen && (
                    <div className={`px-6 pb-6 pt-1 border-t ${isDark ? 'border-white/[0.02]' : 'border-slate-100'} text-sm ${faqAnswerClass} leading-relaxed font-medium animate-fadeIn`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-24 px-6 relative reveal-on-scroll">
        <div className={`max-w-5xl mx-auto bg-gradient-to-br ${ctaClass} rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden border shadow-2xl`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(226,184,87,0.08)_0%,_transparent_65%)] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-center gap-1.5 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-brand-accent text-brand-accent" />
              ))}
            </div>
            <h2 className={`text-3xl sm:text-5xl font-black ${ctaTitleClass} tracking-tight mb-6 leading-tight`}>
              Start Masterclass Preparation
              <br />
              Secure Your Staging Candidate
            </h2>
            <p className={`${ctaSubtitleClass} text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed font-semibold`}>
              Join thousands of placed students. Establish your student console credentials, and deploy your career plan instantly.
            </p>
            <Link
              href="/account/signup"
              className={`inline-flex items-center gap-2 px-8 py-4 text-base font-black ${ctaButtonClass} rounded-2xl transition-all duration-200 active:scale-95 group`}
            >
              Start Free Registration
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${borderClass} ${isDark ? 'bg-[#020205]/40' : 'bg-white'} py-16 px-6 relative transition-colors duration-300`}>
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
            <div className="flex items-center gap-6">
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
