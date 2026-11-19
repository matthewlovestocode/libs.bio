import Link from "next/link";
import { GelBands } from "@/components/GelBands.tsx";
import { SequenceTool } from "@/components/SequenceTool.tsx";
import { messages } from "@/messages/index.ts";

/** Do: the tool, on glass, over the grid and the drifting bands. */
export default function Do() {
  const text = messages();
  return (
    <>
      <div className="stage">
        <GelBands />
        <SequenceTool />
      </div>
      <p className="quiet after">{text.views.newHere} <Link href="/topics/sequences/understand">{text.views.understand}</Link>.</p>
    </>
  );
}
