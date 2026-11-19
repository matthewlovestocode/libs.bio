/**
 * Reading a sequence out of a file, in whichever format it is in.
 *
 * `@biolibs/seqio` does the reading. This decides which of its formats a file is, and turns what it
 * gives back into the plain thing a tool needs: a name, the bases, and whether it is a circle.
 * seqio is loaded only when a file is opened, so a page that never opens one does not carry it.
 */

/** A file format that can hold a DNA sequence and that `@biolibs/seqio` reads. */
export interface SequenceFormat {
  /** The name `@biolibs/seqio` knows it by. */
  id: string;
  /** What to call it. */
  label: string;
  /** File extensions, without the dot, that normally mean this format. */
  extensions: string[];
  /** How such a file begins, where that is enough to recognise it. */
  signature?: string;
  /** Whether it is bytes, not text. */
  binary?: boolean;
}

/**
 * Every format offered, in the order they are tried.
 *
 * Formats that hold only protein, or only quality scores, are left out: there is nothing in them to
 * cut. The alignment formats are in, since each row of an alignment is a sequence.
 */
export const SEQUENCE_FORMATS: readonly SequenceFormat[] = [
  { id: "snapgene", label: "SnapGene", extensions: ["dna"], binary: true },
  { id: "genbank", label: "GenBank", extensions: ["gb", "gbk", "gbff", "genbank", "ape"], signature: "LOCUS" },
  { id: "embl", label: "EMBL", extensions: ["embl"], signature: "ID " },
  { id: "fasta", label: "FASTA", extensions: ["fa", "fasta", "fna", "ffn", "fas", "seq"], signature: ">" },
  { id: "fastq", label: "FASTQ", extensions: ["fq", "fastq"], signature: "@" },
  { id: "abi", label: "Sanger trace (ABI)", extensions: ["ab1", "abi"], signature: "ABIF", binary: true },
  { id: "gck", label: "Gene Construction Kit", extensions: ["gck"], binary: true },
  { id: "xdna", label: "DNA Strider / Serial Cloner", extensions: ["xdna"], binary: true },
  { id: "imgt", label: "IMGT", extensions: ["imgt"] },
  { id: "seqxml", label: "SeqXML", extensions: ["seqxml"], binary: true },
  { id: "tab", label: "Tab-separated", extensions: ["tsv", "tab"] },
  { id: "phd", label: "PHD", extensions: ["phd"], signature: "BEGIN_SEQUENCE" },
  { id: "ig", label: "IntelliGenetics", extensions: ["ig", "mase"] },
  { id: "nib", label: "UCSC nib", extensions: ["nib"], binary: true },
  { id: "twobit", label: "UCSC 2bit", extensions: ["2bit"], binary: true },
  { id: "sff", label: "SFF", extensions: ["sff"], signature: ".sff", binary: true },
  { id: "gfa1", label: "GFA", extensions: ["gfa"] },
  { id: "ace", label: "ACE", extensions: ["ace"] },
  { id: "clustal", label: "Clustal", extensions: ["aln", "clustal"], signature: "CLUSTAL" },
  { id: "stockholm", label: "Stockholm", extensions: ["sto", "stk", "stockholm"], signature: "# STOCKHOLM" },
  { id: "nexus", label: "NEXUS", extensions: ["nex", "nxs", "nexus"], signature: "#NEXUS" },
  { id: "phylip", label: "PHYLIP", extensions: ["phy", "phylip"] },
  { id: "msf", label: "MSF", extensions: ["msf"] },
  { id: "maf", label: "MAF", extensions: ["maf"], signature: "##maf" },
  { id: "mauve", label: "XMFA (Mauve)", extensions: ["xmfa"] },
];

/** What a file picker should offer: every extension above, and plain text. */
export const ACCEPT = [...SEQUENCE_FORMATS.flatMap((format) => format.extensions.map((extension) => `.${extension}`)), ".txt", "text/plain"].join(",");

/** One sequence read out of a file. */
export interface FileRecord {
  /** What the file calls it. */
  name: string;
  /** The bases, in upper case, with alignment gaps taken out. */
  sequence: string;
  /** Whether the file says it is a circle. `null` when the file does not say. */
  circular: boolean | null;
}

/** A file, read. */
export interface OpenedFile {
  fileName: string;
  /** The format it was read as, or `null` when it was taken as plain text. */
  format: SequenceFormat | null;
  /** The sequences in it. Never empty. */
  records: FileRecord[];
  /** How many sequences the file holds, which may be more than were kept. */
  total: number;
}

/** The most sequences kept from one file. A file of reads can hold millions. */
export const MOST_RECORDS = 200;

/**
 * Say which format a file is, from its name and how it begins.
 *
 * @param fileName - The file's name.
 * @param bytes - Its contents.
 * @returns The format, or `null` when nothing recognises it.
 */
export function detectFormat(fileName: string, bytes: Uint8Array): SequenceFormat | null {
  const extension = fileName.includes(".") ? fileName.split(".").pop()!.toLowerCase() : "";
  const start = new TextDecoder().decode(bytes.slice(0, 32)).trimStart();
  return SEQUENCE_FORMATS.find((format) => extension !== "" && format.extensions.includes(extension))
    ?? SEQUENCE_FORMATS.find((format) => format.signature !== undefined && start.startsWith(format.signature))
    // A SnapGene file opens with a tab byte and its own name.
    ?? (bytes[0] === 0x09 && new TextDecoder().decode(bytes.slice(5, 13)) === "SnapGene" ? SEQUENCE_FORMATS[0] : null);
}

/**
 * Read the sequences out of a file.
 *
 * A file nothing recognises is taken as plain text: whatever letters are in it are the sequence.
 *
 * @param fileName - The file's name.
 * @param bytes - Its contents.
 * @returns The file's sequences.
 * @throws If the file is of a known format and cannot be read as it, or holds no sequence.
 */
export async function readSequenceFile(fileName: string, bytes: Uint8Array): Promise<OpenedFile> {
  const format = detectFormat(fileName, bytes);
  if (format === null) {
    const sequence = new TextDecoder().decode(bytes).split(/\r?\n/).join("").replace(/[\s\d]/g, "").toUpperCase();
    if (sequence === "") throw new Error("The file is empty.");
    return { fileName, format: null, records: [{ name: fileName, sequence, circular: null }], total: 1 };
  }
  const { parse } = await import("@biolibs/seqio");
  // Binary formats take bytes and text formats take a string, as in Biopython.
  const input = format.binary === true ? bytes : new TextDecoder().decode(bytes);
  const records: FileRecord[] = [];
  let total = 0;
  for (const record of parse(input, format.id)) {
    total += 1;
    if (records.length >= MOST_RECORDS) continue;
    let sequence: string;
    try {
      sequence = record.seq === null || record.seq === undefined ? "" : record.seq.toString().replace(/[-.]/g, "").toUpperCase();
    } catch {
      continue;      // a record that names a sequence without holding its letters
    }
    if (sequence === "") continue;
    const topology = record.annotations.get("topology");
    records.push({
      name: [record.name, record.id].find((one) => one !== null && one !== "" && !one.startsWith("<unknown")) ?? fileName,
      sequence,
      circular: topology === "circular" ? true : topology === "linear" ? false : null,
    });
  }
  if (records.length === 0) throw new Error("The file holds no sequence.");
  return { fileName, format, records, total };
}
