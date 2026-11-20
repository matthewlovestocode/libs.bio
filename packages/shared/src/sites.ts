/** The two sites, and where their source and packages are. */

/** One of the two sites. */
export interface Site {
  /** What it is called. */
  name: string;
  /** Where it is served from, with no trailing slash. */
  url: string;
}

/** The libraries' site and Bionet's. Each links to the other. */
export const SITES = {
  libs: { name: "libs.bio", url: "https://libs.bio" },
  bionet: { name: "Bionet", url: "https://bionet.libs.bio" },
} as const satisfies Record<string, Site>;

/** Where things live outside the two sites. */
export const LINKS = {
  /** This repository: both sites and the plan they are built to. */
  source: "https://github.com/matthewlovestocode/libs.bio",
  /** The libraries themselves. */
  biolibs: "https://github.com/matthewlovestocode/biolibs",
  /** The published packages. */
  npm: "https://www.npmjs.com/org/biolibs",
  /** The desktop app: the lab's freezer, kept by the people in the lab. Not released yet. */
  desktop: "https://github.com/matthewlovestocode/bionet-desktop",
  /** The licence the sites' own writing and drawings are under. */
  contentLicence: "https://creativecommons.org/licenses/by/4.0/",
} as const;
