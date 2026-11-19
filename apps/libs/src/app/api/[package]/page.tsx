import type { Metadata } from "next";
import Link from "next/link";
import { LINKS } from "@libsbio/shared";
import { ApiFilter } from "@/components/ApiFilter.tsx";
import { Footer, Header } from "@/components/Chrome.tsx";
import { DocText } from "@/components/DocText.tsx";
import { type Described, type Item, KINDS, packageNamed, packages } from "@/lib/api.ts";
import { messages } from "@/messages/index.ts";

const text = messages();

/** One page per documented package, all written out when the site is built. */
export function generateStaticParams() {
  return packages().map((one) => ({ package: one.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ package: string }> }): Promise<Metadata> {
  const pack = packageNamed((await params).package);
  return { title: `@biolibs/${pack.name}`, description: pack.description };
}

/** What a function, method or type says about itself, under its signature. */
function Details({ item }: { item: Described }) {
  return (
    <>
      {item.deprecated === null ? null : <p className="problem"><b>{text.api.deprecated}</b> <DocText text={item.deprecated} brief /></p>}
      <div className="doc"><DocText text={item.summary} /></div>
      {item.params.length === 0 ? null : (
        <dl className="params">
          {item.params.map((param) => <div key={param.name}><dt><code>{param.name}</code></dt><dd><DocText text={param.text} brief /></dd></div>)}
        </dl>
      )}
      {item.returns === "" ? null : <p className="doc-line"><b>{text.api.returns}</b> <DocText text={item.returns} brief /></p>}
      {item.throws.map((thrown) => <p className="doc-line" key={thrown}><b>{text.api.throws}</b> <DocText text={thrown} brief /></p>)}
      {item.examples.map((example) => <pre key={example}><code>{example}</code></pre>)}
    </>
  );
}

/** One export, with its members folded away until they are asked for. */
function Entry({ item }: { item: Item }) {
  return (
    <article className="api-item" id={item.name} data-api-item={item.name}>
      <h3><a href={`#${item.name}`}>{item.name}</a></h3>
      <pre className="signature"><code>{item.signature}</code></pre>
      <Details item={item} />
      {item.members.length === 0 ? null : (
        <details className="members">
          <summary>{text.api.members(item.members.length)}</summary>
          {item.members.map((member, i) => (
            <div className="member" key={`${member.name}-${i}`}>
              <pre className="signature"><code>{member.signature}</code></pre>
              <Details item={member} />
            </div>
          ))}
        </details>
      )}
    </article>
  );
}

/** A package's page: what it is, how to get it, and everything it exports. */
export default async function PackagePage({ params }: { params: Promise<{ package: string }> }) {
  const pack = packageNamed((await params).package);
  return (
    <>
      <Header />
      <main>
        <div className="wrap">
          <p className="crumb"><Link href="/api">{text.api.title}</Link></p>
          <div className="title">
            <h1><code>@biolibs/{pack.name}</code></h1>
            <p className="lede">{pack.description}</p>
          </div>
          <div className="flat">
            <pre><code>npm install @biolibs/{pack.name}</code></pre>
            <p className="quiet">
              {text.api.version} {pack.version} · <a href={`https://www.npmjs.com/package/@biolibs/${pack.name}`}>npm</a> ·{" "}
              <a href={`${LINKS.biolibs}/tree/main/packages/${pack.name}`}>{text.api.source}</a> · {text.api.generatedFrom}
            </p>
            <div className="doc overview"><DocText text={pack.overview} /></div>
          </div>

          <ApiFilter total={pack.items.length} />
          {KINDS.map((kind) => {
            const items = pack.items.filter((item) => item.kind === kind);
            return items.length === 0 ? null : (
              <section key={kind} data-api-kind={kind}>
                <h2 className="section">{text.api.kinds[kind]} <span>{items.length}</span></h2>
                <div className="flat api-list">{items.map((item) => <Entry key={item.name} item={item} />)}</div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
