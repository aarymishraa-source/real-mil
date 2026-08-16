import mission from "./mission";
import type { FeedPostData } from "../components/feed/FeedPost";

/**
 * What the player put out, as an actual post.
 *
 * The outcome screen used to report the player's choice - "Your choice: Post a
 * correction" - and then show what other people said about it. Nothing on
 * screen was ever theirs. That is the whole reason the ending read like a
 * dashboard: a dashboard reports on you, and the thing that had happened was
 * only ever described.
 *
 * So each outcome carries a `post` in the mission file, written in the voice
 * the player would have used and specific to what that path established. The
 * careless one quotes the target, because sharing carries the artefact with it
 * - which is also what lets the Cascade spread the player's repost rather than
 * a stranger's, with their handle on all six copies.
 *
 * Built here rather than in a component so the outcome panel and the Cascade
 * are looking at exactly the same object. Two places assembling "the player's
 * post" from the same content is two places to disagree.
 */
const player = mission.player as {
  handle: string;
  displayName: string;
  initials: string;
  type: string;
};

const target = (mission.feed as FeedPostData[]).find((p) => p.kind === "target")!;

interface PlayerPostContent {
  time: string;
  body: string;
  /** Carries the target's attachment, the way a share carries the media. */
  quotesTarget?: boolean;
  stats: { likes: number; comments: number; shares: number };
}

const outcomes = mission.outcomes as Record<string, { post?: PlayerPostContent }>;

export function playerPost(path: string): FeedPostData | null {
  const content = outcomes[path]?.post;
  if (!content) return null;
  return {
    /*
     * kind "player" is deliberately not one of the six feed kinds. It is not a
     * category of information the player has to judge - it is them - and the
     * mix rule in CLAUDE.md section 2 counts the nine posts in the feed, not
     * this one.
     */
    id: `you-${path}`,
    kind: "player",
    handle: player.handle,
    displayName: player.displayName,
    time: content.time,
    body: content.body,
    attachment: content.quotesTarget ? target.attachment : undefined,
    stats: content.stats,
  };
}

export { player };
