/**
 * Putting pieces of DNA together: cutting a vector and an insert and ligating them, and joining
 * fragments that overlap.
 *
 * The working is all `@biolibs/cloning`'s. This turns what a page has, letters in a box and a list
 * of enzyme names, into the records that package wants, and turns what it gives back into plain
 * values a component can draw without knowing anything about records.
 */
import { assembleGibson, type CloneProduct, cloneProducts, cuttersUpTo, cutsIn, designGibson, type GibsonProduct, lookupEnzymes, parseEnzymeNames, piecesOf } from "@biolibs/cloning";
import { Seq } from "@biolibs/seq";
import { residuesOf } from "@biolibs/seqedit";
import { CompoundLocation, SeqFeature, SimpleLocation } from "@biolibs/seqfeature";
import { SeqRecord } from "@biolibs/seqrecord";
import { cleanSequence } from "@/lib/digest.ts";
import { type FeatureRecord, featuresOf } from "@/lib/files.ts";

export { parseEnzymeNames };

/** The most fragments a Gibson assembly may be given, as the package allows. */
export const MOST_FRAGMENTS = 8;

/** What a page knows about a molecule: letters, a name, a shape, and whatever its file marked on it. */
export interface Molecule {
  name: string;
  dna: string;
  circular: boolean;
  features: FeatureRecord[];
}

/**
 * A molecule as a record the cloning package can work with.
 *
 * @param molecule - The molecule.
 * @returns A record with its features and its topology.
 */
export function recordFrom(molecule: Molecule): SeqRecord {
  const features = molecule.features
    .filter((feature) => feature.parts.length > 0 && feature.parts.every((part) => part.start >= 0 && part.end <= molecule.dna.length && part.end > part.start))
    .map((feature) => {
      const strand = feature.strand === 1 || feature.strand === -1 ? feature.strand : 0;
      const parts = feature.parts.map((part) => new SimpleLocation(part.start, part.end, strand));
      const location = parts.length === 1 ? parts[0] : new CompoundLocation(parts);
      return new SeqFeature(location, feature.type, feature.label, new Map([["label", [feature.label]]]));
    });
  return new SeqRecord(new Seq(cleanSequence(molecule.dna)), molecule.name, molecule.name, "", [], features,
    new Map<string, unknown>([["molecule_type", "DNA"], ["topology", molecule.circular ? "circular" : "linear"]]));
}

/** One piece a digest gives, in the plain values a table shows. */
export interface PieceReport {
  length: number;
  /** Where it started in what it was cut from, counted from 1. */
  from: number;
  /** The enzyme that made each end, or `null` for an end the molecule already had. */
  left: string | null;
  right: string | null;
  /** Whether it runs across the origin of a circle. */
  wraps: boolean;
  /** What the features on it are called. */
  carries: string[];
}

/** What cutting a molecule gives. */
export interface Digest {
  pieces: PieceReport[];
  /** How many times each enzyme cuts. */
  cuts: { enzyme: string; count: number }[];
  /** The names that are not enzymes. */
  unknown: string[];
}

/**
 * Cut a molecule and say what the pieces are.
 *
 * @param molecule - The molecule to cut.
 * @param enzymeNames - The enzymes to cut it with.
 * @returns The pieces and the cut counts. A molecule nothing cuts gives no pieces when it is a
 *   circle, and itself when it is a line.
 */
export function digestOf(molecule: Molecule, enzymeNames: readonly string[]): Digest {
  const { enzymes, unknown } = lookupEnzymes(enzymeNames);
  if (molecule.dna === "" || enzymes.length === 0) return { pieces: [], cuts: [], unknown };
  const record = recordFrom(molecule);
  const cuts = cutsIn(cleanSequence(molecule.dna), molecule.circular ? "circular" : "linear", enzymes);
  const counts = new Map<string, number>();
  for (const enzyme of enzymes) counts.set(enzyme.name, 0);
  for (const cut of cuts) counts.set(cut.enzyme, (counts.get(cut.enzyme) ?? 0) + 1);
  const pieces = piecesOf(record, enzymes).map((piece) => ({
    length: piece.length, from: piece.start + 1, left: piece.left.enzyme, right: piece.right.enzyme, wraps: piece.wraps,
    carries: featuresOf(piece.record).map((feature) => feature.label),
  }));
  return { pieces, cuts: [...counts].map(([enzyme, count]) => ({ enzyme, count })), unknown };
}

/** One circle a cloning or an assembly gives. */
export interface Product {
  name: string;
  length: number;
  dna: string;
  features: FeatureRecord[];
  /** A sentence naming what went into it. */
  description: string;
  /** Which way round the insert went, for a ligation. */
  orientation?: string;
  /** What joins the pieces: the enzymes for a ligation, the overlaps for an assembly. */
  junctions: { label: string; detail: string }[];
}

/** What came of a cloning. */
export type Attempt = { ok: true; products: Product[] } | { ok: false; error: string };

/** A product worked out from one of the package's records. */
function productOf(record: SeqRecord, name: string, description: string, junctions: Product["junctions"], orientation?: string): Product {
  const dna = residuesOf(record);
  return { name, length: dna.length, dna, features: featuresOf(record), description, junctions, ...(orientation === undefined ? {} : { orientation }) };
}

/**
 * Cut a vector and an insert with the same enzymes and list the circles they can be ligated into.
 *
 * @param vector - The backbone, which has to be a circle.
 * @param insert - What is going into it.
 * @param enzymeNames - The enzymes, both molecules cut with the same ones.
 * @returns The products, the biggest backbone first, or why there are none.
 */
export function ligate(vector: Molecule, insert: Molecule, enzymeNames: readonly string[]): Attempt {
  if (vector.dna === "" || insert.dna === "") return { ok: false, error: "empty" };
  const result = cloneProducts(recordFrom(vector), recordFrom(insert), enzymeNames);
  if (!result.ok) return result;
  return {
    ok: true,
    products: result.products.map((product: CloneProduct, index) => productOf(
      product.record, `${vector.name}_${insert.name}${index > 0 ? `_${index + 1}` : ""}`, product.description,
      [
        { label: `${product.vector.right.enzyme ?? "blunt"} · ${product.insert.left.enzyme ?? "blunt"}`, detail: product.insert.left.overhang },
        { label: `${product.insert.right.enzyme ?? "blunt"} · ${product.vector.left.enzyme ?? "blunt"}`, detail: product.insert.right.overhang },
      ],
      product.orientation)),
  };
}

/**
 * The enzymes that cut both molecules a workable number of times: once in the vector, so it opens in
 * one place, and once or twice in the insert. These are the ones worth offering.
 *
 * @param vector - The backbone.
 * @param insert - What is going into it.
 * @param offered - The enzymes to consider.
 * @returns The names that cut the vector once and the insert at least once.
 */
export function usable(vector: Molecule, insert: Molecule, offered: readonly string[]): string[] {
  if (vector.dna === "" || insert.dna === "") return [];
  const { enzymes } = lookupEnzymes(offered);
  const once = (molecule: Molecule, most: number) => new Set(cuttersUpTo(cutsIn(cleanSequence(molecule.dna), molecule.circular ? "circular" : "linear", enzymes), most));
  const inVector = once(vector, 1), inInsert = once(insert, 2);
  return offered.filter((name) => inVector.has(name) && inInsert.has(name));
}

/** One fragment going into an assembly. */
export interface Fragment {
  name: string;
  dna: string;
}

/**
 * Find the circles a set of overlapping fragments can be assembled into.
 *
 * @param fragments - The fragments, two to eight of them.
 * @param minOverlap - The shortest overlap to accept, in bases.
 * @returns The circles, shortest first, or why there are none.
 */
export function assemble(fragments: readonly Fragment[], minOverlap: number): Attempt {
  const usableOnes = fragments.filter((fragment) => cleanSequence(fragment.dna).length > 0);
  if (usableOnes.length < 2) return { ok: false, error: "fewer than two" };
  const result = assembleGibson(usableOnes.map((fragment) => ({ name: fragment.name, residues: cleanSequence(fragment.dna) })), { minOverlap });
  if (!result.ok) return result;
  return {
    ok: true,
    products: result.products.map((product: GibsonProduct, index) => productOf(
      product.record, `assembly${index > 0 ? `_${index + 1}` : ""}`, product.description,
      product.junctions.map((junction) => ({ label: `${junction.from} → ${junction.to}`, detail: `${junction.length} bp, ${junction.tm.toFixed(0)} °C` })))),
  };
}

/** One primer to order, and what it is made of. */
export interface Primer {
  name: string;
  /** The 5′ tail that supplies the overlap. Empty when this primer carries none. */
  tail: string;
  /** The part that binds the template, which is what sets the annealing temperature. */
  binding: string;
  sequence: string;
  tm: number;
}

/** A plan for making fragments overlap. */
export type Plan =
  | { ok: true; primers: Primer[]; junctions: { label: string; detail: string }[]; length: number; warnings: string[] }
  | { ok: false; error: string };

/**
 * Design the primers that would give fragments the overlaps they need, in the order they are listed.
 *
 * @param fragments - The fragments, in the order they are to go round the circle.
 * @param overlap - How long each overlap should be, in bases.
 * @returns The primers to order, or why they cannot be designed.
 */
export function planOverlaps(fragments: readonly Fragment[], overlap: number): Plan {
  const usableOnes = fragments.filter((fragment) => cleanSequence(fragment.dna).length > 0);
  if (usableOnes.length < 2) return { ok: false, error: "fewer than two" };
  const result = designGibson(usableOnes.map((fragment) => ({ name: fragment.name, residues: cleanSequence(fragment.dna) })), { overlap });
  if (!result.ok) return result;
  return {
    ok: true,
    length: result.design.length,
    warnings: result.design.warnings,
    primers: result.design.primers.map((primer) => ({ name: primer.name, tail: primer.tail, binding: primer.binding, sequence: primer.sequence, tm: primer.binding_report.tm })),
    junctions: result.design.junctions.map((junction) => ({ label: `${junction.from} → ${junction.to}`, detail: `${junction.length} bp, ${junction.tm.toFixed(0)} °C` })),
  };
}

/**
 * A product written as FASTA.
 *
 * @param product - The product.
 * @returns The text of a one-record file.
 */
export function productFasta(product: Product): string {
  const wrapped = product.dna.match(/.{1,60}/g) ?? [];
  return `>${product.name} ${product.length} bp circular\n${wrapped.join("\n")}\n`;
}

/**
 * The primers written as FASTA, which is what an ordering form takes.
 *
 * @param primers - The primers.
 * @returns The text of the file.
 */
export function primersFasta(primers: readonly Primer[]): string {
  return `${primers.map((primer) => `>${primer.name} ${primer.sequence.length} bases\n${primer.sequence}`).join("\n")}\n`;
}
