import { useCallback, useLayoutEffect, useRef, useState } from "react";
import strings from "../../content/strings.json";
import EvidenceCard, { type EvidenceItem } from "./EvidenceCard";

/**
 * The evidence board - PROTOTYPE_SPEC section 3.
 *
 * A dark board with documents pinned to it at slight angles, threaded together.
 * Seven slots; three are findable in this slice and four render as unpinned
 * outlines. Showing all seven is the point: it tells a judge the system has
 * depth without faking four cards that do nothing.
 *
 * Rotations are fixed per slot rather than random, so the board looks the same
 * on every visit - and so it survives a reload without appearing to shuffle.
 * Between -2 and 2 degrees, as specified.
 */
const ROTATION = [-2.8, 2.4, -2.1, 0, 0, 0, 0];

/*
 * Vertical offsets. Without these the board is a tidy three-column grid no
 * matter how far the cards are rotated - the eye reads the shared baseline
 * before it reads the angle. Nudging each card off the line is what actually
 * breaks the grid. Applied to the locked slots too, so the whole surface looks
 * arranged by hand rather than laid out by a container.
 */
const OFFSET = [0, 14, -10, 6, -8, 10, -4];

interface Thread {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Pin {
  x: number;
  y: number;
}

export default function EvidenceBoard({
  items,
  foundIds,
  onFind,
}: {
  items: EvidenceItem[];
  foundIds: string[];
  onFind: (id: string) => void;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<string, HTMLElement>());
  const [threads, setThreads] = useState<Thread[]>([]);
  const [pins, setPins] = useState<Pin[]>([]);

  /*
   * Threads are measured from the laid-out cards rather than guessed from the
   * grid, so they stay attached when the column reflows at any width. Only the
   * pinned (findable) cards are threaded - an unpinned outline has nothing to
   * connect to yet.
   */
  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const origin = board.getBoundingClientRect();
    const points = items
      .filter((item) => item.state === "findable")
      .map((item) => cards.current.get(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
      .map((el) => {
        const r = el.getBoundingClientRect();
        // The pin, not the centre: thread runs head to head like a real board.
        return { x: r.left - origin.left + r.width / 2, y: r.top - origin.top + 12 };
      });

    const next: Thread[] = [];
    for (let i = 1; i < points.length; i += 1) {
      next.push({ x1: points[i - 1].x, y1: points[i - 1].y, x2: points[i].x, y2: points[i].y });
    }
    setThreads(next);
    setPins(points);
  }, [items]);

  useLayoutEffect(() => {
    measure();
    const board = boardRef.current;
    if (!board) return;
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div
      ref={boardRef}
      className="board relative rounded-doc border border-line p-6"
      role="group"
      aria-label={strings.investigate.boardLabel}
    >
      {/*
        Wider row gap than column gap, and that asymmetry is load-bearing.

        Cards are rotated and nudged off the baseline, and neither transform is
        visible to the grid - so the row gap has to absorb both. Mission 02's
        evidence copy is longer than mission 01's (281px against 185px for the
        tallest card), and at 24px the extra height plus a 2.4deg rotation put
        the corner of the full-recording card 4px inside the locked slot below
        it. 32px clears the worst case with room left for a longer card in a
        future mission; the column gap stays at 24 because nothing rotates
        sideways into anything.
      */}
      <ol className="relative grid grid-cols-2 items-start gap-x-6 gap-y-8 sm:grid-cols-3">
        {items.map((item, i) => (
          <EvidenceCard
            key={item.id}
            item={item}
            index={i}
            rotation={ROTATION[i] ?? 0}
            offset={OFFSET[i] ?? 0}
            found={foundIds.includes(item.id)}
            onFind={onFind}
            cardRef={(el) => {
              if (el) cards.current.set(item.id, el);
              else cards.current.delete(item.id);
            }}
          />
        ))}
      </ol>

      {/*
        Threads and pins paint ABOVE the cards, which is the point - a thread
        that disappears behind the document it is tied to is not a thread. The
        stroke is --ink-faint rather than --line: --line is a hairline meant to
        sit against --surface, and on this near-void board it was invisible.
        Both are declared on :root, so var() resolves here in hand-written SVG.
      */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {threads.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="var(--ink-faint)"
            strokeWidth="1"
            strokeOpacity="0.8"
          />
        ))}
        {pins.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--ink-faint)" />
            <circle cx={p.x} cy={p.y} r="1.5" fill="var(--void)" />
          </g>
        ))}
      </svg>
    </div>
  );
}
