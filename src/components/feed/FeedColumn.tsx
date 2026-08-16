import mission from "../../content/mission";
import FeedPost, { type FeedPostData, type Reply } from "./FeedPost";
import { type ActionId } from "./ActionBar";

/**
 * The Feed - step 4 of CLAUDE.md section 7, now carrying step 5's actions.
 *
 * All 9 posts, in JSON order. The target post sits fourth on purpose, and it
 * is capped so it never outweighs its neighbours - see PROTOTYPE_SPEC section
 * 2. Eight of the nine are texture, and the texture is the lesson: a feed where
 * everything is suspicious teaches paranoia instead of judgement.
 *
 * Only the target post is interactive in this slice. The other eight are
 * deliberately inert - giving all nine an action bar would imply eight more
 * mechanics that do not exist, which is the kind of faked depth CLAUDE.md
 * section 7 warns against.
 *
 * The accessible region and its heading come from the wrapping <Panel>.
 */
const posts = mission.feed as FeedPostData[];
const waitEvent = mission.waitEvent as { newReplies: Reply[]; note: string };

export default function FeedColumn({
  openPostId,
  onTogglePost,
  onAction,
  waited,
  interactive = true,
}: {
  openPostId: string | null;
  onTogglePost: (id: string) => void;
  onAction: (action: ActionId) => void;
  waited: boolean;
  /**
   * False under the Verification Lens, where the feed is a backdrop. Removes
   * the stretched buttons outright rather than hiding focusable elements behind
   * aria-hidden, which would strand a keyboard user in an invisible tab stop.
   */
  interactive?: boolean;
}) {
  return (
    <ol className="flex flex-col gap-2">
      {posts.map((post) => {
        const isTarget = post.kind === "target" && interactive;
        return (
          <li key={post.id}>
            <FeedPost
              post={post}
              interactive={isTarget}
              open={isTarget && openPostId === post.id}
              onToggle={() => onTogglePost(post.id)}
              onAction={onAction}
              replies={isTarget && waited ? waitEvent.newReplies : undefined}
              replyNote={isTarget && waited ? waitEvent.note : undefined}
            />
          </li>
        );
      })}
    </ol>
  );
}
