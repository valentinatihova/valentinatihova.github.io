import React, { useEffect, useState } from 'react';

/**
 * Renders its children only after the component has mounted in the browser.
 *
 * Article bodies are server-rendered (`client:load`) so their prose lands in the
 * static HTML for SEO. Some visualizations build their SVG directly in JSX with
 * computed floating-point coordinates, which Node (SSR) and the browser format
 * with last-digit differences — an unrecoverable React hydration mismatch.
 * Those decorative infographics carry no SEO value, so we skip server rendering
 * for them: SSR and the first client render both emit nothing (matching, so no
 * mismatch), then the real component mounts on the client — the same behavior
 * these had under the previous `client:only` setup.
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : null;
}
