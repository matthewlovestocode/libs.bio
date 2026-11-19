"use client";

import { useEffect, useState } from "react";
import { messages } from "@/messages/index.ts";

/**
 * A box that narrows the page to the exports whose names hold what is typed.
 *
 * The page is whole without it: every export is in the HTML, and this only hides the ones that do
 * not match. So it works as a plain page with scripting off, and a link to one export always lands.
 *
 * @param props.total - How many exports the page holds.
 */
export function ApiFilter({ total }: { total: number }) {
  const text = messages().api;
  const [wanted, setWanted] = useState("");
  const [shown, setShown] = useState(total);

  useEffect(() => {
    const want = wanted.trim().toLowerCase();
    let count = 0;
    for (const item of document.querySelectorAll<HTMLElement>("[data-api-item]")) {
      const match = want === "" || (item.dataset.apiItem ?? "").toLowerCase().includes(want);
      item.hidden = !match;
      if (match) count += 1;
    }
    for (const section of document.querySelectorAll<HTMLElement>("[data-api-kind]")) {
      section.hidden = section.querySelector("[data-api-item]:not([hidden])") === null;
    }
    setShown(count);
  }, [wanted]);

  return (
    <div className="api-filter">
      <input className="in" type="search" value={wanted} onChange={(event) => setWanted(event.target.value)} placeholder={text.filterPlaceholder} aria-label={text.filter} spellCheck={false} />
      <span className="quiet" aria-live="polite">{wanted.trim() === "" ? text.count(total) : text.matching(shown, total)}</span>
    </div>
  );
}
