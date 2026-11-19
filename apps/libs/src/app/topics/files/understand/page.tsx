import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/files.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.files.title}: ${text.views.understand}` };

/** Understand: what a sequence file holds and what converting one costs. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/files" />;
}
