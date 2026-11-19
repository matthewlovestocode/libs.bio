/**
 * Candidate papers for the protein structure topic. A shortlist: Matthew has not chosen from it yet.
 *
 * The details were looked up on Europe PMC by hand on the date below, so each one is what Europe
 * PMC says and not what anybody remembered. Fetching them when the site is built is not written
 * yet.
 */
import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "13517261", doi: "10.1038/181662a0", pmcid: null,
    title: "A three-dimensional model of the myoglobin molecule obtained by x-ray analysis",
    authors: "Kendrew JC, Bodo G, Dintzis HM, Parrish RG, Wyckoff H, Phillips DC", journal: "Nature", year: 1958, access: "paywalled",
    why: "The first protein anyone saw in three dimensions. It looked irregular and disappointing, and that was the finding: a fold is specific, not symmetrical.",
  },
  {
    pmid: "13990617", doi: "10.1016/s0022-2836(63)80023-6", pmcid: null,
    title: "Stereochemistry of polypeptide chain configurations",
    authors: "Ramachandran GN, Ramakrishnan C, Sasisekharan V", journal: "J Mol Biol", year: 1963, access: "paywalled",
    why: "The second plot in this tool, and the argument behind it: most pairs of backbone angles are impossible because atoms would overlap, worked out from geometry alone before there were structures to check it against.",
  },
  {
    pmid: "18990801", doi: "10.1038/185416a0", pmcid: null,
    title: "Structure of haemoglobin: a three-dimensional Fourier synthesis at 5.5-A. resolution",
    authors: "Perutz MF, Rossmann MG, Cullis AF, Muirhead H, Will G, North AC", journal: "Nature", year: 1960, access: "paywalled",
    why: "Four chains, two kinds, packed together: the first sight of how subunits assemble, and of a structure doing a job rather than merely existing.",
  },
  {
    pmid: "10592235", doi: "10.1093/nar/28.1.235", pmcid: "PMC102472",
    title: "The Protein Data Bank",
    authors: "Berman HM, Westbrook J, Feng Z, Gilliland G, Bhat TN, Weissig H, Shindyalov IN, Bourne PE", journal: "Nucleic Acids Res", year: 2000, access: "free",
    why: "The archive the fetch button reaches, and the format this tool reads. Every structure deposited since 1971, free to anyone.",
  },
  {
    pmid: "34265844", doi: "10.1038/s41586-021-03819-2", pmcid: "PMC8371605",
    title: "Highly accurate protein structure prediction with AlphaFold",
    authors: "Jumper J, Evans R, Pritzel A, Green T, Figurnov M, Ronneberger O, and others", journal: "Nature", year: 2021, access: "open",
    why: "Why a structure file no longer has to come from a crystal. The files are the same shape, and the confidence written in the B-factor column is not the same thing as a measurement.",
  },
];

/** The list: a shortlist, with details checked on Europe PMC on the date given. */
export const reading: ReadingList = { chosen: false, checked: "2026-11-19", papers };
