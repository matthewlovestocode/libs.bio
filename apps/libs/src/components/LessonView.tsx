import Link from "next/link";
import { getEntry, splitByTerms } from "../../content/en/glossary.ts";
import { withBases } from "@/components/Bases.tsx";
import { LessonFigure, TermDiagram } from "@/components/diagrams/index.tsx";
import { Levels } from "@/components/Levels.tsx";
import type { Lesson, Level } from "@/lib/lesson.ts";
import { messages } from "@/messages/index.ts";

/** `code` in a stretch of text, and any sequences mentioned in the rest of it. */
function plain(piece: string, key: string): React.ReactNode[] {
  return piece.split(/(`[^`]+`)/g).flatMap((part, i): React.ReactNode[] => (part.startsWith("`") && part.endsWith("`") && part.length > 1 ? [<code key={`${key}-${i}`}>{part.slice(1, -1)}</code>] : withBases(part, `${key}-${i}`)));
}

/**
 * Link the first mention of each glossary term to its page.
 *
 * @param paragraph - One paragraph of plain text.
 * @param seen - The terms already linked in this version of the lesson, which this adds to.
 * @returns The paragraph as text and links.
 */
function withTerms(paragraph: string, seen: Set<string>): React.ReactNode[] {
  return splitByTerms(paragraph, seen).flatMap((part, i): React.ReactNode[] =>
    part.slug === undefined ? plain(part.text, String(i)) : [<Link key={i} className="term" href={`/glossary/${part.slug}`} title={getEntry(part.slug)?.definition}>{part.text}</Link>]);
}

/** One version of the lesson, drawn. */
function Version({ level, toolHref, tryIt }: { level: Level; toolHref: string; tryIt: string }) {
  const text = messages();
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
      <p className="next"><Link href={toolHref}>{tryIt}</Link></p>
    </div>
  );
}

/**
 * A topic's Understand view: the idea, in the reader's choice of three versions, with each term it
 * rests on explained below. Every topic's lesson is drawn by this, so they all work the same way.
 *
 * @param props.lesson - The lesson.
 * @param props.toolHref - The address of the topic's Do view, for the link back to it.
 */
export function LessonView({ lesson, toolHref }: { lesson: Lesson; toolHref: string }) {
  const text = messages();
  return (
    <div className="flat prose">
      <h2 className="question">{lesson.question}</h2>
      <Levels panels={lesson.levels.map((level) => ({ id: level.id, label: level.label, hint: level.hint, content: <Version level={level} toolHref={toolHref} tryIt={lesson.tryIt} /> }))} />
      <h2 id="terms">{text.understand.termsHeading}</h2>
      <dl className="terms">
        {lesson.termSlugs.map(getEntry).filter((entry) => entry !== undefined).map((entry) => (
          <div key={entry.slug} id={entry.slug}>
            <dt><Link href={`/glossary/${entry.slug}`}>{entry.term}</Link></dt>
            <dd>{entry.definition} {entry.detail}</dd>
            <dd className="quiet"><b>{text.understand.why}:</b> {entry.why}</dd>
            <dd className="term-figure"><TermDiagram slug={entry.slug} /></dd>
          </div>
        ))}
      </dl>
      <p className="next"><Link href="/glossary">{text.understand.allTerms}</Link></p>
    </div>
  );
}
