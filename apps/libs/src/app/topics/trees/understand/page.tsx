import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/trees.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.trees.title}: ${text.views.understand}` };

/** Understand: what a tree claims and how much of it to believe. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/trees" />;
}
