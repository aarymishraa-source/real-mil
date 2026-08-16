/**
 * Which mission is loaded.
 *
 * Every screen already reads its copy, numbers and outcomes from a mission
 * JSON file, so adding a second mission is a selection, not a refactor: this
 * module is the one place that decides which file the components see, and the
 * components keep importing "the mission" exactly as before.
 *
 * Selection is by query string - `?mission=02` - because a demo needs to be
 * linkable. A judge is given a URL, not a settings screen, and nothing about
 * the run should depend on state a fresh browser does not have. Anything
 * unrecognised falls back to mission 01 rather than erroring: a mistyped
 * parameter should still open a working game.
 *
 * The cast is deliberate. Mission 01 defines the shape of a mission, and the
 * components are typed against it; a union of two JSON literal types would
 * make every optional field (chip, attachment, involves) a compile error in a
 * component that has done nothing wrong.
 */
import mission01 from "./mission01.json";
import mission02 from "./mission02.json";

export type Mission = typeof mission01;

export const missions: Record<string, Mission> = {
  "01": mission01,
  "02": mission02 as unknown as Mission,
};

const params = typeof window === "undefined" ? null : new URLSearchParams(window.location.search);

function selectedKey(): string {
  const raw = params?.get("mission");
  if (!raw) return "01";
  // "2", "02", "m02", "m02-the-copy" all resolve to the same mission.
  const key = raw.replace(/^m/i, "").slice(0, 2).padStart(2, "0");
  return key in missions ? key : "01";
}

/** Which mission this page is running, as a hub location id. */
export const activeKey = selectedKey();

/**
 * Set by the hub when it launches a mission, because switching missions means
 * a page load: every screen reads its content from the module above, which is
 * resolved once at import. `go` says the player has already been through Boot
 * this session, so the reload drops them straight into the feed instead of
 * replaying the power-on. A bare `?mission=02` still boots normally, so a
 * shared demo link keeps its first three seconds.
 */
export const launchedFromHub = params?.has("go") ?? false;

export default missions[activeKey];
