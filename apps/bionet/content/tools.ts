/**
 * The bench tools of the Bionet desktop app, and the photographs of four of them at work.
 *
 * A picture of a tool is a claim about what the tool does, and it is the easiest kind of claim to
 * make loosely. So none of these were posed. `scripts/shots.mjs` in the desktop app loads a lab
 * whose materials have been checked by the engines the tools use, works the window as a person
 * would, reads back what is on the screen, and only keeps a picture if what it shows is what it was
 * said to show. Everything under `shows` here was found on the screen before the shutter went.
 *
 * The list of tools is not written down here either. It is read out of the window itself, and
 * `lib/tools.ts` fails the build if the list on this page is not the list the app has — which has
 * already caught one tool appearing while this page was being written.
 */

/** What a tool is for, which is this site's to say rather than the app's. */
export interface Profile {
  /** The name the window gives it, which has to be one the app actually has. */
  tab: string;
  /** The machine it is used at, as the window names it. Desk tools have none. */
  at: string | null;
  why: string;
  /** What is worth looking at in the picture. */
  look: string;
}

export const PROFILES: Profile[] = [
  {
    tab: "Sequences",
    at: null,
    why: "The way a molecule gets into the freezer in the first place. A SnapGene, GenBank, EMBL or FASTA file becomes a part, with whatever the file had marked on it, and any part can then be drawn as a map with the enzymes that cut it. Everything else at the bench works on what this brings in.",
    look: "pWren1, 1,712 bases and circular, with what the file marked on it — an origin, a promoter, the gene — and the enzyme sites found rather than remembered.",
  },
  {
    tab: "PCR",
    at: "Thermocycler",
    why: "A PCR worked out from tubes the lab actually holds: a template off the shelf, two primers off the shelf, and what those three would give. Recording the run takes the amounts used from each tube and puts the product in the freezer as a new tube, so the plan and the inventory cannot drift apart.",
    look: "The product drawn on the template between the two primers, and the thermocycler showing the step it is on. The machine shows nothing of the DNA, which is the point of drawing both.",
  },
  {
    tab: "Digest and gel",
    at: "Gel station",
    why: "A check digest: cut a plasmid with enzymes whose sites are known, and see whether the pieces come out the lengths they should. It is the ordinary way of finding out whether a construct is what you think it is, and it is run here from the tube rather than from a sequence typed in.",
    look: "Two enzymes, two pieces, and a gel with a ladder beside it. The bands are 1,453 and 259 — which is 1,712, the whole plasmid, cut in two.",
  },
  {
    tab: "Reading",
    at: "Spectrophotometer",
    why: "The one tool here that predicts nothing. Every other one works out what a machine would do and offers to record it; a spectrophotometer is handed a number somebody read off a screen, and all it can do is say what that number means and how far to trust it. So it is turned round: the reading is typed in, and everything under it is inference that says what it rests on.",
    look: "0.62 set on a scale with the range it has to be inside marked on it — noise below, reads low above — and 31 ng/µL worked out from it, each line of the working saying whether it is exact or an estimate.",
  },
];

/** What the page says, in its own voice. */
export const PASSAGES: { id: string; heading: string; paragraphs: string[] }[] = [
  {
    id: "what-these-are",
    heading: "What these are",
    paragraphs: [
      "The desktop app has a tab called Tools, and behind it the bench: the tools that do biology on the tubes the lab holds. They are not a sequence editor bolted on beside an inventory. A PCR here takes its template and its primers off the shelf as tubes with amounts and positions, and recording the run takes what it used from each of them and puts the product back as a new tube.",
      "Each tool is drawn beside the room it is used in, and pressing a machine in the room opens the tool for it. That is why the three-dimensional lab is in every picture on this page: one camera travels from one machine to the next as the tool changes, and the tool is the panel on the right.",
    ],
  },
  {
    id: "the-working",
    heading: "Each figure opens to its working",
    paragraphs: [
      "Alongside every figure a tool produces there is a companion that shows the arithmetic behind it. A length, a migration distance, a count, a concentration: each can be opened to the steps that produced it, and each step says whether it is exact or an estimate.",
      "That is a deliberate shape rather than a feature. A figure somebody is asked to trust should be one they can check, and a tool that cannot show its working is asking to be believed.",
    ],
  },
];

/** What is honest to say about the pictures themselves. */
export const ABOUT_THE_PICTURES = [
  "These are photographs of the real app, driven by a script rather than posed. The lab in them is a made-up one built for the purpose, whose materials are checked against what they are for: the PCR that should give one product gives one, the digest that should cut twice cuts twice.",
  "The app is not released. There is no download, and these versions are what was on the bench the day the pictures were taken.",
];
