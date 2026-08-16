import {
  Rss,
  Search,
  Orbit,
  FlaskConical,
  Network,
  Map,
  UserRound,
  GraduationCap,
  Settings,
  type LucideIcon,
} from "lucide-react";
import strings from "../../content/strings.json";
import type { Phase } from "../../state/gameMachine";

/**
 * The rooms, once.
 *
 * This list used to live inside LeftRail, which was fine while the rail was the
 * only way to reach anything. It stopped being fine the moment the rail turned
 * out to be desktop-only: the hub became unreachable on a phone, we patched
 * that one destination with a button on Reflect, and then Your record and the
 * teacher view were quietly unreachable at 390px for exactly the same reason.
 *
 * Patching destinations one at a time is what let the second one through. So
 * the list is the shared source now, and every navigation surface renders from
 * it - the 72px rail on desktop, the bottom bar on mobile. A room added here
 * appears in both, and cannot be built without a route to it on a phone.
 */
export interface Room {
  id: string;
  label: string;
  icon: LucideIcon;
  /** null = named in the chrome, not in this build. */
  phase: Phase | null;
}

export const ROOMS: Room[] = [
  { id: "hub", label: strings.rail.hub, icon: Map, phase: "hub" },
  { id: "feed", label: strings.rail.feed, icon: Rss, phase: "feed" },
  { id: "search", label: strings.rail.search, icon: Search, phase: null },
  { id: "nova", label: strings.rail.nova, icon: Orbit, phase: "nova" },
  { id: "media", label: strings.rail.media, icon: FlaskConical, phase: null },
  { id: "algorithm", label: strings.rail.algorithm, icon: Network, phase: null },
  { id: "profile", label: strings.rail.profile, icon: UserRound, phase: "profile" },
  { id: "teacher", label: strings.rail.teacher, icon: GraduationCap, phase: "teacher" },
  { id: "settings", label: strings.rail.settings, icon: Settings, phase: null },
];

/** The rooms that actually go somewhere. */
export const LIVE_ROOMS = ROOMS.filter((room) => room.phase !== null);
