import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { trackEvent } from '../../lib/analytics';

export const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-36 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-5xl mx-auto"
        >
          <p className="mb-6 font-mono text-[12px] font-medium uppercase tracking-[0.28em] text-stone-400">
            Valencia, Spain · EU work authorized · Remote
          </p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.05] font-serif text-stone-900">
            Valentina Tihova
          </h1>

          <p className="mb-8 max-w-3xl font-serif text-[1.75rem] italic leading-[1.15] text-stone-700 md:text-[2.25rem]">
            I build data systems that don&apos;t lie<br className="hidden md:block" /> to the people who rely on them.
          </p>

          <p className="max-w-[58ch] font-serif text-lg leading-[1.6] text-stone-500 md:text-xl">
            Senior Data &amp; MarTech engineer. 8 years in fintech, retail, and telecom — from requirements to production, observable and testable.
          </p>

          <div className="mt-12 pt-10 border-t border-stone-200 flex flex-wrap items-center gap-4">
            <a
              href="/resume"
              onClick={() => trackEvent('hero_cta_click', { label: 'view_resume' })}
              className="inline-flex items-center gap-2 rounded border border-accent/50 bg-accent/10 px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-[0.14em] text-accent transition-all shadow-sm hover:-translate-y-0.5 hover:bg-accent/20"
            >
              <FileText className="w-4 h-4" />
              View Resume
            </a>
            <a
              href="#projects"
              onClick={() => trackEvent('hero_cta_click', { label: 'see_work' })}
              className="inline-flex items-center gap-2 rounded border border-stone-300 bg-transparent px-6 py-3.5 font-mono text-sm font-medium uppercase tracking-[0.14em] text-stone-600 transition-all hover:-translate-y-0.5 hover:border-stone-400 hover:text-stone-900"
            >
              See work
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
