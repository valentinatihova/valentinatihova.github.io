import { Info, AlertTriangle, Lightbulb, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

type CalloutType = 'info' | 'warning' | 'tip' | 'caveat';

interface CalloutProps {
  type?: CalloutType;
  /** Short inline title (mono eyebrow). Defaults to the type label. */
  title?: string;
  children: React.ReactNode;
}

const TYPE_META: Record<CalloutType, { label: string; Icon: typeof Info; tone: string }> = {
  info: {
    label: 'Note',
    Icon: Info,
    // Info uses the neutral stone rail — it's context, not emphasis.
    tone: 'border-stone-700 text-stone-300',
  },
  tip: {
    label: 'Heuristic',
    Icon: Lightbulb,
    // Tips earn the accent — they're the "here's why I chose X" moment.
    tone: 'border-accent/45 text-accent',
  },
  warning: {
    label: 'Watch out',
    Icon: AlertTriangle,
    // Warnings also use accent because amber is the only non-neutral in P28.
    // Differentiation vs. tip comes from icon + label, not hue.
    tone: 'border-accent/60 text-accent',
  },
  caveat: {
    label: 'Caveat',
    Icon: ShieldAlert,
    // Same accent rail as tip/warning so boundary framing reads as first-class,
    // not a footnote; icon + title still distinguish intent from “watch out”.
    tone: 'border-accent/45 text-accent',
  },
};

/**
 * Callout — editorial sidebar for non-body content inside an MDX article.
 *
 * Four intents (P38):
 *   - info    — neutral context / pointer
 *   - tip     — my reasoning, why I picked this threshold / approach
 *   - warning — "this will bite you if you copy blindly"
 *   - caveat  — boundary condition / what this case does NOT claim
 *
 * Visual contract: accent rail for tip, warning, and caveat (editorial emphasis).
 * Info stays on the stone ladder for neutral asides.
 */
export function Callout({ type = 'info', title, children }: CalloutProps) {
  const meta = TYPE_META[type];
  const { Icon } = meta;
  const label = title ?? meta.label;
  return (
    <aside
      role="note"
      className={clsx(
        'not-prose my-10 rounded-xl border-l-2 bg-stone-900/60 py-5 pl-5 pr-5',
        meta.tone.split(' ')[0], // border color
      )}
    >
      <div
        className={clsx(
          'mb-3 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.28em]',
          meta.tone.split(' ')[1], // text color
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
        <span>{label}</span>
      </div>
      <div className="max-w-[62ch] space-y-3 font-serif text-[1rem] leading-[1.65] text-stone-200 md:text-[1.05rem] [&_strong]:text-stone-50 [&_code]:rounded [&_code]:border [&_code]:border-stone-700 [&_code]:bg-stone-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-stone-100">
        {children}
      </div>
    </aside>
  );
}
