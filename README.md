# RE:AL

Everything online looks real. This is a game about learning to look again.

You are handed a feed, a claim that sounds plausible, and no time to think. In one mission
a notice is going round saying tomorrow's exams are cancelled and forty-seven thousand
people have already shared it. In the other, a clip of a school principal saying something
ugly turns out to be real footage — filmed at a different meeting a year earlier, cut so
the sentence before it is missing. What you do in the next two minutes is the whole game.

Built for the UNESCO Youth Hackathon 2026 — *Play Your Part: Youth Designing the Future
of Media and Information Literacy*.

**Play it: https://real-mil.vercel.app/play** — or start at
**https://real-mil.vercel.app**, which is a page about the game assembled out of the game's
own running components: it opens on a real feed with the rumour landing in it.

## Two minutes

The game opens on Signal City: a board with five places pinned to it, two of them open
tonight.

1. Press any key. The city appears.
2. Enter **The Exam Rumour**.
3. Scroll the feed. It is ordinary — library hours, a bus delay, someone complaining about
   mock exams. That is the point.
4. Open the post with the BREAKING chip and share it straight away, without checking.
   Watch what happens.
5. On the reflection screen, choose **Play the other path**.
6. This time investigate. The notice is real — and two years old. Ask NOVA for her source,
   then cross-check her and watch her change her mind.
7. Post a correction instead of sharing. Compare the two endings. Trust 21% against 96%.

The second run is the one worth watching. The first is the one most people play.

## Two more minutes, if you have them

Take **Back to Signal City** from the reflection screen and enter **The Copy**.

This one cannot be solved by looking. The clip is genuine — the lighting is consistent,
the lip sync holds, there is nothing to spot — and NOVA will tell you so, confidently and
correctly, which is exactly why it does not help. What settles it is somewhere else
entirely: who uploaded it first, whether a full-length version exists, and whether anyone
who would have to stand behind the story has reported it. The district publishes its
meetings in full. The clip is at 41:06, and the principal is reading a parent's letter
aloud.

Then open **Your record** in the left rail. Five skills, shown whether you earned them or
not, so you can see the shape of the whole game from the two missions that exist. What is
ticked there came from what you actually did — the path you took, the evidence you found,
whether you ever asked NOVA where she got that.

## What is built, and what is not

**Two missions are playable end to end**, each with three endings and a replay that keeps
what you earned. Boot, the city, the feed, the Verification Lens, an evidence board, NOVA,
the decision, the consequence, and a reflection screen with a text box that saves nowhere.

**Three of the five worlds are designed, not built.** The Wire, The Operator and The
Outbreak are on the map with the one thing each of them teaches, hatched and labelled
*Unlocks in the full build*. Four of the seven evidence slots in each mission are the same,
and so are four of the rooms in the left rail.

**The teacher view is a concept preview and says so on the screen it is on.** Five class
competencies with example figures, one line on what a teacher would do with the lowest of
them, and a statement of what a teacher would and would not see: patterns across a class,
never an individual student's private decisions. There is no backend for it to talk to and
it does not pretend there is.

You can see all of that inside the product rather than being told it here. None of the
locked things are dead buttons that pretend to work — they are hatched, named, and they
say what they are. We would rather show you the edge of what we built than hide it: a
stated boundary is more useful than a convincing façade, and it is the honest description
of a hackathon build.

No backend, no accounts, no analytics. The only thing stored anywhere is which missions
you finished, in `sessionStorage`, so the map can show them as done. It goes when the tab
does.

## Run it

```bash
npm install
npm run dev
```

`/play` is the game and `/play?mission=02` opens The Copy directly, which is useful for a
demo link. The root serves the overview page.

## Why it is built this way

**The second mission is content, not code.** *The Copy* is a JSON file — its own posts,
evidence, NOVA script, decisions, outcomes and reflection — plus eleven lines that decide
which file the screens read. No component changed except the path in its import statement.
That is the claim this project makes about its engine, and the second mission is the only
proof of it worth anything: saying a system is content-driven is free, and the test is
whether the second instance costs code.

**Every colour means one thing.** Cyan is verified evidence, red is unverified or
spreading, violet is the AI, amber is uncertainty. A player should be able to work the
system out in thirty seconds without being told. We treated this as a hard constraint
rather than a style guide: a game about reading signals correctly cannot have decorative
signals of its own, or it teaches the opposite of its lesson in the medium itself. It is
also why a finished world on the map is not marked in cyan, however much it wanted to be.

**Uncertainty is a first-class choice.** *I still don't know* is available from the moment
you start investigating — not unlocked after failing to find everything — at the same size
and weight as its confident counterpart, and nothing in the game punishes it. Most
quiz-shaped software treats not knowing as the absence of an answer. In media literacy it
is an answer, and often the correct one.

**NOVA is deliberately fallible.** Ask the built-in AI about the rumour and she answers
fluently, confidently, and cites nothing. Push her for a source and her confidence drops
from 62% to 34%. Cross-check her and she finds the 2023 date herself, revises to 88%, and
says outright that she was wrong. Useful and wrong in the same conversation — an AI that
is simply wrong teaches distrust, and one that is simply right teaches dependence. Her
questions can only be asked in that order, because a machine that admits it was wrong
before anyone has doubted it is a different character entirely.

**There is no timer.** Nothing counts down, and the decision screen says so out loud. The
pressure in these missions comes from friends replying *just share it* while you hesitate,
not from a clock. A countdown teaches panic, which is the exact state in which people
share things they have not read.

`DECISIONS.md` has the rest — why the city map is the evidence board again rather than a
skyline, why the sponsored post is the only image exempt from the colour treatment, why
avatar shape deliberately tells you nothing about credibility, and the things that went
wrong badly enough to be worth writing down.

## Accessibility

Every interactive element is reachable and operable by keyboard with a visible focus ring;
the NOVA panel traps focus while open and Escape closes it. A control that is unavailable
says why: NOVA's cross-check before you have asked her for a source stays in the tab
order, announces itself as disabled, and carries its reason into the accessibility tree
rather than only dimming.

We measured every text element in the build at or above 4.5:1 against its **real
composited background** — posts are translucent over a translucent panel over a light
gradient, so measuring against the raw colour token gives flattering numbers that describe
nothing a player sees. The measurement is taken by hiding the text, photographing the
pixels it occupied and comparing them to its own computed colour. Colour is never the only
carrier of meaning: every signal has a text label beside it. Trust, Reach and evidence
changes are announced through live regions carrying settled values rather than every frame
of a counter animation. All motion respects `prefers-reduced-motion`, and there is not
much of it to respect — three animations in the entire build.

There is no video. A cold load through to the feed transfers about 800KB, most of it
photographs and fonts; the JavaScript is 71KB gzipped. That matters because the people
this is for do not all have good connections.

## Content

Signal City, Northgate Secondary, Eastbank Secondary and every account in both feeds are
fictional — including the principal in *The Copy*, the clip account that reposted her and
the local paper that refused to run the story. No real people, brands, organisations,
political parties or news events appear anywhere in the game, and none of the posts
reproduce a real claim.
