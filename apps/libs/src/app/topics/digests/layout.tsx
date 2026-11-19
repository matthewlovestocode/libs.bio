import type { Metadata } from "next";
import { TopicShell } from "@/components/TopicShell.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: text.topics.digests.title, description: text.topics.digests.summary };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TopicShell slug="digests">{children}</TopicShell>;
}
