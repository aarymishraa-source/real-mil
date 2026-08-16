/**
 * What the player has done, across missions, for this session only.
 *
 * The reducer holds one run of one mission and cannot hold more: switching
 * missions is a page load, because every screen resolves its content from
 * `content/mission` at import time. So the hub and the profile need somewhere
 * to read "you finished The Feed as a correction" after that reload.
 *
 * sessionStorage, not localStorage, and that is a design position rather than a
 * shortcut: CLAUDE.md section 1 allows exactly this much persistence, and a
 * game about consequences should not quietly follow a player around after they
 * close the tab. Every read is defensive - Safari private mode throws on write,
 * and a thrown storage error must never take a screen down with it.
 */
import { missions } from "../content/mission";

export interface MissionRecord {
  missionId: string;
  /** Hub location id, e.g. "02" - how the hub finds this record. */
  key: string;
  title: string;
  /** "careless" | "careful" | "correction". */
  path: string;
  badge: string | null;
  evidenceFound: string[];
  novaUsed: string[];
  /** Every findable slot in that mission was found. */
  foundAll: boolean;
}

const KEY = "real:progress";

/**
 * How many evidence slots a mission actually lets you find.
 *
 * Not `evidenceTotal`. That is seven in both missions and always will be -
 * four of the seven are the honestly locked slots. Measuring "found
 * everything" against seven would mean no player could ever find everything,
 * which is the kind of quietly impossible condition that makes a skill tree
 * feel rigged.
 */
export function findableCount(key: string): number {
  const evidence = (missions[key]?.evidence as { state: string }[] | undefined) ?? [];
  return evidence.filter((item) => item.state === "findable").length;
}

export function readProgress(): Record<string, MissionRecord> {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    // A hand-edited or half-written value is treated as no progress at all.
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, MissionRecord>;
  } catch {
    return {};
  }
}

/**
 * Last run wins. A player who replays a mission is describing what they did
 * this time, and a record that kept the best attempt would quietly congratulate
 * them for a run they went back and undid.
 */
export function recordMission(record: MissionRecord): void {
  try {
    const all = readProgress();
    all[record.key] = record;
    window.sessionStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* Storage unavailable. The session still plays; it just does not remember. */
  }
}
