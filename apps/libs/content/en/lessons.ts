/**
 * Every topic's lesson, by the topic's slug.
 *
 * Two relations connect the glossary to the topics, and they are not the same one. A lesson's
 * `termSlugs` is a display list: the handful of terms it expands under itself, in full, with their
 * diagrams. A glossary entry's `topics` is an index: every topic that covers the term, which is
 * usually more than any one lesson chooses to print. Each is written where it belongs, and this
 * registry is what lets `checkGlossary` hold them to each other, so a lesson cannot rest on a term
 * that denies covering it.
 */
import { lesson as alignment } from "./alignment.ts";
import { lesson as cloning } from "./cloning.ts";
import { lesson as digests } from "./digests.ts";
import { lesson as files } from "./files.ts";
import { lesson as lookup } from "./lookup.ts";
import { lesson as maps } from "./maps.ts";
import { lesson as motifs } from "./motifs.ts";
import { lesson as pcr } from "./pcr.ts";
import { lesson as safety } from "./safetyLesson.ts";
import { lesson as sequences } from "./sequences.ts";
import { lesson as structure } from "./structure.ts";
import { lesson as trees } from "./trees.ts";
import type { Lesson } from "@/lib/lesson.ts";

/** Keyed by topic slug, so a topic and its lesson cannot be mismatched. */
export const LESSONS: Readonly<Record<string, Lesson>> = {
  digests,
  pcr,
  maps,
  cloning,
  files,
  sequences,
  alignment,
  trees,
  structure,
  motifs,
  lookup,
  safety,
};
