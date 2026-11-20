import type { Metadata } from "next";
import { LINKS, SITES } from "@libsbio/shared";
import { Mark } from "@/components/Mark.tsx";
import { check } from "@/lib/install.ts";
import { messages } from "@/messages/index.ts";
import { BEFORE, FIRST_RUN, PASSAGES, STEPS, WHAT_WAS_USED } from "../../../content/install.ts";

const text = messages();

export const metadata: Metadata = { title: text.install.title, description: text.install.description };

// Loading the module runs its check; this keeps the import from being dropped as unused.
void check;

/**
 * Running the app from source, which is the only way to run it today.
 *
 * Every command here was carried out on a clone made fresh before any of it was written down, and
 * the first attempt failed — which is why the repository's dependency floors were wrong and are now
 * right. The versions at the bottom are the machine it was done on, not a guess at a minimum.
 */
export default function Install() {
  return (
    <>
      <header className="top">
        <div className="wrap">
          <a className="logo" href="/"><Mark /><span>{text.name}</span></a>
          <nav>
            <a href="/what-it-is">{text.nav.whatItIs}</a>
            <a href="/tools">{text.nav.tools}</a>
            <a href="/safety">{text.nav.safety}</a>
            <a href="/libraries">{text.nav.libraries}</a>
            <a href={SITES.libs.url}>{text.nav.libs}</a>
            <a href={LINKS.source}>{text.nav.source}</a>
          </nav>
        </div>
      </header>
      <main>
        <div className="wrap">
          <h1>{text.install.heading}</h1>
          <p className="lede">{text.install.lede}</p>

          {PASSAGES.map((passage) => (
            <section key={passage.id} id={passage.id} className="passage">
              <h2>{passage.heading}</h2>
              {passage.paragraphs.map((line) => <p key={line.slice(0, 40)}>{line}</p>)}
            </section>
          ))}

          <section className="passage" id="before-you-start">
            <h2>{text.install.beforeHeading}</h2>
            <dl className="points">
              {BEFORE.map((one) => (
                <div key={one.term}>
                  <dt>{one.term}</dt>
                  <dd>{one.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="passage" id="the-commands">
            <h2>{text.install.stepsHeading}</h2>
            <p className="quiet">{text.install.stepsNote}</p>
            <ol className="steps">
              {STEPS.map((step) => (
                <li key={step.command}>
                  <pre><code>{step.command}</code></pre>
                  <p>{step.what}</p>
                  {step.note === undefined ? null : <p className="quiet">{step.note}</p>}
                </li>
              ))}
            </ol>
          </section>

          <section className="passage" id="first-run">
            <h2>{text.install.firstRunHeading}</h2>
            {FIRST_RUN.map((one) => (
              <div key={one.text.slice(0, 40)}>
                <p>{one.text}</p>
                {one.command === undefined ? null : <pre className="command"><code>{one.command}</code></pre>}
              </div>
            ))}
          </section>

          <section className="card" id="what-was-used">
            <h2>{text.install.usedHeading}</h2>
            <p>{text.install.usedNote}</p>
            <ul className="versions">
              {WHAT_WAS_USED.map((one) => (
                <li key={one.what}>{one.what} <span className="version">{one.version}</span></li>
              ))}
            </ul>
            <p><a href={LINKS.desktop}>{text.install.source}</a></p>
          </section>
        </div>
      </main>
      <footer><div className="wrap">{text.footer}</div></footer>
    </>
  );
}
