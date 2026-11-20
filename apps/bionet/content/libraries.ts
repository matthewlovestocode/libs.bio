/**
 * The Bionet packages as a stack: what each one is for, and the few names you start from.
 *
 * This is the hand-written half of the libraries page. The other half — each package's version, its
 * own one-line description, and what it says about each name below — is read from the installed
 * package when the site is built. So the words here are about *why* you would reach for something,
 * and never about what it does; that is the library's own to say.
 *
 * Deliberately a handful per package. Eleven packages export more than seven hundred things between
 * them, and a list of all of them is a reference, not an introduction. `bionet-tools` alone has 301.
 */

/** One package, as this page introduces it. */
export interface Introduced {
  /** Its name without the `@biolibs/` in front. */
  id: string;
  /** When you would reach for it, and what it rests on. Never what its exports do. */
  why: string;
  /** The names to show, in the order they make sense in. Checked against the package at build time. */
  show: string[];
}

/** One layer of the stack. */
export interface Layer {
  /** Its place in an address: `/libraries#<id>`. */
  id: string;
  title: string;
  /** What this layer is, in a sentence. */
  blurb: string;
  packages: Introduced[];
}

/** The stack, from the protocol up to the things that only show it off. */
export const LAYERS: Layer[] = [
  {
    id: "protocol",
    title: "The protocol",
    blurb: "A lab is a log of signed entries. Everything else reads one, writes one, or draws one.",
    packages: [
      {
        id: "bionet",
        why: "The whole protocol, and the only package the rest of the stack cannot do without. A lab is not a database here: it is every member's signed entries, merged. That is why founding a lab, writing an entry and merging a log are three separate things, and why what a lab shows the world is worked out rather than stored.",
        show: ["foundLab", "writeEntry", "verifyEntry", "mergeLog", "publicInventory", "fetchInventory"],
      },
    ],
  },
  {
    id: "devices",
    title: "A device, and the network",
    blurb: "One lab runs on several machines, none of which has to be online at the same time as another.",
    packages: [
      {
        id: "bionet-client",
        why: "What runs on a person's own machine: its key, its copy of the log, and everything a member is allowed to do. It works with no network at all and syncs when there is one, which is why the key and the log can both be sealed and carried to another device.",
        show: ["Lab", "PeerLink", "sealKey", "openKey", "readBackup"],
      },
      {
        id: "bionet-peer",
        why: "The machine in the middle that is not trusted. It holds no key, so it cannot write anything into the lab or read what the roster does not let it; it keeps a copy of the log and passes entries between members who are never online together.",
        show: ["createPeer", "filePeerStore", "memoryPeerStore"],
      },
    ],
  },
  {
    id: "place-and-look",
    title: "Where things are, and how it looks",
    blurb: "Two packages with no behaviour of their own: plain data about space, and colours with meanings.",
    packages: [
      {
        id: "bionet-space",
        why: "A freezer is a tree of places — room, freezer, shelf, rack, box — and a tube is at one position in one box. This works all of that out as plain data, with no drawing anywhere in it, which is what lets the same arrangement be drawn in three dimensions or printed on a label.",
        show: ["arrange", "slotName", "slotFrom", "firstFreeSlot", "storedWithin", "exampleLab"],
      },
      {
        id: "bionet-theme",
        why: "Every colour once, with its meaning rather than its appearance: whose a thing is, whether it is held, whether it needs looking at. It ships both a light and a dark value for each, and both this site and libs.bio are drawn in them.",
        show: ["colour", "cssVariable", "themeCss", "markSvg"],
      },
    ],
  },
  {
    id: "application",
    title: "Building a lab's application",
    blurb: "Three layers of interface, each usable without the one above it: state, panels, and the lab in three dimensions.",
    packages: [
      {
        id: "bionet-react",
        why: "Hooks with no appearance at all. They give you the lab as it currently stands, a way to ask for a change, and — because a change can be refused by the protocol rather than by a form — the reason the last one was refused.",
        show: ["LabProvider", "useLab", "useAct", "useTrouble"],
      },
      {
        id: "bionet-panels",
        why: "The parts of a lab application, ready to place: the freezer, the places, the people, the history, what is shared with other labs. Take the whole window, or take one panel and put it in your own. Each draws nothing until the lab has arrived, so there is no loading state to write.",
        show: ["LabWindow", "Freezer", "Places", "People", "History", "Sharing"],
      },
      {
        id: "bionet-scene",
        why: "The lab drawn as rooms, freezers, boxes and tubes, with a camera that moves from the whole lab down to one position in one box. Built on React Three Fiber, and it needs three.js as a peer. The explorer is for looking; the builder is for arranging a lab by hand and telling it where things stand.",
        show: ["LabExplorer", "LabScene", "LabBuilder", "focusOn", "needsArranging"],
      },
    ],
  },
  {
    id: "bench",
    title: "At the bench",
    blurb: "The one package that does biology, and it does it against the tubes a lab actually holds.",
    packages: [
      {
        id: "bionet-tools",
        why: "A PCR or a check digest run in silico from the lab's own freezer, so what went in is taken off the shelf and what came out becomes a tube. It is the one place where Bionet meets the biolibs libraries — restriction, pcr, gel, align and a dozen more. Alongside each figure a tool produces there is a companion that shows the arithmetic behind it, such as lengthWorking, migrationWorking and countsWorking, because a figure a person is asked to trust should be one they can check.",
        show: ["planPcr", "planDigest", "pcrTubes", "digestRun", "translateGene", "planInduction", "programmeChecks"],
      },
    ],
  },
  {
    id: "agent",
    title: "For an agent",
    blurb: "An adviser with no hands: it may read the lab and look things up, and propose, but not act.",
    packages: [
      {
        id: "bionet-agent",
        why: "Served over the Model Context Protocol from the member's own device, so nothing leaves the lab except the lookups it makes at NCBI. The limits are exported alongside the tools and are worth reading before the tools themselves: what it may ask, how much it may be handed back, and that it proposes work for a person to carry out rather than carrying it out.",
        show: ["agentTools", "AGENT_INSTRUCTIONS", "lookupTools", "DATABASES", "MOST_BASES", "serveAgent"],
      },
    ],
  },
  {
    id: "see-it",
    title: "To see it",
    blurb: "A made-up lab and a walk through it, which is the quickest way to understand the rest.",
    packages: [
      {
        id: "bionet-demo",
        why: "A freezer that does not exist, filled with molecules that do, and a tour that uses the real tools on it. Nothing here is needed to build anything; it is here because the stack above is easier to read once you have seen what it adds up to.",
        show: ["Demo", "demoLab", "demoTour", "demoMolecules"],
      },
    ],
  },
];
