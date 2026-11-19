/**
 * Lining two sequences up against each other, and reading an alignment somebody else made.
 *
 * The alignment itself is `@biolibs/align`'s `PairwiseAligner`, and the counting is its own
 * `counts()`, so nothing here re-derives what the library already knows. What this file does is turn
 * an alignment into columns a page can draw, and work out which rows of a file are an alignment.
 */
import { type Alignment, PairwiseAligner, substitutionMatrices } from "@biolibs/align";

/** How two sequences are scored against each other. */
export interface Scoring {
  /** `"global"` lines the whole of both up; `"local"` finds the best-matching stretch. */
  mode: "global" | "local";
  /** What a matching pair of letters is worth, when no matrix is used. */
  match: number;
  /** What a mismatched pair costs. */
  mismatch: number;
  /** What starting a gap costs. */
  openGap: number;
  /** What making an existing gap one longer costs. */
  extendGap: number;
  /** A substitution matrix to score by instead of match and mismatch, or `null` for neither. */
  matrix: string | null;
}

/** The scoring most people start from: a simple match and mismatch with affine gaps. */
export const DEFAULT_SCORING: Scoring = { mode: "global", match: 1, mismatch: -1, openGap: -2, extendGap: -0.5, matrix: null };

/** The substitution matrices the libraries carry, by name. */
export const MATRICES: readonly string[] = substitutionMatrices.loadNames();

/** One column of an alignment: a letter from each sequence, and what the pair amounts to. */
export interface Column {
  target: string;
  query: string;
  /** `"same"` for two equal letters, `"different"` for two unequal ones, `"gap"` where one is missing. */
  kind: "same" | "different" | "gap";
  /** Where this column's letters are in each sequence, counted from 1, or `null` for a gap. */
  at: { target: number | null; query: number | null };
}

/** An alignment, in the plain values a page needs. */
export interface Aligned {
  score: number;
  /** Which algorithm the library chose from the settings. */
  algorithm: string;
  /** How many alignments share the best score. There can be an enormous number. */
  equallyGood: string;
  columns: Column[];
  /** The library's own count of what the alignment is made of. */
  identities: number;
  mismatches: number;
  /** Columns where one sequence has a letter and the other does not. */
  gaps: number;
  /** The share of aligned columns that match, from 0 to 1. */
  identity: number;
}

/** What came of trying to align two sequences. */
export type Attempt = { ok: true; aligned: Aligned } | { ok: false; error: string };

/** The aligner, set up from a page's settings. */
function alignerFrom(scoring: Scoring): PairwiseAligner {
  const aligner = new PairwiseAligner();
  aligner.mode = scoring.mode;
  if (scoring.matrix === null) {
    aligner.match = scoring.match;
    aligner.mismatch = scoring.mismatch;
  } else {
    aligner.substitutionMatrix = substitutionMatrices.loadMatrix(scoring.matrix);
  }
  aligner.openGapScore = scoring.openGap;
  aligner.extendGapScore = scoring.extendGap;
  return aligner;
}

/** An alignment's columns, read out of the indices the library gives. */
function columnsOf(alignment: Alignment, target: string, query: string): Column[] {
  const [top, bottom] = alignment.indices as unknown as number[][];
  const columns: Column[] = [];
  for (let at = 0; at < top.length; at += 1) {
    // An index of -1 means this sequence has nothing in this column: it is a gap.
    const a = top[at] === -1 ? null : target[top[at]] ?? "";
    const b = bottom[at] === -1 ? null : query[bottom[at]] ?? "";
    columns.push({
      target: a ?? "-", query: b ?? "-",
      kind: a === null || b === null ? "gap" : a.toUpperCase() === b.toUpperCase() ? "same" : "different",
      at: { target: top[at] === -1 ? null : top[at] + 1, query: bottom[at] === -1 ? null : bottom[at] + 1 },
    });
  }
  return columns;
}

/**
 * Line two sequences up.
 *
 * @param target - The first sequence, written along the top.
 * @param query - The second, written underneath.
 * @param scoring - What a match, a mismatch and a gap are worth.
 * @returns The best alignment, or why there is none.
 */
export function alignPair(target: string, query: string, scoring: Scoring): Attempt {
  if (target === "" || query === "") return { ok: false, error: "empty" };
  try {
    const alignments = alignerFrom(scoring).align(target, query);
    const [best] = alignments;
    if (best === undefined) return { ok: false, error: "none" };
    const counts = best.counts();
    const columns = columnsOf(best, target, query);
    const lettersAligned = counts.identities + counts.mismatches;
    return {
      ok: true,
      aligned: {
        score: Number(best.score),
        algorithm: alignerFrom(scoring).algorithm,
        equallyGood: String(alignments.length),
        columns,
        identities: counts.identities,
        mismatches: counts.mismatches,
        gaps: columns.filter((column) => column.kind === "gap").length,
        identity: lettersAligned === 0 ? 0 : counts.identities / lettersAligned,
      },
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** A sequence as it appears in an alignment, gaps and all. */
export interface Row {
  name: string;
  /** The letters, with `-` where the alignment has a gap. */
  letters: string;
}

/** An alignment of more than two sequences, with what each column amounts to. */
export interface Many {
  rows: Row[];
  /** The length of every row, which is the same for all of them. */
  columns: number;
  /** The commonest letter in each column, with `-` where a gap wins. */
  consensus: string;
  /** How settled each column is: the share of rows holding the commonest letter, from 0 to 1. */
  conservation: number[];
  /** How many columns every row agrees on. */
  identical: number;
}

/**
 * Read rows that are already aligned, as a Clustal or Stockholm file holds them.
 *
 * Nothing is aligned here. The rows arrive lined up, and this works out what each column says.
 *
 * @param rows - The sequences, every one the same length.
 * @returns The alignment, or `null` when the rows are not all the same length.
 */
export function readAlignment(rows: readonly Row[]): Many | null {
  if (rows.length < 2) return null;
  const columns = rows[0].letters.length;
  if (columns === 0 || rows.some((row) => row.letters.length !== columns)) return null;
  const consensus: string[] = [];
  const conservation: number[] = [];
  let identical = 0;
  for (let at = 0; at < columns; at += 1) {
    const letters = rows.map((row) => row.letters[at].toUpperCase());
    const counts = new Map<string, number>();
    for (const letter of letters) counts.set(letter, (counts.get(letter) ?? 0) + 1);
    const [best, count] = [...counts].sort((a, b) => b[1] - a[1])[0];
    consensus.push(best);
    conservation.push(count / rows.length);
    if (count === rows.length && best !== "-") identical += 1;
  }
  return { rows: [...rows], columns, consensus: consensus.join(""), conservation, identical };
}

/**
 * An alignment written as FASTA, which is the format every alignment program reads.
 *
 * @param rows - The aligned sequences.
 * @returns The text of the file.
 */
export function alignmentFasta(rows: readonly Row[]): string {
  return `${rows.map((row) => `>${row.name}\n${(row.letters.match(/.{1,60}/g) ?? []).join("\n")}`).join("\n")}\n`;
}
