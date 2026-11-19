import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, GLOSSARY, getEntry } from "../../../../content/en/glossary.ts";
import { Footer, Header } from "@/components/Chrome.tsx";
import { StatusLabel } from "@/components/StatusLabel.tsx";
import { TermDiagram } from "@/components/diagrams/index.tsx";
import { packages } from "@/lib/api.ts";
import { topicsFor } from "@/lib/glossary.ts";
import { messages } from "@/messages/index.ts";

const text = messages();

export const dynamicParams = false;

/** One page per term, all written out when the site is built. */
export function generateStaticParams() {
  return GLOSSARY.map((entry) => ({ term: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ term: string }> }): Promise<Metadata> {
  const entry = getEntry((await params).term);
  return entry === undefined ? {} : { title: `${entry.term}: ${text.glossary.title}`, description: entry.definition };
}

/** One term: what it means, its picture, why it matters, and where to go from it. */
export default async function TermPage({ params }: { params: Promise<{ term: string }> }) {
  const entry = getEntry((await params).term);
  if (entry === undefined) notFound();
  const category = CATEGORIES.find((one) => one.id === entry.category);
  const related = entry.related.map(getEntry).filter((one) => one !== undefined);
  const topics = topicsFor(entry.lessons);
  const documented = new Set(packages().map((one) => one.name));

  return (
    <>
      <Header />
      <main>
        <div className="wrap narrow">
          <p className="crumb"><Link href="/glossary">{text.glossary.title}</Link> / <Link href={`/glossary#${entry.category}`}>{category?.title}</Link></p>
          <h1>{entry.term}</h1>
          <p className="definition">{entry.definition}</p>
          <TermDiagram slug={entry.slug} />
          <p className="detail">{entry.detail}</p>
          <p className="why"><b>{text.glossary.why} </b>{entry.why}</p>

          {related.length === 0 ? null : (
            <section className="term-more">
              <h2>{text.glossary.related}</h2>
              <ul className="topics">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link href={`/glossary/${other.slug}`} className="topic live">
                      <span className="topic-title">{other.term}</span>
                      <span className="topic-summary">{other.definition}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="term-links">
            {topics.length === 0 ? null : (
              <section>
                <h2>{text.glossary.topics}</h2>
                <ul>
                  {topics.map((topic) => (
                    <li key={topic.slug}>
                      {topic.status === null
                        ? <>{text.topics[topic.key].title} <StatusLabel status={null} /></>
                        : <Link href={`/topics/${topic.slug}/understand`}>{text.topics[topic.key].title}</Link>}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {entry.packages.length === 0 ? null : (
              <section>
                <h2>{text.glossary.libraries}</h2>
                <ul>
                  {entry.packages.map((name) => (
                    <li key={name}>
                      {documented.has(name)
                        ? <Link href={`/api/${name}`}><code>@biolibs/{name}</code></Link>
                        : <a href={`https://www.npmjs.com/package/@biolibs/${name}`}><code>@biolibs/{name}</code></a>}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
