import Link from "next/link";
import { GelBands } from "@/components/GelBands.tsx";
import { PcrTool } from "@/components/PcrTool.tsx";
import { messages } from "@/messages/index.ts";

/** Do: the tool, on glass, over the grid and the drifting bands. */
export default function Do() {
  const text = messages();
  return (
    <>
      <div className="stage">
        <GelBands />
        <PcrTool />
      </div>
      <p className="quiet after">{text.views.newHere} <Link href="/topics/pcr/understand">{text.views.understand}</Link>.</p>
    </>
  );
}
