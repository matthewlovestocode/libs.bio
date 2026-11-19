/**
 * The Understand view of the alignment topic, in English.
 *
 * Three versions, as every topic has: one that assumes nothing, one that assumes school biology, and
 * one for somebody who already uses Biopython.
 */
import type { Lesson, Level } from "../../src/lib/lesson.ts";

const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to this",
    hint: "Starts from why you would compare two sequences at all. No jargon assumed.",
    sections: [
      {
        heading: "Two sequences, nearly the same",
        paragraphs: [
          "Suppose you have the same gene from two bacteria, or the same gene before and after an experiment. They will be mostly identical and differ in a few places. Finding those places is the whole job.",
          "You cannot do it by reading the two strings side by side, because the moment one of them has a letter the other lacks, everything after that point is shifted along and nothing lines up any more.",
        ],
      },
      {
        heading: "Lining them up means inserting gaps",
        paragraphs: [
          "An alignment writes the two sequences one above the other and puts gaps in, shown as dashes, so that the parts that match sit in the same columns.",
          "Adding gaps is what makes the comparison possible. A gap says: this sequence has nothing here, because something was lost from it, or gained by the other one.",
        ],
        figure: "gap",
      },
      {
        heading: "There is more than one way to do it",
        paragraphs: [
          "You could always line two sequences up perfectly by filling them with enough gaps, and the result would be nonsense. So an alignment needs a way to say which arrangement is best.",
          "That is what the scores are for. A matching column earns points, a mismatched one loses some, and a gap costs more still. The alignment with the highest total wins, and it is found exactly, not guessed.",
        ],
      },
      {
        heading: "Why gaps cost two different amounts",
        paragraphs: [
          "Opening a gap costs more than making an existing gap one base longer. That is not an arbitrary choice: in real biology, one event usually removes a run of bases at once.",
          "So one gap of ten is far more likely than ten separate gaps of one, and the scoring is built to prefer the explanation that nature actually tends to produce.",
        ],
      },
      {
        heading: "End to end, or the best piece",
        paragraphs: [
          "Sometimes you want the whole of both sequences lined up, start to finish. That is called a global alignment, and it is right when the two are variants of the same thing.",
          "Sometimes only part of one matches part of the other: a short gene sitting inside a long plasmid, say. A local alignment finds the best-matching stretch and ignores everything outside it. Picking the wrong one of these two is the commonest way to get a useless answer.",
        ],
      },
      {
        heading: "Reading the result",
        paragraphs: [
          "The tool writes the two sequences one above the other with a line between them: a bar where the letters match, a dot where they differ, a space where one has a gap.",
          "The figure to look at is the percentage the same. Ninety-six per cent, as in the sample, means these two are clearly versions of one thing. Thirty per cent between two DNA sequences means nothing at all: with four letters, chance alone gets you twenty-five.",
        ],
        figure: "identity-and-similarity",
      },
    ],
    analogy: {
      picture: "It is like comparing two drafts of the same paragraph. Where one draft has an extra clause you leave a blank in the other, so the sentences that did not change still sit side by side and the edits stand out.",
      breaksDown: "With two drafts you know which came first and what was edited. With two sequences you do not: an alignment shows that they differ, never which one changed or in which direction.",
    },
    remember: [
      "An alignment inserts gaps so matching parts share a column.",
      "Scores decide which of the many possible alignments is best.",
      "Opening a gap costs more than extending one, because that is how biology makes them.",
      "End to end and best-stretch answer different questions.",
    ],
  },
  {
    id: "some",
    label: "I know some bioinformatics",
    hint: "Assumes the idea of alignment. Covers scoring, matrices and what identity means.",
    sections: [
      {
        heading: "What the algorithms actually do",
        paragraphs: [
          "Both modes fill a matrix where each cell is the best score for aligning two prefixes, then trace back. Needleman-Wunsch for global, Smith-Waterman for local, Gotoh when gaps are affine, Waterman-Smith-Beyer when the gap cost is an arbitrary function. The library picks from your settings and tells you which it chose.",
          "These give the optimal alignment for the scoring you gave, in time proportional to the product of the lengths. The optimum is exact; whether it is biologically right depends entirely on the scores, which are a model you chose.",
        ],
      },
      {
        heading: "Affine gaps",
        paragraphs: [
          "A gap of length n costs open + extend × (n − 1). With open at −2 and extend at −0.5, a ten-base gap costs 6.5 rather than 20 under a flat penalty, so the alignment is free to prefer one real indel over scattering mismatches.",
          "Changing the open cost changes the answer, often considerably. It is worth moving it in the tool and watching the alignment rearrange: that is the clearest demonstration that an alignment is a function of its scoring, not a fact about the sequences.",
        ],
        figure: "gap",
      },
      {
        heading: "Substitution matrices",
        paragraphs: [
          "For DNA a single match and mismatch score is usually fine. For protein it is not: leucine for isoleucine is nearly free, tryptophan for proline is not. A substitution matrix gives every pair its own log-odds score, derived from alignments people already trusted.",
          "BLOSUM62 is the usual default, built from blocks of protein no more than 62 per cent identical. The number is about the data it came from, not the divergence you are measuring: lower-numbered BLOSUMs suit more distant comparisons, which is the opposite of what most people assume.",
        ],
      },
      {
        heading: "Identity, and what it is worth",
        paragraphs: [
          "Percent identity depends on what you divide by: aligned columns, the shorter sequence, or the whole alignment including gaps. The tool divides matches by aligned letter pairs, which is the usual convention and should be stated whenever a figure is quoted.",
          "For protein, 30 per cent over a decent length is the rough threshold where homology becomes a reasonable claim. For DNA the floor is much higher, because four letters make chance agreement cheap. A short, high-identity local alignment is frequently just luck.",
        ],
        figure: "homology",
      },
      {
        heading: "How many alignments are optimal",
        paragraphs: [
          "Often more than one arrangement scores the same, and the library reports how many. It returns them lazily, as a count that can exceed what fits in an ordinary number, because the total can be astronomical.",
          "That matters when you take a gap's position seriously. If a thousand alignments tie, the one you are shown is the first in a defined traceback order, not a discovery about where the indel was.",
        ],
      },
      {
        heading: "More than two sequences",
        paragraphs: [
          "Optimal alignment of n sequences is exponential in n, so nobody does it exactly past three. Real multiple alignment is progressive or iterative and is a heuristic: Clustal, MUSCLE, MAFFT.",
          "This tool does not perform one. It reads an alignment some program already made and tells you what each column amounts to, which is the honest division of labour for something running in a browser tab.",
        ],
        figure: "alignment",
      },
    ],
    remember: [
      "The optimum is exact for your scoring; your scoring is a model.",
      "Affine gaps: open + extend × (n − 1), and the open cost changes the answer.",
      "BLOSUM's number describes its training data, not your divergence.",
      "Always say what percent identity was divided by.",
    ],
  },
  {
    id: "biopython",
    label: "I use Biopython",
    hint: "Bio.Align, ported, and what the browser cannot do.",
    sections: [
      {
        heading: "PairwiseAligner",
        paragraphs: [
          "`@biolibs/align` is `Bio.Align`, verified against Biopython 1.88 across 175 of 175 API items and 9,450 recorded cases, matching results, exception types and messages, warnings and order of evaluation. `PairwiseAligner` has the same attributes, so `mode`, `match`, `mismatch`, `openGapScore`, `extendGapScore`, `substitutionMatrix` and the end-gap variants all behave as you expect.",
          "`algorithm` reports the algorithm the settings imply, and `score` computes without building alignments. `align` returns a lazy `PairwiseAlignments` whose `length` is a bigint, because the number of optimal alignments can exceed any fixed-width integer.",
        ],
      },
      {
        heading: "Alignment objects",
        paragraphs: [
          "An `Alignment` is the sequences plus coordinates. `indices` gives one row per sequence with −1 for gaps, which is the easiest thing to draw from; `aligned` gives the gap-free blocks; `counts()` returns identities, mismatches, gaps and the score parts rather than making you count characters.",
          "Python's indexing becomes methods: `get(row, column)` for `aln[i, j]`, `get({ start: 1 }, 3)` for `aln[1:, 3]`. Operators become `add`, `equals`, `lt` and so on.",
        ],
      },
      {
        heading: "Matrices and formats",
        paragraphs: [
          "`substitutionMatrices.loadNames()` lists the thirty bundled matrices and `loadMatrix` loads one. Because a matrix is indexed by a pair, `getOr([\"W\", \"W\"], null)` takes an array where Python takes a tuple.",
          "`format(fmt)` writes an alignment in any of Biopython's alignment formats, but only once `@biolibs/seqio` has been imported: seqio depends on align and registers the writers into it when it loads, so the import cannot be done for you.",
        ],
      },
      {
        heading: "What is not here",
        paragraphs: [
          "`MultipleSeqAlignment` is a container, as in Biopython, not an aligner. Biopython shells out to Clustal or MUSCLE for that, and a browser tab cannot. So this topic aligns pairs and reads multiple alignments that arrive already made.",
          "`SummaryInfo` exists but is deprecated upstream, and the port deprecates it in step. Column access goes through `msa.alignment` and the `Alignment` API instead; the conservation line on this page is computed from the rows directly.",
        ],
      },
    ],
  },
];

/** The lesson, whole. */
export const lesson: Lesson = {
  question: "How do you compare two sequences that are not quite the same?",
  levels,
  termSlugs: ["alignment", "gap", "identity-and-similarity", "homology", "substitution-matrix", "mutation", "read"],
  tryIt: "Try it: line the two sample isolates up and find where they differ →",
};
