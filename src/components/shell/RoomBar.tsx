import strings from "../../content/strings.json";
import { LIVE_ROOMS } from "./rooms";
import type { Phase } from "../../state/gameMachine";

/**
 * The rooms, on a phone.
 *
 * The 72px rail is `hidden lg:block` and that was the right call - at 390px it
 * would eat a fifth of the width to show icons. What was wrong was having no
 * replacement: the rail was the only route to the hub, then to Your record and
 * the teacher view, so on a phone a player could walk into a mission and never
 * leave it, and two of the five live rooms did not exist at all.
 *
 * This is the fix at the level of the rule rather than the destination. It
 * renders from the same LIVE_ROOMS list the rail does, so a room added later
 * gets a mobile route without anyone remembering to add one.
 *
 * Only the live rooms appear. The bar is navigation, not a catalogue - four
 * more locked icons would halve the size of the real ones on a 390px screen,
 * and the locked rooms are already named honestly where a player meets them:
 * on the rail at desktop width, and on the city map as three hatched worlds.
 *
 * Labels, not icons alone. The rail can lean on tooltips because it has hover;
 * a phone has none, and an unlabelled row of five glyphs is a guessing game.
 */
export default function RoomBar({
  phase,
  onNavigate,
}: {
  phase: Phase;
  onNavigate?: (phase: Phase) => void;
}) {
  return (
    <nav
      aria-label={strings.rail.label}
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-void/95 backdrop-blur lg:hidden"
    >
      <ul className="flex items-stretch">
        {LIVE_ROOMS.map((room) => {
          const Icon = room.icon;
          const current = room.phase === phase;
          return (
            <li key={room.id} className="flex-1">
              <button
                type="button"
                onClick={() => room.phase && onNavigate?.(room.phase)}
                aria-current={current ? "page" : undefined}
                /*
                  56px of height, which is the smallest this can be and still
                  clear the 44px touch target the accessibility floor implies.
                  Cyan marks the room you are in - position, in the chrome,
                  which is meaning two of the two cyan carries.
                */
                className={`flex h-14 w-full flex-col items-center justify-center gap-1 border-t-2 transition-colors duration-[120ms] ease-real ${
                  current ? "border-verified text-verified" : "border-transparent text-ink-mute"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                <span className="max-w-full truncate px-1 font-mono text-[9px] uppercase leading-none tracking-[0.04em]">
                  {room.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
