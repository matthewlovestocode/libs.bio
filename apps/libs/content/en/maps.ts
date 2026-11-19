/**
 * The Understand view of the plasmid maps and features topic, in English.
 *
 * Three versions, as every topic has: one that assumes nothing, one that assumes school biology, and
 * one for somebody who already uses Biopython.
 */
import type { Lesson, Level } from "../../src/lib/lesson.ts";

const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to biology",
    hint: "Starts from what a plasmid is. No jargon assumed.",
    sections: [
      {
        heading: "A small loop of DNA",
        paragraphs: [
          "A plasmid is a small loop of DNA that lives inside a bacterium, separate from the bacterium's own much larger DNA. Bacteria copy their plasmids and pass them on when they divide, and sometimes hand them to each other.",
          "Because a plasmid is small, a few thousand letters, and because bacteria copy it for free, it is the standard way to carry a piece of DNA you are working on. You put your DNA into a plasmid, put the plasmid into bacteria, and let them make as much of it as you need.",
        ],
        figure: "plasmid",
      },
      {
        heading: "A map says what is where",
        paragraphs: [
          "Written out, a plasmid is thousands of the letters A, C, G and T with no spaces. Nobody can read that. A plasmid map is the same thing drawn as a picture: a circle for the loop, with the parts that matter marked on it and named.",
          "It is a map in the ordinary sense. A street map does not show every brick. It shows the things you need to find, and how far apart they are.",
        ],
      },
      {
        heading: "The marked parts are called features",
        paragraphs: [
          "Each thing marked on a map is a feature: a stretch of the DNA that does a job, with a name, a start and an end. Three kinds turn up on nearly every plasmid.",
          "An origin of replication is where the bacterium starts copying the plasmid. Without one the plasmid is not copied and is lost. A resistance gene lets a bacterium that carries the plasmid survive an antibiotic, which is how you get rid of the bacteria that did not take it up. And then there is your own DNA, the reason the plasmid exists: usually a gene, with a promoter in front of it that switches it on.",
        ],
        figure: "feature",
      },
      {
        heading: "Arrows show direction",
        paragraphs: [
          "Most features on a map are drawn as arrows. DNA is read in one direction, like a line of text, and a gene only makes sense read the right way. The arrow shows which way that is.",
          "DNA has two strands, read in opposite directions, and a gene can be on either. So on one map you will see arrows pointing clockwise and others pointing anticlockwise. Neither is wrong. They are on different strands.",
        ],
      },
      {
        heading: "Numbers round the edge",
        paragraphs: [
          "The numbers round a map count letters, starting from 1 at the top and going clockwise. They let you say exactly where something is: this gene runs from letter 420 to letter 1,240.",
          "Where the count starts is a choice somebody made. A circle has no beginning. Sometimes a feature lies across the starting point, and then its position is written in two pieces. In the sample here, one feature runs from 2,981 to 3,000 and carries on from 1 to 40.",
        ],
      },
      {
        heading: "Where it can be cut",
        paragraphs: [
          "Maps usually also mark a few places where the plasmid can be cut with a restriction enzyme. The useful ones are enzymes that cut the plasmid in exactly one place, because one cut opens the loop into a line without breaking it into pieces. That is where you would put new DNA in.",
        ],
        figure: "cut",
      },
    ],
    analogy: {
      picture: "A plasmid map is like the map of a circular bus route. The stops are the features, the distances between them are to scale, and the arrows tell you which way the bus runs on each stretch.",
      breaksDown: "A bus route's stops are separate. Features on a plasmid can overlap, sit inside one another, or lie on opposite strands of the same stretch, which is why a map sometimes draws them in more than one ring.",
    },
    remember: [
      "A plasmid is a small loop of DNA that bacteria copy.",
      "A map is the plasmid drawn as a circle with its features named.",
      "An arrow shows which way a feature is read.",
      "The numbers count letters from an agreed starting point.",
    ],
  },
  {
    id: "some",
    label: "I know some biology",
    hint: "Assumes genes, promoters and base pairs. Covers how to read and check a map.",
    sections: [
      {
        heading: "What a map is for",
        paragraphs: [
          "A plasmid map is an annotated sequence drawn to scale. You use it to plan: which enzymes to cut with, which way an insert has to go in, where primers should bind, and what a diagnostic digest should look like afterwards.",
          "The drawing carries no information that is not in the annotated file. It is a way of seeing several things at once: order, orientation, spacing and overlap.",
        ],
        figure: "plasmid",
      },
      {
        heading: "What you expect to find",
        paragraphs: [
          "A working plasmid needs an origin of replication, which also sets how many copies a cell keeps, and a selectable marker, usually an antibiotic resistance gene. A cloning vector adds a multiple cloning site: a short stretch packed with restriction sites that occur nowhere else in the plasmid. An expression vector adds a promoter, a ribosome binding site and a terminator around the place the insert goes.",
          "If a map is missing an origin or a marker, the usual reason is that nobody annotated it, not that it is absent.",
        ],
        figure: "feature",
      },
      {
        heading: "Strand and orientation",
        paragraphs: [
          "A feature's arrow points 5′ to 3′ along the strand it is read from. A feature on the top strand points clockwise and one on the bottom strand points anticlockwise. Its coordinates are always given on the top strand, whichever strand it is on.",
          "Orientation matters most between features. A coding sequence has to point the same way as the promoter driving it. Two genes pointing towards each other can interfere. When you clone with one enzyme, the insert can go in either way round, and the map of each outcome is different.",
        ],
        figure: "five-three",
      },
      {
        heading: "Coordinates and the origin",
        paragraphs: [
          "Base 1 of a circular sequence is a convention. Many plasmids put it at a landmark such as the first base of a unique restriction site. Files of the same plasmid from two sources can start in different places and be reverse complements of each other, and still be the same molecule.",
          "A feature that spans base 1 is recorded as a join of two ranges. A drawing has to stitch them back together so the feature appears as one arc with one arrowhead. The sample plasmid includes one so you can see it.",
        ],
        figure: "coordinates",
      },
      {
        heading: "Single cutters",
        paragraphs: [
          "An enzyme that cuts a plasmid once linearises it. Two different single cutters remove the stretch between them and leave two different ends, which is what lets an insert go in one way only. This is why maps mark unique sites and leave out enzymes that cut many times.",
          "Whether a site is unique depends on the whole plasmid, including the insert. Adding an insert can add a second site for an enzyme that used to cut once. Redraw the map after every change.",
        ],
        figure: "cut",
      },
      {
        heading: "Where annotations come from",
        paragraphs: [
          "Features are claims somebody made about a sequence. They are stored beside the sequence in formats that have room for them, such as GenBank, EMBL and SnapGene. FASTA holds only the letters, so a plasmid saved as FASTA has lost its map.",
          "Annotations are often incomplete or wrong, and they are frequently produced by software matching a sequence against a library of known parts. This tool draws exactly what the file says and adds nothing. For anything that matters, check the features against the sequence itself.",
        ],
      },
    ],
    remember: [
      "A map is the annotated file, drawn. It can be no better than the annotations.",
      "Arrows point 5′ to 3′; clockwise is the top strand.",
      "Base 1 is a convention, and a feature can cross it.",
      "Unique sites are unique to this exact sequence. Check again after every change.",
    ],
  },
  {
    id: "biopython",
    label: "I use Biopython",
    hint: "Maps the tool onto SeqRecord and SeqFeature, and says what seqmap does and does not do.",
    sections: [
      {
        heading: "The data is a SeqRecord",
        paragraphs: [
          "`@biolibs/seqio`'s `parse` yields records shaped like Biopython's `SeqRecord`: `seq`, `id`, `name`, `description`, `annotations` and `features`. Each feature is a `SeqFeature` from `@biolibs/seqfeature`, with `type`, `location` and `qualifiers`.",
          "Topology is `record.annotations.topology`, as in Biopython. The tool takes a feature's name from its `label`, `gene`, `product` or `note` qualifier, in that order, and falls back to its type.",
        ],
        figure: "feature",
      },
      {
        heading: "Locations",
        paragraphs: [
          "Locations are 0-based and half-open, as in Biopython: a GenBank `420..1240` is `start` 419 and `end` 1240. `strand` is 1, -1 or `null`. A joined location is a `CompoundLocation` whose `parts` are in the order the file gives them.",
          "A feature across the origin of a circular record arrives as a compound location with two parts, for example `join(2981..3000,1..40)`. The tool recognises the wrap by the first part starting after the last, and treats the two as one span running past the end.",
        ],
        figure: "coordinates",
      },
      {
        heading: "What seqmap is",
        paragraphs: [
          "`@biolibs/seqmap` has no Biopython counterpart. Biopython's `Bio.Graphics.GenomeDiagram` draws through ReportLab. `seqmap` draws nothing. It is the arithmetic of a map, and whatever renders it, SVG here, is yours.",
          "`angleAt` turns a position into an angle clockwise from the top. `ringPath` and `blockPath` give the outline of an arc or a bar, with an optional arrowhead at either end. `packLanes` assigns overlapping spans to lanes. `tickStep` and `tickPositions` give a scale with round numbers. `spreadAround` and `spreadApart` push labels apart until none overlaps.",
        ],
      },
      {
        heading: "What the tool does not do",
        paragraphs: [
          "It does not annotate. `@biolibs/features` ships the matching code without a feature library, for licensing reasons, so a bare sequence stays bare. It does not edit features or write files. It marks only the common enzymes that cut once, found with `enzymes[name].search(seq, linear)` from `@biolibs/restriction`.",
          "The map has room for 22 names. Past that it names the largest features and leaves the rest to the table. A whole bacterial genome will parse, but this is a plasmid tool and is not a genome browser.",
        ],
      },
    ],
  },
];

/** The lesson, whole. */
export const lesson: Lesson = {
  question: "What does a plasmid map show, and how do you read one?",
  levels,
  termSlugs: ["plasmid", "feature", "coordinates", "strand-direction", "promoter", "gene", "restriction-enzyme", "vector-and-insert", "selection"],
  tryIt: "Try it: open the sample plasmid and pick out its features →",
};
