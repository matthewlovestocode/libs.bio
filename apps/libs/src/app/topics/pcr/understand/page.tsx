import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/pcr.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.pcr.title}: ${text.views.understand}` };

/** Understand: the idea behind PCR and primers, at the reader's level. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/pcr" />;
}
