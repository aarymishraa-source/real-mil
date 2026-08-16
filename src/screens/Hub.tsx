import { useState } from "react";
import strings from "../content/strings.json";
import AppShell from "../components/shell/AppShell";
import Panel from "../components/shell/Panel";
import CityBoard from "../components/hub/CityBoard";
import { readProgress } from "../state/progress";
import type { GameState } from "../state/gameMachine";

/**
 * SIGNAL CITY - the hub screen.
 *
 * The board itself moved to components/hub/CityBoard when the overview page
 * needed to show the real one rather than a picture of it. What is left here is
 * the room: panel chrome, the line that introduces the city, and the board.
 * Both surfaces render the same component, so a location added to the content
 * appears in both without anybody remembering to update a second copy - the
 * same rule the room list learned the hard way (DECISIONS).
 */
export default function Hub({
  state,
  here,
  onEnter,
  onNavigate,
}: {
  state: GameState;
  /** The location the player is currently inside, if they have entered one. */
  here: string | null;
  onEnter: (key: string) => void;
  onNavigate: (phase: GameState["phase"]) => void;
}) {
  const [progress] = useState(readProgress);

  return (
    <AppShell phase={state.phase} onNavigate={onNavigate} heading={strings.panels.hub.title}>
      <main className="mx-auto min-h-full max-w-[1400px] p-3 lg:p-6">
        <Panel
          number={strings.panels.hub.number}
          title={strings.panels.hub.title}
          subtitle={strings.panels.hub.subtitle}
          headingId="panel-hub"
          active
        >
          <p className="max-w-[62ch] text-sm text-ink-mute">{strings.hub.intro}</p>
          <div className="mt-6">
            <CityBoard progress={progress} here={here} onEnter={onEnter} />
          </div>
        </Panel>
      </main>
    </AppShell>
  );
}
