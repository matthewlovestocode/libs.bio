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
    plan: "The plan this site is built to",
  },
  footer: "Code MIT · Content CC BY 4.0 · No accounts, no tracking",
} as const;
