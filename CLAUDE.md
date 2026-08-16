# RE:AL — Project Constitution

Read this file fully before writing any code. Every rule here overrides your defaults.

> **Restart the dev server after editing `tailwind.config.js`.** Vite's HMR does not re-read
> the config, and the failure mode is silent — no error, no warning. The utility class
> simply does nothing and the element falls back to an inherited value, which looks
> plausible enough to ship. A production build picks the change up correctly, so `npm run
> build` passing is not evidence that the dev server is showing you the truth. This has
> already cost one wrong measurement.

---

## 0. What we are building

**RE:AL** — *Pause. Question. Verify.*
A browser-based, frontend-only interactive demo for the **UNESCO Youth Hackathon 2026**
(theme: *Play Your Part: Youth Designing the Future of Media and Information Literacy*).

It is **not** a full game. It is a **playable vertical slice** that proves the core loop
end to end:

```
SEE → QUESTION → INVESTIGATE → DECIDE → EXPERIENCE → REFLECT
```

A judge with 4 minutes must be able to open a link, play Mission 01 twice (once carelessly,
once carefully), get two visibly different endings, and understand the whole product.

**Two missions ship, and the second one is content.** `The Copy` was added after Mission 01
was finished, on the condition that it required no engine: it is a JSON file plus the
module that decides which JSON the screens read. If a third mission ever costs a component
change, something has gone wrong with the separation — that is the standing test.

Three rooms sit outside the loop and are reached from the left rail: **Signal City** (the
hub the game now boots into, a map of five locations of which two are playable), **Your
record** (the five skills and the badges, resolved from what the reducer tracked), and
**Teacher view** (a static concept preview, labelled as one on the screen itself).

**Ship target: a live URL.** Not a repo, not localhost. A URL.

---

## 1. Hard constraints

| Rule | Value |
|---|---|
| Backend | **None.** No API, no DB, no auth, no env vars. |
| Persistence | React state + `sessionStorage` only. |
| Data | All game content lives in `/src/content/*.json`. Zero hardcoded copy in components. |
| Routing | Single page, state-machine driven. No react-router. |
| Deploy | Static build → Vercel or Netlify. Must work from `dist/`. |
| Target device | Laptop 1440px first, must not break at 390px mobile. |
| Load | Under 2s on average connection. No video files. |

**Stack (do not substitute):**
Vite + React 18 + TypeScript + Tailwind CSS + `lucide-react`.

Nothing else gets installed without a reason written in the commit message.

Framer Motion was in this list and has been removed. The motion budget in §3 is three
animations, and all three turned out to be plainly expressible in CSS — a Lens that is a
`filter` transition, a Cascade that is a staggered keyframe, and counter ticks that are a
`requestAnimationFrame` loop over a number. Shipping an animation library to run three
CSS animations would have added weight to a build judged partly on low-bandwidth access.
If a future mission genuinely needs orchestration CSS cannot express, add it back with the
reason in the commit message.

---

## 2. The anti-slop contract

This project will be judged next to a thousand others. The failure mode is not "ugly" —
it is **"looks AI-generated."** These are the tells. Do not produce them.

### Banned outright

- ❌ Purple→blue linear gradients on backgrounds, cards, buttons, or headings.
- ❌ Glowing `box-shadow` on every element. Glow is a **signal**, not a texture.
- ❌ Emoji as UI icons. Use `lucide-react` only.
      Emoji are banned in UI chrome — buttons, labels, icons, headings. Emoji in post
      bodies are content, written by fictional users, and are allowed. A typed ✅ is a
      fake authority signal and is part of the lesson, not a palette violation.
- ❌ Fonts: Orbitron, Rajdhani, Audiowide, Michroma, Press Start 2P, Space Grotesk.
- ❌ Centered hero + one-line tagline + two buttons + three feature cards. That is the
      template answer. We open on the product itself.

      **Amended, honestly: the overview page exists, and the ban was never about the URL.**
      What was banned is a page that *stands between* a judge and the product, made of stock
      hero furniture — a headline about the thing instead of the thing. That page is still
      banned and always will be.

      The overview page is allowed because it inverts all three of those:

      - **It is made of the product, not placed in front of it.** The page serves the root
        and the game lives at `/play` (with `/about` kept as an alias so shared links
        survive). A visitor meets a real feed with a real claim landing in it, and one
        filled button - the highest-contrast object on the page - into `/play`.
      - **Its hero is the FEED.** Not Boot. Boot is a centred wordmark over a tagline over a
        button, which is structurally the exact hero this rule bans however true it is that
        it is "the product" - and the product's most interesting screen is the feed anyway.
        The first viewport is a real column of real posts with the claim landing in it.
      - **Every section is made of running components.** The real target post through
        `FeedPost`, the real `PhaseIndicator`, a real `EvidenceCard`, the real
        `ConfidenceBar`, the real Cascade, the real `CityBoard`, the real teacher rows. If a
        section needs a graphic that does not exist in the game, the section is wrong and
        gets cut - which is why there is no "how it works" diagram and no feature grid.

      One test governs it, and it is stricter than the ban was: **the page is not a
      description of RE:AL, it is a small demonstration of what RE:AL teaches.** Someone
      should be able to scroll it and come away having felt the difference between reading
      a claim and checking one. If it ever reads as a feature page, it has failed even if
      every rule below is satisfied.

      Type carries it, using the product's own split: proportional where the page speaks as
      the feed does, monospace for every fact, measurement, source and caption - the same
      feed-world / evidence-world division the game runs on, which the page then states out
      loud while the reader is already inside it. Type may be **bolder** here than in the
      game: the feed is restrained because a feed has to feel ordinary, and that reasoning
      does not transfer to a page whose job is to be read.

      Sections must not be the same shape stacked - the measure, the alignment and the
      entry point vary, and one section breaks the column outright.

      **Four sections, not eight.** The claim landing in a feed, the problem, one
      demonstration of checking it, the way in. Anything that answers a question a judge
      has AFTER playing - the city, the design decisions, the schools material - belongs in
      the proposal document. It was 9,167px for a two-minute game.

      **One typographic event.** The thesis at 120-160px and everything stepping hard down
      from it. Six statements of equal weight is a template in a large font.

      That page has its own motion budget, separate from the three animations in §3, and
      every piece of it must **show something the words would otherwise have to say**: the
      claim landing in the feed, the loop marker walking the demonstration, the evidence
      revealing as you reach it, NOVA's confidence falling from 62 to 34, the claim
      spreading under the reader's own scroll, and staggered section entrances.

      **And motion is measured in scroll distance, not in milliseconds.** A range that
      completes inside one wheel notch is not motion, whatever the animation inspector
      says. The floor is ~180px of scrolling from first movement to finish. No parallax, no scroll-direction effects, no
      ambient loop, no counters whose number means nothing, no hover that moves layout.
      Anything that could be removed without changing what the section says, is.

      **It is CSS, not JavaScript.** `animation-timeline: view()` with per-element
      `animation-range`, wrapped in `@supports`, with the static state outside it - so it is
      bidirectional for free, runs on the compositor, and the ~16% without support get the
      finished page with no animation. There are no observers and no scroll listeners on
      that page. Motion that can hide content must never depend on an event firing.

      **And the 2026 trend set is banned by name**, because it is this year's version of the
      template answer: gradient text accents, liquid-glass surfaces, radial node clusters,
      compare sliders, looping video heroes, blur-fade-up entrances. Every AI product site
      uses them and a judge has seen all of it. Reaching for one is the signal to stop.

- ❌ Placeholder copy: "Lorem ipsum", "Feature One", "Your text here", "Coming soon".
- ❌ Card grids where every card is the same size and weight.
- ❌ `border-radius` everywhere at the same value. Vary it with intent (see §3).
- ❌ Animating everything on scroll. One orchestrated moment beats twenty fades.
- ❌ Stock "AI face" images. The NOVA avatar is generated abstract geometry, not a person.

### Required instead

- ✅ **Density.** Real interfaces are dense. Empty space with three floating cards reads as
      a landing page, not a product. The Feed should feel like a feed.
- ✅ **The player is in the feed.** They have an account — handle, initials, avatar — set in
      the mission file, and what they choose is rendered as a real post by the same
      component every other account uses. A screen that only *describes* what the player
      did is a dashboard, whatever it looks like.
      **`kind: "player"` sits outside the six-kind mix rule below.** The mix is a rule about
      the nine posts in the feed, because those are the things a player has to judge. Their
      own post is not a category of information to weigh up — it is them — so it is neither
      true, false, misleading, opinion, satire nor sponsored, and counting it would turn a
      rule about judgement into a rule about arithmetic.
- ✅ **Real copy.** Every post, comment, username and timestamp is written and specific.
      "@priya_sharma04 · 2h" not "@user1".
- ✅ **Asymmetry.** The Feed column is 620px, the sidebar is 320px. They are not equal.
- ✅ **Semantic colour.** See §3 — a colour that means nothing must not appear.
- ✅ **Visible state.** Trust and Reach numbers change on screen when the player acts.

### Self-check before you say "done"

Run this on every screen. If you answer yes to any, fix it before moving on.

1. Could this exact screen belong to a crypto dashboard, a SaaS landing page, and a
   fitness app with only the words swapped? → It has no point of view. Redo.
2. Is any colour used purely because it looked nice? → Remove it.
3. Is there a glow, gradient or animation that carries no meaning? → Remove it.
4. Does the copy sound like a product manager or like a 15-year-old on a feed? → Rewrite.
5. Read the screen with CSS disabled. Does the content still tell the story? → If no, the
   design is carrying weight the content should carry.

---

## 3. Design system

### Palette — every colour has one job

```css
/* Surfaces — the world */
--void:      #060A12;  /* page background. Deeper than the mockup on purpose. */
--surface:   #0B1320;  /* cards, feed items */
--raised:    #111827;  /* hovered / elevated */
--line:      #1C2536;  /* hairline borders — 1px, everywhere, always */

/* Text */
--ink:       #E8EDF5;  /* primary */
--ink-mute:  #8494AC;  /* secondary, metadata, timestamps */
--ink-faint: #4B5A73;  /* placeholder text inside an empty input. NOTHING else. */

/* Semantic — THESE ARE RULES, NOT DECORATION */
--verified:  #22D3EE;  /* cyan  = evidence found, source confirmed, trust rising */
--unverified:#FF4D6D;  /* red   = unsourced, viral, trust falling, danger */
--nova:      #7C3AED;  /* violet= AI. Appears ONLY on NOVA. Never anywhere else. */
--nova-ink:  #A78BFA;  /* violet= the same AI signal, at a weight text can carry. */
--pending:   #E8B339;  /* amber = uncertain, "not enough evidence", waiting */
--deep:      #1E3A8A;  /* blue  = ambient depth only. Never text, never a button. */
```

**`--ink-faint` is not a content colour.** It measures **2.5–2.8:1** against every surface in
this build, well under the 4.5:1 floor §5 calls non-negotiable. It has exactly one
legitimate use: placeholder text inside an empty input, where WCAG does not apply and the
text is meant to disappear the moment you type.

It was reached for six separate times during the build — the `SPONSORED` disclosure, the
UNESCO line on Boot, the `SKILL:` prefix, evidence slot numbers, the correction effort
label, the satire account's bio note — every time because the text was small, mono and
felt secondary. **Every one of those was load-bearing.** In this project small mono text is
usually the most important text on the screen: it is where the metadata, the provenance and
the teaching live.

The rule, so this stops recurring: **if it can be read, it is content, and content takes
`--ink-mute`.** Reach for `--ink-faint` only when the text is genuinely meant to vanish.

**The colour law:** if an element is violet, it came from the AI. If cyan, it is verified.
If red, it is unverified or spreading. If amber, the player chose uncertainty. A judge
should be able to work this out in 30 seconds without being told. Never use these for mood.

### Cyan carries exactly two meanings

Cyan is the only colour in this palette with more than one job, so its two jobs are
written down. Everything else that appears in cyan is a bug.

**1. Verified evidence.** A source confirmed, a piece of evidence found, a claim checked,
trust rising. This covers the actions that take you *into* the evidence layer as well as
the layer itself: `Investigate`, `Investigate myself`, `I have enough to decide`,
`Post a correction`, the evidence counter, `EVIDENCE ADDED`, the `Verified` signal, the
Trust figure, the lessons unlocked on Reflect.

**2. Current position — you are here.** The active panel's number and corner ticks, the
current step of the phase indicator, the active room in the left rail.

**The two never appear in the same context and so can never be confused: position lives in
the chrome, evidence lives in the content.** A player never has to decide which one a cyan
mark means, because the chrome and the content never overlap.

**Navigation is neither.** "See what happened next" and "Play the other path" go to
destinations that verify nothing and mark no position. They take neutral treatment —
`--ink` on an `--ink-mute` border — and get their weight from size and padding instead.
Both were cyan and both were wrong.

**One named exception:** the `:` in the `RE:AL` wordmark. That is the brand mark, not a
signal. It appears only on Boot, where there is no evidence and no position marker on
screen to confuse it with.

**The one exception to the colour law — and it is not a new colour.**

`--nova` at `#7C3AED` is a dark violet, and it is the only colour in this palette that
**cannot carry small text on a dark surface.** Measured against the composited feed post
surface, an 11px label in `--nova` lands at **3.23:1** — under the 4.5:1 floor in §5, which
is a scored criterion. Cyan reaches 10.18:1, amber 9.59:1, red 5.73:1 on the same surface.
Violet is alone in failing, because it is dark rather than because it is violet.

So the signal splits by **role, not by meaning**:

| Token | Carries | Use for |
|---|---|---|
| `--nova` `#7C3AED` | **Structure** | Borders, fills, bars, panel edges, the NOVA panel's glow |
| `--nova-ink` `#A78BFA` | **Text** | Any NOVA-coloured label, value, heading or body copy |

`--nova-ink` measures **6.76:1** on the same surface. The `--nova` border is left alone at
3.23:1, which clears the 3:1 floor that applies to non-text UI — so the structural violet
is legitimate everywhere except as small text.

All figures are measured against the composited post surface at the light bleed's
brightest point, which is the worst case for light text. Re-measure there, not on
`--surface` in isolation, or the numbers will read better than they are.

**This is not a fifth semantic colour.** It is `--nova` at a legible weight. Violet still
means the AI and nothing else; a player cannot tell the two apart as *signals*, only as
weights. Do not reach for `--nova-ink` to mean something new, and do not use `--nova` for
text just because it is the "real" token.

This matters well beyond one button. The NOVA panel, the confidence bar, its percentage
readout and its four reply buttons are all violet and all still to be built. The rule is
written down here so it is settled once instead of re-argued at each of them.

### Type

Three faces, three jobs. Load via Google Fonts, `display=swap`.

| Role | Face | Use |
|---|---|---|
| Display | **Archivo** (wght 700–900, wdth 112) | `RE:AL` wordmark, screen titles, big numbers |
| Interface | **Inter Tight** (400/500/600) | posts, buttons, body, everything in the Feed |
| Evidence | **IBM Plex Mono** (400/500) | metadata, timestamps, source cards, Trust/Reach values, NOVA confidence |

**Why mono matters:** the whole game is feed-world vs evidence-world. The Feed is
proportional and warm; the moment you investigate, the type turns monospace and forensic.
That typographic switch *is* the lesson. Use it deliberately — mono never appears in a
post, proportional never appears in an evidence card.

Scale: `11 / 13 / 15 / 18 / 24 / 34 / 56`. Tracking: `-0.02em` on display, `0` on body,
`0.04em` on mono labels (uppercase).

### Shape and space

- Feed posts: `radius 10px`, `1px solid var(--line)`.
- Evidence cards: `radius 2px` — near-square, they are documents, not posts.
- NOVA panel: `radius 20px` — organic, it is not a document.
- Buttons: `radius 6px`.
- Spacing scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 72`. Nothing in between.
- Grid: Feed panel `620px` · Sidebar `320px` · gap `24px`. Deliberately unequal.
  The `620px` is the **Panel**, not the posts. Inside its `16px` padding, feed posts
  compute to `586px`. Measure the panel against the grid, the posts against 586.

### Motion

Framer Motion. Default `ease: [0.2, 0.8, 0.2, 1]`, duration `220ms`. Hover `120ms`.

**Only three animations in the whole build:**

1. **The Verification Lens** (signature). Entering Investigate mode: the Feed desaturates
   to 20% and blurs 2px over 300ms, the investigated post stays sharp, and its metadata
   slides out in mono. This is the RE:AL Eye made real.
2. **The Cascade** (signature). If the player shares without verifying: the post duplicates
   down the Feed, 6 copies, staggered 60ms, each slightly rotated and more red. Reach
   counter ticks up fast. It should feel slightly sickening. Then it stops and the
   consequence panel slides in.
3. **Counter ticks.** Trust and Reach numbers count to their new value over 600ms.

Everything else: opacity + 8px translate, or nothing. Never a bounce, never a spring
on a layout element, never a looping ambient animation.

Wrap all of it: `@media (prefers-reduced-motion: reduce)` → no transforms, instant state
change, keep only opacity crossfades. This is an accessibility criterion UNESCO scores.

---

## 4. Content rules

Content is in `/src/content/mission01.json` and `/src/content/mission02.json`, with UI copy
in `/src/content/strings.json`. Components read whichever mission `content/mission.ts`
resolves — they never import a mission file directly, and they never inline strings.

- Fictional city, fictional school, fictional handles. **Zero real people, brands, parties,
  or real news events.** This is a UNESCO submission — no real-world political content.
- Names should be plausibly multicultural, not all Western, not all Indian.
- Posts must be *believable*, not obviously fake. The strongest teaching moment is
  "I almost shared it," and that only works if the bait is good.
- Never label anything TRUE or FALSE. The vocabulary is: **Verified / Unverified /
  Not enough evidence / Missing context / Original source found**.
- Failure copy never shames. "You shared it before checking. Here's what happened."
  Never "Wrong!" or "You failed." A player who corrects themselves gains Trust back.

---

## 5. Accessibility floor (non-negotiable — it is a scored criterion)

- Every interactive element reachable and operable by keyboard, with a visible
  `2px solid var(--verified)` focus ring. No `outline: none` without a replacement.
- Contrast: body text ≥ 4.5:1 against its surface. Check `--ink-mute` on `--surface`.
- Never encode meaning in colour alone — pair every colour signal with a text label or icon.
- `aria-live="polite"` on the Trust/Reach panel so changes are announced.
- Semantic HTML: `<article>` for posts, `<button>` for actions, real headings in order.
- All motion respects `prefers-reduced-motion`.

---

## 6. File structure

```
src/
  content/
    mission01.json        # a whole mission: posts, evidence, NOVA lines, endings
    mission02.json        # the second one, same shape, no engine changes
    mission.ts            # which mission is loaded, and nothing else
    strings.json          # UI labels, so localisation is provably possible
  state/
    gameMachine.ts        # phase state machine + trust/reach reducer
    progress.ts           # which missions finished this session (sessionStorage)
  components/
    feed/       FeedPost, FeedColumn, SourceCard
    investigate/ EvidenceBoard, EvidenceCard, VerificationLens
    nova/       NovaPanel, ConfidenceBar
    hud/        TrustReachMeter, PhaseIndicator
    outcome/    ConsequencePanel, ReflectionCard
    shell/      AppShell, LeftRail
  screens/
    Boot, Hub, Investigate, Decide, Outcome, Reflect, Profile, Teacher
    Landing               # the overview page at the root. Not a game phase.
```

The feed has no screen of its own — it is App's default branch, wrapped in the same
`AppShell` and `Panel` as everything else.

---

## 7. Build order — do not skip ahead

Each step must run in the browser before you start the next one.

1. Vite + TS + Tailwind scaffold. Tokens into `tailwind.config` + `index.css`. Fonts loaded.
2. `AppShell` + `LeftRail` + `TrustReachMeter` with hardcoded values. Make it *look* right.
3. `mission01.json` written in full, with real copy. Content before components.
4. `FeedColumn` rendering real posts from JSON. Dense, scrollable, believable.
5. Four action buttons wired to the state machine: Share / Investigate / Ask NOVA / Wait.
6. Investigate mode + Verification Lens + evidence board. 3 of 7 evidence pieces findable.
7. NOVA panel — she answers confidently, cites nothing, and says so if pushed.
8. Decide → Outcome. Both branches. The Cascade on the careless branch.
9. Reflect screen: what you did, what it cost, what to check next time.
10. Boot screen last. It is the first thing seen and the least important thing built.
11. A11y pass, reduced-motion pass, 390px pass.
12. Deploy. Get the URL. Then stop.

**If time runs out, an unfinished step 6 with steps 1–5 polished beats all 12 half-built.**
Depth beats breadth. A judge who sees one flawless screen assumes the rest is flawless.

---

## 8. How to work with me

- Before each step, state in one line what you're about to build and why.
- After each step, run the build and report any error before continuing.
- If a design choice isn't covered here, choose the more restrained option and say so.
- Never add a feature that isn't in this file. Scope creep is the enemy tonight.
