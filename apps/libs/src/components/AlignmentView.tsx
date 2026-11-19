"use client";

import type { Column } from "@/lib/align.ts";
import { messages } from "@/messages/index.ts";

/** How many columns go on one line before it wraps, as every alignment viewer does it. */
const PER_LINE = 50;

/** The last position either sequence reaches in a block, for the number at the end of the line. */
const lastAt = (block: Column[], which: "target" | "query"): number | null => {
  for (let at = block.length - 1; at >= 0; at -= 1) if (block[at].at[which] !== null) return block[at].at[which];
  return null;
};

/** The first position either sequence reaches in a block, for the number at the start of the line. */
const firstAt = (block: Column[], which: "target" | "query"): number | null => {
  for (const column of block) if (column.at[which] !== null) return column.at[which];
  return null;
};

/**
 * Two aligned sequences, written one above the other in blocks, with a line between them marking
 * what each column amounts to: a bar where they match, a dot where they differ, a space at a gap.
 *
 * @param props.columns - The alignment's columns.
 * @param props.names - What to call each sequence.
 */
export function AlignmentView({ columns, names }: { columns: Column[]; names: { target: string; query: string } }) {
  const text = messages().alignment;
  const blocks: Column[][] = [];
  for (let at = 0; at < columns.length; at += PER_LINE) blocks.push(columns.slice(at, at + PER_LINE));
  const number = (value: number | null) => (value === null ? "" : value.toLocaleString("en-US"));
  const width = Math.max(names.target.length, names.query.length, 8);
  const mark = (kind: Column["kind"]) => (kind === "same" ? "|" : kind === "different" ? "·" : " ");

  return (
    <div className="alignment" role="img" aria-label={text.viewAlt(names.target, names.query, columns.length)}>
      {blocks.map((block, at) => (
        <div className="align-block" key={at}>
          <div className="align-row">
            <span className="align-name" style={{ width: `${width}ch` }}>{names.target}</span>
            <span className="align-from">{number(firstAt(block, "target"))}</span>
            <span className="align-letters">
              {block.map((column, i) => <span key={i} className={`col ${column.kind}`}>{column.target}</span>)}
            </span>
            <span className="align-to">{number(lastAt(block, "target"))}</span>
          </div>
          <div className="align-row marks">
            <span className="align-name" style={{ width: `${width}ch` }} />
            <span className="align-from" />
            <span className="align-letters">{block.map((column, i) => <span key={i} className={`col ${column.kind}`}>{mark(column.kind)}</span>)}</span>
            <span className="align-to" />
          </div>
          <div className="align-row">
            <span className="align-name" style={{ width: `${width}ch` }}>{names.query}</span>
            <span className="align-from">{number(firstAt(block, "query"))}</span>
            <span className="align-letters">
              {block.map((column, i) => <span key={i} className={`col ${column.kind}`}>{column.query}</span>)}
            </span>
            <span className="align-to">{number(lastAt(block, "query"))}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * More than two sequences, already lined up, with a line under them showing how settled each column
 * is: a star where every row agrees, a colon where most do.
 *
 * @param props.rows - The aligned sequences.
 * @param props.conservation - How settled each column is, from 0 to 1.
 */
export function ManyView({ rows, conservation }: { rows: { name: string; letters: string }[]; conservation: number[] }) {
  const text = messages().alignment;
  const total = rows[0]?.letters.length ?? 0;
  const blocks: number[] = [];
  for (let at = 0; at < total; at += PER_LINE) blocks.push(at);
  const width = Math.max(...rows.map((row) => row.name.length), 8);
  const mark = (share: number) => (share === 1 ? "*" : share >= 0.7 ? ":" : share >= 0.5 ? "." : " ");
  const kindOf = (share: number) => (share === 1 ? "same" : share >= 0.5 ? "different" : "gap");

  return (
    <div className="alignment" role="img" aria-label={text.manyAlt(rows.length, total)}>
      {blocks.map((from) => (
        <div className="align-block" key={from}>
          {rows.map((row) => (
            <div className="align-row" key={row.name}>
              <span className="align-name" style={{ width: `${width}ch` }}>{row.name}</span>
              <span className="align-from">{from + 1}</span>
              <span className="align-letters">
                {[...row.letters.slice(from, from + PER_LINE)].map((letter, i) => (
                  <span key={i} className={`col ${kindOf(conservation[from + i] ?? 0)}`}>{letter}</span>
                ))}
              </span>
              <span className="align-to">{Math.min(from + PER_LINE, total)}</span>
            </div>
          ))}
          <div className="align-row marks">
            <span className="align-name" style={{ width: `${width}ch` }} />
            <span className="align-from" />
            <span className="align-letters">
              {conservation.slice(from, from + PER_LINE).map((share, i) => <span key={i} className="col">{mark(share)}</span>)}
            </span>
            <span className="align-to" />
          </div>
        </div>
      ))}
    </div>
  );
}
