import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Check, Lock, MapPin } from "lucide-react";
import strings from "../../content/strings.json";
import { missions } from "../../content/mission";
import type { MissionRecord } from "../../state/progress";

/**
 * SIGNAL CITY, the board itself - extracted from the Hub screen so the overview
 * page can show the real thing rather than a picture of it.
 *
 * A map, not a menu. Five locations pinned at uneven positions on a dark
 * surface, threaded together in the order the game teaches them: the evidence
 * board's surface, offsets, threads and pins, reused deliberately. A mission is
 * a claim pulled apart; the city is the set of claims. If the two screens
 * looked unrelated the game would be saying they are unrelated.
 *
 * The three unbuilt locations use the locked pattern from the left rail and the
 * evidence slots: hatched, lock glyph, named, no tab stop. Nothing here is a
 * button that pretends to work.
 *
 * Cyan appears in exactly one place - "you are here" on the location you are
 * inside. Position, in the chrome, which is meaning two of the two cyan carries.
 * Completion is NOT cyan: a finished world keeps its fill, fills its pin solid
 * and names its badge, because "completed" is neither evidence nor position.
 */

/**
 * Where each location sits. Layout, not content - and hand-placed, because an
 * evenly distributed map is a card grid wearing a coat.
 */
export const PLACES = [
  { grid: "lg:col-start-1 lg:col-span-5 lg:row-start-1", rotate: -1.6 },
  { grid: "lg:col-start-8 lg:col-span-5 lg:row-start-1 lg:mt-[44px]", rotate: 1.2 },
  { grid: "lg:col-start-2 lg:col-span-4 lg:row-start-2 lg:mt-[8px]", rotate: -2 },
  { grid: "lg:col-start-8 lg:col-span-4 lg:row-start-2 lg:mt-[40px]", rotate: 1.6 },
  { grid: "lg:col-start-4 lg:col-span-5 lg:row-start-3", rotate: -1.2 },
];

interface Thread {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * A location is either a built mission or a named place that is not in this
 * build. `mission` is what separates them, and the type says so rather than the
 * component guessing from which fields happen to be present.
 */
export interface Location {
  id: string;
  slot: string;
  district: string;
  /** Hub location id of a playable mission. Absent on the three locked places. */
  mission?: string;
  /** Only the locked places carry their own copy; the rest read the mission. */
  name?: string;
  teaches?: string;
}

export const LOCATIONS = strings.hub.locations as Location[];

/** Name and teaching line come from the mission itself where one exists. */
function resolve(location: Location) {
  const mission = location.mission ? missions[location.mission] : undefined;
  return {
    name: mission?.title ?? location.name ?? "",
    teaches: mission?.subtitle ?? location.teaches ?? "",
    playable: Boolean(mission),
  };
}

export function LocationCard({
  location,
  place,
  record,
  here,
  onEnter,
  cardRef,
}: {
  location: Location;
  place: (typeof PLACES)[number];
  record?: MissionRecord;
  here: boolean;
  onEnter: (key: string) => void;
  cardRef: (el: HTMLElement | null) => void;
}) {
  const { name, teaches, playable } = resolve(location);
  /*
   * The tilt is the only inline style. The vertical nudges that break the grid
   * are `lg:` classes rather than a style object because below lg there is no
   * grid to break - one column of cards with three different top margins reads
   * as inconsistent spacing, not as a hand-pinned board.
   */
  const style = { transform: `rotate(${place.rotate}deg)` };

  /*
   * Locked. Identical in kind to the evidence board's unpinned slots and the
   * rail's dark rooms: a list item, not a control. Not focusable, because there
   * is nothing to operate - a focus stop on a dead card is a promise the screen
   * cannot keep.
   */
  if (!playable) {
    return (
      <li
        ref={cardRef}
        style={style}
        className={`hatched flex flex-col gap-2 rounded-doc border border-line p-4 ${place.grid}`}
      >
        <span className="flex items-center gap-2 font-mono text-2xs tracking-[0.16em] text-ink">
          {location.slot}
          <span className="text-ink-mute">· {location.district}</span>
        </span>
        <span className="font-display text-base font-bold uppercase tracking-[0.08em] text-ink">
          {name}
        </span>
        <span className="max-w-[46ch] text-sm text-ink-mute">{teaches}</span>
        <span className="mt-1 flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.16em] text-ink">
          <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
          {strings.rail.locked}
        </span>
      </li>
    );
  }

  const completed = Boolean(record);

  return (
    <li ref={cardRef} style={style} className={place.grid}>
      {/*
        The whole location is one control. Playable cards carry a fill and more
        room than the locked three - the map is allowed to say which places are
        open by weight, because that is true, and it is the opposite of a grid
        where every card is the same size (CLAUDE.md section 2).
      */}
      <button
        type="button"
        onClick={() => onEnter(location.id)}
        className="flex w-full flex-col gap-2 rounded-post border border-line bg-surface/[0.62] p-6 text-left transition-colors duration-[120ms] ease-real hover:border-ink-mute"
      >
        <span className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-2xs tracking-[0.16em] text-ink-mute">
          <span className="text-ink">{location.slot}</span>
          <span>· {location.district}</span>
          {here && (
            <span className="flex items-center gap-2 uppercase text-verified">
              <MapPin className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
              {strings.hub.here}
            </span>
          )}
        </span>

        <span className="font-display text-lg font-bold uppercase tracking-[0.08em] text-ink">
          {name}
        </span>
        <span className="max-w-[46ch] text-sm text-ink-mute">{teaches}</span>

        <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-2xs uppercase tracking-[0.16em]">
          {completed ? (
            <>
              <span className="flex items-center gap-2 text-ink">
                <Check className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                {strings.hub.completed}
              </span>
              {record?.badge && (
                <span className="text-ink-mute">
                  {strings.hub.badgeLabel}: <span className="text-ink">{record.badge}</span>
                </span>
              )}
              <span className="text-ink-mute">{strings.hub.replayLabel}</span>
            </>
          ) : (
            <>
              <span className="text-ink-mute">{strings.hub.openTonight}</span>
              <span className="text-ink">{strings.hub.playLabel}</span>
            </>
          )}
        </span>
      </button>
    </li>
  );
}

export default function CityBoard({
  progress,
  here,
  onEnter,
}: {
  progress: Record<string, MissionRecord>;
  /** Location id the player is currently inside, if any. */
  here: string | null;
  onEnter: (key: string) => void;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<string, HTMLElement>());
  const [threads, setThreads] = useState<Thread[]>([]);
  const [pins, setPins] = useState<{ x: number; y: number; solid: boolean }[]>([]);

  /*
   * Threads are measured from the laid-out cards, never guessed from the grid,
   * so they survive the collapse to one column at 390px and any reflow between.
   * Same technique as the evidence board, for the same reason: a thread that
   * misses its pin is worse than no thread.
   */
  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const origin = board.getBoundingClientRect();
    const points = LOCATIONS.map((location) => {
      const el = cards.current.get(location.id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left - origin.left + r.width / 2,
        y: r.top - origin.top + 14,
        // A solid pin means that world is finished; an open one means it is not.
        solid: Boolean(progress[location.id]),
      };
    });

    const placed = points.filter((p): p is { x: number; y: number; solid: boolean } => Boolean(p));
    const next: Thread[] = [];
    for (let i = 1; i < placed.length; i += 1) {
      next.push({ x1: placed[i - 1].x, y1: placed[i - 1].y, x2: placed[i].x, y2: placed[i].y });
    }
    setThreads(next);
    setPins(placed);
  }, [progress]);

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
    <div ref={boardRef} className="board relative rounded-doc border border-line p-4 lg:p-6">
      <ol className="relative grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
        {LOCATIONS.map((location, i) => (
          <LocationCard
            key={location.id}
            location={location}
            place={PLACES[i]}
            record={progress[location.id]}
            here={here === location.id}
            onEnter={onEnter}
            cardRef={(el) => {
              if (el) cards.current.set(location.id, el);
              else cards.current.delete(location.id);
            }}
          />
        ))}
      </ol>

      {/*
        Threads and pins paint above the cards, as on the evidence board - a
        thread that hides behind what it ties together is not a thread. Purely
        decorative: the reading order and the state of every location are
        already in the text, so this is aria-hidden.
      */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {threads.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            /*
             * Every thread reports a length of 1 regardless of how far apart
             * two locations landed. Inert in the game; it is what lets the
             * overview page draw them all with a single dash rule as the board
             * comes into view.
             */
            pathLength="1"
            stroke="var(--ink-faint)"
            strokeWidth="1"
            strokeOpacity="0.8"
          />
        ))}
        {pins.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--ink-faint)" />
            {!p.solid && <circle cx={p.x} cy={p.y} r="1.5" fill="var(--void)" />}
          </g>
        ))}
      </svg>
    </div>
  );
}
