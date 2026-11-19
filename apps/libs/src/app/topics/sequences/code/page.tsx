import type { Metadata } from "next";
import Link from "next/link";
import { Code as Highlighted } from "@/components/Code.tsx";
import { samplePlasmid } from "@/lib/sample.ts";
import { codes, forms, frames, measure, orfs } from "@/lib/sequence.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.sequences.title}: ${text.views.code}` };

/** Measuring and transforming, as somebody would write it. */
const SOURCE = `import { Seq, translate, CodonTable } from "@biolibs/seq";
import { gcFraction, gcSkew, molecularWeight, countChar } from "@biolibs/seqtools";

const dna = new Seq(sequence);

// The same molecule, written four ways.
dna.complement();          // the other strand, under this one
dna.reverseComplement();   // that strand written on its own
dna.transcribe();          // T becomes U

// What it is made of.
gcFraction(sequence);                      // 0 to 1
molecularWeight(sequence, "DNA", true);    // daltons, double-stranded

// Reading it as protein. The second argument is an NCBI table id or name.
translate(sequence, 1);
CodonTable.unambiguousDnaById.get(1).startCodons;`;

/** Six frames, as somebody would write it. */
const FRAMES = `// Three frames along this strand, three along the other.
for (const start of [0, 1, 2]) {
  translate(sequence.slice(start, start + Math.floor((sequence.length - start) / 3) * 3), 1);
}
const other = String(new Seq(sequence).reverseComplement());
// ... and the same three along "other".`;

const PACKAGES = [
  { name: "seq", note: text.code.seqPackage },
  { name: "seqtools", note: text.code.seqtools },
] as const;

/** Code: the calls the tool makes, with what they give, worked out when the page is built. */
export default function Code() {
  // Run for real, here, so the output on the page cannot drift from what the packages do.
  const dna = samplePlasmid();
  const measured = measure(dna);
  const written = forms(dna);
  const six = frames(dna, 1);
  const found = orfs(dna, 1, 100, true);
  const best = found[0];
  const measurements = [
    `sequence.length                  // ${measured.length}`,
    `gcFraction(sequence)             // ${measured.gc.toFixed(4)}`,
    `molecularWeight(..., true)       // ${measured.double === null ? "—" : measured.double.toFixed(1)}`,
    `countChar(sequence, "A")         // ${measured.counts[0].count}`,
    `dna.reverseComplement()          // "${written.reverseComplement.slice(0, 30)}..."`,
    `dna.transcribe()                 // "${written.rna.slice(0, 30)}..."`,
  ].join("\n");
  const read = [
    ...six.map((one) => `// frame ${(one.number > 0 ? `+${one.number}` : String(one.number)).padStart(2)}  ${String(one.protein.length).padStart(4)} amino acids, ${String(one.stops).padStart(3)} stops`),
    ``,
    `// the longest stretch from a start codon to a stop, over all six frames`,
    best === undefined ? `// none at least 100 amino acids long` : `// frame ${best.frame > 0 ? `+${best.frame}` : best.frame}, bases ${best.from}-${best.to}, ${best.length} amino acids`,
    best === undefined ? `` : `// "${best.protein.slice(0, 44)}..."`,
    ``,
    `CodonTable.unambiguousDnaById    // ${codes().length} genetic codes`,
  ].join("\n");
  return (
    <div className="flat">
      <h2>{text.code.heading}</h2>
      <p>{text.code.sequencesIntro}</p>
      <Highlighted code={SOURCE} />
      <h3>{text.code.output}</h3>
      <Highlighted code={measurements} />
      <h3>{text.code.sequencesFrames}</h3>
      <p>{text.code.sequencesFramesIntro}</p>
      <Highlighted code={FRAMES} />
      <h3>{text.code.output}</h3>
      <Highlighted code={read} />
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
      <Highlighted language="bash" code="npm install @biolibs/seq @biolibs/seqtools" />
      <p className="quiet">{text.code.reference} <Link href="/api">{text.api.title}</Link></p>
    </div>
  );
}
