import type { Metadata } from "next";
import { reading } from "../../../../../content/papers/motifs.ts";
import { PapersView } from "@/components/PapersView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.motifs.title}: ${text.views.read}` };

/** Read: the papers behind motifs and sequence logos. */
export default function Read() {
  return <PapersView reading={reading} />;
}
