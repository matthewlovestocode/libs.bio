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
