import { useEffect, useRef } from "react";
import strings from "../../content/strings.json";

/**
 * The action bar - CLAUDE.md section 7 step 5. The first interactive mechanic.
 *
 * Four choices, each in its own semantic colour so the consequence is readable
 * before it is taken: red spreads it, cyan verifies it, violet asks the AI,
 * amber waits. Outline and label only - no fill, no glow. Glow is a state, and
 * a button at rest is not in one (ART_DIRECTION section 3).
 *
 * Focus moves to the first button on open. That is what announces the bar to a
 * screen reader: the group label is read as focus enters it, which is more
 * reliable than a live region injected at the same moment as its own content.
 */
export type ActionId = "share" | "investigate" | "nova" | "wait";

const BUTTONS: { id: ActionId; label: string; tone: string }[] = [
  {
    id: "share",
    label: strings.actions.share,
    tone: "border-unverified/60 text-unverified hover:bg-unverified/10",
  },
  {
    id: "investigate",
    label: strings.actions.investigate,
    tone: "border-verified/60 text-verified hover:bg-verified/10",
  },
  {
    id: "nova",
    label: strings.actions.askNova,
    // Border --nova, label --nova-ink. CLAUDE.md section 3: the structural
    // violet cannot carry 11px text on this surface, the tint can.
    tone: "border-nova/60 text-nova-ink hover:bg-nova/10",
  },
  {
    id: "wait",
    label: strings.actions.wait,
    tone: "border-pending/60 text-pending hover:bg-pending/10",
  },
];

export default function ActionBar({
  id,
  onAction,
}: {
  id: string;
  onAction: (action: ActionId) => void;
}) {
  const firstButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstButton.current?.focus();
  }, []);

  return (
    <div
      id={id}
      role="group"
      aria-label={strings.feed.actionsLabel}
      className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3"
    >
      {BUTTONS.map((button, i) => (
        <button
          key={button.id}
          ref={i === 0 ? firstButton : undefined}
          type="button"
          onClick={() => onAction(button.id)}
          className={`rounded-btn border px-4 py-2 font-mono text-2xs uppercase tracking-[0.04em] transition-colors duration-[120ms] ease-real ${button.tone}`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
