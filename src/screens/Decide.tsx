import mission from "../content/mission";
import strings from "../content/strings.json";
import AppShell from "../components/shell/AppShell";
import Panel from "../components/shell/Panel";
import { TrustReachMeter, CompactHud } from "../components/hud/TrustReachMeter";
import type { GameState, Path } from "../state/gameMachine";

/**
 * DECIDE - PROTOTYPE_SPEC section 5.
 *
 * Three options and no clock. The pressure in this mission comes from the
 * replies piling up, not from a countdown - a timer would teach panic, which
 * is the opposite of "Pause. Question. Verify." The absence of a timer is
 * stated on screen, because a player who has been trained by other games will
 * be waiting for one.
 *
 * "Post a correction" is deliberately the heaviest card: more copy, a list of
 * what it actually costs you, and the most effort label. It is also the option
 * that pays best, which the player only learns on the next screen. That gap is
 * the lesson - the right thing looks like more work at the moment of choosing.
 */
const decide = mission.decide as {
  prompt: string;
  uncertainPrompt: string;
  noTimer: string;
};

const decisions = mission.decisions as {
  id: string;
  label: string;
  outcome: string;
  effort: string;
  detail: string;
  involves?: string[];
}[];

/*
 * NO SEMANTIC COLOUR ON THIS SCREEN.
 *
 * The options used to carry their outcome colours - red on Share it, amber on
 * Hold and verify, cyan on Post a correction. That is the colour law doing the
 * one thing it must never do here: marking the answer before the player has
 * chosen. The whole design of this screen is that you weigh what each option
 * costs and decide; pre-colouring them turns a decision into a quiz with the
 * right answer highlighted, and the cyan option is unmistakably "the correct
 * one" to anyone who has been paying attention to the palette for six screens.
 *
 * Differentiation lives where it can't leak the answer: the effort meter, the
 * size of the row, and how much detail each option has to carry. The colours
 * come back on OUTCOME, once the choice has been made and they can explain
 * what happened rather than instruct what to pick.
 */
const CARD = "border-line hover:border-ink-mute";

/**
 * Effort, as a quantity you can see rather than a phrase you have to read.
 * Neutral on purpose: the meter measures cost, and the label beside it carries
 * the semantic colour saying what kind of act it is. A red-filled meter would
 * read as a danger rating instead of an effort one.
 */
function EffortMeter({ level }: { level: number }) {
  return (
    <span aria-hidden="true" className="flex shrink-0 items-end gap-1">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`w-1 rounded-btn ${n <= level ? "bg-ink-mute" : "bg-line"} ${
            n === 1 ? "h-2" : n === 2 ? "h-3" : "h-4"
          }`}
        />
      ))}
    </span>
  );
}

export default function Decide({
  state,
  onDecide,
  onNavigate,
}: {
  state: GameState;
  onDecide: (path: Exclude<Path, null>) => void;
  onNavigate: (phase: GameState["phase"]) => void;
}) {
  return (
    <AppShell phase={state.phase} onNavigate={onNavigate}>
      <CompactHud state={state} />

      <main className="mx-auto grid min-h-full max-w-[1400px] grid-cols-1 gap-6 p-3 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-6">
        <Panel
          number={strings.panels.decide.number}
          title={strings.panels.decide.title}
          subtitle={strings.panels.decide.subtitle}
          headingId="panel-decide"
          active
        >
          {/*
            Arriving via "I still don't know" is acknowledged, not corrected.
            Uncertainty is a legitimate route through this mission and the
            framing has to say so, or the screen quietly calls it a failure.
          */}
          <p className="max-w-[620px] text-sm text-ink">
            {state.uncertain ? decide.uncertainPrompt : decide.prompt}
          </p>
          <p className="mt-2 font-mono text-2xs text-ink-mute">{decide.noTimer}</p>

          {/*
            A ladder, not a row of three.

            Three equal cards side by side present three equal alternatives,
            which is exactly the wrong idea: the whole lesson of this screen is
            that the options are NOT equal, that the right one costs the most,
            and that you are choosing what you are willing to spend. Read top
            to bottom the cost rises, the row gets heavier, and the correction
            is plainly the biggest thing on the screen.

            It also removes the 768px failure mode, where three columns squeezed
            the correction's list into 226px and made the hardest option look
            cramped rather than substantial.
          */}
          <ul className="mt-6 flex max-w-[760px] flex-col gap-3">
            {decisions.map((decision, i) => (
              <li key={decision.id}>
                <button
                  type="button"
                  onClick={() => onDecide(decision.outcome as Exclude<Path, null>)}
                  className={`flex w-full flex-col gap-3 rounded-post border bg-surface/[0.62] p-6 text-left transition-colors duration-[120ms] ease-real ${CARD}`}
                >
                  <span className="flex items-center gap-4">
                    <EffortMeter level={i + 1} />
                    <span className="font-mono text-2xs uppercase tracking-[0.16em] text-ink-mute">
                      {decision.effort}
                    </span>
                  </span>

                  <span className="font-display text-lg font-bold uppercase tracking-[0.08em] text-ink">
                    {decision.label}
                  </span>
                  <span className="max-w-[52ch] text-sm text-ink-mute">{decision.detail}</span>

                  {decision.involves && (
                    <span className="mt-1 flex flex-col gap-2 border-t border-line pt-4">
                      <span className="font-mono text-2xs uppercase tracking-[0.16em] text-ink-mute">
                        {strings.outcome.involves}
                      </span>
                      {decision.involves.map((step) => (
                        <span
                          key={step}
                          className="flex gap-3 font-mono text-2xs leading-[16px] text-ink-mute"
                        >
                          <span aria-hidden="true" className="text-ink-mute">—</span>
                          {step}
                        </span>
                      ))}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <TrustReachMeter state={state} />
      </main>
    </AppShell>
  );
}
