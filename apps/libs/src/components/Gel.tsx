import type { Band } from "@biolibs/gel";

/**
 * A gel, drawn: a ladder lane beside a digest lane. The gel is dark in both themes, as a gel under
 * the lamp is.
 *
 * @param props.ladder - The ladder's bands.
 * @param props.sample - The digest's bands.
 * @param props.labels - The two lanes' names and the description for somebody who cannot see it.
 */
export function Gel({ ladder, sample, labels }: { ladder: readonly Band[]; sample: readonly Band[]; labels: { ladder: string; sample: string; alt: string } }) {
  const width = 300, height = 360, top = 44, bottom = height - 18;
  const y = (band: Band) => top + band.position * (bottom - top);
  /** Which bands get a size written beside them: not one that would sit on top of the one above. */
  const shown = (bands: readonly Band[]) => { let last = -Infinity; return bands.map((band) => { const show = y(band) - last >= 10; if (show) last = y(band); return show; }); };
  const ladderShown = shown(ladder), sampleShown = shown(sample);
  const number = (size: number) => size.toLocaleString("en-US");
  return (
    <svg className="gel" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={labels.alt}>
      <rect width={width} height={height} rx="8" fill="#0d1117" />
      {[{ x: 78, label: labels.ladder }, { x: 178, label: labels.sample }].map((lane) => (
        <g key={lane.label}>
          <text x={lane.x + 25} y="16" textAnchor="middle" fontSize="10" fill="#8f979f">{lane.label}</text>
          <rect x={lane.x} y="24" width="50" height="7" rx="1.5" fill="#05070a" stroke="#2c343c" />
        </g>
      ))}
      {ladder.map((band, i) => (
        <g key={`l${band.size}`}>
          <rect x="80" y={y(band) - 1.25} width="46" height="2.5" rx="1" fill="#cfd6dc" opacity="0.7" />
          {ladderShown[i] ? <text x="72" y={y(band) + 3} textAnchor="end" fontSize="9" fill="#8f979f">{number(band.size)}</text> : null}
        </g>
      ))}
      {sample.map((band, i) => (
        <g key={`s${band.size}`}>
          <rect x="180" y={y(band) - 2 - Math.min(band.sizes.length - 1, 2)} width="46" height={4 + 2 * Math.min(band.sizes.length - 1, 2)} rx="1.5" fill="#e8fbff" />
          {sampleShown[i] ? <text x="234" y={y(band) + 3} fontSize="9" fill="#cfd6dc">{band.sizes.length > 1 ? `${band.sizes.length} × ~${number(band.size)}` : number(band.size)}</text> : null}
        </g>
      ))}
    </svg>
  );
}
