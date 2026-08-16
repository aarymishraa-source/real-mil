import { useEffect, useRef, useState } from "react";
import strings from "../content/strings.json";
import AtmosphereLayer from "../components/shell/AtmosphereLayer";
import { usePrefersReducedMotion } from "../lib/motion";

/**
 * BOOT - ART_DIRECTION section 5. "The first three seconds."
 *
 * Not a landing page: a power-on. The whole screen is under 40 words, and the
 * city sits behind everything at 0.28 so it reads as a room the terminal is
 * running in rather than a hero image.
 *
 * Stacking, bottom to top: city photograph -> full atmosphere layer -> copy.
 * The atmosphere goes ON TOP of the photograph so the grain, scanlines and
 * vignette land on the image too; underneath it the photo would sit outside
 * the world and look pasted on.
 *
 * Motion here is the one place the build spends any: a 20s settle, letters
 * typing at 60ms, and a 120ms chromatic glitch every 6s. All three are off
 * under prefers-reduced-motion.
 */

/** The wordmark is content, so it comes from strings, not a literal. */
const WORDMARK = strings.brand.name;

/*
 * React 18 does not know the camelCase `fetchPriority` prop - that landed in
 * React 19 - so it passed the name through to the DOM verbatim and warned on
 * every boot. The lowercase HTML attribute is what the browser actually reads,
 * and it is not in React's JSX typings, so it is spread in rather than removed:
 * this image is the first paint and the priority hint is doing real work.
 */
const FETCH_PRIORITY_HIGH = { fetchpriority: "high" } as unknown as {
  fetchPriority?: never;
};
const TYPE_MS = 60;
const GLITCH_EVERY_MS = 6000;
const GLITCH_MS = 120;

export default function Boot({
  onStart,
  activation = "any",
}: {
  onStart: () => void;
  /**
   * "any" is the game: any key, any pointer, exactly as the prompt promises.
   *
   * "prompt" is the overview page, where Boot is the hero of a document you can
   * scroll - and there, window-level listeners are hostile in both directions.
   * A pointerdown turns the first touch of a scroll gesture into a navigation.
   * A keydown is worse: Space, Page Down and the arrow keys ARE how a keyboard
   * user scrolls, and Tab is how they reach anything, so the first key they
   * press would throw them into the game. Measured - the verification run
   * navigated away mid-test.
   *
   * In "prompt" mode nothing is bound to the window and the prompt itself is
   * the control: a real button, tabbable, with a focus ring. The screen is
   * pixel-identical; only the promise changes, and on a page you scroll,
   * "press any key" was never a promise that could be kept.
   */
  activation?: "any" | "prompt";
}) {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  /*
   * Whether this screen is actually on screen.
   *
   * Always true in the game, where Boot IS the screen and the observer is never
   * created. It only means anything in "prompt" mode, where Boot is the hero of
   * a page that scrolls: the 6s glitch would otherwise keep firing forever in a
   * viewport the reader left three sections ago, which is a timer running for
   * motion nobody can see - the ambient-loop line the overview page's motion
   * budget draws.
   */
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    if (activation === "any") return;
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      // Any sliver counts: the wordmark is at the centre, so by the time the
      // hero is fully gone there has been nothing to see for a while.
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [activation]);

  // Letters type in at 60ms. Under reduced motion the wordmark is simply there.
  const [typed, setTyped] = useState(() => (reducedMotion ? WORDMARK.length : 0));
  const [glitching, setGlitching] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reducedMotion) {
      setTyped(WORDMARK.length);
      return;
    }
    setTyped(0);
    const id = window.setInterval(() => {
      setTyped((n) => {
        if (n >= WORDMARK.length) {
          window.clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, TYPE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  // One discrete 120ms glitch every 6s - never a running loop on the element,
  // and never at all while the screen is scrolled out of view.
  useEffect(() => {
    if (reducedMotion || !onScreen) return;
    const cell = timers.current;
    const id = window.setInterval(() => {
      setGlitching(true);
      const off = window.setTimeout(() => setGlitching(false), GLITCH_MS);
      cell.push(off);
    }, GLITCH_EVERY_MS);
    return () => {
      window.clearInterval(id);
      cell.forEach(window.clearTimeout);
      cell.length = 0;
      setGlitching(false);
    };
  }, [reducedMotion, onScreen]);

  // Any key AND any pointer: the prompt says "press any key", and a judge on a
  // tablet has no keyboard to press.
  useEffect(() => {
    if (activation !== "any") return;
    window.addEventListener("keydown", onStart);
    window.addEventListener("pointerdown", onStart);
    return () => {
      window.removeEventListener("keydown", onStart);
      window.removeEventListener("pointerdown", onStart);
    };
  }, [onStart, activation]);

  const shown = WORDMARK.slice(0, typed);

  return (
    <main
      ref={rootRef}
      className="relative flex h-full flex-col items-center justify-center overflow-hidden px-6"
    >
      {/*
        Full bleed, eager, high priority - it is the first paint and is
        preloaded from index.html. object-position sits at 38% so the open sky
        stays behind the wordmark at every width while the cyclists keep their
        wheels; a straight centre crop pushes the skyline up into the type.
      */}
      <img
        src={strings.art.cityBoot}
        width={strings.art.cityBootWidth}
        height={strings.art.cityBootHeight}
        alt=""
        aria-hidden="true"
        loading="eager"
        {...FETCH_PRIORITY_HIGH}
        decoding="sync"
        className="boot-bg pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-[50%_38%] opacity-[0.28]"
      />

      <AtmosphereLayer />

      <div className="relative z-10 flex flex-col items-center">
        <h1
          className={`font-display font-black leading-none tracking-[-0.02em] ${
            glitching ? "wordmark-glitch" : "wordmark"
          }`}
          style={{ fontSize: "clamp(56px, 12vw, 160px)" }}
          aria-label={WORDMARK}
        >
          {/* Split so the colon can hold --verified while the rest is --ink. */}
          <span aria-hidden="true">
            {[...shown].map((ch, i) =>
              ch === ":" ? (
                <span key={i} className="text-verified">
                  {ch}
                </span>
              ) : (
                <span key={i}>{ch}</span>
              ),
            )}
          </span>
        </h1>

        <p className="mt-6 font-mono text-2xs uppercase tracking-[0.24em] text-ink-mute">
          {strings.brand.tagline}
        </p>

        {/*
          The middle step. The wordmark is up to 160px and everything under it
          was 11-15px, so the screen read as a splash with fine print. The hook
          is the one line worth reading twice, so it becomes the second tier
          rather than body copy.
        */}
        <p className="mt-8 max-w-[24ch] text-center font-display text-lg font-bold leading-[30px] text-ink lg:text-xl lg:leading-[38px]">
          {strings.brand.hook}
        </p>

        {/*
          A paragraph in the game, where the whole window is the control and the
          prompt is only describing it. A real button on the overview page,
          where the window belongs to the document and the promise has to be
          attached to something you can press, tab to and see focused.
        */}
        {activation === "any" ? (
          <p className="mt-12 rounded-btn border border-line px-6 py-3 font-mono text-2xs uppercase tracking-[0.16em] text-ink">
            {strings.boot.start}
          </p>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="mt-12 rounded-btn border border-line px-6 py-3 font-mono text-2xs uppercase tracking-[0.16em] text-ink transition-colors duration-[120ms] ease-real hover:border-ink-mute"
          >
            {strings.boot.start}
          </button>
        )}
      </div>

      {/*
        --ink-mute. PROTOTYPE_SPEC calls this the line that tells a judge what
        they are looking at; at --ink-faint it was 2.84:1, the least readable
        text in the build.
      */}
      <p className="label-mono absolute bottom-6 left-6 z-10">
        {strings.brand.context}
      </p>
    </main>
  );
}
