import Link from "next/link";
import { LINKS, SITES } from "@libsbio/shared";
import { Mark } from "@/components/Mark.tsx";
import { messages } from "@/messages/index.ts";

/** The bar across the top of every page: the mark and name, and the few places there are to go. */
export function Header() {
  const text = messages();
  return (
    <header className="top">
      <div className="wrap">
        <Link href="/" className="logo" aria-label={text.nav.home}>
          <Mark /><span>{text.name}</span><span className="tld">{text.tld}</span>
        </Link>
        <nav>
          <Link href="/">{text.nav.topics}</Link>
          <Link href="/glossary">{text.nav.glossary}</Link>
          <Link href="/api">{text.nav.api}</Link>
          <a href={SITES.bionet.url}>{text.nav.bionet}</a>
          <a href={LINKS.source}>{text.nav.source}</a>
        </nav>
      </div>
    </header>
  );
}

/** The foot of every page: the licences, the promise about data, and where the code is. */
export function Footer() {
  const text = messages();
  return (
    <footer>
      <div className="wrap">
        <p>{text.footer.promise}</p>
        <p>
          {text.footer.licences} · <a href={LINKS.npm}>{text.footer.packages}</a> · <a href={LINKS.biolibs}>{text.footer.libraries}</a> ·{" "}
          <a href={`${LINKS.source}/blob/main/PLAN.md`}>{text.footer.plan}</a>
        </p>
      </div>
    </footer>
  );
}
