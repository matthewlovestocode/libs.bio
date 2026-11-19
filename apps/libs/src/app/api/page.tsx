import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/Chrome.tsx";
import { packages } from "@/lib/api.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: text.api.title, description: text.api.lede };

/** The API reference's front page: the packages documented so far. */
export default function Api() {
  return (
    <>
      <Header />
      <main>
        <div className="wrap">
          <h1>{text.api.title}</h1>
          <p className="lede">{text.api.lede}</p>
          <p className="quiet">{text.api.generated}</p>
          <ul className="topics api-packages">
            {packages().map((one) => (
              <li key={one.name}>
                <Link href={`/api/${one.name}`} className="topic live">
                  <span className="topic-title"><code>@biolibs/{one.name}</code></span>
                  <span className="topic-summary">{one.description}</span>
                  <span className="topic-uses">{text.api.version} {one.version} · {text.api.count(one.items)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="quiet after">{text.api.more}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
