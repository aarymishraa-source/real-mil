import { useCallback, useEffect, useReducer, useState } from "react";
import { reducer, initialState } from "./state/gameMachine";
import strings from "./content/strings.json";
import mission, { activeKey, launchedFromHub } from "./content/mission";
import { findableCount, recordMission } from "./state/progress";
import FeedColumn from "./components/feed/FeedColumn";
import { type ActionId } from "./components/feed/ActionBar";
import AppShell from "./components/shell/AppShell";
import Panel from "./components/shell/Panel";
import Boot from "./screens/Boot";
import Landing from "./screens/Landing";
import Hub from "./screens/Hub";
import Profile from "./screens/Profile";
import Teacher from "./screens/Teacher";
import Investigate from "./screens/Investigate";
import Nova from "./screens/Nova";
import Decide from "./screens/Decide";
import Outcome from "./screens/Outcome";
import Reflect from "./screens/Reflect";
import type { GameState, Path } from "./state/gameMachine";
import { TrustReachMeter, CompactHud } from "./components/hud/TrustReachMeter";

/*
 * The overview page is a path, not a phase.
 *
 * The root serves the page and the game lives at /play. That is a deliberate
 * swap: the first thing a visitor meets should be the page - and because the
 * page's hero IS the real Boot component, they still land on the product's own
 * opening screen. It simply scrolls now as well as accepting the prompt.
 *
 * /about is kept as an alias so any link already shared still resolves, and
 * anything unrecognised falls through to the page rather than erroring.
 * vercel.json rewrites every path to index.html, so these two lines are the
 * whole of the "routing" - no router, per CLAUDE.md section 1.
 */
const PATH =
  typeof window === "undefined" ? "/" : window.location.pathname.replace(/\/+$/, "") || "/";
const isOverview = PATH !== "/play";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  /*
   * Which post has its actions open. Deliberately NOT in the game machine:
   * it is view state, it has no bearing on trust, reach or the path taken, and
   * putting it in the reducer would mean "Play the other path" had to remember
   * to clear it.
   */
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  /*
   * Whether the player has actually walked into the mission this page is
   * running. The mission is chosen by URL and resolved at import, so "which
   * mission is loaded" is known from the first frame - but the hub must not
   * mark a location "you are here" for a world nobody has entered yet.
   */
  const [entered, setEntered] = useState(launchedFromHub);

  // Stable identity: Boot binds window listeners against it.
  const startHub = useCallback(() => dispatch({ type: "GOTO", phase: "hub" }), []);
  const backToFeed = useCallback(() => dispatch({ type: "GOTO", phase: "feed" }), []);

  /*
   * The session record, written the moment a run resolves.
   *
   * The reducer holds one run of one mission and cannot hold two, because
   * changing mission is a page load. This is what lets the hub say a world is
   * finished and the profile say which skills that run earned, after the
   * reload has thrown the reducer away. Session only - see state/progress.ts.
   */
  useEffect(() => {
    if (!state.path) return;
    recordMission({
      missionId: mission.missionId,
      key: activeKey,
      title: mission.title,
      path: state.path,
      badge: state.badge,
      evidenceFound: state.evidenceFound,
      novaUsed: state.novaUsed,
      foundAll: state.evidenceFound.length >= findableCount(activeKey),
    });
  }, [state.path, state.badge, state.evidenceFound, state.novaUsed]);

  /*
   * Entering a location from the map. If it is the mission this page already
   * has loaded, that is a phase change and nothing more. If it is the other
   * one, the content module has to be resolved again, so it is a navigation:
   * `go` tells the fresh page the player has already been through Boot.
   */
  const enterLocation = useCallback((key: string) => {
    if (key === activeKey) {
      setEntered(true);
      dispatch({ type: "GOTO", phase: "feed" });
      return;
    }
    window.location.assign(`${window.location.pathname}?mission=${key}&go=1`);
  }, []);

  const togglePost = useCallback(
    (id: string) => setOpenPostId((current) => (current === id ? null : id)),
    [],
  );

  const handleAction = useCallback((action: ActionId) => {
    switch (action) {
      case "share":
        // Share skips DECIDE entirely. Acting without deliberating IS the
        // careless path, so routing it through a deliberation screen would
        // contradict the thing being modelled.
        dispatch({ type: "DECIDE", path: "careless" });
        break;
      case "investigate":
        dispatch({ type: "GOTO", phase: "investigate" });
        break;
      case "nova":
        dispatch({ type: "GOTO", phase: "nova" });
        break;
      case "wait":
        // Stays on the feed on purpose: waiting is not an exit, it is time
        // passing while the pressure builds.
        dispatch({ type: "WAIT" });
        break;
    }
  }, []);

  const findEvidence = useCallback((id: string) => dispatch({ type: "FIND_EVIDENCE", id }), []);
  const goToDecide = useCallback(
    (uncertain: boolean) => dispatch({ type: "GOTO_DECIDE", uncertain }),
    [],
  );
  const trustNova = useCallback(() => dispatch({ type: "TRUST_NOVA" }), []);
  const novaReply = useCallback((id: string) => dispatch({ type: "NOVA_REPLY", id }), []);
  /** The left rail's live rooms. */
  const navigate = useCallback((phase: GameState["phase"]) => {
    // Walking into the feed from the rail is entering this world, same as
    // pressing its card on the map - the hub should say so either way.
    if (phase === "feed" || phase === "nova") setEntered(true);
    dispatch({ type: "GOTO", phase });
  }, []);
  const decide = useCallback(
    (path: Exclude<Path, null>) => dispatch({ type: "DECIDE", path }),
    [],
  );
  const goToReflect = useCallback(() => dispatch({ type: "GOTO", phase: "reflect" }), []);
  /*
   * Replay clears the open action bar as well as the machine. openPostId is
   * view state and survives the reducer's reset, so without this the player
   * lands back on a "fresh" feed with the target post already opened from
   * their last run - a leftover that quietly gives the game away.
   */
  const replay = useCallback(() => {
    setOpenPostId(null);
    dispatch({ type: "RESET_KEEP_BADGE" });
  }, []);
  const goToInvestigate = useCallback(
    () => dispatch({ type: "GOTO", phase: "investigate" }),
    [],
  );

  /*
   * Boot is deliberately NOT wrapped in AppShell. It mounts its own
   * AtmosphereLayer so the grain, scanlines and vignette land on top of the
   * city photograph (ART_DIRECTION section 5); AppShell's copy sits behind the
   * content layer, which would leave the photo outside the world. Wrapping it
   * would also render the atmosphere twice.
   */
  if (isOverview) {
    return <Landing />;
  }

  if (state.phase === "boot") {
    return <Boot onStart={startHub} />;
  }

  /*
   * The three rooms outside the loop. They render before the mission phases
   * because none of them needs the mission's state - the hub reads the session
   * record, the profile reads the record plus whatever run is in progress, and
   * the teacher view reads nothing at all.
   */
  if (state.phase === "hub") {
    return (
      <Hub
        state={state}
        here={entered ? activeKey : null}
        onEnter={enterLocation}
        onNavigate={navigate}
      />
    );
  }

  if (state.phase === "profile") {
    return <Profile state={state} onEnter={enterLocation} onNavigate={navigate} />;
  }

  if (state.phase === "teacher") {
    return <Teacher state={state} onNavigate={navigate} />;
  }

  if (state.phase === "investigate") {
    return (
      <Investigate
        state={state}
        onFind={findEvidence}
        onDecide={goToDecide}
        onNavigate={navigate}
      />
    );
  }

  if (state.phase === "nova") {
    return (
      <Nova
        state={state}
        onReply={novaReply}
        onTrust={trustNova}
        onInvestigate={goToInvestigate}
        onClose={backToFeed}
        onNavigate={navigate}
      />
    );
  }

  if (state.phase === "decide") {
    return <Decide state={state} onDecide={decide} onNavigate={navigate} />;
  }

  if (state.phase === "outcome") {
    return <Outcome state={state} onNext={goToReflect} onNavigate={navigate} />;
  }

  if (state.phase === "reflect") {
    return <Reflect state={state} onReplay={replay} onNavigate={navigate} />;
  }

  return (
    <AppShell phase={state.phase} onNavigate={navigate}>
      <CompactHud state={state} />

      {/*
        minmax(0,620px), not a fixed 620px. At exactly the lg breakpoint the
        old grid needed 72 (rail) + 620 + 24 + 320 + 48 (padding) = 1084 in a
        1024 viewport and hung the sidebar off the screen - iPad landscape.
        The feed column now yields instead of overflowing, and justify-center
        keeps the pair centred instead of 32px left of true centre at 1920.
      */}
      <main className="mx-auto grid min-h-full max-w-[1100px] grid-cols-1 gap-6 p-3 lg:grid-cols-[minmax(0,620px)_320px] lg:justify-center lg:p-6">
        <Panel
          number={strings.panels.feed.number}
          title={strings.panels.feed.title}
          subtitle={strings.panels.feed.subtitle}
          headingId="panel-feed"
          active
        >
          <FeedColumn
            openPostId={openPostId}
            onTogglePost={togglePost}
            onAction={handleAction}
            waited={state.waited}
          />
        </Panel>

        <TrustReachMeter state={state} />
      </main>
    </AppShell>
  );
}
