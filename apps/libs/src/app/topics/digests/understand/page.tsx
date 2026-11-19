import type { Metadata } from "next";
import Link from "next/link";
import { type Level, type TermEntry, levels, question, terms } from "../../../../../content/en/digests.ts";
import { withBases } from "@/components/Bases.tsx";
import { LessonFigure, TermDiagram } from "@/components/diagrams/index.tsx";
import { Levels } from "@/components/Levels.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.digests.title}: ${text.views.understand}` };

/** `code` in a stretch of text, and any sequences mentioned in the rest of it. */
function plain(piece: string, key: string): React.ReactNode[] {
  return piece.split(/(`[^`]+`)/g).flatMap((part, i): React.ReactNode[] => (part.startsWith("`") && part.endsWith("`") && part.length > 1 ? [<code key={`${key}-${i}`}>{part.slice(1, -1)}</code>] : withBases(part, `${key}-${i}`)));
}

/**
 * Link the first mention of each term to its entry further down the page.
 *
 * @param paragraph - One paragraph of plain text.
 * @param seen - The terms already linked in this version of the lesson, which this adds to.
 * @returns The paragraph as text and links.
 */
function withTerms(paragraph: string, seen: Set<string>): React.ReactNode[] {
  let parts: (string | { entry: TermEntry; phrase: string })[] = [paragraph];
  for (const entry of terms) {
    if (seen.has(entry.slug)) continue;
    for (const phrase of entry.match) {
      const find = new RegExp(`\\b${phrase}\\b`, "i");
      const at = parts.findIndex((part) => typeof part === "string" && find.test(part));
      if (at === -1) continue;
      const whole = parts[at] as string;
      const found = find.exec(whole)!;
      parts = [...parts.slice(0, at), whole.slice(0, found.index), { entry, phrase: found[0] }, whole.slice(found.index + found[0].length), ...parts.slice(at + 1)];
      seen.add(entry.slug);
      break;
    }
  }
  return parts.flatMap((part, i): React.ReactNode[] => (typeof part === "string" ? plain(part, String(i)) : [<a key={i} className="term" href={`#${part.entry.slug}`} title={part.entry.definition}>{part.phrase}</a>]));
}

/** One version of the lesson, drawn. */
function Lesson({ level }: { level: Level }) {
  const seen = new Set<string>();
  return (
    <div className="lesson">
      {level.sections.map((section) => (
        <section key={section.heading}>
          <h3>{section.heading}</h3>
          {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 24)}>{withTerms(paragraph, seen)}</p>)}
          {section.figure === undefined ? null : <LessonFigure name={section.figure} />}
        </section>
      ))}
      {level.analogy === undefined ? null : (
        <aside className="analogy">
          <h3>{text.understand.analogy}</h3>
          <p>{plain(level.analogy.picture, "a")}</p>
          <p className="quiet"><b>{text.understand.breaksDown}</b> {plain(level.analogy.breaksDown, "b")}</p>
        </aside>
      )}
      {level.remember === undefined ? null : (
        <aside className="remember">
          <h3>{text.understand.remember}</h3>
          <ul>{level.remember.map((line) => <li key={line}>{line}</li>)}</ul>
        </aside>
      )}
      <p className="next"><Link href="/topics/digests">{text.understand.tryIt}</Link></p>
    </div>
  );
}

/** Understand: the idea, in the reader's choice of three versions, with each term explained below. */
export default function Understand() {
  return (
    <div className="flat prose">
      <h2 className="question">{question}</h2>
      <Levels panels={levels.map((level) => ({ id: level.id, label: level.label, hint: level.hint, content: <Lesson level={level} /> }))} />
      <h2 id="terms">{text.understand.termsHeading}</h2>
      <dl className="terms">
        {terms.map((entry) => (
          <div key={entry.slug} id={entry.slug}>
            <dt>{entry.term}</dt>
            <dd>{entry.definition} {entry.detail}</dd>
            <dd className="quiet"><b>{text.understand.why}:</b> {entry.why}</dd>
            <dd className="term-figure"><TermDiagram slug={entry.slug} /></dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
