import { LINKS, SITES } from "@libsbio/shared";
import { Mark } from "@/components/Mark.tsx";
import { doors, hero, standing } from "@/lib/home.ts";
import { messages } from "@/messages/index.ts";
import { CAN_I_USE_IT, WHAT_IT_IS, WHERE_IT_STANDS } from "../../content/home.ts";
import { DOES_NOT } from "../../content/safety.ts";

const text = messages();

/**
 * The front page: what Bionet is, what it will not do, and whether it can be had yet.
 *
 * The third question is answered early and plainly, because the answer is no and a reader should
 * not have to work that out. The five things it does not do are the safety page's own list rather
 * than a summary of it, so the two cannot drift apart.
 *
 * Everything counted here is counted by `lib/home.ts` from the site itself.
 */
export default function Home() {
  const picture = hero();
  const here = standing();
  return (
    <>
      <header className="top">
        <div className="wrap">
          <span className="logo"><Mark /><span>{text.name}</span></span>
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
          <span className="status">{text.home.building}</span>
          <h1>{text.home.heading}</h1>
          <p className="lede">{text.home.lede}</p>

          <figure className="hero">
            <img src={`/bench/${picture.web}`} width={picture.width} height={picture.height}
                 alt={picture.alt} />
            <figcaption>{picture.caption} <a href="/tools">{text.nav.tools}</a></figcaption>
          </figure>

          <section className="passage" id="what-it-is">
            <h2>{text.home.whatHeading}</h2>
            {WHAT_IT_IS.map((line) => <p key={line.slice(0, 40)}>{line}</p>)}
            <p><a href="/what-it-is">{text.home.whatMore}</a></p>
          </section>

          <section className="passage" id="can-i-use-it">
            <h2>{CAN_I_USE_IT.heading}</h2>
            <p className="answer">{CAN_I_USE_IT.answer}</p>
            {CAN_I_USE_IT.body.map((line) => <p key={line.slice(0, 40)}>{line}</p>)}
          </section>

          <section className="passage" id="what-it-does-not-do">
            <h2>{text.home.doesNotHeading}</h2>
            <p className="quiet">{text.home.doesNotNote}</p>
            <ul className="does-not">
              {DOES_NOT.map((one) => <li key={one.term}>{one.term}</li>)}
            </ul>
            <p><a href="/safety">{text.home.doesNotMore}</a></p>
          </section>

          <section className="passage" id="read-on">
            <h2>{text.home.readHeading}</h2>
            <div className="doors">
              {doors().map((door) => (
                <a key={door.route} className="door" href={`/${door.route}`}>
                  <b>{door.title}</b>
                  <span>{door.blurb}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="card" id="where-it-stands">
            <h2>{text.home.standingHeading}</h2>
            <p>{WHERE_IT_STANDS}</p>
            <ul>
              <li>{text.home.standingCount(here.pages, here.packages, here.exports)}</li>
              <li>{text.home.standingTools(here.tools, here.photographed, here.took)}</li>
            </ul>
            <p>
              <a href={`${LINKS.biolibs}#bionet`}>{text.home.protocol}</a>
              {" · "}
              <a href={`${LINKS.source}/blob/main/PLAN.md`}>{text.home.plan}</a>
            </p>
          </section>
        </div>
      </main>
      <footer><div className="wrap">{text.footer}</div></footer>
    </>
  );
}
