import { BadgeCheck, Heart, MessageCircle, Play, Share2 } from "lucide-react";
import mission from "../../content/mission";
import strings from "../../content/strings.json";
import ActionBar, { type ActionId } from "./ActionBar";

export interface Reply {
  handle: string;
  body: string;
}

/**
 * One post in The Feed. Presentational only - step 4 of CLAUDE.md section 7.
 * No actions yet: Share / Investigate / Ask NOVA / Wait arrive in step 5.
 *
 * Type law (CLAUDE.md section 3): the body is proportional (Inter Tight),
 * every piece of metadata around it is mono. The post is feed-world; the
 * numbers and timestamps are already evidence-world.
 */
export interface AttachmentData {
  type: string;
  /** Path under /public. Always from JSON - never hardcoded in a component. */
  src: string;
  /** Intrinsic pixels. Present so the browser reserves the box - no layout shift. */
  width: number;
  height: number;
  altText: string;
  /** ART_DIRECTION 4.3. False only for the sponsored post - see that section. */
  duotone?: boolean;
  /**
   * ART_DIRECTION 4.5. "screenshot" adds the luminosity overlay that photos of
   * paper need. Every mission will have one of these, so it is a named
   * treatment in the data, not a patch on one file.
   */
  treatment?: string;
  caption?: string;
  /**
   * Present on `"type": "video"` attachments, e.g. "0:11". It is what the
   * duration badge reads, and its presence is what makes the still read as a
   * clip rather than a photograph - a mission about a video whose feed shows a
   * picture has no bait in it.
   */
  duration?: string;
}

export interface FeedPostData {
  id: string;
  kind: string;
  handle: string;
  displayName: string;
  time: string;
  body: string;
  verified?: boolean;
  sponsored?: boolean;
  chip?: string;
  bioNote?: string;
  socialProof?: string;
  attachment?: AttachmentData;
  stats: { likes: number; comments: number; shares: number };
}

/** 12400 -> "12.4K". Counts are metadata, so they render mono. */
function count(n: number): string {
  if (n < 1000) return String(n);
  const k = (n / 1000).toFixed(1);
  return `${k.endsWith(".0") ? k.slice(0, -2) : k}K`;
}

/*
 * The player is an account like any other.
 *
 * They used to have no presence in their own feed at all: nine accounts posted,
 * NOVA spoke, and the player was a percentage in a sidebar. That is what made
 * the outcome read as a report rather than a consequence - it happened TO
 * numbers, not to somebody with a handle. Merging them into the same lookup
 * means the same avatar rules apply to them as to everyone else: initials in
 * Archivo, round because they are a person, and carrying no signal whatsoever
 * about whether what they posted is true.
 */
const player = mission.player as {
  handle: string;
  displayName: string;
  initials: string;
  type: string;
};

const accounts: Record<string, { initials: string; type: string }> = {
  ...(mission.accounts as Record<string, { initials: string; type: string }>),
  [player.handle]: { initials: player.initials, type: player.type },
};

/**
 * Avatar - initials, not geometry. CLAUDE.md still bans stock faces.
 *
 * The previous version hashed the handle into a rotated rect and a dot. It was
 * deterministic, unique per account and completely useless: nine grey blobs at
 * 32px that a judge reads as "placeholder avatar" before reading anything else
 * on the screen. It was the first thing seen and the weakest thing there.
 *
 * Initials in Archivo are instantly distinguishable and say the one thing an
 * avatar is for - who is speaking. Shape follows the real platform convention:
 * organisations are square-cornered, people are round. That convention is
 * honest and it deliberately carries no signal about truthfulness - the school
 * and Viral SC are both organisations, and one of them is lying.
 */
export function Avatar({ handle }: { handle: string }) {
  const account = accounts[handle];
  const isOrg = account?.type === "org";
  return (
    <span
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center border border-line bg-raised font-display text-2xs font-bold tracking-[0.02em] text-ink ${
        isOrg ? "rounded-doc" : "rounded-full"
      }`}
    >
      {account?.initials ?? "?"}
    </span>
  );
}

/**
 * A real photograph in a post - ART_DIRECTION section 4.
 *
 * Every feed image is letterboxed to the same 92px band. Uniform on purpose:
 * it keeps the column dense, and it stops the three photo posts from towering
 * over the six text-only ones. The target post still reads as the largest
 * because it carries a chip, a caption and a social-proof line, not because
 * its picture is bigger.
 *
 * `duotone` is the section 4.3 treatment. The sponsored post opts out so it
 * looks over-produced next to everything else - that contrast is the lesson.
 */
/**
 * What turns a still into a clip - the marks a platform paints over video.
 *
 * A play glyph, a duration badge and a scrubber sitting at zero. Nothing here
 * plays, and that is deliberate on two counts: there is no video file in this
 * build (CLAUDE.md section 1 forbids one, on load-time grounds), and the marks
 * are part of the *artefact* rather than controls of ours. So they are
 * aria-hidden and they are not buttons - the post's own stretched button is
 * underneath them, which means clicking the play glyph opens the post's actions
 * rather than doing nothing. A dead control would break the rule the locked
 * rooms are built on; a picture of a player is not a control.
 *
 * All three marks are neutral - white on a black scrim, --line and --ink-mute
 * for the scrubber. Cyan or red here would be the colour law leaking into
 * platform chrome, and a red scrubber in particular would read as "unverified"
 * on every video post ever added.
 */
function VideoMarks({ duration }: { duration?: string }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 block">
      {/* Slight scrim so the glyph survives a bright frame. */}
      <span className="absolute inset-0 bg-void/25" />
      <span className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/70 bg-void/60">
        <Play className="ml-[1px] h-3 w-3 fill-ink text-ink" strokeWidth={1.5} />
      </span>
      {duration && (
        <span className="absolute bottom-2 right-2 rounded-btn bg-void/75 px-2 py-1 font-mono text-2xs tabular-nums text-ink">
          {duration}
        </span>
      )}
      {/* Scrubber at zero: a track across the foot of the band, barely started. */}
      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-void/60">
        <span className="block h-full w-[6%] bg-ink-mute" />
      </span>
    </span>
  );
}

function Attachment({ attachment }: { attachment: AttachmentData }) {
  const { src, width, height, altText, caption, duotone = true, treatment, duration } = attachment;
  const isVideo = attachment.type === "video";
  const treated = [
    "relative h-[92px] w-full overflow-hidden",
    duotone ? "art" : "",
    treatment === "screenshot" ? "art-screenshot" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <figure className="mt-2 overflow-hidden rounded-btn border border-line bg-raised">
      <div className={treated}>
        <img
          src={src}
          width={width}
          height={height}
          alt={altText}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        {isVideo && <VideoMarks duration={duration} />}
      </div>
      {caption && (
        <figcaption className="border-t border-line px-3 py-1 font-mono text-2xs text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * What arrives when the player chooses Wait. Two friends applying pressure, and
 * the note naming what just happened. Amber because the player chose to sit in
 * uncertainty - the colour law earns its keep here (CLAUDE.md section 3).
 */
function WaitReplies({ replies, note }: { replies: Reply[]; note?: string }) {
  return (
    <div role="status" className="mt-3 border-t border-line pt-3">
      <p className="label-mono">{strings.feed.repliesLabel}</p>
      <ul className="mt-2 flex flex-col gap-2">
        {replies.map((reply) => (
          <li key={reply.handle} className="border-l border-line pl-3">
            <span className="text-xs text-ink-mute">{reply.handle}</span>
            <p className="text-sm text-ink">{reply.body}</p>
          </li>
        ))}
      </ul>
      {note && <p className="mt-3 font-mono text-2xs text-pending">{note}</p>}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Heart;
  label: string;
  value: number;
}) {
  return (
    <span className="flex items-center gap-2">
      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only">{label}: </span>
      {count(value)}
    </span>
  );
}

/*
 * Translucent, not blurred. At 0.62 alpha the light bleed reads through the
 * post instead of stopping at it (ART_DIRECTION section 1.1). Deliberately no
 * backdrop-filter here: nine blurred surfaces would cost frame rate on scroll,
 * and the Panel already blurs what sits behind it. The 1px --line border stays
 * exactly as it was - it is what keeps a post legible against a backdrop that
 * is no longer a constant.
 */
export default function FeedPost({
  post,
  interactive = false,
  open = false,
  onToggle,
  onAction,
  replies,
  replyNote,
}: {
  post: FeedPostData;
  /** Only the target post opens actions in this slice. */
  interactive?: boolean;
  open?: boolean;
  onToggle?: () => void;
  onAction?: (action: ActionId) => void;
  replies?: Reply[];
  replyNote?: string;
}) {
  const barId = `actions-${post.id}`;
  return (
    /*
      pb-3, not p-4. The stats row is 16px tall because of its icons while its
      text is 11px, so the text sits ~2.5px above the row's floor. With equal
      padding that made 14.5px of air above the stats and 19.5px below - every
      post reading bottom-heavy, which is the card-grid rhythm creeping back.
      12px bottom padding balances it and takes 36px off the column.
    */
    <article
      data-kind={post.kind}
      className="hairline rounded-post bg-surface/[0.62] px-4 pb-3 pt-4"
    >
      {/*
        A stretched button rather than a click handler on the <article>. It
        gives the whole post a real hit area for the mouse while staying a
        genuine button for the keyboard - reachable by Tab, operable by Enter
        and Space, and carrying aria-expanded/aria-controls for free. A div with
        role="button" would have needed all of that hand-wired and still read
        worse.
      */}
      <div className="relative">
        {interactive && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={barId}
            className="absolute inset-0 z-10 rounded-post"
          >
            <span className="sr-only">{strings.feed.openActions}</span>
          </button>
        )}
        {/*
          Avatar gutter, not a header band. The avatar sits in its own narrow
          column and name / handle / time / body / stats all stack beside it, so
          post height tracks how much was written instead of paying a fixed
          32px of chrome per post.
        */}
        <div className="flex gap-3">
        <Avatar handle={post.handle} />

        <div className="min-w-0 flex-1">
          {/*
            One line, never two. Name and handle share the shrinkable space and
            ellipsis when it runs out; the timestamp and chip are shrink-0 so
            they stay whole and never orphan onto a line of their own.
          */}
          <div className="flex items-center gap-x-2">
            <span className="flex min-w-0 items-center gap-x-2">
              <span className="truncate text-sm font-medium text-ink">{post.displayName}</span>
              {/*
                Identity, not evidence. This tick stays --ink-mute and never
                --verified: a platform badge confirms who posted, not whether the
                claim is true. Colouring it cyan would teach the exact conflation
                this mission exists to break. Cyan belongs to the evidence layer.
              */}
              {post.verified && (
                <BadgeCheck
                  role="img"
                  aria-label={strings.feed.verifiedAccount}
                  className="h-4 w-4 shrink-0 text-ink-mute"
                  strokeWidth={1.75}
                />
              )}
              <span className="truncate text-xs text-ink-mute">{post.handle}</span>
            </span>
            <span className="shrink-0 font-mono text-2xs text-ink-mute">· {post.time}</span>
            {/*
              --ink-mute. This is the paid-content disclosure in a game about
              spotting paid content; at --ink-faint it was 2.69:1, the least
              readable thing on the post.
            */}
            {post.sponsored && (
              <span className="shrink-0 font-mono text-2xs uppercase tracking-[0.04em] text-ink-mute">
                {strings.feed.sponsored}
              </span>
            )}
            {post.chip && (
              <span className="shrink-0 rounded-btn border border-unverified/40 bg-unverified/10 px-2 py-1 font-mono text-2xs uppercase tracking-[0.04em] text-unverified">
                {post.chip}
              </span>
            )}
          </div>

          {/*
            --ink-mute, not --ink-faint. The satire account's bio note is real
            content - it is the tell that makes the post readable as satire - so
            it has to clear the 4.5:1 floor in CLAUDE.md section 5. --ink-faint
            is for disabled states and placeholders and sits at 2.65:1.
          */}
          {post.bioNote && (
            <p className="mt-1 font-mono text-2xs text-ink-mute">{post.bioNote}</p>
          )}

          <p className="mt-2 text-sm text-ink">{post.body}</p>

          {post.attachment && <Attachment attachment={post.attachment} />}

          {post.socialProof && (
            <p className="mt-2 font-mono text-2xs text-ink-mute">{post.socialProof}</p>
          )}

          <footer className="mt-3 flex items-center gap-6 font-mono text-2xs text-ink-mute">
            <Stat icon={Heart} label={strings.feed.likes} value={post.stats.likes} />
            <Stat icon={MessageCircle} label={strings.feed.comments} value={post.stats.comments} />
            <Stat icon={Share2} label={strings.feed.shares} value={post.stats.shares} />
          </footer>
        </div>
        </div>
      </div>

      {/* Both sit outside the stretched button so they stay clickable. */}
      {interactive && open && onAction && <ActionBar id={barId} onAction={onAction} />}

      {replies && replies.length > 0 && <WaitReplies replies={replies} note={replyNote} />}
    </article>
  );
}
