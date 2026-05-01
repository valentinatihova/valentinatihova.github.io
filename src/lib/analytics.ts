declare function gtag(...args: unknown[]): void;

export type EventName =
  | 'nav_click'
  | 'social_click'
  | 'scroll_to_top'
  | 'hero_cta_click'
  | 'article_open'
  | 'article_like'
  | 'article_share'
  | 'article_github'
  | 'article_back'
  | 'article_read_next'
  | 'tag_filter'
  | 'cv_open'
  | 'certificate_open'
  | 'raw_data_table_open'
  | 'diary_day_change';

interface EventParams {
  label?: string;
  value?: string | number;
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(name: EventName, params?: EventParams): void {
  if (typeof gtag === 'undefined') return;
  gtag('event', name, params ?? {});
}
