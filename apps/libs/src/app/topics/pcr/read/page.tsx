import type { Metadata } from "next";
import { reading } from "../../../../../content/papers/pcr.ts";
import { PapersView } from "@/components/PapersView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.pcr.title}: ${text.views.read}` };

/** Read: the papers behind PCR and primer design. */
export default function Read() {
  return <PapersView reading={reading} />;
}
