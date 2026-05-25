import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { trackEvent } from '../../lib/analytics';

export const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">

      {/* Background watermark */}
      <div
        aria-hidden="true"
        className="absolute right-[-1rem] top-[-1rem] select-none pointer-events-none font-serif font-bold text-stone-100 leading-none"
        style={{ fontSize: 'clamp(8rem, 22vw, 18rem)', letterSpacing: '-0.05em', opacity: 0.55 }}
      >
        DATA
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-5xl mx-auto"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-6 bg-stone-400" aria-hidden="true" />
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-stone-400">
              Senior Data &amp; MarTech Engineer
            </p>
          </div>

          {/* Name */}
          <div className="mb-6">
            <div className="flex items-end justify-between gap-4">
              <h1
                className="font-serif font-bold text-stone-900 leading-[0.88]"
                style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', letterSpacing: '-0.04em' }}
              >
                Valentina
              </h1>
              <div className="hidden md:block text-right font-serif italic text-sm text-stone-400 leading-relaxed pb-3 shrink-0">
                8 years in fintech,<br />retail &amp; telecom
              </div>
            </div>
            <h1
              className="font-serif font-bold text-stone-900 leading-[0.88]"
              style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', letterSpacing: '-0.04em' }}
            >
              Tihova
            </h1>
          </div>

          {/* Geometric rule */}
          <div className="flex items-center gap-3 my-8">
            <div className="h-0.5 w-7 bg-stone-900 shrink-0" />
            <div className="h-px flex-1 bg-stone-200" />
            <div
              aria-hidden="true"
              className="w-1.5 h-1.5 border border-stone-400 shrink-0"
              style={{ transform: 'rotate(45deg)' }}
            />
            <div className="h-px w-10 bg-stone-200 shrink-0" />
          </div>

          {/* Tagline */}
          <div className="mb-10">
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-stone-400 mb-3">
              — Statement
            </p>
            <p className="font-serif italic text-2xl md:text-3xl text-stone-600 leading-[1.3] max-w-2xl">
              I build data systems that don&apos;t{' '}
              <em className="not-italic text-stone-900 font-semibold">lie</em>
              <br className="hidden md:block" />
              {' '}to the people who rely on them.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-8 border-t border-stone-200">
            <div className="flex items-center gap-5 flex-wrap">
              <a
                href="/resume"
                onClick={() => trackEvent('hero_cta_click', { label: 'view_resume' })}
                className="inline-flex items-center gap-2 border border-stone-900 bg-transparent px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-stone-900 transition-all hover:bg-stone-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <FileText className="w-3.5 h-3.5" />
                View Resume
              </a>
              <a
                href="#projects"
                onClick={() => trackEvent('hero_cta_click', { label: 'see_work' })}
                className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-stone-500 transition-colors hover:text-stone-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                See work
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Valencia, Spain · Remote · EU Auth
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
