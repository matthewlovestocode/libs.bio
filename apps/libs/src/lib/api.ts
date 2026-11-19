/**
 * The API reference's data, as `scripts/api-reference.mjs` writes it from the libraries' own type
 * files. Nothing here is written by hand: it is read when the site is built.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** What kind of thing an export is. */
export type Kind = "function" | "class" | "interface" | "type" | "constant";

/** What an export, or a member of one, says about itself. */
export interface Described {
  name: string;
  /** How it is declared. */
  signature: string;
  summary: string;
  params: { name: string; text: string }[];
  returns: string;
  throws: string[];
  examples: string[];
  deprecated: string | null;
}

/** A member of a class or an interface. */
export interface Member extends Described {
  kind: "constructor" | "method" | "accessor" | "property";
}

/** One thing a package exports. */
export interface Item extends Described {
  kind: Kind;
  members: Member[];
}

/** A package, with everything it exports. */
export interface Package {
  /** Its name without the `@biolibs/` in front. */
  name: string;
  version: string;
  description: string;
  /** What the package says about itself at the top of its entry file. */
  overview: string;
  items: Item[];
}

/** A package, as the list of packages shows it. */
export interface PackageSummary {
  name: string;
  version: string;
  description: string;
  items: number;
}

const folder = join(process.cwd(), "src", "generated", "api");

/** @returns Every documented package, in the order they are listed. */
export function packages(): PackageSummary[] {
  return JSON.parse(readFileSync(join(folder, "index.json"), "utf8")) as PackageSummary[];
}

/**
 * @param name - A package's name without the `@biolibs/` in front.
 * @returns The package and everything it exports.
 */
export function packageNamed(name: string): Package {
  return JSON.parse(readFileSync(join(folder, `${name}.json`), "utf8")) as Package;
}

/** The kinds, in the order their sections are shown. */
export const KINDS: readonly Kind[] = ["function", "class", "interface", "type", "constant"];
