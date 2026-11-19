/**
 * A restriction digest and the gel it would give, worked out with the real packages.
 *
 * Everything here is a plain function of its arguments, so the tool, the page that shows the code and
 * the tests all get the same answer from the same place.
 */
import { type Band, type GelType, type Ladder, bandsOf, fragmentSizes, gelById, ladderBands, ladderById } from "@biolibs/gel";
import { enzymes } from "@biolibs/restriction";
import { Seq } from "@biolibs/seq";

/** The enzymes offered as buttons. Any of the others can be added by name. */
export const COMMON_ENZYMES = ["EcoRI", "BamHI", "HindIII", "XbaI", "PstI", "SalI", "XhoI", "NotI", "KpnI", "SacI", "NcoI", "NdeI", "SmaI", "EcoRV"] as const;

/** Every enzyme there is, by name, in alphabetical order. */
export const ALL_ENZYME_NAMES: readonly string[] = Object.keys(enzymes).sort((a, b) => a.localeCompare(b));

/** What one enzyme does to the sequence. */
export interface EnzymeCuts {
  name: string;
  /** The site with the cut marked, as REBASE writes it: `G^AATT_C`. */
  pattern: string;
  /** Whether it leaves no overhang. */
  blunt: boolean;
  /** Where it cuts, as 0-based boundaries: the cut is before the base at this index. */
  cuts: number[];
}

/** One piece the digest leaves. */
export interface Fragment {
  /** Its length in base pairs. */
  size: number;
  /** Where it starts, 1-based, as a person would count. */
  from: number;
  /** Where it ends, 1-based and inclusive. */
  to: number;
  /** The enzyme that made its left end, or `null` for the end of a linear molecule. */
  left: string | null;
  /** The enzyme that made its right end, or `null` for the end of a linear molecule. */
  right: string | null;
}

/** A digest, and the gel it would give. */
export interface Digest {
  length: number;
  circular: boolean;
  enzymes: EnzymeCuts[];
  /** The pieces, largest first. */
  fragments: Fragment[];
  gel: GelType;
  ladder: Ladder;
  /** The digest's lane. Pieces too close to tell apart share a band. */
  bands: Band[];
  /** The ladder's lane. */
  ladderLane: Band[];
}

/** The letters a DNA sequence may be written in, ambiguity codes included. */
const DNA = /^[ACGTRYSWKMBDHVN]*$/;

/**
 * Take what somebody pasted and leave only the sequence.
 *
 * FASTA header lines, digits, spaces and line breaks are dropped, and letters are made upper case.
 *
 * @param text - What was pasted or read from a file.
 * @returns The bases.
 */
export function cleanSequence(text: string): string {
  return text.split(/\r?\n/).filter((line) => !line.startsWith(">") && !line.startsWith(";")).join("").replace(/[\s\d]/g, "").toUpperCase();
}

/**
 * @param dna - A cleaned sequence.
 * @returns The characters in it that are not DNA letters, each once.
 */
export function notDna(dna: string): string[] {
  return DNA.test(dna) ? [] : [...new Set(dna.replace(/[ACGTRYSWKMBDHVN]/g, ""))];
}

/**
 * Cut a sequence with some enzymes and run the pieces on a gel.
 *
 * @param dna - The sequence, in DNA letters.
 * @param names - The enzymes to cut with. Names not in REBASE are ignored.
 * @param options.circular - Whether the molecule is a circle. A circle cut once gives one piece.
 * @param options.gel - The gel's id, from `GELS` in `@biolibs/gel`.
 * @returns Where each enzyme cuts, the pieces, and the two lanes of the gel.
 */
export function digest(dna: string, names: readonly string[], options: { circular: boolean; gel: string }): Digest {
  const { circular } = options;
  const length = dna.length;
  const seq = new Seq(dna);
  const cutting: EnzymeCuts[] = names.filter((name) => name in enzymes).map((name) => {
    const enzyme = enzymes[name];
    // `search` answers as Biopython does: 1-based, the base after the cut. Its second argument is
    // whether the molecule is linear.
    const cuts = enzyme.search(seq, !circular).map((position) => (position - 1 + length) % length);
    return { name, pattern: enzyme.elucidate(), blunt: enzyme.isBlunt(), cuts: [...new Set(cuts)].sort((a, b) => a - b) };
  });

  const marks = cutting.flatMap((one) => one.cuts.map((at) => ({ at, name: one.name }))).sort((a, b) => a.at - b.at)
    .filter((mark, i, all) => i === 0 || all[i - 1].at !== mark.at);
  const fragments: Fragment[] = [];
  if (marks.length === 0) {
    if (length > 0) fragments.push({ size: length, from: 1, to: length, left: null, right: null });
  } else if (circular) {
    marks.forEach((mark, i) => {
      const next = marks[(i + 1) % marks.length];
      const size = i + 1 < marks.length ? next.at - mark.at : length - mark.at + next.at;
      fragments.push({ size, from: mark.at + 1, to: next.at === 0 ? length : next.at, left: mark.name, right: next.name });
    });
  } else {
    const edges = [{ at: 0, name: null as string | null }, ...marks.filter((mark) => mark.at > 0), { at: length, name: null as string | null }];
    for (let i = 0; i + 1 < edges.length; i++) {
      fragments.push({ size: edges[i + 1].at - edges[i].at, from: edges[i].at + 1, to: edges[i + 1].at, left: edges[i].name, right: edges[i + 1].name });
    }
  }
  fragments.sort((a, b) => b.size - a.size);

  const gel = gelById(options.gel);
  const ladder = ladderById(gel.smallest >= 250 ? "1kb" : "100bp");
  const sizes = length === 0 ? [] : fragmentSizes(length, circular ? "circular" : "linear", marks.map((mark) => mark.at));
  return { length, circular, enzymes: cutting, fragments, gel, ladder, bands: bandsOf(sizes, gel), ladderLane: ladderBands(ladder.sizes, gel) };
}
