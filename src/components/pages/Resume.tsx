import React from 'react';
import { profile } from '../../data/profile';

// Same system as the home page: Inter Tight headings, Public Sans body in full ink,
// mono only for dates, and the 1fr / 1.4fr split that "Selected work" uses.
const link = 'font-semibold text-stone-900 underline decoration-2 underline-offset-[5px] hover:decoration-accent';
const split = 'grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:gap-12';

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section aria-labelledby={id} className={`${split} border-t border-rule pt-10 pb-14 sm:pt-14`}>
    <h2 id={id} className="text-[34px] leading-[1.05] sm:text-[44px]">{title}</h2>
    <div className="min-w-0">{children}</div>
  </section>
);

export const Resume: React.FC = () => (
  <div className="mx-auto max-w-page px-4 pt-12 pb-10 sm:px-6 sm:pt-16">
    <header className={`${split} pb-14 sm:pb-20`}>
      <div>
        <h1 className="text-[44px] leading-[0.92] sm:text-[64px] lg:text-[88px]">{profile.name}</h1>
        <p className="mt-4 text-[22px] leading-[1.2] text-stone-600">{profile.title}</p>
      </div>
      <div className="max-w-[38em] lg:pt-3">
        <p className="text-[22px] leading-[1.4]">
          I build and run data-heavy systems: decisioning, analytics, customer lifecycle, and reporting.
          Most of the job is between design and go-live: turn a requirement into something you can
          deploy, then keep it testable and observable in production.
        </p>
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-[17px]">
          <a href="/Valentina_Tihova_CV.html" target="_blank" rel="noreferrer" className={link}>Open CV</a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className={link}>LinkedIn</a>
          <a href={profile.telegram.url} target="_blank" rel="noreferrer" className={link}>Telegram {profile.telegram.handle}</a>
        </p>
        <p className="mt-3 text-[16px] text-stone-600">{profile.location}</p>
      </div>
    </header>

    <Section id="summary-h" title="Summary">
      <p className="max-w-[62ch] text-[17px] leading-[1.55]">{profile.about}</p>
    </Section>

    <Section id="experience-h" title="Experience">
      <p className="max-w-[62ch] text-[17px] leading-[1.55] text-stone-600">
        From analytics and finance reports into orchestration, live decisioning, martech, QA automation, and migration
        work, mostly banking, telecom, and retail.
      </p>
      <ol className="mt-8 divide-y divide-rule border-t border-rule">
        {profile.experience.map((exp, index) => (
          <li key={index} className="py-8">
            <p className="font-mono text-[13px] text-stone-600">{exp.period}</p>
            <h3 className="mt-2 text-[26px] leading-[1.15]">{exp.role}</h3>
            <p className="mt-1 text-[17px] text-stone-600">{exp.company}</p>
            <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.55]">{exp.description}</p>
            {exp.achievements.length > 0 && (
              <ul className="mt-4 max-w-[62ch] list-disc space-y-1.5 pl-5 text-[17px] leading-[1.55] marker:text-accent-fill">
                {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
              </ul>
            )}
            {exp.tools && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tools">
                {exp.tools.map((tool, i) => (
                  <li key={i} className="rounded-full border border-rule px-3 py-1 font-mono text-[13px] text-stone-700">{tool}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </Section>

    <Section id="certs-h" title="Certifications">
      <ul className="divide-y divide-rule border-t border-rule">
        {profile.certifications?.map((cert, index) => (
          <li key={index} className="py-6">
            <h3 className="text-[22px] leading-[1.2]">
              <a href={cert.previewUrl} target="_blank" rel="noreferrer" className="text-stone-900 no-underline hover:underline hover:decoration-accent hover:decoration-[3px] hover:underline-offset-[6px]">
                {cert.name}
              </a>
            </h3>
            <p className="mt-1 text-[16px] text-stone-600">{cert.issuer} · <span className="font-mono text-[13px]">{cert.date}</span></p>
            {cert.details && <p className="mt-2 max-w-[62ch] text-[17px] leading-[1.55]">{cert.details}</p>}
          </li>
        ))}
      </ul>
    </Section>

    <Section id="education-h" title="Education">
      <ul className="divide-y divide-rule border-t border-rule">
        {profile.education.map((edu, index) => (
          <li key={index} className="grid gap-1 py-6 sm:grid-cols-[180px_1fr] sm:gap-6">
            <p className="font-mono text-[13px] text-stone-600">{edu.period}</p>
            <div>
              <h3 className="text-[22px] leading-[1.2]">{edu.degree}</h3>
              <p className="mt-1 text-[16px] text-stone-600">{edu.school}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  </div>
);
