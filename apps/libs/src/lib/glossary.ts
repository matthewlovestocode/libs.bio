/**
 * Where the glossary meets the rest of the site: which topic a lesson belongs to, and which
 * packages have a page in the API reference.
 *
 * The glossary's own words and structure are in `content/en/glossary.ts`, carried over from
 * biolibs-site. Its entries name the lessons of that site, which this one has as topics.
 */
import { TOPICS, type Topic } from "@/lib/topics.ts";

/** biolibs-site's lesson slugs, and the topics here that cover the same ground. */
const TOPICS_FOR_LESSON: Record<string, string[]> = {
  sequences: ["sequences"],
  annotations: ["maps"],
  files: ["files"],
  alignment: ["alignment", "motifs"],
  phylogenetics: ["trees"],
  structures: ["structure"],
  cloning: ["digests", "pcr", "cloning"],
  verification: [],
};

/**
 * @param lessons - Lesson slugs from a glossary entry.
 * @returns The topics that cover them, each once, in the order topics are listed.
 */
export function topicsFor(lessons: readonly string[]): Topic[] {
  const wanted = new Set(lessons.flatMap((lesson) => TOPICS_FOR_LESSON[lesson] ?? []));
  return TOPICS.filter((topic) => wanted.has(topic.slug));
}
