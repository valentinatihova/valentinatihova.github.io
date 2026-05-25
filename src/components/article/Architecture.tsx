import clsx from 'clsx';
import React, { createContext, useContext } from 'react';

/**
 * Architecture diagram primitives.
 *
 * Three-piece API (flex-based, not SVG — readable on mobile, no overflow):
 *
 *   <Architecture caption="..." note="...">
 *     <ArchitectureStep label="Source" caveat="...">
 *       <ArchitectureNode>_Sent</ArchitectureNode>
 *       <ArchitectureNode>_Open</ArchitectureNode>
 *     </ArchitectureStep>
 *     <ArchitectureEdge label="JOIN ON JobID + ListID + BatchID + SubscriberKey" />
 *     <ArchitectureStep label="Compute">
 *       <ArchitectureNode>FirstOpenDelay</ArchitectureNode>
 *     </ArchitectureStep>
 *     <ArchitectureEdge label="FILTER delay < 30s" accent />
 *     <ArchitectureStep label="Output">
 *       <ArchitectureNode accent>Cleaner open metric</ArchitectureNode>
 *     </ArchitectureStep>
 *   </Architecture>
 *
 * Design contract (P39):
 *   - Nodes are `font-mono` — they're system objects, not prose.
 *   - Edges carry the transform label in 11px mono uppercase — that's the
 *     actual engineering decision (what SQL/filter runs at this step).
 *   - One accent edge or node per diagram max (the "here's where the case
 *     adds value" highlight). Accent on every step = no accent.
 */

const ArchitectureLayoutContext = createContext<{ vertical: boolean }>({ vertical: false });

function useArchitectureLayout() {
  return useContext(ArchitectureLayoutContext);
}

interface ArchitectureProps {
  children: React.ReactNode;
  /** Short caption rendered as a monospace eyebrow. */
  caption?: string;
  /** Optional footnote below the diagram. Serif, stone-400. */
  note?: React.ReactNode;
  /**
   * `vertical` — stacked pipeline, full-width labels (no horizontal scroll; best for long JOIN text).
   * `horizontal` — row layout with wrap on smaller desktops (default).
   */
  orientation?: 'horizontal' | 'vertical';
}

export function Architecture({
  children,
  caption = 'Data flow',
  note,
  orientation = 'horizontal',
}: ArchitectureProps) {
  const vertical = orientation === 'vertical';

  return (
    <figure className="not-prose my-14 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
      <figcaption className="border-b border-stone-200 bg-white px-6 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
        {caption}
      </figcaption>
      <ArchitectureLayoutContext.Provider value={{ vertical }}>
        <div
          className={clsx(
            'px-6 py-8 md:py-10',
            vertical
              ? 'mx-auto flex w-full max-w-xl flex-col items-stretch gap-6'
              : 'flex flex-col items-stretch gap-5 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-x-5 md:gap-y-8',
          )}
        >
          {children}
        </div>
      </ArchitectureLayoutContext.Provider>
      {note && (
        <div className="border-t border-stone-200 bg-white px-6 py-4 font-serif text-[0.9rem] italic leading-[1.55] text-stone-500 [&_a]:font-sans [&_a]:not-italic [&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/40 [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-accent/85">
          {note}
        </div>
      )}
    </figure>
  );
}

/**
 * ArchitectureStep — a vertical stack of nodes sharing a label.
 * Label sits above the nodes as a mono eyebrow.
 */
interface ArchitectureStepProps {
  label: string;
  children: React.ReactNode;
  /** Small caveat/caption under the nodes, mono 10px stone-500. */
  caveat?: string;
}

export function ArchitectureStep({ label, children, caveat }: ArchitectureStepProps) {
  const { vertical } = useArchitectureLayout();

  return (
    <div
      className={clsx(
        'flex flex-col gap-3',
        vertical
          ? 'w-full items-stretch'
          : 'min-w-0 shrink-0 items-center md:min-w-[8.5rem] md:max-w-[13rem]',
      )}
    >
      <span className="text-center font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-stone-400">
        {label}
      </span>
      <div
        className={clsx(
          'flex gap-2',
          vertical ? 'flex-row flex-wrap justify-center' : 'flex-col items-stretch',
        )}
      >
        {children}
      </div>
      {caveat && (
        <span
          className={clsx(
            'text-center font-mono text-[10px] leading-[1.45] text-stone-500',
            vertical ? 'max-w-none px-1' : 'max-w-[18ch]',
          )}
        >
          {caveat}
        </span>
      )}
    </div>
  );
}

/**
 * ArchitectureNode — a boxed system object (table, job, output).
 * Accent variant highlights the single point where the case delivers value.
 */
interface ArchitectureNodeProps {
  children: React.ReactNode;
  accent?: boolean;
}

export function ArchitectureNode({ children, accent = false }: ArchitectureNodeProps) {
  const { vertical } = useArchitectureLayout();

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded border px-3 py-2 font-mono text-[13px] leading-none',
        vertical && 'shrink-0',
        accent
          ? 'border-accent/50 bg-accent/10 text-accent'
          : 'border-stone-200 bg-white text-stone-700',
      )}
    >
      {children}
    </span>
  );
}

/**
 * ArchitectureEdge — the transform between two steps.
 * Renders as a horizontal arrow with the operation label above it.
 * On narrow viewports collapses to a vertical arrow (mobile stack).
 */
interface ArchitectureEdgeProps {
  label: string;
  accent?: boolean;
}

export function ArchitectureEdge({ label, accent = false }: ArchitectureEdgeProps) {
  const { vertical } = useArchitectureLayout();

  if (vertical) {
    return (
      <div
        className={clsx(
          'flex w-full flex-col items-center gap-2 py-1',
          accent ? 'text-accent' : 'text-stone-500',
        )}
      >
        <span
          className={clsx(
            'w-full max-w-full whitespace-pre-line px-1 text-center font-mono text-[10px] font-medium uppercase leading-snug tracking-[0.12em] text-balance break-words',
            accent ? 'text-accent' : 'text-stone-400',
          )}
        >
          {label}
        </span>
        <span
          aria-hidden
          className={clsx('font-mono text-[1.35rem] leading-none', accent ? 'text-accent' : 'text-stone-500')}
        >
          ↓
        </span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex min-w-0 max-w-[11rem] flex-col items-center justify-center gap-2 px-1 md:max-w-[12rem]',
        accent ? 'text-accent' : 'text-stone-500',
      )}
    >
      <span
        className={clsx(
          'w-full text-center font-mono text-[10px] font-medium uppercase leading-snug tracking-[0.14em] text-balance break-words',
          accent ? 'text-accent' : 'text-stone-400',
        )}
      >
        {label}
      </span>
      <span
        aria-hidden
        className={clsx('font-mono text-[1.5rem] leading-none', accent ? 'text-accent' : 'text-stone-500')}
      >
        <span className="hidden md:inline">→</span>
        <span className="md:hidden">↓</span>
      </span>
    </div>
  );
}
