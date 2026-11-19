import type { Metadata } from "next";
import { reading } from "../../../../../content/papers/lookup.ts";
import { PapersView } from "@/components/PapersView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.lookup.title}: ${text.views.read}` };

/** Read: the papers behind the public databases. */
export default function Read() {
  return <PapersView reading={reading} />;
}
