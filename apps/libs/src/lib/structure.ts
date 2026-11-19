/**
 * Reading a structure file and measuring what is in it.
 *
 * The parsing, the hierarchy, the torsions and the neighbour search are all `@biolibs/pdb`'s. What
 * this file does is reduce a structure to the plain numbers a page can draw: a contact map, a
 * scatter of backbone torsions, and a list of what is in each chain.
 */
import { MMCIFParser, NeighborSearch, PDBParser, PPBuilder, ShrakeRupley, proteinLetters3to1 } from "@biolibs/pdb";

/** Past this many residues a contact map is more pixels than a page can use. */
export const MOST_RESIDUES = 400;

/** How close two residues' α-carbons have to be to count as touching, in ångströms. */
export const CONTACT_AT = 8;

/** What one chain holds. */
export interface ChainReport {
  id: string;
  /** How many residues are amino acids, as against water and everything else. */
  residues: number;
  /** The sequence in one-letter code, with `X` for anything unrecognised. */
  sequence: string;
  atoms: number;
  /** Water molecules, which a crystal structure carries a great many of. */
  waters: number;
  /** Everything that is neither an amino acid nor water: ligands, ions, sugars. */
  other: string[];
}

/** One residue's place in the backbone's two turning angles. */
export interface Torsions {
  /** Which residue it is, counted from 1 along the chain. */
  at: number;
  name: string;
  /** The turn about the N–Cα bond, in degrees, or `null` at the start of a chain. */
  phi: number | null;
  /** The turn about the Cα–C bond, or `null` at the end. */
  psi: number | null;
}

/** A structure, in the plain values a page needs. */
export interface Structure {
  id: string;
  /** What the file calls it, where it says. */
  title: string;
  /** How the structure was determined, where the file says. */
  method: string;
  /** How many models the file holds. An NMR file holds many; a crystal file holds one. */
  models: number;
  chains: ChainReport[];
  atoms: number;
  /** The α-carbon of every amino acid in the first model, in order, for the contact map. */
  alphaCarbons: { chain: string; at: number; name: string; xyz: number[] }[];
  torsions: Torsions[];
  /** Whether the structure was cut down because it is larger than a page can draw. */
  trimmed: boolean;
}

/** What came of reading a file. */
export type Attempt = { ok: true; structure: Structure } | { ok: false; error: string };

/** A residue's one-letter code, or `X` where the libraries do not know the name. */
function letterOf(name: string): string {
  const letters = proteinLetters3to1 as unknown as Record<string, string> | Map<string, string>;
  const found = letters instanceof Map ? letters.get(name) : letters[name];
  return typeof found === "string" ? found : "X";
}

/** Whether a residue is an amino acid, which its id says: a blank het field means a polymer residue. */
const isResidue = (residue: { id: unknown[] }): boolean => String(residue.id[0]).trim() === "";

/** Whether a residue is water, which the PDB marks with its own het code. */
const isWater = (residue: { id: unknown[] }): boolean => String(residue.id[0]).trim() === "W";

/**
 * Read a structure file.
 *
 * @param text - The file's contents.
 * @param id - What to call the structure.
 * @param format - `"pdb"` or `"cif"`. A file is read as what it says it is.
 * @returns Everything a page needs, or why it could not be read.
 */
export function readStructure(text: string, id: string, format: "pdb" | "cif"): Attempt {
  if (text.trim() === "") return { ok: false, error: "empty" };
  try {
    const parser = format === "cif" ? new MMCIFParser({ quiet: true }) : new PDBParser({ quiet: true });
    const structure = parser.getStructure(id, text) as unknown as {
      header?: Record<string, unknown>;
      [Symbol.iterator]: () => Iterator<unknown>;
      getAtoms: () => Iterable<unknown>;
    };
    const models = [...(structure as Iterable<unknown>)] as {
      [Symbol.iterator]: () => Iterator<{ id: string; [Symbol.iterator]: () => Iterator<{ id: unknown[]; resname: string; get: (name: string) => unknown; [Symbol.iterator]: () => Iterator<unknown> }> }>;
    }[];
    if (models.length === 0) return { ok: false, error: "no models" };
    const first = [...(models[0] as unknown as Iterable<{ id: string; [Symbol.iterator]: () => Iterator<{ id: unknown[]; resname: string; get: (name: string) => unknown; [Symbol.iterator]: () => Iterator<unknown> }> }>)];

    const chains: ChainReport[] = [];
    const alphaCarbons: Structure["alphaCarbons"] = [];
    let trimmed = false;
    for (const chain of first) {
      const report: ChainReport = { id: String(chain.id), residues: 0, sequence: "", atoms: 0, waters: 0, other: [] };
      const letters: string[] = [];
      for (const residue of [...(chain as unknown as Iterable<{ id: unknown[]; resname: string; get: (name: string) => unknown; [Symbol.iterator]: () => Iterator<unknown> }>)]) {
        const atomCount = [...(residue as unknown as Iterable<unknown>)].length;
        report.atoms += atomCount;
        if (isWater(residue)) { report.waters += 1; continue; }
        if (!isResidue(residue)) { if (!report.other.includes(residue.resname.trim())) report.other.push(residue.resname.trim()); continue; }
        report.residues += 1;
        letters.push(letterOf(residue.resname.trim()));
        const alpha = residue.get("CA") as { coord?: Float32Array } | undefined;
        if (alpha?.coord !== undefined) {
          if (alphaCarbons.length < MOST_RESIDUES) alphaCarbons.push({ chain: String(chain.id), at: report.residues, name: residue.resname.trim(), xyz: [...alpha.coord] });
          else trimmed = true;
        }
      }
      report.sequence = letters.join("");
      chains.push(report);
    }

    // The torsions come from the library's own polypeptide builder, which decides what counts as a
    // connected run of residues.
    const torsions: Torsions[] = [];
    try {
      const peptides = new PPBuilder().buildPeptides(structure as never) as unknown as {
        getPhiPsiList: () => [unknown, unknown][];
        [Symbol.iterator]: () => Iterator<{ resname: string }>;
      }[];
      for (const peptide of peptides) {
        const residues = [...(peptide as unknown as Iterable<{ resname: string }>)];
        peptide.getPhiPsiList().forEach(([phi, psi], at) => {
          const degrees = (value: unknown) => (typeof value === "number" ? (value * 180) / Math.PI : null);
          torsions.push({ at: torsions.length + 1, name: residues[at]?.resname.trim() ?? "", phi: degrees(phi), psi: degrees(psi) });
        });
      }
    } catch { /* a structure with no complete backbone simply has no torsions to show */ }

    const header = (structure.header ?? {}) as Record<string, unknown>;
    const said = (key: string) => (typeof header[key] === "string" && header[key] !== "" ? String(header[key]) : "");
    return {
      ok: true,
      structure: {
        id, title: said("name") || said("head"), method: said("structure_method"),
        models: models.length, chains, atoms: [...structure.getAtoms()].length, alphaCarbons, torsions, trimmed,
      },
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** The distance between two points in space. */
const apart = (a: number[], b: number[]): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/**
 * Every α-carbon against every other, which is what a contact map draws.
 *
 * @param alphaCarbons - The α-carbons, in order along the chains.
 * @returns A square of distances in ångströms.
 */
export function contactMap(alphaCarbons: Structure["alphaCarbons"]): number[][] {
  return alphaCarbons.map((one) => alphaCarbons.map((other) => apart(one.xyz, other.xyz)));
}

/** Two residues close enough to be touching. */
export interface Contact {
  from: { chain: string; at: number; name: string };
  to: { chain: string; at: number; name: string };
  distance: number;
  /** Whether the two are far apart along the chain, which is what makes a contact interesting. */
  distant: boolean;
}

/**
 * The residues that touch, found with the library's neighbour search rather than by comparing
 * everything with everything.
 *
 * The file is parsed again here because `NeighborSearch` works on real atoms: it asks each one for
 * its coordinates, so a plain point will not do.
 *
 * @param text - The file's contents.
 * @param id - What to call the structure.
 * @param format - Which format it is.
 * @param within - How close counts as touching, in ångströms.
 * @returns The touching pairs, closest first, or an empty list when the file has no α-carbons.
 * @throws If the file cannot be read.
 */
export function contactsIn(text: string, id: string, format: "pdb" | "cif", within: number): Contact[] {
  const parser = format === "cif" ? new MMCIFParser({ quiet: true }) : new PDBParser({ quiet: true });
  const structure = parser.getStructure(id, text) as unknown as { getAtoms: () => Iterable<unknown> };
  type AnAtom = { name: string; coord: Float32Array; getParent: () => { id: unknown[]; resname: string; getParent: () => { id: string } } };
  const alphas = [...structure.getAtoms()].filter((atom) => (atom as AnAtom).name === "CA") as AnAtom[];
  if (alphas.length < 2) return [];
  const where = (atom: AnAtom) => {
    const residue = atom.getParent();
    return { chain: String(residue.getParent().id), at: Number(residue.id[1]), name: residue.resname.trim() };
  };
  const search = new NeighborSearch(alphas as never);
  const found: Contact[] = [];
  for (const pair of search.searchAll(within) as unknown as AnAtom[][]) {
    const one = where(pair[0]), other = where(pair[1]);
    const [from, to] = one.at <= other.at ? [one, other] : [other, one];
    const distance = apart([...pair[0].coord], [...pair[1].coord]);
    found.push({ from, to, distance, distant: from.chain !== to.chain || to.at - from.at > 4 });
  }
  return found.sort((a, b) => a.distance - b.distance);
}

/**
 * How much of the structure the solvent can reach, in square ångströms.
 *
 * @param text - The file's contents.
 * @param id - What to call the structure.
 * @param format - Which format it is.
 * @returns The area, or `null` when it cannot be worked out.
 */
export function surfaceArea(text: string, id: string, format: "pdb" | "cif"): number | null {
  try {
    const parser = format === "cif" ? new MMCIFParser({ quiet: true }) : new PDBParser({ quiet: true });
    const structure = parser.getStructure(id, text);
    new ShrakeRupley().compute(structure as never, "S");
    const area = (structure as unknown as { sasa?: number }).sasa;
    return typeof area === "number" ? area : null;
  } catch {
    return null;
  }
}

/**
 * Fetch a structure from the Protein Data Bank.
 *
 * The browser asks RCSB directly, so RCSB sees which entry is wanted and nothing else on the page
 * contacts anybody.
 *
 * @param id - A four-character PDB id, such as `1CRN`.
 * @returns The file's text and what it is called.
 * @throws If the id is not four characters, or the entry cannot be fetched.
 */
export async function fetchStructure(id: string): Promise<{ text: string; id: string }> {
  const tidy = id.trim().toUpperCase();
  if (!/^[0-9A-Z]{4}$/.test(tidy)) throw new Error("A PDB id is four characters, such as 1CRN.");
  const response = await fetch(`https://files.rcsb.org/download/${tidy}.pdb`);
  if (!response.ok) throw new Error(`The Protein Data Bank answered ${response.status}.`);
  return { text: await response.text(), id: tidy };
}
