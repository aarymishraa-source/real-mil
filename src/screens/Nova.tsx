import AppShell from "../components/shell/AppShell";
import Panel from "../components/shell/Panel";
import FeedColumn from "../components/feed/FeedColumn";
import NovaPanel from "../components/nova/NovaPanel";
import { TrustReachMeter, CompactHud } from "../components/hud/TrustReachMeter";
import strings from "../content/strings.json";
import type { GameState } from "../state/gameMachine";

/**
 * NOVA phase - a slide-over on top of the feed, not a separate room.
 *
 * The feed stays visible behind so the player can see what she is talking
 * about. It is non-interactive: FeedColumn's interactive={false} removes the
 * stretched buttons outright rather than leaving focusable elements behind an
 * aria-modal dialog.
 */
export default function Nova({
  state,
  onReply,
  onTrust,
  onInvestigate,
  onClose,
  onNavigate,
}: {
  state: GameState;
  onReply: (id: string) => void;
  onTrust: () => void;
  onInvestigate: () => void;
  onClose: () => void;
  onNavigate: (phase: GameState["phase"]) => void;
}) {
  return (
    <AppShell phase={state.phase} onNavigate={onNavigate}>
      <CompactHud state={state} />

      <main className="mx-auto grid min-h-full max-w-[1100px] grid-cols-1 gap-6 p-3 lg:grid-cols-[minmax(0,620px)_320px] lg:justify-center lg:p-6">
        <Panel
          number={strings.panels.feed.number}
          title={strings.panels.feed.title}
          subtitle={strings.panels.feed.subtitle}
          headingId="panel-feed"
        >
          <FeedColumn
            interactive={false}
            openPostId={null}
            onTogglePost={() => {}}
            onAction={() => {}}
            waited={state.waited}
          />
        </Panel>

        <TrustReachMeter state={state} />
      </main>

      {/* Scrim. The room recedes; it does not disappear. */}
      <div aria-hidden="true" className="fixed inset-0 z-30 bg-void/70" />

      <NovaPanel
        turns={state.novaTurns}
        confidence={state.novaConfidence}
        used={state.novaUsed}
        evidenceFound={state.evidenceFound}
        evidenceTotal={state.evidenceTotal}
        onReply={onReply}
        onTrust={onTrust}
        onInvestigate={onInvestigate}
        onClose={onClose}
      />
    </AppShell>
  );
}
