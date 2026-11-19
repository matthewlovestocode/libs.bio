/**
 * A PCR worked out with the real packages: the primers, where they bind, and what they would copy.
 *
 * Everything here is a plain function of its arguments, so the tool, the page that shows the code
 * and the tests all get the same answer from the same place.
 */
import { type Band, type GelType, type Ladder, bandsOf, gelById, ladderBands, ladderById } from "@biolibs/gel";
import { type BindingSite, type PrimerPair, type PrimerReport, type Product, checkPrimer, cleanPrimer, designPrimers, findBindingSites, predictProducts, primerProblem, productSequence, tmDifference } from "@biolibs/pcr";

/** One primer, as the tool shows it. */
export interface PrimerResult {
  /** What it is called: `forward` or `reverse`. */
  name: "forward" | "reverse";
  /** The primer, cleaned, written 5′ to 3′. */
  sequence: string;
  /** Why it cannot be used at all, or `null` when it can. */
  problem: string | null;
  /** What is known about it, when it can be used. */
  report: PrimerReport | null;
  /** Everywhere it binds the template. More than one place is a warning in itself. */
  sites: BindingSite[];
}

/** One product, with its bases. */
export interface ProductResult extends Product {
  sequence: string;
}

/** A PCR, worked out. */
export interface Pcr {
  length: number;
  circular: boolean;
  primers: [PrimerResult, PrimerResult];
  /** How far apart the two melting temperatures are, in °C, when both primers can be used. */
  tmGap: number | null;
  /** A temperature to anneal at: a few degrees under the lower melting temperature. */
  anneal: number | null;
  /** Everything the pair would copy, shortest first. One is what you want. */
  products: ProductResult[];
  gel: GelType;
  ladder: Ladder;
  /** The products' lane. */
  bands: Band[];
  /** The ladder's lane. */
  ladderLane: Band[];
}

/** How many degrees under the lower melting temperature to anneal. A common rule of thumb. */
export const ANNEAL_BELOW = 5;

/**
 * Design a pair of primers that copies a stretch of the template.
 *
 * @param dna - The template, in DNA letters.
 * @param from - The first base to copy, counted from 1.
 * @param to - The last base to copy, counted from 1.
 * @returns The pair, or `null` when no acceptable pair starts and ends there.
 * @throws If the stretch is not inside the template or is too short for two primers.
 */
export function design(dna: string, from: number, to: number): PrimerPair | null {
  // The package counts from 0 and leaves the end out, as a slice does.
  return designPrimers(dna, from - 1, to);
}

/**
 * Work out a PCR.
 *
 * @param dna - The template, in DNA letters.
 * @param forward - The forward primer, 5′ to 3′.
 * @param reverse - The reverse primer, 5′ to 3′.
 * @param options.circular - Whether the template is a circle.
 * @param options.mismatches - How many mismatched bases a primer may have and still be taken to
 *   bind. The last five bases at its 3′ end must always match.
 * @param options.gel - The gel's id, from `GELS` in `@biolibs/gel`.
 * @returns The primers, where they bind, the products and the gel.
 */
export function pcr(dna: string, forward: string, reverse: string, options: { circular: boolean; mismatches: number; gel: string }): Pcr {
  const topology = options.circular ? "circular" : "linear";
  const binding = { maxMismatches: options.mismatches };
  const one = (name: "forward" | "reverse", typed: string): PrimerResult => {
    const sequence = cleanPrimer(typed);
    const problem = sequence === "" ? "No primer yet." : primerProblem(sequence);
    return { name, sequence, problem, report: problem === null ? checkPrimer(sequence) : null, sites: problem === null && dna !== "" ? findBindingSites(dna, topology, sequence, binding) : [] };
  };
  const primers: [PrimerResult, PrimerResult] = [one("forward", forward), one("reverse", reverse)];
  const usable = primers.every((primer) => primer.problem === null);
  const found = usable && dna !== ""
    ? predictProducts(dna, topology, primers.map((primer) => ({ name: primer.name, sequence: primer.sequence })), binding)
    : [];
  const products = found.map((product) => ({ ...product, sequence: productSequence(dna, product) }));
  const [first, second] = primers;
  const tmGap = first.report !== null && second.report !== null ? tmDifference(first.report, second.report) : null;
  const gel = gelById(options.gel);
  const ladder = ladderById(gel.smallest >= 250 ? "1kb" : "100bp");
  return {
    length: dna.length, circular: options.circular, primers, tmGap,
    anneal: first.report !== null && second.report !== null ? Math.min(first.report.tm, second.report.tm) - ANNEAL_BELOW : null,
    products, gel, ladder, bands: bandsOf(products.map((product) => product.length), gel), ladderLane: ladderBands(ladder.sizes, gel),
  };
}

/**
 * The products of a PCR as a FASTA file, shortest first.
 *
 * @param result - A PCR.
 * @param name - What to call the template in each header.
 * @returns The file's text.
 */
export function productsFasta(result: Pcr, name: string): string {
  return result.products.map((product, i) => {
    const header = `>${name}_product_${i + 1} ${product.length} bp, bases ${product.start + 1}..${product.end > result.length ? product.end - result.length : product.end}, ${product.forward}/${product.reverse}`;
    return `${header}\n${product.sequence.match(/.{1,70}/g)?.join("\n") ?? ""}\n`;
  }).join("");
}
