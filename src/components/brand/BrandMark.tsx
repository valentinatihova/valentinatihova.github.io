import clsx from 'clsx';

/**
 * BrandMark — canonical VT monogram.
 *
 * Renders the same geometry as /public/favicon.svg so the mark remains
 * identical across favicon, apple-touch-icon, header lockup, eyebrow prefix,
 * and OG seals. Size is the only knob — the square frame and accent underline
 * scale linearly with the viewBox.
 *
 * Contract:
 *   - One accent color (amber `--color-accent`) — no secondary hues.
 *   - Never ship decorative orbit/constellation shapes here; identity only.
 */
interface BrandMarkProps {
  /** Pixel size of the square (width === height). Defaults to 24. */
  size?: number;
  /** Optional className for layout (margins, focus rings, etc.). */
  className?: string;
  /** Decorative vs. meaningful. Screen readers skip it when decorative. */
  title?: string;
}

export function BrandMark({ size = 24, className, title }: BrandMarkProps) {
  const decorative = !title;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={title}
      className={clsx('shrink-0', className)}
    >
      {title && <title>{title}</title>}
      <rect width="32" height="32" rx="7" fill="#0c0a09" />
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="6.5"
        fill="none"
        stroke="#44403c"
        strokeWidth="1"
      />
      <path
        d="M 7.5 8.5 L 16 22.5 L 24.5 8.5"
        stroke="#fafaf9"
        strokeWidth="2.1"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <path
        d="M 11.5 8.5 L 20.5 8.5"
        stroke="#fafaf9"
        strokeWidth="2.1"
        strokeLinecap="square"
        fill="none"
      />
      <rect x="10" y="25.5" width="12" height="1.25" fill="var(--color-accent, #ce7f46)" />
    </svg>
  );
}

/**
 * BrandLockup — BrandMark + Fraunces wordmark "Valentina Tihova".
 *
 * Default header usage. Mark sits left, wordmark right, sharing a single
 * baseline via flex `items-center`. Variants:
 *   - `full`    → mark + full name (desktop/sticky headers)
 *   - `short`   → mark only (narrow viewports / mobile top bar)
 *   - `stacked` → mark above wordmark (footer colophon, OG seals)
 */
interface BrandLockupProps {
  variant?: 'full' | 'short' | 'stacked';
  size?: number;
  className?: string;
  wordmarkClassName?: string;
}

export function BrandLockup({
  variant = 'full',
  size = 28,
  className,
  wordmarkClassName,
}: BrandLockupProps) {
  if (variant === 'short') {
    return <BrandMark size={size} className={className} title="Valentina Tihova" />;
  }

  if (variant === 'stacked') {
    return (
      <div className={clsx('flex flex-col gap-3', className)}>
        <BrandMark size={size} />
        <span
          className={clsx(
            'font-serif text-base leading-none text-stone-100',
            wordmarkClassName,
          )}
        >
          Valentina Tihova
        </span>
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <BrandMark size={size} />
      <span
        className={clsx(
          'font-serif text-[17px] font-medium leading-none tracking-[-0.005em] text-stone-50',
          wordmarkClassName,
        )}
      >
        Valentina Tihova
      </span>
    </div>
  );
}
