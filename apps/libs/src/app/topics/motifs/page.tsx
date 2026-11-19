import Link from "next/link";
import { GelBands } from "@/components/GelBands.tsx";
import { MotifTool } from "@/components/MotifTool.tsx";
import { messages } from "@/messages/index.ts";

/** Do: the tool, on glass, over the grid and the drifting bands. */
export default function Do() {
  const text = messages();
  return (
    <>
      <div className="stage">
        <GelBands />
        <MotifTool />
      </div>
      <p className="quiet after">{text.views.newHere} <Link href="/topics/motifs/understand">{text.views.understand}</Link>.</p>
    </>
  );
}
