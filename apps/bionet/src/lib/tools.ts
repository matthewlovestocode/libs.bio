/**
 * Joins what this site says about the bench tools to what the desktop app said when it was
 * photographed.
 *
 * `scripts/shots.mjs` in the Bionet desktop app drives the real window, reads the screen back, and
 * writes `shots.json` beside the pictures: the tools the window lists, in its order, and for each
 * photograph what was done to reach it and what was found on the screen before it was taken. That
 * file is copied in beside the prose and kept in this repository, because unlike the library
 * listing it cannot be worked out again while the site is being built: it is the record of a
 * session at a window, and the pictures are no use without it.
 *
 * `check` runs when this module is first loaded, which is while the site is being built. A tool the
 * app has gained, a tool it has lost, a picture with nothing said about it or a profile with no
 * picture all stop the build. The alternative is a page of screenshots that is right on the day it
 * is written and quietly wrong a month later, which is the usual fate of screenshots.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PROFILES, type Profile } from "../../content/tools.ts";

/** One photograph, as the capture wrote it down. */
export interface Shot {
  id: string;
  /** The tool's name, as the window's own tab says it. */
  tab: string;
  /** The model of machine it is used at, as the app records it, or null for a tool used at a desk. */
  at: string | null;
  /** What was done to the window to reach this state. */
  did: string;
  /** What was found on the screen before the picture was taken. */
  shows: string[];
  /** The picture a page uses, and its size, so the room for it can be kept while it loads. */
  web: string;
  width: number;
  height: number;
}

/** Everything the capture wrote down. */
interface Taken {
  took: string;
  versions: Record<string, string>;
  /** Every tool the window offers, in the order the window lists them. */
  tools: string[];
  shots: Shot[];
}

const TAKEN = JSON.parse(readFileSync(join(process.cwd(), "content", "shots.json"), "utf8")) as Taken;

/** A profile with the photograph that goes with it. */
export interface Shown extends Profile {
  shot: Shot;
}

/**
 * Holds the page to the app.
 *
 * @returns Every disagreement found, as sentences. Empty when the page is telling the truth.
 */
export function check(): string[] {
  const problems: string[] = [];
  if (TAKEN.tools.length === 0) problems.push("The capture listed no tools at all, so there is nothing to hold this page to.");
  if (TAKEN.shots.length === 0) problems.push("The capture took no pictures.");

  const has = new Set(TAKEN.tools);
  const shots = new Map(TAKEN.shots.map((shot) => [shot.tab, shot]));
  const profiled = new Set<string>();

  for (const profile of PROFILES) {
    profiled.add(profile.tab);
    if (!has.has(profile.tab)) problems.push(`The page profiles a tool called ${profile.tab}, which the app does not have.`);
    const shot = shots.get(profile.tab);
    if (shot === undefined) {
      problems.push(`The page profiles ${profile.tab}, and there is no picture of it.`);
      continue;
    }
    if (shot.shows.length === 0) problems.push(`The picture of ${profile.tab} was taken without checking anything on the screen.`);
    // The machine is named on this page, and it was read off the screen when the picture was taken.
    if (profile.at !== null && !shot.shows.includes(profile.at)) {
      problems.push(`The page says ${profile.tab} is used at the ${profile.at}, which was not on the screen in its picture.`);
    }
    if (profile.at !== null && shot.at === null) problems.push(`The page gives ${profile.tab} a machine, and the app records none.`);
    if (profile.at === null && shot.at !== null) problems.push(`The page uses ${profile.tab} at a desk, and the app records it at ${shot.at}.`);
  }

  // A picture with no profile would appear on the page with nothing said about it.
  for (const shot of TAKEN.shots) {
    if (!profiled.has(shot.tab)) problems.push(`There is a picture of ${shot.tab} and no profile of it.`);
    if (!has.has(shot.tab)) problems.push(`There is a picture of ${shot.tab}, which is not among the tools the app lists.`);
  }
  return problems;
}

/** @returns The profiles, each with its photograph, in the order the page writes them. */
export function profiles(): Shown[] {
  return PROFILES.map((profile) => {
    const shot = TAKEN.shots.find((one) => one.tab === profile.tab);
    if (shot === undefined) throw new Error(`There is no picture of ${profile.tab}.`);
    return { ...profile, shot };
  });
}

/** @returns Every tool the app has, in the window's own order. */
export function everyTool(): string[] {
  return TAKEN.tools;
}

/** @returns When the pictures were taken, written the way a sentence wants it, and the packages that drew them. */
export function taken(): { took: string; versions: Record<string, string> } {
  const day = new Date(`${TAKEN.took}T00:00:00Z`);
  const written = Number.isNaN(day.getTime())
    ? TAKEN.took
    : day.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return { took: written, versions: TAKEN.versions };
}

const problems = check();
if (problems.length > 0) throw new Error(`The site disagrees with the app it photographed:\n  ${problems.join("\n  ")}`);
