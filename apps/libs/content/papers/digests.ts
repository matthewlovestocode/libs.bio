/**
 * The papers behind the digests and gels topic, chosen by Matthew on 2026-11-19.
 *
 * The plan is for each paper to be held as a DOI or PMID with the rest fetched from Europe PMC when
 * the site is built. That fetch is not written yet. The details below were looked up on Europe PMC
 * by hand on the date in `checked`, so each one is what Europe PMC says and not what anybody
 * remembered.
 */

import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "5312500", doi: "10.1016/0022-2836(70)90149-x", pmcid: null,
    title: "A restriction enzyme from Hemophilus influenzae. I. Purification and general properties",
    authors: "Smith HO, Wilcox KW", journal: "J Mol Biol", year: 1970, access: "paywalled",
    why: "The first enzyme found to cut DNA at a specific sequence. The whole method rests on it.",
  },
  {
    pmid: "4332003", doi: "10.1073/pnas.68.12.2913", pmcid: "PMC389558",
    title: "Specific cleavage of simian virus 40 DNA by restriction endonuclease of Hemophilus influenzae",
    authors: "Danna K, Nathans D", journal: "Proc Natl Acad Sci U S A", year: 1971, access: "free",
    why: "A genome cut into defined pieces and separated on a gel: the experiment this page's tool predicts, done for the first time.",
  },
  {
    pmid: "4354250", doi: "10.1021/bi00740a018", pmcid: null,
    title: "Detection of two restriction endonuclease activities in Haemophilus parainfluenzae using analytical agarose-ethidium bromide electrophoresis",
    authors: "Sharp PA, Sugden B, Sambrook J", journal: "Biochemistry", year: 1973, access: "paywalled",
    why: "Where the everyday agarose gel, stained so the bands can be seen, comes from.",
  },
  {
    pmid: "36318248", doi: "10.1093/nar/gkac975", pmcid: "PMC9825431",
    title: "REBASE: a database for DNA restriction and modification: enzymes, genes and genomes",
    authors: "Roberts RJ, Vincze T, Posfai J, Macelis D", journal: "Nucleic Acids Res", year: 2023, access: "open",
    why: "The database the 1,088 enzymes in the tool come from.",
  },
  {
    pmid: "19304878", doi: "10.1093/bioinformatics/btp163", pmcid: "PMC2682512",
    title: "Biopython: freely available Python tools for computational molecular biology and bioinformatics",
    authors: "Cock PJ, Antao T, Chang JT, Chapman BA, Cox CJ, Dalke A, and others", journal: "Bioinformatics", year: 2009, access: "open",
    why: "The library these TypeScript ports are checked against, case by case.",
  },
];

/** The list: chosen by Matthew on 2026-11-19, details checked on Europe PMC that day. */
export const reading: ReadingList = { chosen: true, checked: "2026-11-19", papers };
