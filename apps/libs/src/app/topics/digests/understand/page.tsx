import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/digests.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.digests.title}: ${text.views.understand}` };

/** Understand: the idea behind cutting DNA and reading a gel, at the reader's level. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/digests" />;
}
