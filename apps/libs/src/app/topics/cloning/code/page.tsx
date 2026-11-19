import type { Metadata } from "next";
import Link from "next/link";
import { Code as Highlighted } from "@/components/Code.tsx";
import { type Molecule, assemble, digestOf, ligate, planOverlaps } from "@/lib/clone.ts";
import { readSequenceFile } from "@/lib/files.ts";
import { SAMPLE_INSERT_NAME, SAMPLE_NAME, sampleFragments, sampleGenBank, sampleInsertGenBank } from "@/lib/sample.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.cloning.title}: ${text.views.code}` };

/** Cutting and ligating, as somebody would write it. */
const SOURCE = `import { cloneProducts, describePiece, lookupEnzymes, piecesOf } from "@biolibs/cloning";

// What the enzymes give you. A circle with n cuts gives n pieces; a line gives n + 1.
const { enzymes } = lookupEnzymes(["EcoRI", "KpnI"]);
piecesOf(vector, enzymes).map(describePiece);

// Every circle the two can be ligated into, largest backbone first.
const result = cloneProducts(vector, insert, ["EcoRI", "KpnI"]);
if (result.ok) {
  result.products[0].description;
  result.products[0].record;        // a SeqRecord, topology "circular", with both pieces' features
}`;

/** Assembling by overlap, as somebody would write it. */
const GIBSON = `import { assembleGibson, overlapLength } from "@biolibs/cloning";

// The whole method rests on this: which end matches which start, and for how long.
overlapLength(pieceOne, pieceTwo, 15, 60);

const found = assembleGibson([
  { name: "piece 1", residues: one },
  { name: "piece 2", residues: two },
  { name: "piece 3", residues: three },
], { minOverlap: 20 });`;

/** Designing the overlaps, as somebody would write it. */
const DESIGN = `import { designGibson } from "@biolibs/cloning";

// Fragments that do not overlap yet, in the order they are to go round.
const plan = designGibson(pieces, { overlap: 25 });
if (plan.ok) for (const primer of plan.design.primers) {
  primer.tail;               // the 5' part that reaches into the neighbour and makes the overlap
  primer.binding;            // the part that binds the template
  primer.binding_report.tm;  // which is what sets the annealing temperature
}`;

const PACKAGES = [
  { name: "cloning", note: text.code.cloning },
  { name: "restriction", note: text.code.restriction },
  { name: "pcr", note: text.code.pcrPackage },
  { name: "seqrecord", note: text.code.seqrecord },
] as const;

/** A file's first record as a molecule, the way the Do view takes one. */
async function open(fileName: string, contents: string): Promise<Molecule> {
  const record = (await readSequenceFile(fileName, new TextEncoder().encode(contents))).records[0];
  return { name: record.name, dna: record.sequence, circular: record.circular ?? false, features: record.features };
}

/** Code: the calls the tool makes, with what they give, worked out when the page is built. */
export default async function Code() {
  // Run for real, here, so the output on the page cannot drift from what the packages do.
  const vector = await open(`${SAMPLE_NAME}.gb`, sampleGenBank());
  const insert = await open(`${SAMPLE_INSERT_NAME}.gb`, sampleInsertGenBank());
  const cutVector = digestOf(vector, ["EcoRI", "KpnI"]);
  const cutInsert = digestOf(insert, ["EcoRI", "KpnI"]);
  const joined = ligate(vector, insert, ["EcoRI", "KpnI"]);
  const found = assemble(sampleFragments(true), 20);
  const plan = planOverlaps(sampleFragments(false), 25);
  const piece = (one: { length: number; left: string | null; right: string | null }) => `"${one.length} bp (${one.left ?? "blunt"} to ${one.right ?? "blunt"})"`;
  const cut = [
    `// the vector, cut`,
    `piecesOf(vector, enzymes).map(describePiece)   // [${cutVector.pieces.map(piece).join(", ")}]`,
    `// the insert, cut`,
    `piecesOf(insert, enzymes).map(describePiece)   // [${cutInsert.pieces.map(piece).join(", ")}]`,
    ``,
    ...(joined.ok
      ? [
        `result.products.length                // ${joined.products.length}`,
        ...joined.products.map((product, index) => `result.products[${index}].description   // "${product.description}"`),
        `result.products[0].record.features.length   // ${joined.products[0].features.length}, carried over from both pieces`,
      ]
      : [`result.error                          // "${joined.error}"`]),
  ].join("\n");
  const assembled = found.ok
    ? [
      `found.products.length                 // ${found.products.length}`,
      `found.products[0].length              // ${found.products[0].length}`,
      `found.products[0].junctions           // ${JSON.stringify(found.products[0].junctions.map((junction) => junction.detail))}`,
    ].join("\n")
    : `found.error   // "${found.error}"`;
  const designed = plan.ok
    ? [
      `plan.design.primers.length            // ${plan.primers.length}`,
      ...plan.primers.slice(0, 2).map((primer) => `// ${primer.name.padEnd(12)} tail ${String(primer.tail.length).padStart(2)} + binding ${String(primer.binding.length).padStart(2)} bases, ${primer.tm.toFixed(1)} °C`),
      `plan.design.length                    // ${plan.length}`,
    ].join("\n")
    : `plan.error   // "${plan.error}"`;
  return (
    <div className="flat">
      <h2>{text.code.heading}</h2>
      <p>{text.code.cloneIntro}</p>
      <Highlighted code={SOURCE} />
      <h3>{text.code.output}</h3>
      <Highlighted code={cut} />
      <h3>{text.code.cloneGibson}</h3>
      <p>{text.code.cloneGibsonIntro}</p>
      <Highlighted code={GIBSON} />
      <h3>{text.code.output}</h3>
      <Highlighted code={assembled} />
      <h3>{text.code.cloneDesign}</h3>
      <p>{text.code.cloneDesignIntro}</p>
      <Highlighted code={DESIGN} />
      <h3>{text.code.output}</h3>
      <Highlighted code={designed} />
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
      <Highlighted language="bash" code="npm install @biolibs/cloning" />
      <p className="quiet">{text.code.reference} <Link href="/api">{text.api.title}</Link></p>
    </div>
  );
}
