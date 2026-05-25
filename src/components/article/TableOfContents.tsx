import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface HeadingEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  /** Ref to the article body — TOC scans this subtree for h2[id] / h3[id]. */
  articleRef: React.RefObject<HTMLElement | null>;
  /** Optional visible label (mono eyebrow). Defaults to "Contents". */
  label?: string;
}

/**
 * TableOfContents — sticky right-column outline with scroll-spy.
 *
 * Contract:
 *   - Reads headings from `articleRef` after it mounts (and on any DOM mutation).
 *   - Highlights the heading currently in the "reading zone" (top 20%–40% of
 *     viewport) via IntersectionObserver; never jumps back as sections leave.
 *   - Click-through uses native `<a href="#id">` so browser back/forward works.
 *   - Decorative on mobile (hidden) — editorial articles stay single-column.
 *
 * P37: MDXComponents must assign deterministic `id` to all h2/h3 via slugify
 * so the selectors below match. Without IDs, TOC renders nothing silently.
 */
export function TableOfContents({ articleRef, label = 'Contents' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;

    const collect = () => {
      const els = Array.from(root.querySelectorAll<HTMLElement>('h2[id], h3[id]'));
      const next: HeadingEntry[] = els.map((el) => ({
        id: el.id,
        text: el.textContent ?? '',
        level: (el.tagName === 'H2' ? 2 : 3) as 2 | 3,
      }));
      setHeadings(next);
      return els;
    };

    // Collect once + observe mutations (MDX lazy-renders async — need to re-scan).
    let observedEls = collect();
    const mo = new MutationObserver(() => {
      observedEls = collect();
      attachObserver(observedEls);
    });
    mo.observe(root, { childList: true, subtree: true });

    let io: IntersectionObserver | null = null;
    const attachObserver = (els: HTMLElement[]) => {
      if (io) io.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          // Prefer the entry nearest the top of the reading zone.
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible[0]) {
            setActiveId(visible[0].target.id);
          }
        },
        {
          // Reading zone: 20%–60% from the top.
          rootMargin: '-20% 0% -40% 0%',
          threshold: 0,
        },
      );
      els.forEach((el) => io!.observe(el));
    };
    attachObserver(observedEls);

    return () => {
      mo.disconnect();
      io?.disconnect();
    };
  }, [articleRef]);

  if (headings.length < 2) {
    // Single heading (or zero) — TOC adds noise, not value.
    return null;
  }

  return (
    <aside
      className="hidden xl:block"
      aria-label="Table of contents"
    >
      <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
        <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-stone-400">
          {label}
        </p>
        <ol className="space-y-1.5 border-l border-stone-200">
          {headings.map((h) => {
            const isActive = h.id === activeId;
            return (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className={clsx(
                    'block -ml-px border-l py-1 pl-4 font-mono text-[12px] leading-snug transition-colors',
                    h.level === 3 && 'pl-6 text-[11.5px]',
                    isActive
                      ? 'border-accent text-accent'
                      : 'border-transparent text-stone-400 hover:border-stone-400 hover:text-stone-800',
                  )}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
