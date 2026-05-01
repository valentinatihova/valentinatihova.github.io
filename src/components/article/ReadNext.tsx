import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { articles, type Article } from '../../data/articles';
import { trackEvent } from '../../lib/analytics';

interface ReadNextProps {
  currentId: string;
  /** How many related articles to surface. Defaults to 2. Capped at 3 (row design). */
  limit?: number;
}

/**
 * Score candidate articles by tag overlap with the currently-viewed article.
 * Falls back to reverse-chronological when nothing overlaps. Never picks the
 * article you're reading.
 */
function pickRelated(currentId: string, limit: number): Article[] {
  const current = articles.find((a) => a.id === currentId);
  if (!current) return [];
  const currentTags = new Set(current.tags);
  const scored = articles
    .filter((a) => a.id !== currentId)
    .map((a) => ({
      article: a,
      overlap: a.tags.filter((t) => currentTags.has(t)).length,
      recency: new Date(a.date).getTime(),
    }))
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return b.recency - a.recency;
    });
  return scored.slice(0, Math.min(limit, 3)).map((s) => s.article);
}

/**
 * ReadNext — 2 related articles printed as a strip at the end of an article.
 *
 * Visual language mirrors the Home-page ArticleCard (P30) so readers land
 * back into the same catalog grammar: primary-discipline pill + meta-row +
 * title + summary + "Read article" affordance. No kind-pill, no
 * kind-differentiated CTA — kind is scoped to the article eyebrow only
 * (Audit #9 / P42).
 */
export function ReadNext({ currentId, limit = 2 }: ReadNextProps) {
  const related = pickRelated(currentId, limit);
  if (related.length === 0) return null;

  return (
    <section aria-label="Read next" className="not-prose mx-auto mt-16 max-w-5xl">
      <div className="mb-8 flex items-center gap-4">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
          Read next
        </span>
        <span className="h-px flex-1 bg-stone-800" />
      </div>

      <div className="grid gap-0 border-t border-stone-800">
        {related.map((a) => (
          <Link
            key={a.id}
            to={`/article/${a.id}`}
            onClick={() => trackEvent('article_read_next', { label: a.id, value: currentId })}
            className="group block border-b border-stone-800 px-3 py-8 transition-colors hover:bg-stone-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
          >
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-stone-700 bg-stone-950/70 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-stone-300">
                  {a.tags[0] ?? 'Article'}
                </span>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-xs text-stone-300">
                <Clock className="h-3.5 w-3.5" />
                {a.readTime}
              </span>
            </div>

            <h3 className="mt-5 max-w-3xl font-serif text-2xl leading-[1.15] text-stone-50 md:text-[1.75rem]">
              {a.title}
            </h3>
            <p className="mt-3 max-w-2xl font-serif text-[1rem] leading-[1.55] text-stone-400">
              {a.summary}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-stone-300 transition-colors group-hover:text-accent">
              Read article
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
