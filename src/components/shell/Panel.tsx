import type { ReactNode } from "react";

/**
 * Panel chrome - ART_DIRECTION.md section 2. The signature device.
 *
 *   +- 01 -- THE FEED ---- YOUR INFORMATION WORLD ---------------+
 *   | |                                                        | |  <- corner ticks
 *   |                        children                            |
 *   | |                                                        | |
 *   +------------------------------------------------------------+
 *
 * Translucent by design: the .panel background is 0.72 alpha over an 8px
 * backdrop blur so the light bleed reads *through* it. That translucency is
 * what connects the chrome to the atmosphere - it is not a decoration.
 *
 * The numbering earns its place here because the panels are a sequence: the
 * core loop in order, not ornamental digits.
 */
interface PanelProps {
  /**
   * The panel's mark. Mono, --verified.
   *
   * Only ever a real identifier: a position in the core loop ("01" to "06"), or
   * a code that exists in the fiction ("SC", the prefix every location on the
   * city map carries). A panel that has neither passes nothing and renders no
   * mark at all.
   *
   * The rooms outside the loop were briefly numbered "00", "07" and "08", which
   * was worse than either. A zero in a sequence that starts at 01 reads as an
   * off-by-one, and 07/08 claim there are eight steps in a six-step loop the
   * phase indicator right above it shows as six. An invented number is a
   * factual claim about the product, and all three of those were false.
   */
  number?: string;
  title: string;
  subtitle: string;
  /** Only the active panel's corner ticks turn cyan. Nowhere else. */
  active?: boolean;
  /** Labels the panel's region for assistive tech. */
  headingId: string;
  children: ReactNode;
}

/**
 * Four 8px L-shaped marks, inset 6px. --line normally, --verified when this is
 * the active panel - one of the six permitted cyan states in section 3.
 */
function CornerTicks({ active }: { active: boolean }) {
  const tone = active ? "border-verified" : "border-line";
  const mark = `pointer-events-none absolute h-2 w-2 ${tone}`;
  return (
    <span aria-hidden="true">
      <span className={`${mark} left-[6px] top-[6px] border-l border-t`} />
      <span className={`${mark} right-[6px] top-[6px] border-r border-t`} />
      <span className={`${mark} bottom-[6px] left-[6px] border-b border-l`} />
      <span className={`${mark} bottom-[6px] right-[6px] border-b border-r`} />
    </span>
  );
}

export default function Panel({
  number,
  title,
  subtitle,
  active = false,
  headingId,
  children,
}: PanelProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="panel relative rounded-doc border border-line"
    >
      <CornerTicks active={active} />

      {/* pl-4 with no right padding: the hairline runs to the panel's edge. */}
      <header className="flex items-center gap-3 pl-4 pt-4">
        {/*
          Rendered only when there is a mark to render. An empty span would
          still take its place in the flex row and leave the title sitting one
          gap further right than the panels above and below it, which is the
          kind of misalignment that reads as a layout fault.
        */}
        {number && (
          <span className="shrink-0 font-mono text-xs tracking-[0.16em] text-verified">
            {number}
          </span>
        )}
        <h2
          id={headingId}
          className="shrink-0 font-display text-base font-bold uppercase tracking-[0.08em] text-ink"
        >
          {title}
        </h2>
        {/*
          Hidden below lg, not truncated. At 350px the subtitle overran the
          panel's own right border by 26px, and a half-cut atmospheric subtitle
          reads as a bug rather than as atmosphere. The number and title carry
          the panel on mobile; the hairline claims the width the subtitle frees.
        */}
        <span className="hidden shrink-0 font-mono text-2xs uppercase tracking-[0.16em] text-ink-mute lg:block">
          — {subtitle}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </header>

      <div className="p-4">{children}</div>
    </section>
  );
}
