/** The shape of a topic's reading list. The lists themselves are in `content/papers/`. */

/** How a reader with no journal subscription can get at a paper. */
export type Access = "open" | "free" | "paywalled";

/** One paper. */
export interface Paper {
  pmid: string;
  /** Its DOI, or `null` for an older paper that never got one. */
  doi: string | null;
  /** Its PubMed Central id, when the full text is there to read. */
  pmcid: string | null;
  title: string;
  authors: string;
  journal: string;
  year: number;
  /**
   * `open`: published open access. `free`: not open access, but free to read in PubMed Central.
   * `paywalled`: neither.
   */
  access: Access;
  /** Why it earns its place. */
  why: string;
}

/** A topic's reading list. */
export interface ReadingList {
  /** Whether the list has been chosen. While it has not, the page says it is a shortlist. */
  chosen: boolean;
  /** The day the details were last looked up on Europe PMC. */
  checked: string;
  papers: Paper[];
}
