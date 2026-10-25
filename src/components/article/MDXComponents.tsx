import React from 'react';
import { Callout } from './Callout';
import { KeyMetric, KeyMetrics } from './KeyMetric';
import { Architecture, ArchitectureNode, ArchitectureEdge, ArchitectureStep } from './Architecture';

// Rendered at build time by Astro. Heading ids come from Astro's heading slugs,
// code blocks are highlighted by rehype-pretty-code and styled in index.css.
const h2 = 'mt-12 mb-4 text-[28px] leading-[1.15] text-stone-900 sm:text-[34px] scroll-mt-6';

export const MDXComponents = {
  h1: (props: React.ComponentPropsWithoutRef<'h1'>) => <h1 className={h2} {...props} />,
  h2: (props: React.ComponentPropsWithoutRef<'h2'>) => <h2 className={h2} {...props} />,
  h3: (props: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-9 mb-3 text-[22px] leading-snug text-stone-900 sm:text-[26px] scroll-mt-6" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<'p'>) => <p className="mb-[22px] text-[18px] leading-[1.65] text-stone-900 sm:text-[20px]" {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<'ul'>) => <ul className="mb-[22px] list-disc pl-6 text-[18px] leading-[1.65] text-stone-900 sm:text-[20px]" {...props} />,
  ol: (props: React.ComponentPropsWithoutRef<'ol'>) => <ol className="mb-[22px] list-decimal pl-6 text-[18px] leading-[1.65] text-stone-900 sm:text-[20px]" {...props} />,
  li: (props: React.ComponentPropsWithoutRef<'li'>) => <li className="mb-2 pl-1" {...props} />,
  a: (props: React.ComponentPropsWithoutRef<'a'>) => <a className="text-fixed underline decoration-1 underline-offset-[3px] hover:decoration-2" {...props} />,
  img: (props: React.ComponentPropsWithoutRef<'img'>) => (
    <span className="my-10 block">
      <img className="mx-auto h-auto max-w-full rounded-[10px] border border-rule" {...props} />
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
