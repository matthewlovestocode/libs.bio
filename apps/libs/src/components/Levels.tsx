"use client";

import { type ReactNode, useSyncExternalStore } from "react";
import { messages } from "@/messages/index.ts";

/** Where the reader's choice is kept, in their own browser. It goes nowhere else. */
const KEY = "libs.bio:level";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => { listeners.delete(callback); window.removeEventListener("storage", callback); };
}

/** One version of a lesson: who it is for, and the lesson itself, already drawn. */
export interface LevelPanel {
  id: string;
  label: string;
  hint: string;
  content: ReactNode;
}

/**
 * A lesson in more than one version, and the reader's pick of them.
 *
 * Every version is in the page as it arrives. This only shows one and hides the rest, and remembers
 * which the reader chose so the choice carries from topic to topic. The memory is the browser's own
 * storage: nothing is sent anywhere, and a private window that refuses storage simply forgets.
 *
 * @param props.panels - The versions, in order. The first is shown until the reader picks another.
 */
export function Levels({ panels }: { panels: LevelPanel[] }) {
  const text = messages().understand;
  const first = panels[0].id;
  const read = () => { try { const kept = localStorage.getItem(KEY); return panels.some((one) => one.id === kept) ? (kept as string) : first; } catch { return first; } };
  const chosen = useSyncExternalStore(subscribe, read, () => first);
  const choose = (id: string) => { try { localStorage.setItem(KEY, id); } catch { /* the choice then lasts for this page only */ } listeners.forEach((listener) => listener()); };

  return (
    <div>
      <div role="tablist" aria-label={text.pick} className="levels">
        {panels.map((panel) => (
          <button key={panel.id} type="button" role="tab" id={`level-${panel.id}`} aria-selected={chosen === panel.id} aria-controls={`lesson-${panel.id}`}
                  className={`level${chosen === panel.id ? " on" : ""}`} onClick={() => choose(panel.id)}>
            <span className="level-label">{panel.label}</span>
            <span className="level-hint">{panel.hint}</span>
          </button>
        ))}
      </div>
      {panels.map((panel) => (
        <div key={panel.id} role="tabpanel" id={`lesson-${panel.id}`} aria-labelledby={`level-${panel.id}`} hidden={chosen !== panel.id}>{panel.content}</div>
      ))}
    </div>
  );
}
