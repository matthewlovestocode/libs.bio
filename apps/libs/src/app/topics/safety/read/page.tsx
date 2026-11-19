import type { Metadata } from "next";
import { reading } from "../../../../../content/papers/safety.ts";
import { PapersView } from "@/components/PapersView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.safety.title}: ${text.views.read}` };

/** Read: what has been written about how this community governs itself. */
export default function Read() {
  return <PapersView reading={reading} />;
}
