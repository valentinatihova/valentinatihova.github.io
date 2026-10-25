export interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  tags: string[];
  githubUrl?: string;
  /** Animated figure shown under the article header. */
  hero?: 'schema-drift';
  /**
   * When true the article gets no route and is left out of the home index and
   * ReadNext, so its MDX is never rendered or bundled. `npm run check:build`
   * fails if a hidden article's title reaches dist/.
   */
  hidden?: boolean;
  caseStudyFrame?: {
    role: string;
    scope: string;
    outcome: string;
  };
}

export type ArticleKind = 'case-study' | 'idea';

/**
 * Derive content kind from data:
 *   - `case-study` = has public GitHub repo link (code-backed, technical deep-dive).
 *   - `idea`       = writeup/reflection based on production work without public code
 *                    (NDA-sensitive or design/editorial in nature).
 *
 * NOTE (Audit #9): The `case-study` / `idea` distinction is rendered ONLY as an
 * eyebrow inside Article.tsx. It is intentionally NOT shown as a card pill
 * or as a CTA differentiator (e.g. "Read case study" vs "Read idea") — keeping
 * it on cards pushed Kind to compete with the article title for attention it
 * has not earned (P1). Readers see kind once, at the top of the article itself.
 */
export const getArticleKind = (article: Article): ArticleKind =>
  article.githubUrl ? 'case-study' : 'idea';

export const ARTICLE_KIND_LABEL: Record<ArticleKind, string> = {
  'case-study': 'Case Study',
  idea: 'Idea',
};

export const allArticles: Article[] = [
  {
    id: "data360-schema-drift-ci",
    title: "A Failing Build When Your Data Cloud Data Model Changes",
    summary:
      "A free, open-source recipe: snapshot your Data 360 org, commit a baseline, and let a weekly GitHub Actions job tell you when the data model drifts.",
    date: "2026-10-25",
    readTime: "8 min read",
    tags: ["Data 360", "CI"],
    githubUrl: "https://github.com/valentinatihova/data360-autodoc",
    hero: "schema-drift",
  },
  {
    id: "sfmc-false-opens",
    title: "When Open Rate Lies: Detecting Suspicious Opens in SFMC",
    summary: "SFMC Data Views to flag likely fake opens, cut noise in reports, and get a cleaner read on engagement.",
    date: "2026-04-17",
    readTime: "9 min read",
    tags: ["MarTech", "Analytics"],
    caseStudyFrame: {
      role: 'SQL, SFMC reporting, and what we count as an "open"',
      scope: "Check if instant opens in SFMC are real engagement; heuristics from Data Views and send timing.",
      outcome: "Reporting that is less thrown off by scanners and bogus early opens.",
    }
  },
];

/**
 * Public, site-visible articles. Everything that consumes the article list
 * (home index, /article/[slug] route generation, ReadNext) imports this, so
 * marking an entry `hidden: true` in `allArticles` removes it everywhere.
 */
export const articles: Article[] = allArticles.filter((article) => !article.hidden);
