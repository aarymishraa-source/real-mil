import strings from "../../content/strings.json";
import type { Phase } from "../../state/gameMachine";

/**
 * The core loop, made visible - PROTOTYPE_SPEC persistent chrome.
 *
 * SEE -> QUESTION -> INVESTIGATE -> DECIDE -> EXPERIENCE -> REFLECT, as a thin
 * six-step marker across the top. This is the tutorial: a player who never
 * reads a word of instruction still learns the shape of the loop by watching
 * which step lights up. That is why it must track the real phase rather than
 * being decorative.
 *
 * The game's phases are not 1:1 with the loop's steps - NOVA is where the
 * player questions the claim, and the outcome is where they experience it - so
 * the mapping is explicit rather than inferred from phase order.
 */
const STEPS: { label: string; phases: Phase[] }[] = [
  { label: strings.phases.see, phases: ["feed"] },
  { label: strings.phases.question, phases: ["nova"] },
  { label: strings.phases.investigate, phases: ["investigate"] },
  { label: strings.phases.decide, phases: ["decide"] },
  { label: strings.phases.experience, phases: ["outcome"] },
  { label: strings.phases.reflect, phases: ["reflect"] },
];

export default function PhaseIndicator({ phase }: { phase: Phase }) {
  const currentIndex = STEPS.findIndex((step) => step.phases.includes(phase));

  return (
    <nav aria-label={strings.phases.label} className="px-3 pt-3 lg:px-6 lg:pt-6">
      <ol className="mx-auto flex max-w-[1400px] gap-2">
        {STEPS.map((step, i) => {
          const isCurrent = i === currentIndex;
          const isDone = currentIndex > -1 && i < currentIndex;
          return (
            <li key={step.label} className="flex-1">
              {/* Current is 2px and cyan; done is cyan at rest; ahead is --line. */}
              <span
                aria-hidden="true"
                className={`block rounded-btn ${isCurrent ? "h-0.5 bg-verified" : "h-px"} ${
                  isDone ? "bg-verified/45" : isCurrent ? "" : "bg-line"
                }`}
              />
              <span
                className={`mt-2 hidden font-mono text-2xs uppercase tracking-[0.16em] lg:block ${
                  isCurrent ? "text-verified" : "text-ink-mute"
                }`}
              >
                {step.label}
              </span>
              {isCurrent && <span className="sr-only">{strings.phases.current}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
