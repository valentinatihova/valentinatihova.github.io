import React, { useState, useEffect } from 'react';
import { ExternalLink, Send, X } from 'lucide-react';
import { profile } from '../../data/profile';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { SITE_URL } from '../../config/site';
import { trackEvent } from '../../lib/analytics';

/* ── shared editorial section-header ── */
const SectionHeader = ({ num, label }: { num: string; label: string }) => (
  <div className="flex items-center gap-6 mb-10 border-t border-stone-200 pt-10">
    <div className="shrink-0">
      <p className="font-mono text-[10px] tracking-[0.22em] text-stone-500 mb-1">{num}</p>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600">{label}</p>
    </div>
    <div className="flex items-center gap-3 flex-1">
      <div className="h-0.5 w-6 bg-stone-900 shrink-0" />
      <div className="h-px flex-1 bg-stone-200" />
      <div
        aria-hidden="true"
        className="w-1.5 h-1.5 border border-stone-400 shrink-0"
        style={{ transform: 'rotate(45deg)' }}
      />
    </div>
  </div>
);

export const Resume: React.FC = () => {
  const [activeCertificationIndex, setActiveCertificationIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useDocumentHead({
    title: 'Resume | Valentina Tihova — Senior Data & MarTech Engineer',
    description:
      'Resume for Valentina Tihova, Senior Data & MarTech Engineer. Eight years in fintech, retail, and telecom. Remote in Europe, EU work authorized.',
    url: `${SITE_URL}/resume`,
  });

  const activeCertification =
    activeCertificationIndex !== null ? profile.certifications?.[activeCertificationIndex] : null;

  // Close the certificate preview on Escape.
  useEffect(() => {
    if (activeCertificationIndex === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveCertificationIndex(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeCertificationIndex]);

  const renderCertificationPreview = () => {
    if (!activeCertification) return null;
    const previewUrl = activeCertification.previewUrl?.trim();
    if (!previewUrl) {
      return (
        <div className="flex min-h-[320px] items-center justify-center border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone-500">Preview not attached</p>
            <p className="mt-3 max-w-md font-serif text-stone-600 leading-relaxed text-sm">
              Place file in <code className="font-mono text-xs">public/certificates/</code> and set{' '}
              <code className="font-mono text-xs">previewUrl</code> in <code className="font-mono text-xs">profile.ts</code>.
            </p>
          </div>
        </div>
      );
    }
    if (previewUrl.toLowerCase().endsWith('.pdf')) {
      return (
        <iframe
          src={previewUrl}
          title={activeCertification.name}
          className="h-[65vh] w-full border border-stone-200 bg-white"
        />
      );
    }
    return (
      <div className="border border-stone-200 bg-stone-50 p-2">
        <img
          src={previewUrl}
          alt={activeCertification.name}
          className="max-h-[65vh] w-full object-contain"
        />
      </div>
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 pt-16 pb-24 max-w-5xl">

        {/* ── Page header ── */}
        <div className="mb-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-6 bg-stone-400" aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500">01 — Resume / CV</p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <h1
                className="font-serif font-bold text-stone-900 leading-[0.9] mb-4"
                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.03em' }}
              >
                {profile.name}
              </h1>
              <p className="font-serif italic text-xl md:text-2xl text-stone-500 leading-snug">
                {profile.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="/Valentina_Tihova_CV.html"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('cv_open', { label: 'html_cv' })}
                className="inline-flex items-center gap-2 border border-stone-900 bg-stone-900 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-white transition-all hover:bg-white hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open CV
              </a>
              <a
                href={profile.telegram.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('social_click', { label: 'telegram_resume' })}
                className="inline-flex items-center gap-2 border border-stone-300 bg-transparent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-600 transition-all hover:border-stone-900 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Send className="w-3.5 h-3.5" />
                Telegram
              </a>
            </div>
          </div>
        </div>

        {/* ── Metadata strip ── */}
        <div className="border-y border-stone-200 py-5 mb-16">
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
            <span>{profile.location}</span>
            <span>{profile.hiringContext}</span>
            <span>{profile.workAuthorization}</span>
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" onClick={() => trackEvent('social_click', { label: 'linkedin_resume' })} className="transition-colors hover:text-stone-900">LinkedIn</a>
            <a href={profile.telegram.url} target="_blank" rel="noreferrer" onClick={() => trackEvent('social_click', { label: 'telegram_strip' })} className="transition-colors hover:text-stone-900">{profile.telegram.handle}</a>
          </div>
        </div>

        {/* ── Role intro ── */}
        <section className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-stone-500 mb-4">
            Role &amp; responsibilities
          </p>
          <p className="font-serif italic text-xl text-stone-600 leading-[1.5] max-w-[62ch] border-l-2 border-stone-900 pl-5">
            I build and run data-heavy systems: decisioning, analytics, customer lifecycle, and reporting.
            Most of the job is between design and go-live — turn a requirement into something you can
            deploy, then keep it testable and observable in production.
          </p>
        </section>

        {/* ── Summary ── */}
        <section className="mb-16">
          <SectionHeader num="02" label="Summary" />
          <p className="max-w-[62ch] font-serif text-stone-600 leading-relaxed">
            {profile.about}
          </p>
        </section>

        {/* ── Experience ── */}
        <section className="mb-16">
          <SectionHeader num="03" label="Experience" />
          <p className="mb-10 max-w-[62ch] font-serif text-sm text-stone-500 leading-relaxed">
            From analytics and finance reports into orchestration, live decisioning, martech, QA automation, and migration
            work — mostly banking, telecom, and retail.
          </p>

          <div className="divide-y divide-stone-200 border-t border-stone-200">
            {profile.experience.map((exp, index) => (
              <article
                key={index}
                className="grid gap-6 py-10 md:grid-cols-[9rem_1fr] md:gap-10"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500 md:pt-1">
                  {exp.period}
                </div>
                <div>
                  <h4 className="font-serif text-xl text-stone-900 md:text-2xl mb-1">
                    {exp.role}
                  </h4>
                  <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500 mb-4">
                    {exp.company}
                  </div>
                  <p className="max-w-[62ch] font-serif text-base leading-[1.7] text-stone-600 mb-5">
                    {exp.description}
                  </p>
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-2 max-w-[62ch] mb-5">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="relative pl-5 font-serif text-[0.95rem] leading-[1.65] text-stone-600">
                          <span className="absolute left-0 top-[0.7em] h-px w-3 bg-accent" />
                          {ach}
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.tools && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-stone-500">
                      {exp.tools.map((tool, i) => (
                        <span key={i}>
                          {tool}
                          {i < (exp.tools?.length ?? 0) - 1 && <span className="ml-3 text-stone-200">/</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Certifications ── */}
        <section className="mb-16">
          <SectionHeader num="04" label="Certifications" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.certifications?.map((cert, index) => (
              <button
                key={index}
                type="button"
                onClick={() => { trackEvent('certificate_open', { label: cert.name }); setActiveCertificationIndex(index); }}
                className="group border border-stone-200 p-6 text-left transition-colors hover:border-stone-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-serif text-base text-stone-900 leading-snug pr-4">{cert.name}</h4>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-stone-500">{cert.date}</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-3">{cert.issuer}</div>
                {cert.details && (
                  <p className="font-serif text-sm text-stone-500 border-t border-stone-100 pt-3 leading-relaxed">
                    {cert.details}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 transition-colors group-hover:text-stone-900">
                  Preview certificate
                  <ExternalLink className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Education ── */}
        <section>
          <SectionHeader num="05" label="Education" />
          <div className="divide-y divide-stone-200 border-t border-stone-200">
            {profile.education.map((edu, index) => (
              <div key={index} className="grid gap-3 py-7 md:grid-cols-[9rem_1fr] md:gap-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500">{edu.period}</span>
                <div>
                  <h4 className="font-serif text-lg text-stone-900">{edu.degree}</h4>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500">{edu.school}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Certificate modal ── */}
      <AnimatePresence>
        {activeCertification && (
          <>
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-stone-900/25 backdrop-blur-sm"
              onClick={() => setActiveCertificationIndex(null)}
            />
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-label={`Certificate preview: ${activeCertification.name}`}
              className="fixed inset-x-4 top-6 z-[100] mx-auto max-w-5xl border border-stone-200 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-6 py-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-stone-500 mb-2">Certificate preview</p>
                  <h3 className="font-serif text-xl text-stone-900">{activeCertification.name}</h3>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-stone-500">
                    {activeCertification.issuer} · {activeCertification.date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCertificationIndex(null)}
                  className="inline-flex items-center justify-center border border-stone-200 p-2.5 text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
                  aria-label="Close certificate preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[80vh] overflow-auto p-6">
                {renderCertificationPreview()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
