/**
 * Candidate papers for the working safely topic. A shortlist: Matthew has not chosen from it yet.
 *
 * These are about how this community governs itself, since the containment rules themselves live in
 * the documents the Do view links rather than in papers. The details were looked up on Europe PMC
 * by hand on the date below.
 */
import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "33315254", doi: "10.1002/hast.1194", pmcid: "PMC8114871",
    title: "Realizing Present and Future Promise of DIY Biology and Medicine through a Trust Architecture",
    authors: "Rasmussen LM, Guerrini CJ, Kuiken T, Nebeker C, Rooney B, Sarpatwari A, and others", journal: "Hastings Cent Rep", year: 2020, access: "paywalled",
    why: "What trust between this community, regulators and the public would have to be built out of, written by people who have spent time with both sides.",
  },
  {
    pmid: "41364648", doi: "10.1371/journal.pone.0334484", pmcid: "PMC12688136",
    title: "Envisioning grassroots science: DIY biology in Canada, Britain, and Germany",
    authors: "Eireiner AV", journal: "PLoS One", year: 2025, access: "open",
    why: "What community labs in three countries actually are, as against what they are imagined to be, which is usually where safety conversations go wrong.",
  },
  {
    pmid: "40853914", doi: "10.1371/journal.pone.0330307", pmcid: "PMC12377605",
    title: "Make your own laboratory: A comparative perspective on the logistics and dynamics of DIY biology spaces",
    authors: "Eireiner AV", journal: "PLoS One", year: 2025, access: "open",
    why: "The logistics: premises, equipment, waste, money and the people who hold it together. The unglamorous constraints that decide what a lab can safely take on.",
  },
  {
    pmid: "36032648", doi: "10.1089/apb.20.0064", pmcid: "PMC9135154",
    title: "Biosafety Risk Assessment of a Routine Diagnostic Laboratory During the Coronavirus Disease 2019 Pandemic",
    authors: "Zorbozan O, Zorbozan N, Turgay N", journal: "Appl Biosaf", year: 2021, access: "free",
    why: "A worked risk assessment on a real laboratory, which is more instructive than any description of the method. Written while the answer still mattered urgently.",
  },
  {
    pmid: "26978244", doi: "10.1038/sdata.2016.18", pmcid: "PMC4792175",
    title: "The FAIR Guiding Principles for scientific data management and stewardship",
    authors: "Wilkinson MD, Dumontier M, Aalbersberg IJ, Appleton G, Axton M, Baak A, and others", journal: "Sci Data", year: 2016, access: "open",
    why: "Included here as well as under looking things up, because a lab that can say what it holds and where it came from is the same lab that can answer a safety question.",
  },
];

/** The list: a shortlist, with details checked on Europe PMC on the date given. */
export const reading: ReadingList = { chosen: false, checked: "2026-11-19", papers };
