import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/lookup.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.lookup.title}: ${text.views.understand}` };

/** Understand: what the public databases hold and how much to trust it. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/lookup" />;
}
