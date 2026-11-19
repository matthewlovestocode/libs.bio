import type { Metadata } from "next";
import { reading } from "../../../../../content/papers/files.ts";
import { PapersView } from "@/components/PapersView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.files.title}: ${text.views.read}` };

/** Read: the papers behind the formats. */
export default function Read() {
  return <PapersView reading={reading} />;
}
