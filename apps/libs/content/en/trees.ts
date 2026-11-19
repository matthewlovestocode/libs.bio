/**
 * The Understand view of the trees topic, in English.
 *
 * Three versions, as every topic has: one that assumes nothing, one that assumes school biology, and
 * one for somebody who already uses Biopython.
 */
import type { Lesson, Level } from "../../src/lib/lesson.ts";

const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to this",
    hint: "Starts from what a tree is a picture of. No jargon assumed.",
    sections: [
      {
        heading: "A family tree for species",
        paragraphs: [
          "Every living thing is descended from something else. Draw that descent and you get a tree: the tips are the things you have, the forks are the ancestors they came from, and the root is the one ancestor they all share.",
          "You cannot dig up those ancestors. The tree is a reconstruction, worked out from the only evidence available, which is how similar the living things are now.",
        ],
        figure: "phylogenetic-tree",
      },
      {
        heading: "Similar usually means related",
        paragraphs: [
          "Two sequences that differ in three places out of a hundred are probably close cousins. Two that differ in forty are probably not. Counting differences gives a distance between every pair, and the tree is built from those distances.",
          "That single idea gets you a long way, and the tool shows you the distances it used so you can see the tree is not conjured out of nothing.",
        ],
      },
      {
        heading: "Reading one correctly",
        paragraphs: [
          "What a tree says is who shares an ancestor with whom, and nothing else. Follow the lines back: two tips that meet at a nearby fork are close relatives, two that meet only at the root are distant ones.",
          "What it does not say is anything about the order the tips are printed in. A fork can be spun round like a mobile without changing its meaning, so two neighbours on the page need not be related at all. This is the commonest mistake people make with trees.",
        ],
        figure: "clade",
      },
      {
        heading: "Branch lengths",
        paragraphs: [
          "When the branches are drawn to length, a long branch means a lot of change along that line of descent. The scale bar at the bottom says how much.",
          "Long is not the same as old. A line that changed quickly gets a long branch in less time than a slow one, so length measures change, not years. Turn the lengths off in the tool and you get only the shape, which is sometimes the more honest picture.",
        ],
      },
      {
        heading: "The numbers on the forks",
        paragraphs: [
          "Trees often carry a number at each fork: 98, 86, and so on. It is a support value, and it comes from building the tree many times over from resampled versions of the data and counting how often that same grouping appeared.",
          "A high number means the data say this consistently. It does not mean the grouping is true: consistently misleading data give high support for the wrong answer. Treat anything under about 70 as not worth leaning on.",
        ],
        figure: "bootstrap",
      },
      {
        heading: "Where the root goes",
        paragraphs: [
          "Most methods cannot tell you which end of a tree is the beginning. They give you the shape, and someone has to decide where the root belongs.",
          "The usual trick is an outgroup: something you already know is more distantly related than anything else in the set. The root goes on the branch leading to it. The sample here has one, labelled as such, so you can see the effect.",
        ],
      },
    ],
    analogy: {
      picture: "It is like reconstructing a family tree from a room full of cousins by looking at who resembles whom. The siblings are obvious, the second cousins less so, and nobody in the room is an ancestor.",
      breaksDown: "Faces mix traits from both parents; sequences here are treated as passing down a single line. And a real family tree can be checked against the parish register. A phylogeny has no register: it is the best explanation of present-day differences, and it can be wrong.",
    },
    remember: [
      "A tree shows who shares an ancestor with whom, not the order of the tips.",
      "Branch length measures change, not time.",
      "A support value says how consistent the data are, not whether the answer is right.",
      "The root has to be placed, usually with an outgroup.",
    ],
  },
  {
    id: "some",
    label: "I know some biology",
    hint: "Assumes the idea of a phylogeny. Covers distance methods, their assumptions and their limits.",
    sections: [
      {
        heading: "Distance methods in one paragraph",
        paragraphs: [
          "Reduce the alignment to a matrix of pairwise distances, then build a tree from the matrix alone. The sequences are never looked at again, which is both the speed and the weakness of the approach: everything the columns said individually has been averaged away.",
          "The tool shows the matrix beside the tree deliberately. If two numbers in it look wrong, the tree cannot be right, and no amount of staring at the branches will show you that.",
        ],
      },
      {
        heading: "UPGMA and neighbour joining",
        paragraphs: [
          "UPGMA clusters the closest pair, replaces them with their average, and repeats. It produces an ultrametric tree: every tip ends up equidistant from the root, which is only correct if every lineage changed at the same steady rate.",
          "Neighbour joining drops that assumption. It chooses the pair to join by a criterion that corrects for how far each one is from everything else, so lineages that changed quickly get long branches. For most data it is the better default, and it is what the tool starts with.",
        ],
        figure: "phylogenetic-tree",
      },
      {
        heading: "Why the model matters",
        paragraphs: [
          "The simplest distance is the share of columns that differ. It underestimates: at a site that has changed twice you see one difference, or none. Correction models such as Jukes-Cantor or Kimura estimate the changes you cannot see, and the deeper the divergence the more they matter.",
          "The tool offers the library's 31 models. For closely related sequences they agree closely; the differences appear exactly where the uncorrected count has started to saturate.",
        ],
      },
      {
        heading: "Rooting, and what is unrooted",
        paragraphs: [
          "Neighbour joining produces an unrooted tree. Newick does not record whether a tree is rooted either, so a tree read from a file usually says `rooted: no` even when it was drawn with a root. A drawing has to put the root somewhere, and that placement is a presentational choice unless an outgroup justifies it.",
          "With an outgroup, the root goes on the branch that separates it. Without one, you can use midpoint rooting as a convention, and should say that is what you did.",
        ],
      },
      {
        heading: "Support, and what it is not",
        paragraphs: [
          "Bootstrap values come from resampling alignment columns with replacement, rebuilding, and counting how often each grouping recurs. They measure how consistently the data support a grouping, given the method; systematic error is invisible to them, and a biased method gives confidently wrong answers.",
          "Nothing here computes them. The library deliberately leaves out the functions that use Python's random number generator, so support values in this tool are ones your file already carried.",
        ],
        figure: "bootstrap",
      },
      {
        heading: "What a tree cannot tell you",
        paragraphs: [
          "A gene tree is not a species tree. Genes move sideways between bacteria, duplicate and are lost, and sort differently through populations, so one gene's history can honestly differ from the organisms'.",
          "Distance methods also cannot represent reticulation at all: recombination, hybridisation and lateral transfer are forced into a branching shape whether they fit it or not. If you suspect them, a tree is the wrong picture.",
        ],
        figure: "homology",
      },
    ],
    remember: [
      "Distance methods throw the columns away; check the matrix, not just the tree.",
      "UPGMA assumes a constant rate; neighbour joining does not.",
      "Correction models matter most where divergence is high.",
      "Unrooted is the default, and bootstrap measures consistency, not truth.",
    ],
  },
  {
    id: "biopython",
    label: "I use Biopython",
    hint: "Bio.Phylo, ported, and the one part that could not be.",
    sections: [
      {
        heading: "Trees and clades",
        paragraphs: [
          "`@biolibs/phylo` is `Bio.Phylo`, verified against Biopython 1.88 across 3,329 recorded cases, with the whole tree compared after every call so an edit that moves a clade it should not have is caught. `Bio.Phylo.BaseTree` is at 95 of 95 items, PhyloXML at 177 of 177.",
          "Names are the camelCase of Biopython's: `clade.branchLength`, `tree.findClades(target, { terminal, order })`, `tree.getTerminals()`, `tree.commonAncestor`, `tree.rootAtMidpoint`, `tree.ladderize`. Python's `len`, indexing and iteration become `clade.length`, `clade.get(i)` and ordinary iteration. `Clade` takes an options object, because it has a dozen optional fields.",
        ],
      },
      {
        heading: "Reading and writing",
        paragraphs: [
          "`read`, `parse`, `write` and `convert` behave as in `Bio.Phylo`, over Newick, NEXUS and phyloXML. NeXML and CDAO are not ported. The reader and writer options are Biopython's in camel case, including the `%` format strings for confidences and branch lengths.",
          "Two things surprise people and are faithful rather than quirks: the Newick writer formats confidences as `%1.2f`, so 90 comes back as `90.00`, and it always writes a root branch length, so `:0` appears at the end. That is Biopython's output.",
        ],
      },
      {
        heading: "Construction",
        paragraphs: [
          "`TreeConstruction.DistanceCalculator` takes a model name from its 31 and gives a `DistanceMatrix` from a `MultipleSeqAlignment`. `DistanceTreeConstructor(calculator, \"nj\" | \"upgma\")` builds the tree. Parsimony is there too, with `ParsimonyScorer`, `NNITreeSearcher` and `ParsimonyTreeConstructor`.",
          "`Tree.randomized`, `bootstrap`, `bootstrapTrees` and `bootstrapConsensus` are not ported, because they use Python's random number generator. `@biolibs/core` does carry Python's Mersenne Twister, so this is a gap rather than an impossibility.",
        ],
      },
      {
        heading: "Drawing is yours",
        paragraphs: [
          "`Bio.Phylo.draw` and `drawAscii` need matplotlib, so they are not ported; `toString()` gives the indented summary `str(tree)` gives. Everything a drawing needs is on the tree, which is what the layout on this page uses.",
          "That layout is about thirty lines in `src/lib/tree.ts`: walk the clades, give each tip the next row, put each fork at the middle of its children, and let x be the branch lengths added up. The elbows in the SVG follow from the node and its parent.",
        ],
      },
    ],
  },
];

/** The lesson, whole. */
export const lesson: Lesson = {
  question: "What does a tree claim, and how much of it should you believe?",
  levels,
  termSlugs: ["phylogenetic-tree", "clade", "newick", "bootstrap", "homology", "alignment", "substitution-matrix"],
  tryIt: "Try it: build a tree from the sample family and see if it recovers the two groups →",
};
