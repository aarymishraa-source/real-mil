import { Lock, Search } from "lucide-react";
import strings from "../../content/strings.json";

/**
 * One evidence slot - PROTOTYPE_SPEC section 3.
 *
 * A document, not a post. Near-square, radius 2px, mono throughout. That
 * typographic switch IS the lesson: the Feed is proportional and warm, and the
 * moment you investigate, the type turns forensic (CLAUDE.md section 3).
 *
 * The reveal is opacity + 8px translate, not a 3D flip. PROTOTYPE_SPEC says
 * "flips", but CLAUDE.md caps the whole build at three animations - the Lens,
 * the Cascade and counter ticks - and rules everything else down to "opacity +
 * 8px translate, or nothing". The constitution wins over the screen sketch.
 */
export interface EvidenceItem {
  id: string;
  state: string;
  label: string;
  found?: string;
  signal?: string;
  skill?: string;
}

/** The signal is what the evidence turned out to mean, so it carries colour. */
const SIGNAL_TONE: Record<string, string> = {
  verified: "text-verified",
  unverified: "text-unverified",
  pending: "text-pending",
};

const SIGNAL_LABEL: Record<string, string> = {
  verified: strings.signals.verified,
  unverified: strings.signals.unverified,
  pending: strings.signals.pending,
};

export default function EvidenceCard({
  item,
  index,
  rotation,
  offset,
  found,
  onFind,
  cardRef,
}: {
  item: EvidenceItem;
  index: number;
  rotation: number;
  /** Vertical nudge off the grid baseline, in px. */
  offset: number;
  found: boolean;
  onFind: (id: string) => void;
  cardRef?: (el: HTMLElement | null) => void;
}) {
  const slot = String(index + 1).padStart(2, "0");

  /*
   * Locked slots render as unpinned outlines - dashed, unrotated, not
   * interactive, label visible. Honest about being unbuilt rather than a card
   * that looks alive and does nothing. PROTOTYPE_SPEC makes the same argument
   * about the locked rail icons.
   */
  /*
   * Locked slots recede STRUCTURALLY, not by fading the words. No fill, a
   * dashed hairline, and two thirds the height of a findable card - so the eye
   * skips them without the label becoming unreadable. Their text is --ink at
   * 60% rather than --ink-mute at 60%, which measures 6.3:1 instead of 3:1: an
   * honest locked state is only honest if it can still be read.
   */
  if (item.state !== "findable") {
    return (
      <li
        style={{ transform: `translateY(${offset}px)` }}
        className="hatched flex min-h-[104px] flex-col justify-between rounded-doc border border-line p-3 opacity-70"
        aria-label={`${strings.investigate.slot} ${slot}. ${item.label}. ${strings.investigate.locked}.`}
      >
        <span className="font-mono text-2xs tracking-[0.16em] text-ink">{slot}</span>
        <span className="font-mono text-2xs leading-[16px] text-ink">{item.label}</span>
        <span className="flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.16em] text-ink">
          <Lock className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden="true" />
          {strings.investigate.locked}
        </span>
      </li>
    );
  }

  const tone = item.signal ? SIGNAL_TONE[item.signal] : "text-ink-mute";

  return (
    <li ref={cardRef} style={{ transform: `rotate(${rotation}deg) translateY(${offset}px)` }}>
      <button
        type="button"
        onClick={() => onFind(item.id)}
        aria-pressed={found}
        className="flex min-h-[152px] w-full flex-col gap-2 rounded-doc border border-line bg-raised p-3 text-left transition-colors duration-[120ms] ease-real hover:border-ink-faint"
      >
        <span className="font-mono text-2xs tracking-[0.16em] text-ink-mute">{slot}</span>

        <span className="font-mono text-2xs leading-[16px] text-ink">{item.label}</span>

        {found && (
          <span className="reveal flex flex-col gap-2">
            <span className="font-mono text-2xs leading-[16px] text-ink-mute">{item.found}</span>
            {item.signal && (
              <span
                className={`font-mono text-2xs uppercase tracking-[0.16em] ${tone}`}
              >
                {SIGNAL_LABEL[item.signal]}
              </span>
            )}
            {/*
              --ink-mute. PROTOTYPE_SPEC section 3 calls the skill line "what
              makes this educational rather than a puzzle" - half of it was
              sitting at 2.54:1.
            */}
            {item.skill && (
              <span className="border-t border-line pt-2 font-mono text-2xs uppercase tracking-[0.16em] text-ink-mute">
                {strings.investigate.skill}: <span className={tone}>{item.skill}</span>
              </span>
            )}
          </span>
        )}

        {/*
          The affordance that was missing. An unexamined card used to be a title
          over dead space, which read as unfinished next to a locked slot that
          at least had a lock on it. This fills that space with the invitation.
          Neutral --ink, never --verified: cyan would promise the player the
          evidence confirms the claim before they have looked at it.
        */}
        {!found && (
          <span className="mt-auto flex items-center justify-center gap-2 rounded-doc border border-ink-mute bg-surface px-3 py-2 font-mono text-2xs uppercase tracking-[0.16em] text-ink">
            <Search className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
            {strings.investigate.reveal}
          </span>
        )}
      </button>
    </li>
  );
}
