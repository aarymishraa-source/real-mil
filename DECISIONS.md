# Decisions

Why this build is the way it is.

`CLAUDE.md` says what the rules are. This file says why they exist, and records the
arguments we had on the way. Most of these were not obvious at the time and several
were decided twice, the second time against the first.

> **On the commit history.** This repository is a single commit, because the build was
> done in one continuous session and there is no real chronology to preserve.
>
> We did try splitting it into a readable sequence, and then threw that away. The
> commits would have described work that genuinely happened, but in an order assembled
> afterwards from the finished files rather than recovered from anything — and some of
> them would not have built on their own. For a project whose entire subject is checking
> a claim before you pass it on, shipping a plausible-looking history that nobody could
> verify was the wrong trade to make.
>
> So the sequence of reasoning lives here instead. This file is the commit log, and it
> is a better one than we would have written: it records what was decided, what got
> reversed, and what it cost to find out.

---

## The product

### Why RE:AL and not SIGNAL

Both names were on the table. RE:AL won because it already had a finished visual
identity — a wordmark where the `:` does work, and a symbol. SIGNAL had a name and
nothing else. A four-minute demo is judged partly on whether it looks like a product
that exists, and a product that exists has a mark. Picking the name with the artwork
cost us nothing and bought a Boot screen.

The tagline is **Pause. Question. Verify.** and there is only one. A second tagline
would have meant neither was the tagline.

### Why one mission instead of eight

We could have built eight shallow missions or one that goes all the way through the
loop. We built one.

A judge with four minutes cannot evaluate breadth — they can only evaluate the thing
in front of them. Eight missions at 12% depth each would show a menu; one mission at
full depth shows a game. And the reflex a shallow mission teaches is "click the
suspicious thing", which is the opposite of the reflex we want.

The roadmap is communicated **inside the product** instead: the Reflect screen ends
with "1 of 40 planned missions. The Mission Builder lets students write their own."
That is one line on a screen the judge is already reading, rather than a slide they
have to be shown.

The same argument decided the five locked rooms in the left rail and the four locked
evidence slots. They say what they are and they do not pretend. An honest boundary
reads as a system with depth; a dead button reads as a bug.

### Why there is now a second mission, and why it is content rather than code

The entry above still stands, and this is not a reversal of it. Depth first, then
breadth — the second mission was written only once the first one was finished, and it
was allowed to exist on one condition: that building it required no engine.

It did not. **The Copy** is a JSON file and eleven lines of selection. `mission02.json`
carries its own posts, evidence, NOVA script, decisions, outcomes and reflection;
`content/mission.ts` resolves which file the screens import; every screen kept reading
"the mission" exactly as before. Nine components changed by exactly one line each — the
path in their import statement.

Two things had to move, and both were pre-existing faults the second mission exposed
rather than caused. The outcome figures and the badge names were literals inside the
reducer, duplicating numbers that `mission01.json` already carried, so mission 02 would
have ended on mission 01's Trust and handed out mission 01's badge. They live in the
content now. And the NOVA reply order turned out never to have been enforced at all,
which is its own entry below.

That is the useful part of this whole exercise, and it is worth saying plainly because
it is the claim the project makes about itself: **the engine is content-driven, and a
second mission is the proof.** Anyone can say their system is data-driven; the test is
whether the second instance costs code, and this one cost a selector.

The price is honest and small: the mission is resolved once at import, so switching
missions is a page load rather than a state change. The hub carries a `go` flag through
that reload so a player who has already booted is not made to boot again — and a bare
`?mission=02` link still plays the full power-on, because a demo URL should keep its
first three seconds.

### Why the exam rumour, of all stories

It is legible in any country without explanation, needs no video, contains every
mechanic we wanted to teach (social pressure, source tracing, date checking, a
confident AI, a real consequence), and — critically — it is **plausible**. The
strongest teaching moment is "I almost shared that", and that only happens if the
bait is good. A ridiculous rumour teaches nothing because nobody would have fallen
for it.

Everything is fictional. Fictional city, fictional school, fictional handles, no real
people, brands, parties or news events. `The Northgate Onion` is a parody of a satire
brand *inside a satire post whose own bio says it is not a real news source* — the
joke is the point and it is self-labelling.

---

## The rules

### Why there is a colour law at all

Every colour in this build means one thing, and a judge should be able to work out
what from 30 seconds of looking. Cyan is verified. Red is unverified or spreading.
Violet is the AI. Amber is uncertainty. Blue is depth and never touches text.

The law exists because this is a game about reading signals correctly. If our own
signals are decorative, we are teaching the opposite of the lesson in the medium
itself. Anything coloured for mood undermines the argument.

### Why cyan carries exactly two meanings

Cyan is the one exception, and it took an audit to notice. It means **verified
evidence** and it means **you are here** — panel numbers, corner ticks, the phase
indicator, the active room.

The first read was that this was dilution and four separate bugs. It isn't. Both
meanings are coherent, and they are safe because of where they live: **position
markers are always in the chrome, evidence is always in the content, and the two never
share a surface.** A player is never asked to disambiguate a cyan mark.

What *was* a bug: "See what happened next" and "Play the other path" were cyan.
Navigation is neither evidence nor position. They are neutral now.

Named exception: the `:` in the wordmark. Brand mark, on a screen with no evidence and
no position marker to confuse it with.

### Why a completed world on the map is not cyan

The city map has three states to show — open, finished, and not in this build — and
finishing a mission is the one that most wants to be cyan. It is an achievement, cyan is
the achievement-shaped colour in this palette, and the Reflect screen already ticks its
lessons in it.

It is not cyan, and the reason is the entry above. Cyan's two meanings are safe **only
because they never share a surface**: position lives in the chrome, evidence lives in the
content. The hub is chrome. Putting completion there in cyan would put a third meaning on
the same surface as "you are here" — same screen, same kind of card, three inches apart.
That is the exact moment a player has to stop and work out which cyan they are looking
at, and the entire argument for allowing two meanings is that they never have to.

So "you are here" keeps the cyan, because a position marker in the chrome is precisely
meaning two. Completion reads structurally instead: the card keeps its fill, its pin on
the thread fills in solid rather than hollow, and it names in words the badge it gave you.
A judge still learns which worlds are finished at a glance, and the colour law did not
have to be widened to manage it.

### Why "not yet" is dashed and "not in this build" is hatched

Two different kinds of unavailable now exist, and they had to stop looking alike.

**Hatched** means the thing is not in this repository: the four locked evidence slots, the
four dark rooms in the rail, the three locked locations on the map. Diagonal hatching was
chosen for those because a dashed outline at 60% opacity is the universal visual language
of a skeleton loader, and "still arriving" is exactly the wrong promise to make.

**Dashed** means the thing is built and available and simply has not happened yet: NOVA's
cross-check before you have asked her for a source, and a skill on the profile you have
not earned. Both are one player action away. Hatching them would claim the feature is
missing, which is a lie in the other direction — and it would tell a player not to bother
reaching for something entirely reachable.

The two never share a surface either, which is what makes the distinction learnable rather
than a legend nobody reads: the map and the evidence board hatch, the NOVA panel and the
profile dash.

### Why NOVA is violet but her text is not

`--nova` `#7C3AED` is a dark violet and it is the only colour in the palette that
cannot carry small text — measured at **3.23:1** against a feed post, under the 4.5:1
floor. Cyan manages 10.18:1 and amber 9.59:1 on the same surface. Violet fails because
it is dark, not because it is violet.

So the signal splits by role, not by meaning: `--nova` for structure (borders, bar
fills, the panel edge, the glow) and `--nova-ink` `#A78BFA` for any violet text
(**6.76:1**). This is not a fifth semantic colour. It is the same signal at a legible
weight, and a player cannot tell them apart as signals — only as weights.

Written down early because the NOVA panel, the confidence bar, its readout and its
four reply buttons are all violet, and the argument would otherwise have been had four
more times.

### Why --ink-faint was retired from content

`--ink-faint` was defined as "disabled, placeholders" and reached for six separate
times for things that were none of those: the `SPONSORED` disclosure, the UNESCO line
on Boot, the `SKILL:` prefix, evidence slot numbers, the correction effort label, the
satire account's bio note.

Every one measured between 2.5:1 and 2.8:1. Every one was load-bearing.

The pattern took six instances to see: it was being reached for whenever text was
**small, mono and secondary** — and in this build small mono text is usually the *most*
important text on the screen, because that is where metadata, provenance and teaching
live. The token's definition did not match its gravitational pull.

The worst of them is worth naming. In a game about spotting paid content, the word
`SPONSORED` was the least readable text on the post. That is close to self-parody.

The rule now: **if it can be read, it is content, and content takes `--ink-mute`.**
`--ink-faint` survives in exactly one place — placeholder text inside an empty input,
where the text is meant to disappear the moment you type.

### Why the motion budget is three animations

The Verification Lens, the Cascade, and counter ticks. Everything else is opacity plus
an 8px translate, or nothing.

A build where everything moves has nothing to say when something matters. Spending the
entire budget on three moments means those three moments land. It also made three
later decisions for us without another argument: evidence cards reveal rather than
flip, the NOVA panel arrives on 8px rather than sliding the full width, and nothing
loops ambiently anywhere.

`PROTOTYPE_SPEC` says the cards "flip" and `ART_DIRECTION` says NOVA is a "slide-over".
The constitution outranks the screen sketch in both cases.

---

## The mechanics

### Why uncertainty is a first-class choice

"I still don't know" is available from the moment you enter Investigate — not
unlocked after failing to find everything — and it is the same size, weight and shape
as "I have enough to decide". It routes to DECIDE with a flag, and nothing in the
reducer punishes it.

Most quiz-shaped software treats "I don't know" as the absence of an answer. In media
literacy it *is* an answer, and often the correct one. A game that made uncertainty
the loser's exit would teach players to guess confidently, which is the exact
behaviour that spreads rumours.

When a player arrives at DECIDE this way, the screen says so: *"You said you still
don't know. That is an honest place to stand, and it is still a decision."*
Acknowledged, not corrected.

### Why NOVA is deliberately fallible

NOVA is fluent, confident, cites nothing, and is wrong.

Ask her for a source and she drops from **62% to 34%** and admits she is summarising
what is being shared rather than what is confirmed. Cross-check her and she finds the
2023 notice herself, goes to **88%**, and says outright: *"I was wrong — I should have
flagged that I had no primary source."*

Useful and wrong in the same conversation. That is the entire AI-literacy argument,
and it only lands if **both halves happen on screen**. An AI that is simply wrong
teaches distrust; an AI that is simply right teaches dependence. The line under the
panel — *"NOVA can help. NOVA can be wrong. Think — don't just trust."* — is
permanent and pinned outside the scroll area so it cannot leave the screen.

Her conversation lives in the reducer, not the panel. It used to be component state,
which meant closing the panel destroyed it: a player who pushed her until she admitted
she could not verify anything reopened to find her confidently asserting the claim
again at 62%. That erased the character. Her memory belongs with the evidence she
grants.

### Why her replies are now gated, and why the guard is in the reducer

Her three beats only teach anything in order. Confident with no source, caught unable to
name one, then correcting herself — that sequence is the argument. Any other order is a
different character.

The four reply buttons were pressable in any order from the day they were built, and
nobody noticed for the length of the whole first build. Press cross-check first and the
transcript ended: *"I was wrong — I should have flagged that I had no primary source"* at
88%, followed by *"I can't verify the original source"* at 34%. She resolved a doubt
nobody had raised, then failed to answer it afterwards, at lower confidence. The arc ran
backwards and the mission taught nothing. Mission 02 inherited the same fault the day it
was written, because it inherited the same four replies.

Cross-check now declares `"requires": "ask-source"` in the mission file. That is content,
not code: the order of her beats is part of her script, and the next mission's author sets
it the same way they set what she says.

**The guard is in the reducer, not the button.** A disabled control is a presentation
detail — it is one keyboard event, one stale render or one future component away from
being bypassed, and the button is not where the rule lives. `NOVA_REPLY` refuses a reply
whose prerequisite is unused, so the order is true even if nothing on screen enforces it.
The button state exists to explain the rule, not to be the rule.

It is also `aria-disabled` rather than `disabled`. A genuinely disabled button leaves the
tab order, so a screen-reader user would meet a reply that had silently vanished and never
learn why — which is the same dishonesty the locked rooms and the locked evidence slots
were designed to avoid. It stays focusable, announces itself as unavailable, and carries
the reason: *"She cannot admit she was wrong about a question nobody has asked her."*
That sentence is the teaching point, so it is on the screen and in the accessibility tree
rather than in a tooltip.

### Why there is no timer

There is no countdown anywhere, and the DECIDE screen says so out loud: *"Nothing here
is counting down. Take as long as you want."*

Pressure in this mission comes from the replies piling up — *"bro everyone is saying
it's cancelled, just share it"* — not from a clock. A timer teaches panic, which is
precisely the state in which people share things they have not read. It would be
teaching the disease as the cure.

The statement is on screen because a player trained by other games will be waiting for
a timer, and waiting for one is itself a kind of pressure.

### Why choosing Wait actually costs something

Wait is not a dead option. Two friend replies arrive, Reach rises by 3 on its own, and
a line in amber says *"Not deciding is also a decision. The pressure grows while you
wait."*

If waiting were free it would be the obviously correct move and the mission would have
no tension. Modelling the cost of inaction is truer and makes the choice real.

### Why the Decide screen has no semantic colour

The three options originally carried their outcome colours — red on Share it, amber on
Hold and verify, cyan on Post a correction. This was wrong and it was ours twice over:
we caught it in the effort meter and kept that neutral for exactly this reason, then
undid it on the borders and the labels.

Colouring the options **marks the answer before the player chooses.** After six screens
of a consistent palette, the cyan option is unmistakably "the right one". That turns a
decision into a quiz with the answer highlighted, and the entire design of the screen
is that you weigh what each option costs and decide.

Differentiation lives where it cannot leak the answer: the effort meter, the size of
the row, and how much detail each option has to carry. The colours return on OUTCOME,
where they explain what happened rather than instruct what to pick.

### Why "Post a correction" is visibly the most work

It is the tallest row, it carries an effort meter at 3 of 3, and it is the only option
that lists what it will cost you — including *"Admit the part you still cannot
confirm"*.

It is also the option that pays best, which the player does not learn until the next
screen. **That gap is the lesson.** The right thing looks like more work at the moment
of choosing, and it is; the payoff is only visible afterwards. If we had shown the
payoff on the same screen, the choice would have been arithmetic.

### Why the outcome never shames

Trust 21%, Reach 96%, and not one word telling the player they failed. No cross, no
"Wrong", no red X. The screen reports what happened and lets three students say what
it did to them — one skipped studying, one told their parents, one asks who started it.

A player who feels told off stops playing and stops listening. A player who sees what
happened to other people corrects themselves. The whole design goal is to make
correcting yourself feel possible rather than humiliating, which is also why "Post a
correction" is the highest-scoring path in the game.

---

## The craft

### Why the Cascade telescopes

Six copies of the shared post fall down the feed 60ms apart, each further off true and
redder than the last. First version spread them down the column at full size: **1,610px
across 2.2 viewports, with 2.8 copies visible at once** and the consequence panel
1,008px below the fold.

A cascade you have to scroll through is a list. The horror of it is repetition, and
repetition is only visible if you can see the repeats at the same time. They now
telescope into a fixed 300px well — smaller, further back and progressively out of
focus with depth — so **all six are in one eyeful** and the consequence sits right
underneath.

The blur is capped at 5px. Past that it stops reading as distance and starts reading
as a broken render. We also had to give the first copy a much larger reveal than the
rest: at 40px the second copy's header landed exactly on the first copy's body line,
two sharp runs of the same sentence at the same height, which looked like a
compositing fault rather than depth.

### Why the city map is the evidence board again, and not its own picture

Signal City could have been anything — a skyline with hotspots, an isometric block of
streets, a row of mission cards. It is the evidence board: same near-void surface, same
cards pinned at two degrees off true, same threads measured from the laid-out elements
rather than drawn to a guess, same pins.

The reuse is the argument, not a saving. A mission is a claim taken apart on a board; the
city is the set of claims. They are the same activity one level apart, and giving the hub
its own visual language would have said they were unrelated — that investigating is a
thing you do *inside* a level, rather than the thing the whole game is. The player learns
the corkboard on the first mission and then recognises it as the shape of the entire
product.

It also kept the map honest about what it is. A skyline with glowing hotspots is a menu
pretending to be a place, and it would have been the first decorative surface in the
build. A board with five documents pinned to it can carry an unfinished world truthfully:
the three that are not built are hatched exactly as the locked evidence slots are, and
nobody has to invent a new way to say "not yet".

The threads are measured, not positioned, for the same reason they are on the board: at
390px the map collapses to one column and the threads have to still land on their pins. A
thread that misses is worse than no thread.

### Why a panel's number is only ever real

The panel mark is `01` through `06` and it means position in the core loop. When the three
rooms outside the loop arrived they were given `00`, `07` and `08`, and all three were
wrong in the same way: they were invented.

`00` is the worst of them, and it was the first panel a judge saw. A zero at the head of a
sequence that starts at 01 does not read as "before the loop" — it reads as an off-by-one
that shipped. And `07` / `08` claim an eight-step sequence directly underneath a phase
indicator that shows six, so the screen contradicts itself in two places a centimetre
apart.

The rule now: **a panel's mark is only ever a real identifier.** A position in the loop, or
a code that exists in the fiction. The hub takes `SC`, which is not decoration — every
location pinned to the board under it is `SC-01` to `SC-05`, so the mark is the city's own
prefix and the header reads as the same object as the cards. Your record and the teacher
view have no such code, so they render no mark at all and the title starts the header.

Nothing was invented to fill the gap, which is the whole point: `YR` and `TV` were on the
table and both are decoration wearing a code's clothes. An absent mark says "not a step"
without claiming anything, and `Panel` drops the element rather than rendering an empty one
so the title does not sit a gap further right than every other panel.

### Why the player has an account, and why the outcome is a thread

The feedback was that the game read as a dashboard and the fix requested was a themed
reskin. The theme was not the problem. **The player had no presence in their own feed.**

Nine accounts posted, NOVA spoke, comments arrived, and the player was a percentage in a
sidebar. Every screen described what they had done rather than showing it: "Your choice:
Post a correction" over a list of handles reacting to an event that never appeared. That is
the definition of a dashboard — it reports on you — and no amount of atmosphere fixes it,
because the missing thing is not mood, it is a body in the fiction.

So the player is an account like any other. A handle, a display name, initials, a round
avatar because they are a person, merged into the same lookup every other account uses so
the same rules apply — including the one that says avatar shape carries no signal about
whether what they posted is true. It lives in the mission file rather than being derived,
so a later mission can hand the player a different identity and so it can eventually be
chosen.

Three things followed, and each one was cheaper than a reskin:

- **Every outcome carries a post**, written in the player's voice and specific to what that
  path established. The correction in The Copy names the meeting, the recording, the
  timestamp and the sentence that was cut — the same specifics the evidence board gave
  them, in their own words rather than a summary of their words.
- **The Cascade spreads the player's repost.** It used to duplicate ClipWatch's post, which
  put somebody else's name on all six copies at the exact moment the game is arguing that
  the consequence is yours. The artefact rides along with it, because that is what sharing
  does.
- **The taken branch is a thread.** Their post, rendered by the same `FeedPost` everything
  else uses, with the replies indented underneath carrying the same initials avatars.

No new colours, no new type, no new components, and every surface it touches was already
contrast-tested. The counterfactual column keeps the plain receded list: rendering a second
full post for a run that did not happen would double the height of the screen to show
something the player never did.

The general lesson, which is worth more than the fix: **when a product is described as
lacking atmosphere, check first whether the user is in it.** A themed skin over a screen
that still reports at you is a more expensive version of the same problem.

### Why there is an overview page at all, and what it is allowed to be

`CLAUDE.md` §2 banned the landing page in the plainest terms it bans anything, and the ban
was right. It was also aimed at something more specific than a URL: a page that **stands
between** a judge and the product, assembled from stock hero furniture, describing the
thing instead of being it.

The page inverts that. It is assembled entirely from components the game runs: the real
target post, the real phase indicator, a real evidence card, the real confidence bar, the
real Cascade. Sections that wanted a diagram were cut rather than drawn.

**Where it lives, and what its hero is, both changed twice.** It began at `/about` with the
game on the root; the root serves the page now and the game is at `/play`, because the
first thing a visitor meets should be the page. And its hero began as the real `Boot`
component, on the argument that Boot IS the product - which was true and still wrong: Boot
is a centred wordmark over a tagline over a button, structurally the exact hero §2 bans.
The hero is the feed now, with the claim landing in it, because the feed is the product's
most interesting screen and it is the only one that can carry an accusation about the
reader.

**And it is four sections, not eight.** The claim landing in a feed, the problem, one
demonstration of checking it, the way in. The city, the design decisions and the schools
material were cut to the proposal document: they answer questions a judge has AFTER
playing, and they were a third of a 9,167px page for a two-minute game.

The test that governs it is stricter than the ban was: **the page is not a description of
RE:AL, it is a small demonstration of what RE:AL teaches.** A reader should scroll it and
come away having felt the difference between reading a claim and checking one - which is
why it opens on their own position - "You've already decided", with the post it is
accusing them about directly beside it - rather than on a feature, and why the section
about checking makes you look at an evidence card and a confidence bar dropping from 62%
to 34% rather than telling you they exist.

**Type does the work, using the product's own split.** Feed-world is proportional,
evidence-world is monospace, and the page obeys the same rule: narrative in Inter Tight,
every fact, measurement, source and caption in IBM Plex Mono. The design-decisions section
then says so in a paragraph the reader is already inside - the split is demonstrated before
it is explained. Type is also **bolder** here than anywhere in the game, deliberately: the
feed is restrained because a feed must feel ordinary, and that reasoning does not transfer
to a page whose only job is to be read. Restraint at the wrong scale reads as timid.

Rhythm was treated as a rule rather than a preference. Sections change measure (820 →
1100), alignment (the "what you actually do" statement enters from the right, the only
one that does) and entry point, and that section breaks the column outright with a wider
field and captions hanging off the side. Six sections of the same shape stacked is the
other way a page reads as generated.

The motion budget stays separate from the game's three and is spent on exactly three
things: the loop advancing as you scroll it, one-shot staggered entrances, and the Cascade
once on arrival. A share counter climbing was the obvious alternative to the Cascade and
was rejected - the rule says no counter ticks unless the number means something, and an
invented number on an overview page means nothing.

### Why the page's motion is CSS on a scroll timeline, not JavaScript

The first version of the overview page revealed its sections with an `IntersectionObserver`
and a one-shot flag. It worked, it was cheap, and it was wrong in two ways that took using
the page to see.

**It was dead on the way back up.** A one-shot reveal only plays forwards, so scrolling back
through a page you have already read animates nothing. That is not a bug in the
implementation - it is what one-shot means - and it makes a long page feel like something
that has already been used.

**And it could lose content.** An element that crossed the viewport inside a single frame
never intersected, never fired, and stayed at `opacity: 0`. Not unanimated: absent. It
needed a debounced scroll listener purely as a safety net.

`animation-timeline: view()` fixes both by construction. The animation is a function of
where the element sits in the viewport, so it runs backwards without being asked; it runs
on the compositor rather than the main thread; and with `animation-fill-mode: both` an
element past the viewport is at its end state by definition. **The class of bug that nearly
shipped stops being possible**, and the observer, the one-shot flag and the safety net are
all deleted.

Three things had to be learned to make it hold:

- **Stagger is range, not delay.** There is no time axis on a scroll timeline, so leading
  the eye down a group means starting each element a few percent further into its own
  `entry` rather than adding milliseconds.
- **Both ends of a range belong in `entry`.** Ranges that finish in `cover` need the element
  to travel a full viewport, and the last screenful of a page has nowhere left to scroll -
  three blocks sat permanently part-faded at the foot of the page until the ranges were
  changed to complete during entry.
- **An `overflow: hidden` box is a scroll container.** The Cascade's copies live inside one,
  so an anonymous `view()` on a copy resolved against that 350px box and held a fixed
  progress at every scroll position - which looked exactly like an animation that had
  already finished. A named `view-timeline-name` on the wrapper outside the clipped box
  points them back at the document.

What the page gained beyond the fix is the reason the brief asked for it: the motion now
explains rather than decorates. The evidence card reveals as the reader scrolls into it, so
they perform the check rather than reading that one exists. NOVA's confidence falls from 62
to 34 as that section passes - one registered custom property drives both the readout and
the bar, so the number and the bar cannot disagree, and neither touches a layout property.
The claim lands in the hero feed as the page begins to move, and spreads under the reader's
own scroll in the Cascade. Each is the product's own component doing the thing it does in
the game, driven by the reader instead of a timer. (The city threads drawing themselves was
part of this too, until the city section moved to the proposal.)

Frame timing improved rather than degraded: a full scroll at 390px went from one frame over
32ms to **none**, worst frame 16.4ms.

### Why the play button is a picture of a control, not a control

Mission 02 is about a video and its post showed a photograph. The still, the caption and
the alt text were all honest and it still had no bait in it: mission 01's blurry notice
works because the artefact matches the claim, and here a reader saw a building.

So video posts now carry a play glyph, a duration badge and a scrubber sitting at zero,
painted over the same 92px band every other image uses. Nothing plays. There is no video
file in this build and there will not be one — §1 rules them out on load time — so the
marks describe the artefact rather than offering a feature.

That runs straight at the rule the locked rooms are built on: **no control that looks live
and does nothing.** The resolution is that these are not controls. They are `aria-hidden`,
they are not buttons, they carry `pointer-events: none`, and the post's own stretched
button sits underneath them — so a player who clicks the play triangle opens the post's
actions, which is the thing the mission actually wants them to do. Nothing is announced to
a screen reader as pressable, and nothing on screen can be pressed to no effect. A dead
button is a lie about what the software does; a drawing of a player is a description of
what the *post* is.

The line to hold if a future mission wants more: the moment one of these marks becomes
focusable or claims to control playback, it has to actually play something.

### Why the video marks carry no semantic colour

Every platform paints a red scrubber. We paint `--ink-mute` on a black scrim, and the play
glyph and duration badge are neutral for the same reason.

Red means **unverified or spreading** in this build. A red scrubber would put that mark on
every video post ever added — including, eventually, a video that is fine — and it would
sit two centimetres from the `BREAKING` chip, which is red because the claim is unsourced.
A player would have no way to tell which red was speaking. Cyan is worse: it would read as
verified footage on the exact post whose whole lesson is that genuine footage proves
nothing.

Platform chrome is not a signal in this game's vocabulary, so it gets no colour from the
vocabulary. It is drawn in the neutral inks and it stays legible on any frame because of
the scrim, not because of a hue.

### Why Wait now only counts once

`WAIT` set `state.waited` from the first version and the reducer never read it, so the
action was idempotent in appearance only: every press added `reachDelta` again. Ten presses
took Reach to **100%** before the player had decided anything, and then sharing set Reach to
its outcome figure — so the number went *down* as the post spread, on the screen where the
Cascade is arguing that it spreads.

That is the one meter the entire consequence argument rests on, inverted, at the exact
moment it matters. The guard is one line, and the flag it reads was already there.

Time passing is a single event in this mission, not a resource to farm. If a later mission
wants waiting to be repeatable, it should model it as several distinct events with their
own copy, not as the same event applied N times.

### Why the two read-only rooms each got exactly one verb

Your record and the teacher view were posters. Five skills that described themselves and
five figures that sat there — and they are two of the five live rooms, so a judge who opens
them before playing forms the dashboard impression from screens that have nothing to do in
them. That is the same complaint as the entry above, arriving from a different direction.

One interaction each, chosen to be the thing the room is actually for rather than the
thing that would be easiest to add:

- **An unearned skill names the mission that teaches it and goes there.** The record stops
  being a report on the player and becomes a way back into the game, which is what a skill
  tree is for. Neutral treatment — it is navigation, so it takes no semantic colour.
- **A figure in the teacher view opens to what would be assigned about it.** Not a tooltip
  and not a chart: the value of class-level analytics is not the number, it is what you
  teach next because of it, and every plan names a mission that exists in this build. The
  most useful one is attached to the highest figure — visual verification at 84% is the
  most dangerous number on the screen, because a class confident in its eyes stops checking
  provenance, which is exactly what The Copy exists to break.

Both are real disclosures rather than hover states: keyboard operable, `aria-expanded`,
and they work on a phone. Neither adds a colour, a font or an untested surface.

### Why the teacher view's bars carry no colour

Five metrics, and the weakest of them — uncertainty handling at 43% — asked loudly to be
amber. Amber means uncertainty. It sat right there.

It would have been the colour law borrowed for mood, which is the one thing §3 forbids
outright. Amber does not mean "uncertainty as a subject"; it means **the player chose to
sit in uncertainty** — the Wait replies, the "I still don't know" route. A class's score
on a competency called uncertainty handling is not that, and colouring it amber would
teach a judge that the palette responds to keywords rather than to states.

The other candidate was worse: cyan for the strong scores and red for the weak ones, which
is a performance rating in a product whose entire position is that its outcome screen
never shames anyone. If the teacher view marked a class red, the game would be doing to a
class exactly what it refuses to do to a player.

So the bars are `--ink-mute` on `--line` and the numbers do the work, ranked, with one
line underneath saying what a teacher would actually do about the lowest one. The screen
has no semantic colour on it anywhere, and that is the correct amount for a screen that
reports rather than signals.

### Why the sponsored image is exempt from the duotone

Every photograph is pulled toward `--deep` so seven separately generated images read
as one world. `energy-can.jpg` is not, and it is the only exemption.

Advertising does not adopt the visual language of the room it appears in. It is
produced elsewhere, to a different brief, and it looks it. A player scrolling the feed
should feel that one post is louder and glossier than its neighbours **before** they
consciously register the `SPONSORED` label. That felt difference is the teaching
moment: paid content announces itself visually if you are looking, and the label
confirms what you already sensed.

Duotoning it would fold the ad into the world and destroy the contrast that does the
work. The exemption is carried in the content as `"duotone": false` so it is visible
where the decision lives, not buried in a component condition.

### Why the duotone is 0.12 and not 0.22

It started at 0.22 and the school was unreadable — a dark blue smear when the post's
whole meaning depends on recognising a school.

The fix is not brightness. `mix-blend-mode: color` replaces hue and saturation and
**preserves luminosity by definition**, so that alpha never controlled brightness at
all. At 0.22 it pushed every hue to the same blue, and the school's warm lit windows
stopped separating from its cold facade — and that warm/cool separation is the entire
cue that says "building at dusk". Halving it restores the separation without touching
a single luminance value.

### Why photographs of paper get a second treatment

Every mission will contain a photograph of a printed notice, and they all share a
defect the duotone cannot fix.

Measured across the four feed images, `notice-photo.jpg` had the **lowest peak
luminance of all four** and **2.8× the mean of the next brightest**. It is not a
highlight problem, it is a mass problem: the others are small bright points on dark
scenes, this is a whole sheet of lit paper. And `mix-blend-mode: color` preserves
luminosity, so the tint landed and the brightness sailed straight through.

The fix is a second overlay in `mix-blend-mode: luminosity`, which sets luminosity and
leaves colour alone — it pulls the paper down without flattening it. Reaching for a
heavier `brightness()` would have destroyed the creases and the focus falloff that
make the artefact believable as a phone photo, which is the one thing it has to be.

### Why every feed image is the same 92px band

No feed image renders at its natural aspect ratio.

The first reason is defensive: at full aspect a 16:9 photo is ~312px of image alone,
which would make an ordinary post tower over the target post and let the *picture*
decide which post dominates.

The second reason matters more. **A real feed does not show you seven photographs; it
shows you seven photographs in its own frame.** The crop, the aspect, the radius and
the treatment are the platform speaking, and they are identical for every post. Vary
the format per image and the feed stops looking like a product and starts looking like
a mood board — the same failure the duotone guards against, one level up. Consistency
of format does for composition what the duotone does for palette.

### Why avatar shape carries no truth signal

Avatars are initials in Archivo, and the shape follows the real platform convention:
**square-cornered for organisations, round for people.**

The convention is honest and it is deliberately uninformative about credibility. The
school and Viral SC are both organisations and one of them is lying; Ms. Fernandes and
Mei are both people and one is asking a question the other can answer. Shape tells you
what kind of account is speaking and nothing whatsoever about whether to believe it.

If that ever gets "improved" into a credibility marker it becomes the same mistake as
the platform verification tick below, and the feed starts doing the player's thinking.

Initials are set editorially rather than derived. Every derivation we tried collided —
*Signal City Updates* and *Signal City Transit* both reduce to "SC" — and two accounts
with the same face is worse than a lookup table.

The version before this hashed each handle into a rotated rectangle and a dot. It was
deterministic, unique per account, and useless: nine grey blobs that a judge reads as
"placeholder avatar" before reading anything else on the screen.

### Why the verification tick is grey and not cyan

A platform verification badge confirms **who** posted, not **whether the claim is
true**. Colouring it `--verified` would teach that a verified account means a verified
claim — the exact misconception this mission exists to break — and it would teach it in
the first two seconds, before the player has read a single post.

It is `--ink-mute`, at the same weight as the handle and timestamp beside it, with an
`aria-label` so the meaning never rests on colour alone. Cyan does not appear anywhere
in the feed layer, which is what gives it weight when it first appears on the evidence
board.

### Why the target post sits fourth and we stopped chasing the fold

It sits fourth so ordinary content comes first. It briefly sat third, and before that
we tried to push it far enough down that the `BREAKING` chip started below the fold.

That was the wrong fix. The fold moves with every device and viewport, and buying
those pixels means padding the feed with filler the player has to scroll past. The
real problem was never position — it was that the target post was **2.7× the height of
its neighbours** and the layout was visibly pointing at it.

Capping the attachment brought it to 1.6× and the problem went away. The rule is now a
height ratio, not a fold position: **a post that does not outweigh its neighbours does
not need to hide.**

### Why the atmosphere layer exists, and why "no glow" was too broad

The original rule banned decorative glow, and it was right — glow on every button is
slop. Applied to everything it also produced a flat page.

The distinction: **glow is a state, never a texture.** Light bleeding from behind a
panel is depth. Six things in this build glow and nothing else does — the active
panel's corner ticks, a focused input, the `BREAKING` chip, the NOVA panel edge while
she is speaking, a Trust/Reach bar while it changes, and the wordmark's chromatic
split.

The bleed opacities had to be raised from `0.28 / 0.16 / 0.10` to `0.45 / 0.26 / 0.18`
because the original values assumed the light landed on a flat page. It passes three
stacked alpha layers on the way to a feed post — bleed, then panel at 0.72, then post
at 0.62 — so barely a tenth arrived and the layer was technically present and visually
invisible. **Budget for the whole stack, not the topmost layer.**

### Why the palette is mirrored onto :root

The palette lives in `tailwind.config.js`, and `index.css` mirrors all thirteen tokens
onto `:root` using `theme()` so the values cannot drift.

Because a lot of this project's CSS is hand-written rather than utility classes — the
atmosphere layer, the panel chrome, the duotone, the Verification Lens — and
`var(--line)` in a hand-written rule **fails silently** if the property is not declared.
The property is dropped, the element inherits, and nothing errors. That is exactly how
a missing `text-nova-ink` went unnoticed until it was measured.

---

### Why there is no animation library

Framer Motion was in the mandated stack and was never imported once.

The three-animation budget is why. A Lens that is a `filter` transition, a Cascade that
is a staggered keyframe, and counter ticks that are a `requestAnimationFrame` loop over
a number are all plainly expressible in CSS. Shipping an animation library to run three
CSS animations would have added weight to a build judged partly on whether it loads on a
constrained connection.

It has been removed rather than left declared-and-unused, because a dependency nobody
imports is a claim about the project that is not true.

---

## Things that bit us

Recorded because they will bite again.

**Tailwind config changes need a dev server restart.** HMR does not re-read the config.
The failure is silent — the class simply does nothing and the element inherits
something plausible enough to ship — and a production build picks the change up
correctly, so a green `npm run build` is not evidence that the browser you are
measuring is telling you the truth. This cost us one wrong contrast measurement that
we nearly reported as fact.

**A desktop-only navigation rail turned the new hub into a one-way door at 390px — and we
then fixed it one destination at a time, which let it happen again.** This is the entry
worth reading twice, because the second half is the actual lesson.

The rail is `hidden lg:block` and always has been, on the reasoning — written down at the
time — that the phases it reaches are all reachable from the feed anyway. That was true
right up until the hub existed, and then it silently stopped being true: the city became
the entry point, the rail became the only way back to it, and on a phone the rail is not
there. A player could boot into Signal City, enter a mission, and never return.

Nothing catches this. Every automated check passed — no overflow at 390, nothing clipped,
every control keyboard-operable, contrast measured on real pixels — because each screen was
correct in isolation and the failure was in the graph between them. It only appeared when
someone asked "so how do you get back?" at a width where the answer was "you don't".

**Then we patched the destination instead of the rule.** Reflect got a *Back to Signal City*
button, the hub was reachable again, and the audit was declared clean. It was not: Your
record and the teacher view were still unreachable on a phone, for exactly the same reason,
and they stayed that way through a deploy. One instance was fixed; the rule that produced
it was untouched, so the next two rooms inherited the bug at birth.

The real fix was structural. The room list moved out of `LeftRail` into `shell/rooms.ts`,
and every navigation surface renders from it — the 72px rail at desktop width, a labelled
bottom bar below it. A room added later cannot be built without a route to it on a phone,
because both surfaces are generated from the same list. `Back to Signal City` stayed, since
the end of a run is a reasonable place to want the city, but it is no longer load-bearing.

Three lessons, in order of how much they cost:

- **A responsive rule written for one set of destinations does not stay correct when the
  destinations change.** `hidden lg:block` was a decision about which rooms existed, not
  about the rail.
- **New navigation needs a reachability check, not a layout check.** For every screen, at
  every breakpoint, name the route out.
- **When the same bug appears twice, stop fixing instances.** The second occurrence is the
  evidence that the fix belongs one level up — in this case in the data every navigation
  surface reads, not in a button on the screen that happened to be missing one.

**"Press any key to begin" is a promise you cannot keep on a page that scrolls.** Boot is
the hero of the overview page, unchanged, which was the right call - the product in the
hero rather than a picture of it. What came with it was Boot's window-level `keydown`
listener, and on a scrolling document that listener eats **Space, Page Down, the arrow keys
and Tab**: every key a keyboard user needs to read the page. The first key they pressed
threw them into the game. The pointer half of the same problem was caught by reasoning
about a touch scroll; the keyboard half was caught only because the verification run
navigated away mid-test and crashed.

The fix is that Boot takes an `activation` mode: the game keeps "any key, any pointer",
because there the whole window genuinely is the control and the prompt is describing it
accurately; the page binds nothing to the window and makes the prompt a real button. The
screen is pixel-identical either way. **A promise that is true on one surface can be a trap
on another** - reusing a component means re-reading its listeners, not just its markup.

The same reuse had a quieter version of the same fault. Boot's wordmark glitch fires every
six seconds, which is right on a screen that is the whole screen and wrong on a hero the
reader scrolled past three sections ago: a timer running for motion nobody can see, which
is the ambient-loop line the page's own motion budget draws. In page mode Boot now watches
itself with an observer and stops the glitch while it is off screen, resuming if the reader
scrolls back. The game creates no observer at all. **Motion that cannot be seen is not
free** - it is the same cost as motion that can, minus the reason for it.

**Every animation on the overview page was invisible for a day, and 301 passing checks
said otherwise.** The entrances were attached to real view timelines, the CSS shipped
intact, the browser supported it, reduced motion behaved - and a person scrolling saw
nothing. Measured on production with real wheel events: **opacity changed on 1 of 22 wheel
notches.**

The cause is one fact about `view()` that was never checked: **the `entry` range spans the
element's own height, not the viewport.** A 78px paragraph has a 78px entry phase, so a
range of `entry 9% → entry 59%` completes across **39px of scrolling** - less than one
notch. Worse, that was self-inflicted: both ends had been moved into `entry` earlier the
same night to stop footer elements stalling part-faded. A visible bug was traded for an
invisible one.

The fix is `cover` ranges - element height plus viewport, so 28% of it is ~260px - and
enough tail room after the last section that the final elements can still finish crossing.

The lesson is about testing, not CSS. **Every check asked "does it reach its end state?"
and a state test cannot see a duration bug.** There is now a suite that wheels through the
page with real input and asserts the scroll distance between an animation's first movement
and its finish, with a floor of 180px. It is the third time in one night that a scripted
input passed where a human input would have failed - the other two were `scrollTo` hiding
a jump-reveal bug and a synthetic keypress hiding a keyboard trap. **If the test drives the
page in a way no person would, it is measuring the mechanism rather than the experience.**

**Scroll-triggered entrances can eat content, and the failure is invisible in testing.**
The overview page fades its sections in on arrival, driven by `IntersectionObserver`, which
only computes intersections at frame boundaries. An element that travels from below the
viewport to above it inside a single frame never intersects, so its observer never fires -
and because the entrance starts at `opacity: 0`, "never fires" does not mean "arrives
unanimated", it means **the text is not there**.

That is not an exotic case. Pressing End, dragging the scrollbar, a browser's scroll-to-top,
or one hard flick on a phone all do it. Measured on this page: a single jump to the bottom
left **fifteen blocks permanently invisible**, including paragraphs then sitting well above
the reader. Every other check passed while this was true - contrast, keyboard, reduced
motion, layout at four widths - because they all scrolled the page politely.

The fix is a shared, passive, trailing-debounced scroll listener that sweeps anything
already past the fold and reveals it, attached only while something is still pending and
removed the moment the last block appears. Two lessons: **an animation that gates content
on an event can lose the content**, so the resting state of any entrance must be the
readable one or there must be a net under it; and **test the rude gesture, not the polite
one** - a smooth programmatic scroll is the one input that would never have found this.

**The image optimisation settings were never written down, so the second batch of art had
nothing to match.** Four assets arrived as 1.5–2.2MB PNGs and the instruction was to
process them "the same way as the originals" — which turned out to be recorded nowhere.

They were recoverable by measurement rather than memory: the four originals sit between
**0.039 and 0.111 bytes per pixel** at 1200px wide, so the new files were encoded until
each landed beside its closest analogue — the meeting frame next to `school-dusk`, the
agenda next to `notice-photo`, the app ad next to `energy-can`. That put them at mozjpeg
**quality 86**, `resize({ width: 1200 })`, which is now written here so the third batch
does not have to be reverse-engineered again:

```js
sharp(src).resize({ width: 1200 }).jpeg({ quality: 86, mozjpeg: true })
```

Result: 7.7MB of PNG became **354KB of JPEG**, a 95.5% reduction, with every file inside
the band the existing art already occupied.

**Measure contrast against the composited surface, not the token.** Posts are
translucent over a translucent panel over a light bleed. Measuring `--ink-mute` against
`--surface` in isolation gives flattering numbers that do not describe anything a
player sees.

**A catch-all SPA rewrite hides missing assets.** `vercel.json` rewrites everything to
`/`, so a mistyped image path returns **200 with an HTML body** instead of 404. Status
codes cannot verify assets on this deployment — check the payload. All seven art files
were confirmed by reading their bytes, not their status.

**Fonts were the largest thing on the page and nobody guessed it.** ~161KB across three
families, more than the JavaScript bundle.

**And then we made them worse while trying to fix them.** The reasoning looked sound:
Archivo was requested with a `wdth` axis it did not need, Inter Tight carried a weight
600 that nothing in the build used, so removing both should save around 70KB. Measured
against production afterwards, the payload had gone **up** — from ~161KB to 185KB, a 24KB
regression.

The mechanism is the part worth remembering. Google Fonts serves a **variable font** when
you ask for an axis and **separate static files per weight** when you ask for named
weights. Dropping `wdth` did shrink Archivo from 88KB to two 34KB cuts. But splitting
Inter Tight from one 43.8KB variable file into two 44KB statics added 44KB and swamped
the saving, and IBM Plex Mono went from 14.4KB to 29KB the same way. Removing an unused
weight from a variable range saves nothing at all, because the range was one file.

Reverted. The two lessons:

- **Specifying weights on a variable font can increase payload.** Fewer weights is not
  automatically fewer bytes.
- **Font payload has to be measured against production, not reasoned about.** A 70KB
  saving was estimated with confidence and turned out to be a 24KB loss, and nothing about
  the local build would have revealed it — the bundle hashes were identical either way.

This one is worth keeping in view because it is exactly the failure the whole project is
about: a claim that sounded right, from a source that felt authoritative, passed on
without checking. We shipped it before we measured it.
