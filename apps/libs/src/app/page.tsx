import Link from "next/link";
import { Footer, Header } from "@/components/Chrome.tsx";
import { StatusLabel } from "@/components/StatusLabel.tsx";
import { TOPICS } from "@/lib/topics.ts";
import { messages } from "@/messages/index.ts";

/** The front page: a list of things you can do. It is not a pitch. */
export default function Home() {
  const text = messages();
  const built = TOPICS.filter((topic) => topic.status !== null);
  const coming = TOPICS.filter((topic) => topic.status === null);
  return (
    <>
      <Header />
      <main>
        <div className="wrap">
          <h1>{text.home.heading}</h1>
          <p className="lede">{text.home.lede}</p>

          <h2 className="section">{text.home.topicsHeading}</h2>
          <ul className="topics">
            {built.map((topic) => (
              <li key={topic.slug}>
                <Link href={`/topics/${topic.slug}`} className="topic live">
                  <span className="topic-title">{text.topics[topic.key].title} <StatusLabel status={topic.status} /></span>
                  <span className="topic-summary">{text.topics[topic.key].summary}</span>
                  <span className="topic-uses">{text.home.uses} {topic.packages.map((name) => `@biolibs/${name}`).join(", ")}</span>
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="section">{text.glossary.homeHeading}</h2>
          <ul className="topics">
            <li>
              <Link href="/glossary" className="topic live">
                <span className="topic-title">{text.glossary.title}</span>
                <span className="topic-summary">{text.glossary.homeCard}</span>
              </Link>
            </li>
            <li>
              <Link href="/api" className="topic live">
                <span className="topic-title">{text.api.title}</span>
                <span className="topic-summary">{text.api.lede}</span>
              </Link>
            </li>
          </ul>

          {/* Once every topic is built there is nothing to come, and an empty heading is worse than none. */}
          {coming.length === 0 ? null : (
            <>
              <h2 className="section">{text.home.coming}</h2>
              <p className="quiet">{text.home.comingNote}</p>
              <ul className="topics">
                {coming.map((topic) => (
                  <li key={topic.slug}>
                    <div className="topic">
                      <span className="topic-title">{text.topics[topic.key].title} <StatusLabel status={null} /></span>
                      <span className="topic-summary">{text.topics[topic.key].summary}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
