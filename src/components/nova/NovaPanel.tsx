import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import mission from "../../content/mission";
import strings from "../../content/strings.json";
import ConfidenceBar from "./ConfidenceBar";
import { useCountUp } from "../../lib/motion";
import type { NovaTurn } from "../../state/gameMachine";

/**
 * NOVA - CLAUDE.md section 7 step 7, PROTOTYPE_SPEC section 4.
 *
 * The heart of the AI-literacy argument. She is fluent, she is confident, she
 * cites nothing, and if the player pushes she admits it. Ask for source drops
 * her confidence 62 -> 34. Cross-check finds the 2023 notice and takes her to
 * 88 while she says outright that she was wrong. Useful and wrong in the same
 * conversation - that is the lesson, and it only lands if both halves happen
 * on screen.
 *
 * Everything she says comes from the loaded mission file. Nothing is generated,
 * and the order of her beats is content too: `requires` on a reply says which
 * question has to have been asked before it. Cross-check requires ask-source,
 * because her cross-check line admits she was wrong about a question the player
 * would not yet have put to her - press them the other way round and the
 * transcript ends with her resolving the doubt first and failing to answer it
 * afterwards, at lower confidence. The arc is the lesson; out of order there
 * isn't one.
 */
const nova = mission.nova as {
  opening: string;
  confidence: number;
  footer: string;
  replies: {
    id: string;
    label: string;
    response?: string;
    confidence?: number;
    grantsEvidence?: string;
    route?: string;
    requires?: string;
  }[];
};

const GATE_REASON_ID = "nova-gate-reason";

const SPEAKING_MS = 1600;

export default function NovaPanel({
  turns,
  confidence,
  used,
  evidenceFound,
  evidenceTotal,
  onReply,
  onTrust,
  onInvestigate,
  onClose,
}: {
  turns: NovaTurn[];
  confidence: number;
  used: string[];
  evidenceFound: string[];
  evidenceTotal: number;
  onReply: (id: string) => void;
  onTrust: () => void;
  onInvestigate: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [speaking, setSpeaking] = useState(true);

  const evidenceShown = useCountUp(evidenceFound.length);

  // She is "speaking" for a beat after each line. Drives the edge glow and the
  // ring reaction, then stops - never a loop that runs while idle.
  useEffect(() => {
    const id = window.setTimeout(() => setSpeaking(false), SPEAKING_MS);
    return () => window.clearTimeout(id);
  }, [turns]);

  /*
   * Focus trap. The panel is aria-modal, so everything behind it is already
   * hidden from assistive tech; the trap is what stops a keyboard user tabbing
   * into a feed they cannot see. Escape returns to the feed.
   */
  useEffect(() => {
    const node = panelRef.current;
    node?.querySelector<HTMLElement>("button")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !node) return;
      const focusable = [
        ...node.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"),
      ];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /** A reply whose prerequisite question has not been asked yet. */
  const isLocked = (reply: (typeof nova.replies)[number]) =>
    Boolean(reply.requires) && !used.includes(reply.requires as string);
  const anyLocked = nova.replies.some((reply) => isLocked(reply));

  function handleReply(reply: (typeof nova.replies)[number]) {
    // aria-disabled keeps the button focusable so its reason can be read, which
    // means the click has to be refused here rather than by the browser.
    if (isLocked(reply)) return;
    if (reply.route === "decide") {
      onTrust();
      return;
    }
    if (reply.route === "investigate") {
      onInvestigate();
      return;
    }
    // The reducer resolves the reply, appends the turns and grants any
    // evidence. The panel only says which button was pressed.
    onReply(reply.id);
    setSpeaking(true);
  }

  const latest = turns[turns.length - 1];

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="nova-title"
      className={`nova-panel nova-in fixed right-0 top-0 z-40 flex h-full w-full max-w-[420px] flex-col rounded-nova bg-void/95 backdrop-blur ${
        speaking ? "nova-panel-speaking" : ""
      }`}
    >
      <header className="flex items-center gap-3 border-b border-line p-4">
        {/*
          Generated concentric geometry. Never a face, and the alt text says so
          outright so a screen-reader user is not left picturing a person.
        */}
        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-nova/50">
          <img
            src={strings.art.novaCore}
            width={strings.art.novaCoreWidth}
            height={strings.art.novaCoreHeight}
            alt={strings.nova.avatarAlt}
            className={`h-full w-full object-cover ${speaking ? "nova-breathe" : ""}`}
          />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id="nova-title"
            className="font-display text-base font-bold uppercase tracking-[0.08em] text-nova-ink"
          >
            {strings.rail.nova}
          </h2>
          <p className="font-mono text-2xs uppercase tracking-[0.16em] text-ink-mute">
            {strings.nova.evidence}{" "}
            <span className="tabular-nums text-verified">
              {evidenceShown}/{evidenceTotal}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-btn border border-line p-2 text-ink transition-colors duration-[120ms] ease-real hover:border-ink-faint"
        >
          <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="sr-only">{strings.nova.close}</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <ol className="flex flex-col gap-4">
          {turns.map((turn, i) => (
            <li key={i}>
              {turn.who === "nova" && (
                <>
                  <p className="label-mono">{strings.rail.nova}</p>
                  <p className="mt-2 text-sm text-ink">{turn.text}</p>
                </>
              )}
              {turn.who === "you" && (
                <>
                  <p className="label-mono">{strings.nova.you}</p>
                  <p className="mt-2 text-sm text-ink-mute">{turn.text}</p>
                </>
              )}
              {turn.who === "system" && (
                <p className="font-mono text-2xs uppercase tracking-[0.16em] text-verified">
                  {strings.nova.evidenceAdded}
                </p>
              )}
            </li>
          ))}
        </ol>

        <ConfidenceBar value={confidence} />
      </div>

      <div className="flex flex-wrap gap-2 border-t border-line p-4">
        {nova.replies.map((reply) => {
          const spent = used.includes(reply.id);
          const locked = isLocked(reply);
          const tone =
            reply.route === "decide"
              ? "border-nova/60 text-nova-ink hover:bg-nova/10"
              : reply.route === "investigate"
                ? "border-verified/60 text-verified hover:bg-verified/10"
                : "border-line text-ink hover:border-ink-faint";
          return (
            <button
              key={reply.id}
              type="button"
              disabled={spent}
              /*
                Locked is aria-disabled, not disabled. A `disabled` button is
                removed from the tab order, so a screen-reader user would meet
                a reply that has silently vanished and never hear why it is not
                available - which is exactly the dishonesty the locked evidence
                slots and the locked rail rooms were designed to avoid. This
                stays focusable, announces itself as unavailable, and carries
                the reason through aria-describedby.
              */
              aria-disabled={locked || undefined}
              aria-describedby={locked ? GATE_REASON_ID : undefined}
              onClick={() => handleReply(reply)}
              /*
                60, not 40. A spent reply still carries meaning - it is how the
                player sees which questions they already asked - so it stays
                above the 4.5:1 floor (6.3:1) rather than leaning on WCAG's
                exemption for inactive controls. A locked one is held to the
                same floor for the same reason: it has to be readable to be
                honest.
              */
              className={`rounded-btn border px-4 py-2 font-mono text-2xs uppercase tracking-[0.04em] transition-colors duration-[120ms] ease-real disabled:opacity-60 ${
                locked ? "cursor-not-allowed border-dashed opacity-60 hover:border-line" : tone
              }`}
            >
              {reply.label}
              {locked && <span className="normal-case"> · {strings.nova.gatedShort}</span>}
            </button>
          );
        })}

        {/*
          The reason is on screen, not only in the accessibility tree. A dimmed
          control with no stated reason reads as a bug; a stated one reads as a
          rule, and this rule is itself the teaching point - she cannot correct
          herself about a question nobody has asked her.
        */}
        {anyLocked && (
          <p
            id={GATE_REASON_ID}
            className="w-full font-mono text-2xs leading-[16px] text-ink-mute"
          >
            {strings.nova.gated}
          </p>
        )}
      </div>

      {/*
        Permanent, pinned outside the scroll area. PROTOTYPE_SPEC calls this the
        single most quotable line in the demo - it must never scroll away.
      */}
      <p className="border-t border-line p-4 font-mono text-2xs leading-[16px] text-ink-mute">
        {nova.footer}
      </p>

      <p className="sr-only" aria-live="polite">
        {latest.who === "nova" ? `${strings.rail.nova}: ${latest.text}. ` : ""}
        {strings.nova.confidence} {confidence}%. {strings.nova.evidence}{" "}
        {evidenceFound.length}/{evidenceTotal}.
      </p>
    </div>
  );
}
