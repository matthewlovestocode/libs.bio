import { Footer, Header } from "@/components/Chrome.tsx";
import { StatusLabel } from "@/components/StatusLabel.tsx";
import { TopicTabs, type View } from "@/components/TopicTabs.tsx";
import { TOPICS } from "@/lib/topics.ts";
import { messages } from "@/messages/index.ts";

/**
 * What every view of a topic shares: its name, how settled it is, and the four tabs.
 *
 * @param props.slug - Which topic, as in its address.
 * @param props.views - Which views it has, where it does not have all four.
 * @param props.children - The view.
 */
export function TopicShell({ slug, views, children }: { slug: string; views?: readonly View[]; children: React.ReactNode }) {
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
          <TopicTabs base={`/topics/${slug}`} views={views} />
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
