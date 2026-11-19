import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/cloning.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.cloning.title}: ${text.views.understand}` };

/** Understand: how a piece of DNA is put into a plasmid, at the reader's level. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/cloning" />;
}
