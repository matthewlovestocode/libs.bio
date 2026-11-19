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
 * The sample plasmid as a GenBank file, with those features, to feed through the real reader.
 *
 * @returns The file's text.
 */
export function sampleGenBank(): string {
  const sequence = samplePlasmid().toLowerCase();
  const lines = [
    `LOCUS       ${SAMPLE_NAME}                   ${sequence.length} bp    DNA     circular SYN 01-JAN-2000`,
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
