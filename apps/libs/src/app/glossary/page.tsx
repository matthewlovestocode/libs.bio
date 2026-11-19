import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, GLOSSARY } from "../../../content/en/glossary.ts";
import { Footer, Header } from "@/components/Chrome.tsx";
import { AlignmentDiagram, CentralDogmaDiagram, CoordinateDiagram, CutDiagram, ReverseComplementDiagram, TermDiagram } from "@/components/diagrams/index.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: text.glossary.title, description: text.glossary.description };

/** Pairs of ideas that are easy to mix up, each settled with a picture. Carried over from biolibs-site. */
const CONFUSABLE = [
  {
    id: "complement-vs-reverse-complement", title: "Complement and reverse complement",
    text: "The complement is the partner strand read in the same left-to-right order, which is its 3′ to 5′ direction. The reverse complement is that strand turned round so it reads 5′ to 3′, the way sequences are always written.",
    figures: [<ReverseComplementDiagram key="a" />], links: ["complement", "reverse-complement"],
  },
  {
    id: "sticky-vs-blunt", title: "Sticky ends and blunt ends",
    text: "It depends on where the enzyme cuts each strand. A staggered cut leaves an overhang that only pairs with a matching one. A straight cut leaves none, so the end will join to any other blunt end.",
    figures: [<CutDiagram key="a" enzyme="EcoRI" />, <CutDiagram key="b" enzyme="SmaI" />], links: ["sticky-end", "blunt-end"],
  },
  {
    id: "zero-vs-one-based", title: "Zero-based and one-based positions",
    text: "Databases count bases from 1 and include both ends of a range. Programming languages count the gaps from 0 and leave the end out. Every time the two meet, something has to add or subtract one.",
    figures: [<CoordinateDiagram key="a" />], links: ["coordinates"],
  },
  {
    id: "global-vs-local", title: "Global and local alignment",
    text: "A global alignment lines up two sequences from end to end, which suits sequences that are related along their whole length. A local alignment finds only the best-matching stretch, which suits a short region shared by otherwise different sequences.",
    figures: [<AlignmentDiagram key="a" />, <AlignmentDiagram key="b" mode="local" />], links: ["alignment", "gap"],
  },
  {
    id: "transcription-vs-translation", title: "Transcription and translation",
    text: "Transcription copies DNA into RNA and keeps the same alphabet, apart from U replacing T. Translation changes alphabet altogether, from bases to amino acids, three bases at a time.",
    figures: [<CentralDogmaDiagram key="a" />], links: ["transcription", "translation"],
  },
];

/** The visual glossary: every term with its picture, by subject, and the pairs people mix up. */
export default function Glossary() {
  return (
    <>
      <Header />
      <main>
        <div className="wrap">
          <h1>{text.glossary.heading}</h1>
          <p className="lede">{text.glossary.lede}</p>
          <nav aria-label={text.glossary.sections} className="pills">
            {CATEGORIES.map((category) => <a key={category.id} href={`#${category.id}`}>{category.title}</a>)}
            <a href="#easily-confused" className="on">{text.glossary.confused}</a>
          </nav>

          {CATEGORIES.map((category) => (
            <section key={category.id} id={category.id} className="glossary-section">
              <h2>{category.title}</h2>
              <p className="quiet">{category.blurb}</p>
              <ul className="term-cards">
                {GLOSSARY.filter((entry) => entry.category === category.id).map((entry) => (
                  <li key={entry.slug}>
                    <Link href={`/glossary/${entry.slug}`} className="term-card">
                      <span className="term-thumb"><TermDiagram slug={entry.slug} decorative /></span>
                      <span className="term-words">
                        <span className="topic-title">{entry.term}</span>
                        <span className="topic-summary">{entry.definition}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section id="easily-confused" className="glossary-section">
            <h2>{text.glossary.confused}</h2>
            <p className="quiet">{text.glossary.confusedBlurb}</p>
            {CONFUSABLE.map((pair) => (
              <article key={pair.id} id={pair.id} className="confusable">
                <h3>{pair.title}</h3>
                <p>{pair.text}</p>
                <div className={`figures${pair.figures.length > 1 ? " two" : ""}`}>{pair.figures}</div>
                <p className="links">
                  {pair.links.map((slug) => {
                    const entry = GLOSSARY.find((one) => one.slug === slug);
                    return entry === undefined ? null : <Link key={slug} href={`/glossary/${slug}`}>{entry.term} →</Link>;
                  })}
                </p>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
