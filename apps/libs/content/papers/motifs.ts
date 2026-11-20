/**
 * The papers behind the motifs topic, chosen by Matthew on 2026-11-19.
 *
 * The details were looked up on Europe PMC by hand on the date below, so each one is what Europe
 * PMC says and not what anybody remembered. Fetching them when the site is built is not written
 * yet.
 */
import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "3525846", doi: "10.1016/0022-2836(86)90165-8", pmcid: null,
    title: "Information content of binding sites on nucleotide sequences",
    authors: "Schneider TD, Stormo GD, Gold L, Ehrenfeucht A", journal: "J Mol Biol", year: 1986, access: "paywalled",
    why: "Where the bits come from. Measuring a binding site by how much uncertainty it removes is the idea the whole topic rests on, and the reason a logo's letters are the heights they are.",
  },
  {
    pmid: "2172928", doi: "10.1093/nar/18.20.6097", pmcid: "PMC332411",
    title: "Sequence logos: a new way to display consensus sequences",
    authors: "Schneider TD, Stephens RM", journal: "Nucleic Acids Res", year: 1990, access: "free",
    why: "The picture this tool draws, and the paper that introduced it. It replaced the consensus string, which throws away how strongly each position is held.",
  },
  {
    pmid: "10487864", doi: "10.1093/bioinformatics/15.7.563", pmcid: null,
    title: "Identifying DNA and protein patterns with statistically significant alignments of multiple sequences",
    authors: "Hertz GZ, Stormo GD", journal: "Bioinformatics", year: 1999, access: "paywalled",
    why: "Where one of the two score thresholds in this tool comes from, and a careful treatment of what makes a match worth believing rather than merely high-scoring.",
  },
  {
    pmid: "7584402", doi: null, pmcid: null,
    title: "Fitting a mixture model by expectation maximization to discover motifs in biopolymers",
    authors: "Bailey TL, Elkan C", journal: "Proc Int Conf Intell Syst Mol Biol", year: 1994, access: "paywalled",
    why: "MEME: finding a motif nobody has told you about, which is the harder problem this tool does not attempt. It takes the instances as given.",
  },
  {
    pmid: "37962376", doi: "10.1093/nar/gkad1059", pmcid: "PMC10767809",
    title: "JASPAR 2024: 20th anniversary of the open-access database of transcription factor binding profiles",
    authors: "Rauluseviciute I, Riudavets-Puig R, Blanc-Mathieu R, Castro-Mondragon JA, and others", journal: "Nucleic Acids Res", year: 2024, access: "open",
    why: "Where real motifs come from rather than being made up: thousands of them, free, in a format the libraries read.",
  },
];

/** The list: chosen, with details checked on Europe PMC on the date given. */
export const reading: ReadingList = { chosen: true, checked: "2026-11-19", papers };
