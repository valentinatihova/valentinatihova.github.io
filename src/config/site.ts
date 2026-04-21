/** Absolute origin for canonical URLs and OG/Twitter meta (no trailing slash). */
export const SITE_URL: string = (
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://valentinatihova.com'
);
