/**
 * What Bionet is, and what it does not do.
 *
 * Almost everything here is the protocol's own argument, restated for somebody who has not read any
 * code. Where the packages put something better than a restatement would — and `origin.ts` and
 * `trust.ts` are blunt in a way worth keeping — their words are quoted and marked as theirs.
 *
 * `cites` names exports this page leans on. `lib/libraries.ts` checks them against the installed
 * packages when the site is built, so a claim that rests on a function cannot outlive the function.
 */

/** A passage of the page: a heading and its paragraphs, with an optional quotation under them. */
export interface Passage {
  id: string;
  heading: string;
  paragraphs: string[];
  /** A list under the paragraphs, where the point is a set of separate things. */
  points?: { term: string; text: string }[];
  /** Words taken from a package's prose, shown as the package's own. */
  quote?: { from: string; file: string; text: string };
  /**
   * An export whose own documentation says the thing better than a restatement would. Unlike
   * `quote`, nothing is copied here: the words are read from the package when the site is built.
   */
  quoteExport?: { pack: string; name: string };
}

/** One way a lab can run, and what it costs. From the hosting tiers in PLAN.md. */
export interface Tier {
  tier: string;
  gives: string;
  costs: string;
  today: string;
}

/** Exports the page's claims rest on, checked when the site is built. */
export const CITES: { pack: string; name: string }[] = [
  { pack: "bionet", name: "readInventory" },
  { pack: "bionet", name: "verifyInventory" },
  { pack: "bionet", name: "originMatches" },
  { pack: "bionet", name: "settled" },
  { pack: "bionet", name: "remember" },
  { pack: "bionet", name: "mergeLog" },
  { pack: "bionet", name: "isMember" },
  { pack: "bionet-panels", name: "BackUpLab" },
  { pack: "bionet-panels", name: "RestoreLab" },
];

export const PASSAGES: Passage[] = [
  {
    id: "the-problem",
    heading: "The problem it starts from",
    paragraphs: [
      "Molecular biology has got good at writing plans down. A cloning plan can be published in a form precise enough that software replays every step and confirms the molecule at the end really follows from the parts at the start. That is a genuine advance, and it is where the rest of biolibs lives.",
      "It also stops short of the thing a person actually needs. A plan you can replay is a plan you can believe, and belief is not a plasmid. Somebody, somewhere, has to have the tube.",
      "Bionet is the part that answers that: labs saying what they hold, in a form another lab can check, so a plan can be acted on and not only read.",
    ],
    quote: {
      from: "bionet",
      file: "index.ts",
      text: "A plan that replays is a plan you can believe, but belief is not a plasmid. Somebody has to have the parts.",
    },
  },
  {
    id: "what-a-lab-does",
    heading: "What a lab does",
    paragraphs: [
      "A lab writes down what it holds. Each part is named by a checksum of the molecule rather than by whatever the lab calls it on the tube, so two labs holding the same thing say the same thing about it without having agreed on anything first. The lab signs that list with its own key and publishes it at a fixed path on its own web address, the way a site publishes other well-known files.",
      "There is no registry, no index and nothing in the middle. If you want to know what a lab holds, you fetch it from that lab.",
    ],
  },
  {
    id: "what-fetching-settles",
    heading: "What fetching one settles",
    paragraphs: [
      "Three separate things, each checked on its own, and it is worth keeping them apart because they are easy to run together:",
    ],
    points: [
      { term: "That it is an inventory", text: "The document is shaped the way an inventory is shaped, checked before anything else looks at it." },
      { term: "That the signatures hold", text: "Every signature over the list verifies against the key that claims to have made it." },
      { term: "That it came from where it says", text: "The address the document names is the address it was actually served from." },
    ],
    quoteExport: { pack: "bionet", name: "settled" },
  },
  {
    id: "what-it-does-not-do",
    heading: "What it does not do",
    paragraphs: [
      "So the protocol never tells you whose lab you are looking at. It cannot, and it is better to say that plainly than to let a row of green ticks imply otherwise.",
      "The edges are worth being exact about, because a security claim that is slightly too broad is worse than none at all:",
    ],
    points: [
      { term: "It binds a key to an address, not to a person or an institution", text: "Whoever controls the web address controls which key appears there. There is no authority in this network to say otherwise, and none is planned." },
      { term: "It is https or nothing", text: "Over plain http the connection proves nothing: anything in the middle can swap the document. The only exception is a machine talking to itself." },
      { term: "First sight is a leap", text: "You cannot tell a lab's real key from a convincing stand-in the first time you look. Nothing in the protocol closes that gap, and no amount of signing does." },
    ],
    quote: {
      from: "bionet",
      file: "origin.ts",
      text: "If you already know that wrenlab.example is the Wren lab — because you read it in a paper, or a colleague told you, or it is written on their door — then an inventory served from https://wrenlab.example and signed by a key ties that key to that lab, as firmly as you trust the address and the connection.",
    },
  },
  {
    id: "what-it-does-instead",
    heading: "What it offers instead of an authority",
    paragraphs: [
      "Write the key down, and every visit after the first is worth something. A key that is the same is the same correspondent as last time. A key that has changed is either a lab that rotated its key or somebody standing where the lab used to be — and only the lab can tell you which.",
      "That is a smaller promise than a certificate authority makes, and it is one the network can actually keep. The record decides nothing by itself; it reports whether it has seen these keys at this address before. The question gets asked, which is the part that matters.",
    ],
  },
  {
    id: "inside-a-lab",
    heading: "Inside a lab",
    paragraphs: [
      "A lab is not a database that members take turns writing to. It is every member's own log of signed changes, and what the lab holds is worked out by merging them. Nothing has to be online for work to carry on: a device records what happened at the bench into its own log and catches up with the others whenever it next can.",
      "That is also why a lab can be carried on a file. Everything a device holds of the lab can be written out and brought back somewhere else, because the log is the lab.",
    ],
  },
  {
    id: "the-peer",
    heading: "The machine in the middle, which is not trusted",
    paragraphs: [
      "Two members who are never online at the same time still need somewhere to leave changes for each other. That is a peer: a machine that keeps a copy of the lab's log and passes entries along.",
      "It holds no key. It is not on the roster, so it cannot write anything into the lab, and what it may pass on is decided by the protocol rather than by the peer's good behaviour. The worst a peer can do is withhold changes or serve stale ones. It cannot forge one. Its store is a cache, too: if the host wipes it, members simply send the log again.",
      "This is what makes a free host a reasonable place to run one, which matters more than it sounds — it is the difference between a lab needing a hosting budget and not.",
    ],
  },
];

/** How a lab can run, from the cheapest up. */
export const TIERS: Tier[] = [
  {
    tier: "The desktop app alone",
    gives: "A full lab on one computer. Founding a lab needs no peer and no network.",
    costs: "Nothing",
    today: "Works",
  },
  {
    tier: "Carrying the lab on a file",
    gives: "Everything a device holds written out and brought back on another, checked on the way in.",
    costs: "Nothing",
    today: "Works, but built as a backup rather than as a way to stay in step",
  },
  {
    tier: "A peer on a free host",
    gives: "Members who are never online together still sync.",
    costs: "Nothing, but it sleeps when idle",
    today: "Works — one of the example labs runs this way",
  },
  {
    tier: "A peer that is always on",
    gives: "The same, with no wake-up delay.",
    costs: "The lab's own hosting bill",
    today: "The same code on a paid plan, or on a machine in the lab",
  },
];
