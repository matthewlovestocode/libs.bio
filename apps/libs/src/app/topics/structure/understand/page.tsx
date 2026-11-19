import type { Metadata } from "next";
import { lesson } from "../../../../../content/en/structure.ts";
import { LessonView } from "@/components/LessonView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.structure.title}: ${text.views.understand}` };

/** Understand: what a structure file holds and what its pictures say. */
export default function Understand() {
  return <LessonView lesson={lesson} toolHref="/topics/structure" />;
}
