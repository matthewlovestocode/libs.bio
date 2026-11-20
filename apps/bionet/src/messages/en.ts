/** The interface's words, in English. */
export const en = {
  name: "bionet",
  title: "Bionet",
  description: "A lab's freezer, kept by the people in the lab and shared with other labs, with nothing in the middle that has to be trusted.",
  nav: { libs: "libs.bio", source: "Source" },
  status: { stable: "Stable", moving: "Still changing" },
  home: {
    building: "Being built",
    heading: "A lab's freezer, kept by the people in the lab.",
    lede: "Shared with other labs, with nothing in the middle that has to be trusted. It works with no network, and syncs when there is one.",
    body: "This site is being built in the open. Bionet itself is still in development: the protocol and the desktop app exist, and there is no download yet.",
    nextHeading: "What comes first",
    next: [
      "What Bionet is, and what it does not do",
      "A demonstration lab that runs in your browser",
      "Guides for hosting a lab's own node",
    ],
    nowHeading: "In the meantime",
    protocol: "The protocol and its packages",
    libraries: "The libraries Bionet is built from",
    plan: "The plan this site is built to",
  },
  libraries: {
    title: "Libraries",
    description: "The packages Bionet is built from, as a stack: what each one is for, and the few names you start from.",
    heading: "The libraries Bionet is built from.",
    lede: "Eleven packages, in layers. The protocol is at the bottom, and each layer needs only the ones beneath it.",
    layers: "Layers",
    counts: (packages: number, exports: number) =>
      `${exports.toLocaleString("en")} exports between the ${packages}. This page shows a handful from each, which makes it an introduction and not a reference.`,
    rest: (shown: number, total: number, name: string) =>
      total <= shown
        ? `All ${total} of its exports are above.`
        : `${shown} of ${total}. The rest are in the package's own types, which ship with it: npm install @biolibs/${name}.`,
    undocumented: "The package says nothing about this one.",
    installHeading: "Using them",
    installNote: "Every package is published on npm under @biolibs, carries its own TypeScript types, and is MIT. Bionet itself is still in development, so the versions above will move.",
    plan: "The plan this site is built to",
  },
  footer: "Code MIT · Content CC BY 4.0 · No accounts, no tracking",
} as const;
