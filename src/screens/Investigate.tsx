import { useEffect, useState } from "react";
import mission from "../content/mission";
import strings from "../content/strings.json";
import AppShell from "../components/shell/AppShell";
import Panel from "../components/shell/Panel";
import FeedColumn from "../components/feed/FeedColumn";
import FeedPost, { type FeedPostData } from "../components/feed/FeedPost";
import EvidenceBoard from "../components/investigate/EvidenceBoard";
import { type EvidenceItem } from "../components/investigate/EvidenceCard";
import { TrustReachMeter, CompactHud } from "../components/hud/TrustReachMeter";
import { usePrefersReducedMotion } from "../lib/motion";
import type { GameState } from "../state/gameMachine";

const evidence = mission.evidence as EvidenceItem[];
const target = (mission.feed as FeedPostData[]).find((p) => p.kind === "target")!;
const FINDABLE = evidence.filter((e) => e.state === "findable").length;

/**
 * INVESTIGATE - CLAUDE.md section 7 step 6, the signature screen.
 *
 * The whole feed is still there, behind everything, under the Verification
 * Lens: blurred 2px and desaturated to 20% so the room visibly goes quiet.
 * The investigated post is lifted out of it and rendered sharp at the top of
 * the panel, and the evidence board takes over as the thing you act on.
 *
 * The backdrop is aria-hidden and non-interactive - it is atmosphere, not
 * content. FeedColumn's interactive={false} keeps its stretched buttons out of
 * the tab order entirely, rather than relying on aria-hidden over focusable
 * children, which is the classic way to strand a keyboard user.
 */
export default function Investigate({
  state,
  onFind,
  onDecide,
  onNavigate,
}: {
  state: GameState;
  onFind: (id: string) => void;
  onDecide: (uncertain: boolean) => void;
  onNavigate: (phase: GameState["phase"]) => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [lensOn, setLensOn] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setLensOn(true);
      return;
    }
    // A beat after mount so the transition has a state to run from.
    const id = window.setTimeout(() => setLensOn(true), 20);
    return () => window.clearTimeout(id);
  }, [reducedMotion]);

  const foundCount = state.evidenceFound.length;
  const hasEnough = foundCount >= FINDABLE;

  return (
    <AppShell phase={state.phase} onNavigate={onNavigate}>
      {/* The room, going quiet. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`h-full ${lensOn ? "lens lens-on" : "lens"}`}>
          <div className="mx-auto max-w-[1400px] px-3 pt-3 lg:px-6 lg:pt-6">
            <div className="lg:w-[620px]">
              <FeedColumn
                interactive={false}
                openPostId={null}
                onTogglePost={() => {}}
                onAction={() => {}}
                waited={state.waited}
              />
            </div>
          </div>
        </div>
      </div>

      <CompactHud state={state} />

      {/*
        Wider than the Feed on purpose. CLAUDE.md's 620/320 grid describes the
        Feed, and PROTOTYPE_SPEC section 3 says the layout *switches* here - a
        board of seven pinned documents needs a board-sized measure, not a
        column meant for one post at a time. The panel column flexes to fill
        whatever is left after the 320px HUD, so nothing is stranded.
      */}
      <main className="relative mx-auto grid min-h-full max-w-[1400px] grid-cols-1 gap-6 p-3 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-6">
        <Panel
          number={strings.panels.investigate.number}
          title={strings.panels.investigate.title}
          subtitle={strings.panels.investigate.subtitle}
          headingId="panel-investigate"
          active
        >
          {/* The one thing still in focus. */}
          <p className="label-mono">{strings.investigate.underInvestigation}</p>
          {/*
            The post keeps its feed measure even though the panel is now wider.
            It is still a post, and a 1000px-wide one would read as a banner.
          */}
          <div
            className={`mt-2 max-w-[620px] ${lensOn ? "lens-focus lens-focus-on" : "lens-focus"}`}
          >
            <FeedPost post={target} />
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="label-mono">{strings.investigate.boardLabel}</p>
            {/*
              eye-symbol as the lens badge. Small, low, and duotoned into the
              world so its violet cannot be mistaken for NOVA's - it is the
              product's signature, not a semantic signal.
            */}
            <span className="art h-6 w-9 shrink-0 overflow-hidden rounded-doc opacity-70">
              <img
                src={strings.art.eyeSymbol}
                width={strings.art.eyeSymbolWidth}
                height={strings.art.eyeSymbolHeight}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </span>
          </div>

          <div className="mt-2">
            <EvidenceBoard items={evidence} foundIds={state.evidenceFound} onFind={onFind} />
          </div>

          {/*
            Two exits, deliberately the same size, weight and shape. Uncertainty
            is a first-class choice in this game (PROTOTYPE_SPEC section 3), so
            "I still don't know" is never smaller, never a text link, and never
            hidden until the player has failed at something. Amber because the
            player chose uncertainty - the colour law, doing real work.
          */}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-4">
            {hasEnough && (
              <button
                type="button"
                onClick={() => onDecide(false)}
                className="rounded-btn border border-verified/60 px-4 py-2 font-mono text-2xs uppercase tracking-[0.04em] text-verified transition-colors duration-[120ms] ease-real hover:bg-verified/10"
              >
                {strings.actions.enough}
              </button>
            )}
            <button
              type="button"
              onClick={() => onDecide(true)}
              className="rounded-btn border border-pending/60 px-4 py-2 font-mono text-2xs uppercase tracking-[0.04em] text-pending transition-colors duration-[120ms] ease-real hover:bg-pending/10"
            >
              {strings.actions.unsure}
            </button>
          </div>
        </Panel>

        <TrustReachMeter state={state} />
      </main>
    </AppShell>
  );
}
