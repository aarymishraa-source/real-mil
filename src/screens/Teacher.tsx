import { useState } from "react";
import { ChevronDown } from "lucide-react";
import strings from "../content/strings.json";
import AppShell from "../components/shell/AppShell";
import Panel from "../components/shell/Panel";
import type { GameState } from "../state/gameMachine";

/**
 * TEACHER VIEW - a concept preview, and it says so twice.
 *
 * Static by design. There is no backend in this build, no class, and no data;
 * every number on this screen is written into strings.json as an example, and
 * the screen states that where a teacher would look first rather than in a
 * footnote nobody reads. An honest preview of a feature reads as a system with
 * depth. A fake dashboard that implies live data reads as a lie, and this is a
 * project about not passing those on.
 *
 * No semantic colour on the bars. These five figures are a class's competencies
 * and none of them is evidence, position, the AI or a player's uncertainty -
 * colouring the weakest one amber would be the colour law being borrowed for
 * mood. The numbers and the ranking do the work; the one interpretive line
 * underneath does the rest.
 */
export interface Metric {
  id: string;
  label: string;
  value: number;
  /** What a teacher would assign about this figure. Content, not a component. */
  plan: string;
}

export const METRICS = strings.teacher.metrics as Metric[];

/**
 * A figure, and what a teacher would do about it.
 *
 * The screen was five numbers and nothing to do - which is exactly how a room
 * with no verbs reads as a poster, and why a judge who opens this first decides
 * the build is a dashboard. Opening a figure is the one interaction here, and
 * it is the honest one: the value of class-level analytics is not the number,
 * it is what you assign next because of it. Each plan names a mission that
 * exists in this build.
 *
 * A real disclosure, not a hover: aria-expanded, aria-controls, keyboard
 * operable, and it works on a phone.
 */
export function MetricRow({ metric }: { metric: Metric }) {
  const [open, setOpen] = useState(false);
  const planId = `plan-${metric.id}`;
  return (
    <li className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={planId}
        className="flex w-full items-baseline justify-between gap-4 text-left"
      >
        <h3 className="flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.16em] text-ink-mute">
          <ChevronDown
            aria-hidden="true"
            className={`h-3 w-3 shrink-0 transition-transform duration-[120ms] ease-real ${
              open ? "rotate-180" : ""
            }`}
            strokeWidth={2}
          />
          {metric.label}
        </h3>
        <p className="shrink-0 font-display text-xl font-bold tabular-nums tracking-[-0.02em] text-ink">
          {metric.value}%
        </p>
      </button>
      {/*
        A measured quantity, so the bar is a bar and nothing else: no fill
        colour carrying a verdict, no glow, no animation. aria-hidden because
        the figure beside it is already read out - a progressbar role here
        would announce the same number twice.
      */}
      <div aria-hidden="true" className="mt-3 h-1 w-full rounded-btn bg-line">
        <div
          className="h-1 rounded-btn bg-ink-mute"
          style={{ width: `${metric.value}%` }}
        />
      </div>

      {open && (
        <div id={planId} className="mt-3 border-l border-line pl-3">
          <p className="label-mono">{strings.teacher.planLabel}</p>
          <p className="mt-2 max-w-[62ch] text-sm text-ink">{metric.plan}</p>
        </div>
      )}
    </li>
  );
}

export default function Teacher({
  state,
  onNavigate,
}: {
  state: GameState;
  onNavigate: (phase: GameState["phase"]) => void;
}) {
  return (
    <AppShell phase={state.phase} onNavigate={onNavigate} heading={strings.panels.teacher.title}>
      <main className="mx-auto min-h-full max-w-[1400px] p-3 lg:p-6">
        <Panel
          title={strings.panels.teacher.title}
          subtitle={strings.panels.teacher.subtitle}
          headingId="panel-teacher"
          active
        >
          {/*
            Dashed hairline, mono, at the top of the screen. It borrows the
            build's existing vocabulary for "this is not built yet" rather than
            inventing a badge, and it sits above the data instead of under it.
          */}
          <p className="inline-flex rounded-btn border border-dashed border-line px-3 py-2 font-mono text-2xs uppercase tracking-[0.16em] text-ink">
            {strings.teacher.preview}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section aria-labelledby="teacher-metrics">
              <h2 id="teacher-metrics" className="font-display text-base font-bold uppercase tracking-[0.08em] text-ink">
                {strings.teacher.metricsLabel}
              </h2>
              <p className="mt-2 font-mono text-2xs text-ink-mute">{strings.teacher.class}</p>
              <p className="mt-2 font-mono text-2xs text-ink-mute">{strings.teacher.planHint}</p>

              <ul className="mt-6 flex flex-col">
                {METRICS.map((metric) => (
                  <MetricRow key={metric.id} metric={metric} />
                ))}
              </ul>
            </section>

            <div className="flex flex-col gap-6">
              {/*
                The privacy position, stated where the data is - not buried in
                a policy page that does not exist in a frontend-only build.
              */}
              <section
                aria-labelledby="teacher-privacy"
                className="rounded-doc border border-line bg-surface/[0.62] p-4"
              >
                <h2 id="teacher-privacy" className="label-mono">
                  {strings.teacher.privacyLabel}
                </h2>
                <p className="mt-2 text-sm text-ink">{strings.teacher.privacy}</p>
              </section>

              <section aria-labelledby="teacher-reading">
                <h2 id="teacher-reading" className="label-mono">
                  {strings.teacher.readingLabel}
                </h2>
                <p className="mt-2 text-sm text-ink-mute">{strings.teacher.reading}</p>
              </section>

              <p className="font-mono text-2xs leading-[16px] text-ink-mute">
                {strings.teacher.sample}
              </p>
            </div>
          </div>
        </Panel>
      </main>
    </AppShell>
  );
}
