import strings from "../../content/strings.json";
import { useCountUp } from "../../lib/motion";

/**
 * NOVA's confidence - PROTOTYPE_SPEC section 4.
 *
 * The number is the whole argument of this screen: it moves from 62 to 34 the
 * moment she is asked for a source, and to 88 only after she actually checks.
 * A player who watches that number move has learned what a confident answer is
 * worth without being told.
 *
 * Colour split per CLAUDE.md section 3: the bar fill is --nova (structure),
 * the readout is --nova-ink (text). The dark violet cannot carry 11px type.
 */
/**
 * `fallFrom` is the overview page and nothing else.
 *
 * The game moves this number by re-rendering with a new value - she is asked a
 * question, the number changes, the counter ticks. On a page there is no
 * question being asked, so the drop is tied to the reader's scroll instead: one
 * registered custom property animates from `fallFrom` to `value` on a view
 * timeline, and it drives both the readout (a CSS counter) and the fill (a
 * scaleX). Neither touches a layout property, and the number and the bar are
 * the same value so they cannot disagree.
 *
 * With no scroll-timeline support, or reduced motion, it renders at `value` -
 * the number after the question, which is the one that carries the lesson. The
 * copy either side names both figures, so nothing is lost standing still.
 */
export default function ConfidenceBar({
  value,
  fallFrom,
}: {
  value: number;
  fallFrom?: number;
}) {
  const shown = useCountUp(value);

  if (fallFrom !== undefined) {
    return (
      <div
        className="confidence-fall mt-3"
        style={{ ["--conf-from" as string]: fallFrom, ["--conf-to" as string]: value }}
      >
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-2xs uppercase tracking-[0.16em] text-ink-mute">
            {strings.nova.confidence}
          </span>
          {/*
            The readout is painted by CSS from the animated property, so the
            visible number can never lag the bar. The spoken version is a
            separate, static sentence - a screen reader should be told what
            happens, not read a number that is mid-animation.
          */}
          <span
            aria-hidden="true"
            className="conf-readout font-mono text-2xs tabular-nums tracking-[0.16em] text-nova-ink"
          />
          <span className="sr-only">
            {strings.nova.confidence} {fallFrom}% → {value}%
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-btn bg-line">
          <div className="conf-fill h-full w-full rounded-btn bg-nova" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-2xs uppercase tracking-[0.16em] text-ink-mute">
          {strings.nova.confidence}
        </span>
        <span className="font-mono text-2xs tabular-nums tracking-[0.16em] text-nova-ink">
          {shown}%
        </span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-btn bg-line">
        <div
          className="h-full rounded-btn bg-nova transition-[width] duration-[600ms] ease-real"
          style={{ width: `${shown}%` }}
        />
      </div>
    </div>
  );
}
