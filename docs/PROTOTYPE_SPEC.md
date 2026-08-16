# RE:AL — Prototype Spec (Mission 01)

Companion to `CLAUDE.md`. This file describes *what each screen does*.
`CLAUDE.md` describes *how it must look and behave*.

> **What was added after this was written.** Everything below still describes Mission 01
> accurately, and Mission 01 is still the mission this spec was written for. Since then:
>
> - **A second mission**, *The Copy*, which is content only — same nine-post shape, same
>   seven evidence slots, same three NOVA beats at different numbers. No screen in this
>   file changed to accommodate it.
> - **Signal City**, a hub the game boots into, listed under §1a below.
> - **Your record** and **Teacher view**, two read-only rooms, also §1a.
> - **NOVA's replies are ordered.** Cross-check requires ask-source; §4's four replies are
>   otherwise unchanged.
> - **Reflect carries a second button**, *Back to Signal City*, beside *Play the other
>   path*. On a phone it is the only route back to the hub, because the rail is
>   desktop-only.
>
> Where this file and the build disagree on anything else, the build is wrong.

---

## The slice we are building

**Mission 01 — The Exam Rumour.**
Chosen over the deepfake and crisis missions because it is instantly legible to any judge
in any country, needs no video assets, and contains every mechanic: social pressure, source
tracing, date/context checking, an AI that sounds sure of itself, and a real consequence.

Six phases. One page. State machine, no routing.

```
BOOT → HUB → FEED → INVESTIGATE ⇄ NOVA → DECIDE → OUTCOME → REFLECT
                          ↑____________________|          |
                    (go back for more evidence)           |
              HUB ←───────────────────────────────────────┘
```

The six phases in the middle are the loop and are the only ones the phase indicator
tracks. `HUB`, `PROFILE` and `TEACHER` are rooms: reachable at any time from the rail,
they change no game state, and the indicator does not render on them.

---

## Persistent chrome (visible in all phases except Boot)

**Left rail, 72px.** Icons only, `lucide-react`, with tooltips: Signal City, Feed, Search,
NOVA, Media Lab, Algorithm, Your record, Teacher view, Settings. **Five are active** —
Signal City, Feed, NOVA, Your record, Teacher view. The other four carry a small lock glyph
and the tooltip "Unlocks in the full build", and they are list items rather than buttons:
no tab stop, no click target.

Do not fake them. A judge respects an honest boundary far more than a dead button.

The rail is desktop-only (`hidden lg:block`). Anything it is the *sole* route to has to
have a second route somewhere in the content, or that destination does not exist at 390px
— which is exactly how the hub became unreachable on a phone for a while. See DECISIONS.

`--ink-mute`, not `--ink-faint`, on the locked icons. The tokens moved after this was
written; §3 of CLAUDE.md has the argument.

**Right sidebar, 320px.**
- Player card: `Rookie Investigator · Level 7`, a generated geometric avatar (SVG, not a photo).
- **Trust** — cyan bar, starts `82%`.
- **Reach** — red bar, starts `63%`.
- `aria-live="polite"` wrapper so both changes are announced.
- Below: `EVIDENCE FOUND — 0 / 7` in mono. This is the quiet nudge to keep investigating.

**Phase indicator.** A thin horizontal 6-step marker at the top, mono uppercase, current
step in `--verified`, completed steps filled, future steps `--line`. This is the core loop
made visible — it teaches the loop without a tutorial. Do not skip it.

---

## 1. BOOT

Not a landing page. It is a power-on.

Black. The wordmark `RE:AL` types in, letter by letter, 60ms each, in Archivo 900. The `:`
is `--verified` cyan; everything else is `--ink`. Under it, in mono, small and wide-tracked:
`PAUSE. QUESTION. VERIFY.`

Then a single line fades in: **What you see isn't always reality.**
Then: `PRESS ANY KEY TO BEGIN` — pulsing at 0.4 opacity, and it must genuinely respond to
any key as well as click/tap.

Bottom-left, tiny, mono, `--ink-faint`:
`UNESCO Youth Hackathon 2026 · Play Your Part · Playable concept demo`

That one line tells the judge exactly what they're looking at. Keep it.

No hero image. No scroll. No feature cards. The whole screen is under 40 words.

---

## 1a. The rooms outside the loop

Three screens that are not phases. All three use `AppShell` and `Panel` like everything
else; none of them carries the phase indicator.

None of them is numbered either. The panel mark is a position in the loop (`01`–`06`) or a
code that exists in the fiction — the hub takes `SC`, the prefix on every location pinned
to its board — and a room with neither renders no mark at all. `00`, `07` and `08` were
tried first and all three were invented numbers making a false claim about a six-step loop.

**Signal City** — the hub, and where Boot now leads. A board with five locations pinned to
it at uneven positions and threaded together in teaching order: the evidence board's
surface, offsets, threads and pins, reused deliberately (see DECISIONS). Two locations are
playable and carry a fill; three are hatched, named, and say what they teach and that they
are not in this build. The location you are inside is marked *you are here* in cyan —
position, in the chrome, which is the only cyan on the screen. A finished world keeps its
fill, fills its pin in solid and names the badge it gave you; it is **not** marked in cyan.

Entering a mission that is already loaded is a phase change. Entering the other one is a
page load — the mission resolves at import — carrying `?mission=NN&go=1`, where `go` means
Boot has already been seen this session.

**Your record** — five skills (STOP, VERIFY, QUESTION, DISCERN, RESPOND), always all five,
each naming what it teaches. Earned ones take a fill and a cyan tick, the same cyan as
Reflect's lessons unlocked. Unearned ones are dashed and carry one extra line saying what
would earn them; dashed, not hatched, because they are available and simply have not
happened yet. Every one resolves from something the reducer already tracked — the path
taken, the evidence found, which of NOVA's questions were asked — read back out of the
session record. Badges come from the same place.

**Teacher view** — static, and labelled *concept preview — not a working feature* above
the data rather than under it. Five class competencies with example figures, bars in
`--ink-mute` with no semantic colour anywhere on the screen, one line on what a teacher
would do with the lowest number, and a plain statement that a teacher sees patterns across
a class and never an individual student's private decisions. There is no backend and the
screen says so.

---

## 2. FEED

The screen that has to feel real. Density is the whole job here.

Column of **9 posts**, scrollable, all from the loaded mission file — `mission01.json`
here, and `mission02.json` holds nine of exactly the same shape. Only one is the mission
target — the other eight are texture, and they matter enormously. A feed with one post is
a slide; a feed with nine is a world.

Post anatomy:
```
┌─────────────────────────────────────────┐
│ [avatar] @handle · 2h        [source ▾] │   ← handle: Inter Tight 500
│                                          │      time: IBM Plex Mono, --ink-mute
│ Post text, believable, 1–3 lines.        │
│ [image / screenshot block, if any]       │
│                                          │
│ ♡ 12.4K   ⌸ 2.1K   ↗ 8.7K       ⌷ save  │   ← counts in mono
└─────────────────────────────────────────┘
```

Mix required by the design (this is a learning rule, not a style choice): **true, false,
misleading, opinion, satire, sponsored.** If everything in the feed is suspicious, the game
teaches paranoia instead of judgement — which is the exact failure UNESCO's own research
base warns about. At least three posts must be *straightforwardly credible*.

**The target post** (`post_id: "exam-rumour"`) carries a red `BREAKING` chip, a blurry
screenshot of a "notice," and `47,821 people shared this`. It sits **fourth, not first** —
ordinary content comes before it, exactly like real life.

**It must not visually dominate its neighbours.** The test is a *height ratio*, not a fold
position: the target should read as *slightly* larger than an ordinary post, never as a
monolith the layout is visibly pointing at.

**Measure it against a post that also carries a photograph.** Since imagery landed
(ART_DIRECTION §4), the feed has two classes of post — five text-only at ~136px and three
photo-bearing at ~237px — and the text-only figure is no longer the meaningful comparison.
The rule is:

| Compared against | Ceiling | Currently |
|---|---|---|
| A photo-bearing neighbour | **≤ 1.2×** | **1.11×** |
| A text-only post | ~1.9× is expected, not a fault | 1.93× |

The old flat "≤ 1.6× a standard post" is retired: it was written when the target held the
only image in the feed, so any picture at all breached it. What matters is that the target
does not stand out *because the layout favours it* — a post is allowed to be taller for
carrying a photo, a caption and a social-proof line, because every other photo post is
taller for the same reason. Every feed image is letterboxed to the same 92px band precisely
so no post can win on picture size alone.

Do not chase the fold. Pushing the target further down the column to get it below the fold
is the wrong fix — the fold moves with every device and viewport, and buying those pixels
means padding the feed with filler the player has to scroll through. A post that does not
outweigh its neighbours does not need to hide.

Clicking it opens the action bar:

| Button | Colour | Effect |
|---|---|---|
| **Share** | `--unverified` outline | → DECIDE, flagged `unverified` |
| **Investigate** | `--verified` outline | → INVESTIGATE |
| **Ask NOVA** | `--nova` outline | → NOVA panel |
| **Wait** | `--pending` outline | Time passes, 2 new replies appear raising the pressure |

`Wait` is not a dead option. Choosing it adds two friend-replies — *"bro everyone's saying
it's cancelled"*, *"my cousin's in 12th, he confirmed"* — and Reach rises 3% on its own.
That models something true: not acting is also a decision, and the pressure builds.

---

## 3. INVESTIGATE — the signature screen

Trigger the **Verification Lens**: the feed desaturates to 20% and blurs 2px; the target
post stays sharp and lifts. Everything else in the room goes quiet. This is the game's one
memorable visual idea — build it carefully.

Layout switches to an **evidence board**: a dark corkboard, cards pinned at slight
rotations (`-2deg` to `2deg`), connected by thin `--line` threads. Cards are near-square,
`radius 2px`, mono type. They are documents, not posts.

**7 evidence slots, 3 findable in this slice** (the other 4 render as unpinned outlines —
honest, and it shows the system has depth):

| # | Card | Reveals |
|---|---|---|
| 1 | Original source — school website | No such notice exists. `--verified` |
| 2 | The screenshot itself | No date, no letterhead, cropped. `--unverified` |
| 3 | Date check | The notice image is from **2023**, a real closure that year. `--pending` |
| 4–7 | Locked | Teacher post · News article · Reverse image · Cross-check |

Each card: click → flips → shows what was found, in mono, plus one line naming the skill
(`SKILL: TRACE TO ORIGIN`). That line is what makes it educational rather than a puzzle.

Evidence counter climbs `0/7 → 3/7`. At 3, a `--verified` button appears:
**"I have enough to decide."**

Crucially, also always available: **"I still don't know."** → routes to DECIDE with the
`uncertain` flag. Uncertainty must be a first-class choice, never a punishment.

---

## 4. NOVA

Slide-over panel from the right, `radius 20px`, violet-edged. Avatar is generated
concentric geometry that reacts subtly to speech — **not a human face, not a photo.**

NOVA's script, and this is the heart of the AI-literacy argument:

> **NOVA:** Based on several posts circulating right now, exams do appear to have been
> cancelled. Multiple accounts are reporting it.
>
> `CONFIDENCE: 62%`  ← mono, violet bar

Four replies for the player:
- `Ask for source` → **"I can't verify the original source. I'm summarising what's being shared, not what's confirmed."**
- `Cross-check` → NOVA finds the 2023 notice and revises: **"I was wrong. I should have flagged that I had no primary source."**
- `Trust NOVA` → skips ahead, Trust drops on outcome. Non-punishing copy.
- `Investigate myself` → back to INVESTIGATE.

Under the panel, permanently, in mono `--ink-mute`:
**`NOVA can help. NOVA can be wrong. Think — don't just trust.`**

That sentence is the single most quotable thing in the demo. Put it where the judge can't
miss it.

---

## 5. DECIDE

Three options, no timer on screen (pressure comes from the replies, not a countdown —
a countdown just teaches panic):

- **Share it** — spreads the claim
- **Hold and verify** — waits for confirmation
- **Post a correction** — shares what's actually known, including what isn't

The third option should be visibly the "harder" one — more text, more effort. It must also
be the one that pays off most. That asymmetry is the lesson.

---

## 6. OUTCOME

Two branches, both fully built. Split-screen layout, the taken branch bright, the untaken
one dimmed to 25% beside it — so a judge sees the counterfactual without replaying.

**Careless branch (shared unverified):**
Run **The Cascade** — the post duplicates 6× down the feed, staggered 60ms, each copy
slightly rotated and redder. Reach ticks `63% → 96%`. Trust drops `82% → 21%`.
Then: three student comments arrive. One says they skipped studying. One says they told
their parents. One asks who started this.
Copy: **"Reach 96%. Trust 21%. The rumour reached more people than the correction ever will."**

**Careful branch (verified / corrected):**
Reach rises modestly `63% → 70%`. Trust rises `82% → 92%`.
Copy: **"Fewer people saw it. The ones who did, believed you."**

Both branches end with the same button: **"See what happened next."** No "Play again" yet —
the reflection comes first, always.

---

## 7. REFLECT

Quiet screen. Almost no colour. This is where the game stops being a game.

- One line: what you did.
- One line: what it cost or earned.
- **The question:** *"What would you check first, next time?"* — with a real text input.
  It saves nowhere. It doesn't need to. The act of typing it is the mechanic.
- Three **Lessons unlocked** checkmarks, cyan: `Trace to the original source` ·
  `Check the date` · `A confident answer isn't a verified answer`.
- Badge earned: **Source Tracer** or **Context Catcher**, depending on the path.

Then, and only then: **"Play the other path."** — resets state, keeps the badge.
That single button is what makes a 90-second demo into a 4-minute one. Judges will use it.

Beside it, **"Back to Signal City."** — the way out to the hub and into the other mission.
It is not decoration: the rail is desktop-only, so on a phone this is the only route back
to the map once a mission has started.

Footer, small: `1 of 40 planned missions · Mission Builder lets students write their own.`
This is where the roadmap gets communicated — inside the product, not on a slide.

---

## Demo script for the judge (write this into the README)

> 1. Press any key. Signal City opens — five places, two of them lit.
> 2. Enter **The Exam Rumour**.
> 3. Scroll the feed. Notice it's ordinary — that's the point.
> 4. Open the BREAKING post. Share it immediately. Watch what happens.
> 5. On the Reflect screen, click **Play the other path**.
> 6. This time: Investigate. Find the 2023 date. Ask NOVA for her source, then cross-check
>    her — in that order, because she will not let you do it the other way round.
> 7. Post a correction. Compare the two endings.
>
> Two minutes. Two outcomes. That's the whole thesis.
>
> If they have two more: **Back to Signal City → The Copy**, where the video is genuine and
> looking harder at it tells you nothing. Then **Your record** in the rail, to see the two
> runs turned into skills.

---

## Submission checklist

| Item | Notes |
|---|---|
| Live URL | Deploy early, redeploy often. **Do not leave this to the last hour.** |
| Name consistency | Blueprint says SIGNAL, mockup says RE:AL. **Pick one now.** Recommend RE:AL — it's the one with a finished visual identity and a symbol. Rename every occurrence in the PDF before submitting. |
| Tagline | One only. `Pause. Question. Verify.` |
| Pitch video (3 min) | Screen-record the demo script above with voiceover. Real product footage beats slides. Structure: problem 30s · demo 100s · why it works 30s · what's next 20s. |
| Concept PDF | You already have it. Add one page: screenshots of the live build. |
| Team details | 2–6 members, ages 18–30. Confirm every member is eligible. |
| Fictional content | Verify no real people, brands, parties or news events appear anywhere. |
| Accessibility note | One paragraph in the README on keyboard nav, contrast, reduced motion, low-bandwidth. It is a scored criterion and almost nobody bothers. |
| Submit early | The portal closes automatically. Traffic on the last night is the classic way to lose. |
