import type { Metadata } from "next";
import { LINKS, SITES } from "@libsbio/shared";
import { CITES, PASSAGES, TIERS } from "../../../content/what-it-is.ts";
import { Mark } from "@/components/Mark.tsx";
import { cited, firstSentence } from "@/lib/libraries.ts";
import { messages } from "@/messages/index.ts";

const text = messages();

export const metadata: Metadata = { title: text.whatItIs.title, description: text.whatItIs.description };

/**
 * What Bionet is, and what it does not do.
 *
 * The second half of that title is not a flourish. A protocol with no authority in it has to be
 * exact about what a signature settles, so the page spends as long on the edges as on the promise,
 * and the names it rests on are checked against the packages when the site is built.
 */
export default function WhatItIs() {
  return (
    <>
      <header className="top">
        <div className="wrap">
          <a className="logo" href="/"><Mark /><span>{text.name}</span></a>
          <nav>
            <a href="/libraries">{text.nav.libraries}</a>
            <a href={SITES.libs.url}>{text.nav.libs}</a>
            <a href={LINKS.source}>{text.nav.source}</a>
          </nav>
        </div>
      </header>
      <main>
        <div className="wrap">
          <h1>{text.whatItIs.heading}</h1>
          <p className="lede">{text.whatItIs.lede}</p>

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
              {passage.quote === undefined ? null : (
                <figure className="quote">
                  <blockquote>{passage.quote.text}</blockquote>
                  <figcaption>{text.whatItIs.from} <code>@biolibs/{passage.quote.from}</code>, <code>{passage.quote.file}</code></figcaption>
                </figure>
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

          <section id="running-a-lab" className="passage">
            <h2>{text.whatItIs.tiersHeading}</h2>
            <p>{text.whatItIs.tiersNote}</p>
            <div className="scroller">
              <table className="tiers">
                <thead>
                  <tr>
                    <th scope="col">{text.whatItIs.tier}</th>
                    <th scope="col">{text.whatItIs.gives}</th>
                    <th scope="col">{text.whatItIs.costs}</th>
                    <th scope="col">{text.whatItIs.today}</th>
                  </tr>
                </thead>
                <tbody>
                  {TIERS.map((tier) => (
                    <tr key={tier.tier}>
                      <th scope="row">{tier.tier}</th>
                      <td>{tier.gives}</td>
                      <td>{tier.costs}</td>
                      <td>{tier.today}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="in-the-code" className="passage">
            <h2>{text.whatItIs.codeHeading}</h2>
            <p>{text.whatItIs.codeNote}</p>
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

          <section className="card">
            <h2>{text.whatItIs.whereHeading}</h2>
            <p>{text.whatItIs.whereNote}</p>
            <ul>
              <li><a href="/libraries">{text.home.libraries}</a></li>
              <li><a href={`${LINKS.source}/blob/main/PLAN.md`}>{text.whatItIs.plan}</a></li>
            </ul>
          </section>
        </div>
      </main>
      <footer><div className="wrap">{text.footer}</div></footer>
    </>
  );
}
