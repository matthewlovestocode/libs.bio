import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/alignment.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.alignment.title}: ${text.views.understand}` };

/** Understand: what an alignment is and what the scores mean, at the reader's level. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/alignment" />;
}
