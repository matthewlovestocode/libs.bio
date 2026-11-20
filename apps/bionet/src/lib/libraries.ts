/**
 * Joins the hand-written stack in `content/libraries.ts` to what the packages say about themselves,
 * which `scripts/libraries.mjs` reads from the installed ones when the site is built.
 *
 * The page names a handful of exports per package. Nothing stops that handful going stale except
 * this: `check` runs when the module is first loaded, which is while the site is being built, so a
 * renamed or withdrawn export stops the build rather than leaving a page that quietly lies.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LAYERS, type Layer } from "../../content/libraries.ts";
import { CITES } from "../../content/what-it-is.ts";

/** What a package says about one of its exports. */
export interface Export {
  name: string;
  kind: "function" | "class" | "interface" | "type" | "constant";
  signature: string;
  /** The first line of its doc comment, as the package wrote it. */
  summary: string;
}

/** One package, as read from the copy installed. */
interface Read {
  name: string;
  version: string;
  description: string;
  exports: Record<string, Omit<Export, "name">>;
}

/** One package, ready to show: its own words, and the few names this page picked out. */
export interface Shown {
  name: string;
  version: string;
  /** The package's own one-line description, from its manifest. */
  description: string;
  /** Why you would reach for it, which is this site's to say. */
  why: string;
  shown: Export[];
  /** How many it exports in all, so the page can say what it is leaving out. */
  total: number;
}

/** One layer of the stack, with its packages read. */
export interface ShownLayer extends Omit<Layer, "packages"> {
  packages: Shown[];
}

const PACKAGES = JSON.parse(
  readFileSync(join(process.cwd(), "src", "generated", "libraries.json"), "utf8"),
) as Read[];

const byName = new Map(PACKAGES.map((pack) => [pack.name, pack]));

/**
 * Holds the page to the packages.
 *
 * @returns Every disagreement found, as sentences. Empty when the page is telling the truth.
 */
export function check(): string[] {
  const problems: string[] = [];
  const introduced = new Set<string>();
  for (const layer of LAYERS) {
    for (const one of layer.packages) {
      introduced.add(one.id);
      const pack = byName.get(one.id);
      if (pack === undefined) {
        problems.push(`The page introduces @biolibs/${one.id}, which is not among the packages read.`);
        continue;
      }
      for (const name of one.show) {
        if (!(name in pack.exports)) problems.push(`@biolibs/${one.id} does not export ${name}, which the page shows.`);
      }
    }
  }
  // A package read but never introduced would simply be missing from the page, with nothing to say so.
  for (const pack of PACKAGES) {
    if (!introduced.has(pack.name)) problems.push(`@biolibs/${pack.name} is read but no layer introduces it.`);
  }

  // What Bionet is rests on these: a claim about what the protocol settles should not outlive the
  // function that settles it.
  for (const cite of CITES) {
    const pack = byName.get(cite.pack);
    if (pack === undefined) problems.push(`What Bionet is cites @biolibs/${cite.pack}, which is not among the packages read.`);
    else if (!(cite.name in pack.exports)) problems.push(`@biolibs/${cite.pack} does not export ${cite.name}, which What Bionet is rests on.`);
  }
  return problems;
}

/**
 * Some doc comments are a paragraph. A list wants one line of it.
 *
 * @param text - A summary as the package wrote it.
 * @returns Its first sentence, or the whole thing when it is already one.
 */
export function firstSentence(text: string): string {
  const stop = /[.?!](\s|$)/.exec(text);
  return stop === null ? text : text.slice(0, stop.index + 1);
}

/**
 * @param pack - A package's name without the `@biolibs/` in front.
 * @param name - One of its exports.
 * @returns What the package says about it, checked by `check` when the site is built.
 */
export function cited(pack: string, name: string): Export {
  const found = byName.get(pack)?.exports[name];
  if (found === undefined) throw new Error(`@biolibs/${pack} does not export ${name}.`);
  return { name, ...found };
}

/** @returns The stack, each package with its own words and the names this page shows. */
export function stack(): ShownLayer[] {
  return LAYERS.map((layer) => ({
    ...layer,
    packages: layer.packages.map((one) => {
      const pack = byName.get(one.id);
      if (pack === undefined) throw new Error(`@biolibs/${one.id} was not read.`);
      return {
        name: pack.name,
        version: pack.version,
        description: pack.description,
        why: one.why,
        total: Object.keys(pack.exports).length,
        shown: one.show.map((name) => ({ name, ...pack.exports[name] })),
      };
    }),
  }));
}

/** @returns How many packages the page covers, and how many exports they have between them. */
export function totals(): { packages: number; exports: number } {
  return {
    packages: PACKAGES.length,
    exports: PACKAGES.reduce((sum, pack) => sum + Object.keys(pack.exports).length, 0),
  };
}

const problems = check();
if (problems.length > 0) throw new Error(`The site disagrees with the packages:\n  ${problems.join("\n  ")}`);
