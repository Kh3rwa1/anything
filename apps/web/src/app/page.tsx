import Link from 'next/link';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';

const STATS = [
  { val: 'Expert', label: 'Guided Courses' },
  { val: 'Flexible', label: 'Learn Anywhere' },
  { val: 'Focused', label: 'Career Preparation' },
  { val: 'Practical', label: 'Real Skills' },
];

const FEATURES = [
  {
    icon: '🎯',
    title: 'Target Company Prep',
    desc: 'Tailored roadmaps for TCS, Infosys, Google, Amazon, and 200+ companies.',
  },
  {
    icon: '🤖',
    title: 'Structured Learning',
    desc: 'Focused lessons and practical revision that help you make steady progress.',
  },
  {
    icon: '🏆',
    title: 'Certification',
    desc: 'Course completion records that help document your learning journey.',
  },
  {
    icon: '👨‍🏫',
    title: 'Experienced Mentors',
    desc: 'Learn through practical explanations from experienced instructors.',
  },
  {
    icon: '📱',
    title: 'Learn Anywhere',
    desc: 'Beautiful mobile app so you never miss a lesson on the go.',
  },
  {
    icon: '💼',
    title: 'Job Assistance',
    desc: 'Build interview confidence with focused preparation and guided practice.',
  },
];

const COURSES = [
  {
    emoji: '💻',
    cat: 'SDE Prep',
    title: 'Full Stack SDE BootCamp',
    rating: 4.9,
    students: '12,400',
    price: '₹4,999',
    badge: 'Bestseller',
    badgeColor: 'bg-amber-400 text-amber-900',
  },
  {
    emoji: '🧮',
    cat: 'Aptitude',
    title: 'Quantitative Aptitude Master',
    rating: 4.8,
    students: '9,200',
    price: '₹2,999',
    badge: 'Top Rated',
    badgeColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    emoji: '🏛️',
    cat: 'UPSC',
    title: 'Civil Services Complete 2026',
    rating: 4.9,
    students: '7,800',
    price: '₹7,999',
    badge: 'Premium',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
              <span className="font-black text-sm text-white tracking-tight">IA</span>
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">IAs Academy</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[
              ['Courses', '#courses'],
              ['Features', '#features'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/account/signin"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/account/signup"
              className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.08)_0%,_transparent_60%)]" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Practical Job Preparation
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-6">
            Land Your
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Dream Job{' '}
            </span>
            in India 🚀
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Build practical skills through focused courses, guided preparation, and a learning
            experience designed to keep you moving forward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/account/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-indigo-200 group"
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm"
              >
                <p className="text-2xl font-black text-slate-900">{s.val}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Banner */}
      <div className="bg-slate-900 py-4 overflow-hidden">
        <div className="flex items-center gap-12 animate-pulse justify-center flex-wrap px-6">
          {[
            'TCS',
            'Infosys',
            'Wipro',
            'Google',
            'Amazon',
            'Microsoft',
            'Deloitte',
            'KPMG',
            'Goldman Sachs',
            'Flipkart',
          ].map((c, i) => (
            <span key={i} className="text-slate-400 font-bold text-sm whitespace-nowrap">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-3">
              Why Students Choose Us
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Everything you need to succeed
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-3">
                Course Catalog
              </p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Explore Top Courses
              </h2>
            </div>
            <Link
              href="/account/signup"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COURSES.map((c, i) => (
              <div
                key={i}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-xl transition-all"
              >
                <div className="h-44 bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-6xl relative">
                  {c.emoji}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold ${c.badgeColor}`}
                  >
                    {c.badge}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                    {c.cat}
                  </p>
                  <h3 className="font-bold text-slate-900 mb-3 leading-snug">{c.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {c.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {c.students}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-slate-900">{c.price}</span>
                    <Link href="/account/signup" className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors">
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1E1B4B] to-[#4338CA] rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.2)_0%,_transparent_60%)]" />
          <div className="relative">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Start Building Your Skills
              <br />
              One Lesson at a Time
            </h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
              Create your account and explore the learning experience.
            </p>
            <Link
              href="/account/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-indigo-900 bg-amber-400 rounded-2xl hover:bg-amber-300 transition-all shadow-xl shadow-amber-900/30 group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="font-black text-xs text-white">IA</span>
              </div>
              <span className="font-bold text-white">IAs Academy</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 IAs Academy. Made with ❤️ in India 🇮🇳</p>
            <div className="flex items-center gap-6">
              {[
                ['Privacy', '/privacy'],
                ['Terms', '/terms'],
                ['Support', 'mailto:support@ias-academy.in'],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
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
