/**
 * Candidate papers for the plasmid maps and features topic. A shortlist: Matthew has not chosen
 * from it yet.
 *
 * The details were looked up on Europe PMC by hand on the date below, so each one is what Europe
 * PMC says and not what anybody remembered. Fetching them when the site is built is not written
 * yet.
 */
import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "4594039", doi: "10.1073/pnas.70.11.3240", pmcid: "PMC427208",
    title: "Construction of biologically functional bacterial plasmids in vitro",
    authors: "Cohen SN, Chang AC, Boyer HW, Helling RB", journal: "Proc Natl Acad Sci U S A", year: 1973, access: "free",
    why: "The first plasmid built on purpose from cut pieces. Everything a map shows, an origin, a resistance gene and the sites between them, starts here.",
  },
  {
    pmid: "344137", doi: "10.1016/0378-1119(77)90000-2", pmcid: null,
    title: "Construction and characterization of new cloning vehicles. II. A multipurpose cloning system",
    authors: "Bolivar F, Rodriguez RL, Greene PJ, Betlach MC, Heyneker HL, Boyer HW, Crosa JH, Falkow S", journal: "Gene", year: 1977, access: "paywalled",
    why: "pBR322, the plasmid most later ones descend from, and the model for a map with two resistance genes and single-cut sites inside them.",
  },
  {
    pmid: "2985470", doi: "10.1016/0378-1119(85)90120-9", pmcid: null,
    title: "Improved M13 phage cloning vectors and host strains: nucleotide sequences of the M13mp18 and pUC19 vectors",
    authors: "Yanisch-Perron C, Vieira J, Messing J", journal: "Gene", year: 1985, access: "paywalled",
    why: "pUC19 and its multiple cloning site: many single-cut sites packed into one short stretch, which is still how most plasmids are laid out.",
  },
  {
    pmid: "25392412", doi: "10.1093/nar/gku893", pmcid: "PMC4384007",
    title: "The Addgene repository: an international nonprofit plasmid and data resource",
    authors: "Kamens J", journal: "Nucleic Acids Res", year: 2015, access: "open",
    why: "Where most shared plasmids, and their maps, now come from, and how they are deposited and checked.",
  },
  {
    pmid: "26633141", doi: "10.1371/journal.pbio.1002310", pmcid: "PMC4669170",
    title: "SBOL Visual: A Graphical Language for Genetic Designs",
    authors: "Quinn JY, Cox RS, Adler A, Beal J, Bhatia S, Cai Y, Chen J, Clancy K, and others", journal: "PLoS Biol", year: 2015, access: "open",
    why: "An agreed set of symbols for promoters, coding sequences, terminators and the rest, so that one lab's drawing can be read by another.",
  },
  {
    pmid: "34019636", doi: "10.1093/nar/gkab374", pmcid: "PMC8262757",
    title: "pLannotate: engineered plasmid annotation",
    authors: "McGuffie MJ, Barrick JE", journal: "Nucleic Acids Res", year: 2021, access: "open",
    why: "How features get onto a bare sequence: by matching it against a library of known parts. This tool does not do that, and this paper shows what it takes.",
  },
];

/** The list: a shortlist, with details checked on Europe PMC on the date given. */
export const reading: ReadingList = { chosen: false, checked: "2026-11-19", papers };
