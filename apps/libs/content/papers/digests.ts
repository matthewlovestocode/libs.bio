/**
 * The papers behind the digests and gels topic.
 *
 * The plan is a handful chosen by hand per topic, held as a DOI or PMID, with titles, authors and
 * open-access status fetched from Europe PMC when the site is built. Neither half is done yet:
 * nobody has chosen, and nothing is fetched. What is here is a shortlist of candidates, described
 * and not cited, so that no detail is stated that has not been checked.
 */

/** A candidate, described by what it is and why it would earn its place. */
export interface Candidate {
  what: string;
  why: string;
}

/** Set to `true` once the list has been chosen and its details checked. */
export const chosen = false;

export const candidates: Candidate[] = [
  { what: "The first report of a restriction enzyme that cuts at a specific sequence (Smith and Wilcox, 1970).", why: "The discovery the whole method rests on." },
  { what: "The first use of a restriction enzyme to cut a genome into defined pieces and separate them on a gel (Danna and Nathans, 1971).", why: "The experiment this page's tool predicts, done for the first time." },
  { what: "The paper that introduced agarose gels stained with ethidium bromide for sizing DNA (Sharp, Sugden and Sambrook, 1973).", why: "Where the everyday gel comes from." },
  { what: "A current description of REBASE, the database of restriction enzymes (Roberts and colleagues).", why: "The source of the 1,088 enzymes in the tool." },
  { what: "The paper describing Biopython (Cock and colleagues, 2009).", why: "The library these TypeScript ports are checked against." },
];
