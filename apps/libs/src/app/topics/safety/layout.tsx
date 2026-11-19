import type { Metadata } from "next";
import { TopicShell } from "@/components/TopicShell.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: text.topics.safety.title, description: text.topics.safety.summary };

/** This topic has no package behind it, so it has no Code view. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <TopicShell slug="safety" views={["do", "understand", "read"]}>{children}</TopicShell>;
}
