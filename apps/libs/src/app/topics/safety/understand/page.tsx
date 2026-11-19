import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/safetyLesson.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.safety.title}: ${text.views.understand}` };

/** Understand: how risk is actually assessed, at the reader's level. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/safety" />;
}
