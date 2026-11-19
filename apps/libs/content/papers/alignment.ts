/**
 * The papers behind the alignment topic, chosen by Matthew on 2026-11-19.
 *
 * The details were looked up on Europe PMC by hand on the date below, so each one is what Europe
 * PMC says and not what anybody remembered. Fetching them when the site is built is not written
 * yet.
 */
import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "5420325", doi: "10.1016/0022-2836(70)90057-4", pmcid: null,
    title: "A general method applicable to the search for similarities in the amino acid sequence of two proteins",
    authors: "Needleman SB, Wunsch CD", journal: "J Mol Biol", year: 1970, access: "paywalled",
    why: "The end-to-end alignment this tool runs by default. It is also the paper that made dynamic programming the standard tool of the field.",
  },
  {
    pmid: "7265238", doi: "10.1016/0022-2836(81)90087-5", pmcid: null,
    title: "Identification of common molecular subsequences",
    authors: "Smith TF, Waterman MS", journal: "J Mol Biol", year: 1981, access: "paywalled",
    why: "The other mode in the tool: find the best-matching stretch and ignore the rest, which is what you want when only part of two sequences is related.",
  },
  {
    pmid: "1438297", doi: "10.1073/pnas.89.22.10915", pmcid: "PMC50453",
    title: "Amino acid substitution matrices from protein blocks",
    authors: "Henikoff S, Henikoff JG", journal: "Proc Natl Acad Sci U S A", year: 1992, access: "free",
    why: "BLOSUM62, the matrix in the dropdown and the default almost everywhere else. Where the numbers come from, and why one score for every mismatch is not enough.",
  },
  {
    pmid: "2231712", doi: "10.1016/s0022-2836(05)80360-2", pmcid: null,
    title: "Basic local alignment search tool",
    authors: "Altschul SF, Gish W, Miller W, Myers EW, Lipman DJ", journal: "J Mol Biol", year: 1990, access: "paywalled",
    why: "What you use instead when the second sequence is an entire database: approximate, far faster, and with a statistic saying how surprised to be.",
  },
  {
    pmid: "7984417", doi: "10.1093/nar/22.22.4673", pmcid: "PMC308517",
    title: "CLUSTAL W: improving the sensitivity of progressive multiple sequence alignment through sequence weighting, position-specific gap penalties and weight matrix choice",
    authors: "Thompson JD, Higgins DG, Gibson TJ", journal: "Nucleic Acids Res", year: 1994, access: "free",
    why: "How more than two sequences get aligned at all, and the format the second half of this tool reads. Nothing here performs a multiple alignment: this is the program that would.",
  },
];

/** The list: chosen, with details checked on Europe PMC on the date given. */
export const reading: ReadingList = { chosen: true, checked: "2026-11-19", papers };
