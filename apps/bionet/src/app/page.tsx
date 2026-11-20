import { LINKS, SITES } from "@libsbio/shared";
import { Mark } from "@/components/Mark.tsx";
import { messages } from "@/messages/index.ts";

/** The front page, until the first release is built: what this is, and where things are meanwhile. */
export default function Home() {
  const text = messages();
  return (
    <>
      <header className="top">
        <div className="wrap">
          <span className="logo"><Mark /><span>{text.name}</span></span>
          <nav>
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
          <p>{text.home.body}</p>
          <section className="card">
            <h2>{text.home.nextHeading}</h2>
            <ul>{text.home.next.map((line) => <li key={line}>{line}</li>)}</ul>
          </section>
          <section className="card">
            <h2>{text.home.nowHeading}</h2>
            <ul>
              <li><a href="/libraries">{text.home.libraries}</a></li>
              <li><a href={`${LINKS.biolibs}#bionet`}>{text.home.protocol}</a></li>
              <li><a href={`${LINKS.source}/blob/main/PLAN.md`}>{text.home.plan}</a></li>
            </ul>
          </section>
        </div>
      </main>
      <footer><div className="wrap">{text.footer}</div></footer>
    </>
  );
}
