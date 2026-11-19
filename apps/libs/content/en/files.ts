/**
 * The Understand view of the reading and converting files topic, in English.
 *
 * Three versions, as every topic has: one that assumes nothing, one that assumes school biology, and
 * one for somebody who already uses Biopython.
 */
import type { Lesson, Level } from "../../src/lib/lesson.ts";

const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to this",
    hint: "Starts from what a sequence file is. No jargon assumed.",
    sections: [
      {
        heading: "A sequence has to be written down somehow",
        paragraphs: [
          "A piece of DNA, written out, is a string of the letters A, C, G and T. A computer could store just that, but then you would have the letters and nothing else: not what the sequence is called, not where it came from, not which part of it is a gene.",
          "So people invented file formats: agreed ways of writing the letters down along with everything else worth keeping. A sequence file is a text file with that agreement applied to it.",
        ],
        figure: "fasta",
      },
      {
        heading: "There are an awful lot of them",
        paragraphs: [
          "There is no single format. There are dozens, because each was invented by whoever needed one, for whatever program they were writing at the time, and once people had files in a format it could never be taken away.",
          "The libraries behind this site read forty-nine of them and write twenty-six. That is not a boast; it is a description of the mess.",
        ],
      },
      {
        heading: "Simple ones and rich ones",
        paragraphs: [
          "At the simple end is FASTA: a line with a name on it, then the letters. That is all. Everybody reads it, which is exactly because it holds so little.",
          "At the other end is GenBank, which holds the name, a description, what the organism was, whether the molecule is a circle, and a list of every gene and site marked on it with its exact position. The file in this tool's sample is a GenBank file, which is why it has anything to show.",
        ],
        figure: "feature",
      },
      {
        heading: "Converting loses things",
        paragraphs: [
          "Changing a file from one format to another is not like changing a photo from one picture format to another. If the format you are converting into cannot hold something, that something is not squeezed down. It is dropped.",
          "Save a GenBank file as FASTA and every gene marked on it is gone. The letters are still right, and nothing warns you. Next week you open your FASTA file and wonder where your annotations went.",
        ],
      },
      {
        heading: "This tool shows you the bill",
        paragraphs: [
          "Pick a format to convert into and the tool tells you what survived and what did not. It does not do this from a table of what each format can hold. It writes the file out, reads it straight back in, and compares the two.",
          "That is worth doing because the answer depends on your file, not only on the format. A file with nothing marked on it loses nothing by becoming a FASTA file.",
        ],
      },
      {
        heading: "Quality scores",
        paragraphs: [
          "A sequencing machine does not simply report a letter. It reports a letter and how sure it is. That confidence is a quality score, one per letter, and it is the thing that tells you which parts of a read to trust.",
          "FASTQ files hold the letters and the scores together. Nearly nothing else does. Load the sample reads in this tool and try converting them to FASTA to see a whole column of information disappear in one click.",
        ],
        figure: "fastq",
      },
    ],
    analogy: {
      picture: "Formats are like saving a document. Keep it in its own format and your headings, comments and tracked changes stay. Save it as plain text and you still have every word, but the structure is gone for good.",
      breaksDown: "A word processor usually warns you. Sequence formats do not: the conversion succeeds, the file looks fine, and what is missing is only missing.",
    },
    remember: [
      "A sequence file holds the letters plus whatever else the format allows.",
      "FASTA holds almost nothing; GenBank holds a great deal.",
      "Converting into a simpler format drops what it cannot hold, silently.",
      "Quality scores live in FASTQ files and almost nowhere else.",
    ],
  },
  {
    id: "some",
    label: "I know some bioinformatics",
    hint: "Assumes FASTA and GenBank. Covers what each format can carry and where they bite.",
    sections: [
      {
        heading: "What a record is",
        paragraphs: [
          "Whatever format it came from, a record is the same handful of things: an identifier, a name, a description, the sequence, a set of annotations about the whole molecule, a list of features with positions, and optionally a value per letter such as a quality score.",
          "A format is a choice about which of those it writes down. Reading is the act of filling that structure in; writing is the act of throwing away whatever the target cannot express.",
        ],
        figure: "feature",
      },
      {
        heading: "The families",
        paragraphs: [
          "The flat-file family, GenBank and EMBL and IMGT, carries everything: features with compound locations, molecule type, topology, references. The FASTA family carries an identifier and a description line, and nothing else.",
          "The read family, FASTQ in its three encodings plus QUAL and PHD, carries per-letter quality but no features. The alignment family, Clustal and Stockholm and NEXUS and PHYLIP, requires every record to be the same length, because gaps are part of the data. Then there are the program formats, SnapGene and Gene Construction Kit and DNA Strider, which are binary and carry features.",
        ],
      },
      {
        heading: "Where they bite",
        paragraphs: [
          "FASTQ has three incompatible encodings of the same scores and the file does not say which it is. GenBank's LOCUS line is fixed-column and its identifier is traditionally limited to sixteen characters. Strict PHYLIP truncates names to ten characters, which silently makes two sequences share a name. The alignment formats refuse a set of unequal lengths outright, which at least is honest.",
          "Writing a format that needs something your record lacks fails rather than inventing it. Ask for FASTQ from a record with no quality and the library says so, naming the record.",
        ],
      },
      {
        heading: "Why converting is lossy in one direction",
        paragraphs: [
          "Conversions go downhill easily and uphill never. GenBank to FASTA is fine and instant; FASTA to GenBank gives you a GenBank file with no features, no topology and a guessed molecule type, which is not the same thing as the GenBank file you started with.",
          "The practical rule is to keep the richest version you have as the archive and treat everything else as a derived copy. The moment you let a FASTA file become your only copy, the annotation effort is gone.",
        ],
      },
      {
        heading: "The honest way to find out",
        paragraphs: [
          "Rather than consult a table of what each format supports, write the file and read it back. Round-tripping tells you what this particular file lost, including the things a table would not have thought to mention, such as a name being truncated or a description being folded into the identifier.",
          "That is what the tool does, which is why its answer changes when you load a different file.",
        ],
      },
    ],
    remember: [
      "Every format fills in the same record structure; they differ in what they write down.",
      "FASTQ's three encodings are indistinguishable from the file itself.",
      "A format that cannot hold what you have refuses, rather than inventing it.",
      "Keep the richest file as the archive; everything else is a derived copy.",
    ],
  },
  {
    id: "biopython",
    label: "I use Biopython",
    hint: "Bio.SeqIO, ported: what matches, and what a browser changes.",
    sections: [
      {
        heading: "The same five functions",
        paragraphs: [
          "`@biolibs/seqio` is a port of `Bio.SeqIO` and has its interface: `parse`, `read`, `write`, `toDict` and `convert`. `parse` yields `SeqRecord`s lazily, `read` insists on exactly one record, `write` returns the number written. Format names are the same lower-case strings, `\"genbank\"`, `\"fastq-illumina\"`, `\"phylip-relaxed\"`.",
          "Forty-nine formats can be read and twenty-six written, as in Biopython. The one difference worth knowing is that the first argument to `parse` is the file's **contents**, not a path: a browser has no file system to hand a name to.",
        ],
      },
      {
        heading: "Handles",
        paragraphs: [
          "Where Python passes an open file, this passes a handle: anything with a `write(text)` method. `StringHandle` collects text and `getvalue()` gives it back. Binary writers, SeqXML and nib and XDNA among them, want a handle that takes bytes; `BytesHandle` is that, and `isBinaryHandle` tells them apart.",
          "This is a thin shim, not a file system. Reading a file in a page means reading bytes from the file input and handing them over: text formats take a string, binary formats take a `Uint8Array`.",
        ],
      },
      {
        heading: "Records",
        paragraphs: [
          "Records are `@biolibs/seqrecord`'s `SeqRecord`, the Biopython class: `id`, `name`, `description`, `seq`, `features`, `annotations`, `letterAnnotations` and `dbxrefs`. Annotation keys are Biopython's, so topology is `annotations.get(\"topology\")` and quality is `letterAnnotations.get(\"phred_quality\")`.",
          "`letterAnnotations` keeps Biopython's restriction that every value must be the same length as the sequence, which is what stops a quality string drifting out of step with the bases it describes.",
        ],
      },
      {
        heading: "What this tool adds",
        paragraphs: [
          "The round-trip check is not part of the library. The page writes the records, parses the output again and compares the summaries, which is a dozen lines and worth copying: it answers what a given file loses, which no capability table can.",
          "SFF is left out of the offered outputs. Its writer needs the flow readings only an SFF file carries, so nothing else can become one, and offering it would be offering a trap.",
        ],
      },
    ],
  },
];

/** The lesson, whole. */
export const lesson: Lesson = {
  question: "What does a sequence file hold, and what does converting one cost?",
  levels,
  termSlugs: ["fasta", "fastq", "feature", "coordinates", "read", "sequencing", "plasmid"],
  tryIt: "Try it: open the sample plasmid, convert it to FASTA, and watch the features go →",
};
