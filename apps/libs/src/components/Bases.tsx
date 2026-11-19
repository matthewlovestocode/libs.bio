import { Fragment } from "react";

/**
 * DNA, with each base in its own colour.
 *
 * The four bases have had their own colours since long before this site: green for A, red for T,
 * amber for G and blue for C, as on a sequencing trace. Letters that are not one of the four, and
 * the marks REBASE puts in a site to show where it is cut, are left as they are.
 */

/** Runs of one base, so a long sequence is a few thousand pieces and not one for every letter. */
const RUNS = /A+|C+|G+|T+|[^ACGT]+/g;

/**
 * @param props.text - A sequence, or something with one in it, such as `G^AATT_C`.
 * @returns The same text, with its bases coloured.
 */
export function Bases({ text }: { text: string }) {
  return (
    <>
      {(text.match(RUNS) ?? []).map((run, i) => {
        const base = run[0];
        return base === "A" || base === "C" || base === "G" || base === "T" ? <span key={i} className={`b-${base.toLowerCase()}`}>{run}</span> : <Fragment key={i}>{run}</Fragment>;
      })}
    </>
  );
}

/** A word in running text that is a sequence: four or more letters, all of them bases. */
const SEQUENCE_WORD = /\b[ACGT]{4,}\b/g;

/**
 * Colour the sequences mentioned in a sentence, such as GAATTC, and leave the rest alone.
 *
 * @param text - A stretch of plain text.
 * @returns The text, with any sequences in it coloured.
 */
export function withBases(text: string, key = "b"): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let from = 0;
  for (const found of text.matchAll(SEQUENCE_WORD)) {
    out.push(text.slice(from, found.index));
    out.push(<code key={`${key}-${found.index}`} className="bases"><Bases text={found[0]} /></code>);
    from = found.index + found[0].length;
  }
  out.push(text.slice(from));
  return out;
}
