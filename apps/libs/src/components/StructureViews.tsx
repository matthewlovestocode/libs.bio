"use client";

import { CONTACT_AT, type Structure } from "@/lib/structure.ts";
import { messages } from "@/messages/index.ts";

/** The drawing is this many units across, whatever the structure's size. */
const SIDE = 440;

/**
 * A contact map: every residue against every other, dark where they are close.
 *
 * It is the standard way of seeing a fold in two dimensions. The diagonal is each residue against
 * itself; a thick band beside it is a helix, a line running the other way is two strands lying
 * against each other.
 *
 * @param props.alphaCarbons - The α-carbons, in order along the chains.
 * @param props.distances - Every α-carbon against every other.
 */
export function ContactMap({ alphaCarbons, distances }: { alphaCarbons: Structure["alphaCarbons"]; distances: number[][] }) {
  const text = messages().structure;
  const count = alphaCarbons.length;
  if (count < 2) return null;
  const cell = SIDE / count, left = 34, top = 10;
  // Every tenth residue is numbered, or every hundredth for a large structure.
  const step = count > 200 ? 50 : count > 60 ? 10 : 5;
  const marks = Array.from({ length: Math.floor(count / step) }, (_, at) => (at + 1) * step);

  return (
    <svg viewBox={`0 0 ${left + SIDE + 10} ${top + SIDE + 30}`} role="img" aria-label={text.mapAlt(count, CONTACT_AT)} className="contact-map">
      {distances.map((row, i) =>
        row.map((distance, j) => {
          if (distance > CONTACT_AT) return null;
          // Nearer means darker: full strength when touching, fading out at the cutoff.
          const strength = 1 - distance / CONTACT_AT;
          return <rect key={`${i}-${j}`} x={left + j * cell} y={top + i * cell} width={Math.max(cell, 1)} height={Math.max(cell, 1)}
                       fill="var(--bionet-yours)" opacity={0.15 + strength * 0.85} />;
        }))}
      <rect x={left} y={top} width={SIDE} height={SIDE} fill="none" stroke="var(--muted)" strokeWidth="1" />
      {marks.map((at) => (
        <g key={at}>
          <text x={left - 5} y={top + (at - 0.5) * cell + 3} textAnchor="end" className="map-tick">{at}</text>
          <text x={left + (at - 0.5) * cell} y={top + SIDE + 14} textAnchor="middle" className="map-tick">{at}</text>
        </g>
      ))}
      <text x={left + SIDE / 2} y={top + SIDE + 27} textAnchor="middle" className="map-note">{text.residueNumber}</text>
    </svg>
  );
}

/**
 * A Ramachandran plot: each residue's two backbone turns, one against the other.
 *
 * Most of the square is empty, because most pairs of angles would put atoms through each other. The
 * places residues do fall are the shapes a backbone can take.
 *
 * @param props.torsions - Each residue's phi and psi.
 */
export function Ramachandran({ torsions }: { torsions: Structure["torsions"] }) {
  const text = messages().structure;
  const points = torsions.filter((one) => one.phi !== null && one.psi !== null);
  const side = 320, left = 40, top = 12;
  const x = (phi: number) => left + ((phi + 180) / 360) * side;
  // psi runs up the page, so the sign is flipped.
  const y = (psi: number) => top + ((180 - psi) / 360) * side;
  const lines = [-180, -90, 0, 90, 180];
  /** The two regions nearly every residue falls in, drawn as a hint rather than a measurement. */
  const regions = [
    { label: text.helixRegion, phi: [-100, -30], psi: [-70, -5] },
    { label: text.strandRegion, phi: [-180, -45], psi: [90, 180] },
  ];

  return (
    <svg viewBox={`0 0 ${left + side + 14} ${top + side + 34}`} role="img" aria-label={text.ramaAlt(points.length)} className="rama">
      {regions.map((region) => (
        <rect key={region.label} x={x(region.phi[0])} y={y(region.psi[1])} width={x(region.phi[1]) - x(region.phi[0])} height={y(region.psi[0]) - y(region.psi[1])}
              fill="var(--bionet-found)" opacity="0.12" rx="6" />
      ))}
      {lines.map((at) => (
        <g key={at}>
          <line x1={x(at)} y1={top} x2={x(at)} y2={top + side} stroke="var(--muted)" strokeWidth={at === 0 ? 1 : 0.5} opacity={at === 0 ? 0.8 : 0.4} />
          <line x1={left} y1={y(at)} x2={left + side} y2={y(at)} stroke="var(--muted)" strokeWidth={at === 0 ? 1 : 0.5} opacity={at === 0 ? 0.8 : 0.4} />
          <text x={x(at)} y={top + side + 14} textAnchor="middle" className="map-tick">{at}</text>
          <text x={left - 6} y={y(at) + 3} textAnchor="end" className="map-tick">{at}</text>
        </g>
      ))}
      {points.map((one, at) => (
        <circle key={at} cx={x(one.phi!)} cy={y(one.psi!)} r="3" fill="var(--bionet-yours)" opacity="0.75">
          <title>{`${one.name} ${one.at}: φ ${one.phi!.toFixed(0)}°, ψ ${one.psi!.toFixed(0)}°`}</title>
        </circle>
      ))}
      <text x={left + side / 2} y={top + side + 30} textAnchor="middle" className="map-note">φ {text.degrees}</text>
      <text x={12} y={top + side / 2} textAnchor="middle" transform={`rotate(-90 12 ${top + side / 2})`} className="map-note">ψ {text.degrees}</text>
    </svg>
  );
}
