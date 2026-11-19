import type { Metadata } from "next";
import { reading } from "../../../../../content/papers/structure.ts";
import { PapersView } from "@/components/PapersView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.structure.title}: ${text.views.read}` };

/** Read: the papers behind protein structure. */
export default function Read() {
  return <PapersView reading={reading} />;
}
