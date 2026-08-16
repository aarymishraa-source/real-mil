# RE:AL — Art Direction Layer

This document sits **on top of** `CLAUDE.md`. It does not replace it.

`CLAUDE.md` defines structure, semantics and restraint. This file defines **atmosphere**.
The build currently has the first and none of the second, which is why it reads flat next
to the concept board.

**The correction being made:** "no decorative glow" was the right rule and it was applied
too widely. Glow on every button is slop. Light bleeding from behind a panel is *depth*,
and depth is the direction the team chose. Both are true. This file draws the line.

---

## 0. The one-sentence direction

> A surveillance terminal running in a dark room in a city at night.

Not a dashboard. Not a landing page. The player is looking at a *screen inside the fiction*,
and the room around that screen is dark and slightly alive.

Everything below serves that sentence. If an effect doesn't, cut it.

---

## 1. The atmosphere layer

This is the highest-leverage work in the whole project. It is pure CSS, it touches no
component logic, and it is the difference between "Tailwind boxes" and "a world."

Build it as a single `<AtmosphereLayer />` component mounted once in `AppShell`, sitting
behind everything at `z-0`, `pointer-events-none`, `position: fixed`, `inset-0`.

Four sub-layers, in this stacking order:

### 1.1 Light bleed (the biggest single win)

Two or three large, very soft radial gradients positioned behind where the panels sit.
This is what makes a dark page feel lit rather than empty.

```css
.bleed {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60rem 40rem at 18% 12%, rgba(30, 58, 138, 0.45), transparent 60%),
    radial-gradient(50rem 36rem at 82% 68%, rgba(124, 58, 237, 0.26), transparent 62%),
    radial-gradient(40rem 30rem at 50% 110%, rgba(34, 211, 238, 0.18), transparent 60%);
  filter: blur(20px);
}
```

Note the palette discipline: `--deep` blue carries most of it, `--nova` violet and
`--verified` cyan appear only as faint edge tones. No new colours enter.

**On the opacities.** These were originally `0.28 / 0.16 / 0.10`, written as if the light
landed on a flat page. It does not — it passes three stacked alpha layers on its way to a
feed post (bleed → panel `0.72` → post `0.62`), so barely a tenth of it arrived and the
layer was technically present but visually invisible. The values above are the corrected
ones. If another translucent surface is ever added to that stack, they will need raising
again: budget for the whole stack, not for the topmost layer.

### 1.2 Grain

Flat digital dark reads as cheap. Grain reads as film. This single effect does more for
perceived quality than any other line of CSS in the project.

```css
.grain {
  position: absolute;
  inset: 0;
  opacity: 0.035;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

Keep opacity between `0.03` and `0.05`. Above that it looks dirty. Static, never animated.

### 1.3 Scanlines

Very subtle. The player should not consciously notice them.

```css
.scan {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.014) 0px,
    rgba(255, 255, 255, 0.014) 1px,
    transparent 1px,
    transparent 3px
  );
}
```

### 1.4 Vignette

Pulls the eye to the centre and stops the layout dissolving at the edges.

```css
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 90% at 50% 45%, transparent 40%, rgba(0, 0, 0, 0.55) 100%);
}
```

**Reduced motion:** all four are static, so all four stay. Nothing here animates.

---

## 2. Panel chrome — the signature device

Every major surface in the concept board is a **framed, numbered, labelled panel**. This is
the strongest structural idea in the mockup and it is currently missing entirely.

Build `<Panel>` once and use it everywhere. It is the component that makes the whole
product look designed.

```
┌─ 01 ── THE FEED ──── YOUR INFORMATION WORLD ─────────────┐
│ ┐                                                      ┌ │   ← corner ticks
│                                                          │
│                      children                            │
│                                                          │
│ ┘                                                      └ │
└──────────────────────────────────────────────────────────┘
```

Rules:

- Border: `1px solid var(--line)`. Background: `rgba(11, 19, 32, 0.72)` with
  `backdrop-filter: blur(8px)` — so the light bleed shows *through* the panel. This is what
  connects the chrome to the atmosphere.
- Header row: number in `--verified` mono, then the title in Archivo 700 uppercase, then an
  em dash and a subtitle in `--ink-mute` mono. Wide tracking on all of it.
- A hairline rule runs from the end of the header text to the right edge of the panel.
- Corner ticks: four 8px L-shaped marks inset 6px, `1px` `--line`, `--verified` when the
  panel is the active one. Nowhere else.
- Outer shadow, one only: `box-shadow: 0 24px 60px -20px rgba(0,0,0,0.8)`. Lift, not glow.

The numbering is legitimate here — the panels *are* a sequence, the core loop in order.
That is exactly when numbered markers earn their place.

---

## 3. Where glow is allowed

Glow is a **state**, never a texture. Exhaustive list — nothing else glows:

| Element | Treatment |
|---|---|
| Active panel corner ticks | `--verified`, no blur |
| Focused input / focused button | `0 0 0 1px` ring + `0 0 20px -6px` in `--verified` |
| The `BREAKING` chip | `0 0 18px -6px rgba(255,77,109,0.5)` — one element, whole feed |
| NOVA panel edge, while speaking | `0 0 40px -14px rgba(124,58,237,0.6)`, fades when idle |
| Trust/Reach bar fill, while changing | brief `0 0 12px -2px` in its own colour, 600ms, then off |
| The RE:AL wordmark on Boot | chromatic split, see §5 |

Nine feed posts do not glow. Buttons at rest do not glow. Cards do not glow.

---

## 4. Imagery — the missing third of the design

A feed with no pictures cannot look like a feed. This is not optional polish.

### 4.1 Free assets you already own

The team's concept board is your own generated artwork. Crop from it now:

| Crop | Use |
|---|---|
| The city / silhouettes scene (top-left) | Boot screen background, 30% opacity under the wordmark |
| The RE:AL eye symbol (bottom-right) | Investigate mode cursor badge, favicon, loading mark |
| The evidence-board panel texture | Investigate screen background |

Put them in `/public/art/`. Reference from `strings.json`, never hardcoded in components.

### 4.2 Generate the rest in the same style

Six images, one session, same tool that made the board:

1. A school building at dusk, dark blue, cinematic — the target post's photo
2. A cropped printed notice, photographed at an angle, blurry — the fake screenshot
3. A school website screenshot, plain and official — evidence card 1
4. An energy drink can, product-shot style — the sponsored post
5. A city bus at a stop, night — the transit post
6. Abstract concentric geometry, violet — NOVA's avatar (**not a face, not a person**)

Prompt them with the palette: *"deep navy #0B1320, cyan and violet accents, cinematic night
lighting, grain, no text."*

### 4.3 Treatment — so photos join the palette instead of fighting it

Every image, no exceptions:

```css
.art {
  filter: saturate(0.45) contrast(1.08) brightness(0.85);
}
.art::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(30, 58, 138, 0.22);
  mix-blend-mode: color;
}
```

This duotones everything toward `--deep`, so nine different generated images still read as
one world. Without this step the feed will look like a mood board.

Apply it to the **wrapper**, not the `<img>`: `::after` does not render on a replaced
element, and the wrapper needs `position: relative` for the overlay to land.

### 4.4 The one exception — the sponsored post

**`energy-can.jpg` is exempt from the duotone.** It ships at full saturation while every
other image in the feed is pulled toward `--deep`.

This is deliberate, and it is the only exemption. Advertising does not adopt the visual
language of the room it appears in — it is produced elsewhere, to a different brief, and it
looks it. A player scrolling the feed should feel that one post is louder and glossier than
its neighbours *before* they consciously register the `SPONSORED` label. That felt
difference is the teaching moment: paid content announces itself visually if you are
looking, and the label is the confirmation rather than the discovery.

Duotoning it would fold the ad into the world and destroy the contrast that does the work.

Carried in the data as `"duotone": false` on the post's attachment, so the exception is
visible in `mission01.json` rather than buried in a component condition. No other post
sets it.

### 4.5 Uniform letterbox — every feed image is a 92px band

No feed image renders at its natural aspect ratio. All of them are cropped to the **same
92px band**, `object-cover`, whatever the source dimensions.

Two reasons, and the second is the one that matters most:

1. **It protects the height rule.** At natural aspect a 16:9 photo is ~312px of image
   alone, which would make an ordinary post tower over the target and invert
   PROTOTYPE_SPEC §2 — the picture, not the content, would decide which post dominates.
   A uniform band means no post can win on image size.
2. **It is what makes unrelated photographs read as one platform.** A real feed does not
   show you seven photographs; it shows you seven photographs *in its own frame*. The
   crop, the aspect, the corner radius and the treatment are the platform speaking, and
   they are identical for every post. Vary the format per image and the feed stops looking
   like a product and starts looking like a mood board — the same failure §4.3 guards
   against with colour, one level up. Consistency of **format** does for composition what
   the duotone does for palette.

So: new imagery inherits the band. If a future image genuinely cannot survive the crop,
recrop the source — do not give that one post a taller frame.

### 4.6 Photographed screenshots — the luminance problem

**Every mission will have a photograph of a piece of paper in it.** Screenshots of notices,
letters, forms and printouts are the raw material of this game, and they all share a defect
that the §4.3 duotone cannot fix.

A photo of white paper is a large, evenly lit mass. Measured across the four feed images:

| Image | peak L | mean L |
|---|---|---|
| `energy-can` (undoutoned, deliberately loud) | 0.9892 | 0.1012 |
| `school-dusk` | 0.6859 | 0.0197 |
| `bus-night` | 0.6869 | 0.0165 |
| `notice-photo` **before treatment** | 0.5105 | **0.2811** |

The notice has the **lowest peak of the four** and **2.8× the mean of the next brightest**.
It is not a highlight problem, it is a *mass* problem — the others are small bright points
on dark scenes, this is a whole sheet of lit paper.

The duotone cannot touch it. `mix-blend-mode: color` takes hue and saturation from the
overlay and **preserves the backdrop's luminosity by definition**; near-white paper has
almost no saturation to shift, so the tint lands and the brightness passes straight
through. And reaching for a heavier `brightness()` is the wrong instrument: it compresses
the whole tonal range and destroys the creases, the shadow under the curl and the focus
falloff — exactly the details that make the artefact believable as a phone photo.

**The fix is a second overlay in `mix-blend-mode: luminosity`**, which sets luminosity and
leaves hue and saturation alone. It pulls the paper down without flattening it. It paints
*under* the `.art::after` colour layer, so the sheet is darkened first and tinted second.

```css
.art-screenshot::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(11, 19, 32, 0.45);
  mix-blend-mode: luminosity;
}
```

Opt in from the content, never from the component:

```json
"attachment": { "treatment": "screenshot", ... }
```

**Tuning guidance.** `0.45` was chosen on measurement, not taste. Two ceilings bound it:
the treated mean must stay **below the sponsored post's 0.1012**, so the ad remains the
loudest thing in the feed; and the peak must stay well under `--ink` at **0.8432**, so no
photograph out-shouts the text. Detail is the cost — a flat luminosity layer compresses
tonal spread roughly in proportion to its alpha — so use the **lowest** alpha that clears
both ceilings rather than the darkest that looks safe.

| alpha | peak L | mean L | detail (σ) |
|---|---|---|---|
| none | 0.5105 | 0.2811 | 0.1339 |
| 0.40 | 0.1896 | 0.1104 | 0.0480 |
| **0.45** | **0.1631** | **0.0951** | **0.0406** |
| 0.50 | 0.1366 | 0.0810 | 0.0337 |
| 0.55 | 0.1153 | 0.0692 | 0.0280 |

---

## 5. Boot screen — the first three seconds

Currently text on black. It should be the most cinematic moment in the build, because it
sets the expectation for everything after.

- City crop as background, `opacity: 0.28`, `scale(1.06)`, slow 20s drift to `scale(1.0)`.
  Suppressed under `prefers-reduced-motion`.
- Full atmosphere layer on top.
- Wordmark: Archivo 900, `clamp(56px, 12vw, 160px)`, letters typing in at 60ms.
- Chromatic split on the wordmark only:
  `text-shadow: -1.5px 0 rgba(255,77,109,0.55), 1.5px 0 rgba(34,211,238,0.55);`
  Every 6s, a 120ms glitch: offsets jump to 4px, then snap back. Once. Not a loop.
- Tagline in mono, `tracking: 0.24em`, `--ink-mute`.
- `PRESS ANY KEY TO BEGIN` in a hairline box, exactly as on the concept board.

---

## 6. Type — currently too timid

The mockup's type is large and confident. The build's is safe. Correct it:

- Panel titles: `18px` Archivo 700, uppercase, `tracking: 0.08em`.
- Panel numbers: `13px` mono, `--verified`.
- Section labels: `11px` mono, uppercase, `tracking: 0.16em` — wider than currently set.
- Big values (Trust, Reach, timers, evidence counts): `34px` Archivo 700, mono digits via
  `font-variant-numeric: tabular-nums`. These are the loudest numbers on screen.
- Body copy stays exactly as it is. Feed posts are the one place restraint still wins.

---

## 7. Build order for this layer

1. `AtmosphereLayer` — all four sub-layers. Look at the result before continuing.
2. `Panel` component. Wrap the existing feed in it.
3. Type scale corrections.
4. Drop in the cropped city + eye assets. Rebuild Boot.
5. Generate and place the six feed images with the duotone treatment.
6. Glow states from §3, one at a time.

Steps 1 and 2 alone will change the perceived quality more than steps 3–6 combined.
Do them first, screenshot, and judge before going further.

---

## 8. What has not changed

Everything in `CLAUDE.md` still holds. In particular:

- The colour law. Cyan is evidence. Red is unverified. Violet is NOVA. Amber is uncertain.
  Atmosphere uses `--deep` and faint tints of these — it never introduces a new colour.
- No purple→blue gradients on buttons, cards or headings. The bleed is *behind* panels, at
  low opacity, blurred. That is a different thing.
- Feed density, real copy, accessibility floor, reduced-motion support: unchanged.

Atmosphere is added underneath the discipline. It does not replace it.
