import { angleAt, polar, spreadAround, tickPath } from "@biolibs/seqmap";
import type { Digest } from "@/lib/digest.ts";

/** The colours enzymes are told apart by, in the order they are chosen. They are the theme's. */
const COLOURS = ["var(--bionet-yours)", "var(--bionet-held)", "var(--bionet-theirs)", "var(--bionet-good)", "var(--bionet-found)", "var(--bionet-attention)"];

/** Past this many cuts there is no room to name each one, so only the marks are drawn. */
const MOST_LABELS = { ring: 18, bar: 6 };

/**
 * Where each enzyme cuts, drawn on the molecule: a ring for a circle and a bar for a line.
 *
 * The geometry is `@biolibs/seqmap`'s. Each enzyme has a colour, and each cut is named with its
 * enzyme and the base it comes after, unless there are too many to fit.
 *
 * @param props.result - The digest.
 * @param props.alt - A description for somebody who cannot see it.
 */
export function CutMap({ result, alt }: { result: Digest; alt: string }) {
  const { length, circular } = result;
  const colour = (index: number) => COLOURS[index % COLOURS.length];
  const cuts = result.enzymes.flatMap((one, index) => one.cuts.map((at) => ({ at, name: one.name, colour: colour(index) }))).sort((a, b) => a.at - b.at);
  const labelled = cuts.length <= (circular ? MOST_LABELS.ring : MOST_LABELS.bar);
  const number = (value: number) => value.toLocaleString("en-US");
  const base = (at: number) => number(at === 0 ? length : at);
  const legend = result.enzymes.map((one, index) => ({ name: one.name, count: one.cuts.length, colour: colour(index) }));

  if (circular) {
    // Wider than it is tall: the names sit to the left and right of the ring and need the room.
    const width = 460, size = 320, middle = width / 2, centre = size / 2, radius = 92;
    const angles = cuts.map((cut) => angleAt(cut.at, length));
    // Labels are pushed apart around the ring so two cuts close together can both be read.
    const placed = labelled ? spreadAround(angles, 0.26) : angles;
    return (
      <figure className="map">
        <svg viewBox={`0 0 ${width} ${size}`} role="img" aria-label={alt}>
          <circle cx={middle} cy={centre} r={radius} fill="none" stroke="var(--soft)" strokeWidth="2" opacity="0.6" />
          <text x={middle} y={centre - 4} textAnchor="middle" className="map-size">{number(length)} bp</text>
          <text x={middle} y={centre + 14} textAnchor="middle" className="map-note">{cuts.length === 1 ? "1 cut" : `${cuts.length} cuts`}</text>
          {cuts.map((cut, i) => {
            const at = polar(middle, centre, radius + 12, angles[i]);
            const label = polar(middle, centre, radius + 32, placed[i]);
            const right = label.x >= middle;
            return (
              <g key={`${cut.name}-${cut.at}`}>
                <path d={tickPath(middle, centre, radius - 7, radius + 7, angles[i])} stroke={cut.colour} strokeWidth="2.5" strokeLinecap="round" />
                {labelled ? (
                  <>
                    <line x1={at.x} y1={at.y} x2={label.x} y2={label.y} stroke={cut.colour} strokeWidth="0.75" opacity="0.6" />
                    <text x={label.x + (right ? 3 : -3)} y={label.y + 3} textAnchor={right ? "start" : "end"} className="map-label" fill={cut.colour}>{cut.name} {base(cut.at)}</text>
                  </>
                ) : null}
              </g>
            );
          })}
        </svg>
        <Legend entries={legend} />
      </figure>
    );
  }

  const width = 340, left = 16, right = width - 16, y = 70;
  const x = (at: number) => left + (at / Math.max(length, 1)) * (right - left);
  // Along a line there is one row of labels above and one below, taken in turn.
  return (
    <figure className="map">
      <svg viewBox={`0 0 ${width} 140`} role="img" aria-label={alt}>
        <line x1={left} y1={y} x2={right} y2={y} stroke="var(--soft)" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        <text x={left} y={y + 46} className="map-note">1</text>
        <text x={right} y={y + 46} textAnchor="end" className="map-note">{number(length)} bp</text>
        {cuts.map((cut, i) => {
          const up = i % 2 === 0, lift = 16 + (Math.floor(i / 2) % 3) * 12;
          return (
            <g key={`${cut.name}-${cut.at}`}>
              <line x1={x(cut.at)} y1={y - 7} x2={x(cut.at)} y2={y + 7} stroke={cut.colour} strokeWidth="2.5" strokeLinecap="round" />
              {labelled ? <text x={x(cut.at)} y={up ? y - lift : y + lift + 8} textAnchor="middle" className="map-label" fill={cut.colour}>{cut.name} {base(cut.at)}</text> : null}
            </g>
          );
        })}
      </svg>
      <Legend entries={legend} />
    </figure>
  );
}

/** Which colour is which enzyme, and how many times each cuts. */
function Legend({ entries }: { entries: { name: string; count: number; colour: string }[] }) {
  return (
    <figcaption className="legend">
      {entries.map((one) => <span key={one.name}><i style={{ background: one.colour }} />{one.name} × {one.count}</span>)}
    </figcaption>
  );
}
