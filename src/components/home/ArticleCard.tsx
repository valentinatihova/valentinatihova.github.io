import React from 'react';
import { Link } from 'react-router-dom';
import { type Article } from '../../data/articles';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const shouldReduceMotion = useReducedMotion();
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <Link
      to={`/article/${article.id}`}
      className="group block h-full cursor-pointer overflow-hidden border-t border-stone-800 bg-transparent transition-all duration-300 hover:bg-stone-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
    >
      <div className="relative overflow-hidden px-3 pt-6 pb-4">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-stone-700 bg-stone-950/70 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-stone-300">
              {article.tags[0] ?? 'Article'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-stone-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col px-3 pb-8 pt-2">
        <h3 className="font-serif text-2xl leading-tight text-stone-50 md:text-[1.625rem] transition-colors group-hover:text-stone-100">
          {article.title}
        </h3>

        <p className="mt-3 line-clamp-3 font-serif text-[1rem] leading-[1.65] text-stone-300">
          {article.summary}
        </p>

        {article.tags.length > 1 && (
          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px] uppercase tracking-[0.18em] text-stone-400">
            {article.tags.slice(1, 4).map((tag, i, arr) => (
              <span key={tag}>
                {tag}
                {i < arr.length - 1 ? <span className="ml-3 text-stone-700">/</span> : null}
              </span>
            ))}
            {article.tags.length > 4 && <span className="text-stone-600">+{article.tags.length - 4}</span>}
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 font-mono text-sm text-stone-300 transition-colors group-hover:text-accent">
          Read article
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
      </Link>
    </motion.div>
  );
};
