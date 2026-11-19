import { TAU, angleAt, blockPath, ringPath } from "@biolibs/seqmap";
import type { Pcr } from "@/lib/pcr.ts";

/** A primer is a couple of dozen bases on a template of thousands. Drawn to scale it would vanish. */
const SMALLEST_ARROW = { angle: TAU / 40, width: 12 };

/**
 * Where the primers bind and what lies between them, drawn on the template: a ring for a circle and
 * a bar for a line. The geometry is `@biolibs/seqmap`'s.
 *
 * The forward primer points clockwise, or to the right. The reverse primer points back at it. What
 * is between their outer ends is the product. A primer that binds in more than one place is drawn
 * in each.
 *
 * @param props.result - The PCR.
 * @param props.alt - A description for somebody who cannot see it.
 */
export function PrimerMap({ result, alt }: { result: Pcr; alt: string }) {
  const { length, circular } = result;
  const number = (value: number) => value.toLocaleString("en-US");
  const product = result.products[0];
  const sites = result.primers.flatMap((primer) => primer.sites.map((site) => ({ ...site, name: primer.name })));
  const colour = { forward: "var(--bionet-yours)", reverse: "var(--bionet-theirs)" };
  const legend = (
    <figcaption className="legend">
      <span><i style={{ background: colour.forward }} />forward primer</span>
      <span><i style={{ background: colour.reverse }} />reverse primer</span>
      {product === undefined ? null : <span><i style={{ background: "var(--bionet-good)" }} />product, {number(product.length)} bp</span>}
    </figcaption>
  );

  if (circular) {
    const width = 460, size = 300, cx = width / 2, cy = size / 2, radius = 96;
    return (
      <figure className="map">
        <svg viewBox={`0 0 ${width} ${size}`} role="img" aria-label={alt}>
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--soft)" strokeWidth="2" opacity="0.6" />
          {product === undefined ? null : <path d={ringPath(cx, cy, radius - 5, radius + 5, angleAt(product.start, length), angleAt(product.end % length || length, length) + (product.end > length ? 0 : 0))} fill="var(--bionet-good)" opacity="0.55" />}
          {sites.map((site, i) => {
            const from = angleAt(site.start, length), to = angleAt(site.end, length);
            const middle = (from + to) / 2, half = Math.max((to - from) / 2, SMALLEST_ARROW.angle / 2);
            return <path key={i} d={ringPath(cx, cy, radius + 9, radius + 21, middle - half, middle + half, site.strand === "forward" ? "end" : "start", 7)} fill={colour[site.name]} />;
          })}
          <text x={cx} y={cy - 4} textAnchor="middle" className="map-size">{number(length)} bp</text>
          <text x={cx} y={cy + 14} textAnchor="middle" className="map-note">template</text>
        </svg>
        {legend}
      </figure>
    );
  }

  const width = 460, left = 20, right = width - 20, y = 60;
  const x = (at: number) => left + (at / Math.max(length, 1)) * (right - left);
  return (
    <figure className="map">
      <svg viewBox={`0 0 ${width} 110`} role="img" aria-label={alt}>
        <line x1={left} y1={y} x2={right} y2={y} stroke="var(--soft)" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        {product === undefined ? null : <path d={blockPath(x(product.start), x(Math.min(product.end, length)), y - 5, y + 5)} fill="var(--bionet-good)" opacity="0.55" />}
        {sites.map((site, i) => {
          const middle = (x(site.start) + x(site.end)) / 2, half = Math.max((x(site.end) - x(site.start)) / 2, SMALLEST_ARROW.width / 2);
          const forward = site.strand === "forward";
          return <path key={i} d={blockPath(middle - half, middle + half, forward ? y - 22 : y + 10, forward ? y - 10 : y + 22, forward ? "end" : "start", 6)} fill={colour[site.name]} />;
        })}
        <text x={left} y={y + 42} className="map-note">1</text>
        <text x={right} y={y + 42} textAnchor="end" className="map-note">{number(length)} bp</text>
      </svg>
      {legend}
    </figure>
  );
}
