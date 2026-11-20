/**
 * Bionet and biosafety: what the software does, what it does not do, and where that leaves a lab.
 *
 * The argument here is narrow on purpose. How to work safely is a subject with real authorities
 * behind it, and `libs.bio` has a topic on it that quotes them; this page is about the software, and
 * the thing it has to get right is the list of what Bionet does *not* do. A tool that records what a
 * lab holds sits close enough to safety that silence would be read as a claim.
 *
 * Nothing here was written from memory. The claims about what an inventory carries come from
 * `InventoryPart` in `@biolibs/bionet`, and `CITES` names the exports they rest on, which
 * `lib/libraries.ts` checks against the installed packages when the site is built.
 */
import type { Cite, Passage } from "./passage.ts";

/** Exports the page's claims rest on. */
export const CITES: Cite[] = [
  { pack: "bionet", name: "publicInventory" },
  { pack: "bionet", name: "partChecksum" },
  { pack: "bionet", name: "heldButNotOffered" },
  { pack: "bionet", name: "peer" },
  { pack: "bionet-panels", name: "listedParts" },
];

/** What Bionet does not do, which is the part of this page that has to be exact. */
export const DOES_NOT: { term: string; text: string }[] = [
  {
    term: "It does not move anything",
    text: "Bionet records what a lab holds and what it did. No material is sent, requested or arranged through it. Two labs that agree to send something do that the way they always would, under whatever rules apply to them, and Bionet is not part of it.",
  },
  {
    term: "It does not vet a lab",
    text: "A lab's name in an inventory is a label it chose, not a verified one, and there is no registry to be struck off. Nothing checks that a lab exists, that it is what it says, or that it is fit to hold anything.",
  },
  {
    term: "It does not screen a sequence",
    text: "Nothing in Bionet looks at what a molecule is or decides whether it should be held. It is a record of what a lab already has, not a route to obtaining anything, and it must not be treated as a clearance of any kind.",
  },
  {
    term: "Pointing at another lab is not vouching for it",
    text: "An inventory may point at other labs, which is the only way one is found without being told its address. That says the address exists and publishes an inventory. It says nothing about what is held there or how it is handled.",
  },
  {
    term: "Nothing is enforced",
    text: "There is no central party, which is the point of the design and also its limit. No rule can be applied to everyone, no listing can be taken down by anybody but the lab publishing it, and no behaviour can be required.",
  },
];

/** A check that was made and did not come out well, printed rather than passed over. */
export const GAPS: { what: string; why: string }[] = [
  {
    what: "The community's service for asking a biosafety professional",
    why: "ask.diybio.org, which this project intended to point at, does not present a valid certificate: it answers with one issued for wordpress.com. It is not linked here, because sending somebody with a safety question to a certificate error is worse than saying nothing. If it returns, or another service is chosen, this page gains a link and this note goes.",
  },
  {
    what: "Whether the community's code is current",
    why: "diybio.org/codes says the programme is closed and points to a preserved record, and that preserved page calls itself active. The two disagree, so the reading above names the code as what both sources support: a document from 2011 that was never formally revised.",
  },
];

export const PASSAGES: Passage[] = [
  {
    id: "why-this-page",
    heading: "Why this page exists",
    paragraphs: [
      "Bionet keeps track of what a lab holds and lets other labs read some of it. That is close enough to the handling of biological material that saying nothing about safety would itself be a claim — the claim that it has been thought about and found not to matter.",
      "So this is the plain version: what the software does, what it does not do, and what is left for the people using it. How to work safely is a separate subject with real authorities behind it, and libs.bio has a topic that quotes them rather than paraphrasing.",
    ],
  },
  {
    id: "what-is-published",
    heading: "What publishing an inventory actually publishes",
    paragraphs: [
      "A lab that publishes an inventory puts out, for each part it lists: the lab's own name and identifier for it, a checksum, how long it is, whether it is a circle, whether it is being offered, and a note if the lab wrote one.",
      "There is no sequence in it. The checksum is a SEGUID, which is the same whichever strand you write the molecule from and, for a circle, wherever you cut it open. That makes it useful for the thing it is for — two labs discovering they hold the same molecule without having agreed on a name — and it does not work backwards. You can match a checksum against a molecule you already have. You cannot get the molecule out of the checksum.",
      "What is published is therefore closer to a catalogue card than to a sequence record. That is a deliberate limit of the format, not a setting.",
    ],
  },
  {
    id: "what-a-lab-chooses",
    heading: "What a lab chooses",
    paragraphs: [
      "Listing something and offering it are two different things, and the format keeps them apart. A part can be listed as held without being on offer, and a lab can leave a part out of its published inventory altogether. What a lab shows the world is worked out from what it has chosen to show, not from everything in its freezer.",
      "Publishing an inventory is a public act. Anyone can fetch it, nobody has to say who they are, and once it has been read it cannot be unread. A lab deciding what to list should decide it on that basis — including the part that is easy to overlook, which is that the notes are published too.",
    ],
  },
  {
    id: "the-expectation",
    heading: "What is expected of a lab using it",
    paragraphs: [
      "That work is done at the lowest level of containment the work actually calls for, and that whatever rules apply to a lab — its institution's, its country's, its own — apply exactly as they would if Bionet did not exist. Nothing here lifts any of that, and the absence of a check in the software is not the absence of a requirement in the world.",
      "The community has its own statement of this, and it is worth reading as the document it is.",
    ],
  },
  {
    id: "where-it-sits",
    heading: "Where the responsibility sits",
    paragraphs: [
      "With the lab, and with whoever oversees it. That is not a disclaimer to get the software off the hook; it is a description of what the software can and cannot know. Bionet can tell you that a document is internally consistent and came from the address you asked for. It cannot tell you that the lab at that address is careful, competent, or real.",
      "Software that recorded what a lab held and implied anything more than that would be doing harm, which is why this page is as long as it is.",
    ],
  },
];

/** Where to read further, each one checked rather than remembered. */
export const READING: { name: string; issuer: string; year: string; what: string; href: string }[] = [
  {
    name: "Working safely",
    issuer: "libs.bio",
    year: "",
    what: "Containment levels quoted from the documents that define them, what not to work with, disposal, and how sending material works. The practice this page deliberately does not restate.",
    href: "https://libs.bio/topics/safety",
  },
  {
    name: "DIYbio Code of Ethics",
    issuer: "DIYbio.org, drafted at two congresses in 2011",
    year: "2011",
    what: "The community's own statement, drawn up in London in May 2011 and in San Francisco in July 2011. It has not been formally revised since, and is linked here as the preserved record on DIYbiosphere.",
    href: "https://sphere.diybio.org/projects/codeofethics/",
  },
];
