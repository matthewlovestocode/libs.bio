/**
 * The working safely topic's content, in English.
 *
 * Everything here that describes somebody else's rules was checked against the issuing body on
 * 2026-11-19 rather than written from memory, as the plan requires. Where a check failed, the page
 * says what it could not confirm instead of filling the gap in. The quotations are the documents'
 * own words, kept short and attributed.
 */

/** A document somebody else issues, which is where the actual rule lives. */
export interface Authority {
  name: string;
  issuer: string;
  /** What it is, and what it is for. */
  what: string;
  year: string;
  /** Whether it can be read without paying, as checked on the date below. */
  free: boolean;
  href: string;
}

/** The day every link and quotation here was checked against its source. */
export const CHECKED = "2026-11-19";

/** The documents this topic points at, each checked on the date above. */
export const AUTHORITIES: readonly Authority[] = [
  {
    name: "Laboratory biosafety manual, 4th edition",
    issuer: "World Health Organization",
    what: "The manual most of the world's guidance is derived from. The fourth edition moved the emphasis from fixed containment levels to assessing the risk of the particular work in front of you.",
    year: "2020",
    free: true,
    href: "https://www.who.int/publications/i/item/9789240011311",
  },
  {
    name: "Biosafety in Microbiological and Biomedical Laboratories, 6th edition",
    issuer: "US Centers for Disease Control and Prevention, with the National Institutes of Health",
    what: "Where the biosafety levels are actually defined, along with the practices, equipment and facilities each one asks for. It says of itself that it is advisory and not a regulation.",
    year: "revised June 2020",
    free: true,
    href: "https://www.cdc.gov/labs/BMBL.html",
  },
  {
    name: "Guidance on regulations for the transport of infectious substances 2021–2022",
    issuer: "World Health Organization",
    what: "How biological material is classified, packed, marked, labelled and documented when it is sent anywhere. Sending material is the part of this topic that is genuinely regulated rather than advised.",
    year: "2021",
    free: true,
    href: "https://www.who.int/publications/i/item/9789240019720",
  },
  {
    name: "DIYbio Code of Ethics",
    issuer: "DIYbio.org, drafted at two congresses in 2011",
    what: "The community's own statement, drawn up in London in May 2011 and in San Francisco in July 2011. It has not been formally revised since.",
    year: "2011",
    free: true,
    href: "https://sphere.diybio.org/projects/codeofethics/",
  },
];

/** One of the four containment levels, in the words of the document that defines them. */
export interface Level {
  name: string;
  short: string;
  /** What kind of work it is for, quoted from BMBL 6th edition. */
  quote: string;
  /** What it means in practice, in this site's own words. */
  inPractice: string;
  /** Whether a community lab would plausibly be working here. */
  community: "usual" | "sometimes" | "no";
}

/**
 * The four levels, each quoted from BMBL 6th edition pages 28 to 30.
 *
 * The quotations are short and exact. Everything outside them is this site's own summary and should
 * be read as such.
 */
export const LEVELS: readonly Level[] = [
  {
    name: "Biosafety Level 1", short: "BSL-1",
    quote: "generally appropriate for undergraduate and secondary educational training and teaching laboratories and for other laboratories that work with defined and characterized strains of viable biological agents not known to consistently cause disease in healthy adult humans",
    inPractice: "A door, a sink to wash your hands in, work surfaces that can be wiped down, and standard microbiological practice. No special barriers. This is where nearly all community lab work sits, and where the strains most teaching kits use belong.",
    community: "usual",
  },
  {
    name: "Biosafety Level 2", short: "BSL-2",
    quote: "applicable to laboratories in which work is performed using a broad-spectrum of biological agents and toxins that are associated with causing disease in humans of varying severity",
    inPractice: "Agents that can make people ill, handled on an open bench only where splashes and aerosols are unlikely, with a cabinet where they are not. Some community labs are set up for this; being set up for it is a decision taken in advance with somebody qualified, not on the day.",
    community: "sometimes",
  },
  {
    name: "Biosafety Level 3", short: "BSL-3",
    quote: "applicable to laboratories in which work is performed using indigenous or exotic biological agents with a potential for respiratory transmission and those that may cause serious and potentially lethal infection",
    inPractice: "Purpose-built facilities, controlled airflow, respiratory protection, trained staff and institutional oversight. Not something a community lab does.",
    community: "no",
  },
  {
    name: "Biosafety Level 4", short: "BSL-4",
    quote: "applicable primarily for laboratories working with dangerous and exotic biological agents that pose a high individual risk of life-threatening disease that may be transmitted via the aerosol route and for which there is no available vaccine or therapy",
    inPractice: "A handful of facilities worldwide, each a national undertaking. Named here only so the scale of the thing is clear.",
    community: "no",
  },
];

/** One of the questions worth answering before starting, and where its answer actually comes from. */
export interface Question {
  ask: string;
  why: string;
  /** Where the real answer is, rather than here. */
  where: string;
}

/** The questions this page can usefully put, none of which it can answer for anybody. */
export const QUESTIONS: readonly Question[] = [
  {
    ask: "What exactly is the organism, and what is known about it?",
    why: "A named, characterised strain from a reputable collection is a different proposition from something scraped off a pond or sent by a stranger. Most of what makes work safe is knowing what you have.",
    where: "The strain's own datasheet from whoever supplied it, and your country's list of regulated agents.",
  },
  {
    ask: "Could what you are doing make it more dangerous?",
    why: "Containment is assessed on the work, not only on the organism. Growing a litre of something is not the same as a plate of it, and adding a resistance gene or a toxin changes the assessment entirely.",
    where: "A biosafety professional, before you start. This is the question people most often skip.",
  },
  {
    ask: "Will it make an aerosol?",
    why: "Vortexing, pipetting, centrifuging, sonicating and flaming all throw material into the air, and breathing it in is the exposure route that most often matters.",
    where: "The BMBL's practices for the level you are working at, which say which steps need a cabinet.",
  },
  {
    ask: "How will the waste be killed, and by whom?",
    why: "Everything that touched the organism has to be decontaminated before it leaves, and somebody has to be responsible for it actually happening.",
    where: "Your local rules. BMBL asks that cultures and stocks be decontaminated before disposal “using an effective method, consistent with applicable institutional, local, and state requirements”.",
  },
  {
    ask: "Is any of it leaving the building?",
    why: "Sending biological material is regulated, not merely advised. Classification, packing, labelling and paperwork are all prescribed, and the carrier can refuse or report a parcel that is wrong.",
    where: "The WHO transport guidance above, and your carrier's dangerous goods rules. Get this one checked rather than guessed.",
  },
  {
    ask: "Who else is affected if it goes wrong?",
    why: "A shared building, a landlord, the people you live with, and the community lab's standing with its neighbours are all part of the risk, and none of them is in a datasheet.",
    where: "Your own judgement, and the people the answer concerns.",
  },
];

/** Something this page tried to check and could not, recorded rather than quietly filled in. */
export interface Gap {
  what: string;
  why: string;
}

/** What could not be verified on the date above, said plainly. */
export const GAPS: readonly Gap[] = [
  {
    what: "The shipping classifications",
    why: "The IATA page on infectious substances returned a 404 when it was checked, and the WHO guidance's own text is in a PDF on a different host that was not read. So this page names the document and does not state the categories, UN numbers or packing instructions. Anyone sending material should read the guidance itself or ask their carrier.",
  },
  {
    what: "The community's “ask a biosafety expert” service",
    why: "ask.diybio.org, which the plan for this site intended to point at, does not present a valid certificate: it answers with one issued for wordpress.com. It is not linked here until that is sorted out, because sending people to a certificate error is worse than saying nothing.",
  },
  {
    what: "Whether the DIYbio code is current",
    why: "diybio.org/codes says the programme is now closed and points to a preserved record; the preserved page calls itself active. The two disagree, so the code is presented here as a document from 2011 that was never formally revised, which is what both sources support.",
  },
];
