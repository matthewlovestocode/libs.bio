/**
 * Fetching a nucleotide record from NCBI by its accession number.
 *
 * The visitor's own browser asks NCBI, through `@biolibs/entrez`. The request does not pass through
 * this site, which has no server to pass it through. NCBI sees the accession number asked for.
 * The package is loaded only when something is fetched.
 */

/** What an accession number looks like: letters, digits, an underscore, and a version. */
const ACCESSION = /^[A-Za-z0-9_]+(\.\d+)?$/;

/**
 * NCBI asks every client for a contact address, and uses it to get in touch before throttling one.
 * It is read when the site is built and ends up in the page, so it is public. Without it the site
 * is an anonymous client, which works.
 */
const CONTACT = process.env.NEXT_PUBLIC_NCBI_EMAIL;

/**
 * Fetch a record as GenBank text.
 *
 * @param accession - An accession number, like `J01749`.
 * @returns A file name for the record and its contents, as if a GenBank file had been opened.
 * @throws If it is not an accession number, NCBI has no such record, or NCBI cannot be reached.
 */
export async function fetchRecord(accession: string): Promise<{ fileName: string; bytes: Uint8Array }> {
  const id = accession.trim();
  if (!ACCESSION.test(id)) throw new Error("That does not look like an accession number.");
  const [{ efetch, settings }, { captureWarnings }] = await Promise.all([import("@biolibs/entrez"), import("@biolibs/core")]);
  settings.tool = "libs.bio";
  if (CONTACT !== undefined && CONTACT !== "") settings.email = CONTACT;
  // The package warns when no contact address is set. The warning is caught and not printed.
  const { result, error } = captureWarnings(() => efetch("nucleotide", { id, rettype: "gb", retmode: "text" }));
  if (error) throw error;
  const text = (await result!).readText();
  // NCBI answers an unknown identifier with success and a message, not an HTTP error.
  if (!text.startsWith("LOCUS")) throw new Error(`NCBI has no nucleotide record called ${id}.`);
  return { fileName: `${id}.gb`, bytes: new TextEncoder().encode(text) };
}
