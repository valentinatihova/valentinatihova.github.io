export interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  tags: string[];
  githubUrl?: string;
  content?: string;
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

/**
 * Canonical discipline taxonomy (Audit #9 — Senior Data Engineer tag review).
 *
 * Flat axis — every tag is a DISCIPLINE, never a tool, platform, sub-method,
 * or outcome. Tooling (Python, SQL, Scikit-learn, SVG), platforms (SFMC),
 * sub-methods (Regression, A/B Testing), and outcomes (Data Quality) live
 * in the article body / summary / caseStudyFrame — NOT in tags.
 *
 * Rules:
 *   1. Maximum 3 tags per article (target: 1–2).
 *   2. Tags must come from `ARTICLE_DISCIPLINES` below. No ad-hoc tags.
 *   3. If a discipline is obviously implied by another (e.g. Machine Learning
 *      implies some Analytics), do NOT double-tag unless the case genuinely
 *      crosses disciplines. Primary tag goes first — it drives the card pill.
 */
export const ARTICLE_DISCIPLINES = [
  'MarTech',             // marketing stack, lifecycle, campaign mechanics, email platforms
  'Analytics',           // measurement, metric design, A/B, funnels, behavior analysis
  'Machine Learning',    // predictive modeling, evaluation, model selection
  'Data Visualization',  // information design, infographics, data-driven visual systems
] as const;

export type ArticleDiscipline = (typeof ARTICLE_DISCIPLINES)[number];

export const articles: Article[] = [
  {
    id: "sfmc-false-opens",
    title: "When Open Rate Lies: Detecting Suspicious Opens in SFMC",
    summary: "Used Salesforce Marketing Cloud Data Views to identify likely automated opens, reduce reporting noise, and build a more trustworthy engagement signal for lifecycle analysis.",
    date: "2026-04-17",
    readTime: "9 min read",
    tags: ["MarTech", "Analytics"],
    caseStudyFrame: {
      role: "Measurement design, SQL investigation, and martech reporting analysis",
      scope: "Investigate whether instant email opens in Salesforce Marketing Cloud should be treated as real engagement, then build practical heuristics using Data Views and timing patterns.",
      outcome: "Turn a noisy open-rate metric into a more defensible engagement signal so campaign reporting is less vulnerable to automated scanners and misleading early opens.",
    }
  },
  {
    id: "feeding-clock-in-a-day",
    title: "How We Build a Day: Baby Feeding Clock Infographic",
    summary: "A circular feeding visualization of the last 24 hours, mapping bottle volume and timing into a single day-clock.",
    date: "2026-04-14",
    readTime: "8 min read",
    tags: ["Data Visualization"],
    caseStudyFrame: {
      role: "Creative coding, information design, and front-end implementation",
      scope: "Translate everyday time-series data into a compact radial view with strong reading hierarchy and responsive behavior.",
      outcome: "Turn a repetitive daily log into a readable visual system that surfaces timing, volume, rhythm, and next-action context at a glance.",
    }
  },
  {
    id: "ml-model-for-zyfra",
    title: "Predicting Gold Recovery (Zyfra ML Model)",
    summary:
      "Recovery regression on multi-stage ore data: train vs test feature parity, sMAPE with a rougher/final mix, anomaly cuts on concentrations and feed size — notebook on GitHub, interactive charts aligned with the original EDA.",
    date: "2026-04-20",
    readTime: "12 min read",
    tags: ["Machine Learning"],
    githubUrl: "https://github.com/valentinatihova/DS_projects/tree/main/ml_model_for_Zyfra",
    caseStudyFrame: {
      role: "Method write-up with reproducible notebook; interactive charts on-site aligned with the notebook EDA",
      scope: "Industrial beneficiation signals, date-aligned targets from full, correlation-based feature gate, and custom sMAPE model comparison.",
      outcome: "A review-ready story on leakage avoidance and metric design, with interactive charts and the full grid-search trail in grand_project_2.ipynb.",
    }
  },
  {
    id: "bank-churn-prediction",
    title: "Bank Churn Prediction & Retention Strategy",
    summary:
      "Binary churn on public tabular data: F1-first evaluation under imbalance, preprocessing without leakage, and why a class-weighted random forest outperformed upsampling — notebook on GitHub, argument here.",
    date: "2026-04-20",
    readTime: "10 min read",
    tags: ["Machine Learning"],
    githubUrl: "https://github.com/valentinatihova/DS_projects/tree/main/bank_churn_prediction",
    caseStudyFrame: {
      role: "Method write-up with reproducible notebook; argument on-site, cells and metrics on GitHub",
      scope: "Public Kaggle-style bank churn tabular data: preprocessing without leakage, class-imbalance tactics, and F1-first comparison of tree, forest, and logistic baselines.",
      outcome: "A defensible model-choice narrative from baseline to weighted forest, with reproducible notebook artifacts and on-page views that echo the same metrics.",
    }
  },
  {
    id: "final-project-da",
    title: "Mobile App User Behavior & A/B Testing",
    summary: "Analyzed user sales funnel and evaluated A/A/B test results to determine the impact of UI changes on conversion rates.",
    date: "2024-02-18",
    readTime: "18 min read",
    tags: ["Analytics"],
    githubUrl: "https://github.com/valentinatihova/DA_projects/tree/master/final_project",
    caseStudyFrame: {
      role: "Behavior analysis, funnel diagnostics, metric interpretation, and hypothesis testing",
      scope: "Analyze mobile user journeys, isolate conversion friction, and assess whether interface changes create measurable differences in behavior.",
      outcome: "Move from raw event streams to product-level calls on conversion and experiment readouts \u2014 separating real behavioral signal from variance noise before business decisions.",
    }
  }
];
