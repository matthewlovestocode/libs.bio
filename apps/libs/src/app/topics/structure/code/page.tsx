import type { Metadata } from "next";
import Link from "next/link";
import { Code as Highlighted } from "@/components/Code.tsx";
import { SAMPLE_STRUCTURE, sampleStructure } from "@/lib/sample.ts";
import { CONTACT_AT, contactsIn, readStructure, surfaceArea } from "@/lib/structure.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.structure.title}: ${text.views.code}` };

/** Reading a structure, as somebody would write it. */
const SOURCE = `import { PDBParser } from "@biolibs/pdb";

// getStructure takes the file's contents, not a name: there is no file system here.
const structure = new PDBParser({ quiet: true }).getStructure("0DEM", pdbText);

[...structure].length;                    // models
[...structure.getResidues()].length;      // residues
[...structure.getAtoms()].length;         // atoms

// Every level is iterable and indexable by id.
const model = [...structure][0];
const chain = [...model][0];
const residue = [...chain][1];
const alpha = residue.get("CA");

chain.id;                                 // "A"
residue.resname;                          // "ALA"
alpha.coord;                              // its position in space
alpha.minus(residue.get("N"));            // the distance to another atom`;

/** Measuring the shape, as somebody would write it. */
const SHAPE = `import { NeighborSearch, PPBuilder, ShrakeRupley } from "@biolibs/pdb";

// The backbone's two turning angles, per residue, in radians.
const [peptide] = new PPBuilder().buildPeptides(structure);
peptide.getPhiPsiList();

// Which residues are near which, over a KD-tree rather than every pair.
const search = new NeighborSearch([...structure.getAtoms()]);
search.searchAll(8);                      // pairs within 8 Å

// How much of it the solvent can reach.
new ShrakeRupley().compute(structure, "S");
structure.sasa;`;

const PACKAGES = [
  { name: "pdb", note: text.code.pdb },
] as const;

/** Code: the calls the tool makes, with what they give, worked out when the page is built. */
export default function Code() {
  // Run for real, here, so the output on the page cannot drift from what the packages do.
  const pdb = sampleStructure();
  const result = readStructure(pdb, SAMPLE_STRUCTURE.id, "pdb");
  const area = surfaceArea(pdb, SAMPLE_STRUCTURE.id, "pdb");
  const read = !result.ok ? [`// ${result.error}`] : [
    `[...structure].length                 // ${result.structure.models}`,
    `[...structure.getResidues()].length   // ${result.structure.chains.reduce((sum, one) => sum + one.residues, 0)}`,
    `[...structure.getAtoms()].length      // ${result.structure.atoms}`,
    `chain.id                              // "${result.structure.chains[0]?.id ?? ""}"`,
    `// the sequence: ${result.structure.chains[0]?.sequence ?? ""}`,
  ];
  const measured = !result.ok ? [] : (() => {
    const torsions = result.structure.torsions;
    const middle = (from: number, to: number, which: "phi" | "psi") => {
      const values = torsions.slice(from, to).map((one) => one[which]).filter((one): one is number => one !== null);
      return values.length === 0 ? "—" : (values.reduce((sum, one) => sum + one, 0) / values.length).toFixed(1);
    };
    const touching = contactsIn(pdb, SAMPLE_STRUCTURE.id, "pdb", CONTACT_AT).filter((one) => one.distant);
    return [
      `// built with   helix φ ${SAMPLE_STRUCTURE.helix.phi} ψ ${SAMPLE_STRUCTURE.helix.psi}, strand φ ${SAMPLE_STRUCTURE.strand.phi} ψ ${SAMPLE_STRUCTURE.strand.psi}`,
      `// measured      helix φ ${middle(1, 9, "phi")} ψ ${middle(1, 9, "psi")}, strand φ ${middle(15, 23, "phi")} ψ ${middle(15, 23, "psi")}`,
      ``,
      `searchAll(${CONTACT_AT})   // ${touching.length} pairs more than four apart along the chain`,
      `structure.sasa   // ${area === null ? "—" : area.toFixed(1)} Å²`,
    ];
  })();
  return (
    <div className="flat">
      <h2>{text.code.heading}</h2>
      <p>{text.code.structureIntro}</p>
      <Highlighted code={SOURCE} />
      <h3>{text.code.output}</h3>
      <Highlighted code={read.join("\n")} />
      <h3>{text.code.structureShape}</h3>
      <p>{text.code.structureShapeIntro}</p>
      <Highlighted code={SHAPE} />
      <h3>{text.code.output}</h3>
      <Highlighted code={measured.join("\n")} />
      <h3>{text.code.packages}</h3>
      <ul className="packages">
        {PACKAGES.map((one) => (
          <li key={one.name}>
            <Link href={`/api/${one.name}`}><code>@biolibs/{one.name}</code></Link> · <a href={`https://www.npmjs.com/package/@biolibs/${one.name}`}>{text.code.readme}</a>
            <span className="quiet">{one.note}</span>
          </li>
        ))}
      </ul>
      <h3>{text.code.install}</h3>
      <Highlighted language="bash" code="npm install @biolibs/pdb" />
      <p className="quiet">{text.code.reference} <Link href="/api">{text.api.title}</Link></p>
    </div>
  );
}
