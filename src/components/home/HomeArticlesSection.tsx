import React, { useState, useMemo } from 'react';
import { TagFilter } from './TagFilter';
import { ArticleCard } from './ArticleCard';
import { articles } from '../../data/articles';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export const HomeArticlesSection: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const sortedArticles = useMemo(
    () => [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    []
  );

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    sortedArticles.forEach(article => article.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [sortedArticles]);

  const filteredArticles = useMemo(() => {
    if (selectedTags.length === 0) return sortedArticles;
    return sortedArticles.filter(article =>
      selectedTags.some(tag => article.tags.includes(tag))
    );
  }, [selectedTags, sortedArticles]);

  const featuredArticle = useMemo(() => {
    if (selectedTags.length > 0) return undefined;
    return filteredArticles[0];
  }, [filteredArticles, selectedTags]);

  const remainingArticles = useMemo(() => {
    if (!featuredArticle) return filteredArticles;
    return filteredArticles.filter((article) => article.id !== featuredArticle.id);
  }, [featuredArticle, filteredArticles]);

  const handleTagToggle = (tag: string) => {
    if (tag === 'all') { setSelectedTags([]); return; }
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <section id="projects" className="container mx-auto px-4 pb-24 md:pb-36">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-16 border-t border-stone-200 pt-12">
          <div className="flex items-start gap-10 mb-8">
            <div className="shrink-0">
              <p className="font-mono text-[10px] tracking-[0.22em] text-stone-400 mb-1">02</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600">Work</p>
            </div>
            <div className="flex-1">
              {/* Geometric rule */}
              <div className="flex items-center gap-3 mt-2 mb-6">
                <div className="h-0.5 w-6 bg-stone-900 shrink-0" />
                <div className="h-px flex-1 bg-stone-200" />
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 border border-stone-400 shrink-0"
                  style={{ transform: 'rotate(45deg)' }}
                />
              </div>
              <p className="font-serif text-stone-500 leading-relaxed max-w-xl">
                Case studies with public GitHub repos and long-form write-ups from production work —
                no client data, just how things were built and measured.
              </p>
            </div>
          </div>
          <TagFilter tags={allTags} selectedTags={selectedTags} onTagToggle={handleTagToggle} />
        </div>

        {/* Featured article */}
        {featuredArticle && (
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-16"
          >
            <a
              href={`/article/${featuredArticle.id}`}
              className="group block border-t-2 border-stone-900 pt-8 pb-12 transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent px-2 -mx-2"
            >
              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-stone-900 px-3 py-1">
                    Latest
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 border border-stone-200 px-2.5 py-1">
                    {featuredArticle.tags[0] ?? 'Article'}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone-300">
                  {new Date(featuredArticle.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  {' '}·{' '}{featuredArticle.readTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-900 leading-[1.05] mb-5 transition-colors group-hover:text-stone-700">
                {featuredArticle.title}
              </h3>

              {/* Summary */}
              <p className="font-serif text-lg md:text-xl text-stone-500 leading-[1.55] max-w-3xl mb-6">
                {featuredArticle.summary}
              </p>

              {/* Tags + read */}
              <div className="flex items-center justify-between gap-4">
                {featuredArticle.tags.length > 1 && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-400">
                    {featuredArticle.tags.slice(1, 5).map((tag, i, arr) => (
                      <span key={tag}>
                        {tag}
                        {i < arr.length - 1 && <span className="ml-3 text-stone-300">/</span>}
                      </span>
                    ))}
                    {featuredArticle.tags.length > 5 && (
                      <span>+{featuredArticle.tags.length - 5}</span>
                    )}
                  </div>
                )}
                <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500 transition-colors group-hover:text-stone-900 shrink-0">
                  Read article
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          </motion.div>
        )}

        {/* Article grid — editorial rows, 2 columns */}
        {remainingArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
            {remainingArticles.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={featuredArticle ? i + 1 : i}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-20 border border-stone-200 border-dashed">
            <p className="text-stone-500 font-serif">No articles found with the selected filters.</p>
            <button
              onClick={() => setSelectedTags([])}
              className="mt-6 border border-stone-300 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
