import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Heart } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { Layout } from '../components/layout/Layout';
import { ARTICLE_KIND_LABEL, articles, getArticleKind } from '../data/articles';
import { MDXComponents } from '../components/article/MDXComponents';
import { ReadingProgress } from '../components/article/ReadingProgress';
import { TableOfContents } from '../components/article/TableOfContents';
import { ReadNext } from '../components/article/ReadNext';
import { MDXProvider } from '@mdx-js/react';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { SITE_URL } from '../config/site';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const mdxModules = import.meta.glob('../content/articles/*.mdx');

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.3 5.3 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.5 5 1.9 5 1.9a5.3 5.3 0 0 0-.1 3.8 5.4 5.4 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/>
  </svg>
);

export const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = articles.find(a => a.id === id);
  const [isLiked, setIsLiked] = useState(false);

  useDocumentHead({
    title: article
      ? `${article.title} | Valentina Tihova`
      : 'Not found | Valentina Tihova',
    description: article?.summary,
    image: article ? `${SITE_URL}/og/${article.id}.png` : undefined,
    url: article ? `${SITE_URL}/article/${article.id}` : undefined,
  });

  useEffect(() => {
    if (!id) return;
    setIsLiked(window.localStorage.getItem(`article-liked:${id}`) === 'true');
  }, [id]);

  const handleLike = () => {
    if (!id) return;

    setIsLiked((prev) => {
      const nextValue = !prev;
      window.localStorage.setItem(`article-liked:${id}`, String(nextValue));
      trackEvent('article_like', { label: id, value: nextValue ? 'liked' : 'unliked' });
      return nextValue;
    });
  };

  const handleShareFacebook = () => {
    trackEvent('article_share', { label: id ?? '', value: 'facebook' });
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Not found</h1>
          <p className="text-stone-300 mb-8">No article at this address.</p>
          <Link to="/" className="text-accent hover:text-accent/80 font-medium">
            &larr; Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const mdxPath = `../content/articles/${article.id}.mdx`;
  const MDXContent = React.useMemo(() => {
    return lazy(() => {
      if (mdxPath in mdxModules) {
        return mdxModules[mdxPath]() as Promise<{ default: React.ComponentType<any> }>;
      }
      return Promise.resolve({ default: () => <div className="text-stone-300">Content coming soon...</div> });
    });
  }, [mdxPath]);

  const kind = getArticleKind(article);
  const kindLabel = ARTICLE_KIND_LABEL[kind];
  const articleBodyRef = useRef<HTMLDivElement>(null);
  const articleWrapperRef = useRef<HTMLElement>(null);

  return (
    <Layout>
      <ReadingProgress targetRef={articleWrapperRef} />

      <article
        ref={articleWrapperRef}
        className="container mx-auto px-4 py-12 md:py-20"
      >
        {/* One reading column with TOC: header + body share the same max width
            so the title block lines up with prose (previously header was centered
            in the full container while body was centered inside the narrower grid cell). */}
        <div className="mx-auto grid max-w-6xl gap-12 xl:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            <Link
              to="/"
              onClick={() => trackEvent('article_back', { label: article.id })}
              className="mb-12 inline-flex items-center gap-2 text-sm font-medium font-mono text-stone-400 transition-colors hover:text-stone-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>

            {/* --- Article header (same measure as body) ----------------------- */}
            <header className="mb-12 max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
              {kindLabel}
            </span>
            <span className="h-px w-16 bg-accent/40" />
          </div>

          <div className="mb-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px] uppercase tracking-[0.18em] text-stone-400">
            {article.tags.map((tag, i) => (
              <span key={tag}>
                {tag}
                {i < article.tags.length - 1 ? <span className="ml-3 text-stone-700">/</span> : null}
              </span>
            ))}
          </div>

          <h1 className="mb-8 font-serif text-4xl font-bold leading-tight tracking-tight text-stone-50 md:text-5xl lg:text-6xl">
            {article.title}
          </h1>

          <div className="mb-10 flex flex-wrap items-center gap-6 border-b border-stone-700 pb-10 text-sm font-mono text-stone-400">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {article.readTime}
            </span>
            {article.githubUrl && (
              <a
                href={article.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('article_github', { label: article.id })}
                className="ml-auto flex items-center gap-2 text-stone-300 transition-colors hover:text-accent"
              >
                <GithubIcon />
                View Source Code
              </a>
            )}
          </div>

          {/* Engagement row — flat, no card */}
          <div className="mt-4 flex flex-col items-center justify-between gap-6 border-t border-stone-800/40 pt-4 sm:flex-row">
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-3 rounded-full border px-5 py-2 font-mono text-sm transition-all ${
                isLiked
                  ? 'border-accent/45 bg-accent/15 text-accent'
                  : 'border-stone-700 bg-transparent text-stone-300 hover:border-stone-500 hover:text-stone-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-accent text-accent' : 'text-stone-400'}`} />
              <span>{isLiked ? 'Liked' : 'Like article'}</span>
            </button>

            <div className="flex items-center gap-4">
              <span className="text-xs font-mono uppercase tracking-[0.22em] text-stone-400">Share</span>
              <button
                onClick={handleShareFacebook}
                className="inline-flex items-center gap-2 font-mono text-sm text-stone-300 transition-colors hover:text-accent"
              >
                <FacebookIcon />
                Facebook
              </button>
            </div>
          </div>
            </header>

            <div ref={articleBodyRef} className="prose prose-invert w-full max-w-3xl text-stone-100">
            <p className="mb-12 max-w-[58ch] text-xl leading-[1.55] text-stone-300 md:text-[1.45rem]">
              {article.summary}
            </p>

            {article.caseStudyFrame && (
              <div className="not-prose mb-14 grid gap-8 border-y border-stone-800 py-8 md:grid-cols-3 md:gap-0">
                <div className="md:px-8 md:first:pl-0">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">My role</p>
                  <p className="mt-3 font-serif text-[0.98rem] leading-[1.6] text-stone-200">
                    {article.caseStudyFrame.role}
                  </p>
                </div>
                <div className="md:border-l md:border-stone-800 md:px-8">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">Scope</p>
                  <p className="mt-3 font-serif text-[0.98rem] leading-[1.6] text-stone-200">
                    {article.caseStudyFrame.scope}
                  </p>
                </div>
                <div className="md:border-l md:border-stone-800 md:px-8 md:last:pr-0">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">Why it matters</p>
                  <p className="mt-3 font-serif text-[0.98rem] leading-[1.6] text-stone-200">
                    {article.caseStudyFrame.outcome}
                  </p>
                </div>
              </div>
            )}

              <Suspense
                fallback={
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-stone-700 rounded" />
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-stone-700 rounded col-span-2" />
                          <div className="h-2 bg-stone-700 rounded col-span-1" />
                        </div>
                        <div className="h-2 bg-stone-700 rounded" />
                      </div>
                    </div>
                  </div>
                }
              >
                <MDXProvider components={MDXComponents}>
                  <MDXContent />
                </MDXProvider>
              </Suspense>
            </div>
          </div>

          <TableOfContents articleRef={articleBodyRef} />
        </div>

        {/* --- Related reading (no author card — single-author site, identity
               already carried by header/favicon/colophon). ------------------- */}
        <ReadNext currentId={article.id} />
      </article>
    </Layout>
  );
};
