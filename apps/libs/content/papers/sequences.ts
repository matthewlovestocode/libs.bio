/**
 * Candidate papers for the sequences and translation topic. A shortlist: Matthew has not chosen
 * from it yet.
 *
 * The details were looked up on Europe PMC by hand on the date below, so each one is what Europe
 * PMC says and not what anybody remembered. Fetching them when the site is built is not written
 * yet.
 */
import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "14479932", doi: "10.1073/pnas.47.10.1588", pmcid: "PMC223178",
    title: "The dependence of cell-free protein synthesis in E. coli upon naturally occurring or synthetic polyribonucleotides",
    authors: "Nirenberg MW, Matthaei JH", journal: "Proc Natl Acad Sci U S A", year: 1961, access: "free",
    why: "The first word of the code read: poly-U made polyphenylalanine, so UUU means phenylalanine. Everything in the translation table started here.",
  },
  {
    pmid: "13882203", doi: "10.1038/1921227a0", pmcid: null,
    title: "General nature of the genetic code for proteins",
    authors: "Crick FH, Barnett L, Brenner S, Watts-Tobin RJ", journal: "Nature", year: 1961, access: "paywalled",
    why: "Why the code is read in threes from a fixed starting point, with no punctuation between codons. It is why a frame exists at all, and why shifting by one base ruins everything after it.",
  },
  {
    pmid: "5330357", doi: "10.1073/pnas.53.5.1161", pmcid: "PMC301388",
    title: "RNA codewords and protein synthesis, VII. On the general nature of the RNA code",
    authors: "Nirenberg M, Leder P, Bernfield M, Brimacombe R, Trupin J, Rottman F, O'Neal C", journal: "Proc Natl Acad Sci U S A", year: 1965, access: "free",
    why: "The table finished and set out whole: all sixty-four codons, and the observation that the third base often does not matter.",
  },
  {
    pmid: "1579111", doi: "10.1128/mr.56.1.229-264.1992", pmcid: "PMC372862",
    title: "Recent evidence for evolution of the genetic code",
    authors: "Osawa S, Jukes TH, Watanabe K, Muto A", journal: "Microbiol Rev", year: 1992, access: "free",
    why: "Why there are twenty-seven tables and not one. The code is nearly universal, and the exceptions are what the dropdown in this tool is for.",
  },
  {
    pmid: "16620150", doi: "10.1371/journal.pbio.0040127", pmcid: "PMC1440934",
    title: "Parallel evolution of the genetic code in arthropod mitochondrial genomes",
    authors: "Abascal F, Posada D, Knight RD, Zardoya R", journal: "PLoS Biol", year: 2006, access: "open",
    why: "A worked case of a code changing: the same reassignment arrived at twice, independently. Choose the wrong table for a mitochondrial sequence and the protein comes out wrong.",
  },
];

/** The list: a shortlist, with details checked on Europe PMC on the date given. */
export const reading: ReadingList = { chosen: false, checked: "2026-11-19", papers };
