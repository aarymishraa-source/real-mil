/**
 * RE:AL core loop state machine.
 * SEE -> QUESTION -> INVESTIGATE -> DECIDE -> EXPERIENCE -> REFLECT
 *
 * No backend. No persistence beyond sessionStorage.
 * Every number that changes on screen changes here first.
 */

import mission, { launchedFromHub } from "../content/mission";

const novaContent = mission.nova as {
  opening: string;
  confidence: number;
  replies: {
    id: string;
    label: string;
    response?: string;
    confidence?: number;
    grantsEvidence?: string;
    route?: string;
    /** Id of a reply that must have been used before this one is available. */
    requires?: string;
  }[];
};

/**
 * One line of the NOVA conversation. "system" carries no text of its own - the
 * panel renders the label - so the reducer stays free of UI copy.
 */
export interface NovaTurn {
  who: "nova" | "you" | "system";
  text: string;
}

export type Phase =
  | "boot"
  /*
   * The three rooms that are not steps of the core loop. They sit outside
   * SEE -> QUESTION -> ... -> REFLECT deliberately: the hub is where a run
   * starts, and the profile and teacher view are read-only rooms you can open
   * at any point without losing your place in a mission.
   */
  | "hub"
  | "profile"
  | "teacher"
  | "feed"
  | "investigate"
  | "nova"
  | "decide"
  | "outcome"
  | "reflect";

export type Path = "careless" | "careful" | "correction" | null;

export interface GameState {
  phase: Phase;
  trust: number;
  reach: number;
  evidenceFound: string[];
  evidenceTotal: number;
  waited: boolean;
  /**
   * The player reached DECIDE saying "I still don't know". Recorded because
   * admitting uncertainty is a first-class outcome in this game, not a failure
   * to find everything - the Reflect screen needs to be able to say so.
   */
  uncertain: boolean;
  /**
   * The player handed the decision to NOVA rather than checking. Recorded, not
   * punished at this stage - the cost lands in the outcome copy, which never
   * shames (CLAUDE.md section 4).
   */
  trustedAi: boolean;
  /*
   * The NOVA conversation lives here, not in the panel.
   *
   * It used to be component state, which meant closing the panel destroyed it:
   * a player who pushed her until she admitted she could not verify anything
   * reopened to find her confidently asserting the claim again at 62%. That
   * erased the whole point of the character. Her memory belongs with the
   * evidence she grants, which was already in the reducer.
   */
  novaTurns: NovaTurn[];
  novaConfidence: number;
  novaUsed: string[];
  path: Path;
  badge: string | null;
}

/**
 * The mission supplies its own numbers; the reducer does not invent them.
 * These were duplicated as literals here and in mission01.json, which is two
 * places to change and one place to forget.
 */
const start = mission.startState as {
  trust: number;
  reach: number;
  evidenceTotal: number;
};
const waitEvent = mission.waitEvent as { reachDelta: number };

/*
 * The outcome figures and the badges were the last literals left in here, and
 * a second mission is what exposed them: they were mission 01's numbers hard
 * coded into the engine, so mission 02 would have ended on mission 01's Trust
 * and handed out mission 01's badge. They live where the rest of the mission
 * lives now. Mission 01's values are unchanged - the JSON already carried
 * exactly the same numbers, which is how the duplication survived this long.
 */
const outcomeNumbers = mission.outcomes as Record<string, { trust: number; reach: number }>;
const badges = (mission.reflection as { badges: Record<string, string | null> }).badges;

export const initialState: GameState = {
  // Boot, unless the hub launched this mission - see content/mission.ts.
  phase: launchedFromHub ? "feed" : "boot",
  trust: start.trust,
  reach: start.reach,
  evidenceFound: [],
  evidenceTotal: start.evidenceTotal,
  waited: false,
  uncertain: false,
  trustedAi: false,
  novaTurns: [{ who: "nova", text: novaContent.opening }],
  novaConfidence: novaContent.confidence,
  novaUsed: [],
  path: null,
  badge: null,
};

export type Action =
  | { type: "GOTO"; phase: Phase }
  | { type: "FIND_EVIDENCE"; id: string }
  | { type: "WAIT" }
  | { type: "NOVA_REPLY"; id: string }
  | { type: "GOTO_DECIDE"; uncertain: boolean }
  | { type: "TRUST_NOVA" }
  | { type: "DECIDE"; path: Exclude<Path, null> }
  | { type: "RESET_KEEP_BADGE" };

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "GOTO":
      return { ...state, phase: action.phase };

    case "FIND_EVIDENCE":
      if (state.evidenceFound.includes(action.id)) return state;
      return { ...state, evidenceFound: [...state.evidenceFound, action.id] };

    /*
     * Not deciding is also a decision: pressure grows while you wait.
     *
     * Once. `waited` was set here from the first version and then never read by
     * the reducer, so the action was idempotent in appearance only - pressing
     * Wait ten times added the delta ten times and took Reach to 100% before
     * the player had decided anything. Sharing then set Reach to its outcome
     * figure and the number went DOWN as the post spread, in front of the
     * Cascade, which inverts the one meter the consequence argument rests on.
     *
     * Time passing is a single event in this mission, not a resource to farm.
     */
    case "WAIT":
      if (state.waited) return state;
      return { ...state, waited: true, reach: clamp(state.reach + waitEvent.reachDelta) };

    /*
     * One reply, resolved from the content rather than assembled by the panel.
     * Cross-check grants its evidence here too, so the evidence and the
     * sentence that earned it are applied in the same transition and can never
     * disagree.
     *
     * `requires` is what keeps her arc in order. Her three beats only teach
     * anything in sequence - confident, then caught unable to name a source,
     * then correcting herself - and the four buttons were pressable in any
     * order, so cross-check first produced a transcript where she admitted she
     * was wrong about a question the player had not asked, and then failed to
     * answer it afterwards at lower confidence. The arc ran backwards.
     *
     * The guard lives here and not only in the panel because a disabled button
     * is a presentation detail: the reducer is what makes the order true.
     */
    case "NOVA_REPLY": {
      const reply = novaContent.replies.find((r) => r.id === action.id);
      if (!reply || state.novaUsed.includes(action.id)) return state;
      if (reply.requires && !state.novaUsed.includes(reply.requires)) return state;

      const turns: NovaTurn[] = [{ who: "you", text: reply.label }];
      if (reply.response) turns.push({ who: "nova", text: reply.response });

      let evidenceFound = state.evidenceFound;
      if (reply.grantsEvidence && !evidenceFound.includes(reply.grantsEvidence)) {
        evidenceFound = [...evidenceFound, reply.grantsEvidence];
        turns.push({ who: "system", text: "" });
      }

      return {
        ...state,
        evidenceFound,
        novaTurns: [...state.novaTurns, ...turns],
        novaConfidence: reply.confidence ?? state.novaConfidence,
        novaUsed: [...state.novaUsed, action.id],
      };
    }

    /*
     * Both routes out of INVESTIGATE land here. "I still don't know" is not a
     * lesser exit than "I have enough to decide" - it carries a flag, not a
     * penalty, and nothing in the reducer punishes it.
     */
    case "GOTO_DECIDE":
      return { ...state, phase: "decide", uncertain: action.uncertain };

    // Skipping ahead on NOVA's word. Flagged, not penalised here.
    case "TRUST_NOVA":
      return { ...state, phase: "decide", trustedAi: true };

    case "DECIDE": {
      const o = {
        ...outcomeNumbers[action.path],
        badge: badges[action.path] ?? null,
      };
      return {
        ...state,
        phase: "outcome",
        path: action.path,
        trust: o.trust,
        reach: o.reach,
        /*
         * `?? state.badge` - a badge already earned is never taken back.
         * Without this, RESET_KEEP_BADGE carries a badge across the replay and
         * then the very next DECIDE overwrites it with null, which defeats the
         * only reason that action exists. You can lose a run; you cannot
         * un-earn something you already did.
         */
        badge: o.badge ?? state.badge,
      };
    }

    // "Play the other path" - reset the run, keep what was earned.
    case "RESET_KEEP_BADGE":
      return { ...initialState, phase: "feed", badge: state.badge };

    default:
      return state;
  }
}
