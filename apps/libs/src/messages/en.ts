/** The interface's words, in English. */
export const en = {
  name: "libs",
  tld: ".bio",
  title: "libs.bio",
  description: "Bioengineering libraries in TypeScript, with tools that run in your browser. Free, with no account.",
  nav: { bionet: "Bionet", source: "Source" },
  status: { stable: "Stable", moving: "Still changing" },
  home: {
    building: "Being built",
    heading: "Bioengineering in your browser, and the code behind it.",
    lede: "Cut a plasmid, check a primer, read a file. Then see the calls that did it, the idea behind it, and the papers it comes from.",
    body: "This site is being built in the open. The libraries already exist: TypeScript ports of Biopython and pydna, checked case by case against the originals.",
    nextHeading: "What comes first",
    next: [
      "Restriction digests and gels, as a tool you can use here",
      "The API reference, generated from the libraries",
      "PCR and primers, cloning and assembly, plasmid maps",
    ],
    nowHeading: "In the meantime",
    packages: "The packages on npm",
    libraries: "The libraries' source",
    plan: "The plan this site is built to",
  },
  footer: "Code MIT · Content CC BY 4.0 · No accounts, no tracking",
} as const;
