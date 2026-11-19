import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/motifs.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.motifs.title}: ${text.views.understand}` };

/** Understand: what a motif is and what a score means. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/motifs" />;
}
