/**
 * Candidate papers for the looking things up topic. A shortlist: Matthew has not chosen from it yet.
 *
 * The details were looked up on Europe PMC by hand on the date below — using the same service this
 * topic's tool asks — so each one is what Europe PMC says and not what anybody remembered.
 */
import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "39558184", doi: "10.1093/nar/gkae1114", pmcid: "PMC11701615",
    title: "GenBank 2025 update",
    authors: "Sayers EW, Cavanaugh M, Frisse L, Pruitt KD, Schoch CL, Sherry ST, Karsch-Mizrachi I", journal: "Nucleic Acids Res", year: 2025, access: "free",
    why: "What the accession box reaches, as it stands now: how much is in it, how it is submitted, and what the identifiers mean.",
  },
  {
    pmid: "36408920", doi: "10.1093/nar/gkac1052", pmcid: "PMC9825514",
    title: "UniProt: the Universal Protein Knowledgebase in 2023",
    authors: "UniProt Consortium", journal: "Nucleic Acids Res", year: 2023, access: "open",
    why: "The protein half of this tool, and the place the reviewed-or-not distinction is set out by the people who do the reviewing.",
  },
  {
    pmid: "33180112", doi: "10.1093/nar/gkaa994", pmcid: "PMC7778976",
    title: "Europe PMC in 2020",
    authors: "Ferguson C, Araújo D, Faulk L, Gou Y, Hamelers A, Huang Z, and others", journal: "Nucleic Acids Res", year: 2021, access: "open",
    why: "The literature half, including why a paper's full text being open and its full text being there are two different questions.",
  },
  {
    pmid: "26978244", doi: "10.1038/sdata.2016.18", pmcid: "PMC4792175",
    title: "The FAIR Guiding Principles for scientific data management and stewardship",
    authors: "Wilkinson MD, Dumontier M, Aalbersberg IJ, Appleton G, Axton M, Baak A, and others", journal: "Sci Data", year: 2016, access: "open",
    why: "Why an accession number is worth more than a file on somebody's laptop: findable, accessible, interoperable, reusable, and what each of those costs.",
  },
  {
    pmid: "41036861", doi: "10.1128/msphere.00391-25", pmcid: "PMC12570471",
    title: "Differences in GenBank and RefSeq annotations may affect genomics data interpretation",
    authors: "de Siqueira GMV, Eng T, Mukhopadhyay A, Guazzaroni ME", journal: "mSphere", year: 2025, access: "open",
    why: "The same organism, two databases, different annotations. A useful corrective to treating whatever a fetch returns as the answer.",
  },
];

/** The list: a shortlist, with details checked on Europe PMC on the date given. */
export const reading: ReadingList = { chosen: false, checked: "2026-11-19", papers };
