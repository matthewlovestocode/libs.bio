/**
 * The Bionet mark, drawn from the geometry in `@biolibs/bionet-theme`.
 *
 * Nothing about the mark is written down here. The paths, the box and the line weight all come from
 * the theme package, and the colours are its variables, so this follows the theme by itself.
 */
import { MARK } from "@biolibs/bionet-theme";

/**
 * @param props.title - What to call the mark for somebody who cannot see it. Left out, the mark is
 *   decoration and is hidden from them.
 * @returns The mark as an SVG, sized by its container.
 */
export function Mark({ title }: { title?: string }) {
  return (
    <svg viewBox={`0 0 ${MARK.width} ${MARK.height}`} fill="none" strokeWidth={MARK.strokeWidth} strokeLinecap="round"
         role={title === undefined ? undefined : "img"} aria-hidden={title === undefined ? true : undefined}>
      {title === undefined ? null : <title>{title}</title>}
      <g transform={`translate(${MARK.offsetX} 0)`}>
        <path d={MARK.yours} stroke="var(--bionet-yours)" />
        <path d={MARK.theirs} stroke="var(--bionet-theirs)" />
      </g>
    </svg>
  );
}
