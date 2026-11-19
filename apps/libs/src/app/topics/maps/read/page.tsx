import type { Metadata } from "next";
import { reading } from "../../../../../content/papers/maps.ts";
import { PapersView } from "@/components/PapersView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.maps.title}: ${text.views.read}` };

/** Read: the papers behind plasmids, their maps and their annotation. */
export default function Read() {
  return <PapersView reading={reading} />;
}
