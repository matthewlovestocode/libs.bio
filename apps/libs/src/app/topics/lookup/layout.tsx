import type { Metadata } from "next";
import { TopicShell } from "@/components/TopicShell.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: text.topics.lookup.title, description: text.topics.lookup.summary };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TopicShell slug="lookup">{children}</TopicShell>;
}
