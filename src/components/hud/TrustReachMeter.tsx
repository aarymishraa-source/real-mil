import strings from "../../content/strings.json";
import { useCountUp } from "../../lib/motion";
import type { GameState } from "../../state/gameMachine";

/**
 * Trust / Reach / Evidence - CLAUDE.md section 7 step 2, shared by every phase
 * that has a HUD.
 *
 * All three values count rather than snap. The live region carries the SETTLED
 * numbers, not the animating ones: announcing every frame of a 600ms count
 * would be unusable. The visible figures are aria-hidden so nothing is read
 * twice, and tabular-nums stops the digits jittering as they climb.
 */
function useHud(state: GameState) {
  const trust = useCountUp(state.trust);
  const reach = useCountUp(state.reach);
  const evidence = useCountUp(state.evidenceFound.length);
  const announcement = `${strings.hud.trust} ${state.trust}%. ${strings.hud.reach} ${state.reach}%. ${strings.hud.evidence} ${state.evidenceFound.length}/${state.evidenceTotal}.`;
  return { trust, reach, evidence, announcement };
}

/** Desktop sidebar, 320px column. */
export function TrustReachMeter({ state }: { state: GameState }) {
  const { trust, reach, evidence, announcement } = useHud(state);
  return (
    /*
      Sticky, so the HUD rides the scroll instead of orphaning.
      A 184px card at the top of an 1835px column left 1627px of dead rail
      beside the feed - the same stranding fixed on Investigate and Outcome and
      never fixed here. Trust and Reach are meant to be watchable while the
      player reads, so following the viewport is also the behaviour they should
      have had from the start.
    */
    <aside className="hairline hidden h-fit self-start rounded-post bg-surface p-6 lg:sticky lg:top-6 lg:block">
      <div aria-hidden="true">
        <p className="label-mono">{strings.hud.trust}</p>
        <p className="font-mono text-lg tabular-nums text-verified">{trust}%</p>
        <p className="label-mono mt-4">{strings.hud.reach}</p>
        <p className="font-mono text-lg tabular-nums text-unverified">{reach}%</p>
        <p className="label-mono mt-4">
          {strings.hud.evidence}{" "}
          <span className="tabular-nums">
            {evidence}/{state.evidenceTotal}
          </span>
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </aside>
  );
}

/**
 * Below lg the sidebar would land under all nine posts, so Trust and Reach
 * would only be readable after a 2000px scroll. One sticky mono line instead.
 * Exactly one of the two is display:none at any width, so only one aria-live
 * region is ever in the accessibility tree.
 */
export function CompactHud({ state }: { state: GameState }) {
  const { trust, reach, evidence, announcement } = useHud(state);
  return (
    <div className="sticky top-0 z-20 border-b border-line bg-void/95 px-3 py-2 font-mono text-2xs tabular-nums text-ink-mute backdrop-blur lg:hidden">
      <span aria-hidden="true">
        {strings.hud.trust} <span className="text-verified">{trust}</span>
        {" · "}
        {strings.hud.reach} <span className="text-unverified">{reach}</span>
        {" · "}
        {strings.hud.evidenceShort} {evidence}/{state.evidenceTotal}
      </span>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
