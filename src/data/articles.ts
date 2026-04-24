export interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  tags: string[];
  githubUrl?: string;
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

export const articles: Article[] = [
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
  {
    id: "feeding-clock-in-a-day",
    title: "How We Build a Day: Baby Feeding Clock Infographic",
    summary: "24-hour bottle feeds on one circular clock: volume and time in a single view.",
    date: "2026-04-14",
    readTime: "8 min read",
    tags: ["Data Visualization"],
    caseStudyFrame: {
      role: "Creative coding, information design, and front-end implementation",
      scope: "Time-series in a small radial layout that still reads clearly on a phone.",
      outcome: "A daily log you can read at a glance: timing, volume, and what happens next.",
    }
  },
  {
    id: "ml-model-for-zyfra",
    title: "Predicting Gold Recovery (Zyfra ML Model)",
    summary:
      "Gold recovery from multi-stage ore: same features in train and test, custom sMAPE, cuts on bad concentrations and feed size. Notebook on GitHub; charts here match the notebook EDA.",
    date: "2026-04-20",
    readTime: "12 min read",
    tags: ["Machine Learning"],
    githubUrl: "https://github.com/valentinatihova/DS_projects/tree/main/ml_model_for_Zyfra",
    caseStudyFrame: {
      role: "Write-up plus notebook; on-page charts line up with the EDA in the repo.",
      scope: "Plant signals, date-aligned targets, correlation gate for features, sMAPE across models.",
      outcome: "Clear on leakage and metrics; full grid search left in the notebook.",
    }
  },
  {
    id: "bank-churn-prediction",
    title: "Bank Churn Prediction & Retention Strategy",
    summary:
      "Churn on public tabular data: F1 with heavy class imbalance, no leakage in prep, and why a weighted random forest beat upsampling. Details in the GitHub notebook.",
    date: "2026-04-20",
    readTime: "10 min read",
    tags: ["Machine Learning"],
    githubUrl: "https://github.com/valentinatihova/DS_projects/tree/main/bank_churn_prediction",
    caseStudyFrame: {
      role: "Method write-up with reproducible notebook; argument on-site, cells and metrics on GitHub",
      scope: "Open churn dataset: prep without leakage, class imbalance, F1-first compare of tree, forest, and logistic baselines.",
      outcome: "Straight line from baseline to weighted forest; notebook for cells, page for the same metrics.",
    }
  },
];
