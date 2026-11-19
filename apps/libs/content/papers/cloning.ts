/**
 * Candidate papers for the cloning and assembly topic. A shortlist: Matthew has not chosen from it
 * yet.
 *
 * The details were looked up on Europe PMC by hand on the date below, so each one is what Europe
 * PMC says and not what anybody remembered. Fetching them when the site is built is not written
 * yet.
 */
import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "4343968", doi: "10.1073/pnas.69.11.3370", pmcid: "PMC389773",
    title: "Cleavage of DNA by R1 restriction endonuclease generates cohesive ends",
    authors: "Mertz JE, Davis RW", journal: "Proc Natl Acad Sci U S A", year: 1972, access: "free",
    why: "The observation the whole of cut-and-paste cloning rests on: an enzyme that leaves matching single-stranded ends, so two cut pieces stick back together.",
  },
  {
    pmid: "4342968", doi: "10.1073/pnas.69.10.2904", pmcid: "PMC389671",
    title: "Biochemical method for inserting new genetic information into DNA of Simian Virus 40",
    authors: "Jackson DA, Symons RH, Berg P", journal: "Proc Natl Acad Sci U S A", year: 1972, access: "free",
    why: "The first recombinant DNA molecule: two pieces from different sources joined in a tube, before any of this was routine.",
  },
  {
    pmid: "17293868", doi: "10.1038/nmeth1010", pmcid: null,
    title: "Harnessing homologous recombination in vitro to generate recombinant DNA via SLIC",
    authors: "Li MZ, Elledge SJ", journal: "Nat Methods", year: 2007, access: "paywalled",
    why: "Joining by overlap rather than by cut site, which freed cloning from needing an enzyme that cuts in the right place.",
  },
  {
    pmid: "18985154", doi: "10.1371/journal.pone.0003647", pmcid: "PMC2574415",
    title: "A one pot, one step, precision cloning method with high throughput capability",
    authors: "Engler C, Kandzia R, Marillonnet S", journal: "PLoS One", year: 2008, access: "open",
    why: "Golden Gate: enzymes that cut outside their own site, so the pieces can be cut and ligated in one tube and no site is left behind.",
  },
  {
    pmid: "19363495", doi: "10.1038/nmeth.1318", pmcid: null,
    title: "Enzymatic assembly of DNA molecules up to several hundred kilobases",
    authors: "Gibson DG, Young L, Chuang RY, Venter JC, Hutchison CA, Smith HO", journal: "Nat Methods", year: 2009, access: "paywalled",
    why: "The assembly the second half of this tool simulates: overlapping ends, one tube, one hour, and no cut sites anywhere.",
  },
];

/** The list: a shortlist, with details checked on Europe PMC on the date given. */
export const reading: ReadingList = { chosen: false, checked: "2026-11-19", papers };
