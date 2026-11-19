import type { Metadata } from "next";
import { reading } from "../../../../../content/papers/digests.ts";
import { PapersView } from "@/components/PapersView.tsx";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.digests.title}: ${text.views.read}` };

/** Read: the papers behind restriction digests and gels. */
export default function Read() {
  return <PapersView reading={reading} />;
}
