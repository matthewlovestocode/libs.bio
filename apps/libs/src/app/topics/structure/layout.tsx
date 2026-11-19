import type { Metadata } from "next";
import { TopicShell } from "@/components/TopicShell.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: text.topics.structure.title, description: text.topics.structure.summary };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TopicShell slug="structure">{children}</TopicShell>;
}
