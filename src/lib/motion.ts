import { useEffect, useRef, useState } from "react";

/**
 * Shared motion primitives. CLAUDE.md section 3: every animation in the build
 * has to answer to prefers-reduced-motion, and CSS alone cannot stop a timer or
 * a rAF loop - so the JS-driven ones read the same media query.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Counter tick - the third and last of the three animations CLAUDE.md allows.
 * Counts from wherever the display currently is to `value` over `ms`.
 *
 * Reads from a ref rather than the previous prop so an interrupted count
 * continues from the number actually on screen instead of snapping backwards.
 * Under reduced motion the value changes instantly, no frames at all.
 */
export function useCountUp(value: number, ms = 600): number {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);

  useEffect(() => {
    if (reduced) {
      displayRef.current = value;
      setDisplay(value);
      return;
    }
    const from = displayRef.current;
    if (from === value) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out, settles rather than stops
      const next = Math.round(from + (value - from) * eased);
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms, reduced]);

  return display;
}
