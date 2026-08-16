import { useEffect, useState } from "react";
import mission from "../content/mission";
import strings from "../content/strings.json";
import AppShell from "../components/shell/AppShell";
import Panel from "../components/shell/Panel";
import Cascade, { CASCADE_MS } from "../components/outcome/Cascade";
import ConsequencePanel, { type OutcomeData } from "../components/outcome/ConsequencePanel";
import { playerPost } from "../content/playerPost";
import { usePrefersReducedMotion } from "../lib/motion";
import { initialState, type GameState, type Path } from "../state/gameMachine";

/**
 * OUTCOME - PROTOTYPE_SPEC section 6. Both branches, fully built.
 *
 * The counterfactual is always the opposite pole: if the player shared, they
 * see the correction they could have written; otherwise they see what sharing
 * would have cost. Pairing best against worst is what makes the split-screen
 * teach something rather than just fill the right-hand column.
 *
 * NO HUD SIDEBAR ON THIS PHASE. Trust and Reach are already the largest
 * numbers on the screen - repeating them in a 320px rail is duplication, and
 * it left a short panel stranding ~600px of dead column beside a very tall
 * one. The evidence counter went with it: it measures progress through an
 * activity that has ended, and a progress meter on a finished activity reads
 * as stale even when its number is correct. What replaces it is the choice
 * itself, because that is the one piece of context the two numbers need -
 * without it the screen is a scoreboard rather than a consequence.
 */
const outcomes = mission.outcomes as Record<string, OutcomeData & { cascade?: boolean }>;
const decisions = mission.decisions as { label: string; outcome: string }[];

/** Trust and Reach both start where the mission started. */
const FROM = { trust: initialState.trust, reach: initialState.reach };

export default function Outcome({
  state,
  onNext,
  onNavigate,
}: {
  state: GameState;
  onNext: () => void;
  onNavigate: (phase: GameState["phase"]) => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const path = (state.path ?? "careless") as Exclude<Path, null>;
  const taken = outcomes[path];
  const counterfactual = outcomes[path === "careless" ? "correction" : "careless"];
  const chosen = decisions.find((d) => d.outcome === path);

  const runsCascade = Boolean(taken.cascade) && !reducedMotion;
  // Reduced motion skips straight to the end state - nothing to wait for.
  const [cascadeDone, setCascadeDone] = useState(!runsCascade);

  useEffect(() => {
    if (!runsCascade) return;
    const id = window.setTimeout(() => setCascadeDone(true), CASCADE_MS + 240);
    return () => window.clearTimeout(id);
  }, [runsCascade]);

  return (
    <AppShell phase={state.phase} onNavigate={onNavigate}>
      <main className="mx-auto min-h-full max-w-[1400px] p-3 lg:p-6">
        <Panel
          number={strings.panels.outcome.number}
          title={strings.panels.outcome.title}
          subtitle={strings.panels.outcome.subtitle}
          headingId="panel-outcome"
          active
        >
          {/* The cause, sitting with its effects. */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="label-mono">{strings.outcome.yourChoice}</p>
            <p className="font-mono text-2xs uppercase tracking-[0.16em] text-ink">
              {chosen?.label}
            </p>
            {state.uncertain && (
              <p className="font-mono text-2xs uppercase tracking-[0.16em] text-pending">
                {strings.outcome.whileUnsure}
              </p>
            )}
            {state.trustedAi && (
              <p className="font-mono text-2xs uppercase tracking-[0.16em] text-nova-ink">
                {strings.outcome.wentWithNova}
              </p>
            )}
          </div>

          {taken.cascade && (
            <section className="mt-4">
              <p className="label-mono">{strings.outcome.spreading}</p>
              <div className="mt-2 max-w-[620px]">
                <Cascade />
              </div>
            </section>
          )}

          {/*
            The consequence arrives after the cascade has finished, not during
            it. Watching it spread and reading what it cost at the same time
            splits the attention and blunts both.
          */}
          {cascadeDone && (
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <section aria-labelledby="outcome-taken">
                <h3 id="outcome-taken" className="label-mono">
                  {strings.outcome.taken}
                </h3>
                <div className="mt-3">
                  <ConsequencePanel outcome={taken} from={FROM} post={playerPost(path)} />
                </div>
              </section>

              <section aria-labelledby="outcome-untaken">
                <h3 id="outcome-untaken" className="label-mono">
                  {strings.outcome.untaken}
                </h3>
                <div className="mt-3">
                  <ConsequencePanel
                    outcome={counterfactual}
                    from={FROM}
                    secondary
                    animate={false}
                  />
                </div>
              </section>
            </div>
          )}

          {cascadeDone && (
            <div className="mt-8 border-t border-line pt-4">
              {/*
                Neutral, not cyan. This goes to the reflection screen - neither
                evidence nor a position marker, so it has no claim on the
                colour law. Weight comes from the border and the padding.
              */}
              <button
                type="button"
                onClick={onNext}
                className="rounded-btn border border-ink-mute px-6 py-3 font-mono text-2xs uppercase tracking-[0.16em] text-ink transition-colors duration-[120ms] ease-real hover:border-ink"
              >
                {strings.actions.next}
              </button>
            </div>
          )}

          {/*
            The counters lost their live region when the HUD sidebar went, so
            the settled figures are announced here instead.
          */}
          <p className="sr-only" aria-live="polite">
            {cascadeDone
              ? `${strings.outcome.yourChoice}: ${chosen?.label}. ${taken.headline} ${strings.hud.trust} ${taken.trust}%. ${strings.hud.reach} ${taken.reach}%.`
              : ""}
          </p>
        </Panel>
      </main>
    </AppShell>
  );
}
