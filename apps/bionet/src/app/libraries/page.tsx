import type { Metadata } from "next";
import { LINKS, SITES } from "@libsbio/shared";
import { Mark } from "@/components/Mark.tsx";
import { firstSentence, stack, totals } from "@/lib/libraries.ts";
import { messages } from "@/messages/index.ts";

const text = messages();

export const metadata: Metadata = { title: text.libraries.title, description: text.libraries.description };

/**
 * The packages as a stack, from the protocol up.
 *
 * Each package shows its own description and a handful of its exports, with the package's own words
 * for each. It is not a reference and does not try to be: eleven packages export more than seven
 * hundred things between them, and the page says so rather than listing them.
 */
export default function Libraries() {
  const layers = stack();
  const { packages, exports } = totals();
  return (
    <>
      <header className="top">
        <div className="wrap">
          <a className="logo" href="/"><Mark /><span>{text.name}</span></a>
          <nav>
            <a href="/install">{text.nav.install}</a>
            <a href="/what-it-is">{text.nav.whatItIs}</a>
            <a href="/safety">{text.nav.safety}</a>
            <a href="/tools">{text.nav.tools}</a>
            <a href={SITES.libs.url}>{text.nav.libs}</a>
            <a href={LINKS.source}>{text.nav.source}</a>
          </nav>
        </div>
      </header>
      <main>
        <div className="wrap">
          <h1>{text.libraries.heading}</h1>
          <p className="lede">{text.libraries.lede}</p>
          <p className="quiet">{text.libraries.counts(packages, exports)}</p>

          <nav aria-label={text.libraries.layers} className="pills">
            {layers.map((layer) => <a key={layer.id} href={`#${layer.id}`}>{layer.title}</a>)}
          </nav>

          {layers.map((layer) => (
            <section key={layer.id} id={layer.id} className="layer">
              <h2>{layer.title}</h2>
              <p className="quiet">{layer.blurb}</p>
              {layer.packages.map((pack) => (
                <article key={pack.name} id={pack.name} className="pack">
                  <h3>
                    <code>@biolibs/{pack.name}</code>
                    <span className="version">{pack.version}</span>
                  </h3>
                  <p className="says">{pack.description}</p>
                  <p>{pack.why}</p>
                  <dl className="names">
                    {pack.shown.map((one) => (
                      <div key={one.name}>
                        <dt><code>{one.name}</code> <span className="kind">{one.kind}</span></dt>
                        <dd>{one.summary === "" ? text.libraries.undocumented : firstSentence(one.summary)}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="rest">{text.libraries.rest(pack.shown.length, pack.total, pack.name)}</p>
                </article>
              ))}
            </section>
          ))}

          <section className="card">
            <h2>{text.libraries.installHeading}</h2>
            <p>{text.libraries.installNote}</p>
            <p><a href={`${LINKS.source}/blob/main/PLAN.md`}>{text.libraries.plan}</a></p>
          </section>
        </div>
      </main>
      <footer><div className="wrap">{text.footer}</div></footer>
    </>
  );
}
