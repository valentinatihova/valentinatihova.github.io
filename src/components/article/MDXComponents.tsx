import React from 'react';
import { Callout } from './Callout';
import { KeyMetric, KeyMetrics } from './KeyMetric';
import { Architecture, ArchitectureNode, ArchitectureEdge, ArchitectureStep } from './Architecture';

// Rendered at build time by Astro. Heading ids come from Astro's heading slugs,
// code blocks are highlighted by rehype-pretty-code and styled in index.css.
const h2 = 'mt-14 mb-5 border-b border-stone-200 pb-3 text-[1.875rem] font-bold tracking-[-0.015em] text-stone-900 md:text-[2.25rem] scroll-mt-24';

export const MDXComponents = {
  h1: (props: React.ComponentPropsWithoutRef<'h1'>) => <h1 className={h2} {...props} />,
  h2: (props: React.ComponentPropsWithoutRef<'h2'>) => <h2 className={h2} {...props} />,
  h3: (props: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-10 mb-4 text-[1.25rem] font-semibold tracking-normal text-stone-800 md:text-[1.5rem] scroll-mt-24" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<'p'>) => <p className="mb-6 max-w-[65ch] text-[1.0625rem] leading-[1.7] text-stone-600 md:text-[1.125rem]" {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<'ul'>) => <ul className="mb-6 max-w-[65ch] list-disc pl-6 text-[1.0625rem] leading-[1.7] text-stone-600 md:text-[1.125rem]" {...props} />,
  ol: (props: React.ComponentPropsWithoutRef<'ol'>) => <ol className="mb-6 max-w-[65ch] list-decimal pl-6 text-[1.0625rem] leading-[1.7] text-stone-600 md:text-[1.125rem]" {...props} />,
  li: (props: React.ComponentPropsWithoutRef<'li'>) => <li className="mb-2 pl-1" {...props} />,
  a: (props: React.ComponentPropsWithoutRef<'a'>) => <a className="text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:text-accent/80" {...props} />,
  img: (props: React.ComponentPropsWithoutRef<'img'>) => (
    <span className="block my-10 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 p-2">
      <img className="mx-auto h-auto max-w-full rounded-[1rem] border border-stone-100" {...props} />
    </span>
  ),

  // Editorial primitives available inside any .mdx file
  Callout,
  KeyMetric,
  KeyMetrics,
  Architecture,
  ArchitectureStep,
  ArchitectureNode,
  ArchitectureEdge,
};
