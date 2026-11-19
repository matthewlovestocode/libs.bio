/**
 * Asking the three public services a question: NCBI for sequences, UniProt for proteins, Europe PMC
 * for papers.
 *
 * Each request goes from the visitor's own browser to the service, through the biolibs package for
 * it. Nothing passes through this site, which has no server to pass it through, and each service
 * sees only what was asked of it. The packages are loaded when one is used, so a page that looks
 * nothing up carries none of them.
 */

/** What this software calls itself when it asks. Never a person's name. */
const TOOL = "libs.bio";

/**
 * NCBI asks every client for a contact address and uses it to get in touch before throttling one.
 * It is read when the site is built and ends up in the page, so it is public. Unset, as it is now,
 * the site is an anonymous client, which works.
 */
const CONTACT = process.env.NEXT_PUBLIC_NCBI_EMAIL;

/** One record NCBI knows about. */
export interface NcbiRecord {
  accession: string;
  title: string;
  /** How long the sequence is, where NCBI says. */
  length: number | null;
  organism: string;
}

/** What a search of NCBI gave. */
export interface Records {
  /** How many records matched in all, which is usually far more than were asked for. */
  matched: number;
  records: NcbiRecord[];
}

/**
 * Search NCBI's nucleotide or protein records.
 *
 * @param term - The query, in NCBI's own syntax: `pUC19[title]`, `Homo sapiens[orgn]`.
 * @param database - `"nucleotide"` or `"protein"`.
 * @param most - How many records to bring back.
 * @returns What matched, and the first few.
 * @throws If NCBI cannot be reached or refuses the query.
 */
export async function searchRecords(term: string, database: string, most: number): Promise<Records> {
  if (term.trim() === "") return { matched: 0, records: [] };
  const [{ esearch, esummary, settings }, { captureWarnings }] = await Promise.all([import("@biolibs/entrez"), import("@biolibs/core")]);
  settings.tool = TOOL;
  if (CONTACT !== undefined && CONTACT !== "") settings.email = CONTACT;
  // The package warns when no contact address is set, every time. It is caught and not printed.
  const found = captureWarnings(() => esearch(database, term.trim(), { retmax: most, retmode: "json" }));
  if (found.error) throw found.error;
  const search = JSON.parse(await (await found.result!).readText()) as { esearchresult?: { count?: string; idlist?: string[]; ERROR?: string } };
  const result = search.esearchresult;
  if (result?.ERROR !== undefined) throw new Error(result.ERROR);
  const ids = result?.idlist ?? [];
  const matched = Number(result?.count ?? 0);
  if (ids.length === 0) return { matched, records: [] };

  const summaries = captureWarnings(() => esummary({ db: database, id: ids.join(","), retmode: "json" }));
  if (summaries.error) throw summaries.error;
  type Summary = { caption?: string; accessionversion?: string; title?: string; slen?: number; organism?: string };
  const described = JSON.parse(await (await summaries.result!).readText()) as { result?: { uids?: string[] } & Record<string, Summary | string[] | undefined> };
  const docs = described.result ?? {};
  const records = (docs.uids ?? []).map((id) => {
    const one = docs[id] as Summary | undefined;
    return {
      accession: one?.accessionversion ?? one?.caption ?? id,
      title: one?.title ?? "",
      length: typeof one?.slen === "number" ? one.slen : null,
      organism: one?.organism ?? "",
    };
  });
  return { matched, records };
}

/** One change made to a protein after it is built. */
export interface Modification {
  /** Where it is, counted along the protein as the gene makes it. */
  at: number;
  /** Where the same residue is once the signal peptide has been cut off, which is what a lab holds. */
  onChain: number | null;
  what: string;
}

/** A protein, as UniProt has it. */
export interface Protein {
  accession: string;
  name: string;
  gene: string;
  /** Whether a curator has been over it, which is the first field to look at. */
  reviewed: boolean;
  organism: string;
  /** How long it is as the gene makes it. */
  length: number;
  /** How long what a lab holds is, once the signal peptide is gone. */
  chainLength: number | null;
  signal: { from: number; to: number } | null;
  modifications: Modification[];
}

/**
 * Look a protein up in UniProt by its accession.
 *
 * @param accession - An accession such as `P02666`.
 * @returns What UniProt holds about it.
 * @throws If there is no such entry, or UniProt cannot be reached.
 */
export async function lookUpProtein(accession: string): Promise<Protein> {
  const id = accession.trim().toUpperCase();
  if (id === "") throw new Error("Give an accession, such as P02666.");
  const uniprot = await import("@biolibs/uniprot");
  uniprot.settings.tool = TOOL;
  const entry = uniprot.readProtein(await uniprot.lookUpProtein(id)) as unknown as {
    name: string; gene?: string; reviewed: boolean; length: number; organism?: string;
    chain?: { length?: number } | null; signal?: { from: number; to: number } | null;
    modifications: { at: number; what: string }[];
  };
  return {
    accession: id,
    name: entry.name,
    gene: entry.gene ?? "",
    reviewed: entry.reviewed,
    organism: entry.organism ?? "",
    length: entry.length,
    chainLength: entry.chain?.length ?? null,
    signal: entry.signal ?? null,
    modifications: entry.modifications.map((one) => ({
      at: one.at,
      onChain: (uniprot.onTheChain(entry as never, one.at) as number | null) ?? null,
      what: one.what,
    })),
  };
}

/** One paper Europe PMC knows about. */
export interface Article {
  pmid: string;
  pmcid: string | null;
  doi: string | null;
  title: string;
  authors: string;
  journal: string;
  year: string;
  /** Whether it is published open access, which is a licence. */
  openAccess: boolean;
  /** Whether the whole text is here to read, which is a different question. */
  fullText: boolean;
}

/** What a search of Europe PMC gave. */
export interface Articles {
  matched: number;
  articles: Article[];
}

/**
 * Search Europe PMC.
 *
 * @param query - Plain words, phrases in quotes, or Europe PMC's fields: `TITLE:`, `AUTH:`,
 *   `JOURNAL:`, `PUB_YEAR:`, and `METHODS:`, which searches the methods sections of open papers.
 * @param most - How many to bring back.
 * @returns What matched, and the first few.
 * @throws If Europe PMC cannot be reached or refuses the query.
 */
export async function searchPapers(query: string, most: number): Promise<Articles> {
  if (query.trim() === "") return { matched: 0, articles: [] };
  const europepmc = await import("@biolibs/europepmc");
  europepmc.settings.tool = TOOL;
  const found = await europepmc.searchArticles(query.trim(), { abstracts: false }) as unknown as {
    matched: number;
    results: { pmid?: string; pmcid?: string; doi?: string; title?: string; authors?: string; authorString?: string; journal?: string; year?: string | number; openAccess?: boolean; fullText?: boolean }[];
  };
  return {
    matched: found.matched,
    articles: found.results.slice(0, most).map((one) => ({
      pmid: one.pmid ?? "",
      pmcid: one.pmcid ?? null,
      doi: one.doi ?? null,
      title: one.title ?? "",
      authors: one.authors ?? one.authorString ?? "",
      journal: one.journal ?? "",
      year: String(one.year ?? ""),
      openAccess: one.openAccess === true,
      fullText: one.fullText === true,
    })),
  };
}

/** A paper's text, section by section. */
export interface Paper {
  title: string;
  /** The licence it is under, which decides what may be done with the text. */
  licence: string | null;
  sections: { heading: string; text: string }[];
  /** How many tables were lifted out of the running text. */
  tables: number;
}

/**
 * Read a paper's whole text from Europe PMC, as sections rather than as markup.
 *
 * @param pmcid - Its PubMed Central id, such as `PMC332411`.
 * @returns The paper, broken into its sections.
 * @throws If the text is not there, or Europe PMC cannot be reached.
 */
export async function readPaper(pmcid: string): Promise<Paper> {
  const id = pmcid.trim().toUpperCase();
  if (!/^PMC\d+$/.test(id)) throw new Error("A PubMed Central id looks like PMC332411.");
  const europepmc = await import("@biolibs/europepmc");
  europepmc.settings.tool = TOOL;
  const paper = europepmc.readArticle(await europepmc.fullTextOf(id)) as unknown as {
    title?: string; licence?: string | null;
    sections: { heading?: string; text?: string }[];
    tables?: unknown[];
  };
  return {
    title: paper.title ?? id,
    licence: paper.licence ?? null,
    sections: paper.sections.map((one) => ({ heading: one.heading ?? "", text: one.text ?? "" })).filter((one) => one.text !== ""),
    tables: paper.tables?.length ?? 0,
  };
}
