/**
 * The made-up plasmid every tool starts with, so the first click gives a result.
 *
 * It is not a real construct: the bases are pseudo-random from a fixed seed, so the sample is the
 * same on every visit and carries no licence. Three well-known sites are written in at known places.
 */

/** A deterministic pseudo-random number generator (a linear congruential generator). */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/**
 * A made-up 3 kb circle with one EcoRI, one BamHI and one HindIII site written in. Chance supplies a
 * few more sites for other enzymes.
 *
 * @returns 3,000 bases.
 */
export function samplePlasmid(): string {
  const next = seeded(42);
  let bases = "";
  for (let i = 0; i < 3000; i++) bases += "ACGT"[Math.floor(next() * 4)];
  const sites: [number, string][] = [[400, "GAATTC"], [1250, "GGATCC"], [2100, "AAGCTT"]];
  for (const [at, site] of sites) bases = bases.slice(0, at) + site + bases.slice(at + site.length);
  return bases;
}

/** What the sample plasmid is called. */
export const SAMPLE_NAME = "pDemo";

/**
 * Made-up features for the sample plasmid, so a map has something to draw. Positions count from 1
 * and include both ends, as a GenBank file writes them. The last one runs across the origin.
 */
const SAMPLE_FEATURES: { type: string; location: string; qualifiers: string[] }[] = [
  { type: "promoter", location: "300..380", qualifiers: ['/label="promoter"'] },
  { type: "CDS", location: "420..1240", qualifiers: ['/gene="demo"', '/product="demonstration protein"'] },
  { type: "terminator", location: "1262..1310", qualifiers: ['/label="terminator"'] },
  { type: "rep_origin", location: "1480..2060", qualifiers: ['/label="origin of replication"'] },
  { type: "CDS", location: "complement(2180..2940)", qualifiers: ['/gene="res"', '/product="resistance marker"'] },
  { type: "misc_feature", location: "join(2981..3000,1..40)", qualifiers: ['/label="crosses the origin"'] },
];

/**
 * A GenBank LOCUS line, with each field in the column the format puts it in. Getting the spacing
 * wrong makes the reader complain, so it is worked out once here rather than typed out twice.
 *
 * @param name - What the record is called.
 * @param length - How many bases it has.
 * @param circular - Whether it is a circle.
 * @returns The line.
 */
const locusLine = (name: string, length: number, circular: boolean): string =>
  `LOCUS       ${name.padEnd(16)} ${String(length).padStart(11)} bp    DNA     ${(circular ? "circular" : "linear").padEnd(8)} SYN 01-JAN-2000`;

/**
 * The sample plasmid as a GenBank file, with those features, to feed through the real reader.
 *
 * @returns The file's text.
 */
export function sampleGenBank(): string {
  const sequence = samplePlasmid().toLowerCase();
  const lines = [
    locusLine(SAMPLE_NAME, sequence.length, true),
    "DEFINITION  Synthetic demonstration plasmid (random sequence, made-up features).",
    `ACCESSION   ${SAMPLE_NAME}`,
    `VERSION     ${SAMPLE_NAME}`,
    "KEYWORDS    .",
    "SOURCE      synthetic construct",
    "  ORGANISM  synthetic construct",
    "FEATURES             Location/Qualifiers",
    ...SAMPLE_FEATURES.flatMap((feature) => [`     ${feature.type.padEnd(16)}${feature.location}`, ...feature.qualifiers.map((qualifier) => `                     ${qualifier}`)]),
    "ORIGIN",
  ];
  for (let i = 0; i < sequence.length; i += 60) lines.push(`${String(i + 1).padStart(9)} ${(sequence.slice(i, i + 60).match(/.{1,10}/g) ?? []).join(" ")}`);
  lines.push("//", "");
  return lines.join("\n");
}

/**
 * The sample's features in the plain shape a map draws, as the reader gives them for
 * `sampleGenBank()`. Having them ready means the first thing a visitor sees is a map, before any
 * file has been read.
 *
 * @returns Six features, 0-based with the end left out.
 */
export function sampleFeatures(): { type: string; label: string; strand: number; parts: { start: number; end: number }[] }[] {
  return [
    { type: "promoter", label: "promoter", strand: 1, parts: [{ start: 299, end: 380 }] },
    { type: "CDS", label: "demo", strand: 1, parts: [{ start: 419, end: 1240 }] },
    { type: "terminator", label: "terminator", strand: 1, parts: [{ start: 1261, end: 1310 }] },
    { type: "rep_origin", label: "origin of replication", strand: 1, parts: [{ start: 1479, end: 2060 }] },
    { type: "CDS", label: "res", strand: -1, parts: [{ start: 2179, end: 2940 }] },
    { type: "misc_feature", label: "crosses the origin", strand: 1, parts: [{ start: 2980, end: 3000 }, { start: 0, end: 40 }] },
  ];
}

/** What the sample insert is called. */
export const SAMPLE_INSERT_NAME = "newGene";

/** The sites the sample insert must hold once, and no accidental copy of. */
const INSERT_SITES: [number, string][] = [[20, "GAATTC"], [860, "GGTACC"]];

/**
 * A made-up linear fragment to clone into the sample plasmid: a gene with an EcoRI site in front of
 * it and a KpnI site behind it. Those two are chosen because each cuts the sample plasmid exactly
 * once, which is what opening a backbone in one place needs, and because one leaves a 5′ overhang
 * and the other a 3′ overhang, so the fragment can only go in one way round.
 *
 * Bases that happen to spell either site anywhere else are changed, so each enzyme cuts the fragment
 * exactly once and the result is one clean piece.
 *
 * @returns 880 bases.
 */
export function sampleInsert(): string {
  const next = seeded(7);
  let bases = "";
  for (let i = 0; i < 880; i++) bases += "ACGT"[Math.floor(next() * 4)];
  for (const [at, site] of INSERT_SITES) bases = bases.slice(0, at) + site + bases.slice(at + site.length);
  // Anywhere else those two sites turn up by chance, one base is changed to break them.
  for (const [, site] of INSERT_SITES) {
    for (let at = bases.indexOf(site); at !== -1; at = bases.indexOf(site, at + 1)) {
      if (INSERT_SITES.some(([planted]) => planted === at)) continue;
      const base = bases[at + 2];
      bases = `${bases.slice(0, at + 2)}${base === "A" ? "C" : "A"}${bases.slice(at + 3)}`;
    }
  }
  return bases;
}

/**
 * The sample insert as a GenBank file, so the gene on it is carried into whatever it is cloned into.
 *
 * @returns The file's text.
 */
export function sampleInsertGenBank(): string {
  const sequence = sampleInsert().toLowerCase();
  const lines = [
    locusLine(SAMPLE_INSERT_NAME, sequence.length, false),
    "DEFINITION  Synthetic demonstration insert (random sequence, made-up features).",
    `ACCESSION   ${SAMPLE_INSERT_NAME}`,
    `VERSION     ${SAMPLE_INSERT_NAME}`,
    "KEYWORDS    .",
    "SOURCE      synthetic construct",
    "  ORGANISM  synthetic construct",
    "FEATURES             Location/Qualifiers",
    "     CDS             40..840",
    '                     /gene="newGene"',
    '                     /product="the gene being cloned"',
    "ORIGIN",
  ];
  for (let i = 0; i < sequence.length; i += 60) lines.push(`${String(i + 1).padStart(9)} ${(sequence.slice(i, i + 60).match(/.{1,10}/g) ?? []).join(" ")}`);
  lines.push("//", "");
  return lines.join("\n");
}

/**
 * Three pieces of the sample plasmid to assemble back into it.
 *
 * With `overlapping`, each piece ends with the 25 bases the next one starts with, which is what a
 * Gibson assembly needs and what the tool searches for. Without it, the pieces simply butt together,
 * which is what fragments straight off a gel look like: nothing joins them until primers give them
 * overlaps.
 *
 * @param overlapping - Whether the pieces should share their ends.
 * @returns Three fragments, in the order they go round.
 */
export function sampleFragments(overlapping = true): { name: string; dna: string }[] {
  const plasmid = samplePlasmid(), overlap = overlapping ? 25 : 0;
  const cuts = [0, 1000, 2000, plasmid.length];
  return [0, 1, 2].map((piece) => ({
    name: `piece ${piece + 1}`,
    // The last piece wraps round the origin to pick up the start of the first.
    dna: plasmid.slice(cuts[piece], cuts[piece + 1]) + (piece === 2 ? plasmid.slice(0, overlap) : plasmid.slice(cuts[piece + 1], cuts[piece + 1] + overlap)),
  }));
}

/**
 * A handful of made-up sequencing reads as a FASTQ file, so the tool has something with a quality
 * score for every base. Quality is the thing most formats cannot hold, which is the point of it.
 *
 * @returns The file's text: four reads of 60 bases.
 */
export function sampleReads(): string {
  const plasmid = samplePlasmid(), next = seeded(99);
  const lines: string[] = [];
  for (let read = 0; read < 4; read += 1) {
    const from = read * 400 + 120, bases = plasmid.slice(from, from + 60);
    // Quality falls off towards the end of a read, as it does on a real sequencer.
    const scores = [...bases].map((_, at) => Math.max(12, Math.round(40 - at * 0.35 - next() * 6)));
    lines.push(`@read${read + 1} from base ${from + 1}`, bases, "+", scores.map((score) => String.fromCharCode(33 + score)).join(""));
  }
  return `${lines.join("\n")}\n`;
}

/**
 * Two versions of the same short stretch, as two isolates of the same organism might give: the
 * sample plasmid's bases 401 to 700, and a copy with a few bases changed and three taken out.
 *
 * It is made up, but it is the shape of the real thing: mostly identical, with scattered
 * substitutions and one small deletion, which is what an alignment is for.
 *
 * @returns The two sequences and what to call them.
 */
export function sampleRelatives(): { name: string; dna: string }[] {
  const original = samplePlasmid().slice(400, 700);
  const next = seeded(123);
  let changed = [...original];
  // A dozen single-base changes, scattered.
  for (let made = 0; made < 12; made += 1) {
    const at = Math.floor(next() * changed.length);
    const others = ["A", "C", "G", "T"].filter((base) => base !== changed[at]);
    changed[at] = others[Math.floor(next() * 3)];
  }
  // And one short deletion, a third of the way along.
  changed = [...changed.slice(0, 96), ...changed.slice(99)];
  return [{ name: "isolate A", dna: original }, { name: "isolate B", dna: changed.join("") }];
}

/**
 * Six made-up sequences with a family history: one ancestor, two groups that each went their own
 * way, and one outlier that left long before either.
 *
 * They are all the same length and carry no gaps, so they are an alignment as they stand. The point
 * is that the history is known, so a tree built from them can be checked against it.
 *
 * @returns Six aligned sequences of 240 bases.
 */
export function sampleFamily(): { name: string; letters: string }[] {
  const next = seeded(2024);
  let ancestor = "";
  for (let i = 0; i < 240; i += 1) ancestor += "ACGT"[Math.floor(next() * 4)];
  /** A copy with some bases changed, which is one line of descent. */
  const mutate = (dna: string, count: number): string => {
    const out = [...dna];
    for (let made = 0; made < count; made += 1) {
      const at = Math.floor(next() * out.length);
      const others = ["A", "C", "G", "T"].filter((base) => base !== out[at]);
      out[at] = others[Math.floor(next() * 3)];
    }
    return out.join("");
  };
  const north = mutate(ancestor, 10), south = mutate(ancestor, 10);
  return [
    { name: "north-1", letters: mutate(north, 3) },
    { name: "north-2", letters: mutate(north, 4) },
    { name: "north-3", letters: mutate(north, 6) },
    { name: "south-1", letters: mutate(south, 3) },
    { name: "south-2", letters: mutate(south, 5) },
    { name: "outgroup", letters: mutate(ancestor, 40) },
  ];
}

/** A tree to start from, in Newick, with branch lengths and support values on the forks. */
export const SAMPLE_NEWICK =
  "(((north-1:0.014,north-2:0.015)98:0.037,north-3:0.020)86:0.046,(south-1:0.017,south-2:0.017)99:0.040,outgroup:0.102);";

/** Standard backbone geometry, in ångströms and degrees, which every protein shares. */
const BACKBONE = { nCa: 1.458, caC: 1.525, cN: 1.329, nCaC: 111.2, caCN: 116.2, cNCa: 121.7, omega: 180 };

/** The torsion angles of the two shapes a backbone most often takes. */
const SHAPES = { helix: { phi: -57, psi: -47 }, strand: { phi: -139, psi: 135 }, turn: { phi: -60, psi: -30 } };

/**
 * Place an atom from the three before it, given the bond length, angle and torsion it should make.
 *
 * This is the standard way of turning internal coordinates into Cartesian ones, used here to build a
 * backbone whose torsions are known in advance, so that measuring them back is a real check.
 *
 * @param a - The first of the three atoms already placed.
 * @param b - The second.
 * @param c - The third, which the new atom bonds to.
 * @param length - The bond length to `c`.
 * @param angleDeg - The angle b-c-new.
 * @param torsionDeg - The torsion a-b-c-new.
 * @returns The new atom's position.
 */
function placeAtom(a: number[], b: number[], c: number[], length: number, angleDeg: number, torsionDeg: number): number[] {
  const angle = (angleDeg * Math.PI) / 180, torsion = (torsionDeg * Math.PI) / 180;
  const minus = (p: number[], q: number[]) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
  const unit = (p: number[]) => { const size = Math.hypot(p[0], p[1], p[2]); return [p[0] / size, p[1] / size, p[2] / size]; };
  const cross = (p: number[], q: number[]) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const along = unit(minus(c, b));
  const normal = unit(cross(minus(b, a), along));
  const third = cross(normal, along);
  const step = [-length * Math.cos(angle), length * Math.sin(angle) * Math.cos(torsion), length * Math.sin(angle) * Math.sin(torsion)];
  return [0, 1, 2].map((axis) => c[axis] + step[0] * along[axis] + step[1] * third[axis] + step[2] * normal[axis]);
}

/**
 * A made-up 24-residue peptide as a PDB file: ten residues of helix, a four-residue turn, then ten of
 * strand.
 *
 * It is built from torsion angles rather than copied from anywhere, so nothing here is somebody
 * else's data, and the angles it was built with are known: measuring them back out of the file is a
 * check that the reading and the geometry agree.
 *
 * @returns The file's text.
 */
export function sampleStructure(): string {
  const shapes = [...Array(10).fill(SHAPES.helix), ...Array(4).fill(SHAPES.turn), ...Array(10).fill(SHAPES.strand)];
  // The first residue is placed by hand; the rest follow from the torsions.
  let backbone = [[0, 0, 0], [BACKBONE.nCa, 0, 0], [2.009, 1.420, 0]];
  const residues: { name: string; atoms: { name: string; xyz: number[] }[] }[] = [];
  const named = (atoms: number[][]) => [{ name: "N", xyz: atoms[0] }, { name: "CA", xyz: atoms[1] }, { name: "C", xyz: atoms[2] }];
  residues.push({ name: "ALA", atoms: named(backbone) });
  for (let at = 1; at < shapes.length; at += 1) {
    const [n, ca, c] = backbone;
    const nextN = placeAtom(n, ca, c, BACKBONE.cN, BACKBONE.caCN, shapes[at - 1].psi);
    const nextCa = placeAtom(ca, c, nextN, BACKBONE.nCa, BACKBONE.cNCa, BACKBONE.omega);
    const nextC = placeAtom(c, nextN, nextCa, BACKBONE.caC, BACKBONE.nCaC, shapes[at].phi);
    backbone = [nextN, nextCa, nextC];
    residues.push({ name: at < 10 ? "ALA" : at < 14 ? "GLY" : "VAL", atoms: named(backbone) });
  }
  const lines: string[] = [
    "HEADER    DE NOVO PROTEIN                         01-JAN-00   0DEM",
    "TITLE     SYNTHETIC DEMONSTRATION PEPTIDE: HELIX, TURN AND STRAND",
    "COMPND    MOL_ID: 1; MOLECULE: DEMONSTRATION PEPTIDE; CHAIN: A",
    "EXPDTA    THEORETICAL MODEL",
  ];
  let serial = 0;
  for (const [at, residue] of residues.entries()) {
    for (const atom of residue.atoms) {
      serial += 1;
      lines.push(
        `ATOM  ${String(serial).padStart(5)} ${atom.name.padEnd(4)} ${residue.name} A${String(at + 1).padStart(4)}    ` +
        `${atom.xyz.map((value) => value.toFixed(3).padStart(8)).join("")}  1.00 20.00           ${atom.name[0]}`);
    }
  }
  lines.push("TER", "END", "");
  return lines.join("\n");
}

/** What the sample peptide is called, and the torsions each part was built with. */
export const SAMPLE_STRUCTURE = { id: "0DEM", helix: SHAPES.helix, strand: SHAPES.strand, turn: SHAPES.turn };
