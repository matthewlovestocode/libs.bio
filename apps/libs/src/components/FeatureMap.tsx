import { angleAt, blockPath, packLanes, polar, ringPath, spreadApart, tickLabel, tickPath, tickPositions, tickStep } from "@biolibs/seqmap";
import type { Placed, Site } from "@/lib/map.ts";

/** The most names the drawing has room for. Past this the largest features are named and the rest are left to the table. */
const MOST_LABELS = 22;

/** A name cut to a length the drawing has room for. The table has it whole. */
const short = (name: string) => (name.length > 21 ? `${name.slice(0, 20)}…` : name);

/**
 * A map of a sequence: a ring for a circle, a bar for a line.
 *
 * The scale runs round the outside. Features sit inside it in lanes, so two that overlap can both
 * be seen, each with an arrowhead showing which strand it lies on. Enzymes that cut once are marked
 * on the sequence itself. The geometry is `@biolibs/seqmap`'s.
 *
 * @param props.name - What the sequence is called.
 * @param props.length - How long it is.
 * @param props.circular - Whether it is a circle.
 * @param props.features - Its features, with their lanes.
 * @param props.sites - The enzymes to mark.
 * @param props.selected - The feature picked out, by its index, or `null`.
 * @param props.onSelect - Called when a feature is picked.
 * @param props.alt - A description for somebody who cannot see it.
 */
export function FeatureMap({ name, length, circular, features, sites, selected, onSelect, alt }:
  { name: string; length: number; circular: boolean; features: Placed[]; sites: Site[]; selected: number | null; onSelect: (index: number | null) => void; alt: string }) {
  const number = (value: number) => value.toLocaleString("en-US");
  const step = tickStep(length, circular ? 10 : 8);
  const ticks = tickPositions(length, step, circular);
  // Enzymes are named first, a few of them, and then the largest features until the room runs out.
  const namedSites = sites.slice(0, features.length + sites.length <= MOST_LABELS ? sites.length : 8);
  const named = new Set([...features].sort((a, b) => b.size - a.size).slice(0, MOST_LABELS - namedSites.length).map((feature) => feature.index));
  const isNamed = (site: Site) => namedSites.includes(site);
  const pick = (index: number) => () => onSelect(selected === index ? null : index);

  if (circular) {
    const width = 600, height = 400, cx = width / 2, cy = height / 2, radius = 118, reach = radius + 30;
    // Lanes get thinner as there are more of them, so the middle is always left clear for the name.
    const laneCount = features.length === 0 ? 1 : Math.max(...features.map((feature) => feature.lane)) + 1;
    const pitch = Math.min(15, (radius - 52) / laneCount);
    const band = (lane: number) => ({ outer: radius - 7 - lane * pitch, inner: radius - 7 - lane * pitch - pitch * 0.8 });
    // Every name, a feature's or an enzyme's, is placed round the same circle, so none sits on another.
    const wanted = [
      ...features.filter((feature) => named.has(feature.index)).map((feature) => {
        const first = feature.parts[0], last = feature.parts[feature.parts.length - 1];
        const wraps = feature.parts.length > 1 && first.start > last.start;
        const middle = wraps ? ((first.start + length + last.end) / 2) % length : (Math.min(...feature.parts.map((part) => part.start)) + Math.max(...feature.parts.map((part) => part.end))) / 2;
        return { text: feature.label, angle: angleAt(middle, length), colour: feature.colour, from: band(feature.lane).outer, feature: feature.index as number | null };
      }),
      ...namedSites.map((site) => ({ text: `${site.name} ${number(site.at === 0 ? length : site.at)}`, angle: angleAt(site.at, length), colour: "var(--ink)", from: radius + 6, feature: null as number | null })),
    ];
    // Names go down each side of the ring in a column, pushed apart until each has a line to itself.
    // Spreading them by angle instead piles them up at the top and bottom, where a line of text is
    // much wider than the arc it has been given.
    const side = (right: boolean) => {
      const mine = wanted.filter((one) => (Math.sin(one.angle) >= 0) === right).sort((a, b) => Math.cos(b.angle) - Math.cos(a.angle));
      const ys = mine.length === 0 ? [] : spreadApart(mine.map((one) => cy - Math.cos(one.angle) * reach), 15, 14, height - 10);
      return mine.map((one, i) => ({ ...one, y: ys[i], x: cx + (right ? 1 : -1) * (Math.sqrt(Math.max(reach * reach - (ys[i] - cy) ** 2, 0)) + 10), right }));
    };
    const names = [...side(true), ...side(false)];
    return (
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={alt} className="feature-map">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--muted)" strokeWidth="2" />
        {ticks.map((at) => {
          const angle = angleAt(at, length), label = polar(cx, cy, radius + 15, angle);
          return (
            <g key={at}>
              <path d={tickPath(cx, cy, radius, radius + 5, angle)} stroke="var(--muted)" strokeWidth="1" />
              <text x={label.x} y={label.y + 3} textAnchor="middle" className="map-tick">{at === 0 ? "1" : tickLabel(at, step)}</text>
            </g>
          );
        })}
        {features.map((feature) => {
          const { inner, outer } = band(feature.lane);
          return (
            <g key={feature.index} className={`feature${selected === feature.index ? " picked" : ""}`} onClick={pick(feature.index)}>
              <title>{feature.label}</title>
              {feature.parts.map((part, i) => {
                const head = feature.strand === 1 && i === feature.parts.length - 1 ? "end" : feature.strand === -1 && i === 0 ? "start" : null;
                return <path key={i} d={ringPath(cx, cy, inner, outer, angleAt(part.start, length), angleAt(part.end, length), head, 0.09)} fill={feature.colour} />;
              })}
            </g>
          );
        })}
        {sites.map((site) => <path key={site.name} d={tickPath(cx, cy, radius - 6, radius + 6, angleAt(site.at, length))} stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />)}
        {names.map((one, i) => {
          const start = polar(cx, cy, one.from, one.angle);
          return (
            <g key={`${one.text}-${i}`} className={one.feature === null ? undefined : `label${selected === one.feature ? " picked" : ""}`} onClick={one.feature === null ? undefined : pick(one.feature)}>
              <path d={`M${start.x},${start.y} L${one.x},${one.y} L${one.x + (one.right ? 8 : -8)},${one.y}`} fill="none" stroke={one.colour} strokeWidth="0.75" opacity="0.55" />
              <text x={one.x + (one.right ? 12 : -12)} y={one.y + 4} textAnchor={one.right ? "start" : "end"} className="map-name" fill={one.colour}>{short(one.text)}</text>
            </g>
          );
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" className="map-title">{name}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="map-note">{number(length)} bp</text>
      </svg>
    );
  }

  const width = 600, left = 24, right = width - 24, top = 64;
  const x = (at: number) => left + (at / Math.max(length, 1)) * (right - left);
  // On a bar a name sits under its feature, and a name is often wider than the feature. So the lanes
  // are packed again here, by the room each feature and its name take up together.
  const rooms = features.map((feature) => {
    const from = x(Math.min(...feature.parts.map((part) => part.start))), to = x(Math.max(...feature.parts.map((part) => part.end)));
    const half = named.has(feature.index) ? short(feature.label).length * 3.5 : 0;
    const middle = Math.min(Math.max((from + to) / 2, left + half), right - half);
    return { from, to, middle, start: Math.min(from, middle - half), end: Math.max(to, middle + half) };
  });
  const lane = rooms.length === 0 ? [] : packLanes(rooms, 8);
  const lanes = lane.length === 0 ? 0 : Math.max(...lane) + 1;
  const height = top + 30 + lanes * 30 + 16;
  // Enzyme names are spread along the top so two close together can both be read.
  const siteXs = sites.length === 0 ? [] : spreadApart(sites.map((site) => x(site.at)), 600 / 9, left + 26, right - 26);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={alt} className="feature-map">
      <line x1={left} y1={top} x2={right} y2={top} stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" />
      {ticks.map((at) => (
        <g key={at}>
          <line x1={x(at)} x2={x(at)} y1={top} y2={top + 5} stroke="var(--muted)" strokeWidth="1" />
          <text x={x(at)} y={top + 16} textAnchor="middle" className="map-tick">{at === 0 ? "1" : tickLabel(at, step)}</text>
        </g>
      ))}
      {sites.map((site, i) => (
        <g key={site.name}>
          <line x1={x(site.at)} x2={x(site.at)} y1={top - 6} y2={top + 6} stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
          {isNamed(site) ? <><line x1={x(site.at)} y1={top - 8} x2={siteXs[i]} y2={top - 22} stroke="var(--ink)" strokeWidth="0.75" opacity="0.55" /><text x={siteXs[i]} y={top - 26} textAnchor="middle" className="map-name" fill="var(--ink)">{site.name} {number(site.at)}</text></> : null}
        </g>
      ))}
      {features.map((feature, at) => {
        const y = top + 30 + lane[at] * 30;
        return (
          <g key={feature.index} className={`feature${selected === feature.index ? " picked" : ""}`} onClick={pick(feature.index)}>
            <title>{feature.label}</title>
            {feature.parts.map((part, i) => {
              const head = feature.strand === 1 && i === feature.parts.length - 1 ? "end" : feature.strand === -1 && i === 0 ? "start" : null;
              return <path key={i} d={blockPath(x(part.start), Math.max(x(part.end), x(part.start) + 2), y, y + 12, head, Math.min(7, (x(part.end) - x(part.start)) / 2))} fill={feature.colour} />;
            })}
            {named.has(feature.index) ? <text x={rooms[at].middle} y={y + 24} textAnchor="middle" className="map-name" fill={feature.colour}>{short(feature.label)}</text> : null}
          </g>
        );
      })}
      <text x={left} y={16} className="map-title">{name}</text>
      <text x={right} y={16} textAnchor="end" className="map-note">{number(length)} bp</text>
    </svg>
  );
}
