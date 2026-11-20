/**
 * The front page.
 *
 * What it replaced was a holding page: a claim, a list of what was coming, and a list of links for
 * the meantime. By the time four real pages existed it had started contradicting itself — *What
 * Bionet is* was promised as still to come on the same screen that linked to it — and a reader
 * arriving at the top of this site was handed the project's to-do list rather than an answer.
 *
 * So the shape here is the three questions somebody actually arrives with. What is it. What will it
 * not do for me. Can I have it. The third is answered honestly, which at the moment means no.
 *
 * None of the counting is written down. `lib/home.ts` works it out from the pages on disk, the
 * packages installed and the photographs taken, and stops the build if what is written here and what
 * is there disagree. The old page said "a demonstration lab that runs in your browser" for as long
 * as it took somebody to notice; this one cannot.
 */

/** A page of this site, as the front page introduces it. */
export interface Door {
  /** Its address under the site root, which has to be a page that exists. */
  route: string;
  title: string;
  blurb: string;
}

export const DOORS: Door[] = [
  {
    route: "what-it-is",
    title: "What Bionet is",
    blurb: "Labs publishing what they hold, signed, at their own address, so a cloning plan can be acted on and not only read — and an exact account of what a signature does not settle.",
  },
  {
    route: "tools",
    title: "The tools at the bench",
    blurb: "A PCR, a check digest, a reading off a spectrophotometer, run from the tubes a lab actually holds. Photographed at work in the desktop app.",
  },
  {
    route: "safety",
    title: "Bionet and biosafety",
    blurb: "What the software does about the handling of biological material, what it does not do, and where that leaves the lab using it.",
  },
  {
    route: "libraries",
    title: "The libraries it is built from",
    blurb: "The packages, in layers, from the protocol up: what each is for and the few names you start from.",
  },
];

/** The picture at the top, which has to be one of the photographs the tools page took. */
export const HERO = {
  /** The tool it is a picture of, named as the app's own tab names it. */
  tool: "PCR",
  caption: "The desktop app, working out a PCR from a template and two primers the lab has on the shelf. The product is drawn on the template between them.",
};

export const WHAT_IT_IS = [
  "A lab writes down what it holds — the molecules, the tubes of each, where they are — and every change is a signed entry in that device's own log. Nothing is written to anybody else's log, so two people working with no network cannot overwrite each other, and what the lab holds is worked out from all the logs together.",
  "A lab that wants to be found publishes some of that at its own address, signed. Another lab reads it and knows what it holds, without either of them having to trust anything in the middle. There is no register to join and nobody to ask.",
];

/** The answer to the question a reader deserves early, which is not yet a good one. */
export const CAN_I_USE_IT = {
  heading: "Can I use it yet",
  answer: "No, not without building it yourself.",
  body: [
    "The protocol is published and the desktop app is written and works, but it is not packaged: there is no installer and nothing to download. The source is open, so it can be built and run today by somebody willing to do that, and this site can explain it but cannot yet get anybody started.",
    "Founding a lab needs no network, no server and no account, and never will. When there is something to download, it will be here.",
  ],
};

/** What this site has reached, which the page states and `lib/home.ts` counts. */
export const WHERE_IT_STANDS =
  "This site is built in the open, to a plan anyone can read. What is here now:";
