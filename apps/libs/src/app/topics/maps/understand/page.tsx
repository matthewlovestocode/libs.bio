import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/maps.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.maps.title}: ${text.views.understand}` };

/** Understand: what a plasmid map shows and how to read one, at the reader's level. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/maps" />;
}
