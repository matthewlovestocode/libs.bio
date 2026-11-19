import Link from "next/link";
import { GelBands } from "@/components/GelBands.tsx";
import { LookupTool } from "@/components/LookupTool.tsx";
import { messages } from "@/messages/index.ts";

/** Do: the tool, on glass, over the grid and the drifting bands. */
export default function Do() {
  const text = messages();
  return (
    <>
      <div className="stage">
        <GelBands />
        <LookupTool />
      </div>
      <p className="quiet after">{text.views.newHere} <Link href="/topics/lookup/understand">{text.views.understand}</Link>.</p>
    </>
  );
}
