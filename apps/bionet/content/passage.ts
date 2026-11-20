/**
 * The shape the site's written pages are built from, shared by `what-it-is.ts` and `safety.ts`.
 *
 * A passage is prose with, where it earns it, a list of separate things and a quotation. Quotations
 * come in two kinds, and the difference matters: `quote` is prose copied from a package's own
 * comments, while `quoteExport` names an export and the words are read from the installed package
 * when the site is built. Prefer the second wherever it fits, because it cannot drift.
 */

/** A passage of a page: a heading and its paragraphs, with what may hang off them. */
export interface Passage {
  id: string;
  heading: string;
  paragraphs: string[];
  /** A list under the paragraphs, where the point is a set of separate things. */
  points?: { term: string; text: string }[];
  /** Words taken from a package's prose, shown as the package's own. */
  quote?: { from: string; file: string; text: string };
  /**
   * An export whose own documentation says the thing better than a restatement would. Nothing is
   * copied: the words are read from the package when the site is built.
   */
  quoteExport?: { pack: string; name: string };
}

/** An export a page's claims rest on, checked against the installed package when the site is built. */
export interface Cite {
  pack: string;
  name: string;
}
