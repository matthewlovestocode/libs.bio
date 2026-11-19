import type { Metadata } from "next";
import { reading } from "../../../../../content/papers/cloning.ts";
import { PapersView } from "@/components/PapersView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.cloning.title}: ${text.views.read}` };

/** Read: the papers behind cloning and assembly. */
export default function Read() {
  return <PapersView reading={reading} />;
}
