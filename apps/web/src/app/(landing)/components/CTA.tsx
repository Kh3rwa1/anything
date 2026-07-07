import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import type { ThemeClasses } from './use-theme-classes';

interface CTAProps {
  theme: ThemeClasses;
}

export function CTA({ theme }: CTAProps) {
  return (
    <section className="py-24 px-6 relative reveal-on-scroll">
      <div className={`max-w-5xl mx-auto bg-gradient-to-br ${theme.cta} rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden border shadow-2xl`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(226,184,87,0.08)_0%,_transparent_65%)] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex justify-center gap-1.5 mb-6" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-brand-accent text-brand-accent" />
            ))}
          </div>
          <h2 className={`text-3xl sm:text-5xl font-black ${theme.ctaTitle} tracking-tight mb-6 leading-tight`}>
            Start Preparing for Your Dream Job Today
          </h2>
          <p className={`${theme.ctaSubtitle} text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed font-semibold`}>
            Join thousands of students studying for their careers. Create your free account and start learning now!
          </p>
          <Link
            href="/account/signup"
            className={`inline-flex items-center gap-2 px-8 py-4 text-base font-black ${theme.ctaButton} rounded-2xl transition-all duration-200 active:scale-95 group`}
          >
            Start Free Registration
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
