/**
 * Measuring a sequence and reading it as protein.
 *
 * The transformations and the genetic codes are `@biolibs/seq`'s and the measurements are
 * `@biolibs/seqtools`'. What is this file's own is the frame arithmetic: which stretch of a sequence
 * each of the six frames covers, and where an open reading frame starts and stops once it has been
 * translated.
 */
import { CodonTable, Seq, translate } from "@biolibs/seq";
import { countChar, gcFraction, gcSkew, molecularWeight } from "@biolibs/seqtools";
import { cleanSequence } from "@/lib/digest.ts";

/** A genetic code, as NCBI numbers and names them. */
export interface Code {
  id: number;
  name: string;
}

/**
 * Every genetic code the libraries carry, in NCBI's order.
 *
 * @returns The 27 codes, each with its id and its first name.
 */
export function codes(): Code[] {
  return [...CodonTable.unambiguousDnaById]
    .sort(([a], [b]) => a - b)
    .map(([id, table]) => ({ id, name: table.names?.[0] ?? String(id) }));
}

/**
 * The codons a genetic code begins and ends on.
 *
 * @param id - The code, as NCBI numbers them.
 * @returns Its start and stop codons, or empty lists for a code that is not there.
 */
export function codonsOf(id: number): { starts: string[]; stops: string[] } {
  const table = CodonTable.unambiguousDnaById.get(id);
  return { starts: [...(table?.startCodons ?? [])], stops: [...(table?.stopCodons ?? [])] };
}

/** What a sequence is made of. */
export interface Measured {
  length: number;
  /** How many of each base, in the order A, C, G, T, with anything else counted as other. */
  counts: { base: string; count: number }[];
  other: number;
  /** The share that is G or C, from 0 to 1. */
  gc: number;
  /** Which strand has more G than C, over the whole sequence. */
  skew: number;
  /** The mass in daltons, as a single strand and as a double one. */
  single: number | null;
  double: number | null;
}

/**
 * Measure a sequence.
 *
 * @param dna - The sequence, in DNA letters.
 * @returns Its length, what it is made of, and what it would weigh.
 */
export function measure(dna: string): Measured {
  const bases = ["A", "C", "G", "T"];
  const counts = bases.map((base) => ({ base, count: countChar(dna, base) }));
  const weigh = (double: boolean): number | null => {
    try { return molecularWeight(dna, "DNA", double); } catch { return null; }
  };
  return {
    length: dna.length,
    counts,
    other: dna.length - counts.reduce((sum, one) => sum + one.count, 0),
    gc: dna.length === 0 ? 0 : gcFraction(dna),
    skew: dna.length === 0 ? 0 : (gcSkew(dna, Math.max(dna.length, 1))[0] ?? 0),
    single: weigh(false),
    double: weigh(true),
  };
}

/** The four ways of writing the same molecule out. */
export interface Forms {
  /** The sequence as given, which is the top strand read 5′ to 3′. */
  given: string;
  /** The other strand, written under the first, so it reads 3′ to 5′. */
  complement: string;
  /** The other strand written the way it would be on its own, 5′ to 3′. */
  reverseComplement: string;
  /** The RNA the top strand would be transcribed into. */
  rna: string;
}

/**
 * The same molecule written four ways.
 *
 * @param dna - The sequence, in DNA letters.
 * @returns Each form.
 */
export function forms(dna: string): Forms {
  const sequence = new Seq(dna);
  return {
    given: dna,
    complement: String(sequence.complement()),
    reverseComplement: String(sequence.reverseComplement()),
    rna: String(sequence.transcribe()),
  };
}

/** One of the six ways of reading a sequence in threes. */
export interface Frame {
  /** 1, 2 or 3 reading the top strand, and −1, −2 or −3 reading the other one. */
  number: number;
  /** The protein, with `*` where a stop codon is. */
  protein: string;
  /** How many stop codons it runs into. */
  stops: number;
  /** The DNA this frame reads, which is the strand it is on with the first bases dropped. */
  dna: string;
  /** Where in the sequence as given that DNA starts, 0-based. */
  offset: number;
}

/**
 * Read a sequence in all six frames.
 *
 * Three start one, two and three bases in along the strand as given. The other three do the same on
 * the other strand, which is read the other way round.
 *
 * @param dna - The sequence, in DNA letters.
 * @param code - Which genetic code to use, as NCBI numbers them.
 * @returns The six frames, the forward ones first.
 * @throws Never: a sequence with letters no code knows comes back with `X` in the protein.
 */
export function frames(dna: string, code: number): Frame[] {
  const other = String(new Seq(dna).reverseComplement());
  return [1, 2, 3, -1, -2, -3].map((number) => {
    const strand = number > 0 ? dna : other;
    const offset = Math.abs(number) - 1;
    // Translation needs whole codons, so anything left over at the end is dropped.
    const reading = strand.slice(offset, offset + Math.floor((strand.length - offset) / 3) * 3);
    let protein = "";
    try { protein = translate(reading, code); } catch { protein = ""; }
    return { number, protein, stops: countChar(protein, "*"), dna: reading, offset };
  });
}

/** A stretch that could be a gene: a start codon, some amino acids, and a stop. */
export interface Orf {
  frame: number;
  /** The protein it would make, without the stop. */
  protein: string;
  /** How many amino acids that is. */
  length: number;
  /** Where it begins and ends in the sequence as given, counted from 1. */
  from: number;
  to: number;
  /** Whether it runs off the end without meeting a stop codon. */
  openEnded: boolean;
}

/**
 * The open reading frames in a sequence: every stretch from a start codon to a stop.
 *
 * The frames and the codons are the library's; the scanning is this file's. A stretch is reported
 * once, from its first start codon, since a later start inside the same stretch gives a shorter
 * version of the same protein.
 *
 * @param dna - The sequence, in DNA letters.
 * @param code - Which genetic code to use.
 * @param shortest - The fewest amino acids worth reporting.
 * @param circular - Whether the molecule is a circle, in which case a frame carries on past the end.
 * @returns The stretches, longest first.
 */
export function orfs(dna: string, code: number, shortest: number, circular: boolean): Orf[] {
  if (dna.length < 6) return [];
  // On a circle a reading frame can run through the origin, so the sequence is read one and a bit
  // times round and anything starting past the end is dropped.
  const read = circular ? dna + dna.slice(0, Math.min(dna.length, 3000)) : dna;
  const found: Orf[] = [];
  for (const frame of frames(read, code)) {
    const forward = frame.number > 0;
    let at = 0;
    while (at < frame.protein.length) {
      const start = frame.protein.indexOf("M", at);
      if (start === -1) break;
      const stop = frame.protein.indexOf("*", start);
      const end = stop === -1 ? frame.protein.length : stop;
      const length = end - start;
      if (length >= shortest) {
        // Back from amino acids to bases: each one is three, after the frame's own offset.
        const firstBase = frame.offset + start * 3;
        const lastBase = frame.offset + end * 3 - 1;
        const [from, to] = forward
          ? [firstBase, lastBase]
          // A reverse frame was read along the other strand, so its positions count back from the end.
          : [read.length - 1 - lastBase, read.length - 1 - firstBase];
        if (from < dna.length) {
          found.push({
            frame: frame.number, protein: frame.protein.slice(start, end), length,
            from: (from % dna.length) + 1, to: (to % dna.length) + 1, openEnded: stop === -1,
          });
        }
      }
      at = end + 1;
    }
  }
  return found.sort((a, b) => b.length - a.length);
}

/** One codon and what it reads as. */
export interface Codon {
  bases: string;
  acid: string;
  /** Where the codon starts in the frame's own DNA, 0-based. */
  at: number;
}

/**
 * A frame split into codons, so each amino acid can be shown under the three bases that make it.
 *
 * @param frame - The frame.
 * @param most - How many codons to take.
 * @returns The codons, in order.
 */
export function codonsIn(frame: Frame, most: number): Codon[] {
  const out: Codon[] = [];
  for (let at = 0; at + 3 <= frame.dna.length && out.length < most; at += 3) {
    out.push({ bases: frame.dna.slice(at, at + 3), acid: frame.protein[at / 3] ?? "", at });
  }
  return out;
}

/**
 * A protein written as FASTA.
 *
 * @param name - What the sequence is called.
 * @param frame - Which frame it was read in.
 * @param protein - The amino acids.
 * @returns The text of a one-record file.
 */
export function proteinFasta(name: string, frame: number, protein: string): string {
  const wrapped = protein.match(/.{1,60}/g) ?? [];
  return `>${name}_frame${frame > 0 ? `+${frame}` : frame} ${protein.length} aa\n${wrapped.join("\n")}\n`;
}

/** Tidy what somebody typed into DNA letters, the same way every tool does. */
export { cleanSequence };
