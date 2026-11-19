"use client";

import { useRef } from "react";
import { Bases } from "./Bases.tsx";

/** Past this length the colouring is left off. It would be tens of thousands of pieces to redraw on every keystroke. */
const MOST_COLOURED = 30_000;

/**
 * A box to type or paste a sequence into, with the bases coloured as they are typed.
 *
 * A text box cannot colour its own letters. So the coloured sequence is drawn underneath, and the
 * box itself sits on top with its letters made see-through: what is typed lands in the box, and what
 * is seen is the drawing below. The two share a font, a width and a scroll position, so they stay in
 * step. The caret and the selection are the box's own.
 *
 * @param props.value - What is in the box.
 * @param props.onChange - Called with the new contents.
 * @param props.id - The box's id, for its label.
 */
export function SequenceInput({ value, onChange, id }: { value: string; onChange: (value: string) => void; id: string }) {
  const under = useRef<HTMLPreElement>(null);
  const coloured = value.length <= MOST_COLOURED;
  return (
    <div className={`sequence-box${coloured ? " coloured" : ""}`}>
      {coloured ? <pre ref={under} className="in sequence under" aria-hidden="true"><Bases text={value.toUpperCase()} />{"\n"}</pre> : null}
      <textarea id={id} className="in sequence" value={value} rows={4} spellCheck={false} autoCapitalize="characters" autoCorrect="off"
                onChange={(event) => onChange(event.target.value)}
                onScroll={(event) => { if (under.current !== null) under.current.scrollTop = event.currentTarget.scrollTop; }} />
    </div>
  );
}
