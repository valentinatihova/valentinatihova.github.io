import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const proofSignals = [
    {
      label: 'Delivery',
      value: '15+ cases shipped',
      note: 'Five marketing flows moved off a legacy CRM; figures from live systems.',
      accent: true,
    },
    {
      label: 'Experience',
      value: '8+ years',
      note: 'Fintech, retail, telecom.',
      accent: false,
    },
    {
      label: 'Remote',
      value: 'Europe',
      note: 'EU work authorized. Senior IC work.',
      accent: false,
    },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-stone-900/80">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-3xl rounded-full bg-accent/[0.06] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 22 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-5xl mx-auto animate-fade-in-up"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-5 leading-[1.05] font-serif text-stone-50">
            Valentina Tihova
          </h1>

          <p className="mb-10 max-w-3xl font-serif text-[1.75rem] italic leading-[1.1] text-stone-300 md:text-[2.25rem]">
            Senior Data &amp; MarTech Engineer.
          </p>

          <p className="max-w-[62ch] font-serif text-lg leading-[1.55] text-stone-400 md:text-xl">
            Pipelines, real-time decisioning, and reporting&mdash;fintech, retail, and telecom, from design to production.
          </p>

          <div className="mt-14 mb-14 grid gap-x-14 gap-y-10 border-t border-stone-700/60 pt-12 sm:grid-cols-2 xl:grid-cols-3">
            {proofSignals.map((signal) => {
              const labelClass =
                'font-mono text-[12px] font-medium uppercase tracking-[0.28em] text-stone-300';
              const valueClass = signal.accent
                ? 'mt-3 font-serif text-[2rem] font-semibold leading-[1.05] text-stone-50 md:text-[2.25rem]'
                : 'mt-3 font-serif text-2xl font-medium leading-tight text-stone-100';
              return (
                <div key={signal.label} className="flex flex-col">
                  <div className={labelClass}>{signal.label}</div>
                  <div className={valueClass}>{signal.value}</div>
                  <div className="mt-3 text-sm leading-relaxed text-stone-400">
                    {signal.note}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 rounded border border-accent/45 bg-accent/15 px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-[0.14em] text-paper transition-all shadow-sm hover:-translate-y-0.5 hover:bg-accent/25"
            >
              <FileText className="w-4 h-4" />
              View Resume
            </Link>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded border border-stone-700 bg-transparent px-6 py-3.5 font-mono text-sm font-medium uppercase tracking-[0.14em] text-stone-200 transition-all hover:-translate-y-0.5 hover:bg-stone-800 hover:text-stone-50"
            >
              See articles
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
