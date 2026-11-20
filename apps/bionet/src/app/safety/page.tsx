import type { Metadata } from "next";
import { LINKS, SITES } from "@libsbio/shared";
import { CITES, DOES_NOT, GAPS, PASSAGES, READING } from "../../../content/safety.ts";
import { Mark } from "@/components/Mark.tsx";
import { cited, firstSentence } from "@/lib/libraries.ts";
import { messages } from "@/messages/index.ts";

const text = messages();

export const metadata: Metadata = { title: text.safety.title, description: text.safety.description };

/**
 * Bionet and biosafety.
 *
 * The list of what Bionet does not do comes before everything else on the page, because that is the
 * part a reader is owed first and the part that would do harm if it were vague.
 */
export default function Safety() {
  return (
    <>
      <header className="top">
        <div className="wrap">
          <a className="logo" href="/"><Mark /><span>{text.name}</span></a>
          <nav>
            <a href="/install">{text.nav.install}</a>
            <a href="/what-it-is">{text.nav.whatItIs}</a>
            <a href="/libraries">{text.nav.libraries}</a>
            <a href="/tools">{text.nav.tools}</a>
            <a href={SITES.libs.url}>{text.nav.libs}</a>
            <a href={LINKS.source}>{text.nav.source}</a>
          </nav>
        </div>
      </header>
      <main>
        <div className="wrap">
          <h1>{text.safety.heading}</h1>
          <p className="lede">{text.safety.lede}</p>

          <section id="what-it-does-not-do" className="passage">
            <h2>{text.safety.doesNotHeading}</h2>
            <p>{text.safety.doesNotNote}</p>
            <dl className="points">
              {DOES_NOT.map((one) => (
                <div key={one.term}>
                  <dt>{one.term}</dt>
                  <dd>{one.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          {PASSAGES.map((passage) => (
            <section key={passage.id} id={passage.id} className="passage">
              <h2>{passage.heading}</h2>
              {passage.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {passage.points === undefined ? null : (
                <dl className="points">
                  {passage.points.map((point) => (
                    <div key={point.term}>
                      <dt>{point.term}</dt>
                      <dd>{point.text}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {passage.quoteExport === undefined ? null : (
                <figure className="quote">
                  <blockquote>{cited(passage.quoteExport.pack, passage.quoteExport.name).summary}</blockquote>
                  <figcaption>
                    {text.whatItIs.from} <code>@biolibs/{passage.quoteExport.pack}</code>, {text.whatItIs.ownWordsOf} <code>{passage.quoteExport.name}</code>
                  </figcaption>
                </figure>
              )}
            </section>
          ))}

          <section id="reading" className="passage">
            <h2>{text.safety.readingHeading}</h2>
            <ul className="sources">
              {READING.map((one) => (
                <li key={one.href}>
                  <a href={one.href}>{one.name}</a>
                  <span className="issuer">{one.issuer}{one.year === "" ? "" : ` · ${one.year}`}</span>
                  <span className="what">{one.what}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="gaps" className="passage">
            <h2>{text.safety.gapsHeading}</h2>
            <p>{text.safety.gapsNote}</p>
            <dl className="points gaps">
              {GAPS.map((gap) => (
                <div key={gap.what}>
                  <dt>{gap.what}</dt>
                  <dd>{gap.why}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="in-the-code" className="passage">
            <h2>{text.whatItIs.codeHeading}</h2>
            <p>{text.safety.codeNote}</p>
            <dl className="names">
              {CITES.map((one) => {
                const found = cited(one.pack, one.name);
                return (
                  <div key={`${one.pack}.${one.name}`}>
                    <dt><code>{found.name}</code> <span className="kind">@biolibs/{one.pack}</span></dt>
                    <dd>{found.summary === "" ? text.libraries.undocumented : firstSentence(found.summary)}</dd>
                  </div>
                );
              })}
            </dl>
          </section>
        </div>
      </main>
      <footer><div className="wrap">{text.footer}</div></footer>
    </>
  );
}
