import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/sequences.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.sequences.title}: ${text.views.understand}` };

/** Understand: how DNA is read into protein, at the reader's level. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/sequences" />;
}
