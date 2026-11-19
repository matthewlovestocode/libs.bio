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

export const paragraphs: string[] = [
  "Genetic engineering is, at heart, cutting and pasting. The scissors are restriction enzymes: proteins from bacteria that each recognise one short sequence and cut the DNA there. EcoRI, for example, cuts wherever it finds GAATTC.",
  "Many of these enzymes cut the two strands a few bases apart, leaving a short single-stranded overhang called a sticky end. A sticky end will only pair with an end that matches it, which is what makes the method controllable: cut two pieces of DNA with the same enzyme and their ends fit together. Others cut straight across and leave a blunt end.",
  "The DNA being cut is very often a plasmid, a small circle that bacteria copy for you. The shape matters when you count the pieces. A circle cut in one place opens into a single line. Cut in two places it gives two pieces, and a line cut in two places gives three.",
  "You check the result on a gel. The fragments are pulled through a slab of jelly by an electric field, and small fragments move faster than large ones, so they sort themselves by size into bands. A ladder of known sizes runs alongside, and you read each band's length, in base pairs, by seeing which rungs it sits between.",
  "If the bands are where you predicted, the construct is probably right. Predicting them first, on a computer, is what the tool on this page does. It is a model: two pieces of nearly the same length run together as one band, and a piece too small for the gel runs off the end.",
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
