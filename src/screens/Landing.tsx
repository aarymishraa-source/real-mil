import { useEffect, useRef, useState } from "react";
import strings from "../content/strings.json";
import { missions } from "../content/mission";
import AtmosphereLayer from "../components/shell/AtmosphereLayer";
import FeedPost, { type FeedPostData } from "../components/feed/FeedPost";
import EvidenceCard, { type EvidenceItem } from "../components/investigate/EvidenceCard";
import ConfidenceBar from "../components/nova/ConfidenceBar";
import Cascade from "../components/outcome/Cascade";
import PhaseIndicator from "../components/hud/PhaseIndicator";
import Reveal from "../components/landing/Reveal";
import type { Phase } from "../state/gameMachine";

/**
 * THE OVERVIEW PAGE - the root. The game is at /play.
 *
 * Four sections, and their shape is the argument:
 *
 *   1. A feed, with the claim landing in it. No wordmark splash: the product's
 *      most interesting screen is the feed, not the power-on, and a centred
 *      wordmark over a tagline is structurally the exact hero CLAUDE.md section
 *      2 bans - however true it is that Boot is "the product".
 *   2. The problem, said once, beside the two posts that are the problem.
 *   3. ONE demonstration of checking a claim, with the game's own phase marker
 *      advancing as the reader moves through it, so the loop is performed
 *      rather than described. It ends in the Cascade at full width.
 *   4. The way in.
 *
 * It was eight sections and 9,167px. Six of them answered questions a judge
 * has AFTER playing, which is what the proposal document is for.
 *
 * TYPE: one event. The thesis runs to 160px and everything steps hard down from
 * it - 34px for the three section statements, 18px for sentences, 11px mono
 * only for measurements, sources and labels. The previous version carried six
 * 56px statements of equal weight, which is a template in a large font.
 *
 * MONO: reserved again. It was 129 of 217 text elements, which made the
 * feed-world / evidence-world split meaningless because everything had become
 * evidence. Sentences are Inter Tight here; mono is for labels, figures and
 * whatever the game's own components draw themselves.
 */
const m1 = missions["01"];
const m2 = missions["02"];
const feed = m1.feed as FeedPostData[];
const target = feed.find((p) => p.kind === "target")!;
const clip = (m2.feed as FeedPostData[]).find((p) => p.kind === "target")!;
const confirmation = feed.find((p) => p.kind === "false")!;
const evidence = (m1.evidence as EvidenceItem[]).find((e) => e.state === "findable")!;
const novaOpening = (m1.nova as { confidence: number }).confidence;
const novaPushed =
  (m1.nova as { replies: { id: string; confidence?: number }[] }).replies.find(
    (r) => r.id === "ask-source",
  )?.confidence ?? 34;

/** The ordinary posts the claim arrives among. Real posts, carrying real photographs. */
const ordinary = feed.filter((p) => p.kind !== "target" && p.attachment).slice(0, 2);

/*
 * The evidence card is a real control in the game - you press it to examine a
 * slot. On this page it is already examined and there is nothing to press, so
 * it is made inert: out of the tab order, not clickable, still readable. A
 * focusable button that does nothing is the exact dishonesty the locked rooms
 * and the hatched worlds exist to avoid, and it would have been the only one in
 * the build.
 *
 * `inert` is not in React 18's prop types, so it is spread in as an attribute -
 * same reason `fetchpriority` is on Boot.
 */
const INERT = { inert: "" } as unknown as { inert?: never };

/**
 * The way into the product.
 *
 * `primary` is the hero's, and it is a solid block of --ink with --void type on
 * it - 16.5:1, the highest-contrast object on the page by a distance, so the
 * eye lands on it without hunting. DECISIONS already says navigation is neutral
 * and "gets its weight from size and padding instead" of a signal colour; this
 * is that rule applied harder rather than abandoned. No cyan: the way in
 * verifies nothing and marks no position, and a page that colours its button
 * with the evidence signal teaches the wrong thing in its first three seconds.
 *
 * Everything else keeps the outline. One primary control per page, or none of
 * them is primary.
 */
function PlayLink({ children, primary = false }: { children: string; primary?: boolean }) {
  return (
    <a
      href="/play"
      className={
        primary
          ? "inline-block rounded-btn bg-ink px-8 py-4 font-display text-base font-bold uppercase tracking-[0.08em] text-void transition-colors duration-[120ms] ease-real hover:bg-ink-mute"
          : "inline-block rounded-btn border border-ink-mute px-6 py-3 font-mono text-2xs uppercase tracking-[0.16em] text-ink transition-colors duration-[120ms] ease-real hover:border-ink"
      }
    >
      {children}
    </a>
  );
}

/** A section label. Uppercase mono, wide tracking - the game's own label voice. */
function Label({ children }: { children: string }) {
  return <p className="label-mono">{children}</p>;
}

/**
 * A caption: mono because it carries a figure or a source, but NOT uppercase.
 * `label-mono` is for labels; running it over a sentence is how the page ended
 * up shouting its footnotes in capitals.
 */
function Caption({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p className={`font-mono text-2xs leading-[16px] text-ink-mute ${className}`}>{children}</p>
  );
}

/**
 * The demonstration's marker: the game's own PhaseIndicator, advancing as the
 * reader passes each beat.
 *
 * The only JavaScript motion left on the page, and it earns that because it
 * drives a React prop - a phase is discrete, and everything continuous here is
 * CSS on a scroll timeline. One observer, no scroll listener.
 */
function useActiveBeat(count: number) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(count - 1);
      return;
    }
    const resolve = () => {
      const middle = window.innerHeight / 2;
      let best = 0;
      let bestDistance = Infinity;
      refs.current.forEach((node, i) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setActive(best);
    };
    const observer = new IntersectionObserver(resolve, { threshold: [0, 0.5, 1] });
    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [count]);
  return { refs, active };
}

export default function Landing() {
  const l = strings.landing;
  const beats = l.check.beats as { phase: string; title: string; body: string; note: string }[];
  /* The marker walks the loop: the three beats, then the consequence. */
  const phases: Phase[] = [...beats.map((b) => b.phase as Phase), "outcome"];
  const { refs, active } = useActiveBeat(phases.length);

  return (
    <>
      <AtmosphereLayer />

      <main className="relative z-10">
        {/* ---------- 1. THE FEED, WITH THE CLAIM LANDING IN IT ---------- */}
        <section
          className="mx-auto max-w-[1240px] px-3 pt-8 lg:px-6 lg:pt-12"
          aria-labelledby="hero-thesis"
        >
          <div className="flex items-baseline justify-between gap-6">
            <p className="font-display text-base font-black tracking-[-0.02em] text-ink">
              RE<span className="text-verified">:</span>AL
            </p>
            <Label>{strings.brand.context}</Label>
          </div>

          {/*
            THE ONE TYPOGRAPHIC EVENT, and it spans the whole measure rather
            than a column. Boxed into the left column it had to shrink to 100px
            to stop "decided" running under the feed - a headline sized by what
            it collides with is not an event, it is a caption that got away.
            Full width, it can carry 160px and still break where it wants to.
          */}
          <h1
            id="hero-thesis"
            className="mt-8 font-display font-black leading-[0.92] tracking-[-0.02em] text-ink lg:mt-12"
            style={{ fontSize: "clamp(46px, 8.6vw, 160px)" }}
          >
            {l.hero.thesis}
          </h1>

          <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_620px] lg:gap-12">
            <div className="lg:sticky lg:top-12">
              <p className="max-w-[46ch] text-base leading-[26px] text-ink-mute">
                {l.hero.sub}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PlayLink primary>{l.hero.play}</PlayLink>
                <Label>{l.hero.playNote}</Label>
              </div>
              <p className="mt-12 hidden font-mono text-2xs uppercase tracking-[0.16em] text-ink-mute lg:block">
                {l.hero.cue}
              </p>
            </div>

            {/*
              One ordinary post, then the claim, then another ordinary one. The
              claim was last and therefore below the fold at 1440, which left
              the line above it accusing the reader about something they could
              not see. It is second now, and it still lands.
            */}
            <ol className="flex flex-col gap-3">
              <li>
                <FeedPost post={ordinary[0]} />
              </li>
              <li className="hero-land">
                <FeedPost post={target} />
              </li>
              <li>
                <FeedPost post={ordinary[1]} />
              </li>
            </ol>
          </div>
        </section>

        {/* ---------- 2. THE PROBLEM ---------- */}
        <section
          className="mx-auto mt-18 max-w-[1240px] px-3 lg:px-6"
          aria-labelledby="about-problem"
        >
          <Reveal>
            <div className="flex items-center gap-3">
              <Label>{l.problem.label}</Label>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_620px] lg:gap-12">
            <div>
              <Reveal>
                <h2
                  id="about-problem"
                  className="max-w-[16ch] font-display text-xl font-bold leading-[1.1] tracking-[-0.02em] text-ink"
                >
                  {l.problem.statement}
                </h2>
              </Reveal>
              <Reveal stagger={3}>
                <p className="mt-6 max-w-[52ch] text-base leading-[26px] text-ink-mute">
                  {l.problem.body}
                </p>
              </Reveal>
              <Reveal stagger={6}>
                <p className="mt-6 max-w-[52ch] text-base leading-[26px] text-ink">
                  {l.problem.second}
                </p>
              </Reveal>
              <Reveal stagger={9}>
                <p className="mt-6 max-w-[52ch] text-sm text-ink-mute">{l.problem.note}</p>
              </Reveal>
            </div>
            <Reveal stagger={4}>
              <FeedPost post={confirmation} />
            </Reveal>
          </div>
        </section>

        {/* ---------- 3. CHECKING IT ---------- */}
        <section className="mt-18 border-t border-line pt-8" aria-labelledby="about-check">
          <div className="mx-auto max-w-[1240px] px-3 lg:px-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <Label>{l.check.label}</Label>
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              </div>
            </Reveal>
            <Reveal>
              <h2
                id="about-check"
                className="mt-8 max-w-[18ch] font-display text-xl font-bold leading-[1.1] tracking-[-0.02em] text-ink"
              >
                {l.check.statement}
              </h2>
            </Reveal>

            <div className="sticky top-0 z-10 -mx-3 mt-8 bg-void/90 px-3 pb-2 backdrop-blur lg:-mx-6 lg:px-6">
              <PhaseIndicator phase={phases[active]} />
            </div>
            <Reveal>
              <p className="mt-6 max-w-[52ch] text-sm text-ink-mute">{l.check.lead}</p>
            </Reveal>

            <ol className="mt-12 flex flex-col gap-18">
              {beats.map((beat, i) => (
                <li
                  key={beat.phase + i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_620px] lg:gap-12"
                >
                  <div>
                    <Reveal>
                      <h3 className="max-w-[20ch] font-display text-base font-bold uppercase leading-[1.2] tracking-[0.04em] text-ink">
                        {beat.title}
                      </h3>
                    </Reveal>
                    <Reveal stagger={3}>
                      <p className="mt-4 max-w-[46ch] text-base leading-[26px] text-ink-mute">
                        {beat.body}
                      </p>
                    </Reveal>
                    <Reveal stagger={6}>
                      <Caption className="mt-4">{beat.note}</Caption>
                    </Reveal>
                  </div>

                  <Reveal stagger={4}>
                    {i === 0 && (
                      <div className="rounded-nova border border-nova bg-void/70 p-6">
                        <ConfidenceBar value={novaPushed} fallFrom={novaOpening} />
                      </div>
                    )}
                    {i === 1 && (
                      <div
                        {...INERT}
                        className="scroll-reveal board rounded-doc border border-line p-6"
                      >
                        <ol className="max-w-[300px]">
                          <EvidenceCard
                            item={evidence}
                            index={0}
                            rotation={-1.4}
                            offset={0}
                            found
                            onFind={() => {}}
                          />
                        </ol>
                      </div>
                    )}
                    {i === 2 && <FeedPost post={clip} />}
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          {/*
            THE CASCADE, FULL WIDTH. It is the only dramatic thing in the build
            and the last version left it in a 620px box in the corner of a
            section. Here it is the widest object on the page, the posts inside
            it render at that width, and the copy sits above and below rather
            than competing with it.
          */}
          <div className="mt-18 border-y border-line bg-void/50 py-18">
            {/*
              The marker's fourth beat is anchored to this copy rather than to
              the whole spread block. Anchored to the block, its midpoint sat
              600px below the fold and the marker only reached EXPERIENCE once
              the reader was halfway down the stack - by which point the point
              had been made without it.
            */}
            <div
              ref={(el) => {
                refs.current[3] = el;
              }}
              className="mx-auto max-w-[1240px] px-3 lg:px-6"
            >
              <Reveal>
                <h3 className="max-w-[24ch] font-display text-xl font-bold leading-[1.1] tracking-[-0.02em] text-ink">
                  {l.check.spreadTitle}
                </h3>
              </Reveal>
              <Reveal stagger={3}>
                <p className="mt-6 max-w-[52ch] text-base leading-[26px] text-ink-mute">
                  {l.check.spreadBody}
                </p>
              </Reveal>
            </div>
            <div className="scroll-cascade mx-auto mt-12 max-w-[1240px] px-3 lg:px-6">
              <Cascade />
            </div>
            <div className="mx-auto max-w-[1240px] px-3 lg:px-6">
              <Reveal>
                <Caption className="max-w-[62ch]">{l.check.spreadNote}</Caption>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- 4. PLAY ---------- */}
        <footer
          className="mx-auto max-w-[1240px] px-3 pb-[55vh] pt-18 lg:px-6"
          aria-labelledby="about-close"
        >
          <Reveal>
            <h2
              id="about-close"
              className="max-w-[20ch] font-display font-black leading-[1.02] tracking-[-0.02em] text-ink"
              style={{ fontSize: "clamp(34px, 5vw, 72px)" }}
            >
              {l.close.statement}
            </h2>
          </Reveal>
          <Reveal stagger={3}>
            <p className="mt-8 max-w-[52ch] text-base leading-[26px] text-ink-mute">
              {l.close.body}
            </p>
          </Reveal>
          <Reveal stagger={6}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PlayLink>{l.close.play}</PlayLink>
              <Label>{l.close.playNote}</Label>
            </div>
          </Reveal>
          {/*
            The tail. Scroll-driven ranges need room after the last element or
            it can never finish crossing the viewport - which is exactly how the
            previous version ended up with footer text stuck part-faded, and why
            that was "fixed" by collapsing every range into nothing.
          */}
          <Reveal stagger={9}>
            <Caption className="mt-18">{l.close.footer}</Caption>
          </Reveal>
        </footer>
      </main>
    </>
  );
}
