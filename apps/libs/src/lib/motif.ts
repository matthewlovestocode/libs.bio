/**
 * Building a motif out of a handful of instances, and looking for it in a sequence.
 *
 * The matrices, the scoring and the scanning are `@biolibs/motifs`'. What this file adds is the
 * information content of each position, which is what a sequence logo draws, worked out from the
 * library's own frequencies.
 */
import { ScoreDistribution, create } from "@biolibs/motifs";
import { Seq } from "@biolibs/seq";
import { cleanSequence } from "@/lib/digest.ts";

/** The four letters, in the order every matrix here is written in. */
export const LETTERS = ["A", "C", "G", "T"] as const;

/** How many ways the scan can be set. */
export interface Settings {
  /** What is added to every count, so that a letter never seen does not score as impossible. */
  pseudocounts: number;
  /** The share of the background that is G or C, which the motif is scored against. */
  backgroundGc: number;
  /** The score a window must reach to count as a hit. */
  threshold: number;
}

/** What most people start with: half a count everywhere, an even background. */
export const DEFAULT_SETTINGS: Settings = { pseudocounts: 0.5, backgroundGc: 0.5, threshold: 4 };

/** One position of a motif. */
export interface Column {
  /** How many of each letter were seen here. */
  counts: Record<string, number>;
  /** The share of each letter, once the pseudocounts are in. */
  shares: Record<string, number>;
  /**
   * How much this position tells you, in bits, from 0 when every letter is equally likely to 2 when
   * only one ever appears. It is what sets a letter's height in a sequence logo.
   */
  information: number;
}

/** A motif, in the plain values a page needs. */
export interface Built {
  /** How long it is. */
  length: number;
  /** How many instances it was built from. */
  instances: number;
  /** The commonest letter at each position. */
  consensus: string;
  /** The same, written with the ambiguity codes, which is how a motif is usually published. */
  degenerate: string;
  columns: Column[];
  /** The best and worst score a window could get. */
  best: number;
  worst: number;
  /** The score an average piece of background would get, and how much scores vary around it. */
  mean: number;
  deviation: number;
  /** Scores worth using as a threshold, worked out by the library. */
  thresholds: { falsePositive: number; patser: number };
}

/** One place the motif was found. */
export interface Hit {
  /** Where it starts, counted from 1 along the sequence as written. */
  at: number;
  /** Which strand it is on. */
  strand: "forward" | "reverse";
  /** The score the window reached. */
  score: number;
  /** The letters there, as the sequence is written. */
  letters: string;
}

/** What came of building a motif. */
export type Attempt = { ok: true; built: Built; scan: (target: string, threshold: number) => Hit[] } | { ok: false; error: string };

/** A number out of whatever shape the library gives it in. */
const asNumber = (value: unknown): number => Number(value);

/**
 * Build a motif from its instances.
 *
 * @param instances - The sequences the motif was seen as, all the same length.
 * @param settings - The pseudocounts and the background to score against.
 * @returns The motif and a way to scan with it, or why it could not be built.
 */
export function buildMotif(instances: readonly string[], settings: Settings): Attempt {
  const tidy = instances.map((one) => cleanSequence(one)).filter((one) => one !== "");
  if (tidy.length < 2) return { ok: false, error: "too few" };
  const length = tidy[0].length;
  if (tidy.some((one) => one.length !== length)) return { ok: false, error: "different lengths" };
  try {
    const motif = create(tidy.map((one) => new Seq(one)));
    motif.pseudocounts = settings.pseudocounts;
    motif.background = settings.backgroundGc;
    const pwm = motif.pwm, pssm = motif.pssm, counted = motif.counts;
    if (counted === null || pwm === null || pssm === null) return { ok: false, error: "no matrix" };

    const columns: Column[] = [];
    for (let at = 0; at < length; at += 1) {
      const counts: Record<string, number> = {}, shares: Record<string, number> = {};
      let entropy = 0;
      for (const letter of LETTERS) {
        counts[letter] = asNumber(counted.get(letter, at));
        const share = asNumber(pwm.row(letter)[at]);
        shares[letter] = share;
        if (share > 0) entropy -= share * Math.log2(share);
      }
      // With four letters, a position that could be anything carries 2 bits of uncertainty. What is
      // left once the uncertainty is taken away is what the position tells you.
      columns.push({ counts, shares, information: Math.max(0, 2 - entropy) });
    }

    const distribution = new ScoreDistribution(500, pssm, motif.background);
    const built: Built = {
      length, instances: tidy.length,
      consensus: String(motif.consensus),
      degenerate: String(motif.degenerateConsensus),
      columns,
      best: asNumber(pssm.max), worst: asNumber(pssm.min),
      mean: asNumber(pssm.mean(motif.background)), deviation: asNumber(pssm.std(motif.background)),
      thresholds: { falsePositive: asNumber(distribution.thresholdFpr(0.001)), patser: asNumber(distribution.thresholdPatser()) },
    };

    /** Look for the motif in a sequence, on both strands. */
    const scan = (target: string, threshold: number): Hit[] => {
      const dna = cleanSequence(target);
      if (dna.length < length) return [];
      const hits: Hit[] = [];
      for (const [where, score] of pssm.search(new Seq(dna), threshold) as Iterable<[number, number]>) {
        // The library counts a hit on the other strand back from the end, as a negative number.
        const forward = where >= 0;
        const start = forward ? where : dna.length + where;
        hits.push({
          at: start + 1, strand: forward ? "forward" : "reverse",
          score: asNumber(score), letters: dna.slice(start, start + length),
        });
      }
      return hits.sort((a, b) => b.score - a.score);
    };

    return { ok: true, built, scan };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * The motif written out as a counts matrix, which is how one is usually passed around.
 *
 * @param built - The motif.
 * @returns The text of a file, in the plain format every program reads.
 */
export function countsMatrix(built: Built): string {
  const rows = LETTERS.map((letter) => `${letter}  ${built.columns.map((column) => String(column.counts[letter]).padStart(4)).join("")}`);
  return `>${built.consensus} ${built.instances} instances\n${rows.join("\n")}\n`;
}
