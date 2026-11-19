/**
 * The diagrams the lessons and term entries use, carried over from biolibs-site's glossary.
 *
 * Wherever a picture shows something the libraries can work out (a complement, a cut site, where a
 * band runs) it is worked out by them when the page is built, so a diagram cannot disagree with the
 * code.
 *
 * `TermDiagram` picks the diagram for a term.
 */
import { type Band, bandsOf, gelById, ladderBands, ladderById } from "@biolibs/gel";
import { enzymes } from "@biolibs/restriction";
import { Seq } from "@biolibs/seq";
import { Arrow, CELL, Figure, Letters, Note } from "./primitives.tsx";

/** Both strands of a stretch of DNA, drawn from `x`. */
function Duplex({ dna, x, top = 46, bottom = 88, highlight }: { dna: string; x: number; top?: number; bottom?: number; highlight?: { column: number; rows: "both" | "top" } }) {
  const partner = new Seq(dna).complement().toString();
  const width = dna.length * CELL;
  return (
    <g>
      {highlight ? <rect x={x + highlight.column * CELL + 1} y={top - 17} width={CELL - 2} height={highlight.rows === "both" ? bottom - top + 23 : 23} rx={5} fill="var(--accent-soft)" stroke="var(--accent)" /> : null}
      <Arrow from={[x, top - 24]} to={[x + width, top - 24]} />
      <Arrow from={[x + width, bottom + 14]} to={[x, bottom + 14]} />
      {[...dna].map((_, i) => <line key={i} x1={x + i * CELL + CELL / 2} x2={x + i * CELL + CELL / 2} y1={top + 7} y2={bottom - 16} stroke="var(--line)" strokeWidth={2} />)}
      <Letters x={x} y={top} text={dna} />
      <Letters x={x} y={bottom} text={partner} />
      <Note x={x - 8} y={top - 1} anchor="end">5′</Note>
      <Note x={x + width + 8} y={top - 1}>3′</Note>
      <Note x={x - 8} y={bottom - 1} anchor="end">3′</Note>
      <Note x={x + width + 8} y={bottom - 1}>5′</Note>
    </g>
  );
}

/** Two strands of DNA as two rows of letters, with one base pair outlined if asked. */
export function DuplexDiagram({ highlight }: { highlight?: "pair" }) {
  const dna = "ATGGCCATTGTA";
  return (
    <Figure width={dna.length * CELL + 96} height={118}
            description={highlight === "pair"
              ? "Double-stranded DNA drawn as two rows of letters. One column is outlined: a G on the top strand paired with a C on the bottom strand."
              : "Double-stranded DNA drawn as two rows of letters. The top strand runs left to right and the bottom strand right to left."}
            caption={highlight === "pair"
              ? "Two strands, side by side. A always sits opposite T, and G opposite C. One base pair is outlined, and this stretch is 12 base pairs long."
              : "The arrows show the direction each strand is read in. The two strands point opposite ways."}>
      <Duplex dna={dna} x={48} highlight={highlight === "pair" ? { column: 3, rows: "both" } : undefined} />
    </Figure>
  );
}

/** A plasmid: a circle with the things a laboratory plasmid carries marked on it. */
export function PlasmidDiagram() {
  const cx = 230, cy = 122, r = 76;
  const at = (degrees: number, radius: number): [number, number] => { const a = (degrees * Math.PI) / 180; return [cx + radius * Math.sin(a), cy - radius * Math.cos(a)]; };
  const arc = (from: number, to: number) => { const [x1, y1] = at(from, r); const [x2, y2] = at(to, r); return `M${x1},${y1} A${r},${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2},${y2}`; };
  const features = [
    { from: 28, to: 112, color: "var(--accent)", label: "your gene" },
    { from: 150, to: 232, color: "var(--base-c)", label: "resistance gene" },
    { from: 268, to: 304, color: "var(--base-g)", label: "origin of replication" },
  ];
  return (
    <Figure width={460} height={244}
            description="A circle standing for a plasmid. Three coloured arcs on it mark the inserted gene, a resistance gene and the origin of replication. A tick at the top marks position 1."
            caption="A plasmid is a circle, so it has no ends. Position 1 is wherever the file says it is.">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--muted)" strokeWidth={2} />
      {features.map((f) => {
        const middle = (f.from + f.to) / 2, [lx, ly] = at(middle, r + 20), side = Math.sin((middle * Math.PI) / 180);
        return (
          <g key={f.label}>
            <path d={arc(f.from, f.to)} fill="none" stroke={f.color} strokeWidth={12} strokeLinecap="butt" />
            <Note x={lx} y={ly + 4} anchor={side > 0.3 ? "start" : side < -0.3 ? "end" : "middle"}>{f.label}</Note>
          </g>
        );
      })}
      <line x1={cx} x2={cx} y1={cy - r - 9} y2={cy - r + 9} stroke="var(--ink)" strokeWidth={2} />
      <Note x={cx} y={cy - r - 16} anchor="middle" mono>position 1</Note>
    </Figure>
  );
}

/** One enzyme's site before and after the cut, with the ends it leaves. */
export function CutDiagram({ enzyme: name }: { enzyme: string }) {
  const enzyme = enzymes[name];
  const pattern = enzyme.elucidate();     // "G^AATT_C": ^ is the top-strand cut, _ the bottom
  const flank = 3;
  const dna = `ACT${enzyme.site}GCA`;
  const partner = new Seq(dna).complement().toString();
  const topCut = flank + Math.max(0, pattern.replace("_", "").indexOf("^"));
  const bottomCut = flank + Math.max(0, pattern.replace("^", "").indexOf("_"));
  const overhang = Math.abs(topCut - bottomCut);
  const x = 48, gap = 36, width = dna.length * CELL;
  const ends = (top: number, bottom: number, right: number) => (
    <>
      <Note x={x - 8} y={top - 1} anchor="end">5′</Note><Note x={x - 8} y={bottom - 1} anchor="end">3′</Note>
      <Note x={right + 8} y={top - 1}>3′</Note><Note x={right + 8} y={bottom - 1}>5′</Note>
    </>
  );
  const ending = overhang ? `a ${overhang}-base overhang, ${enzyme.ovhgseq ?? ""}` : "blunt ends with no overhang";
  return (
    <Figure width={x * 2 + width + gap} height={212}
            description={`${name} recognises ${enzyme.site}. Before the cut, the two strands are intact. After it, the DNA is in two pieces with ${ending}.`}
            caption={overhang
              ? `${name} recognises ${enzyme.site} and cuts the two strands ${overhang} letters apart, leaving sticky ends with the overhang ${enzyme.ovhgseq}.`
              : `${name} recognises ${enzyme.site} and cuts both strands at the same place, leaving blunt ends.`}>
      <Note x={12} y={14} bold fill="var(--ink)">Before</Note>
      <rect x={x + flank * CELL} y={24} width={enzyme.site.length * CELL} height={62} rx={6} fill="var(--sunken)" />
      <Note x={x + (flank + enzyme.site.length / 2) * CELL} y={14} anchor="middle">the word it looks for</Note>
      <Letters x={x} y={46} text={dna} opacity={(i) => (i < flank || i >= flank + enzyme.site.length ? 0.4 : 1)} />
      <Letters x={x} y={78} text={partner} opacity={(i) => (i < flank || i >= flank + enzyme.site.length ? 0.4 : 1)} />
      {ends(46, 78, x + width)}
      <path d={`M${x + topCut * CELL},26 V57 H${x + bottomCut * CELL} V88`} fill="none" stroke="var(--base-t)" strokeWidth={2} strokeDasharray="4 3" />
      <Note x={12} y={122} bold fill="var(--ink)">After</Note>
      <Letters x={x} y={150} text={dna.slice(0, topCut)} />
      <Letters x={x} y={182} text={partner.slice(0, bottomCut)} />
      <Letters x={x + topCut * CELL + gap} y={150} text={dna.slice(topCut)} />
      <Letters x={x + bottomCut * CELL + gap} y={182} text={partner.slice(bottomCut)} />
      {ends(150, 182, x + width + gap)}
      <Note x={x + (width + gap) / 2} y={206} anchor="middle" fill="var(--accent)">{overhang ? `sticky ends: ${ending}` : ending}</Note>
    </Figure>
  );
}

/** A gel with a ladder, an uncut sample and a cut one. */
export function GelDiagram() {
  const gel = gelById("1.0");
  const ladder = ladderBands(ladderById("1kb").sizes, gel);
  const lanes = [{ label: "Uncut", bands: bandsOf([3000], gel) }, { label: "Cut", bands: bandsOf([1850, 835, 315], gel) }];
  const top = 44, bottom = 226;
  const y = (band: Band) => top + band.position * (bottom - top);
  // Label a ladder band only if it sits clear of the last one labelled.
  const labelled = ladder.reduce<{ last: number; sizes: Set<number> }>((acc, band) => (y(band) - acc.last >= 11 ? { last: y(band), sizes: acc.sizes.add(band.size) } : acc), { last: -Infinity, sizes: new Set() }).sizes;
  const grey = "#8f979f";
  return (
    <Figure width={320} height={244}
            description="A gel with three lanes: a ladder of known sizes, an uncut sample with one band at 3,000 base pairs, and a cut sample with bands at 1,850, 835 and 315 base pairs. Smaller pieces are further down."
            caption="DNA is loaded at the top and pulled towards the bottom. The uncut lane has one large band; cutting it gives three smaller ones, which run further. The ladder on the left is the ruler.">
      <rect width={320} height={244} rx={8} fill="#12161a" />
      <Note x={14} y={top + 4} fill={grey} size={14} bold>−</Note>
      <Note x={14} y={bottom + 4} fill={grey} size={14} bold>+</Note>
      <Arrow from={[18, top + 16]} to={[18, bottom - 14]} color={grey} />
      {["Ladder", ...lanes.map((lane) => lane.label)].map((label, i) => (
        <g key={label}>
          <Note x={103 + i * 70} y={16} anchor="middle" fill={grey} size={10} mono>{label}</Note>
          <rect x={80 + i * 70} y={24} width={46} height={7} rx={1.5} fill="#05070a" stroke="#2c343c" />
        </g>
      ))}
      {ladder.map((band) => (
        <g key={band.size}>
          <rect x={82} y={y(band) - 1.25} width={42} height={2.5} rx={1} fill="#cfd6dc" opacity={0.75} />
          {labelled.has(band.size) ? <Note x={74} y={y(band) + 3} anchor="end" fill={grey} size={9} mono>{band.size.toLocaleString("en-US")}</Note> : null}
        </g>
      ))}
      {lanes.map((lane, i) => lane.bands.map((band) => (
        <g key={`${lane.label}${band.size}`}>
          <rect x={152 + i * 70} y={y(band) - 2} width={42} height={4} rx={1.5} fill="#f6f1df" opacity={0.5 + 0.5 * band.intensity} />
          {i === lanes.length - 1 ? <Note x={270} y={y(band) + 3} fill="#f6f1df" size={9} mono>{band.size.toLocaleString("en-US")}</Note> : null}
        </g>
      )))}
    </Figure>
  );
}

/** How many pieces a cut gives: a loop and a line, each cut twice. */
export function PiecesDiagram() {
  const cut = "var(--base-t)";
  const tick = (x: number, y: number, vertical = true) => <line x1={vertical ? x : x - 9} x2={vertical ? x : x + 9} y1={vertical ? y - 9 : y} y2={vertical ? y + 9 : y} stroke={cut} strokeWidth={2.5} strokeLinecap="round" />;
  return (
    <Figure width={460} height={176}
            description="On the left, a loop of DNA cut in two places falls into two pieces. On the right, a line of DNA cut in two places falls into three pieces."
            caption="Two cuts in a loop give two pieces. Two cuts in a line give three, because a line already has two ends.">
      <Note x={110} y={16} anchor="middle" bold fill="var(--ink)">A loop, cut twice</Note>
      <circle cx={62} cy={84} r={36} fill="none" stroke="var(--muted)" strokeWidth={2.5} />
      {tick(62, 48)}{tick(62, 120)}
      <Arrow from={[108, 84]} to={[128, 84]} />
      <path d="M152,50 A36,36 0 0 0 152,118" fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" />
      <path d="M176,50 A36,36 0 0 1 176,118" fill="none" stroke="var(--base-c)" strokeWidth={2.5} strokeLinecap="round" />
      <Note x={164} y={146} anchor="middle" mono>2 pieces</Note>
      <line x1={230} x2={230} y1={30} y2={150} stroke="var(--line)" />
      <Note x={346} y={16} anchor="middle" bold fill="var(--ink)">A line, cut twice</Note>
      <line x1={256} x2={436} y1={62} y2={62} stroke="var(--muted)" strokeWidth={2.5} strokeLinecap="round" />
      {tick(316, 62)}{tick(386, 62)}
      <Arrow from={[346, 78]} to={[346, 94]} />
      <line x1={256} x2={308} y1={112} y2={112} stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={324} x2={378} y1={112} y2={112} stroke="var(--base-c)" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={394} x2={436} y1={112} y2={112} stroke="var(--base-g)" strokeWidth={2.5} strokeLinecap="round" />
      <Note x={346} y={146} anchor="middle" mono>3 pieces</Note>
    </Figure>
  );
}

/** The figures a lesson can ask for, by name. */
export type FigureName = "dna" | "cut" | "cut-blunt" | "pieces" | "plasmid" | "gel";

/** @param props.name - Which figure. @returns The drawing. */
export function LessonFigure({ name }: { name: FigureName }) {
  switch (name) {
    case "dna": return <DuplexDiagram highlight="pair" />;
    case "cut": return <CutDiagram enzyme="EcoRI" />;
    case "cut-blunt": return <CutDiagram enzyme="SmaI" />;
    case "pieces": return <PiecesDiagram />;
    case "plasmid": return <PlasmidDiagram />;
    case "gel": return <GelDiagram />;
  }
}

/** The figure that goes with a term, if it has one. */
export function TermDiagram({ slug }: { slug: string }) {
  switch (slug) {
    case "base-pair": return <DuplexDiagram highlight="pair" />;
    case "restriction-enzyme": case "sticky-end": return <CutDiagram enzyme="EcoRI" />;
    case "blunt-end": return <CutDiagram enzyme="SmaI" />;
    case "plasmid": return <PlasmidDiagram />;
    case "gel-electrophoresis": return <GelDiagram />;
    default: return null;
  }
}
