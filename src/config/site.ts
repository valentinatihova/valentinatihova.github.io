/** Absolute origin for canonical URLs and OG/Twitter meta (no trailing slash). */
export const SITE_URL: string = (
  // Astro exposes PUBLIC_ vars; VITE_ still works as fallback during migration.
  (import.meta.env.PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://valentinatihova.com'
);
