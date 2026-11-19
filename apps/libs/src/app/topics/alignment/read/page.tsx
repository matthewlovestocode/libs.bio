import type { Metadata } from "next";
import { reading } from "../../../../../content/papers/alignment.ts";
import { PapersView } from "@/components/PapersView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.alignment.title}: ${text.views.read}` };

/** Read: the papers behind sequence alignment. */
export default function Read() {
  return <PapersView reading={reading} />;
}
