import Link from "next/link";
import { GelBands } from "@/components/GelBands.tsx";
import { StructureTool } from "@/components/StructureTool.tsx";
import { messages } from "@/messages/index.ts";

/** Do: the tool, on glass, over the grid and the drifting bands. */
export default function Do() {
  const text = messages();
  return (
    <>
      <div className="stage">
        <GelBands />
        <StructureTool />
      </div>
      <p className="quiet after">{text.views.newHere} <Link href="/topics/structure/understand">{text.views.understand}</Link>.</p>
    </>
  );
}
