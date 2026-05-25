import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';
import { MDXComponents } from './MDXComponents';
import { ReadingProgress } from './ReadingProgress';
import { TableOfContents } from './TableOfContents';
import { ReadNext } from './ReadNext';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const mdxModules = import.meta.glob('../../content/articles/*.mdx');

interface ArticleBodyProps {
  articleId: string;
  articleSummary: string;
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({ articleId, articleSummary }) => {
  const [isLiked, setIsLiked] = useState(false);
  const articleBodyRef = useRef<HTMLDivElement>(null);
  const articleWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLiked(window.localStorage.getItem(`article-liked:${articleId}`) === 'true');
  }, [articleId]);

  const handleLike = () => {
    setIsLiked((prev) => {
      const next = !prev;
      window.localStorage.setItem(`article-liked:${articleId}`, String(next));
      trackEvent('article_like', { label: articleId, value: next ? 'liked' : 'unliked' });
      return next;
    });
  };

  const handleShareFacebook = () => {
    trackEvent('article_share', { label: articleId, value: 'facebook' });
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const mdxPath = `../../content/articles/${articleId}.mdx`;
  const MDXContent = React.useMemo(() => {
    return lazy(() => {
      if (mdxPath in mdxModules) {
        return mdxModules[mdxPath]() as Promise<{ default: React.ComponentType<any> }>;
      }
      return Promise.resolve({ default: () => <div className="text-stone-300">Content coming soon…</div> });
    });
  }, [mdxPath]);

  return (
    <div ref={articleWrapperRef}>
      <ReadingProgress targetRef={articleWrapperRef} />

      {/* Engagement row */}
      <div className="mt-4 flex flex-col items-center justify-between gap-6 border-t border-stone-200 pt-4 sm:flex-row mb-10">
        <button
          onClick={handleLike}
          className={`inline-flex items-center gap-3 rounded-full border px-5 py-2 font-mono text-sm transition-all ${
            isLiked
              ? 'border-accent/45 bg-accent/10 text-accent'
              : 'border-stone-300 bg-transparent text-stone-600 hover:border-stone-400 hover:text-stone-900'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-accent text-accent' : 'text-stone-400'}`} />
          <span>{isLiked ? 'Liked' : 'Like article'}</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono uppercase tracking-[0.22em] text-stone-400">Share</span>
          <button
            onClick={handleShareFacebook}
            className="inline-flex items-center gap-2 font-mono text-sm text-stone-500 transition-colors hover:text-accent"
          >
            <FacebookIcon />
            Facebook
          </button>
        </div>
      </div>

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-12">
        <div className="prose w-full max-w-3xl text-stone-800">
          <p className="mb-12 max-w-[58ch] text-xl leading-[1.55] text-stone-600 md:text-[1.45rem]">
            {articleSummary}
          </p>

          <div ref={articleBodyRef}>
            <Suspense
              fallback={
                <div className="animate-pulse space-y-4">
                  <div className="h-3 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded" />
                  <div className="h-3 bg-stone-200 rounded w-5/6" />
                </div>
              }
            >
              <MDXContent components={MDXComponents} />
            </Suspense>
          </div>
        </div>

        <TableOfContents articleRef={articleBodyRef} />
      </div>

      <ReadNext currentId={articleId} />
    </div>
  );
};
