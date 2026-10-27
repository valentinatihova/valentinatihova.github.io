# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary (next 12 months): hiring managers in the US for data quality / analytics engineering and applied AI roles. They arrive from a resume link, LinkedIn or a GitHub profile, spend one or two minutes, and need to answer "what level is this person and what have they actually shipped" without reading an essay.

Secondary: reviewers who check claims against public records (verifiable facts, dates, links to merged pull requests, releases and third-party recognition), and maintainers and users in the Salesforce data open-source community (data360-autodoc, sfdx-hardis, OpenMetadata, DataHub).

## Product Purpose

valentinatihova.com is the public record of Valentina Tihova's work as a data and AI analyst: where a product's data misleads people, and the fixes she shipped. Success is a reader leaving with a concrete list of what she changed, each item backed by a link they can open.

## Positioning

The site is written as a changelog of other people's products, not as a self-description: every claim on it is a merged pull request, a published package, an article or a listing elsewhere. The recurring subject is schema drift and misleading metrics in Salesforce customer data platforms (Data 360, Marketing Cloud), made legible to data engineers.

## Operating Context

Static Astro site deployed from GitHub Pages behind Cloudflare, custom domain valentinatihova.com. Content lives in `src/data/projects.ts` (the fixes ledger), `src/data/articles.ts` and `src/content/articles/*.mdx`. Open Graph images are generated at build time (`scripts/generate-og.tsx`). CI runs a build check, a Playwright smoke suite (desktop + 390px phone) and Lighthouse CI on every pull request.

## Capabilities and Constraints

- All copy and facts are confirmed and must be preserved as they are: the headline "I find where a product's data misleads people, and fix it.", the "Now:" line, the six-item fixes ledger with its before/after wording and proof links, both article titles and summaries. A redesign changes form, not wording.
- Never publish client names, employer names, environments or client data (NDA). The CI build check fails on banned terms.
- No "hire me", consulting or paid-service offer anywhere on the site (contract non-compete).
- Lighthouse CI budgets are kept: accessibility and SEO 1.0, best practices ≥ 0.95, performance ≥ 0.85 (warn), JavaScript ≤ 30 KB, total ≤ 700 KB, CLS ≤ 0.05. The first screen must render its final state without JavaScript and under `prefers-reduced-motion`.
- A production meta CSP allows no inline scripts; scripts stay external files.
- Pages: home, two articles, `/resume/`, 404, RSS. Whether `/resume/` stays a nav item is undecided (peer analysis suggests About + PDF).
- Portrait for the first screen: undecided; no photograph is on file yet.

## Brand Commitments

Name: Valentina Tihova. Title in use: Data & AI Analyst. Voice: plain, specific, numbers over adjectives, no marketing fluff. Current fonts (Newsreader, Public Sans, JetBrains Mono) are the incumbent choice, not a binding constraint.

## Evidence on Hand

- Fixes ledger with proof links: `src/data/projects.ts` (PyPI 0.4.1 release, merged sfdx-hardis PR, public SQL, OpenMetadata and sfmc-devtools PRs in review, public Journey Builder repo).
- Articles: "A Failing Build When Your Data Cloud Data Model Changes" (drift recipe, with the "Schema drift, played back" animation and its engine `src/components/article/schemaDriftStory.ts`) and "When Open Rate Lies: Detecting Suspicious Opens in SFMC".
- data360-autodoc on GitHub and PyPI; listed in an awesome-list.
- Absent, do not fabricate: testimonials, employer logos, talk recordings, awards, user counts, download numbers.

## Product Principles

1. Every claim links to its proof; nothing on the site is only asserted.
2. The site's subject is the reader's data problem, not the author's biography.
3. Form may be bold; wording stays exact.
4. Fast and inspectable: the site itself is evidence of engineering care (budgets, tests, no-JS first screen).
5. Public-safe by construction: nothing that could identify a client or employer.
