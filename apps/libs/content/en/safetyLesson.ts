/**
 * The Understand view of the working safely topic, in English.
 *
 * Three versions, as every topic has. What is quoted here was checked against the issuing body on
 * 2026-11-19; what is not quoted is this site's own and should be read as such.
 */
import type { Lesson, Level } from "../../src/lib/lesson.ts";

const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to this",
    hint: "Starts from why any of this matters. No jargon assumed.",
    sections: [
      {
        heading: "Most of it is ordinary care",
        paragraphs: [
          "Working safely with biology is mostly unglamorous: know what you have, keep it where it belongs, kill it before it leaves, wash your hands. The dramatic parts of the subject are the parts almost nobody does.",
          "The point of the rules is not that living things are uniquely dangerous. It is that they multiply, which is the one thing a spilled chemical does not do.",
        ],
      },
      {
        heading: "The question is the work, not just the organism",
        paragraphs: [
          "People expect a list: this organism is safe, that one is not. Real practice does not work that way. The same bacterium is one proposition on a plate and another in a ten-litre culture, and another again once you have added a gene to it.",
          "So what is assessed is the whole piece of work — the organism, the amount, what you do to it, where, and who else is around. The containment level follows from that assessment. It is not a label the organism carries about with it.",
        ],
      },
      {
        heading: "Four levels, and you are almost certainly at the first",
        paragraphs: [
          "Containment runs from 1 to 4. Level 1 is for well-characterised things not known to make healthy adults ill, and needs no special barriers: a door, a sink, wipeable surfaces, ordinary careful technique.",
          "Nearly all community lab work sits there, and nearly all teaching strains are chosen so that it can. Level 3 and level 4 are purpose-built national facilities. They are listed on the Do page so the scale is clear, not because anybody reading this is going to be in one.",
        ],
      },
      {
        heading: "Waste is where good intentions fail",
        paragraphs: [
          "Everything that touched the organism has to be killed before it goes in a bin: plates, tips, tubes, gloves, the lot. This is the step that gets skipped when somebody is tired, and the one a landlord or an environmental health officer will ask about first.",
          "The defining document asks that cultures and stocks be decontaminated before disposal using an effective method, consistent with institutional, local and state requirements — which is to say the method is a local question with a definite answer, and you need to know yours before you start, not after.",
        ],
      },
      {
        heading: "Sending things is the genuinely regulated part",
        paragraphs: [
          "Most of what this page describes is guidance. Posting biological material is not: how it is classified, packed, labelled and documented is prescribed, and a carrier can refuse a parcel or report it.",
          "It is also the part people improvise, because sending a tube to a friend feels informal. It is not. Read the transport guidance, or ask the carrier, before anything goes in an envelope.",
        ],
      },
      {
        heading: "Ask somebody",
        paragraphs: [
          "The community has had a code of ethics since 2011, drawn up at two meetings, in London in May and San Francisco in July. Both drafts put safety plainly: adopt safe practices. Both say biotechnology is for peaceful purposes only.",
          "Beyond that, the useful move is to find a person. A biosafety officer at a nearby institution, an experienced member of a community lab, or whoever supplied the strain will answer a sensible question, and the question is almost always cheaper than the mistake.",
        ],
      },
    ],
    analogy: {
      picture: "It is closer to a kitchen than to a chemistry set. Cross-contamination, clean surfaces, knowing what is in the fridge and for how long, and not taking anything home — the habits matter more than the equipment.",
      breaksDown: "Food poisoning does not spread from the person who got it. The reason the rules exist at all is that some of this can, which is why the assessment is about consequences and not only about you.",
    },
    remember: [
      "The assessment is of the work, not the organism alone.",
      "Community lab work is nearly always level 1.",
      "Kill the waste before it leaves, by a method you knew in advance.",
      "Sending material is regulated; check before you post.",
    ],
  },
  {
    id: "some",
    label: "I know some biology",
    hint: "Assumes the levels exist. Covers how the authorities actually frame this now.",
    sections: [
      {
        heading: "The framing has moved",
        paragraphs: [
          "If you learned this a while ago, you learned a table: agent on the left, level on the right. The current documents do not present it that way. WHO's fourth edition manual, in 2020, rebuilt its guidance around risk assessment, and its own summary says the approach allows safety measures to be balanced with the actual risk of working with biological agents on a case-by-case basis.",
          "The CDC and NIH document is blunter about its own standing: it says it remains an advisory document recommending best practices, that it is not intended to be a regulatory document although some may use it in that way, and that its core principle is protocol-driven risk assessment.",
        ],
      },
      {
        heading: "What that means in practice",
        paragraphs: [
          "The levels have not gone away — BMBL still defines all four, and the Do page quotes them. What has changed is the direction of reasoning. You do not look an organism up and obtain a level; you assess the protocol and the level follows.",
          "This matters most for the cases a table handles badly: large volumes, aerosol-generating steps, immunocompromised people in the building, and anything you have modified. A table has no column for those.",
        ],
      },
      {
        heading: "Who decides, and who is accountable",
        paragraphs: [
          "BMBL puts the assessment on named people: it says risk assessment requires careful judgment and is an important responsibility for directors and principal investigators, backed by institutional oversight such as Institutional Biosafety Committees or equivalent.",
          "A community lab has no IBC. That is the structural gap, and pretending otherwise helps nobody. The practical substitutes are a written assessment somebody competent has actually read, a relationship with a biosafety professional, and a culture where saying “I am not sure” is normal.",
        ],
      },
      {
        heading: "Modification changes the question",
        paragraphs: [
          "Adding antibiotic resistance, a toxin gene, a virulence factor or an expanded host range changes the assessment regardless of what the parent strain was rated. So does anything that makes an organism survive outside the lab better than it did.",
          "In many jurisdictions this is also where guidance stops and law starts: contained-use notifications, institutional approval, or a list of controlled agents. Which law applies depends entirely on where you are, which is why this site names documents rather than giving rules.",
        ],
      },
      {
        heading: "The honest limits of a page like this",
        paragraphs: [
          "Three things could not be verified when this page was written, and are recorded on the Do page rather than filled in: the shipping classifications, because the IATA page returned a 404; the community's ask-a-professional service, because its certificate is issued for another domain; and whether the DIYbio code is current, because its two homes disagree.",
          "That is not a disclaimer, it is the method. A safety page that is confidently wrong is worse than one with gaps marked.",
        ],
      },
    ],
    remember: [
      "Current guidance reasons from the protocol to the level, not the reverse.",
      "BMBL is advisory by its own statement; what binds you is local law.",
      "The assessment belongs to named, accountable people.",
      "Modification resets the question, whatever the parent strain was.",
    ],
  },
  {
    id: "biopython",
    label: "I write the software",
    hint: "What a tool can and cannot responsibly do here.",
    sections: [
      {
        heading: "There is no package behind this topic",
        paragraphs: [
          "Every other topic on this site has a library doing the work, and a Code view showing the calls. This one has neither, and so it has three tabs rather than four. Writing a Code view that said “there is no code” would be worse than not having the tab.",
          "That is deliberate. The questions on the Do page are not computable from anything a browser holds, and a tool that appeared to answer them would be worse than useless.",
        ],
      },
      {
        heading: "Why there is no screening tool here",
        paragraphs: [
          "The obvious thing to build is a sequence screen: paste DNA, get told whether it matches something controlled. Real screening of that kind is done by providers against curated databases of concern, under frameworks that are themselves policy documents, and it is a deliberately imperfect instrument even in expert hands.",
          "A browser page with no database and no provenance cannot do it, and an approximation would produce false reassurance, which is the specific failure mode worth avoiding. So this site does not pretend to.",
        ],
      },
      {
        heading: "What software can do",
        paragraphs: [
          "It can keep records: what strain, from whom, what was done to it, what was disposed of and how. Most of what an inspector or a biosafety officer wants is a trail, and a trail is exactly what software is good at.",
          "It can also make the right thing easy — a checklist that has to be completed before a protocol is marked done, a required field for the disposal route, an inventory that knows what a lab holds. That is the direction Bionet takes, and the plan for this site records a matching commitment: a lab chooses what it lists, an inventory names parts by checksum, and nothing in Bionet ships material, vets a lab or checks what a sequence is.",
        ],
      },
      {
        heading: "Say what it does not do",
        paragraphs: [
          "The thing worth copying from this page is not its content but its shape: every claim about somebody else's rules is attributed and dated, and the three checks that failed are printed next to the ones that passed.",
          "If you build anything in this area, the most useful line you can write is the one about what your tool does not know.",
        ],
      },
    ],
  },
];

/** The lesson, whole. */
export const lesson: Lesson = {
  question: "How do you decide whether what you are about to do is safe?",
  levels,
  termSlugs: ["plasmid", "transformation", "selection", "restriction-enzyme", "genome"],
  tryIt: "Read the questions, and where each answer actually lives →",
};
