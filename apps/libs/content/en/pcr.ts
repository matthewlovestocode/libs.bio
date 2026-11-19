/**
 * The Understand view of the PCR and primers topic, in English.
 *
 * Three versions, as every topic has: one that assumes nothing, one that assumes school biology, and
 * one for somebody who already uses Biopython. Glossary terms are linked to their entries the first
 * time each appears.
 */
import type { Lesson, Level } from "../../src/lib/lesson.ts";

const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to biology",
    hint: "Starts from what copying DNA means. No jargon assumed.",
    sections: [
      {
        heading: "Copying one stretch, millions of times",
        paragraphs: [
          "PCR is a way of making an enormous number of copies of one chosen stretch of DNA. The letters stand for polymerase chain reaction, but what matters is what it does: you start with a trace of DNA, far too little to see or use, and an hour or two later you have enough of the one stretch you care about to work with.",
          "The DNA you start from is called the template. PCR does not copy all of it. It copies only what lies between two points that you choose.",
        ],
      },
      {
        heading: "DNA comes apart when you heat it",
        paragraphs: [
          "DNA is two chains of letters lying side by side, A opposite T and G opposite C. The two chains are held together quite weakly. Heat DNA to just under boiling and they separate. Cool it again and chains with matching letters find each other and pair back up.",
          "PCR is built on that. Everything else is a matter of heating and cooling at the right moments.",
        ],
        figure: "melting",
      },
      {
        heading: "A primer says where to start",
        paragraphs: [
          "Cells copy DNA with a protein called a polymerase. It has one limitation that PCR turns into a tool: it cannot start on a bare chain. It can only add letters onto the end of a short piece that is already stuck in place.",
          "That short piece is a primer: a strand of about twenty letters that you order from a company, with whatever letters you ask for. It sticks to the template wherever the template's letters match it, and nowhere else. The polymerase starts there.",
          "You use two primers, one for each end of the stretch you want, on opposite chains and pointing towards each other. Between them they mark out the stretch that gets copied.",
        ],
        figure: "five-three",
      },
      {
        heading: "Three temperatures, round and round",
        paragraphs: [
          "First it is heated, so the two chains come apart. Then it is cooled, so the primers can stick. Then it is warmed a little, to the temperature the polymerase works best at, and the polymerase copies from each primer.",
          "That is one round, and it turns each copy into two. The machine then does it again, and again. Thirty rounds of doubling turn one copy into about a billion.",
        ],
        figure: "pcr",
      },
      {
        heading: "What makes a good primer",
        paragraphs: [
          "A primer has to stick in one place only. If its letters match the template in two places, you get two different products and cannot easily tell which is which.",
          "The two primers should also let go at about the same temperature. The temperature at which a primer comes unstuck is its melting temperature. It depends on how long the primer is and on its letters: a G opposite a C holds more tightly than an A opposite a T, so more G and C means a higher melting temperature.",
          "And a primer should not stick to itself, or to the other primer, instead of to the template. The tool on the Do tab checks all of this, and can pick a pair for you.",
        ],
      },
      {
        heading: "Checking that it worked",
        paragraphs: [
          "You check a PCR the way you check most things done to DNA, on a gel. You know how long the stretch between your primers is, so you know where its band should be. One band, in the right place, is a good sign. No band, or several, means something to fix.",
        ],
        figure: "gel",
      },
    ],
    analogy: {
      picture: "Think of a very long book, and a photocopier that will only copy the pages between two bookmarks. The primers are the bookmarks. Each time round it copies the copies as well, so the pile doubles.",
      breaksDown: "You can put a bookmark anywhere. A primer only works where its letters match the template, and if they match in two places you get two different piles.",
    },
    remember: [
      "PCR copies only the stretch between two primers.",
      "Heat separates the chains, cooling lets the primers stick, and the polymerase copies from them.",
      "Each round doubles the copies: thirty rounds is about a billion.",
      "Good primers stick in one place, and both let go at about the same temperature.",
    ],
  },
  {
    id: "some",
    label: "I know some biology",
    hint: "The method, and what the tool does and does not model.",
    sections: [
      {
        heading: "The reaction",
        paragraphs: [
          "PCR makes millions of copies of one chosen stretch of DNA. You pick the stretch with two primers, short pieces of DNA that bind on either side of it, one on each strand, with their 3′ ends pointing towards each other. A polymerase extends each primer, and what lies between their 5′ ends becomes the product.",
          "A thermocycler repeats three steps: denature near 95 °C, anneal a few degrees under the primers' melting temperature, and extend at about 72 °C. Each cycle doubles the product.",
        ],
        figure: "pcr",
      },
      {
        heading: "Primer design is mostly arithmetic",
        paragraphs: [
          "A primer only works if it binds at the right temperature and in one place, so designing one is mostly arithmetic on sequences. The usual advice is 18 to 30 bases, 40 to 60% GC content, a melting temperature of 55 to 65 °C, no long run of one base, and a G or C at the 3′ end.",
          "The two primers of a pair should have melting temperatures within a few degrees of each other, since both must anneal at the same temperature. A primer that can pair with itself, especially at its 3′ end, forms hairpins and primer dimers instead of binding the template.",
        ],
        figure: "melting",
      },
      {
        heading: "What the tool models",
        paragraphs: [
          "The tool finds every place each primer binds, on either strand, and reports every product a pair facing each other would make. It requires the last five bases at the 3′ end to match exactly, and lets you allow mismatches elsewhere.",
          "It does not model how well a reaction would go: yield, extension time, secondary structure in the template and non-specific products from partial matches are all outside it. It tells you what should be there, not how much.",
        ],
      },
    ],
  },
  {
    id: "biopython",
    label: "I know Biopython",
    hint: "What exists upstream, what does not, and how positions are counted.",
    sections: [
      {
        heading: "No counterpart upstream",
        paragraphs: [
          "`@biolibs/pcr` has no Python counterpart. Biopython has no PCR module of its own, so there is nothing to be at parity with. It is tested against invariants, round trips and worked figures.",
          "What it does lean on is ported. Melting temperatures come from the port of `Bio.SeqUtils.MeltingTemp` in `@biolibs/seqtools`: nearest-neighbour thermodynamics with a salt correction numbered as Biopython numbers them. The default is method 5, Owczarzy 2004, at 50 mM sodium and 250 nM primer.",
        ],
      },
      {
        heading: "What the functions are",
        paragraphs: [
          "`checkPrimer` measures one primer and lists advisory warnings against `PRIMER_LIMITS`. `findBindingSites` finds where a primer binds on either strand of a linear or circular template. `predictProducts` takes each primer as both forward and reverse and tries every pair, including a primer with itself. `designPrimers` picks a pair for a stretch.",
          "`designPrimers` is not a search in the way Primer3 is. It anchors the forward primer at the start of the stretch and the reverse primer at the end, and chooses each one's length to come nearest the target melting temperature.",
        ],
      },
      {
        heading: "Coordinates and limits",
        paragraphs: [
          "Positions are 0-based with the end left out, as a slice is. On a circular template a product's `end` may exceed the length, meaning it runs across the origin, and `wraps` says so. The tool shows positions counted from 1, as a person would.",
          "By default a primer must match exactly, and the five bases at its 3′ end must match whatever tolerance is set elsewhere. Products longer than 20,000 bp are not reported, and at most 50 products are.",
        ],
      },
    ],
  },
];

/** The lesson, whole. */
export const lesson: Lesson = {
  question: "How do you copy one stretch of DNA, and only that stretch?",
  levels,
  termSlugs: ["pcr", "primer", "melting-temperature", "gc-content", "strand-direction", "gel-electrophoresis"],
  tryIt: "Try it: design primers for the sample plasmid and see the product →",
};
