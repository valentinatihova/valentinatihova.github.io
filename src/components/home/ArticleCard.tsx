import React from 'react';
import { type Article } from '../../data/articles';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { trackEvent } from '../../lib/analytics';

interface ArticleCardProps {
  article: Article;
  index?: number;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <a
        href={`/article/${article.id}`}
        onClick={() => trackEvent('article_open', { label: article.id })}
        className="group block border-t border-stone-200 py-8 transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent px-2 -mx-2"
      >
        {/* Top row: index + tags + date */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500 shrink-0">{num}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 border border-stone-200 px-2.5 py-1">
              {article.tags[0] ?? 'Article'}
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone-500 shrink-0 pt-0.5">
            {formattedDate} · {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl md:text-2xl text-stone-900 leading-[1.2] mb-3 transition-colors group-hover:text-stone-700">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="font-serif text-base leading-[1.65] text-stone-500 line-clamp-2 mb-5">
          {article.summary}
        </p>

        {/* Tags + read link */}
        <div className="flex items-center justify-between gap-4">
          {article.tags.length > 1 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500">
              {article.tags.slice(1, 4).map((tag, i, arr) => (
                <span key={tag}>
                  {tag}
                  {i < arr.length - 1 && <span className="ml-3 text-stone-500">/</span>}
                </span>
              ))}
              {article.tags.length > 4 && <span>+{article.tags.length - 4}</span>}
            </div>
          )}
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500 transition-colors group-hover:text-stone-900 shrink-0">
            Read
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </a>
    </motion.div>
  );
};
