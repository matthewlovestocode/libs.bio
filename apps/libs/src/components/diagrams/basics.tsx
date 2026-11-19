/**
 * Diagrams for the foundation terms: cells, molecules and scale. These are schematic drawings, not
 * computed from the libraries, because nothing here is a calculation.
 */
import { Seq } from "@biolibs/seq";
import { Arrow, CELL, FeatureArrow, Figure, Letters, MONO, Note, baseColor, type FigureOptions } from "./primitives";

const INK = { stroke: "var(--ink)", strokeWidth: 1.5, fill: "none" } as const;

/** Small dots standing for ribosomes. */
function Ribosomes({ points }: { points: [number, number][] }) {
  return (
    <g fill="var(--muted)">
      {points.map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r={2.5} />
      ))}
    </g>
  );
}

export function CellDiagram(options: FigureOptions) {
  return (
    <Figure
      width={520}
      height={226}
      description="Two cells. On the left a bacterium: a single compartment containing a loop of DNA, a small ring called a plasmid, and ribosomes. On the right an animal cell: larger, with its DNA inside a nucleus, plus mitochondria and ribosomes."
      caption="A bacterium keeps its DNA loose inside the cell. An animal cell keeps it in a nucleus. Both have ribosomes, which build proteins. Not to scale: the animal cell is roughly ten times wider."
      {...options}
    >
      <Note x={125} y={18} anchor="middle" size={12} bold fill="var(--ink)">Bacterium</Note>
      <rect x={24} y={46} width={202} height={112} rx={56} {...INK} strokeWidth={2} />
      <path d="M66,104 C78,70 112,138 134,100 S176,74 184,110 S150,146 122,132 S56,138 66,104 Z" fill="none" stroke="var(--accent)" strokeWidth={2.5} />
      <circle cx={180} cy={76} r={9} fill="none" stroke="var(--base-c)" strokeWidth={2.5} />
      <Ribosomes points={[[52, 82], [60, 128], [96, 64], [150, 62], [200, 104], [168, 138], [110, 146], [84, 96]]} />

      <Note x={390} y={18} anchor="middle" size={12} bold fill="var(--ink)">Animal cell</Note>
      <ellipse cx={390} cy={102} rx={118} ry={72} {...INK} strokeWidth={2} />
      <circle cx={372} cy={100} r={36} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
      <path d="M352,100 C356,82 372,112 380,94 S396,88 394,104 S378,122 366,112 S350,112 352,100 Z" fill="none" stroke="var(--accent)" strokeWidth={2.5} />
      <ellipse cx={452} cy={82} rx={20} ry={10} fill="none" stroke="var(--base-g)" strokeWidth={2} transform="rotate(-20 452 82)" />
      <ellipse cx={318} cy={140} rx={18} ry={9} fill="none" stroke="var(--base-g)" strokeWidth={2} transform="rotate(25 318 140)" />
      <Ribosomes points={[[300, 84], [320, 62], [430, 128], [460, 112], [410, 150], [440, 52], [296, 112], [420, 70]]} />

      <g>
        <line x1={24} x2={44} y1={198} y2={198} stroke="var(--accent)" strokeWidth={2.5} />
        <Note x={50} y={202}>DNA</Note>
        <circle cx={100} cy={198} r={6} fill="none" stroke="var(--base-c)" strokeWidth={2.5} />
        <Note x={112} y={202}>plasmid</Note>
        <circle cx={176} cy={198} r={7} fill="var(--accent-soft)" stroke="var(--accent)" />
        <Note x={189} y={202}>nucleus</Note>
        <ellipse cx={258} cy={198} rx={10} ry={5} fill="none" stroke="var(--base-g)" strokeWidth={2} />
        <Note x={274} y={202}>mitochondrion</Note>
        <circle cx={366} cy={198} r={2.5} fill="var(--muted)" />
        <Note x={374} y={202}>ribosomes (build proteins)</Note>
      </g>
    </Figure>
  );
}

export function DnaRnaDiagram(options: FigureOptions) {
  const dna = "ATGGCCATT";
  const seq = new Seq(dna);
  const partner = seq.complement().toString();
  const rna = seq.transcribe().toString();
  const x = 130;
  const end = x + dna.length * CELL;
  return (
    <Figure
      width={end + 40}
      height={152}
      description={`DNA drawn as two paired strands, ${dna} above ${partner}. Beneath it, RNA drawn as a single strand, ${rna}, in which each T has become U.`}
      caption="DNA has two strands and uses T. RNA is usually a single strand and uses U in its place."
      {...options}
    >
      <Note x={12} y={50} size={12} bold fill="var(--ink)">DNA</Note>
      <Note x={12} y={64} size={10}>two strands, with T</Note>
      {[...dna].map((_, i) => (
        <line key={i} x1={x + i * CELL + CELL / 2} x2={x + i * CELL + CELL / 2} y1={43} y2={56} stroke="var(--line)" strokeWidth={2} />
      ))}
      <Letters x={x} y={36} text={dna} />
      <Letters x={x} y={72} text={partner} />
      <Note x={12} y={118} size={12} bold fill="var(--ink)">RNA</Note>
      <Note x={12} y={132} size={10}>one strand, with U</Note>
      {[...rna].map((base, i) => base === "U" && <rect key={i} x={x + i * CELL + 3} y={128} width={CELL - 6} height={2} fill="var(--base-t)" />)}
      <Letters x={x} y={124} text={rna} />
    </Figure>
  );
}

export function NucleotideDiagram(options: FigureOptions) {
  const bases = ["A", "C", "G"];
  const pentagon = (cx: number, cy: number, r: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const a = (-90 + i * 72) * (Math.PI / 180);
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
  const phosphate = (i: number) => 56 + i * 124;
  const sugar = (i: number) => 116 + i * 124;
  const y = 100;
  return (
    <Figure
      width={470}
      height={182}
      description="Three nucleotides joined in a chain. Each is a phosphate, drawn as a circle marked P, joined to a sugar, drawn as a pentagon, with a base attached above the sugar. The chain starts with a phosphate at the 5′ end and finishes with a sugar at the 3′ end."
      caption="The sugars and phosphates alternate to form the backbone, and the bases hang off it. One end of the chain finishes with a phosphate (5′) and the other with a sugar (3′), which is what gives a strand its direction."
      {...options}
    >
      <rect x={phosphate(1) - 20} y={22} width={sugar(1) - phosphate(1) + 46} height={108} rx={8} fill="var(--accent-soft)" />
      <Note x={(phosphate(1) + sugar(1)) / 2 + 3} y={146} anchor="middle" fill="var(--accent)" bold>one nucleotide</Note>
      {bases.map((base, i) => (
        <g key={base}>
          <line x1={phosphate(i) + 13} x2={sugar(i) - 17} y1={y} y2={y} {...INK} />
          {i < bases.length - 1 && <line x1={sugar(i) + 17} x2={phosphate(i + 1) - 13} y1={y} y2={y} {...INK} />}
          <line x1={sugar(i)} x2={sugar(i)} y1={y - 18} y2={64} {...INK} />
          <circle cx={phosphate(i)} cy={y} r={13} fill="var(--surface)" stroke="var(--base-g)" strokeWidth={2} />
          <Note x={phosphate(i)} y={y + 4} anchor="middle" mono bold fill="var(--ink)">P</Note>
          <polygon points={pentagon(sugar(i), y, 18)} fill="var(--sunken)" stroke="var(--ink)" strokeWidth={1.5} />
          <rect x={sugar(i) - 17} y={32} width={34} height={32} rx={5} fill="var(--surface)" stroke={baseColor(base)} strokeWidth={2} />
          <text x={sugar(i)} y={54} textAnchor="middle" fontFamily={MONO} fontSize={16} fontWeight={700} fill={baseColor(base)}>{base}</text>
        </g>
      ))}
      <Note x={phosphate(0)} y={130} anchor="middle" bold fill="var(--ink)">5′ end</Note>
      <Note x={sugar(2)} y={130} anchor="middle" bold fill="var(--ink)">3′ end</Note>
      <Note x={16} y={172} size={10}>circle = phosphate · pentagon = sugar · box = base</Note>
    </Figure>
  );
}

export function AminoAcidDiagram(options: FigureOptions) {
  const acids = [
    { name: "glycine", code: "Gly, G", side: "H" },
    { name: "alanine", code: "Ala, A", side: "CH₃" },
    { name: "serine", code: "Ser, S", side: "CH₂OH" },
  ];
  const centre = (i: number) => 124 + i * 150;
  return (
    <Figure
      width={516}
      height={176}
      description="Three amino acids joined in a chain: glycine, alanine and serine. Each has the same backbone, drawn as a grey block, and a different side chain above it: H for glycine, CH3 for alanine and CH2OH for serine."
      caption="Every amino acid has the same backbone, which links to its neighbours. Only the side chain differs, and the mix of side chains is what gives each protein its character."
      {...options}
    >
      {acids.map((acid, i) => (
        <g key={acid.name}>
          {i < acids.length - 1 && <line x1={centre(i) + 44} x2={centre(i + 1) - 44} y1={105} y2={105} stroke="var(--ink)" strokeWidth={2} />}
          <line x1={centre(i)} x2={centre(i)} y1={56} y2={90} {...INK} />
          <rect x={centre(i) - 38} y={28} width={76} height={28} rx={14} fill="var(--accent-soft)" stroke="var(--accent)" />
          <Note x={centre(i)} y={46} anchor="middle" mono bold fill="var(--accent)" size={12}>{acid.side}</Note>
          <rect x={centre(i) - 44} y={90} width={88} height={30} rx={5} fill="var(--sunken)" stroke="var(--line)" />
          <Note x={centre(i)} y={110} anchor="middle" mono fill="var(--ink)" size={12}>N–C–C</Note>
          <Note x={centre(i)} y={140} anchor="middle" bold fill="var(--ink)">{acid.name}</Note>
          <Note x={centre(i)} y={154} anchor="middle" size={10} mono>{acid.code}</Note>
        </g>
      ))}
      <Note x={12} y={46} size={10}>side chain</Note>
      <Note x={12} y={86} size={10}>backbone</Note>
      <Note x={(centre(0) + centre(1)) / 2} y={98} anchor="middle" size={10}>bond</Note>
    </Figure>
  );
}

const BEAD_COLORS = ["var(--base-a)", "var(--base-c)", "var(--base-g)", "var(--base-t)"];

function Beads({ points }: { points: [number, number][] }) {
  return (
    <g>
      <polyline points={points.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--muted)" strokeWidth={2} />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={7.5} fill={BEAD_COLORS[(i * 7 + (i % 3)) % BEAD_COLORS.length]} stroke="var(--surface)" strokeWidth={1.5} />
      ))}
    </g>
  );
}

export function ProteinFoldDiagram(options: FigureOptions) {
  const count = 16;
  const chain: [number, number][] = Array.from({ length: count }, (_, i) => [22 + i * 14, 78 + 9 * Math.sin(i * 0.9)]);
  const folded: [number, number][] = Array.from({ length: count }, (_, i) => {
    const angle = i * 0.82;
    const radius = 50 - i * 2.7;
    return [416 + radius * Math.cos(angle), 80 + radius * Math.sin(angle)];
  });
  return (
    <Figure
      width={500}
      height={164}
      description="On the left, a chain of sixteen beads in a wavy line: a chain of amino acids. An arrow labelled folds points to the right, where the same sixteen beads are packed into a compact coil: a folded protein."
      caption="A protein is made as a straight chain and then folds itself into a compact shape. Each bead is one amino acid, and the colours stand for different kinds."
      {...options}
    >
      <Beads points={chain} />
      <Note x={127} y={130} anchor="middle">a chain of amino acids</Note>
      <Arrow from={[262, 80]} to={[330, 80]} width={2} />
      <Note x={296} y={70} anchor="middle" bold fill="var(--ink)">folds</Note>
      <Beads points={folded} />
      <Note x={416} y={152} anchor="middle">a folded protein</Note>
    </Figure>
  );
}

export function EnzymeDiagram(options: FigureOptions) {
  const r = 36;
  const cy = 70;
  const mouth = (25 * Math.PI) / 180;
  const body = (cx: number) => {
    const x = cx + r * Math.cos(mouth);
    const dy = r * Math.sin(mouth);
    return `M${cx},${cy} L${x},${cy - dy} A${r},${r} 0 1 0 ${x},${cy + dy} Z`;
  };
  const stages = [
    { cx: 78, label: "enzyme and its target", pieces: [[58, 30]] },
    { cx: 262, label: "the target fits the active site", pieces: [[6, 30]] },
    { cx: 446, label: "products leave, enzyme is unchanged", pieces: [[48, 13], [68, 13]] },
  ];
  return (
    <Figure
      width={560}
      height={152}
      description="Three stages. First, an enzyme with a notch in one side, and a small bar-shaped target beside it. Second, the target sits in the notch. Third, the target has been split into two pieces that have moved away, and the enzyme is as it was."
      caption="An enzyme has a pocket, the active site, that fits its target. It holds the target, the reaction happens, and the products leave. The enzyme itself is not used up."
      {...options}
    >
      {stages.map((stage, i) => (
        <g key={stage.label}>
          <path d={body(stage.cx)} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" />
          <Note x={stage.cx - 17} y={cy + 3} anchor="middle" size={9} fill="var(--accent)" bold>enzyme</Note>
          {stage.pieces.map(([dx, width]) => (
            <rect key={dx} x={stage.cx + dx} y={cy - 7} width={width} height={14} rx={3} fill="var(--base-g)" />
          ))}
          <Note x={stage.cx + 10} y={136} anchor="middle" size={10}>{stage.label}</Note>
          {i < stages.length - 1 && <Arrow from={[stage.cx + 104, cy]} to={[stage.cx + 138, cy]} />}
        </g>
      ))}
    </Figure>
  );
}

export function ZoomDiagram(options: FigureOptions) {
  const bases = "ATGGCCATTGTAATGGGCCGC";
  const x = (520 - bases.length * CELL) / 2;
  const dashed = { stroke: "var(--muted)", strokeDasharray: "3 3", fill: "none" } as const;
  return (
    <Figure
      width={520}
      height={204}
      description="Three levels of zoom. At the top, a chromosome drawn as a long bar with one small stretch highlighted. In the middle, that stretch enlarged: a single gene. At the bottom, part of the gene enlarged again to show individual bases."
      caption="A chromosome is one DNA molecule millions of bases long. Zoom in on a small part and you find a gene; zoom in again and you reach the bases themselves."
      {...options}
    >
      <Note x={20} y={16} bold fill="var(--ink)">A chromosome: millions of bases</Note>
      <rect x={20} y={24} width={480} height={14} rx={7} fill="var(--line)" />
      <rect x={258} y={24} width={26} height={14} fill="var(--accent)" />
      <path d="M258,38 L60,76 M284,38 L460,76" {...dashed} />

      <line x1={60} x2={460} y1={86} y2={86} stroke="var(--ink)" strokeWidth={2} />
      <FeatureArrow x={130} y={78} width={260} color="var(--accent)" />
      <rect x={236} y={78} width={30} height={16} fill="none" stroke="var(--ink)" strokeWidth={1.5} />
      <Note x={260} y={68} anchor="middle" bold fill="var(--ink)">One gene: about a thousand bases</Note>
      <path d={`M236,94 L${x},146 M266,94 L${x + bases.length * CELL},146`} {...dashed} />

      <Letters x={x} y={168} text={bases} />
      <Note x={260} y={194} anchor="middle" bold fill="var(--ink)">Its bases</Note>
    </Figure>
  );
}

export function GenomeSizeDiagram(options: FigureOptions) {
  const genomes = [
    { name: "A coronavirus", size: 30_000, label: "30,000 bases" },
    { name: "E. coli, a bacterium", size: 4_600_000, label: "4.6 million" },
    { name: "Baker's yeast", size: 12_000_000, label: "12 million" },
    { name: "Human", size: 3_100_000_000, label: "3.1 billion" },
  ];
  const x = 170;
  // A logarithmic scale: 1,000 bases at the left edge, 10 billion at the right.
  const width = (size: number) => ((Math.log10(size) - 3) / 7) * 300;
  return (
    <Figure
      width={540}
      height={170}
      description={`Genome sizes as bars on a scale where each step is ten times bigger. ${genomes.map((g) => `${g.name}: ${g.label}`).join(". ")}.`}
      caption="Genome sizes, on a scale where each tick is ten times the one before. On an ordinary scale the human bar would be 100,000 times longer than the virus's."
      {...options}
    >
      {[3, 4, 5, 6, 7, 8, 9, 10].map((power) => (
        <line key={power} x1={x + ((power - 3) / 7) * 300} x2={x + ((power - 3) / 7) * 300} y1={14} y2={134} stroke="var(--line)" />
      ))}
      {genomes.map((genome, i) => {
        const y = 22 + i * 29;
        return (
          <g key={genome.name}>
            <Note x={x - 10} y={y + 12} anchor="end" fill="var(--ink)">{genome.name}</Note>
            <rect x={x} y={y} width={width(genome.size)} height={16} rx={3} fill="var(--accent)" />
            <Note x={x + width(genome.size) + 8} y={y + 12} mono>{genome.label}</Note>
          </g>
        );
      })}
      <Note x={x} y={150} anchor="middle" size={10} mono>1,000</Note>
      <Note x={x + (3 / 7) * 300} y={150} anchor="middle" size={10} mono>1 million</Note>
      <Note x={x + (6 / 7) * 300} y={150} anchor="middle" size={10} mono>1 billion</Note>
      <Note x={12} y={150} size={10}>bases, ×10 per tick</Note>
    </Figure>
  );
}

export function SplicingDiagram(options: FigureOptions) {
  const exons = [
    { x: 60, width: 90 },
    { x: 230, width: 70 },
    { x: 380, width: 80 },
  ];
  const joinedStart = 140;
  const joined = exons.reduce<{ x: number; width: number }[]>((acc, exon) => {
    const last = acc[acc.length - 1];
    return [...acc, { x: last ? last.x + last.width : joinedStart, width: exon.width }];
  }, []);
  return (
    <Figure
      width={520}
      height={176}
      description="At the top, a gene on DNA with three exons drawn as blocks, separated by two introns drawn as plain line. An arrow points down to the messenger RNA, in which the three exons sit end to end with the introns gone."
      caption="The whole gene is copied into RNA, then the introns are cut out and the exons joined. Only the joined exons are translated into protein."
      {...options}
    >
      <Note x={12} y={16} bold fill="var(--ink)">Gene, as it is in the DNA</Note>
      <line x1={30} x2={490} y1={44} y2={44} stroke="var(--ink)" strokeWidth={2} />
      {exons.map((exon, i) => (
        <g key={i}>
          <rect x={exon.x} y={34} width={exon.width} height={20} rx={3} fill="var(--accent)" />
          <Note x={exon.x + exon.width / 2} y={70} anchor="middle" bold fill="var(--accent)">exon {i + 1}</Note>
          {i < exons.length - 1 && <Note x={(exon.x + exon.width + exons[i + 1].x) / 2} y={70} anchor="middle">intron</Note>}
        </g>
      ))}
      <Arrow from={[260, 80]} to={[260, 106]} />
      <Note x={270} y={98}>introns removed, exons joined</Note>
      {joined.map((exon, i) => (
        <rect key={i} x={exon.x + 1} y={116} width={exon.width - 2} height={20} rx={3} fill="var(--accent)" />
      ))}
      <Note x={260} y={160} anchor="middle" bold fill="var(--ink)">Messenger RNA: exons only</Note>
    </Figure>
  );
}

export function UnitsDiagram(options: FigureOptions) {
  const rows = [
    ["bp", "one base pair", "a codon is 3 bp"],
    ["kb", "1,000 bp", "a bacterial gene is about 1 kb"],
    ["Mb", "1,000,000 bp", "the E. coli genome is 4.6 Mb"],
    ["Gb", "1,000,000,000 bp", "the human genome is 3.1 Gb"],
    ["Da", "dalton: about one hydrogen atom's mass", "a base pair is about 650 Da"],
    ["Å", "ångström: a ten-billionth of a metre", "the double helix is 20 Å wide"],
  ];
  return (
    <Figure
      width={540}
      height={30 + rows.length * 28 + 8}
      description={`A table of units. ${rows.map(([unit, meaning, example]) => `${unit}: ${meaning}; for scale, ${example}`).join(". ")}.`}
      caption="The first four count DNA length. Daltons measure the mass of a molecule and ångströms the distances inside one."
      {...options}
    >
      <Note x={16} y={18} bold fill="var(--ink)">Unit</Note>
      <Note x={70} y={18} bold fill="var(--ink)">Means</Note>
      <Note x={320} y={18} bold fill="var(--ink)">For scale</Note>
      {rows.map(([unit, meaning, example], i) => {
        const y = 30 + i * 28;
        return (
          <g key={unit}>
            <line x1={10} x2={530} y1={y - 4} y2={y - 4} stroke="var(--line)" />
            <Note x={16} y={y + 15} mono bold size={13} fill="var(--accent)">{unit}</Note>
            <Note x={70} y={y + 15} fill="var(--ink)">{meaning}</Note>
            <Note x={320} y={y + 15}>{example}</Note>
          </g>
        );
      })}
    </Figure>
  );
}

export function PipelineDiagram(options: FigureOptions) {
  const steps = [
    { title: "Sample", hint: "cells or tissue" },
    { title: "Sequencer", hint: "reads the bases" },
    { title: "Files", hint: "FASTA, FASTQ" },
    { title: "Software", hint: "search, compare" },
    { title: "Answer", hint: "which gene is it?" },
  ];
  const step = 108;
  return (
    <Figure
      width={step * steps.length + 4}
      height={104}
      description={`Five boxes joined by arrows: ${steps.map((s) => `${s.title} (${s.hint})`).join(", then ")}.`}
      caption="From a sample to an answer. Everything after the sequencing machine is done by software."
      {...options}
    >
      {steps.map((s, i) => {
        const x = 8 + i * step;
        const software = i === 3;
        return (
          <g key={s.title}>
            <rect x={x} y={20} width={88} height={40} rx={8} fill={software ? "var(--accent-soft)" : "var(--sunken)"} stroke={software ? "var(--accent)" : "var(--line)"} />
            <Note x={x + 44} y={45} anchor="middle" bold fill={software ? "var(--accent)" : "var(--ink)"} size={12}>{s.title}</Note>
            <Note x={x + 44} y={80} anchor="middle" size={10}>{s.hint}</Note>
            {i < steps.length - 1 && <Arrow from={[x + 90, 40]} to={[x + step - 2, 40]} head={5} />}
          </g>
        );
      })}
    </Figure>
  );
}
