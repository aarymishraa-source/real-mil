import type { ReactNode } from "react";
import strings from "../../content/strings.json";
import mission from "../../content/mission";
import AtmosphereLayer from "./AtmosphereLayer";
import LeftRail from "./LeftRail";
import RoomBar from "./RoomBar";
import PhaseIndicator from "../hud/PhaseIndicator";
import type { Phase } from "../../state/gameMachine";

/**
 * AppShell - CLAUDE.md section 7 step 2, finished at step 10.
 *
 * The persistent chrome: the atmosphere behind everything, the 72px rail of
 * rooms down the left, and the six-step loop marker across the top. Boot does
 * not use this - it mounts the atmosphere itself so the layer lands on top of
 * the city photograph.
 *
 * The rail is desktop-only. At 390px a 72px rail would take a fifth of the
 * width to show two live icons, and the phases it navigates to are all
 * reachable from the feed anyway.
 */
/**
 * The six phases that ARE the core loop. The hub, the profile and the teacher
 * view are rooms, not steps, so the marker does not render there: a six-step
 * indicator with nothing lit reads as a loop the player has fallen out of, when
 * they have simply walked into another room.
 */
const LOOP: Phase[] = ["feed", "nova", "investigate", "decide", "outcome", "reflect"];

export default function AppShell({
  phase,
  onNavigate,
  heading,
  children,
}: {
  phase: Phase;
  onNavigate?: (phase: Phase) => void;
  /** Names the room in the h1 when the screen is not inside a mission. */
  heading?: string;
  children: ReactNode;
}) {
  return (
    <>
      <AtmosphereLayer />
      <LeftRail phase={phase} onNavigate={onNavigate} />
      <RoomBar phase={phase} onNavigate={onNavigate} />
      {/*
        pb-16 below lg: the mobile room bar is fixed, so without it the last
        thing on every screen sits underneath the bar - and on Reflect that is
        the button that leaves the screen.
      */}
      <div className="relative z-10 min-h-full pb-16 lg:pb-0 lg:pl-18">
        {/*
          Every screen needs a level-one heading. Boot has the wordmark; the
          rest previously started at h2 (the Panel title), leaving the document
          with no h1 at all. Visually hidden because the Panel already states
          where you are - this is for structure, not decoration.
        */}
        <h1 className="sr-only">
          {strings.brand.name} — {heading ?? mission.title}
        </h1>
        {LOOP.includes(phase) && <PhaseIndicator phase={phase} />}
        {children}
      </div>
    </>
  );
}
