/**
 * The atmosphere layer - ART_DIRECTION.md section 1.
 *
 * "A surveillance terminal running in a dark room in a city at night."
 *
 * Four static sub-layers in a fixed stacking order: light bleed, grain,
 * scanlines, vignette. Mounted once, behind everything, inert to the pointer.
 * The CSS lives in index.css so the specified values stay verbatim.
 *
 * Nothing here animates, which is why nothing here is suppressed under
 * prefers-reduced-motion - the whole layer survives untouched.
 */
export default function AtmosphereLayer() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="bleed" />
      <div className="grain" />
      <div className="scan" />
      <div className="vignette" />
    </div>
  );
}
