import type { Metadata } from "next";
import { TopicShell } from "@/components/TopicShell.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: text.topics.motifs.title, description: text.topics.motifs.summary };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TopicShell slug="motifs">{children}</TopicShell>;
}
