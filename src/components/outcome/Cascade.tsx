import mission from "../../content/mission";
import strings from "../../content/strings.json";
import FeedPost, { type FeedPostData } from "../feed/FeedPost";
import { playerPost } from "../../content/playerPost";
import { usePrefersReducedMotion } from "../../lib/motion";

/**
 * THE CASCADE - ART_DIRECTION section 3, PROTOTYPE_SPEC section 6.
 *
 * Six copies of the post the player just shared, falling down the feed 60ms
 * apart, each one further off true and a shade redder than the last. It is the
 * only moment in the build where the motion is meant to be unpleasant.
 *
 * The copies are aria-hidden. A screen-reader user gets the numbers and the
 * consequence copy, which say the same thing without six identical posts being
 * read out - the horror here is visual repetition, and repeating it to a
 * screen reader is noise, not equivalence.
 *
 * Under reduced motion nothing animates and nothing staggers: the end state is
 * rendered directly, which is exactly what the animation was building toward.
 *
 * WHAT IS SPREADING IS THE PLAYER'S OWN REPOST. It used to be ClipWatch's - the
 * original post, duplicating itself - which was the wrong thing on screen at
 * the worst possible moment: the player watches something spread that has
 * somebody else's name on all six copies, and the screen quietly tells them the
 * consequence belongs to a stranger. Their handle is on every copy now, and the
 * artefact rides along with it, because that is what sharing does.
 *
 * The fallback to the target is not decoration: a mission whose careless
 * outcome carries no player post still gets a cascade rather than an empty box.
 */
const target = (mission.feed as FeedPostData[]).find((p) => p.kind === "target")!;
const shared = playerPost("careless") ?? target;

const COPIES = 6;
const STAGGER_MS = 60;

/* Progressively further off true, and progressively redder. Unchanged. */
const ROTATION = [-1.1, 1.5, -2.0, 2.6, -3.2, 3.8];
const TINT = [0.05, 0.09, 0.14, 0.2, 0.27, 0.35];

/*
 * The telescope. Each copy sits smaller and further back than the one before,
 * and each shows less of itself - the reveal tightens with depth so the stack
 * compresses rather than marching evenly down the page.
 */
const SCALE = [0.86, 0.79, 0.72, 0.66, 0.6, 0.55];

/*
 * px of copy i visible before copy i+1 lands on it.
 *
 * The first reveal is much larger than the rest on purpose. At 40px the second
 * copy's header landed exactly on the first copy's body line - two sharp runs
 * of the same sentence overlapping at the same height, which reads as a
 * rendering fault, not as depth. 84px clears the first copy's header and its
 * line of text before anything covers it, so the top of the stack stays a
 * legible post and only the ones behind it degrade.
 */
const REVEAL = [84, 38, 30, 25, 21];

/*
 * Recession by legibility, not just by size. The claim stops being something
 * anyone reads and becomes something that is merely spreading - so the deeper
 * copies lose focus and weight until they are shapes with a red cast. Capped
 * at 5px: past that it stops reading as distance and starts reading as a
 * broken render.
 */
const BLUR = [0, 1.6, 2.8, 3.7, 4.4, 5];
const FADE = [1, 0.93, 0.84, 0.73, 0.62, 0.52];

/** One post's laid-out height; margins are computed back from it. */
const POST_H = 262;

export default function Cascade() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ol
      aria-hidden="true"
      aria-label={strings.outcome.cascadeLabel}
      className="cascade-stack pointer-events-none relative h-[350px] overflow-hidden"
    >
      {Array.from({ length: COPIES }, (_, i) => (
        <li
          key={i}
          className={reducedMotion ? undefined : "cascade-item"}
          style={{
            marginTop: i === 0 ? 0 : REVEAL[i - 1] - POST_H,
            /*
             * The copy's position in the stack, exposed as a custom property.
             * The game staggers these in time; the overview page re-times the
             * same keyframe onto a scroll timeline, where stagger has to be
             * expressed as range rather than delay - and range needs the index.
             */
            ["--i" as string]: i,
            ...(reducedMotion ? {} : { animationDelay: `${i * STAGGER_MS}ms` }),
          }}
        >
          <div
            className="relative"
            style={{
              transform: `scale(${SCALE[i]}) rotate(${ROTATION[i]}deg)`,
              transformOrigin: "top center",
              filter: BLUR[i] ? `blur(${BLUR[i]}px)` : undefined,
              opacity: FADE[i],
            }}
          >
            <FeedPost post={shared} />
            {/*
              The reddening. An overlay rather than a filter, so the post keeps
              its own contrast underneath and only gains the tint - a filter
              would wash the type out along with everything else.
            */}
            <span
              className="absolute inset-0 rounded-post"
              style={{
                background: `rgba(255, 77, 109, ${TINT[i]})`,
                boxShadow: `inset 0 0 0 1px rgba(255, 77, 109, ${Math.min(1, TINT[i] * 2.2)})`,
              }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

export const CASCADE_MS = COPIES * STAGGER_MS + 260;
