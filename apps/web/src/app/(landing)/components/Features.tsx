import type { ThemeClasses } from './use-theme-classes';
import { FEATURES } from './constants';

interface FeaturesProps {
  theme: ThemeClasses;
}

export function Features({ theme }: FeaturesProps) {
  const { isDark } = theme;
  return (
    <section id="features" className="py-28 px-6 scroll-mt-20 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 reveal-on-scroll">
          <p className="text-brand-primary font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
            WHY CHOOSE US
          </p>
          <h2 className={`text-3xl sm:text-5xl font-black ${theme.text} tracking-tight leading-tight`}>
            Simple & Useful Learning Features
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mt-3">
            We made our learning app very clean. No complex menus, just pure study materials to help you get placed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-on-scroll">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`premium-lift group p-8 border rounded-3xl transition-all duration-300 shadow-sm ${theme.featureCard}`}
              style={{ transitionDelay: `${i * 45}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(99,91,255,0.1)] transition-all duration-300 ${isDark ? 'bg-indigo-400/10 border-indigo-300/10' : 'bg-indigo-50 border-indigo-100'}`}>
                {f.icon}
              </div>
              <h3 className={`font-extrabold text-lg mb-3 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.title}</h3>
              <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
