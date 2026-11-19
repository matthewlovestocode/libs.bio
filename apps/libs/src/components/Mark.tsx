/**
 * The libs.bio mark: a lower-case b traced inside a DNA ladder.
 *
 * Nothing is added outside the ladder. The b is its whole left rail, the lower part of its right
 * rail and the two rungs that close the bowl. The rest of the ladder is the same colour, faintly,
 * and the rung inside the bowl is the verified one.
 *
 * This is the sketch agreed in `design/mark-b-within-ladder.html` (version D). The final geometry
 * is still to be drawn properly.
 */

/** The box the mark is drawn in, as an SVG `viewBox`. */
export const MARK_BOX = "64 16 72 156";

/**
 * @param props.title - What to call the mark for somebody who cannot see it. Left out, the mark is
 *   decoration and is hidden from them.
 * @returns The mark as an SVG, sized by its container.
 */
export function Mark({ title }: { title?: string }) {
  return (
    <svg viewBox={MARK_BOX} fill="none" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round"
         role={title === undefined ? undefined : "img"} aria-hidden={title === undefined ? true : undefined}>
      {title === undefined ? null : <title>{title}</title>}
      <path d="M124 28V102M76 44H124M76 73H124" stroke="var(--bionet-yours)" opacity={0.28} />
      <path d="M76 131H124" stroke="var(--bionet-good)" />
      <path d="M76 28V160H124V102H76" stroke="var(--bionet-yours)" />
    </svg>
  );
}
