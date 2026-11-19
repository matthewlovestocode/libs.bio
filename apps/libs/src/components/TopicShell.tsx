import { Footer, Header } from "@/components/Chrome.tsx";
import { StatusLabel } from "@/components/StatusLabel.tsx";
import { TopicTabs } from "@/components/TopicTabs.tsx";
import { TOPICS } from "@/lib/topics.ts";
import { messages } from "@/messages/index.ts";

/**
 * What every view of a topic shares: its name, how settled it is, and the four tabs.
 *
 * @param props.slug - Which topic, as in its address.
 * @param props.children - The view.
 */
export function TopicShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const text = messages();
  const topic = TOPICS.find((one) => one.slug === slug)!;
  return (
    <>
      <Header />
      <main>
        <div className="wrap">
          <div className="title">
            <h1>{text.topics[topic.key].title} <StatusLabel status={topic.status} /></h1>
            <p className="lede">{text.topics[topic.key].summary}</p>
          </div>
          <TopicTabs base={`/topics/${slug}`} />
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
