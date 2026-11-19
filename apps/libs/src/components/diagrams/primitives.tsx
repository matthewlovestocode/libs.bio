/**
 * Building blocks for the diagrams, carried over from biolibs-site. Everything is plain SVG coloured
 * with the site's CSS variables, so a diagram follows the light and dark themes and is drawn when
 * the site is built.
 *
 * Bases are always drawn as letters as well as colours, so colour is never the only cue.
 */
import type { ReactNode } from "react";

export const MONO = "var(--font-geist-mono), ui-monospace, monospace";
/** Width of one base in the default letter grid. */
export const CELL = 22;

const BASE_COLORS: Record<string, string> = { A: "var(--base-a)", T: "var(--base-t)", U: "var(--base-t)", G: "var(--base-g)", C: "var(--base-c)" };

export const baseColor = (base: string) => BASE_COLORS[base.toUpperCase()] ?? "var(--muted)";

/**
 * The frame around a diagram.
 *
 * @param props.description - What the picture shows, read out in place of the drawing.
 * @param props.caption - Visible text under the drawing; the description if left out.
 */
export function Figure({ width, height, description, caption, children }: { width: number; height: number; description: string; caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="figure">
      <div className="figure-scroll">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={description} style={{ maxWidth: width * 1.3, minWidth: Math.min(width, 280) }}>{children}</svg>
      </div>
      <figcaption>{caption ?? description}</figcaption>
    </figure>
  );
}

/** A run of sequence letters on a fixed grid, coloured by base. */
export function Letters({ x, y, text, cell = CELL, size = 15, opacity }: { x: number; y: number; text: string; cell?: number; size?: number; opacity?: (index: number) => number }) {
  return (
    <g fontFamily={MONO} fontSize={size} fontWeight={600} textAnchor="middle">
      {[...text].map((char, i) => <text key={i} x={x + i * cell + cell / 2} y={y} fill={baseColor(char)} opacity={opacity ? opacity(i) : 1}>{char}</text>)}
    </g>
  );
}

/** A text label. */
export function Note({ x, y, children, anchor = "start", size = 11, fill = "var(--muted)", mono = false, bold = false }:
  { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end"; size?: number; fill?: string; mono?: boolean; bold?: boolean }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={fill} fontFamily={mono ? MONO : undefined} fontWeight={bold ? 600 : 400}>{children}</text>;
}

/** A straight arrow with a filled head at `to`. */
export function Arrow({ from, to, color = "var(--muted)", width = 1.5, head = 6 }: { from: [number, number]; to: [number, number]; color?: string; width?: number; head?: number }) {
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const point = (a: number, d: number): string => `${to[0] - d * Math.cos(angle + a)},${to[1] - d * Math.sin(angle + a)}`;
  // Stop the shaft short of the tip so a thick line does not blunt the point.
  const end: [number, number] = [to[0] - head * 0.8 * Math.cos(angle), to[1] - head * 0.8 * Math.sin(angle)];
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={end[0]} y2={end[1]} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={`${to[0]},${to[1]} ${point(0.45, head * 1.4)} ${point(-0.45, head * 1.4)}`} fill={color} />
    </g>
  );
}
