"use client";

import { LETTERS, type Built } from "@/lib/motif.ts";
import { messages } from "@/messages/index.ts";

/** How tall two bits of information are drawn, in units of the drawing. */
const PER_BIT = 52;

/** How wide one position is. */
const PER_COLUMN = 30;

/** The colour each base is drawn in, the same four the sequences use everywhere else. */
const COLOURS: Record<string, string> = { A: "var(--base-a)", C: "var(--base-c)", G: "var(--base-g)", T: "var(--base-t)" };

/**
 * A sequence logo: one stack of letters per position, as tall as that position is telling.
 *
 * A position where only one letter ever appears is two bits tall; one where anything goes has no
 * height at all. Within a stack, each letter's share of the height is its share of the instances, so
 * the commonest sits on top. It is the standard way of drawing a motif, and it says in one picture
 * what a table of counts says in twenty numbers.
 *
 * @param props.built - The motif.
 */
export function SequenceLogo({ built }: { built: Built }) {
  const text = messages().motifs;
  const left = 30, top = 10, bottom = 22;
  const height = PER_BIT * 2, width = left + built.length * PER_COLUMN + 10;

  return (
    <svg viewBox={`0 0 ${width} ${top + height + bottom}`} role="img" aria-label={text.logoAlt(built.degenerate, built.length)} className="seq-logo">
      {[0, 1, 2].map((bits) => (
        <g key={bits}>
          <line x1={left - 4} y1={top + height - bits * PER_BIT} x2={width - 8} y2={top + height - bits * PER_BIT}
                stroke="var(--muted)" strokeWidth="0.5" opacity={bits === 0 ? 0.8 : 0.3} />
          <text x={left - 8} y={top + height - bits * PER_BIT + 3} textAnchor="end" className="map-tick">{bits}</text>
        </g>
      ))}
      <text x={10} y={top + height / 2} textAnchor="middle" transform={`rotate(-90 10 ${top + height / 2})`} className="map-note">{text.bits}</text>

      {built.columns.map((column, at) => {
        // The tallest letter goes on top, so the stack is read downwards.
        const ordered = [...LETTERS].sort((a, b) => column.shares[a] - column.shares[b]);
        let base = top + height;
        return (
          <g key={at}>
            {ordered.map((letter) => {
              const tall = column.shares[letter] * column.information * PER_BIT;
              if (tall < 0.4) return null;
              base -= tall;
              // A letter is drawn at one size and squashed to the height it has earned.
              return (
                <text key={letter} x={left + at * PER_COLUMN + PER_COLUMN / 2} y={0} className="logo-letter" fill={COLOURS[letter]}
                      transform={`translate(0 ${base + tall}) scale(1 ${tall / PER_BIT})`} style={{ fontSize: `${PER_BIT}px` }}
                      textAnchor="middle">{letter}</text>
              );
            })}
            <text x={left + at * PER_COLUMN + PER_COLUMN / 2} y={top + height + 14} textAnchor="middle" className="map-tick">{at + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}
