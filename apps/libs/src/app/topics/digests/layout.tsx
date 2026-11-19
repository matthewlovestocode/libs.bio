import type { Metadata } from "next";
import { Footer, Header } from "@/components/Chrome.tsx";
import { StatusLabel } from "@/components/StatusLabel.tsx";
import { TopicTabs } from "@/components/TopicTabs.tsx";
import { TOPICS } from "@/lib/topics.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
const topic = TOPICS.find((one) => one.slug === "digests")!;

export const metadata: Metadata = { title: text.topics.digests.title, description: text.topics.digests.summary };

/** What every view of the topic shares: its name, how settled it is, and the four tabs. */
export default function DigestsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>
        <div className="wrap">
          <div className="title">
            <h1>{text.topics.digests.title} <StatusLabel status={topic.status} /></h1>
            <p className="lede">{text.topics.digests.summary}</p>
          </div>
          <TopicTabs base="/topics/digests" />
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
