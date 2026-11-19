import type { Metadata } from "next";
import { paragraphs, terms, type TermEntry } from "../../../../../content/en/digests.ts";
import { withBases } from "@/components/Bases.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.digests.title}: ${text.views.understand}` };

/**
 * Link the first mention of each term to its entry further down the page.
 *
 * @param paragraph - One paragraph of plain text.
 * @param seen - The terms already linked, which this adds to.
 * @returns The paragraph as text and links.
 */
function withTerms(paragraph: string, seen: Set<string>): React.ReactNode[] {
  let parts: (string | { entry: TermEntry; phrase: string })[] = [paragraph];
  for (const entry of terms) {
    if (seen.has(entry.slug)) continue;
    for (const phrase of entry.match) {
      const at = parts.findIndex((part) => typeof part === "string" && new RegExp(`\\b${phrase}\\b`, "i").test(part));
      if (at === -1) continue;
      const whole = parts[at] as string;
      const found = new RegExp(`\\b${phrase}\\b`, "i").exec(whole)!;
      parts = [...parts.slice(0, at), whole.slice(0, found.index), { entry, phrase: found[0] }, whole.slice(found.index + found[0].length), ...parts.slice(at + 1)];
      seen.add(entry.slug);
      break;
    }
  }
  return parts.flatMap((part, i) => (typeof part === "string" ? withBases(part, String(i)) : [<a key={i} className="term" href={`#${part.entry.slug}`} title={part.entry.definition}>{part.phrase}</a>]));
}

/** Understand: the idea in plain language, with each term explained underneath. */
export default function Understand() {
  const seen = new Set<string>();
  return (
    <div className="flat prose">
      {paragraphs.map((paragraph) => <p key={paragraph.slice(0, 24)}>{withTerms(paragraph, seen)}</p>)}
      <h2>{text.understand.termsHeading}</h2>
      <dl className="terms">
        {terms.map((entry) => (
          <div key={entry.slug} id={entry.slug}>
            <dt>{entry.term}</dt>
            <dd>{entry.definition} {entry.detail}</dd>
            <dd className="quiet"><b>{text.understand.why}:</b> {entry.why}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
