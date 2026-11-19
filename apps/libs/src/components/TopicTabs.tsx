"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { messages } from "@/messages/index.ts";

/** The four views every topic has, in the order they are shown. */
const VIEWS = ["do", "code", "understand", "read"] as const;

/**
 * The tabs of a topic. Each view is a page of its own, so a lesson or a glossary entry can link
 * straight to one, and the tabs work with scripting off.
 *
 * @param props.base - The topic's address, like `/topics/digests`. The Do view lives there.
 */
export function TopicTabs({ base }: { base: string }) {
  const text = messages();
  const here = (usePathname() ?? base).replace(/\/$/, "");
  return (
    <nav className="views" aria-label={text.views.label}>
      {VIEWS.map((view) => {
        const href = view === "do" ? base : `${base}/${view}`;
        const on = here === href;
        return <Link key={view} href={href} className={on ? "on" : undefined} aria-current={on ? "page" : undefined}>{text.views[view]}</Link>;
      })}
    </nav>
  );
}
