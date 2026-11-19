import type { Status } from "@libsbio/shared";
import { messages } from "@/messages/index.ts";

/**
 * How settled a tool is, said plainly. People try whatever is on the page, so every tool says.
 *
 * @param props.status - The status, or `null` for something that is not built yet.
 */
export function StatusLabel({ status }: { status: Status | null }) {
  const text = messages();
  return <span className={`status status-${status ?? "none"}`}>{text.status[status ?? "none"]}</span>;
}
