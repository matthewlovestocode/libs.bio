/**
 * Where the glossary meets the rest of the site: which topics cover a term, and whether the two
 * sides of that connection agree.
 *
 * The glossary's own words and structure are in `content/en/glossary.ts`. Each entry names the
 * topics that cover it directly, by slug. Nothing is translated on the way: an entry that claims a
 * topic is a claim about this site, and `checkGlossary` fails the build if it is a false one.
 */
import { GLOSSARY, type GlossaryEntry } from "../../content/en/glossary.ts";
import { LESSONS } from "../../content/en/lessons.ts";
import { TOPICS, type Topic } from "@/lib/topics.ts";

/**
 * @param entry - A glossary entry.
 * @returns The topics that cover it, in the order topics are listed.
 */
export function topicsFor(entry: GlossaryEntry): Topic[] {
  const wanted = new Set(entry.topics);
  return TOPICS.filter((topic) => wanted.has(topic.slug));
}

/**
 * @param slug - A topic's slug.
 * @returns Every term that topic covers, in glossary order.
 */
export function termsForTopic(slug: string): GlossaryEntry[] {
  return GLOSSARY.filter((entry) => entry.topics.includes(slug));
}

/**
 * Holds the glossary to the rest of the site. Run when this module is first loaded, which is while
 * the site is being built, so a contradiction stops the build rather than reaching a reader.
 *
 * @returns Every disagreement found, as sentences. Empty when the two sides agree.
 */
export function checkGlossary(): string[] {
  const problems: string[] = [];
  const slugs = new Set(GLOSSARY.map((entry) => entry.slug));
  const topics = new Set(TOPICS.map((topic) => topic.slug));

  for (const entry of GLOSSARY) {
    for (const slug of entry.topics) {
      if (!topics.has(slug)) problems.push(`${entry.slug} claims the topic ${slug}, which does not exist.`);
    }
    for (const slug of entry.related) {
      if (!slugs.has(slug)) problems.push(`${entry.slug} is related to ${slug}, which is not a term.`);
    }
  }

  // A lesson that prints a term is resting on it, so the term has to admit the topic covers it.
  for (const [topic, lesson] of Object.entries(LESSONS)) {
    for (const slug of lesson.termSlugs) {
      const entry = GLOSSARY.find((one) => one.slug === slug);
      if (entry === undefined) {
        problems.push(`The ${topic} lesson rests on ${slug}, which is not a term.`);
      } else if (!entry.topics.includes(topic)) {
        problems.push(`The ${topic} lesson rests on ${slug}, which does not list ${topic} among its topics.`);
      }
    }
  }

  return problems;
}

const problems = checkGlossary();
if (problems.length > 0) throw new Error(`The glossary disagrees with the site:\n  ${problems.join("\n  ")}`);
