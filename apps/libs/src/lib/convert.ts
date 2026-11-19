/**
 * Opening a sequence file in any format `@biolibs/seqio` reads, and writing it out in another.
 *
 * `src/lib/files.ts` reduces a file to the bases a tool needs. This keeps the whole record instead,
 * because converting is about everything a file carries and, more to the point, about what is lost
 * on the way out. What is lost is not listed from memory: the output is read back in and compared
 * with what went in.
 */
import { BytesHandle, StringHandle, parse, write } from "@biolibs/seqio";
import type { SeqRecord } from "@biolibs/seqrecord";
import { SEQUENCE_FORMATS, detectFormat, featuresOf } from "@/lib/files.ts";

/** A format a file can be written out in. */
export interface OutputFormat {
  /** The name `@biolibs/seqio` knows it by, which is also what to pass it. */
  id: string;
  label: string;
  /** What a file of it is normally called. */
  extension: string;
  /** Whether the writer gives bytes rather than text. */
  binary?: boolean;
  /** Whether every record has to be the same length, as an alignment is. */
  aligned?: boolean;
}

/**
 * The formats offered to write out.
 *
 * These are `@biolibs/seqio`'s 26 writable formats less SFF, which needs the flow readings only an
 * SFF file holds, so nothing else can be turned into one.
 */
export const OUTPUT_FORMATS: readonly OutputFormat[] = [
  { id: "fasta", label: "FASTA", extension: "fasta" },
  { id: "fasta-2line", label: "FASTA, one line per sequence", extension: "fasta" },
  { id: "genbank", label: "GenBank", extension: "gb" },
  { id: "embl", label: "EMBL", extension: "embl" },
  { id: "imgt", label: "IMGT", extension: "imgt" },
  { id: "fastq", label: "FASTQ (Sanger)", extension: "fastq" },
  { id: "fastq-illumina", label: "FASTQ (Illumina 1.3+)", extension: "fastq" },
  { id: "fastq-solexa", label: "FASTQ (Solexa)", extension: "fastq" },
  { id: "qual", label: "QUAL, quality scores alone", extension: "qual" },
  { id: "phd", label: "PHD", extension: "phd" },
  { id: "tab", label: "Tab-separated", extension: "tsv" },
  { id: "pir", label: "PIR / NBRF", extension: "pir" },
  { id: "clustal", label: "Clustal", extension: "aln", aligned: true },
  { id: "stockholm", label: "Stockholm", extension: "sto", aligned: true },
  { id: "nexus", label: "NEXUS", extension: "nex", aligned: true },
  { id: "phylip", label: "PHYLIP", extension: "phy", aligned: true },
  { id: "phylip-relaxed", label: "PHYLIP, long names", extension: "phy", aligned: true },
  { id: "phylip-sequential", label: "PHYLIP, one sequence at a time", extension: "phy", aligned: true },
  { id: "maf", label: "MAF", extension: "maf", aligned: true },
  { id: "mauve", label: "XMFA (Mauve)", extension: "xmfa", aligned: true },
  { id: "seqxml", label: "SeqXML", extension: "seqxml", binary: true },
  { id: "xdna", label: "DNA Strider / Serial Cloner", extension: "xdna", binary: true },
  { id: "nib", label: "UCSC nib", extension: "nib", binary: true },
];

/** What one record in a file holds. */
export interface RecordSummary {
  name: string;
  id: string;
  description: string;
  length: number;
  /** What the file says the molecule is: DNA, RNA, protein, or nothing. */
  molecule: string;
  /** `"circular"`, `"linear"`, or nothing when the file does not say. */
  topology: string;
  /** How many things are marked on it. */
  features: number;
  /** Whether it carries a quality score for every letter, as a read from a sequencer does. */
  quality: boolean;
}

/** A file, opened. */
export interface Opened {
  fileName: string;
  /** The format it was read as. */
  format: { id: string; label: string };
  /** The records themselves, kept so they can be written out again. */
  records: SeqRecord[];
  summaries: RecordSummary[];
  /** Whether every record is the same length, which the alignment formats need. */
  aligned: boolean;
}

/** A record's text, whatever shape the reader gives it, or `""` when it holds none. */
function lettersOf(record: SeqRecord): string {
  try {
    return record.seq === null || record.seq === undefined ? "" : record.seq.toString();
  } catch {
    return "";
  }
}

/** A description with the record's own name taken off the front, as readers often put it there. */
const describedAs = (description: string, name: string): string =>
  (name !== "" && description.startsWith(`${name} `) ? description.slice(name.length + 1) : description);

/** A value from a record that may be a placeholder like `<unknown description>`. */
const said = (value: unknown): string => (typeof value === "string" && value !== "" && !value.startsWith("<unknown") ? value : "");

/** What one record holds, in plain values. */
function summarise(record: SeqRecord): RecordSummary {
  const letters = lettersOf(record);
  const name = said(record.name) || said(record.id) || "unnamed";
  return {
    name,
    id: said(record.id),
    description: describedAs(said(record.description), name),
    length: letters.length,
    molecule: String(record.annotations.get("molecule_type") ?? ""),
    topology: String(record.annotations.get("topology") ?? ""),
    features: featuresOf(record).length,
    quality: [...record.letterAnnotations.keys()].some((key) => key.includes("quality")),
  };
}

/**
 * Open a file and keep everything in it.
 *
 * @param fileName - The file's name, which helps say what format it is.
 * @param bytes - Its contents.
 * @param asFormat - A format to read it as, where the visitor has overruled the guess.
 * @returns The records and what each one holds.
 * @throws If the format is not recognised, or the file cannot be read as it.
 */
export function openAnyFile(fileName: string, bytes: Uint8Array, asFormat?: string): Opened {
  const guessed = asFormat === undefined ? detectFormat(fileName, bytes) : SEQUENCE_FORMATS.find((one) => one.id === asFormat) ?? null;
  if (guessed === null) throw new Error("unknown format");
  const input = guessed.binary === true ? bytes : new TextDecoder().decode(bytes);
  const records = [...parse(input, guessed.id)];
  if (records.length === 0) throw new Error("no records");
  const summaries = records.map(summarise);
  return {
    fileName, format: { id: guessed.id, label: guessed.label }, records, summaries,
    aligned: summaries.length > 1 && summaries.every((one) => one.length === summaries[0].length),
  };
}

/** A file written out. */
export type Written =
  | { ok: true; text: string; bytes: Uint8Array; shown: boolean; count: number }
  | { ok: false; error: string };

/** Whether bytes are text a page can show, or something only a file should hold. */
const readable = (bytes: Uint8Array): boolean => !bytes.some((byte) => byte < 9 || (byte > 13 && byte < 32));

/**
 * Write records out in another format.
 *
 * @param records - The records, as `openAnyFile` gave them.
 * @param formatId - The format to write.
 * @returns The file, with whether it is worth showing on a page, or why it cannot be written.
 */
export function writeAs(records: readonly SeqRecord[], formatId: string): Written {
  const format = OUTPUT_FORMATS.find((one) => one.id === formatId);
  if (format === undefined) return { ok: false, error: "unknown format" };
  try {
    if (format.binary === true) {
      // The binary writers want a handle that takes bytes, which is what BytesHandle is. Some of
      // them, SeqXML among them, put text in it, so the bytes are shown when they turn out to be
      // readable.
      const handle = new BytesHandle();
      const count = write(records as SeqRecord[], handle as never, formatId);
      const bytes = new Uint8Array(handle.getvalue());
      const shown = readable(bytes);
      return { ok: true, bytes, text: shown ? new TextDecoder().decode(bytes) : "", shown, count };
    }
    const handle = new StringHandle();
    const count = write(records as SeqRecord[], handle, formatId);
    const text = handle.getvalue();
    return { ok: true, text, bytes: new TextEncoder().encode(text), shown: true, count };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** What survived a conversion, found by reading the result back in. */
export interface Survived {
  /** What the output holds, read back. */
  after: RecordSummary[];
  /** The things the file no longer carries. */
  lost: string[];
  /** The things it still carries. */
  kept: string[];
}

/** How many of a thing a set of records has between them. */
const totalOf = (summaries: readonly RecordSummary[], of: (one: RecordSummary) => number): number => summaries.reduce((sum, one) => sum + of(one), 0);

/**
 * Read a conversion's output back in and say what survived it.
 *
 * Nothing here is remembered about what a format can hold. The output is parsed again and compared
 * with what went in, so the answer is what this file actually lost, not what the format usually
 * loses.
 *
 * @param before - What the records held when they were opened.
 * @param written - The file that was written.
 * @param formatId - The format it was written in.
 * @returns What is still there and what has gone, in words.
 * @throws Never: a result that cannot be read back says so instead.
 */
export function survives(before: readonly RecordSummary[], written: Written, formatId: string): Survived | null {
  if (!written.ok) return null;
  let after: RecordSummary[];
  try {
    const format = OUTPUT_FORMATS.find((one) => one.id === formatId);
    const input = format?.binary === true ? written.bytes : written.text;
    after = [...parse(input, formatId)].map(summarise);
  } catch {
    return null;
  }
  const lost: string[] = [], kept: string[] = [];
  const check = (what: string, had: number, has: number) => {
    if (had === 0) return;
    (has < had ? lost : kept).push(has < had && has > 0 ? `${what} (${has} of ${had})` : what);
  };
  check("sequences", before.length, after.length);
  check("features", totalOf(before, (one) => one.features), totalOf(after, (one) => one.features));
  check("quality scores", totalOf(before, (one) => (one.quality ? 1 : 0)), totalOf(after, (one) => (one.quality ? 1 : 0)));
  check("whether it is a circle", totalOf(before, (one) => (one.topology === "" ? 0 : 1)), totalOf(after, (one) => (one.topology === "" ? 0 : 1)));
  check("descriptions", totalOf(before, (one) => (one.description === "" ? 0 : 1)), totalOf(after, (one) => (one.description === "" ? 0 : 1)));
  const sameNames = before.filter((one, at) => after[at] !== undefined && after[at].name === one.name).length;
  check("names", before.length, sameNames);
  const sameLength = before.filter((one, at) => after[at] !== undefined && after[at].length === one.length).length;
  check("every base", before.length, sameLength);
  return { after, lost, kept };
}

/**
 * What to call the file that comes out.
 *
 * @param fileName - What went in.
 * @param format - The format going out.
 * @returns The same name with the new format's extension.
 */
export function outputName(fileName: string, format: OutputFormat): string {
  const stem = fileName.includes(".") ? fileName.slice(0, fileName.lastIndexOf(".")) : fileName;
  return `${stem || "sequences"}.${format.extension}`;
}
