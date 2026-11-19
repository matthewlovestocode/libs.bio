/**
 * Building blocks for the glossary diagrams, carried over from biolibs-site. Everything is plain SVG coloured with the site's CSS
 * variables, so a diagram follows the light and dark themes and renders on the server.
 *
 * Bases are always drawn as letters as well as colours, so colour is never the only cue.
 */
import type { ReactNode } from "react";

export const MONO = "var(--font-geist-mono), ui-monospace, monospace";
/** Width of one base in the default letter grid. */
export const CELL = 22;

const BASE_COLORS: Record<string, string> = {
  A: "var(--base-a)",
  T: "var(--base-t)",
  U: "var(--base-t)",
  G: "var(--base-g)",
  C: "var(--base-c)",
};

export const baseColor = (base: string) => BASE_COLORS[base.toUpperCase()] ?? "var(--muted)";

export interface FigureOptions {
  /** Render the bare drawing with no frame or caption, hidden from screen readers (for thumbnails). */
  decorative?: boolean;
}

/**
 * The frame around a diagram.
 *
 * @param description - What the picture shows, read out in place of the drawing.
 * @param caption - Visible text under the drawing; defaults to the description.
 */
export function Figure({
  width,
  height,
  description,
  caption,
  decorative,
  children,
}: FigureOptions & { width: number; height: number; description: string; caption?: ReactNode; children: ReactNode }) {
  if (decorative) {
    return <svg viewBox={`0 0 ${width} ${height}`} className="figure-thumb" aria-hidden="true">{children}</svg>;
  }
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
export function Letters({
  x,
  y,
  text,
  cell = CELL,
  size = 15,
  fill,
  opacity,
}: {
  x: number;
  y: number;
  text: string;
  cell?: number;
  size?: number;
  fill?: (char: string, index: number) => string;
  opacity?: (index: number) => number;
}) {
  return (
    <g fontFamily={MONO} fontSize={size} fontWeight={600} textAnchor="middle">
      {[...text].map((char, i) => (
        <text key={i} x={x + i * cell + cell / 2} y={y} fill={fill ? fill(char, i) : baseColor(char)} opacity={opacity ? opacity(i) : 1}>
          {char}
        </text>
      ))}
    </g>
  );
}

/** A text label. */
export function Note({
  x,
  y,
  children,
  anchor = "start",
  size = 11,
  fill = "var(--muted)",
  mono = false,
  bold = false,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  size?: number;
  fill?: string;
  mono?: boolean;
  bold?: boolean;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={fill} fontFamily={mono ? MONO : undefined} fontWeight={bold ? 600 : 400}>
      {children}
    </text>
  );
}

/** A straight arrow with a filled head at `to`. */
export function Arrow({
  from,
  to,
  color = "var(--muted)",
  width = 1.5,
  head = 6,
}: {
  from: [number, number];
  to: [number, number];
  color?: string;
  width?: number;
  head?: number;
}) {
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

/** A rounded label with text centred in it, used for amino acids. */
export function Pill({ x, y, width, text, height = 24 }: { x: number; y: number; width: number; text: string; height?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={height / 2} fill="var(--accent-soft)" />
      <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fontSize={12} fontFamily={MONO} fontWeight={600} fill="var(--accent)">
        {text}
      </text>
    </g>
  );
}

/** A block arrow for a feature on a sequence track, pointing along its strand. */
export function FeatureArrow({
  x,
  y,
  width,
  height = 16,
  direction = "right",
  color,
}: {
  x: number;
  y: number;
  width: number;
  height?: number;
  direction?: "right" | "left" | "none";
  color: string;
}) {
  const tip = Math.min(9, width / 2);
  const d =
    direction === "right"
      ? `M${x},${y} h${width - tip} l${tip},${height / 2} l${-tip},${height / 2} h${-(width - tip)} z`
      : direction === "left"
        ? `M${x + tip},${y} h${width - tip} v${height} h${-(width - tip)} l${-tip},${-height / 2} z`
        : `M${x},${y} h${width} v${height} h${-width} z`;
  return <path d={d} fill={color} opacity={0.9} />;
}
