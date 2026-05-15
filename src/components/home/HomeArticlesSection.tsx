import React, { useState, useMemo } from 'react';
import { TagFilter } from './TagFilter';
import { ArticleCard } from './ArticleCard';
import { BrandMark } from '../brand/BrandMark';
import { articles } from '../../data/articles';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
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
    <section id="projects" className="container mx-auto px-4 py-20 md:py-32 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-16">
          <div className="mb-4 flex items-center gap-4">
            <BrandMark size={18} />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-accent">Index</span>
            <span className="h-px w-16 bg-accent/40" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3 font-serif text-stone-900">
            Work
          </h2>
          <p className="max-w-2xl text-stone-500 font-serif leading-relaxed">
            Case studies with public GitHub repos and long-form write-ups from production work —
            no client data, just how things were built and measured.
          </p>
        </div>

        <div className="mb-16 border-t border-stone-200 pt-6">
          <TagFilter tags={allTags} selectedTags={selectedTags} onTagToggle={handleTagToggle} />
        </div>

        {featuredArticle && (
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-24"
          >
            <a
              href={`/article/${featuredArticle.id}`}
              className="group block border-t border-stone-200 transition-colors duration-300 hover:bg-stone-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
            >
              <div className="px-3 pt-6 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-accent/45 bg-accent/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                      Latest
                    </span>
                    <span className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500">
                      {featuredArticle.tags[0] ?? 'Article'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-xs text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(featuredArticle.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {featuredArticle.readTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col px-3 pt-2 pb-10">
                <h3 className="max-w-4xl font-serif text-3xl leading-[1.08] text-stone-900 md:text-[2.5rem] lg:text-[3rem]">
                  {featuredArticle.title}
                </h3>
                <p className="mt-5 max-w-3xl font-serif text-lg leading-[1.55] text-stone-500 md:text-xl">
                  {featuredArticle.summary}
                </p>
                {featuredArticle.tags.length > 1 && (
                  <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px] uppercase tracking-[0.18em] text-stone-400">
                    {featuredArticle.tags.slice(1, 5).map((tag, i, arr) => (
                      <span key={tag}>
                        {tag}
                        {i < arr.length - 1 ? <span className="ml-3 text-stone-300">/</span> : null}
                      </span>
                    ))}
                    {featuredArticle.tags.length > 5 && (
                      <span className="text-stone-400">+{featuredArticle.tags.length - 5}</span>
                    )}
                  </div>
                )}
                <div className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-stone-500 transition-colors group-hover:text-accent">
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
          {remainingArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-24 border border-stone-200 border-dashed rounded-2xl bg-stone-100/50">
            <p className="text-stone-500 font-serif text-lg">No articles found with the selected filters.</p>
            <button
              onClick={() => setSelectedTags([])}
              className="mt-6 rounded-lg border border-stone-300 bg-stone-50 px-6 py-3 font-medium text-stone-600 transition-all shadow-sm hover:border-stone-400 hover:text-stone-900"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
