import Link from "next/link";
import { CloningViews } from "@/components/CloningViews.tsx";
import { GelBands } from "@/components/GelBands.tsx";
import { messages } from "@/messages/index.ts";

/** Do: the tool, on glass, over the grid and the drifting bands. */
export default function Do() {
  const text = messages();
  return (
    <>
      <div className="stage">
        <GelBands />
        <CloningViews />
      </div>
      <p className="quiet after">{text.views.newHere} <Link href="/topics/cloning/understand">{text.views.understand}</Link>.</p>
    </>
  );
}
