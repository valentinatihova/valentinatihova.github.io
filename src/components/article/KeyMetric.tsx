import clsx from 'clsx';

interface KeyMetricProps {
  /** The quantified value itself. Kept small: digit-led, ≤ 6 chars ideal. */
  value: React.ReactNode;
  /** What the value measures. Mono uppercase eyebrow above the value. */
  label: string;
  /** Optional one-line interpretation printed below the value. */
  note?: React.ReactNode;
  /** Promotes the metric — larger, accent-colored. Use for the hero number only. */
  accent?: boolean;
}

/**
 * KeyMetric — a single quantified observation rendered as a standalone unit.
 *
 * Typography hierarchy (see P32 — size over color for grouped metrics):
 *   - label (mono, 11px, tracking 0.28em)
 *   - value (Fraunces, large)
 *   - note  (serif, stone-400)
 *
 * Use inside `<KeyMetrics>` for a grid, or standalone for a single spotlight.
 */
export function KeyMetric({ value, label, note, accent = false }: KeyMetricProps) {
  return (
    <div className={clsx('flex flex-col gap-2', accent && 'md:col-span-1')}>
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-stone-400">
        {label}
      </span>
      <span
        className={clsx(
          'font-serif leading-[1.05]',
          accent
            ? 'text-[2.5rem] font-semibold text-accent md:text-[3rem]'
            : 'text-[2rem] font-medium text-stone-50 md:text-[2.25rem]',
        )}
      >
        {value}
      </span>
      {note && (
        <span className="max-w-[28ch] font-serif text-[0.95rem] leading-[1.5] text-stone-400">
          {note}
        </span>
      )}
    </div>
  );
}

/**
 * KeyMetrics — editorial grid of KeyMetric children.
 *
 * Used for "here are the three observations that anchored my decision" —
 * replaces prose bullet lists when the underlying structure is quantified.
 *
 * Visual contract: dividers between metrics mirror the caseStudyFrame
 * three-column pattern at the top of the article (repetition = identity).
 */
interface KeyMetricsProps {
  children: React.ReactNode;
  /** Section heading printed above the grid. Mono eyebrow, not an H2. */
  label?: string;
}

export function KeyMetrics({ children, label = 'Observed distribution' }: KeyMetricsProps) {
  return (
    <section
      aria-label={label}
      className="not-prose my-14 rounded-2xl border border-stone-800 bg-stone-950/40 p-8 md:p-10"
    >
      <p className="mb-8 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
        {label}
      </p>
      <div className="grid gap-10 md:grid-cols-3 md:gap-0 md:[&>*]:px-8 md:[&>*:first-child]:pl-0 md:[&>*:last-child]:pr-0 md:[&>*:not(:first-child)]:border-l md:[&>*:not(:first-child)]:border-stone-800">
        {children}
      </div>
    </section>
  );
}
