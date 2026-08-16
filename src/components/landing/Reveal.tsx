import type { ReactNode } from "react";

/**
 * A section entrance on the overview page. Presentational only - there is no
 * JavaScript behind it any more.
 *
 * It used to own an IntersectionObserver, a one-shot flag and a shared
 * debounced scroll listener to catch jumps. All three are gone: the animation
 * is `animation-timeline: view()` in index.css, which means the browser ties it
 * to where the element sits in the viewport, runs it on the compositor, plays
 * it backwards when the reader scrolls back up, and - because of
 * `animation-fill-mode: both` - has an element that is past the viewport
 * already at its end state. Nothing can be stranded invisible.
 *
 * `stagger` is a percentage offset into the element's own entry range, not a
 * delay: a scroll timeline has no time axis to delay along. Keep a group's
 * spread small - two or three steps of 3% lead the eye; more reads as lag.
 */
export default function Reveal({
  children,
  stagger = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Percent of extra entry range before this element starts. */
  stagger?: number;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  return (
    <Tag
      style={stagger ? ({ "--reveal-stagger": `${stagger}%` } as never) : undefined}
      className={`reveal-up ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
