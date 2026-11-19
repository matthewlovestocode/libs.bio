/**
 * The Understand view of the sequences and translation topic, in English.
 *
 * Three versions, as every topic has: one that assumes nothing, one that assumes school biology, and
 * one for somebody who already uses Biopython.
 */
import type { Lesson, Level } from "../../src/lib/lesson.ts";

const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to biology",
    hint: "Starts from what DNA spells. No jargon assumed.",
    sections: [
      {
        heading: "Two strands, each the other written backwards",
        paragraphs: [
          "DNA is two chains lying against each other. Wherever one has an A the other has a T, and wherever one has a G the other has a C. So if you know one chain you know the other: it is not extra information, it is the same information written the other way round.",
          "That is why this tool can show you the complement without being told it. It is also why the two chains are read in opposite directions, which matters more than it sounds.",
        ],
        figure: "dna",
      },
      {
        heading: "DNA has a direction",
        paragraphs: [
          "A strand of DNA is not symmetrical. Its two ends are chemically different, and everything that reads DNA reads it one way only: from the end called 5′ to the end called 3′.",
          "Because the two strands lie head to tail, reading one of them left to right means reading the other right to left. A sequence written in a file is the top strand, 5′ to 3′. The other strand is in there too, written backwards and swapped letter for letter.",
        ],
        figure: "five-three",
      },
      {
        heading: "Three letters make one amino acid",
        paragraphs: [
          "Proteins are chains of amino acids, and DNA is the instructions for building them. The translation is done three letters at a time: each group of three, a codon, names one amino acid.",
          "There are sixty-four possible codons and only about twenty amino acids, so most amino acids have several codons. Three codons name nothing at all: they mean stop, and that is where the protein ends.",
        ],
        figure: "codon",
      },
      {
        heading: "Where you start changes everything",
        paragraphs: [
          "Nothing separates one codon from the next. So where you begin counting decides how the whole sequence reads. Start one letter later and every codon after that is different, and the protein is unrecognisable.",
          "There are three places to start on this strand, and three on the other: six reading frames in all. The sequence itself does not tell you which is right. That is why the tool shows you all six and lets you compare.",
        ],
        figure: "reading-frame",
      },
      {
        heading: "Looking for something that could be a gene",
        paragraphs: [
          "If a frame is right, you would expect a long run with no stop codon in it, beginning with a start codon. Such a run is called an open reading frame.",
          "The tool finds them for you and lists the longest first. A long one is a good hint and nothing more: a real gene also needs a promoter in front of it telling the cell to read it, and this looks for no such thing.",
        ],
        figure: "open-reading-frame",
      },
      {
        heading: "Not everybody uses the same code",
        paragraphs: [
          "The codon table is nearly, but not quite, universal. Mitochondria, some yeasts and a number of single-celled organisms read a few codons differently, which is why there are twenty-seven tables and not one.",
          "If you translate a mitochondrial sequence with the standard table you get a protein with stop codons scattered through it. That is usually the first sign you have picked the wrong one.",
        ],
        figure: "genetic-code",
      },
    ],
    analogy: {
      picture: "A sequence is like a line of text with no spaces: THEFATCATSAT. Start at the beginning and read in threes and it makes sense; start one letter in and you get HEF ATC ATS AT, which does not.",
      breaksDown: "With English you can tell which reading is right because you know the words. With DNA you cannot: all six frames look equally plausible, and only a long stretch without a stop gives the game away.",
    },
    remember: [
      "The two strands carry the same information, written in opposite directions.",
      "Three letters make one amino acid; three codons mean stop.",
      "There are six ways to read a sequence, and it will not tell you which is right.",
      "An open reading frame is a candidate for a gene, not a gene.",
    ],
  },
  {
    id: "some",
    label: "I know some biology",
    hint: "Assumes codons and transcription. Covers frames, ORFs and when the table matters.",
    sections: [
      {
        heading: "What the tool actually computes",
        paragraphs: [
          "Complement, reverse complement and transcription are letter substitutions and cost nothing. Translation is a table lookup over non-overlapping triplets. GC content and molecular weight are sums. None of this is clever; what matters is getting the conventions right.",
          "The convention here is biolibs' throughout: a sequence is the top strand 5′ to 3′, positions count from 0 with the end left out, and the reverse strand's positions are still given on the top strand's numbering.",
        ],
        figure: "strand-direction",
      },
      {
        heading: "The six frames, concretely",
        paragraphs: [
          "Frames +1, +2 and +3 translate the sequence from offset 0, 1 and 2. Frames −1, −2 and −3 do the same to the reverse complement. A trailing partial codon is dropped, so a 100-base sequence gives 33, 33 and 32 amino acids in its three forward frames.",
          "Counting stop codons per frame is the cheapest useful signal: a coding frame has conspicuously few. In the sample plasmid, which is random sequence, all six frames are riddled with them, which is exactly what random DNA looks like.",
        ],
        figure: "reading-frame",
      },
      {
        heading: "Open reading frames and their limits",
        paragraphs: [
          "The tool scans each translated frame from each M to the next stop and reports stretches above a length you choose. In random sequence, stops turn up about every twenty-one codons, so a run of a hundred amino acids is already surprising. That is the whole statistical basis of the method.",
          "It says nothing about whether the thing is transcribed, whether the start codon is the one actually used, or whether a gene has introns, which in eukaryotes it very often does. For bacteria and plasmids it is a reasonable first pass; for a human genome it is not.",
        ],
        figure: "open-reading-frame",
      },
      {
        heading: "Circles",
        paragraphs: [
          "A plasmid has no beginning, so a reading frame can run through the origin, and a gene that does would be missed by a scan that stops at the end of the file. When the sequence is marked circular the tool reads past the origin and reports positions back in the original numbering.",
          "This is the same wrap that the maps tool draws as one arc from two pieces. It is the recurring awkwardness of circular DNA: the file is a line, the molecule is not.",
        ],
        figure: "coordinates",
      },
      {
        heading: "When the table matters",
        paragraphs: [
          "Mitochondrial codes are the usual case: in the vertebrate mitochondrial code TGA is tryptophan rather than a stop, and AGA and AGG are stops. Translate a mitochondrial gene with the standard table and the protein is cut short at the first TGA.",
          "Ciliates, some yeasts and several bacterial groups each have their own. The rule is to pick the table by what the sequence came from, never by what looks tidiest.",
        ],
        figure: "genetic-code",
      },
      {
        heading: "The measurements",
        paragraphs: [
          "GC content is the share of G and C, which tracks melting temperature and varies systematically between organisms. GC skew, which is (G − C) / (G + C), flips sign at a bacterial origin of replication, because the leading and lagging strands accumulate different substitutions.",
          "Molecular weight is reported double-stranded here, since that is what you have in a tube. The library will give the single strand too, and the two differ by rather more than a factor of two once you account for the water lost at each bond.",
        ],
        figure: "gc-content",
      },
    ],
    remember: [
      "Six frames: three offsets on each strand, trailing bases dropped.",
      "Few stop codons is the signal that a frame might be coding.",
      "An ORF is a statistical hint, not evidence of transcription.",
      "Pick the codon table by the sequence's source, not by the result.",
    ],
  },
  {
    id: "biopython",
    label: "I use Biopython",
    hint: "Bio.Seq and Bio.SeqUtils, ported, and what is this site's own.",
    sections: [
      {
        heading: "Bio.Seq, as it was",
        paragraphs: [
          "`@biolibs/seq` is `Bio.Seq`, `Bio.Data.CodonTable` and `Bio.Data.IUPACData`, verified against Biopython 1.88 by 23,556 recorded calls: results, exception types and messages, warnings, and object state after mutation. `Seq` and `MutableSeq` carry about ninety methods between them.",
          "Method names are the camelCase of Biopython's, and arguments keep Python's positional order, so `translate(seq, table, stopSymbol, toStop, cds, gap)` is the signature you already know. Python's operators become named methods: `add`, `mul`, `equals`, `contains`, `at`, `slice`.",
        ],
      },
      {
        heading: "Codon tables",
        paragraphs: [
          "`CodonTable` is a namespace with all twenty-seven NCBI codes in each of the six flavours: `unambiguousDnaById`, `ambiguousRnaByName` and the rest. A table carries `names`, `startCodons`, `stopCodons` and `forwardTable`, exactly as in Biopython.",
          "`translate` takes an id, a name or a table object. Passing `cds: true` enforces a proper start codon, a length divisible by three and a terminal stop, raising `TranslationError` otherwise, which is the right thing to use when you believe you have a coding sequence rather than a guess.",
        ],
        figure: "genetic-code",
      },
      {
        heading: "Bio.SeqUtils",
        paragraphs: [
          "`@biolibs/seqtools` is the port of `Bio.SeqUtils`: `gcFraction`, `gcSkew`, `gc123`, `molecularWeight`, `seq1` and `seq3`, `sixFrameTranslations`, `ProteinAnalysis`, `IsoelectricPoint`, `CodonAdaptationIndex`, `seguid`, the melting temperature functions and the rest.",
          "Note `gcFraction` returns 0 to 1, following Biopython's modern function rather than the old `GC` that returned a percentage. `gcSkew` takes a window and returns one value per window, so a whole-sequence figure means passing the length as the window.",
        ],
      },
      {
        heading: "What this page adds",
        paragraphs: [
          "The frame arithmetic and the ORF scan are the site's own, in `src/lib/sequence.ts`, and are about forty lines. Biopython has `sixFrameTranslations`, but it returns a formatted report meant for printing rather than values to compute with, so the frames are built here from `translate` and a slice.",
          "The circular handling is also this site's: the sequence is read one and a bit times round, stretches beginning past the end are dropped, and positions are brought back into the original numbering with a modulo.",
        ],
        figure: "coordinates",
      },
    ],
  },
];

/** The lesson, whole. */
export const lesson: Lesson = {
  question: "How does a string of letters become a protein?",
  levels,
  termSlugs: ["base", "base-pair", "complement", "reverse-complement", "strand-direction", "codon", "genetic-code", "reading-frame", "open-reading-frame", "translation", "transcription", "start-and-stop-codons", "gc-content", "amino-acid"],
  tryIt: "Try it: read the sample plasmid in all six frames and find its longest open frame →",
};
