import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { FileText, Briefcase, GraduationCap, Award, ExternalLink, Send, X } from 'lucide-react';
import { profile } from '../data/profile';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { SITE_URL } from '../config/site';

export const Resume: React.FC = () => {
  const [activeCertificationIndex, setActiveCertificationIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  useDocumentHead({
    title: 'Resume | Valentina Tihova \u2014 Senior Data & MarTech Engineer',
    description:
      'Resume for Valentina Tihova, Senior Data & MarTech Engineer. Eight years in fintech, retail, and telecom. Remote in Europe, EU work authorized.',
    url: `${SITE_URL}/resume`,
  });
  const activeCertification =
    activeCertificationIndex !== null ? profile.certifications?.[activeCertificationIndex] : null;

  const renderCertificationPreview = () => {
    if (!activeCertification) return null;

    const previewUrl = activeCertification.previewUrl?.trim();
    if (!previewUrl) {
      return (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-stone-700 bg-stone-950/60 p-8 text-center">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-stone-400">Preview not attached</p>
            <p className="mt-3 max-w-md font-serif text-stone-300 leading-relaxed">
              Attach the certificate file as `pdf`, `png`, `jpg`, or `webp`, place it in `public/certificates/`,
              and set `previewUrl` in `src/data/profile.ts` to enable live preview here.
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
          className="h-[65vh] w-full rounded-2xl border border-stone-800 bg-white"
        />
      );
    }

    return (
      <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-2">
        <img
          src={previewUrl}
          alt={activeCertification.name}
          className="max-h-[65vh] w-full rounded-xl object-contain"
        />
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-8">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
                01 &mdash; Resume / CV
              </span>
              <span className="h-px w-16 bg-accent/40" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 font-serif text-stone-50">
              {profile.name}
            </h1>
            <p className="font-serif italic leading-[1.1] text-[1.5rem] md:text-[2rem] text-stone-300">
              {profile.title}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/Valentina_Tihova_CV.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded border border-accent/45 bg-accent/15 px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-[0.14em] text-paper transition-all shadow-sm hover:-translate-y-0.5 hover:bg-accent/25"
            >
              <ExternalLink className="w-4 h-4" />
              Open Recruiter CV
            </a>
            <a
              href={profile.telegram.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded border border-stone-700 bg-transparent px-6 py-3.5 font-mono text-sm font-medium uppercase tracking-[0.14em] text-stone-200 transition-all hover:-translate-y-0.5 hover:bg-stone-800 hover:text-stone-50"
            >
              <Send className="w-4 h-4" />
              Telegram
            </a>
          </div>
        </div>

        <div>
          {/* Metadata strip */}
          <div className="border-b border-stone-800 pb-8 mb-16">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-400 font-mono">
              <span>{profile.location}</span>
              <span>{profile.hiringContext}</span>
              <span>{profile.workAuthorization}</span>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-stone-200">LinkedIn</a>
              <a href={profile.telegram.url} target="_blank" rel="noreferrer" className="transition-colors hover:text-stone-200">{profile.telegram.handle}</a>
            </div>
          </div>

          <section className="mb-16">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
              Role &amp; responsibilities
            </p>
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-stone-300 md:text-lg">
              I build and run data-heavy systems: decisioning, analytics, customer lifecycle, and reporting. Most of the
              job is between design and go-live&mdash;turn a requirement into something you can deploy, then keep it
              testable and observable in production.
            </p>
          </section>

          {/* Summary */}
          <section className="mb-16">
            <h3 className="text-2xl md:text-[1.75rem] font-bold tracking-[-0.012em] text-stone-50 mb-6 font-serif flex items-center gap-3">
              <FileText className="w-5 h-5 text-stone-300" />
              Professional Summary
            </h3>
            <p className="max-w-[62ch] text-stone-300 leading-relaxed font-serif">
              {profile.about}
            </p>
          </section>

          {/* Experience Timeline - Eleanor Lutz Style */}
          <section className="mb-16">
            <h3 className="text-2xl md:text-[1.75rem] font-bold tracking-[-0.012em] text-stone-50 mb-6 font-serif flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-stone-300" />
              Experience & Responsibilities
            </h3>
            <p className="mb-8 max-w-[62ch] text-sm leading-relaxed text-stone-400 md:text-base">
              From analytics and finance reports into orchestration, live decisioning, martech, QA automation, and migration
              work&mdash;mostly banking, telecom, and retail.
            </p>
            
            <div className="divide-y divide-stone-800/70 border-t border-stone-800/70">
              {profile.experience.map((exp, index) => (
                <article
                  key={index}
                  className="grid gap-6 py-10 md:grid-cols-[10rem_1fr] md:gap-10"
                >
                  <div className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent md:pt-2">
                    {exp.period}
                  </div>

                  <div>
                    <h4 className="font-serif text-xl text-stone-50 md:text-2xl">
                      {exp.role}
                    </h4>
                    <div className="mt-1 font-mono text-sm text-stone-400">
                      {exp.company}
                    </div>

                    <p className="mt-4 max-w-[62ch] font-serif text-base leading-[1.7] text-stone-300">
                      {exp.description}
                    </p>

                    {exp.achievements.length > 0 && (
                      <ul className="mt-5 list-none space-y-2 max-w-[62ch]">
                        {exp.achievements.map((ach, i) => (
                          <li key={i} className="relative pl-5 font-serif text-[0.95rem] leading-[1.65] text-stone-300">
                            <span className="absolute left-0 top-[0.7em] h-px w-3 bg-accent/60"></span>
                            {ach}
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.tools && (
                      <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[12px] uppercase tracking-[0.18em] text-stone-400">
                        {exp.tools.map((tool, i) => (
                          <span key={i}>
                            {tool}
                            {i < (exp.tools?.length ?? 0) - 1 ? <span className="ml-3 text-stone-700">/</span> : null}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-16">
            <h3 className="text-2xl md:text-[1.75rem] font-bold tracking-[-0.012em] text-stone-50 mb-6 font-serif flex items-center gap-3">
              <Award className="w-5 h-5 text-stone-300" />
              Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.certifications?.map((cert, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveCertificationIndex(index)}
                  className="group rounded-lg border border-stone-800 bg-stone-900/40 p-7 text-left transition-colors hover:border-stone-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-base font-semibold text-stone-100 font-serif">{cert.name}</h4>
                    <span className="ml-4 whitespace-nowrap text-xs font-mono text-stone-300">{cert.date}</span>
                  </div>
                  <div className="text-stone-400 font-mono text-sm mb-2">{cert.issuer}</div>
                  {cert.details && (
                    <p className="text-stone-400 text-sm font-serif mt-2 pt-2 border-t border-stone-800/50">
                      {cert.details}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-stone-400 transition-colors group-hover:text-accent">
                    Preview certificate
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-2xl md:text-[1.75rem] font-bold tracking-[-0.012em] text-stone-50 mb-6 font-serif flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-stone-300" />
              Education
            </h3>
            <div className="divide-y divide-stone-800/70 border-t border-stone-800/70">
              {profile.education.map((edu, index) => (
                <div key={index} className="grid gap-3 py-6 md:grid-cols-[10rem_1fr] md:gap-10">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">{edu.period}</span>
                  <div>
                    <h4 className="font-serif text-lg text-stone-50">{edu.degree}</h4>
                    <div className="mt-1 font-mono text-sm text-stone-400">{edu.school}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {activeCertification && (
          <>
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-stone-950/75 backdrop-blur-sm"
              onClick={() => setActiveCertificationIndex(null)}
            />
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="fixed inset-x-4 top-6 z-[100] mx-auto max-w-5xl rounded-[1.75rem] border border-stone-700 bg-stone-900/95 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-stone-800 px-6 py-5">
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">Certificate preview</p>
                  <h3 className="mt-2 font-serif text-2xl text-stone-100">{activeCertification.name}</h3>
                  <p className="mt-2 text-sm font-mono text-stone-400">
                    {activeCertification.issuer} • {activeCertification.date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCertificationIndex(null)}
                  className="inline-flex items-center justify-center rounded-2xl border border-stone-700 bg-stone-950/80 p-3 text-stone-200 transition-colors hover:border-stone-600 hover:text-stone-100"
                  aria-label="Close certificate preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[80vh] overflow-auto p-6">
                {renderCertificationPreview()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
};