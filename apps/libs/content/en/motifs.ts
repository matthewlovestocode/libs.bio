/**
 * The Understand view of the motifs topic, in English.
 *
 * Three versions, as every topic has: one that assumes nothing, one that assumes school biology, and
 * one for somebody who already uses Biopython.
 */
import type { Lesson, Level } from "../../src/lib/lesson.ts";

const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to this",
    hint: "Starts from why a short pattern matters. No jargon assumed.",
    sections: [
      {
        heading: "Short patterns that keep turning up",
        paragraphs: [
          "A cell is full of proteins whose job is to find one particular spot on the DNA and sit on it: to switch a gene on, to start copying, to cut. Each of them recognises a short run of letters, usually between six and twenty.",
          "Collect all the places one protein binds and you find they are nearly the same, but not quite. That family resemblance is the motif.",
        ],
        figure: "motif",
      },
      {
        heading: "Why a single spelling will not do",
        paragraphs: [
          "The obvious way to write a motif down is to take the commonest letter at each position: TATAAA, say. That is a consensus, and it throws away the most useful thing you know.",
          "It cannot tell you that the first two letters are never anything else, while the last one is a coin toss. Search with it and you will miss real sites that differ by one letter, and accept rubbish that happens to match.",
        ],
      },
      {
        heading: "Counting instead",
        paragraphs: [
          "So you keep the counts: at position one, eight Ts and nothing else; at position five, five As, two Ts and a G. That table is the motif, and everything else is worked out from it.",
          "From the counts you get the share of each letter at each position, and from the shares you get a score for any stretch of DNA you care to test.",
        ],
      },
      {
        heading: "The picture: a sequence logo",
        paragraphs: [
          "The table is hard to read, so motifs are drawn as logos. Each position is a stack of letters, and the height of the stack says how strongly that position is held: tall where only one letter ever appears, flat where anything goes.",
          "Within a stack, each letter's share of the height is its share of the instances. One glance tells you which positions matter and which are decoration, which is exactly what you want before designing anything around them.",
        ],
      },
      {
        heading: "Scoring a stretch of DNA",
        paragraphs: [
          "To search a sequence you slide the motif along it and score every window. A window scores well when its letters are the ones the motif usually has, in the positions the motif cares about.",
          "The score is a comparison, not an absolute: it asks how much more likely this stretch is under the motif than under ordinary background DNA. That is why the background composition is something you set, and why a GC-rich motif is unremarkable in GC-rich DNA.",
        ],
      },
      {
        heading: "Where to draw the line",
        paragraphs: [
          "Every window gets a score, so you have to decide which count as hits. Set the bar too low and a long sequence will hand you hundreds of matches by chance alone; a six-letter motif turns up somewhere in every few thousand bases whether or not anything binds there.",
          "The tool offers two thresholds worked out from the motif itself rather than guessed: one where false hits should fall to about one in a thousand, and one from a method that balances how much the motif tells you. Both are better than a round number you liked the look of.",
        ],
      },
    ],
    analogy: {
      picture: "A motif is like recognising a friend's handwriting. No single letter settles it, and no two notes are identical, but the overall pattern is unmistakable, and some letters are far more distinctive than others.",
      breaksDown: "Handwriting has one author. A motif is the summary of many different sites, some strong and some weak, and the protein does not need a perfect match — only a good enough one for long enough to do its job.",
    },
    remember: [
      "A motif is what a set of binding sites have in common, not one spelling.",
      "Keep the counts: the consensus throws away which positions matter.",
      "A logo's height is how strongly a position is held.",
      "A score is relative to the background, and the threshold decides everything.",
    ],
  },
  {
    id: "some",
    label: "I know some bioinformatics",
    hint: "Assumes PWMs. Covers pseudocounts, backgrounds, thresholds and what scanning cannot do.",
    sections: [
      {
        heading: "From counts to log-odds",
        paragraphs: [
          "The chain is counts → frequencies → log-odds. The position weight matrix holds the frequency of each letter at each position; the position-specific scoring matrix holds log₂(frequency ÷ background). A window's score is the sum down its diagonal, which treats positions as independent.",
          "That independence is the model's main simplification and it is known to be imperfect — neighbouring positions in real sites are often correlated — but it is close enough that PWMs have outlasted every proposed replacement.",
        ],
      },
      {
        heading: "Pseudocounts",
        paragraphs: [
          "A letter never observed has frequency zero, and log₂(0) is minus infinity: one unseen letter would veto an otherwise perfect match. Adding a pseudocount to every cell prevents that, at the cost of damping the extremes.",
          "The effect is visible in this tool: with eight instances and a pseudocount of 0.5, a position where all eight agree carries about 1.15 bits rather than the full 2. Set the pseudocount to none and it returns to 2. Neither is wrong; the question is whether you believe eight instances prove that no other letter is ever allowed.",
        ],
      },
      {
        heading: "The background matters more than people expect",
        paragraphs: [
          "The score is log-odds against a background, so changing the background changes every score and can reorder hits. A uniform 25% background is the usual default and is wrong for most genomes; using the composition of the sequence you are actually scanning is more defensible.",
          "For the same reason, scores from two different motifs are not comparable unless the background is the same, and even then a wider motif can reach higher scores simply by having more positions.",
        ],
        figure: "gc-content",
      },
      {
        heading: "Choosing a threshold",
        paragraphs: [
          "`ScoreDistribution` approximates the distribution of scores under the background and lets you pick a threshold by its false-positive rate, by Hertz and Stormo's balance of information, or by balancing false positives against false negatives. The first argument is the number of bins used, which is precision, not a parameter of the biology.",
          "Any of these beats a round number. None of them makes a hit real: a sequence of three billion bases will contain enormous numbers of windows above any threshold you can usefully set, which is why genome-wide motif scanning alone predicts binding poorly.",
        ],
      },
      {
        heading: "Both strands, and what a position means",
        paragraphs: [
          "A protein can bind either strand, so a scan reports both. The library writes a reverse-strand hit as a negative position counted back from the end; this tool converts that to a position on the sequence as written, with the strand named, which is less clever and easier to check.",
          "A palindromic motif — and many are, because many binding proteins are dimers — will be found twice at the same place, once per strand. That is correct, not a duplicate.",
        ],
        figure: "reverse-complement",
      },
      {
        heading: "What this does not do",
        paragraphs: [
          "It takes the instances as given. Finding a motif nobody has described, from a set of sequences that share something unknown, is motif discovery — MEME, Gibbs sampling — and is a much harder problem.",
          "Nor does a good score mean a protein binds there. Chromatin, methylation, competing factors and cooperativity all decide what actually happens in a cell, and none of them is in a matrix of four rows.",
        ],
      },
    ],
    remember: [
      "Counts → frequencies → log-odds against a background, summed over positions.",
      "Pseudocounts stop a single unseen letter vetoing a match, and damp the extremes.",
      "Change the background and every score changes.",
      "A high score is a candidate, not a binding event.",
    ],
  },
  {
    id: "biopython",
    label: "I use Biopython",
    hint: "Bio.motifs, ported, and the one thing this page computes itself.",
    sections: [
      {
        heading: "Bio.motifs, as it was",
        paragraphs: [
          "`@biolibs/motifs` is `Bio.motifs`: `create`, `Motif`, `GenericPositionMatrix`, `FrequencyPositionMatrix`, `PositionWeightMatrix`, `PositionSpecificScoringMatrix` and `ScoreDistribution`, with eleven formats in — JASPAR, TRANSFAC, MEME, MAST, AlignAce, Cluster Buster, XMS, PFM and the rest — and the matching writers.",
          "`motif.pseudocounts` and `motif.background` accept a single number that spreads over the letters, or a mapping, exactly as in Biopython. `counts`, `pwm` and `pssm` are the same three views of the same data.",
        ],
      },
      {
        heading: "Slices and consensus",
        paragraphs: [
          "`motif.consensus` and `motif.degenerateConsensus` are Biopython's, the second using IUPAC ambiguity codes. `reverseComplement()` gives the motif on the other strand.",
          "Python's `motif[1:4]` becomes `motif.slice({ start: 1, stop: 4 })`, and as in Biopython only a slice is accepted: `motif.slice(1)` raises, because a single position of a motif is not a motif.",
        ],
      },
      {
        heading: "Scanning",
        paragraphs: [
          "`pssm.calculate(seq)` scores every window; `pssm.search(seq, threshold)` yields `[position, score]` pairs over both strands, with a negative position meaning the reverse strand counted from the end. `pssm.mean(background)` and `pssm.std(background)` give the expected score and its spread, which is what makes scores comparable.",
          "`new ScoreDistribution(precision, pssm, background)` then gives `thresholdFpr`, `thresholdPatser` and `thresholdBalanced`, all as in Biopython.",
        ],
      },
      {
        heading: "What this page adds",
        paragraphs: [
          "The information content per position — the height of each stack in the logo — is computed here, not by the library: two bits less the Shannon entropy of that column's frequencies. It is about six lines in `src/lib/motif.ts`, and it uses the library's own `pwm` so the drawing cannot disagree with the matrix beside it.",
          "The logo itself is the site's own SVG: letters drawn at one size and squashed to the height they have earned. Biopython's `motif.weblogo()` posts to the WebLogo server, which this site will not do — nothing here leaves your browser.",
        ],
      },
    ],
  },
];

/** The lesson, whole. */
export const lesson: Lesson = {
  question: "What is a motif, and when is a match worth believing?",
  levels,
  termSlugs: ["motif", "gc-content", "reverse-complement", "promoter", "gene", "alignment"],
  tryIt: "Try it: build the sample motif and find its three planted copies →",
};
