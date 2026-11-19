/**
 * The glossary's diagrams. Wherever a picture shows something the libraries can compute (a
 * complement, a translation, a cut site, where a band runs) it is computed by them when the page is
 * built, so a diagram cannot disagree with the code.
 *
 * `TermDiagram` picks the diagram for a glossary slug. Carried over whole from biolibs-site, with one
 * diagram and `LessonFigure` added at the end for this site's lessons.
 */
import { bandsOf, gelById, ladderBands, ladderById, type Band } from "@biolibs/gel";
import { enzymes } from "@biolibs/restriction";
import { Seq } from "@biolibs/seq";
import { gcFraction, seq3 } from "@biolibs/seqtools";
import {
  AminoAcidDiagram,
  CellDiagram,
  DnaRnaDiagram,
  EnzymeDiagram,
  GenomeSizeDiagram,
  NucleotideDiagram,
  PipelineDiagram,
  ProteinFoldDiagram,
  SplicingDiagram,
  UnitsDiagram,
  ZoomDiagram,
} from "./basics";
import {
  GibsonDiagram,
  HomologyDiagram,
  IdentityDiagram,
  MatrixDiagram,
  RmsdDiagram,
  SecondaryStructureDiagram,
  SequencingDiagram,
  TransformationDiagram,
  VectorInsertDiagram,
} from "./more";
import type { FigureName } from "@/lib/lesson.ts";
import { Arrow, CELL, FeatureArrow, Figure, Letters, MONO, Note, Pill, baseColor, type FigureOptions } from "./primitives";

const GENE = "ATGGCCATTGTAATGGGCCGCTGA";

/** Three-letter names for a protein string, with the stop symbol spelled out. */
function aminoNames(protein: string): string[] {
  return [...protein].map((letter) => (letter === "*" ? "stop" : seq3(letter)));
}

// --- Two strands ----------------------------------------------------------------------------------

/** Both strands of a duplex, drawn from `x`. Shared by several diagrams. */
function Duplex({
  dna,
  x,
  top = 46,
  bottom = 88,
  rungs = true,
  backbones = true,
  highlight,
}: {
  dna: string;
  x: number;
  top?: number;
  bottom?: number;
  rungs?: boolean;
  backbones?: boolean;
  highlight?: { column: number; rows: "both" | "top" };
}) {
  const partner = new Seq(dna).complement().toString();
  const width = dna.length * CELL;
  return (
    <g>
      {highlight && (
        <rect
          x={x + highlight.column * CELL + 1}
          y={top - 17}
          width={CELL - 2}
          height={highlight.rows === "both" ? bottom - top + 23 : 23}
          rx={5}
          fill="var(--accent-soft)"
          stroke="var(--accent)"
        />
      )}
      {backbones && (
        <>
          <Arrow from={[x, top - 24]} to={[x + width, top - 24]} />
          <Arrow from={[x + width, bottom + 14]} to={[x, bottom + 14]} />
        </>
      )}
      {rungs &&
        [...dna].map((_, i) => (
          <line key={i} x1={x + i * CELL + CELL / 2} x2={x + i * CELL + CELL / 2} y1={top + 7} y2={bottom - 16} stroke="var(--line)" strokeWidth={2} />
        ))}
      <Letters x={x} y={top} text={dna} />
      <Letters x={x} y={bottom} text={partner} />
      <Note x={x - 8} y={top - 1} anchor="end">5′</Note>
      <Note x={x + width + 8} y={top - 1}>3′</Note>
      <Note x={x - 8} y={bottom - 1} anchor="end">3′</Note>
      <Note x={x + width + 8} y={bottom - 1}>5′</Note>
    </g>
  );
}

export function DuplexDiagram({ highlight, ...options }: FigureOptions & { highlight?: "base" | "pair" }) {
  const dna = "ATGGCCATTGTA";
  const description =
    highlight === "base"
      ? "Double-stranded DNA drawn as two rows of letters. One letter in the top row is outlined: a single base."
      : highlight === "pair"
        ? "Double-stranded DNA drawn as two rows of letters. One column is outlined: a G on the top strand paired with a C on the bottom strand."
        : "Double-stranded DNA drawn as two rows of letters. The top strand runs 5′ to 3′ from left to right; the bottom strand runs 5′ to 3′ from right to left.";
  const caption =
    highlight === "base"
      ? "One base is outlined. A always sits opposite T, and G opposite C."
      : highlight === "pair"
        ? "One base pair is outlined. This stretch is 12 base pairs long."
        : "The arrows show each strand's 5′ to 3′ direction. The two strands point opposite ways.";
  return (
    <Figure width={dna.length * CELL + 96} height={118} description={description} caption={caption} {...options}>
      <Duplex dna={dna} x={48} highlight={highlight ? { column: 3, rows: highlight === "pair" ? "both" : "top" } : undefined} />
    </Figure>
  );
}

export function ReverseComplementDiagram(options: FigureOptions) {
  const dna = "ATGGCCATT";
  const seq = new Seq(dna);
  const rows = [
    { label: "Start", hint: "one strand", text: dna, left: "5′", right: "3′" },
    { label: "Complement", hint: "swap A↔T and C↔G", text: seq.complement().toString(), left: "3′", right: "5′" },
    { label: "Reverse complement", hint: "then read right to left", text: seq.reverseComplement().toString(), left: "5′", right: "3′" },
  ];
  const x = 176;
  return (
    <Figure
      width={x + dna.length * CELL + 40}
      height={136}
      description={`Three rows. The starting strand ${dna}; its complement ${rows[1].text}, which runs 3′ to 5′; and its reverse complement ${rows[2].text}, which is the complement written 5′ to 3′.`}
      caption="The complement is the partner strand as it sits beneath the original. The reverse complement is that same strand written in the conventional 5′ to 3′ direction."
      {...options}
    >
      {rows.map((row, i) => {
        const y = 30 + i * 42;
        return (
          <g key={row.label}>
            <Note x={12} y={y - 4} size={12} bold fill="var(--ink)">{row.label}</Note>
            <Note x={12} y={y + 10} size={10}>{row.hint}</Note>
            <Note x={x - 8} y={y - 1} anchor="end">{row.left}</Note>
            <Letters x={x} y={y} text={row.text} />
            <Note x={x + dna.length * CELL + 8} y={y - 1}>{row.right}</Note>
          </g>
        );
      })}
    </Figure>
  );
}

export function MeltingDiagram(options: FigureOptions) {
  const dna = "ATGGCC";
  return (
    <Figure
      width={480}
      height={132}
      description="On the left, two paired strands. An arrow labelled heat points to the right, where the same two strands have come apart."
      caption="Below the melting temperature the strands stay paired. Above it, they separate. G–C pairs hold more strongly than A–T pairs, so GC-rich DNA melts at a higher temperature."
      {...options}
    >
      <Duplex dna={dna} x={40} backbones={false} />
      <Note x={106} y={124} anchor="middle">below the melting temperature</Note>
      <Arrow from={[212, 62]} to={[266, 62]} color="var(--base-t)" width={2} />
      <Note x={239} y={52} anchor="middle" fill="var(--base-t)" bold>heat</Note>
      <Duplex dna={dna} x={312} top={34} bottom={100} rungs={false} backbones={false} />
      <Note x={378} y={124} anchor="middle">above it</Note>
    </Figure>
  );
}

export function GcDiagram(options: FigureOptions) {
  const cell = 20;
  const isGc = (base: string) => base === "G" || base === "C";
  const count = [...GENE].filter(isGc).length;
  const fraction = gcFraction(GENE);
  const width = GENE.length * cell;
  return (
    <Figure
      width={width + 32}
      height={98}
      description={`A sequence of ${GENE.length} bases with every G and C picked out. ${count} of the ${GENE.length} are G or C, a GC content of ${(fraction * 100).toFixed(0)}%.`}
      caption={`Count the G and C bases and divide by the length: ${count} of ${GENE.length}, or ${(fraction * 100).toFixed(0)}%.`}
      {...options}
    >
      {[...GENE].map((base, i) => isGc(base) && <rect key={i} x={16 + i * cell + 1} y={18} width={cell - 2} height={24} rx={4} fill="var(--accent-soft)" />)}
      <Letters x={16} y={36} text={GENE} cell={cell} size={14} opacity={(i) => (isGc(GENE[i]) ? 1 : 0.35)} />
      <rect x={16} y={56} width={width} height={10} rx={5} fill="var(--line)" />
      <rect x={16} y={56} width={width * fraction} height={10} rx={5} fill="var(--accent)" />
      <Note x={16} y={86}>G or C: {count} of {GENE.length}</Note>
      <Note x={16 + width} y={86} anchor="end" bold fill="var(--ink)">{(fraction * 100).toFixed(0)}%</Note>
    </Figure>
  );
}

// --- Reading a gene -------------------------------------------------------------------------------

const CODON_STEP = 60;

/** A row of boxed codons. Each box is centred on `x + i * CODON_STEP + 27`. */
function CodonRow({
  x,
  y,
  codons,
  changed,
  tone,
}: {
  x: number;
  y: number;
  codons: string[];
  changed?: (codon: number, base: number) => boolean;
  /** Outline colour for a codon that needs picking out, or "dim" to fade one that is not part of the point. */
  tone?: (codon: number) => string | undefined;
}) {
  return (
    <g>
      {codons.map((codon, i) => (
        <g key={i} opacity={tone?.(i) === "dim" ? 0.4 : 1}>
          <rect
            x={x + i * CODON_STEP}
            y={y - 17}
            width={54}
            height={25}
            rx={5}
            fill="none"
            stroke={tone?.(i) && tone(i) !== "dim" ? tone(i) : "var(--line)"}
            strokeWidth={tone?.(i) && tone(i) !== "dim" ? 2 : 1}
          />
          {[0, 1, 2].map((b) => changed?.(i, b) && <circle key={b} cx={x + i * CODON_STEP + 11 + b * 16} cy={y - 5} r={9} fill="var(--accent-soft)" stroke="var(--accent)" />)}
          <Letters x={x + i * CODON_STEP + 3} y={y} text={codon} cell={16} size={13} />
        </g>
      ))}
    </g>
  );
}

function AminoRow({ x, y, protein }: { x: number; y: number; protein: string }) {
  return (
    <g>
      {aminoNames(protein).map((name, i) => (
        <Pill key={i} x={x + i * CODON_STEP + 5} y={y - 16} width={44} text={name} />
      ))}
    </g>
  );
}

export function CodonDiagram(options: FigureOptions) {
  const codons = GENE.match(/.{3}/g) ?? [];
  const protein = new Seq(GENE).translate().toString();
  const x = 16;
  return (
    <Figure
      width={x * 2 + codons.length * CODON_STEP - 6}
      height={108}
      description={`The sequence ${GENE} divided into ${codons.length} codons of three bases. Under each codon is the amino acid it specifies: ${aminoNames(protein).join(", ")}.`}
      caption="Each box is one codon. ATG starts the protein and codes for methionine (Met); TGA is one of the three stop codons."
      {...options}
    >
      <CodonRow x={x} y={34} codons={codons} />
      {codons.map((_, i) => (
        <Arrow key={i} from={[x + i * CODON_STEP + 27, 46]} to={[x + i * CODON_STEP + 27, 64]} head={4} />
      ))}
      <AminoRow x={x} y={86} protein={protein} />
    </Figure>
  );
}

export function OrfDiagram(options: FigureOptions) {
  const codons = ["TTC", "ATG", "GCC", "ATT", "GTA", "GGC", "CGC", "TGA", "CCA"];
  const start = codons.indexOf("ATG");
  const protein = new Seq(codons.slice(start).join("")).translate({ toStop: true }).toString();
  const stop = start + protein.length;
  const x = 16;
  const left = x + start * CODON_STEP;
  const right = x + stop * CODON_STEP + 54;
  return (
    <Figure
      width={x * 2 + codons.length * CODON_STEP - 6}
      height={136}
      description={`Nine codons. The second, ATG, is marked start and the eighth, ${codons[stop]}, is marked stop. A bracket labelled open reading frame spans from the start codon to the stop codon. Under the codons between them are the amino acids ${aminoNames(protein).join(", ")}.`}
      caption="Translation begins at the start codon, ATG, and runs until the first stop codon. That stretch is an open reading frame. The stop codon adds no amino acid, and the codons either side are not translated."
      {...options}
    >
      <path d={`M${left},26 v-8 H${right} v8`} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
      <Note x={(left + right) / 2} y={12} anchor="middle" fill="var(--accent)" bold>open reading frame</Note>
      <CodonRow x={x} y={50} codons={codons} tone={(i) => (i === start ? "var(--accent)" : i === stop ? "var(--base-t)" : i < start || i > stop ? "dim" : undefined)} />
      <Note x={left + 27} y={76} anchor="middle" bold fill="var(--accent)">start</Note>
      <Note x={x + stop * CODON_STEP + 27} y={76} anchor="middle" bold fill="var(--base-t)">stop</Note>
      <AminoRow x={left} y={112} protein={protein} />
    </Figure>
  );
}

export function GeneticCodeDiagram(options: FigureOptions) {
  const dna = "ATGTGAATAAGA";
  const codons = dna.match(/.{3}/g) ?? [];
  const seq = new Seq(dna);
  const rows = [
    { label: "Standard code", hint: "table 1", protein: seq.translate({ table: 1 }).toString() },
    { label: "Vertebrate mitochondria", hint: "table 2", protein: seq.translate({ table: 2 }).toString() },
  ];
  const x = 170;
  return (
    <Figure
      width={x + codons.length * CODON_STEP + 10}
      height={150}
      description={`The codons ${codons.join(", ")} translated with two genetic codes. The standard code gives ${aminoNames(rows[0].protein).join(", ")}. The vertebrate mitochondrial code gives ${aminoNames(rows[1].protein).join(", ")}.`}
      caption="The same DNA read with two genetic codes. Three of these four codons mean something different inside a mitochondrion."
      {...options}
    >
      <Note x={12} y={32} size={12} bold fill="var(--ink)">DNA</Note>
      <CodonRow x={x} y={34} codons={codons} />
      {rows.map((row, i) => {
        const y = 86 + i * 44;
        return (
          <g key={row.label}>
            <Note x={12} y={y - 4} size={12} bold fill="var(--ink)">{row.label}</Note>
            <Note x={12} y={y + 10} size={10}>{row.hint}</Note>
            <AminoRow x={x} y={y} protein={row.protein} />
          </g>
        );
      })}
    </Figure>
  );
}

export function ReadingFrameDiagram(options: FigureOptions) {
  const dna = "ATGGCCATTGTAATGGGCC";
  const cell = 16;
  const x = 84;
  const frames = [0, 1, 2].map((offset) => {
    const count = Math.floor((dna.length - offset) / 3);
    return { offset, count, protein: new Seq(dna.slice(offset, offset + count * 3)).translate().toString() };
  });
  return (
    <Figure
      width={x + dna.length * cell + 16}
      height={180}
      description={`The sequence ${dna} read in three frames. ${frames.map((f) => `Starting at base ${f.offset + 1} it reads ${[...f.protein].map((p) => (p === "*" ? "stop" : p)).join(" ")}`).join(". ")}.`}
      caption="The same bases grouped three ways. Shifting the start by one base changes every codon, and here the second frame runs into a stop."
      {...options}
    >
      {frames.map((frame) => {
        const y = 32 + frame.offset * 56;
        const inFrame = (i: number) => i >= frame.offset && i < frame.offset + frame.count * 3;
        return (
          <g key={frame.offset}>
            <Note x={12} y={y - 1} size={12} bold fill="var(--ink)">Frame {frame.offset + 1}</Note>
            {[...frame.protein].map((amino, i) => {
              const left = x + (frame.offset + i * 3) * cell;
              return (
                <g key={i}>
                  <rect x={left + 1} y={y - 16} width={cell * 3 - 2} height={23} rx={4} fill={amino === "*" ? "var(--sunken)" : "none"} stroke="var(--line)" />
                  <text x={left + cell * 1.5} y={y + 24} textAnchor="middle" fontFamily={MONO} fontSize={12} fontWeight={600} fill={amino === "*" ? "var(--base-t)" : "var(--accent)"}>
                    {amino === "*" ? "stop" : amino}
                  </text>
                </g>
              );
            })}
            <Letters x={x} y={y} text={dna} cell={cell} size={13} opacity={(i) => (inFrame(i) ? 1 : 0.3)} />
          </g>
        );
      })}
    </Figure>
  );
}

export function CentralDogmaDiagram(options: FigureOptions) {
  const dna = "ATGGCCATTGTA";
  const seq = new Seq(dna);
  const rna = seq.transcribe().toString();
  const protein = seq.translate().toString();
  const x = 100;
  const mid = x + (dna.length * CELL) / 2;
  return (
    <Figure
      width={x + dna.length * CELL + 24}
      height={156}
      description={`Three rows joined by arrows. DNA ${dna} is transcribed into RNA ${rna}, in which U replaces T. The RNA is translated into the protein ${aminoNames(protein).join(", ")}.`}
      caption="Transcription copies DNA into RNA, with U in place of T. Translation reads the RNA three bases at a time into amino acids."
      {...options}
    >
      <Note x={12} y={32} size={12} bold fill="var(--ink)">DNA</Note>
      <Letters x={x} y={34} text={dna} />
      <Arrow from={[mid, 44]} to={[mid, 66]} />
      <Note x={mid + 10} y={59}>transcription</Note>
      <Note x={12} y={84} size={12} bold fill="var(--ink)">RNA</Note>
      {[...rna].map((base, i) => base === "U" && <rect key={i} x={x + i * CELL + 3} y={90} width={CELL - 6} height={2} fill="var(--base-t)" />)}
      <Letters x={x} y={86} text={rna} />
      <Arrow from={[mid, 98]} to={[mid, 118]} />
      <Note x={mid + 10} y={112}>translation</Note>
      <Note x={12} y={140} size={12} bold fill="var(--ink)">Protein</Note>
      {aminoNames(protein).map((name, i) => (
        <Pill key={i} x={x + i * CELL * 3 + 4} y={124} width={CELL * 3 - 8} text={name} />
      ))}
    </Figure>
  );
}

export function MutationDiagram(options: FigureOptions) {
  const cases = [
    { title: "Original", codon: "GAG", changed: -1, note: "" },
    { title: "Silent", codon: "GAA", changed: 2, note: "same amino acid" },
    { title: "Missense", codon: "GTG", changed: 1, note: "different amino acid" },
    { title: "Nonsense", codon: "TAG", changed: 0, note: "protein cut short" },
  ].map((c) => ({ ...c, amino: aminoNames(new Seq(c.codon).translate().toString())[0] }));
  const column = 126;
  return (
    <Figure
      width={column * cases.length + 16}
      height={140}
      description={cases.map((c) => `${c.title}: ${c.codon} codes for ${c.amino}`).join(". ") + "."}
      caption="One changed base, three outcomes. GAG to GTG, glutamate to valine, is the single change behind sickle-cell disease."
      {...options}
    >
      {cases.map((c, i) => {
        const left = 8 + i * column;
        const centre = left + column / 2;
        return (
          <g key={c.title}>
            <Note x={centre} y={18} anchor="middle" size={12} bold fill="var(--ink)">{c.title}</Note>
            <CodonRow x={centre - 27} y={50} codons={[c.codon]} changed={(_, base) => base === c.changed} />
            <Arrow from={[centre, 62]} to={[centre, 80]} head={4} />
            <Pill x={centre - 26} y={86} width={52} text={c.amino} />
            <Note x={centre} y={130} anchor="middle">{c.note}</Note>
          </g>
        );
      })}
    </Figure>
  );
}

// --- Records and files ----------------------------------------------------------------------------

export function FeatureDiagram(options: FigureOptions) {
  return (
    <Figure
      width={520}
      height={130}
      description="A horizontal line stands for a sequence of 4,000 bases. Above it, pointing right, are a promoter, a gene and a terminator. Below it, pointing left, is a second gene on the other strand."
      caption="Each coloured block is a feature: a type, a location and a strand. Arrows above the line read left to right; the one below is on the opposite strand and reads right to left."
      {...options}
    >
      <line x1={20} x2={500} y1={60} y2={60} stroke="var(--ink)" strokeWidth={2} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line x1={20 + i * 120} x2={20 + i * 120} y1={56} y2={64} stroke="var(--ink)" strokeWidth={1.5} />
          <Note x={20 + i * 120} y={124} anchor="middle" size={10} mono>{i === 0 ? "1" : (i * 1000).toLocaleString("en-US")}</Note>
        </g>
      ))}
      <FeatureArrow x={50} y={38} width={48} color="var(--base-g)" />
      <Note x={74} y={30} anchor="middle">promoter</Note>
      <FeatureArrow x={108} y={38} width={200} color="var(--accent)" />
      <Note x={208} y={30} anchor="middle">gene</Note>
      <FeatureArrow x={318} y={38} width={22} direction="none" color="var(--base-t)" />
      <Note x={329} y={30} anchor="middle">terminator</Note>
      <FeatureArrow x={372} y={68} width={110} direction="left" color="var(--base-c)" />
      <Note x={427} y={100} anchor="middle">gene on the other strand</Note>
    </Figure>
  );
}

export function PlasmidDiagram(options: FigureOptions) {
  const cx = 230;
  const cy = 122;
  const r = 76;
  const at = (degrees: number, radius: number): [number, number] => {
    const a = (degrees * Math.PI) / 180;
    return [cx + radius * Math.sin(a), cy - radius * Math.cos(a)];
  };
  const arc = (from: number, to: number) => {
    const [x1, y1] = at(from, r);
    const [x2, y2] = at(to, r);
    return `M${x1},${y1} A${r},${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2},${y2}`;
  };
  const features = [
    { from: 28, to: 112, color: "var(--accent)", label: "your gene" },
    { from: 150, to: 232, color: "var(--base-c)", label: "resistance gene" },
    { from: 268, to: 304, color: "var(--base-g)", label: "origin of replication" },
  ];
  return (
    <Figure
      width={460}
      height={244}
      description="A circle standing for a plasmid. Three coloured arcs on it mark the inserted gene, a resistance gene and the origin of replication. A tick at the top marks position 1."
      caption="A plasmid is a circle, so it has no ends. Position 1 is wherever the file says it is, and a feature can run straight across it."
      {...options}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--muted)" strokeWidth={2} />
      {features.map((f) => {
        const middle = (f.from + f.to) / 2;
        const [lx, ly] = at(middle, r + 20);
        const side = Math.sin((middle * Math.PI) / 180);
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

export function CoordinateDiagram(options: FigureOptions) {
  const dna = "ATGGCCAT";
  const cell = 40;
  const x = 62;
  const chosen = (i: number) => i >= 2 && i < 5;
  return (
    <Figure
      width={x + dna.length * cell + 20}
      height={152}
      description="Eight bases in boxes. Above, the gaps between them are numbered 0 to 8; below, the bases themselves are numbered 1 to 8. The bases G, G, C are highlighted: they run from 2 to 5 counting gaps, and from 3 to 5 counting bases."
      caption="The same three bases are slice(2, 5) when you count the gaps from zero, and 3..5 when you count the bases from one."
      {...options}
    >
      <Note x={8} y={50} bold fill="var(--ink)">0-based</Note>
      <Note x={8} y={116} bold fill="var(--ink)">1-based</Note>
      {[...dna].map((base, i) => (
        <g key={i}>
          <rect x={x + i * cell} y={60} width={cell} height={36} fill={chosen(i) ? "var(--accent-soft)" : "none"} stroke="var(--line)" />
          <text x={x + i * cell + cell / 2} y={84} textAnchor="middle" fontFamily={MONO} fontSize={16} fontWeight={600} fill={baseColor(base)}>{base}</text>
          <Note x={x + i * cell + cell / 2} y={116} anchor="middle" mono>{i + 1}</Note>
        </g>
      ))}
      {Array.from({ length: dna.length + 1 }, (_, i) => (
        <Note key={i} x={x + i * cell} y={50} anchor="middle" mono>{i}</Note>
      ))}
      <path d={`M${x + 2 * cell},36 v-6 h${3 * cell} v6`} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
      <Note x={x + 3.5 * cell} y={22} anchor="middle" fill="var(--accent)">start included, end excluded</Note>
      <path d={`M${x + 2.5 * cell},122 v6 h${2 * cell} v-6`} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
      <Note x={x + 3.5 * cell} y={144} anchor="middle" fill="var(--accent)">both ends included</Note>
    </Figure>
  );
}

export function FileFormatDiagram({ format, ...options }: FigureOptions & { format: "fasta" | "fastq" }) {
  const lines =
    format === "fasta"
      ? [
          { text: ">gene1 An example gene", note: "name line: begins with >" },
          { text: "ATGGCCATTGTAATGGGCCGC", note: "the sequence," },
          { text: "TGAAAGGGTGCCCGATAG", note: "wrapped over as many lines as needed" },
        ]
      : [
          { text: "@read1", note: "name line: begins with @" },
          { text: "GATTACAGGCATTGCA", note: "the bases the machine read" },
          { text: "+", note: "separator" },
          { text: "IIIIHHGFF#5!IIIH", note: "one quality character per base" },
        ];
  const height = 20 + lines.length * 24 + (format === "fastq" ? 26 : 6);
  return (
    <Figure
      width={470}
      height={height}
      description={
        format === "fasta"
          ? "A FASTA file of three lines: a name line beginning with a greater-than sign, then two lines of sequence."
          : "A FASTQ record of four lines: a name line beginning with an at sign, the bases, a plus sign as separator, and a line of quality characters the same length as the bases."
      }
      caption={
        format === "fasta"
          ? "A FASTA file holds a name and the letters, and nothing else."
          : "Each quality character sits under the base it describes. Here I is the best score, about one error in 10,000, and ! is the worst."
      }
      {...options}
    >
      <rect x={10} y={8} width={196} height={lines.length * 24 + 8} rx={6} fill="var(--code-bg)" stroke="var(--line)" />
      {lines.map((line, i) => {
        const y = 30 + i * 24;
        const isSequence = /^[ACGT]+$/.test(line.text);
        return (
          <g key={i}>
            {isSequence ? (
              <Letters x={18} y={y} text={line.text} cell={8.4} size={13} />
            ) : (
              <text x={20} y={y} fontFamily={MONO} fontSize={13} fill="var(--ink)">{line.text}</text>
            )}
            <line x1={210} x2={226} y1={y - 4} y2={y - 4} stroke="var(--muted)" />
            <Note x={232} y={y}>{line.note}</Note>
          </g>
        );
      })}
      {format === "fastq" && <Note x={20} y={height - 8} size={10}>I = quality 40 · 5 = quality 20 · ! = quality 0</Note>}
    </Figure>
  );
}

// --- At the bench ---------------------------------------------------------------------------------

export function CutDiagram({ enzyme: name, ...options }: FigureOptions & { enzyme: string }) {
  const enzyme = enzymes[name];
  const pattern = enzyme.elucidate(); // e.g. "G^AATT_C": ^ is the top-strand cut, _ the bottom
  const flank = 3;
  const dna = `ACT${enzyme.site}GCA`;
  const partner = new Seq(dna).complement().toString();
  const topCut = flank + Math.max(0, pattern.replace("_", "").indexOf("^"));
  const bottomCut = flank + Math.max(0, pattern.replace("^", "").indexOf("_"));
  const overhang = Math.abs(topCut - bottomCut);
  const x = 48;
  const gap = 36;
  const width = dna.length * CELL;
  const ends = (top: number, bottom: number, right: number) => (
    <>
      <Note x={x - 8} y={top - 1} anchor="end">5′</Note>
      <Note x={x - 8} y={bottom - 1} anchor="end">3′</Note>
      <Note x={right + 8} y={top - 1}>3′</Note>
      <Note x={right + 8} y={bottom - 1}>5′</Note>
    </>
  );
  const ending = overhang ? `a ${overhang}-base overhang, ${enzyme.ovhgseq ?? ""}` : "blunt ends with no overhang";
  return (
    <Figure
      width={x * 2 + width + gap}
      height={212}
      description={`${name} recognises ${enzyme.site}. Before the cut, the two strands are intact. After it, the DNA is in two pieces with ${ending}.`}
      caption={
        overhang
          ? `${name} recognises ${enzyme.site} and cuts the two strands ${overhang} bases apart, leaving sticky ends with the overhang ${enzyme.ovhgseq}.`
          : `${name} recognises ${enzyme.site} and cuts both strands at the same place, leaving blunt ends.`
      }
      {...options}
    >
      <Note x={12} y={14} bold fill="var(--ink)">Before</Note>
      <rect x={x + flank * CELL} y={24} width={enzyme.site.length * CELL} height={62} rx={6} fill="var(--sunken)" />
      <Note x={x + (flank + enzyme.site.length / 2) * CELL} y={14} anchor="middle">recognition site</Note>
      <Letters x={x} y={46} text={dna} opacity={(i) => (i < flank || i >= flank + enzyme.site.length ? 0.4 : 1)} />
      <Letters x={x} y={78} text={partner} opacity={(i) => (i < flank || i >= flank + enzyme.site.length ? 0.4 : 1)} />
      {ends(46, 78, x + width)}
      <path
        d={`M${x + topCut * CELL},26 V57 H${x + bottomCut * CELL} V88`}
        fill="none"
        stroke="var(--base-t)"
        strokeWidth={2}
        strokeDasharray="4 3"
      />

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

export function PcrDiagram(options: FigureOptions) {
  return (
    <Figure
      width={520}
      height={186}
      description="A template of two strands. A forward primer binds the bottom strand on the left and points right; a reverse primer binds the top strand on the right and points left. Below, the product: a shorter double strand spanning only the region between the primers."
      caption="The two primers bind on opposite strands and point towards each other. Only the stretch between them is copied, and each cycle doubles it."
      {...options}
    >
      <rect x={140} y={20} width={240} height={72} fill="var(--accent-soft)" />
      <line x1={30} x2={490} y1={30} y2={30} stroke="var(--ink)" strokeWidth={2} />
      <line x1={30} x2={490} y1={84} y2={84} stroke="var(--ink)" strokeWidth={2} />
      <Note x={22} y={34} anchor="end">5′</Note>
      <Note x={498} y={34}>3′</Note>
      <Note x={22} y={88} anchor="end">3′</Note>
      <Note x={498} y={88}>5′</Note>
      <Arrow from={[380, 42]} to={[318, 42]} color="var(--base-c)" width={4} head={7} />
      <Note x={380} y={58} anchor="end" fill="var(--base-c)" bold>reverse primer</Note>
      <Arrow from={[140, 72]} to={[202, 72]} color="var(--accent)" width={4} head={7} />
      <Note x={140} y={64} fill="var(--accent)" bold>forward primer</Note>
      <Arrow from={[260, 100]} to={[260, 124]} />
      <Note x={270} y={117}>repeat for about 30 cycles</Note>
      <line x1={140} x2={380} y1={140} y2={140} stroke="var(--ink)" strokeWidth={3} />
      <line x1={140} x2={380} y1={150} y2={150} stroke="var(--ink)" strokeWidth={3} />
      <Note x={260} y={174} anchor="middle">the product: millions of copies of the region between the primers</Note>
    </Figure>
  );
}

export function GelDiagram(options: FigureOptions) {
  const gel = gelById("1.0");
  const ladder = ladderBands(ladderById("1kb").sizes, gel);
  const lanes = [
    { label: "Uncut", bands: bandsOf([3000], gel) },
    { label: "Cut", bands: bandsOf([1850, 835, 315], gel) },
  ];
  const top = 44;
  const bottom = 226;
  const y = (band: Band) => top + band.position * (bottom - top);
  // Label a ladder band only if it sits clear of the last one labelled.
  const labelled = ladder.reduce<{ last: number; sizes: Set<number> }>(
    (acc, band) => (y(band) - acc.last >= 11 ? { last: y(band), sizes: acc.sizes.add(band.size) } : acc),
    { last: -Infinity, sizes: new Set() },
  ).sizes;
  const grey = "#8f979f";
  return (
    <Figure
      width={320}
      height={244}
      description="A gel with three lanes: a ladder of known sizes, an uncut sample with one band at 3,000 base pairs, and a cut sample with bands at 1,850, 835 and 315 base pairs. Smaller fragments are further down."
      caption="DNA is loaded at the top and pulled towards the positive electrode. The uncut lane has one large band; cutting it gives three smaller ones, which run further. The ladder on the left gives the scale."
      {...options}
    >
      <rect width={320} height={244} rx={8} fill="#12161a" />
      <Note x={14} y={top + 4} fill={grey} size={14} bold>−</Note>
      <Note x={14} y={bottom + 4} fill={grey} size={14} bold>+</Note>
      <Arrow from={[18, top + 16]} to={[18, bottom - 14]} color={grey} />
      {["Ladder", ...lanes.map((l) => l.label)].map((label, i) => (
        <g key={label}>
          <Note x={103 + i * 70} y={16} anchor="middle" fill={grey} size={10} mono>{label}</Note>
          <rect x={80 + i * 70} y={24} width={46} height={7} rx={1.5} fill="#05070a" stroke="#2c343c" />
        </g>
      ))}
      {ladder.map((band) => {
        const show = labelled.has(band.size);
        return (
          <g key={band.size}>
            <rect x={82} y={y(band) - 1.25} width={42} height={2.5} rx={1} fill="#cfd6dc" opacity={0.75} />
            {show && <Note x={74} y={y(band) + 3} anchor="end" fill={grey} size={9} mono>{band.size.toLocaleString("en-US")}</Note>}
          </g>
        );
      })}
      {lanes.map((lane, i) =>
        lane.bands.map((band) => (
          <g key={`${lane.label}${band.size}`}>
            <rect x={152 + i * 70} y={y(band) - 2} width={42} height={4} rx={1.5} fill="#f6f1df" opacity={0.5 + 0.5 * band.intensity} />
            {i === lanes.length - 1 && <Note x={270} y={y(band) + 3} fill="#f6f1df" size={9} mono>{band.size.toLocaleString("en-US")}</Note>}
          </g>
        )),
      )}
    </Figure>
  );
}

// --- Comparing sequences --------------------------------------------------------------------------

export function AlignmentDiagram({ mode = "global", ...options }: FigureOptions & { mode?: "global" | "local" }) {
  const x = 110;
  if (mode === "local") {
    const core = "GATTACA";
    const rows = [
      { left: "TTCC", right: "GG" },
      { left: "AA", right: "TTCGA" },
    ];
    const lead = Math.max(...rows.map((r) => r.left.length));
    const columns = lead + core.length + Math.max(...rows.map((r) => r.right.length));
    return (
      <Figure
        width={x + columns * CELL + 20}
        height={118}
        description={`Two sequences that share the stretch ${core} in the middle. Only that stretch is aligned and boxed; the unrelated ends are left out.`}
        caption="A local alignment keeps only the best-matching part of each sequence and ignores the rest."
        {...options}
      >
        <rect x={x + lead * CELL - 3} y={18} width={core.length * CELL + 6} height={78} rx={6} fill="var(--accent-soft)" stroke="var(--accent)" />
        {rows.map((row, i) => {
          const text = row.left + core + row.right;
          const start = x + (lead - row.left.length) * CELL;
          const y = 40 + i * 48;
          return (
            <g key={i}>
              <Note x={12} y={y - 1} size={12} bold fill="var(--ink)">Sequence {i + 1}</Note>
              <Letters x={start} y={y} text={text} opacity={(j) => (j >= row.left.length && j < row.left.length + core.length ? 1 : 0.35)} />
            </g>
          );
        })}
        {[...core].map((_, i) => (
          <line key={i} x1={x + (lead + i) * CELL + CELL / 2} x2={x + (lead + i) * CELL + CELL / 2} y1={50} y2={70} stroke="var(--accent)" strokeWidth={2} />
        ))}
      </Figure>
    );
  }

  const top = "GATTACAG-TC";
  const bottom = "GAT-ACTGATC";
  const kind = (i: number) => (top[i] === "-" || bottom[i] === "-" ? "gap" : top[i] === bottom[i] ? "match" : "mismatch");
  const counts = { match: 0, mismatch: 0, gap: 0 };
  [...top].forEach((_, i) => counts[kind(i)]++);
  const gapFill = (char: string) => (char === "-" ? "var(--muted)" : baseColor(char));
  return (
    <Figure
      width={x + top.length * CELL + 20}
      height={140}
      description={`Two sequences aligned in ${top.length} columns: ${counts.match} matches, ${counts.mismatch} mismatch and ${counts.gap} gaps, one in each sequence.`}
      caption="Every column is a match, a mismatch or a gap. This is a global alignment: both sequences are lined up from end to end."
      {...options}
    >
      {[...top].map((_, i) => kind(i) === "gap" && <rect key={i} x={x + i * CELL + 1} y={20} width={CELL - 2} height={76} rx={5} fill="var(--sunken)" />)}
      <Note x={12} y={39} size={12} bold fill="var(--ink)">Sequence 1</Note>
      <Note x={12} y={87} size={12} bold fill="var(--ink)">Sequence 2</Note>
      <Letters x={x} y={40} text={top} fill={gapFill} />
      <Letters x={x} y={88} text={bottom} fill={gapFill} />
      {[...top].map((_, i) => {
        const cx = x + i * CELL + CELL / 2;
        if (kind(i) === "match") return <line key={i} x1={cx} x2={cx} y1={50} y2={70} stroke="var(--accent)" strokeWidth={2} />;
        if (kind(i) === "mismatch") return <circle key={i} cx={cx} cy={60} r={3} fill="var(--base-t)" />;
        return null;
      })}
      <line x1={x} x2={x} y1={118} y2={130} stroke="var(--accent)" strokeWidth={2} />
      <Note x={x + 8} y={128}>match</Note>
      <circle cx={x + 62} cy={124} r={3} fill="var(--base-t)" />
      <Note x={x + 70} y={128}>mismatch</Note>
      <Note x={x + 138} y={128} mono bold>-</Note>
      <Note x={x + 150} y={128}>gap</Note>
    </Figure>
  );
}

export function MotifDiagram(options: FigureOptions) {
  const sites = ["TATAAT", "TATGAT", "TACAAT", "TATACT", "GATAAT", "TATAAT", "TTTAAT", "TATATT"];
  const length = sites[0].length;
  const columns = Array.from({ length }, (_, p) => {
    const counts = new Map<string, number>();
    for (const site of sites) counts.set(site[p], (counts.get(site[p]) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  });
  const chartTop = 16;
  const chartHeight = 124;
  const consensus = columns.map((c) => c[0][0]).join("");
  return (
    <Figure
      width={480}
      height={166}
      description={`Eight example binding sites, six bases each, listed on the left. On the right, one stacked bar per position shows how often each base occurs there. The most common base at each position spells ${consensus}.`}
      caption={`Eight known sites on the left; on the right, how often each base appears at each position. No single site need match the most common pattern, ${consensus}, exactly.`}
      {...options}
    >
      {sites.map((site, i) => (
        <Letters key={i} x={16} y={30 + i * 15} text={site} cell={13} size={12} />
      ))}
      <Note x={16} y={160} size={10}>8 known sites</Note>
      {columns.map((column, p) => {
        let offset = 0;
        const left = 160 + p * 50;
        return (
          <g key={p}>
            {column.map(([base, count]) => {
              const height = (count / sites.length) * chartHeight;
              const y = chartTop + chartHeight - offset - height;
              offset += height;
              return (
                <g key={base}>
                  <rect x={left} y={y + 0.75} width={38} height={Math.max(0, height - 1.5)} rx={2} fill={baseColor(base)} />
                  {height >= 15 && (
                    <text x={left + 19} y={y + height / 2 + 4.5} textAnchor="middle" fontFamily={MONO} fontSize={13} fontWeight={700} fill="var(--surface)">{base}</text>
                  )}
                </g>
              );
            })}
            <Note x={left + 19} y={158} anchor="middle" mono>{p + 1}</Note>
          </g>
        );
      })}
    </Figure>
  );
}

export function TreeDiagram({ support = false, ...options }: FigureOptions & { support?: boolean }) {
  const line = { stroke: "var(--ink)", strokeWidth: 2, fill: "none", strokeLinejoin: "round" as const };
  const tips = [
    { name: "A", x: 230, y: 30 },
    { name: "B", x: 255, y: 60 },
    { name: "C", x: 240, y: 95 },
    { name: "D", x: 215, y: 135 },
  ];
  return (
    <Figure
      width={support ? 480 : 400}
      height={support ? 156 : 186}
      description={
        support
          ? "A tree with four tips, A, B, C and D. The fork joining A and B is labelled 98 and the fork joining them to C is labelled 62."
          : "A tree with four tips, A, B, C and D. A and B share the most recent common ancestor and are boxed as a clade; C joins them next, and D branches off first. The same tree is written beneath in Newick notation as (((A,B),C),D);"
      }
      caption={
        support
          ? "The number at each fork is its bootstrap support. A and B grouped together in 98 of 100 resampled trees, so that grouping is solid. The grouping with C appeared in only 62, so it is less certain."
          : "Tips are what exists today and forks are inferred common ancestors. The boxed branch, A and B with their ancestor, is one clade. The last line is the same tree in Newick notation."
      }
      {...options}
    >
      <rect x={140} y={14} width={146} height={60} rx={8} fill="var(--accent-soft)" />
      <Note x={294} y={48} fill="var(--accent)" bold>{support ? "in 98 of 100 resampled trees" : "a clade"}</Note>
      <path d="M40,70 V135 M40,70 H95 M40,135 H215" {...line} />
      <path d="M95,45 V95 M95,45 H150 M95,95 H240" {...line} />
      <path d="M150,30 V60 M150,30 H230 M150,60 H255" {...line} />
      {[
        [40, 102],
        [95, 70],
        [150, 45],
      ].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r={4} fill="var(--ink)" />
      ))}
      {tips.map((tip) => (
        <Note key={tip.name} x={tip.x + 8} y={tip.y + 4} size={13} bold mono fill="var(--ink)">{tip.name}</Note>
      ))}
      {support ? (
        <>
          <Note x={145} y={39} anchor="end" mono bold fill="var(--accent)" size={12}>98</Note>
          <Note x={90} y={64} anchor="end" mono bold fill="var(--base-g)" size={12}>62</Note>
        </>
      ) : (
        <>
          <Note x={244} y={139}>← a tip</Note>
          <Note x={102} y={84}>common ancestor</Note>
          <Note x={128} y={128} anchor="middle">branch length</Note>
          <text x={40} y={172} fontFamily={MONO} fontSize={13} fill="var(--ink)">(((A,B),C),D);</text>
        </>
      )}
    </Figure>
  );
}

// --- Structure ------------------------------------------------------------------------------------

export function StructureDiagram({ highlight = "all", ...options }: FigureOptions & { highlight?: "all" | "residue" }) {
  const box = (x: number, y: number, w: number, h: number, label: string, strong = false) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={strong ? "var(--accent-soft)" : "none"} stroke={strong ? "var(--accent)" : "var(--line)"} strokeWidth={1.5} />
      <Note x={x + 10} y={y + 16} bold fill="var(--ink)">{label}</Note>
    </g>
  );
  const residues = ["Met", "Ala", "Ile", "Val"];
  const atoms = ["N", "CA", "C", "O", "CB"];
  return (
    <Figure
      width={520}
      height={190}
      description="Nested boxes. A structure contains a model; the model contains chain A and chain B; chain A contains the residues Met, Ala, Ile and Val; and the residue Ala contains the atoms N, CA, C, O and CB."
      caption={
        highlight === "residue"
          ? "One residue, alanine, is highlighted with its five atoms. Residues sit in chains, chains in models, and models in a structure."
          : "A structure file is a hierarchy: structure, model, chain, residue, atom. Each level contains the next."
      }
      {...options}
    >
      {box(10, 8, 500, 174, "Structure")}
      {box(22, 30, 476, 142, "Model")}
      {box(34, 52, 310, 110, "Chain A")}
      {box(354, 52, 132, 110, "Chain B")}
      {residues.map((name, i) => {
        const chosen = i === 1;
        return (
          <g key={name}>
            <rect x={46 + i * 72} y={76} width={64} height={24} rx={5} fill={chosen ? "var(--accent-soft)" : "var(--sunken)"} stroke={chosen ? "var(--accent)" : "var(--line)"} />
            <Note x={78 + i * 72} y={92} anchor="middle" mono fill="var(--ink)">{name}</Note>
          </g>
        );
      })}
      {["Gly", "Ser"].map((name, i) => (
        <g key={name}>
          <rect x={366 + i * 56} y={76} width={48} height={24} rx={5} fill="var(--sunken)" stroke="var(--line)" />
          <Note x={390 + i * 56} y={92} anchor="middle" mono fill="var(--ink)">{name}</Note>
        </g>
      ))}
      <path d="M150,100 L56,122 M150,100 L228,122" fill="none" stroke="var(--accent)" strokeDasharray="3 3" />
      {atoms.map((atom, i) => (
        <g key={atom}>
          <circle cx={68 + i * 37} cy={136} r={12} fill="var(--surface)" stroke="var(--accent)" strokeWidth={1.5} />
          <Note x={68 + i * 37} y={140} anchor="middle" size={10} mono fill="var(--ink)">{atom}</Note>
        </g>
      ))}
      <Note x={244} y={140}>atoms of one residue</Note>
    </Figure>
  );
}

// --- Lookup ---------------------------------------------------------------------------------------

/** The diagram for a glossary entry (or one of the extra lesson pictures), or null if it has none. */
export function TermDiagram({ slug, ...options }: FigureOptions & { slug: string }) {
  switch (slug) {
    case "cell":
      return <CellDiagram {...options} />;
    case "dna":
      return <DuplexDiagram {...options} />;
    case "rna":
      return <DnaRnaDiagram {...options} />;
    case "nucleotide":
      return <NucleotideDiagram {...options} />;
    case "amino-acid":
      return <AminoAcidDiagram {...options} />;
    case "enzyme":
      return <EnzymeDiagram {...options} />;
    case "chromosome":
      return <ZoomDiagram {...options} />;
    case "genome":
      return <GenomeSizeDiagram {...options} />;
    case "units":
      return <UnitsDiagram {...options} />;
    case "exons-and-introns":
      return <SplicingDiagram {...options} />;
    case "start-and-stop-codons":
    case "open-reading-frame":
      return <OrfDiagram {...options} />;
    // Not glossary terms: pictures used only by the Start here lessons.
    case "protein-fold":
      return <ProteinFoldDiagram {...options} />;
    case "pipeline":
      return <PipelineDiagram {...options} />;
    case "base":
      return <DuplexDiagram highlight="base" {...options} />;
    case "base-pair":
      return <DuplexDiagram highlight="pair" {...options} />;
    case "strand-direction":
      return <DuplexDiagram {...options} />;
    case "complement":
    case "reverse-complement":
      return <ReverseComplementDiagram {...options} />;
    case "gc-content":
      return <GcDiagram {...options} />;
    case "melting-temperature":
      return <MeltingDiagram {...options} />;
    case "gene":
    case "promoter":
    case "feature":
      return <FeatureDiagram {...options} />;
    case "transcription":
      return <CentralDogmaDiagram {...options} />;
    case "translation":
    case "codon":
      return <CodonDiagram {...options} />;
    case "genetic-code":
      return <GeneticCodeDiagram {...options} />;
    case "reading-frame":
      return <ReadingFrameDiagram {...options} />;
    case "mutation":
      return <MutationDiagram {...options} />;
    case "plasmid":
      return <PlasmidDiagram {...options} />;
    case "coordinates":
      return <CoordinateDiagram {...options} />;
    case "fasta":
      return <FileFormatDiagram format="fasta" {...options} />;
    case "fastq":
      return <FileFormatDiagram format="fastq" {...options} />;
    case "restriction-enzyme":
    case "sticky-end":
    case "ligation":
      return <CutDiagram enzyme="EcoRI" {...options} />;
    case "blunt-end":
      return <CutDiagram enzyme="SmaI" {...options} />;
    case "primer":
    case "pcr":
      return <PcrDiagram {...options} />;
    case "gel-electrophoresis":
      return <GelDiagram {...options} />;
    case "alignment":
    case "gap":
      return <AlignmentDiagram {...options} />;
    case "motif":
      return <MotifDiagram {...options} />;
    case "phylogenetic-tree":
    case "clade":
    case "newick":
      return <TreeDiagram {...options} />;
    case "bootstrap":
      return <TreeDiagram support {...options} />;
    case "sequencing":
    case "read":
      return <SequencingDiagram {...options} />;
    case "vector-and-insert":
      return <VectorInsertDiagram {...options} />;
    case "transformation":
    case "selection":
      return <TransformationDiagram {...options} />;
    case "gibson-assembly":
      return <GibsonDiagram {...options} />;
    case "homology":
      return <HomologyDiagram {...options} />;
    case "identity-and-similarity":
      return <IdentityDiagram {...options} />;
    case "substitution-matrix":
      return <MatrixDiagram {...options} />;
    case "backbone-and-side-chain":
      return <AminoAcidDiagram {...options} />;
    case "secondary-structure":
      return <SecondaryStructureDiagram {...options} />;
    case "rmsd":
      return <RmsdDiagram {...options} />;
    case "protein":
      return <StructureDiagram {...options} />;
    case "residue":
      return <StructureDiagram highlight="residue" {...options} />;
    default:
      return null;
  }
}

// --- Added for this site's lessons ------------------------------------------------------------------

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

/** @param props.name - Which figure. @returns The drawing. */
export function LessonFigure({ name }: { name: FigureName }) {
  switch (name) {
    case "dna": return <DuplexDiagram highlight="pair" />;
    case "cut": return <CutDiagram enzyme="EcoRI" />;
    case "cut-blunt": return <CutDiagram enzyme="SmaI" />;
    case "pieces": return <PiecesDiagram />;
    case "plasmid": return <PlasmidDiagram />;
    case "gel": return <GelDiagram />;
    case "primer": return <TermDiagram slug="primer" />;
    case "pcr": return <PcrDiagram />;
    case "melting": return <MeltingDiagram />;
    case "five-three": return <DuplexDiagram />;
    case "feature": return <TermDiagram slug="feature" />;
    case "coordinates": return <TermDiagram slug="coordinates" />;
  }
}
