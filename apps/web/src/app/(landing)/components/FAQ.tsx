import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ThemeClasses } from './use-theme-classes';
import { FAQS } from './constants';

interface FAQProps {
  theme: ThemeClasses;
}

export function FAQ({ theme }: FAQProps) {
  const { isDark } = theme;
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <section id="faq" className={`py-28 px-6 ${isDark ? 'bg-[#020205]/40' : 'bg-slate-100/50'} scroll-mt-20 relative transition-colors`}>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 reveal-on-scroll">
          <p className="text-brand-primary font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
            COMMON QUESTIONS
          </p>
          <h2 className={`text-3xl sm:text-5xl font-black ${theme.text} tracking-tight`}>
            Frequently Answered
          </h2>
        </div>

        <div className="space-y-4 reveal-on-scroll" role="region" aria-label="Frequently asked questions">
          {FAQS.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                className={`${theme.faqRow} border rounded-2xl overflow-hidden transition-colors duration-200`}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="w-full text-left p-6 flex items-center justify-between gap-4"
                >
                  <span className={`font-extrabold ${theme.faqQuestion} text-base sm:text-lg`}>{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    className={`px-6 pb-6 pt-1 border-t ${isDark ? 'border-white/[0.02]' : 'border-slate-100'} text-sm ${theme.faqAnswer} leading-relaxed font-medium animate-fadeIn`}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
