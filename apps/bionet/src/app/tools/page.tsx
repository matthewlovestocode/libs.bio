import type { Metadata } from "next";
import { LINKS, SITES } from "@libsbio/shared";
import { Mark } from "@/components/Mark.tsx";
import { everyTool, profiles, taken } from "@/lib/tools.ts";
import { messages } from "@/messages/index.ts";
import { ABOUT_THE_PICTURES, PASSAGES } from "../../../content/tools.ts";

const text = messages();

export const metadata: Metadata = { title: text.tools.title, description: text.tools.description };

/**
 * The bench tools, photographed rather than described.
 *
 * Each picture was taken by driving the real app against a lab built for the purpose, and the
 * things named under `checked` were read off the screen before the shutter went. `lib/tools.ts`
 * holds this page to that record while the site is built, so a tool the app has gained or lost
 * stops the build rather than leaving a page of screenshots that used to be true.
 */
export default function Tools() {
  const shown = profiles();
  const every = everyTool();
  const { took, versions } = taken();
  return (
    <>
      <header className="top">
        <div className="wrap">
          <a className="logo" href="/"><Mark /><span>{text.name}</span></a>
          <nav>
            <a href="/install">{text.nav.install}</a>
            <a href="/what-it-is">{text.nav.whatItIs}</a>
            <a href="/safety">{text.nav.safety}</a>
            <a href="/libraries">{text.nav.libraries}</a>
            <a href={SITES.libs.url}>{text.nav.libs}</a>
            <a href={LINKS.source}>{text.nav.source}</a>
          </nav>
        </div>
      </header>
      <main>
        <div className="wrap">
          <h1>{text.tools.heading}</h1>
          <p className="lede">{text.tools.lede}</p>

          {PASSAGES.map((passage) => (
            <section key={passage.id} id={passage.id} className="passage">
              <h2>{passage.heading}</h2>
              {passage.paragraphs.map((line) => <p key={line.slice(0, 40)}>{line}</p>)}
            </section>
          ))}

          <section id="every-tool" className="passage">
            <h2>{text.tools.everyHeading}</h2>
            <p className="quiet">{text.tools.everyNote(every.length, shown.length)}</p>
            <ul className="tools-list">
              {every.map((one) => {
                const profile = shown.find((some) => some.tab === one);
                return (
                  <li key={one} className={profile === undefined ? "" : "shot"}>
                    {profile === undefined ? one : <a href={`#${profile.shot.id}`}>{one}</a>}
                  </li>
                );
              })}
            </ul>
          </section>

          {shown.map((one) => (
            <article key={one.shot.id} id={one.shot.id} className="tool">
              <h2>
                {one.tab}
                <span className="version">{one.at === null ? text.tools.atADesk : `${text.tools.usedAt} ${one.at.toLowerCase()}`}</span>
              </h2>
              <p>{one.why}</p>
              <figure>
                {/* The optimiser is a server and there is none, so this is a plain image at the
                    size it was written, with the room for it kept while it loads. The pictures sit
                    under /bench rather than /tools, because this page is /tools and a page for one
                    tool would want to be /tools/pcr. */}
                <img src={`/bench/${one.shot.web}`} width={one.shot.width} height={one.shot.height}
                     alt={`The Bionet desktop app, on the ${one.tab} tool. ${one.look}`} loading="lazy" />
                <figcaption>
                  <b>{text.tools.lookFor}</b> {one.look}
                </figcaption>
              </figure>
              <dl className="names">
                <div>
                  <dt>{text.tools.whatWasDone}</dt>
                  <dd>{one.shot.did}</dd>
                </div>
                <div>
                  <dt>{text.tools.checked}</dt>
                  <dd>{one.shot.shows.map((some) => <code key={some}>{some}</code>)}</dd>
                </div>
              </dl>
            </article>
          ))}

          <section className="card" id="about-the-pictures">
            <h2>{text.tools.picturesHeading}</h2>
            {ABOUT_THE_PICTURES.map((line) => <p key={line.slice(0, 40)}>{line}</p>)}
            <p className="quiet">{text.tools.takenOn(took)}</p>
            <ul className="versions">
              {Object.entries(versions).map(([name, version]) => (
                <li key={name}><code>@biolibs/{name}</code> <span className="version">{version}</span></li>
              ))}
            </ul>
            <p><a href={LINKS.desktop}>{text.tools.sourceNote}</a></p>
            <p><a href={`${LINKS.source}/blob/main/PLAN.md`}>{text.tools.plan}</a></p>
          </section>
        </div>
      </main>
      <footer><div className="wrap">{text.footer}</div></footer>
    </>
  );
}
