/**
 * Candidate papers for the trees topic. A shortlist: Matthew has not chosen from it yet.
 *
 * The details were looked up on Europe PMC by hand on the date below, so each one is what Europe
 * PMC says and not what anybody remembered. Fetching them when the site is built is not written
 * yet.
 */
import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "270744", doi: "10.1073/pnas.74.11.5088", pmcid: "PMC432104",
    title: "Phylogenetic structure of the prokaryotic domain: the primary kingdoms",
    authors: "Woese CR, Fox GE", journal: "Proc Natl Acad Sci U S A", year: 1977, access: "free",
    why: "A tree built from sequence overturned the shape of life: a third domain nobody had suspected, found by comparing ribosomal RNA rather than by looking at the organisms.",
  },
  {
    pmid: "7288891", doi: "10.1007/bf01734359", pmcid: null,
    title: "Evolutionary trees from DNA sequences: a maximum likelihood approach",
    authors: "Felsenstein J", journal: "J Mol Evol", year: 1981, access: "paywalled",
    why: "Tree-building as a statistical question: which tree makes the data most probable, under a stated model of how sequences change. It is what serious work uses, and what this tool does not do.",
  },
  {
    pmid: "28561359", doi: "10.1111/j.1558-5646.1985.tb00420.x", pmcid: null,
    title: "Confidence limits on phylogenies: an approach using the bootstrap",
    authors: "Felsenstein J", journal: "Evolution", year: 1985, access: "paywalled",
    why: "Where the numbers on the forks come from, and what they do and do not mean. The most cited paper in the field, and the most misread.",
  },
  {
    pmid: "3447015", doi: "10.1093/oxfordjournals.molbev.a040454", pmcid: null,
    title: "The neighbor-joining method: a new method for reconstructing phylogenetic trees",
    authors: "Saitou N, Nei M", journal: "Mol Biol Evol", year: 1987, access: "paywalled",
    why: "The method this tool runs by default: fast, no assumption of a steady rate, and still the standard first look at a set of sequences.",
  },
  {
    pmid: "33892491", doi: "10.1093/molbev/msab120", pmcid: "PMC8233496",
    title: "MEGA11: Molecular Evolutionary Genetics Analysis Version 11",
    authors: "Tamura K, Stecher G, Kumar S", journal: "Mol Biol Evol", year: 2021, access: "open",
    why: "What people actually use for this, with the models, the bootstrap and the tests this tool leaves out. Worth knowing where a browser tab stops being the right place.",
  },
];

/** The list: a shortlist, with details checked on Europe PMC on the date given. */
export const reading: ReadingList = { chosen: false, checked: "2026-11-19", papers };
