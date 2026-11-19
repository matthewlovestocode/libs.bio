/**
 * The Understand view of the cloning and assembly topic, in English.
 *
 * Three versions, as every topic has: one that assumes nothing, one that assumes school biology, and
 * one for somebody who already uses Biopython.
 */
import type { Lesson, Level } from "../../src/lib/lesson.ts";

const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to biology",
    hint: "Starts from what cloning means. No jargon assumed.",
    sections: [
      {
        heading: "Putting a piece of DNA somewhere it can live",
        paragraphs: [
          "Cloning, here, has nothing to do with cloning a sheep. It means taking a piece of DNA you care about and putting it inside a small loop of DNA called a plasmid, which bacteria will carry and copy for you.",
          "On its own, a loose piece of DNA in a tube is going nowhere. Put it in a plasmid, put the plasmid in bacteria, and by morning you have a flask of them, every one holding your piece.",
        ],
        figure: "plasmid",
      },
      {
        heading: "Cutting leaves ends that match",
        paragraphs: [
          "The older way to do this uses restriction enzymes: proteins that cut DNA wherever a particular short sequence appears. What makes them useful for building is not the cutting but what the cut leaves behind.",
          "Many of them cut the two strands of DNA at slightly different places, so each piece is left with a few unpaired letters hanging off the end. Those loose letters are sticky: they will pair with any end that has the matching letters. Two pieces cut by the same enzyme, from different sources, will find each other and stick.",
        ],
        figure: "cut",
      },
      {
        heading: "Sticking them together for good",
        paragraphs: [
          "Sticking is not joining. The two pieces are held together only by those few paired letters, which come apart easily. An enzyme called a ligase then seals the join, making it as permanent as the rest of the molecule.",
          "That is the whole of it: cut the plasmid open, cut the piece out, let the matching ends find each other, seal them. Open, insert, close.",
        ],
        figure: "pieces",
      },
      {
        heading: "Two different cuts keep it the right way round",
        paragraphs: [
          "If you cut both ends with the same enzyme, both ends of your piece are identical, so it can drop into the gap either way round. Half the time it goes in backwards, which usually means it does not work.",
          "Cut with two different enzymes instead and the two ends are different. Only one way round fits. This tool shows you both outcomes when both can happen, so you can see why cloners nearly always use two enzymes.",
        ],
      },
      {
        heading: "The other way: no enzymes at all",
        paragraphs: [
          "The newer way skips cutting entirely. Instead, you arrange for each piece to end with the same twenty-odd letters that the next piece begins with. Those shared stretches are called overlaps.",
          "Mixed together with the right enzymes, the pieces recognise their own overlaps, line themselves up in order and are sealed into one circle. Nothing has to be cut, so you are not hunting for a site in the right place, and no leftover site is stuck in your construct.",
        ],
        figure: "pieces",
      },
      {
        heading: "Where the overlaps come from",
        paragraphs: [
          "Pieces do not usually arrive with overlaps. You give them overlaps when you copy them, using PCR. A primer is the short piece that tells PCR where to start, and you can add extra letters onto its front end that do not match anything on the template.",
          "Those extra letters still end up in the copy. Choose them to be the start of the neighbouring piece, and the copy comes out with exactly the overlap you need. That is what the design half of this tool works out for you.",
        ],
        figure: "primer",
      },
    ],
    analogy: {
      picture: "Cutting and pasting is like joining two pieces of pipe with threaded ends: the threads have to match, and once screwed together and sealed they are one pipe. Assembling by overlap is more like a jigsaw, where each piece's shape already says which piece comes next.",
      breaksDown: "Pipes and jigsaw pieces come in one orientation. A piece of DNA has no top or bottom, so unless its two ends differ it can go in either way round, and both outcomes really happen in the tube.",
    },
    remember: [
      "Cloning here means putting a piece of DNA into a plasmid that bacteria will copy.",
      "Enzymes cut DNA and leave matching ends; a ligase seals them.",
      "Two different enzymes mean the piece can only go in one way round.",
      "Assembly by overlap needs no enzyme sites: pieces share their ends instead.",
    ],
  },
  {
    id: "some",
    label: "I know some biology",
    hint: "Assumes plasmids, enzymes and PCR. Covers choosing enzymes and why an assembly fails.",
    sections: [
      {
        heading: "What has to be true for a ligation",
        paragraphs: [
          "A circle forms when both junctions pair. The vector's right end must pair with the insert's left, and the insert's right with the vector's left. Two ends pair when they leave overhangs of the same kind, both 5′ or both 3′, whose sequences match.",
          "Matching is about the overhang, not the enzyme. BamHI leaves GATC and so does BglII, so a BamHI end ligates happily to a BglII end and the site that results is neither one. Two 5′ overhangs of different sequence will not join however alike the enzymes look.",
        ],
        figure: "cut",
      },
      {
        heading: "Choosing the enzymes",
        paragraphs: [
          "The vector must be cut once, or you have broken the backbone into pieces. The insert needs an enzyme-made end on both sides. Neither enzyme may cut inside the part you want to keep. The tool marks the enzymes that satisfy the first two conditions for what you have loaded.",
          "Cutting with two different enzymes does two things at once: it fixes the orientation, and it stops the vector closing on itself without an insert, which is otherwise the commonest way a cloning fails.",
        ],
      },
      {
        heading: "Blunt ends",
        paragraphs: [
          "Some enzymes cut both strands at the same place, leaving no overhang. Blunt ends ligate to any other blunt end, which sounds convenient and is mostly a nuisance: there is nothing to hold the pieces in place while the ligase works, orientation is random, and the vector closes on itself easily.",
          "In the tool, blunt ends are shown as pairing with each other, because they do. Whether that ligation would be efficient is another matter and not something a simulation can tell you.",
        ],
        figure: "cut-blunt",
      },
      {
        heading: "Assembly by overlap",
        paragraphs: [
          "Gibson assembly and its relatives join pieces by homology at their ends rather than by cut sites. An exonuclease chews back the 5′ ends, the exposed single strands anneal to their matching partners, a polymerase fills the gaps and a ligase seals. The overlap needs to be long enough to anneal at the reaction temperature: fifteen bases is about the floor, twenty to thirty is usual.",
          "In simulation the whole thing reduces to one question, which is the question the tool answers: which piece's end is identical to which piece's start, and for how many bases. The search tries pieces in both orientations, since a fragment in a tube has no preferred one.",
        ],
      },
      {
        heading: "Designing the overlaps",
        paragraphs: [
          "When the pieces do not overlap, you create the overlaps with primer tails. The forward primer of one piece carries the end of the piece before it; the reverse primer carries the start of the piece after, reverse-complemented. Between two amplified pieces the overlap is shared out, half on each primer, so neither gets unwieldy.",
          "A tailed primer has to be judged in two parts. The whole thing is what you order and what might form a hairpin; only the part that binds the template sets the annealing temperature for the first few cycles, because the tail is not matching anything yet. The tool reports both.",
        ],
        figure: "melting",
      },
      {
        heading: "What a simulation cannot tell you",
        paragraphs: [
          "Everything here is about whether a product can form, not how much of it you would get. Ligation efficiency, the ratio of insert to vector, dephosphorylating the vector so it cannot self-close, how well a particular enzyme works in a particular buffer, methylation blocking a site: none of that is modelled.",
          "What the tool is good for is the part that is easy to get wrong on paper: which enzymes are available to you, which ends will pair, which way round the insert can go, and what the finished molecule would be.",
        ],
      },
    ],
    remember: [
      "Both junctions must pair, and pairing is about the overhang, not the enzyme.",
      "Two different enzymes fix the orientation and stop the vector self-closing.",
      "Overlap assembly needs no sites, only identical ends of fifteen bases or more.",
      "A tailed primer is judged twice: the whole primer, and the binding part alone.",
    ],
  },
  {
    id: "biopython",
    label: "I use Biopython",
    hint: "What Bio.Restriction stops short of, and what this package adds.",
    sections: [
      {
        heading: "Where Biopython stops",
        paragraphs: [
          "`Bio.Restriction` tells you where an enzyme cuts and will hand back the fragments of a digest. It says nothing about what a fragment's ends are, which ends will ligate, or what a ligation would give. There is no ligation in Biopython at all.",
          "`@biolibs/cloning` builds on the restriction port and supplies the rest: `End` and `compatible` for the algebra of ends, `piecesOf` for fragments that carry their own ends and features, `joinPieces` and `closeCircle` for ligation, `cloneProducts` for the whole simulation, and the Gibson functions.",
        ],
      },
      {
        heading: "Coordinates",
        paragraphs: [
          "`Bio.Restriction` reports a cut as the 1-based position of the base after it on the top strand, and the port keeps that faithfully. Everything else in biolibs counts 0-based boundaries, so `cuts.ts` converts in one place and works out the bottom-strand cut as well.",
          "Biopython's `ovhg` is the overhang length, negative for a 5′ overhang, so the bottom strand is cut at `topCut - ovhg`. A piece is stored as its top strand from one cut to the next, with its two ends recorded separately, which is what makes a ligation the simple concatenation of two top strands.",
        ],
        figure: "coordinates",
      },
      {
        heading: "Records in, records out",
        paragraphs: [
          "`piecesOf` and `cloneProducts` take and return `SeqRecord`s. Topology is read from the `topology` annotation, where GenBank and EMBL put it, and a product's annotation is set to `circular`. Features are carried into the product and re-based by `@biolibs/seqedit`, so a gene that was at 420 in the insert is at its new position in the circle.",
          "A product is a molecule, not a plan: `residuesOf(product.record)` gives its sequence, and it can be written out, mapped or digested again like anything else.",
        ],
        figure: "feature",
      },
      {
        heading: "What the functions guarantee",
        paragraphs: [
          "`cloneProducts` only offers insert fragments with an enzyme-made end on both sides, tries the insert both ways round, and returns products with the largest vector fragment first. Every refusal explains itself: unknown enzymes, a linear vector, enzymes that do not cut, no fragment with two usable ends.",
          "`assembleGibson` deduplicates by the molecule rather than the order the fragments were given, so two orders that describe the same plasmid are reported once. At most eight fragments, overlaps from 15 to 60 bases, and an overlap can never be the whole of either fragment.",
        ],
      },
      {
        heading: "Melting temperatures",
        paragraphs: [
          "Nothing thermodynamic is reimplemented here. Junction and primer melting temperatures come from `@biolibs/seqtools`, the port of Biopython's `MeltingTemp`, through `@biolibs/pcr`. `checkTailedPrimer` reports the whole primer and its binding part separately, because judging a tailed primer as one piece is misleading.",
        ],
      },
    ],
  },
];

/** The lesson, whole. */
export const lesson: Lesson = {
  question: "How do you put one piece of DNA inside another?",
  levels,
  termSlugs: ["plasmid", "restriction-enzyme", "sticky-end", "blunt-end", "ligation", "vector-and-insert", "gibson-assembly", "transformation", "selection", "primer"],
  tryIt: "Try it: cut the sample plasmid and the sample insert, and see what circles they make →",
};
