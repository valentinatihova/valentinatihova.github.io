import clsx from 'clsx';

interface KeyMetricProps {
  /** The quantified value itself. Kept small: digit-led, ≤ 6 chars ideal. */
  value: React.ReactNode;
  /** What the value measures. Mono eyebrow above the value. */
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
      <span
        className={clsx(
          'font-display leading-[1.05]',
          accent
            ? 'text-[2.5rem] font-semibold text-accent md:text-[3rem]'
            : 'text-[2rem] font-medium text-stone-900 md:text-[2.25rem]',
        )}
      >
        {value}
      </span>
      <span className="font-sans text-[16px] font-semibold text-stone-600">
        {label}
      </span>
      {note && (
        <span className="max-w-[28ch] text-[16px] leading-[1.5] text-stone-600">
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
 * Visual contract: one filled panel, metrics separated by space, like the caseStudyFrame
 * three-column pattern at the top of the article.
 */
interface KeyMetricsProps {
  children: React.ReactNode;
  /** Section heading printed above the grid, not an H2. */
  label?: string;
}

export function KeyMetrics({ children, label = 'Observed distribution' }: KeyMetricsProps) {
  return (
    <section
      aria-label={label}
      className="not-prose my-14 rounded-2xl bg-field p-8 md:p-10"
    >
      <p className="mb-8 font-sans text-[15px] font-semibold text-accent">
        {label}
      </p>
      <div className="grid gap-10 md:grid-cols-3 md:gap-0 md:[&>*]:px-8 md:[&>*:first-child]:pl-0 md:[&>*:last-child]:pr-0">
        {children}
      </div>
    </section>
  );
}
