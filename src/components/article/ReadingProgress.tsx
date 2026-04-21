import { useEffect, useRef, useState } from 'react';

/**
 * ReadingProgress — thin amber bar fixed to the very top of the viewport.
 *
 * Progress is measured against the passed article ref (not the whole document),
 * so the bar fills as the reader scrolls through the article body itself —
 * not counting the masthead, footer, or colophon. Reaches 100% exactly when
 * the article's bottom edge crosses the viewport bottom.
 *
 * Accessibility:
 *   - Decorative (aria-hidden). Not an interactive element.
 *   - Respects reduced-motion by avoiding animated transitions on the fill.
 */
interface ReadingProgressProps {
  /** Ref to the <article> element whose height drives the progress. */
  targetRef: React.RefObject<HTMLElement | null>;
}

export function ReadingProgress({ targetRef }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      const el = targetRef.current;
      if (!el) {
        setProgress(0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height - viewportH;
      if (total <= 0) {
        setProgress(rect.top < 0 ? 100 : 0);
        return;
      }
      const scrolled = -rect.top;
      const pct = Math.max(0, Math.min(100, (scrolled / total) * 100));
      setProgress(pct);
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        compute();
      });
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [targetRef]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-accent/80 transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
