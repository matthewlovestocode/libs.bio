/**
 * The Understand view of the digests and gels topic, in English.
 *
 * The paragraphs and the term entries are carried over from biolibs-site's lesson on the cloning
 * bench and its glossary, cut down to what this topic needs. A term's `match` phrases are linked to
 * its entry the first time one appears in the paragraphs.
 */

/** One term, explained. */
export interface TermEntry {
  slug: string;
  term: string;
  definition: string;
  detail: string;
  why: string;
  /** Phrases in the paragraphs that should link here, longest first. */
  match: string[];
}

/** The figures a lesson can place, by name. `src/components/diagrams` draws them. */
export type FigureName = "dna" | "cut" | "cut-blunt" | "pieces" | "plasmid" | "gel";

/** One part of a lesson: a heading, some paragraphs, and perhaps a picture. */
export interface Section {
  heading: string;
  paragraphs: string[];
  figure?: FigureName;
}

/** One version of the lesson, written for one kind of reader. */
export interface Level {
  /** What the reader picks it by. */
  id: "new" | "some" | "biopython";
  /** The reader, in their own words. */
  label: string;
  /** What this version does for them. */
  hint: string;
  sections: Section[];
  /** A comparison with something familiar, and the point at which it stops being true. */
  analogy?: { picture: string; breaksDown: string };
  /** The few things worth carrying away. */
  remember?: string[];
}

/** The question the whole lesson answers. */
export const question = "How do you cut DNA, and how do you know it worked?";

/**
 * The lesson, three times over. The first assumes nothing at all. The second assumes school
 * biology and is the lesson carried over from biolibs-site. The third is for somebody who already
 * uses Biopython and wants to know what is the same and what is not.
 */
export const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to biology",
    hint: "Starts from what DNA is. No jargon assumed.",
    sections: [
      {
        heading: "DNA is written in four letters",
        paragraphs: [
          "DNA is the molecule living things keep their instructions in. It is a very long chain, and every link in the chain is one of just four chemical units, called bases. They are written A, T, G and C. So any stretch of DNA can be written down as a string of those four letters. That string is what people mean by a sequence.",
          "DNA is two chains, not one, lying side by side. They fit together by a simple rule: A always sits opposite T, and G always sits opposite C. Know one chain and you know the other. A matched pair of letters is called a base pair, and it is what DNA is measured in. A piece 3,000 letters long is 3,000 base pairs, written 3,000 bp.",
        ],
        figure: "dna",
      },
      {
        heading: "Some proteins cut DNA at one exact word",
        paragraphs: [
          "Bacteria make proteins that cut DNA. They are called restriction enzymes. Each one looks for a single short word and cuts wherever it finds it. The one called EcoRI looks for GAATTC, and ignores everything else.",
          "Scientists use them as scissors, with one difference from real scissors: you cannot choose where to cut. You choose an enzyme, and it cuts wherever its word happens to be. Finding those places by eye in thousands of letters is slow and easy to get wrong. A computer does it at once.",
          "Many enzymes do not cut straight across. They cut the two chains a few letters apart, so each piece is left with a few unpaired letters sticking out. That is a sticky end. It will only join to another end whose letters match it, which is what lets people join chosen pieces of DNA together. An enzyme that does cut straight across leaves a blunt end.",
        ],
        figure: "cut",
      },
      {
        heading: "Count the pieces: loops and lines",
        paragraphs: [
          "Much of the DNA people work with is a plasmid: a small loop of DNA that bacteria carry and copy. Whether DNA is a loop or a line changes how many pieces you get.",
          "Cut a loop once and it opens into a line: still one piece. Cut it twice and you get two. A line already has two ends, so cutting it twice gives three.",
        ],
        figure: "pieces",
      },
      {
        heading: "Sorting the pieces by length",
        paragraphs: [
          "DNA is far too small to see, so how do you know what you got? You sort the pieces by length, on a gel.",
          "A gel is a slab of jelly. The DNA goes into small wells at one end, and an electric current pulls it through. Short pieces slip through the jelly easily and travel far. Long ones get held back. After a while, all the pieces of one length have gathered in the same place, and a dye shows each group as a line, called a band.",
          "Beside your sample you run a ladder: a mixture of pieces whose lengths are already known. Its bands are the ruler you read your own against.",
        ],
        figure: "gel",
      },
      {
        heading: "Why work it out on a computer first",
        paragraphs: [
          "A real digest takes an hour or two and uses up enzyme and DNA. If you have worked out beforehand which bands to expect, one look at the real gel tells you whether it worked.",
          "That prediction is what the tool on the Do tab makes. It is only a prediction. Two pieces of nearly the same length show up as a single band, and a very small piece can run off the end of the gel.",
        ],
      },
    ],
    analogy: {
      picture: "Think of DNA as one very long sentence with no spaces, and a restriction enzyme as somebody told to snip the paper wherever the word GAATTC appears. A gel is then a way of sorting the snippets by length without reading them.",
      breaksDown: "Paper has one layer and DNA has two, which is why a cut can be staggered and leave sticky ends. And on a gel you never see the letters, only how long each piece is.",
    },
    remember: [
      "DNA is a string of four letters, in two matched chains.",
      "A restriction enzyme cuts at one particular word, wherever that word is.",
      "A loop cut twice gives two pieces. A line cut twice gives three.",
      "A gel sorts pieces by length: short ones travel furthest.",
    ],
  },
  {
    id: "some",
    label: "I know some biology",
    hint: "The method, and what the tool does and does not model.",
    sections: [
      {
        heading: "Cutting",
        paragraphs: [
          "Genetic engineering is, at heart, cutting and pasting. The scissors are restriction enzymes: proteins from bacteria that each recognise one short sequence and cut the DNA there. EcoRI, for example, cuts wherever it finds GAATTC.",
          "Many of these enzymes cut the two strands a few bases apart, leaving a short single-stranded overhang called a sticky end. A sticky end will only pair with an end that matches it, which is what makes the method controllable: cut two pieces of DNA with the same enzyme and their ends fit together. Others cut straight across and leave a blunt end.",
        ],
        figure: "cut",
      },
      {
        heading: "Circles and lines",
        paragraphs: [
          "The DNA being cut is very often a plasmid, a small circle that bacteria copy for you. The shape matters when you count the pieces. A circle cut in one place opens into a single line. Cut in two places it gives two pieces, and a line cut in two places gives three.",
        ],
        figure: "plasmid",
      },
      {
        heading: "Checking the result",
        paragraphs: [
          "You check the result on a gel. The fragments are pulled through a slab of jelly by an electric field, and small fragments move faster than large ones, so they sort themselves by size into bands. A ladder of known sizes runs alongside, and you read each band's length, in base pairs, by seeing which rungs it sits between.",
          "If the bands are where you predicted, the construct is probably right. Predicting them first, on a computer, is what the tool on this page does. It is a model: two pieces of nearly the same length run together as one band, and a piece too small for the gel runs off the end.",
        ],
        figure: "gel",
      },
    ],
  },
  {
    id: "biopython",
    label: "I know Biopython",
    hint: "Coverage, naming, and where the port differs.",
    sections: [
      {
        heading: "What is ported",
        paragraphs: [
          "`@biolibs/restriction` is `Bio.Restriction`: all 1,088 REBASE enzymes as shipped with Biopython 1.88, with `search`, `catalyse` on linear or circular DNA, `RestrictionBatch` and `Analysis`. Every enzyme is checked whole against Biopython, not sampled: 491 of 491 items are at parity, over 5,387 recorded cases.",
          "`@biolibs/gel` has no Python counterpart. It is the data behind the gel picture that tools such as SnapGene and Benchling draw beside a digest: which fragment sizes an agarose gel separates, and where each band runs, by the usual log-linear approximation. It is tested against invariants and worked figures, not against a reference library.",
        ],
      },
      {
        heading: "Where it differs",
        paragraphs: [
          "An enzyme is an object, not a class. Biopython builds one class per enzyme out of mixins, so `issubclass(EcoRI, Blunt)` is how you ask what kind it is. Here each enzyme is a `RestrictionType` that knows its mixins: `EcoRI.isA(\"Blunt\")`, and `EcoRI.kinds` lists them.",
          "The operators are methods: `EcoRI.div(seq)` for `/`, and `floordiv`, `ne`, `rshift`, `mod`, `lt` and `add` likewise. `a == b` is `a === b`, because each enzyme is a single object.",
          "A batch iterates in insertion order. Biopython's batches are Python sets, whose order is arbitrary. It only shows in the map layout, where enzymes cutting at the same position are listed in iteration order.",
          "Wrong argument types throw `TypeError` where Python raises `AttributeError`.",
        ],
      },
      {
        heading: "Coordinates",
        paragraphs: [
          "Cut positions from `search` are 1-based, as in Biopython: the base after the cut. A linear search drops cuts that fall off the end, and a circular one wraps them. `@biolibs/gel` takes 0-based boundaries, so the tool converts one to the other, and the Code view shows the line that does it.",
        ],
      },
    ],
  },
];

export const terms: TermEntry[] = [
  {
    slug: "restriction-enzyme", term: "Restriction enzyme",
    definition: "A protein that cuts DNA wherever it finds one specific short sequence.",
    detail: "Bacteria make these enzymes to destroy the DNA of invading viruses. Each recognises its own site, typically four to eight bases long, and cuts both strands at fixed points within or beside it. More than a thousand are known.",
    why: "They are the scissors of molecular cloning, and predicting where they cut is the first step in planning it.",
    match: ["restriction enzymes", "restriction enzyme"],
  },
  {
    slug: "sticky-end", term: "Sticky end",
    definition: "A short single-stranded overhang left when an enzyme cuts the two strands a few bases apart.",
    detail: "The overhang can pair with any end carrying the complementary overhang, and with no other. Two fragments cut by the same enzyme therefore fit together, which is what makes cutting and pasting DNA predictable.",
    why: "Whether two ends are compatible decides whether a planned ligation can work at all.",
    match: ["sticky ends", "sticky end"],
  },
  {
    slug: "blunt-end", term: "Blunt end",
    definition: "An end with no overhang, left when an enzyme cuts both strands at the same position.",
    detail: "Any blunt end can be joined to any other, which is flexible but less efficient and gives no control over which way round a fragment goes in.",
    why: "Knowing which enzymes leave blunt ends tells you when orientation has to be checked afterwards.",
    match: ["blunt ends", "blunt end"],
  },
  {
    slug: "plasmid", term: "Plasmid",
    definition: "A small circular DNA molecule, separate from the chromosome, that bacteria copy and pass on.",
    detail: "Laboratory plasmids carry an origin of replication so the cell copies them, a resistance gene so that cells holding the plasmid can be selected, and a place to insert the DNA you care about. A circle has no ends, so where the numbering starts is only a convention.",
    why: "Plasmids are the standard vehicle for carrying engineered DNA into cells.",
    match: ["plasmids", "plasmid"],
  },
  {
    slug: "gel-electrophoresis", term: "Gel electrophoresis",
    definition: "Sorting DNA fragments by size by pulling them through a gel with an electric field.",
    detail: "DNA is negatively charged, so it moves towards the positive electrode. The gel slows large fragments more than small ones, so fragments of one size gather into a band. A ladder of known sizes run alongside lets you read off how big each band is.",
    why: "It is the everyday check that a digest or a PCR produced what was expected.",
    match: ["gel"],
  },
  {
    slug: "base-pair", term: "Base pair",
    definition: "Two bases, one on each strand, held together by hydrogen bonds: A with T, and G with C.",
    detail: "The length of double-stranded DNA is counted in base pairs, written bp; a thousand base pairs is a kilobase, kb.",
    why: "It is the unit every fragment size is measured in.",
    match: ["base pairs", "base pair"],
  },
];
