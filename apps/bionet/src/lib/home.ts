/**
 * What the front page says about itself, worked out rather than written down.
 *
 * A front page is where a claim goes stale first and is noticed last: it is the page nobody reads
 * again once it is written, and the one everybody arrives at. The page it replaced promised a
 * demonstration lab and an explainer that had already shipped, on the same screen that linked to
 * the explainer.
 *
 * So nothing on it is counted by hand. The pages it offers are checked against the routes on disk,
 * the packages are the ones installed, and the tools are the ones the desktop app listed when it
 * was photographed. `check` runs while the site is built: a page added without a door, a door to a
 * page that does not exist, or a picture of a tool that was never taken all stop the build.
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { DOORS, HERO, type Door } from "../../content/home.ts";
import { everyTool, profiles, taken } from "./tools.ts";
import { totals } from "./libraries.ts";

/** Every page of this site other than the front page, as the routes on disk have it. */
function routes(): string[] {
  const app = join(process.cwd(), "src", "app");
  return readdirSync(app)
    .filter((name) => statSync(join(app, name)).isDirectory())
    .filter((name) => readdirSync(join(app, name)).includes("page.tsx"))
    .sort();
}

/**
 * Holds the front page to the site.
 *
 * @returns Every disagreement found, as sentences. Empty when the page is telling the truth.
 */
export function check(): string[] {
  const problems: string[] = [];
  const there = new Set(routes());
  const offered = new Set<string>();

  for (const door of DOORS) {
    offered.add(door.route);
    if (!there.has(door.route)) problems.push(`The front page offers /${door.route}, which is not a page of this site.`);
  }
  // A page nobody can reach from the front page is a page that may as well not be there.
  for (const route of there) {
    if (!offered.has(route)) problems.push(`/${route} is a page of this site and the front page does not offer it.`);
  }

  if (!everyTool().includes(HERO.tool)) problems.push(`The front page shows a picture of ${HERO.tool}, which the app does not have.`);
  if (!profiles().some((one) => one.tab === HERO.tool)) problems.push(`The front page shows a picture of ${HERO.tool}, which was never photographed.`);
  return problems;
}

/** The picture at the top, with the size it was taken at. */
export function hero(): { web: string; width: number; height: number; alt: string; caption: string } {
  const found = profiles().find((one) => one.tab === HERO.tool);
  if (found === undefined) throw new Error(`There is no photograph of ${HERO.tool}.`);
  return {
    web: found.shot.web,
    width: found.shot.width,
    height: found.shot.height,
    alt: `The Bionet desktop app, on the ${found.tab} tool. ${found.look}`,
    caption: HERO.caption,
  };
}

/** The pages to offer, in the order the front page writes them. */
export function doors(): Door[] {
  return DOORS;
}

/**
 * What is here now, counted from what is here.
 *
 * @returns The pages, packages, tools and photographs, and when the photographs were taken.
 */
export function standing(): { pages: number; packages: number; exports: number; tools: number; photographed: number; took: string } {
  const { packages, exports } = totals();
  return {
    pages: routes().length,
    packages,
    exports,
    tools: everyTool().length,
    photographed: profiles().length,
    took: taken().took,
  };
}

const problems = check();
if (problems.length > 0) throw new Error(`The front page disagrees with the site:\n  ${problems.join("\n  ")}`);
