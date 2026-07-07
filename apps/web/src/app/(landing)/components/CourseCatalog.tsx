import Link from 'next/link';
import { ArrowRight, Star, Users } from 'lucide-react';
import type { ThemeClasses } from './use-theme-classes';
import { COURSES, PARTNERS } from './constants';

interface CourseCatalogProps {
  theme: ThemeClasses;
}

export function CourseCatalog({ theme }: CourseCatalogProps) {
  const { isDark } = theme;

  return (
    <>
      {/* Brand Placement Slider */}
      <div className="border-y border-slate-200 bg-slate-50 py-6 overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-6 mb-4">
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">
            Jharkhand Govt Exams & Local Placements Covered
          </p>
        </div>
        <div className="relative w-full flex items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
          <div className="flex gap-16 whitespace-nowrap animate-marquee py-2">
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
              <span
                key={i}
                className="font-black text-lg sm:text-xl tracking-wider text-slate-400 uppercase select-none hover:text-indigo-600 transition-colors duration-200"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Grid Section */}
      <section id="courses" className={`py-28 px-6 border-t ${theme.border} ${isDark ? 'bg-gradient-to-b from-[#020205]/40 to-brand-dark-bg' : 'bg-gradient-to-b from-slate-100 to-white'} scroll-mt-20 relative transition-colors`}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 reveal-on-scroll">
            <div>
              <p className="text-brand-primary font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
                COURSES
              </p>
              <h2 className={`text-3xl sm:text-5xl font-black ${theme.text} tracking-tight leading-tight`}>
                Popular Online Courses
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
                className="group border border-slate-200 hover:border-indigo-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/[0.03] rounded-3xl overflow-hidden transition-all duration-300 bg-white"
              >
                {/* Course Header Image */}
                <div className="h-40 bg-slate-50 border-b border-slate-100 flex flex-col items-center justify-center relative p-6">
                  <div className="w-12 h-12 bg-white border border-slate-200 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-2 shadow-sm">
                    {c.emoji}
                  </div>
                  <span
                    className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider bg-indigo-50 border-indigo-100 text-indigo-700"
                  >
                    {c.badge}
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1.5">
                    {c.cat}
                  </p>
                  <h3 className="font-extrabold text-slate-900 text-xl mb-4 leading-snug tracking-tight">
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

                  <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="text-xl font-black text-slate-900">{c.price}</span>
                    <Link
                      href="/account/signup"
                      className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
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
    </>
  );
}
