import strings from "../../content/strings.json";
import FeedPost, { Avatar, type FeedPostData } from "../feed/FeedPost";
import { useCountUp } from "../../lib/motion";

/**
 * One branch of the outcome - PROTOTYPE_SPEC section 6.
 *
 * Rendered twice: once for what the player did, once beside it for what they
 * didn't. A judge sees the counterfactual without replaying, and a player sees
 * the cost of the road not taken without being told off for it.
 *
 * TONE (CLAUDE.md section 4): this never shames. There is no cross, no "wrong",
 * no failure state. It reports what happened and lets the students say what it
 * did to them. That restraint is what makes correcting yourself feel possible.
 *
 * The untaken branch recedes STRUCTURALLY, not by fading it out. At the 25%
 * opacity the spec sketched it measured 2.06:1 - unreadable, and a
 * counterfactual nobody can read teaches nothing. Instead it drops to
 * --ink-mute, gives up the semantic colours (its numbers never happened, so
 * they have no business being cyan and red), takes a smaller figure size and
 * sits behind a hairline. Clearly secondary, still legible.
 */
export interface OutcomeData {
  trust: number;
  reach: number;
  headline: string;
  comments: { handle: string; body: string }[];
}

function Figure({
  label,
  value,
  from,
  tone,
  size,
  animate,
}: {
  label: string;
  value: number;
  from: number;
  tone: string;
  size: string;
  animate: boolean;
}) {
  // Hook runs either way (rules of hooks); `animate` decides what is rendered.
  // The counterfactual shows its figure at rest - two columns of digits racing
  // at once reads as a scoreboard, not a consequence.
  const shown = useCountUp(value);
  return (
    <div>
      <p className="label-mono">{label}</p>
      <p className={`font-display ${size} font-bold tabular-nums ${tone}`}>
        {animate ? shown : value}%
      </p>
      {/*
        --ink-mute, not --ink-faint. The movement is the point of this screen -
        "82% → 21%" is what the player came here to see, so it is content, not
        a placeholder. At --ink-faint it measured 2.64:1 on both branches.
      */}
      <p className="font-mono text-2xs tabular-nums text-ink-mute">
        {from}% → {value}%
      </p>
    </div>
  );
}

export default function ConsequencePanel({
  outcome,
  from,
  post,
  secondary = false,
  animate = true,
}: {
  outcome: OutcomeData;
  from: { trust: number; reach: number };
  /** The player's own post for this path. Absent on the counterfactual. */
  post?: FeedPostData | null;
  /** The branch not taken. Recedes by weight and colour, never by opacity. */
  secondary?: boolean;
  animate?: boolean;
}) {
  return (
    <div className={secondary ? "border-l border-line pl-6" : undefined}>
      {/*
        Display type, not body type. This sentence is what the player leaves
        with - "the rumour reached more people than the correction ever will" -
        and it spent the whole build at 18px because the feed's restraint was
        applied to a screen that is not the feed. The counterfactual stays at
        body size: it did not happen, and it should not shout as loud as what
        did.
      */}
      {secondary ? (
        <p className="text-base leading-[26px] text-ink-mute">{outcome.headline}</p>
      ) : (
        <p className="max-w-[20ch] font-display text-xl font-bold leading-[1.1] tracking-[-0.02em] text-ink">
          {outcome.headline}
        </p>
      )}

      <div className="mt-6 flex gap-8">
        <Figure
          label={strings.hud.trust}
          value={outcome.trust}
          from={from.trust}
          tone={secondary ? "text-ink-mute" : "text-verified"}
          size={secondary ? "text-lg" : "text-xl"}
          animate={animate}
        />
        <Figure
          label={strings.hud.reach}
          value={outcome.reach}
          from={from.reach}
          tone={secondary ? "text-ink-mute" : "text-unverified"}
          size={secondary ? "text-lg" : "text-xl"}
          animate={animate}
        />
      </div>

      {/*
        THE TAKEN BRANCH IS A THREAD, NOT A REPORT.

        The player's own post, rendered by the same FeedPost every account in
        this game uses, with the replies indented under it carrying the same
        initials avatars. Before this the screen put "What people said" over a
        list of handles - people reacting to an event that was never on screen,
        which is exactly why the ending read as a dashboard. The thing they are
        replying to is now right there with the player's handle on it.

        The counterfactual keeps the plain list. It recedes structurally, and
        rendering a full second post for a run that did not happen would double
        the height of the screen to show something the player never did.
      */}
      {!secondary && post ? (
        <div className="mt-6 border-t border-line pt-4">
          <p className="label-mono">{strings.outcome.yourPost}</p>
          <div className="mt-3 max-w-[620px]">
            <FeedPost post={post} />
          </div>

          <p className="label-mono mt-6">{strings.outcome.replies}</p>
          <ul className="mt-3 flex max-w-[620px] flex-col gap-4 border-l border-line pl-4">
            {outcome.comments.map((comment) => (
              <li key={comment.handle} className="flex gap-3">
                <Avatar handle={comment.handle} />
                <div className="min-w-0 flex-1">
                  <span className="text-xs text-ink-mute">{comment.handle}</span>
                  <p className="text-sm text-ink">{comment.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-6 border-t border-line pt-4">
          <p className="label-mono">{strings.outcome.comments}</p>
          <ul className="mt-3 flex flex-col gap-3">
            {outcome.comments.map((comment) => (
              <li key={comment.handle} className="border-l border-line pl-3">
                <span className="text-xs text-ink-mute">{comment.handle}</span>
                <p className={`text-sm ${secondary ? "text-ink-mute" : "text-ink"}`}>
                  {comment.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
