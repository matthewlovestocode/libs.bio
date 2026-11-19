/**
 * The shape every topic's lesson has. The words are in `content/<language>/`; this is only the
 * shape, so every topic's Understand view is built the same way.
 */

/** The figures a lesson can place, by name. `src/components/diagrams` draws them. */
export type FigureName = "dna" | "cut" | "cut-blunt" | "pieces" | "plasmid" | "gel" | "primer" | "pcr" | "melting" | "five-three" | "feature" | "coordinates" | "fasta" | "fastq";

/** One part of a lesson: a heading, some paragraphs, and perhaps a picture. */
export interface Section {
  heading: string;
  paragraphs: string[];
  figure?: FigureName;
}

/** One version of a lesson, written for one kind of reader. */
export interface Level {
  /** What the reader picks it by. The same three in every topic, so the choice carries over. */
  id: "new" | "some" | "biopython";
  /** The reader, in their own words. */
  label: string;
  /** What this version does for them. */
  hint: string;
  sections: Section[];
  /** A comparison with something familiar, and the point at which it stops being true. */
  analogy?: { picture: string; breaksDown: string };
  /** The few things worth carrying away. */
  remember?: string[];
}

/** A whole lesson. */
export interface Lesson {
  /** The question it answers. */
  question: string;
  /** The same lesson, once for each kind of reader. The first is shown until one is picked. */
  levels: Level[];
  /** The glossary terms it rests on, shown under it with their diagrams. */
  termSlugs: string[];
  /** What the link back to the tool says. */
  tryIt: string;
}
