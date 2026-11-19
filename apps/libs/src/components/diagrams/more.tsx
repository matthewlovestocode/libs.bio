/**
 * Diagrams for the laboratory, comparison and structure terms added after the first set. Schematic
 * drawings, except the substitution scores, which are BLOSUM62 values checked against the matrix
 * that `@biolibs/align` ships.
 */
import { Arrow, FeatureArrow, Figure, Letters, MONO, Note, type FigureOptions } from "./primitives";

// --- At the bench ---------------------------------------------------------------------------------

export function SequencingDiagram(options: FigureOptions) {
  // Each row holds reads that do not overlap one another; reads in different rows do.
  const rows = [
    [30, 178, 336],
    [96, 250, 392],
    [140, 300],
    [56, 214, 372],
  ];
  const readWidth = 108;
  return (
    <Figure
      width={520}
      height={168}
      description="A long bar stands for the DNA being sequenced. Beneath it are eleven shorter bars, the reads, staggered so that each overlaps its neighbours and together they cover the whole length."
      caption="The DNA is read as many short, overlapping pieces called reads. Because they overlap, software can work out how they fit together and rebuild the original."
      {...options}
    >
      <Note x={30} y={16} bold fill="var(--ink)">The DNA being sequenced</Note>
      <rect x={30} y={24} width={470} height={10} rx={5} fill="var(--muted)" />
      <Note x={30} y={58} bold fill="var(--ink)">Reads</Note>
      {rows.map((starts, r) =>
        starts.map((x) => (
          <rect key={`${r}-${x}`} x={x} y={66 + r * 16} width={Math.min(readWidth, 500 - x)} height={8} rx={4} fill="var(--accent)" opacity={0.9} />
        )),
      )}
      <Note x={30} y={152}>every position is covered by several reads</Note>
    </Figure>
  );
}

/** A point on a circle, with 0° at the top and angles increasing clockwise. */
const onCircle = (cx: number, cy: number, r: number, degrees: number): [number, number] => {
  const a = (degrees * Math.PI) / 180;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
};

function Arc({ cx, cy, r, from, to, color, width }: { cx: number; cy: number; r: number; from: number; to: number; color: string; width: number }) {
  const [x1, y1] = onCircle(cx, cy, r, from);
  const [x2, y2] = onCircle(cx, cy, r, to);
  return <path d={`M${x1},${y1} A${r},${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2},${y2}`} fill="none" stroke={color} strokeWidth={width} />;
}

export function VectorInsertDiagram(options: FigureOptions) {
  const r = 52;
  const cy = 104;
  return (
    <Figure
      width={520}
      height={190}
      description="On the left, a plasmid cut open, drawn as a circle with a gap at the top, and above the gap a short separate piece of DNA: the insert. An arrow points to the right, where the circle is closed with the insert now part of it."
      caption="The vector is cut open, the insert is joined into the gap and the circle closes again. The result is one plasmid carrying the new piece."
      {...options}
    >
      <Arc cx={120} cy={cy} r={r} from={22} to={338} color="var(--muted)" width={3} />
      <Arc cx={120} cy={cy} r={r} from={150} to={230} color="var(--base-c)" width={10} />
      <rect x={94} y={22} width={52} height={10} rx={2} fill="var(--accent)" />
      <Note x={120} y={14} anchor="middle" bold fill="var(--accent)">insert</Note>
      <Note x={120} y={108} anchor="middle" bold fill="var(--ink)">vector</Note>
      <Note x={120} y={184} anchor="middle">cut open</Note>

      <Arrow from={[222, cy]} to={[296, cy]} width={2} />
      <Note x={259} y={cy - 10} anchor="middle">joined</Note>

      <circle cx={400} cy={cy} r={r} fill="none" stroke="var(--muted)" strokeWidth={3} />
      <Arc cx={400} cy={cy} r={r} from={-22} to={22} color="var(--accent)" width={10} />
      <Arc cx={400} cy={cy} r={r} from={150} to={230} color="var(--base-c)" width={10} />
      <Note x={400} y={34} anchor="middle" bold fill="var(--accent)">insert</Note>
      <Note x={400} y={184} anchor="middle">resistance gene</Note>
      <Note x={400} y={108} anchor="middle" bold fill="var(--ink)">plasmid</Note>
    </Figure>
  );
}

export function TransformationDiagram(options: FigureOptions) {
  const bacteria = [
    { x: 24, y: 28, plasmid: false },
    { x: 104, y: 20, plasmid: true },
    { x: 60, y: 66, plasmid: false },
    { x: 140, y: 62, plasmid: false },
    { x: 20, y: 104, plasmid: true },
    { x: 104, y: 106, plasmid: false },
  ];
  const colonies: [number, number][] = [
    [392, 60],
    [436, 84],
    [404, 112],
    [372, 96],
    [448, 50],
  ];
  return (
    <Figure
      width={540}
      height={196}
      description="On the left, six bacteria, two of which contain a small ring: the plasmid. An arrow labelled grow on antibiotic points to a round dish on the right with five dots on it, each a colony."
      caption="After transformation only a few cells hold the plasmid. Grown with an antibiotic, only those survive, and each multiplies into a colony of identical cells."
      {...options}
    >
      {bacteria.map((b) => (
        <g key={`${b.x},${b.y}`}>
          <rect x={b.x} y={b.y} width={58} height={24} rx={12} fill="none" stroke="var(--ink)" strokeWidth={1.5} />
          {b.plasmid && <circle cx={b.x + 29} cy={b.y + 12} r={6} fill="none" stroke="var(--base-c)" strokeWidth={2.5} />}
        </g>
      ))}
      <Note x={110} y={160} anchor="middle">after transformation: only two</Note>
      <Note x={110} y={174} anchor="middle">of these six took up the plasmid</Note>

      <Arrow from={[224, 80]} to={[300, 80]} width={2} />
      <Note x={262} y={68} anchor="middle" bold fill="var(--ink)">grow on</Note>
      <Note x={262} y={100} anchor="middle" bold fill="var(--ink)">antibiotic</Note>

      <circle cx={410} cy={80} r={64} fill="var(--sunken)" stroke="var(--ink)" strokeWidth={1.5} />
      {colonies.map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r={6} fill="var(--base-c)" />
      ))}
      <Note x={410} y={166} anchor="middle">only cells with the plasmid grow;</Note>
      <Note x={410} y={180} anchor="middle">each spot is one colony</Note>
    </Figure>
  );
}

export function GibsonDiagram(options: FigureOptions) {
  const bar = (x: number, y: number, width: number, color: string) => <rect x={x} y={y} width={width} height={14} fill={color} />;
  return (
    <Figure
      width={520}
      height={172}
      description="Two DNA fragments, A and B. The last part of A and the first part of B are the same colour, showing that their sequences are identical. An arrow points down to a single molecule in which A and B are joined through that shared stretch."
      caption="The end of one fragment matches the start of the next. In the reaction the matching ends find each other and the fragments are joined into one molecule, with the overlap appearing once."
      {...options}
    >
      <Note x={110} y={16} anchor="middle" bold fill="var(--ink)">fragment A</Note>
      {bar(30, 24, 160, "var(--accent)")}
      {bar(190, 24, 40, "var(--base-g)")}
      <Note x={410} y={16} anchor="middle" bold fill="var(--ink)">fragment B</Note>
      {bar(290, 24, 40, "var(--base-g)")}
      {bar(330, 24, 160, "var(--base-c)")}
      <path d="M210,42 V56 H310 V42" fill="none" stroke="var(--muted)" />
      <Note x={260} y={72} anchor="middle">identical ends, 20 to 40 bases</Note>

      <Arrow from={[260, 82]} to={[260, 106]} />
      <Note x={270} y={99}>one reaction</Note>

      {bar(80, 116, 160, "var(--accent)")}
      {bar(240, 116, 40, "var(--base-g)")}
      {bar(280, 116, 160, "var(--base-c)")}
      <Note x={260} y={156} anchor="middle" bold fill="var(--ink)">one molecule, joined at the overlap</Note>
    </Figure>
  );
}

// --- Comparing sequences --------------------------------------------------------------------------

export function HomologyDiagram(options: FigureOptions) {
  const cell = 16;
  const ancestor = "ATGGCCATTGTA";
  const descendants = [
    { name: "Species A", text: "ATGGCCATCGTA", x: 30 },
    { name: "Species B", text: "ATGGCTATTGTA", x: 278 },
  ];
  const width = ancestor.length * cell;
  const top = (500 - width) / 2;
  return (
    <Figure
      width={500}
      height={160}
      description={`An ancestral gene, ${ancestor}, at the top, with a line down to each of two descendants. Species A has ${descendants[0].text} and species B has ${descendants[1].text}; each differs from the ancestor at one circled base.`}
      caption="Both sequences are copies of one ancestral gene, and each has picked up a change since. They are similar because they share that ancestor, which is what homologous means."
      {...options}
    >
      <Note x={250} y={14} anchor="middle" bold fill="var(--ink)">Ancestral gene</Note>
      <Letters x={top} y={36} text={ancestor} cell={cell} size={13} />
      <path d={`M250,46 L${descendants[0].x + width / 2},98 M250,46 L${descendants[1].x + width / 2},98`} fill="none" stroke="var(--muted)" strokeWidth={1.5} />
      <Note x={250} y={84} anchor="middle" size={10}>time</Note>
      {descendants.map((d) => (
        <g key={d.name}>
          {[...d.text].map((base, i) => base !== ancestor[i] && <circle key={i} cx={d.x + i * cell + cell / 2} cy={115} r={9} fill="var(--accent-soft)" stroke="var(--accent)" />)}
          <Letters x={d.x} y={120} text={d.text} cell={cell} size={13} />
          <Note x={d.x + width / 2} y={146} anchor="middle" bold fill="var(--ink)">{d.name}</Note>
        </g>
      ))}
    </Figure>
  );
}

/** BLOSUM62 scores for the amino acids these diagrams use, in the order of `MATRIX_LETTERS`. */
const MATRIX_LETTERS = ["L", "I", "K", "R", "D", "E"];
const BLOSUM62 = [
  [4, 2, -2, -2, -4, -3],
  [2, 4, -3, -3, -3, -3],
  [-2, -3, 5, 2, -1, 1],
  [-2, -3, 2, 5, -2, 0],
  [-4, -3, -1, -2, 6, 2],
  [-3, -3, 1, 0, 2, 5],
];

export function IdentityDiagram(options: FigureOptions) {
  // Each column is [letter in sequence 1, letter in sequence 2, BLOSUM62 score of the pair].
  const columns: [string, string, number][] = [
    ["M", "M", 5],
    ["K", "R", 2],
    ["V", "V", 4],
    ["L", "I", 2],
    ["D", "E", 2],
    ["S", "S", 4],
    ["A", "P", -1],
    ["G", "G", 6],
  ];
  const kind = ([a, b, score]: [string, string, number]) => (a === b ? "identical" : score > 0 ? "similar" : "different");
  const identical = columns.filter((c) => kind(c) === "identical").length;
  const similar = identical + columns.filter((c) => kind(c) === "similar").length;
  const percent = (n: number) => `${Math.round((n / columns.length) * 100)}%`;
  const cell = 30;
  const x = 130;
  const letter = (text: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontFamily={MONO} fontSize={16} fontWeight={600} fill="var(--ink)">{text}</text>
  );
  return (
    <Figure
      width={x + columns.length * cell + 30}
      height={176}
      description={`Two protein sequences of ${columns.length} amino acids aligned. ${identical} columns hold the same amino acid in both, ${similar - identical} hold two amino acids of similar character, and ${columns.length - similar} holds two unlike ones. Identity is ${percent(identical)} and similarity is ${percent(similar)}.`}
      caption={`Identity counts only exact matches: ${identical} of ${columns.length}, or ${percent(identical)}. Similarity also counts the near matches: ${similar} of ${columns.length}, or ${percent(similar)}.`}
      {...options}
    >
      <Note x={12} y={39} size={12} bold fill="var(--ink)">Protein 1</Note>
      <Note x={12} y={87} size={12} bold fill="var(--ink)">Protein 2</Note>
      {columns.map((column, i) => {
        const cx = x + i * cell + cell / 2;
        const k = kind(column);
        return (
          <g key={i}>
            {k === "different" && <rect x={cx - cell / 2 + 2} y={20} width={cell - 4} height={76} rx={5} fill="var(--sunken)" />}
            {letter(column[0], cx, 40)}
            {letter(column[1], cx, 88)}
            {k === "identical" && <line x1={cx} x2={cx} y1={50} y2={70} stroke="var(--accent)" strokeWidth={2} />}
            {k === "similar" && (
              <>
                <circle cx={cx} cy={55} r={2.5} fill="var(--base-g)" />
                <circle cx={cx} cy={65} r={2.5} fill="var(--base-g)" />
              </>
            )}
          </g>
        );
      })}
      <line x1={x} x2={x} y1={118} y2={130} stroke="var(--accent)" strokeWidth={2} />
      <Note x={x + 8} y={128}>identical</Note>
      <circle cx={x + 76} cy={121} r={2.5} fill="var(--base-g)" />
      <circle cx={x + 76} cy={129} r={2.5} fill="var(--base-g)" />
      <Note x={x + 84} y={128}>similar</Note>
      <Note x={x} y={160} bold fill="var(--ink)">identity {percent(identical)}</Note>
      <Note x={x + 110} y={160} bold fill="var(--ink)">similarity {percent(similar)}</Note>
    </Figure>
  );
}

export function MatrixDiagram(options: FigureOptions) {
  const cell = 42;
  const x = 60;
  const y = 44;
  const groups = ["oily", "oily", "positive charge", "positive charge", "negative charge", "negative charge"];
  const fill = (score: number) => (score > 0 ? "var(--accent)" : "var(--base-t)");
  const opacity = (score: number) => (score === 0 ? 0 : 0.12 + (Math.abs(score) / 6) * 0.5);
  return (
    <Figure
      width={x + cell * MATRIX_LETTERS.length + 130}
      height={y + cell * MATRIX_LETTERS.length + 34}
      description={`Part of the BLOSUM62 substitution matrix, for the amino acids ${MATRIX_LETTERS.join(", ")}. Every amino acid scores highest against itself. Pairs of the same character, such as L with I, K with R and D with E, score +2. Pairs of unlike character score below zero, down to -4 for L with D.`}
      caption="Part of BLOSUM62. Swapping an amino acid for one of the same character scores above zero (green); swapping it for an unlike one scores below (red). The full table covers all 20 amino acids."
      {...options}
    >
      <Note x={x} y={16} bold fill="var(--ink)">Score for aligning one amino acid with another</Note>
      {MATRIX_LETTERS.map((letter, i) => (
        <g key={letter}>
          <Note x={x + i * cell + cell / 2} y={y - 8} anchor="middle" mono bold size={13} fill="var(--ink)">{letter}</Note>
          <Note x={x - 12} y={y + i * cell + cell / 2 + 5} anchor="end" mono bold size={13} fill="var(--ink)">{letter}</Note>
          <Note x={x + cell * MATRIX_LETTERS.length + 10} y={y + i * cell + cell / 2 + 4} size={10}>{groups[i]}</Note>
          {BLOSUM62[i].map((score, j) => (
            <g key={j}>
              <rect x={x + j * cell} y={y + i * cell} width={cell} height={cell} fill={fill(score)} opacity={opacity(score)} />
              <rect x={x + j * cell} y={y + i * cell} width={cell} height={cell} fill="none" stroke="var(--line)" />
              <Note x={x + j * cell + cell / 2} y={y + i * cell + cell / 2 + 4} anchor="middle" mono fill="var(--ink)" size={12}>
                {score > 0 ? `+${score}` : score}
              </Note>
            </g>
          ))}
        </g>
      ))}
      <Note x={x} y={y + cell * MATRIX_LETTERS.length + 22} size={10}>L leucine · I isoleucine · K lysine · R arginine · D aspartate · E glutamate</Note>
    </Figure>
  );
}

// --- Structure ------------------------------------------------------------------------------------

export function SecondaryStructureDiagram(options: FigureOptions) {
  const strands = [
    { y: 46, direction: "right" as const },
    { y: 80, direction: "left" as const },
    { y: 114, direction: "right" as const },
  ];
  return (
    <Figure
      width={540}
      height={176}
      description="Two shapes. On the left an alpha helix, drawn as a coil like a spring. On the right a beta sheet, drawn as three arrows lying side by side and pointing in alternating directions, joined by short dashed lines."
      caption="The two regular shapes a protein chain makes. A helix is a coil; a sheet is several stretches of chain lying side by side. The dashed lines are the weak bonds that hold the strands together."
      {...options}
    >
      <Note x={24} y={18} size={12} bold fill="var(--ink)">Alpha helix</Note>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ellipse key={i} cx={46 + i * 24} cy={88} rx={15} ry={36} fill="none" stroke="var(--accent)" strokeWidth={4} />
      ))}
      <Note x={118} y={150} anchor="middle">the chain coils like a spring</Note>

      <Note x={296} y={18} size={12} bold fill="var(--ink)">Beta sheet</Note>
      {[0, 1].map((gap) =>
        [0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`${gap}-${i}`} x1={318 + i * 32} x2={318 + i * 32} y1={strands[gap].y + 18} y2={strands[gap + 1].y - 2} stroke="var(--muted)" strokeDasharray="3 3" />
        )),
      )}
      {strands.map((strand) => (
        <FeatureArrow key={strand.y} x={296} y={strand.y} width={210} direction={strand.direction} color="var(--base-c)" />
      ))}
      <Note x={401} y={150} anchor="middle">strands lie side by side</Note>
    </Figure>
  );
}

export function RmsdDiagram(options: FigureOptions) {
  const first: [number, number][] = Array.from({ length: 9 }, (_, i) => [44 + i * 52, 78 + 30 * Math.sin(i * 0.8)]);
  const offsets = [
    [6, -12],
    [-5, 9],
    [9, 7],
    [-7, -9],
    [4, 13],
    [11, -7],
    [-9, -11],
    [7, 9],
    [-5, -13],
  ];
  const second: [number, number][] = first.map(([x, y], i) => [x + offsets[i][0], y + offsets[i][1]]);
  const chain = (points: [number, number][], color: string) => (
    <g>
      <polyline points={points.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={2} />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={color} />
      ))}
    </g>
  );
  return (
    <Figure
      width={520}
      height={176}
      description="Two chains of nine points each, laid over one another so that they nearly coincide. A short line joins each point on one chain to the matching point on the other."
      caption="Two structures laid one over the other. Each short red line is the distance between a pair of matching atoms, and the RMSD is a kind of average of those distances."
      {...options}
    >
      {first.map(([x, y], i) => (
        <line key={i} x1={x} y1={y} x2={second[i][0]} y2={second[i][1]} stroke="var(--base-t)" strokeWidth={2} />
      ))}
      {chain(first, "var(--accent)")}
      {chain(second, "var(--base-c)")}
      <circle cx={48} cy={156} r={5} fill="var(--accent)" />
      <Note x={60} y={160}>structure 1</Note>
      <circle cx={148} cy={156} r={5} fill="var(--base-c)" />
      <Note x={160} y={160}>structure 2</Note>
      <line x1={244} x2={262} y1={156} y2={156} stroke="var(--base-t)" strokeWidth={2} />
      <Note x={270} y={160}>distance between matching atoms</Note>
    </Figure>
  );
}
