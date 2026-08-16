import { useState } from "react";
import { Check } from "lucide-react";
import mission from "../content/mission";
import strings from "../content/strings.json";
import AppShell from "../components/shell/AppShell";
import Panel from "../components/shell/Panel";
import type { GameState, Path } from "../state/gameMachine";

/**
 * REFLECT - PROTOTYPE_SPEC section 7. Where the game stops being a game.
 *
 * Quiet on purpose. No HUD, no counters, no glow except the one on a focused
 * input, and the only colour on the screen is the cyan of the four ticks. The
 * room going still after the cascade is the point - a screen that kept
 * shouting here would undo everything the outcome just did.
 *
 * The text box saves nowhere and is not meant to. Typing the answer IS the
 * mechanic; storing it would only invite a scoring system that this mission
 * deliberately does not have.
 */
const reflection = mission.reflection as {
  summary: Record<string, { did: string; cost: string }>;
  question: string;
  lessons: string[];
  footer: string;
};

export default function Reflect({
  state,
  onReplay,
  onNavigate,
}: {
  state: GameState;
  onReplay: () => void;
  onNavigate: (phase: GameState["phase"]) => void;
}) {
  const [answer, setAnswer] = useState("");
  const path = (state.path ?? "careless") as Exclude<Path, null>;
  const summary = reflection.summary[path];

  return (
    <AppShell phase={state.phase} onNavigate={onNavigate}>
      {/*
        The panel is constrained to the content, not the other way round.
        A reading-and-writing screen wants a narrow measure, so stretching the
        content to 1400px was never an option - but leaving a 620px column
        inside a 1400px panel left half the screen empty and read as unfinished.
        Different screens are allowed different measures; none of them are
        allowed to strand.
      */}
      <main className="mx-auto min-h-full max-w-[820px] p-3 lg:p-6">
        <Panel
          number={strings.panels.reflect.number}
          title={strings.panels.reflect.title}
          subtitle={strings.panels.reflect.subtitle}
          headingId="panel-reflect"
          active
        >
          <div className="max-w-[620px]">
            {/*
              What you did, and what it cost. Neither praised nor scolded - but
              said at the size of a conclusion rather than a caption. This
              screen is where the game stops being a game, and it spent the
              build whispering at 18px because that is the feed's voice.
            */}
            <p className="max-w-[24ch] font-display text-xl font-bold leading-[1.1] tracking-[-0.02em] text-ink">
              {summary.did}
            </p>
            <p className="mt-6 text-base leading-[26px] text-ink-mute">{summary.cost}</p>

            <div className="mt-18">
              {/*
                The question IS the mechanic - typing the answer is the whole
                exercise - and it was set at 15px, smaller than the sentence
                above it. It leads the screen now.
              */}
              <label
                htmlFor="reflect-answer"
                className="block max-w-[22ch] font-display text-lg font-bold leading-[1.2] tracking-[-0.02em] text-ink"
              >
                {reflection.question}
              </label>
              <p className="label-mono mt-2">{strings.reflect.notSaved}</p>
              {/*
                A page, not a form field. Five ruled lines with no box around
                them: the copy above says writing the answer is the mechanic,
                and a default input contradicts that in the same breath. The
                focus ring is the only thing that draws a boundary, and only
                while you are actually in it.
              */}
              <textarea
                id="reflect-answer"
                rows={5}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder={strings.reflect.placeholder}
                className="field ruled mt-4 w-full resize-y rounded-btn border border-transparent bg-transparent px-1 text-sm text-ink placeholder:text-ink-faint"
              />
            </div>

            <section className="mt-12" aria-labelledby="reflect-lessons">
              <h3 id="reflect-lessons" className="label-mono">
                {strings.reflect.lessons}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {reflection.lessons.map((lesson) => (
                  <li key={lesson} className="flex items-start gap-3">
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-verified"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-ink">{lesson}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/*
              No badge on the careless path, and nothing rendered in its place.
              An empty slot or a greyed-out "not earned" would turn an honest
              silence into a scolding - see CLAUDE.md section 4.
            */}
            {state.badge && (
              <section className="mt-12" aria-labelledby="reflect-badge">
                <h3 id="reflect-badge" className="label-mono">
                  {strings.reflect.badge}
                </h3>
                <p className="mt-2 font-display text-lg font-bold uppercase tracking-[0.08em] text-ink">
                  {state.badge}
                </p>
              </section>
            )}

            <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-6">
              {/*
                Neutral, not cyan. Both of these are navigation - they verify
                nothing and mark no position - and they are the only buttons on
                this screen, so neither needs colour to be found.
              */}
              <button
                type="button"
                onClick={onReplay}
                className="rounded-btn border border-ink-mute px-6 py-3 font-mono text-2xs uppercase tracking-[0.16em] text-ink transition-colors duration-[120ms] ease-real hover:border-ink"
              >
                {strings.actions.replay}
              </button>
              {/*
                The way back to the city, and it is here for a reason beyond
                tidiness: the left rail is desktop-only, so on a phone this is
                the ONLY route back to the hub once a mission has started.
                Without it the map would be a one-way door at 390px.
              */}
              <button
                type="button"
                onClick={() => onNavigate("hub")}
                className="rounded-btn border border-line px-6 py-3 font-mono text-2xs uppercase tracking-[0.16em] text-ink transition-colors duration-[120ms] ease-real hover:border-ink-mute"
              >
                {strings.actions.backToCity}
              </button>
            </div>

            {/* The roadmap, communicated inside the product rather than on a slide. */}
            <p className="mt-8 font-mono text-2xs leading-[16px] text-ink-mute">
              {reflection.footer}
            </p>
          </div>
        </Panel>
      </main>
    </AppShell>
  );
}
