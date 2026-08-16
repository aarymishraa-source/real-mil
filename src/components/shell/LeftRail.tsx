import { Lock } from "lucide-react";
import strings from "../../content/strings.json";
import { ROOMS } from "./rooms";
import type { Phase } from "../../state/gameMachine";

/**
 * The 72px left rail - PROTOTYPE_SPEC persistent chrome.
 *
 * Nine rooms, five of them real. The other four sit at --ink-mute with a lock
 * glyph and say what they are: "Unlocks in the full build."
 *
 * They are NOT buttons. A control that looks live and does nothing is worse
 * than an honest boundary - the spec's own words - so the locked four render
 * as plain list items with no tab stop and no click target. Nothing about them
 * invites a press.
 *
 * The city comes first: it is the room every run starts in and the one every
 * other room is reached from. Your record and the teacher view sit after the
 * mission rooms because they are things you read, not things you play.
 *
 * NOVA's icon is concentric orbits, matching her avatar. Nothing in this rail
 * uses a face - the profile icon is a bust outline, which is the platform
 * convention for "your account" rather than a picture of a person.
 *
 * The list itself lives in rooms.ts, shared with the mobile bar. This rail is
 * one presentation of the rooms, not the definition of them.
 */
const ITEMS = ROOMS;

function Tooltip({ children }: { children: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-btn border border-line bg-raised px-3 py-2 font-mono text-2xs text-ink group-hover:block group-focus-within:block"
    >
      {children}
    </span>
  );
}

export default function LeftRail({
  phase,
  onNavigate,
}: {
  phase: Phase;
  onNavigate?: (phase: Phase) => void;
}) {
  return (
    <nav
      aria-label={strings.rail.label}
      className="fixed left-0 top-0 z-30 hidden h-full w-18 border-r border-line bg-void/80 backdrop-blur lg:block"
    >
      <ul className="flex flex-col items-center gap-2 py-6">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.phase !== null;
          const current = item.phase === phase;

          if (!active) {
            return (
              <li key={item.id} className="group relative">
                {/*
                  --ink-mute, not --ink-faint. These icons say which rooms
                  exist, which is content. The lock glyph and the absent border
                  carry "locked" - dimming it into illegibility never did.
                */}
                <span className="flex h-12 w-12 items-center justify-center rounded-btn text-ink-mute">
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                  <Lock
                    className="absolute bottom-2 right-2 h-3 w-3"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span className="sr-only">
                    {item.label}. {strings.rail.locked}.
                  </span>
                </span>
                <Tooltip>{`${item.label} — ${strings.rail.locked}`}</Tooltip>
              </li>
            );
          }

          return (
            <li key={item.id} className="group relative">
              <button
                type="button"
                onClick={() => item.phase && onNavigate?.(item.phase)}
                aria-current={current ? "page" : undefined}
                className={`flex h-12 w-12 items-center justify-center rounded-btn border transition-colors duration-[120ms] ease-real ${
                  current
                    ? "border-verified/60 text-verified"
                    : "border-transparent text-ink hover:border-line"
                }`}
              >
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only">{item.label}</span>
              </button>
              <Tooltip>{item.label}</Tooltip>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
