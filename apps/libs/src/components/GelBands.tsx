/**
 * What drifts behind the tools: the bands of a gel, far larger than the page, at low strength.
 *
 * It is background and not meant to be read. Bionet's own software does the same with a lab's
 * plasmid maps; this site's motif is the gel. The grid is drawn over it by the stage it sits in,
 * and it holds still for anybody who has asked their system for less motion.
 */
export function GelBands() {
  const lanes: [number, [number, number, boolean?][]][] = [
    [40, [[60, 26], [210, 18], [330, 34], [560, 16]]],
    [340, [[130, 30], [420, 22, true], [650, 18]]],
    [640, [[40, 18], [260, 36], [500, 20], [720, 26]]],
    [940, [[170, 24], [380, 16], [600, 32]]],
  ];
  return (
    <svg className="bands" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
      {lanes.flatMap(([x, bands]) => bands.map(([y, thick, verified]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={250} height={thick} rx={thick / 2} className={verified ? "verified" : undefined} />
      )))}
    </svg>
  );
}
