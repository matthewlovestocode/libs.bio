import type { Metadata } from "next";
import Link from "next/link";
import { Code as Highlighted } from "@/components/Code.tsx";
import { DEFAULT_SCORING, MATRICES, alignPair } from "@/lib/align.ts";
import { sampleRelatives } from "@/lib/sample.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.alignment.title}: ${text.views.code}` };

/** Aligning two sequences, as somebody would write it. */
const SOURCE = `import { PairwiseAligner } from "@biolibs/align";

const aligner = new PairwiseAligner();
aligner.mode = "global";          // or "local" for the best-scoring stretch
aligner.match = 1;
aligner.mismatch = -1;
aligner.openGapScore = -2;        // starting a gap
aligner.extendGapScore = -0.5;    // making one longer

aligner.algorithm;                // which algorithm the settings imply

// Just the score, without building anything.
aligner.score(first, second);

// Or every alignment that scores that well, lazily.
const alignments = aligner.align(first, second);
const [best] = alignments;
best.score;
best.indices;                     // one row per sequence; -1 is a gap
best.counts();                    // identities, mismatches, gaps`;

/** Scoring protein, as somebody would write it. */
const MATRIX = `import { PairwiseAligner, substitutionMatrices } from "@biolibs/align";

substitutionMatrices.loadNames();                        // 30 of them
const blosum62 = substitutionMatrices.loadMatrix("BLOSUM62");
blosum62.getOr(["W", "W"], null);                        // 11: tryptophan for itself
blosum62.getOr(["I", "V"], null);                        // 3: a cheap swap
blosum62.getOr(["W", "P"], null);                        // -4: an expensive one

const aligner = new PairwiseAligner();
aligner.substitutionMatrix = blosum62;
aligner.openGapScore = -11;
aligner.extendGapScore = -1;`;

const PACKAGES = [
  { name: "align", note: text.code.align },
  { name: "seqio", note: text.code.seqio },
] as const;

/** Code: the calls the tool makes, with what they give, worked out when the page is built. */
export default function Code() {
  // Run for real, here, so the output on the page cannot drift from what the packages do.
  const [first, second] = sampleRelatives();
  const result = alignPair(first.dna, second.dna, DEFAULT_SCORING);
  const local = alignPair(first.dna, second.dna, { ...DEFAULT_SCORING, mode: "local" });
  const run = !result.ok ? [`// ${result.error}`] : [
    `first.length                     // ${first.dna.length}`,
    `second.length                    // ${second.dna.length}`,
    `aligner.algorithm                // "${result.aligned.algorithm}"`,
    `best.score                       // ${result.aligned.score}`,
    `alignments.length                // ${result.aligned.equallyGood}`,
    `counts.identities                // ${result.aligned.identities}`,
    `counts.mismatches                // ${result.aligned.mismatches}`,
    `// columns                       ${result.aligned.columns.length}, of which ${result.aligned.gaps} hold a gap`,
    `// the same, as a percentage     ${(result.aligned.identity * 100).toFixed(1)}%`,
    ``,
    `// and in "local" mode, which keeps only the best-scoring stretch`,
    local.ok ? `// score ${local.aligned.score}, ${local.aligned.columns.length} columns, ${(local.aligned.identity * 100).toFixed(1)}% the same` : `// ${local.error}`,
  ];
  const line = (which: "target" | "query") => (!result.ok ? "" : result.aligned.columns.slice(90, 150).map((column) => column[which]).join(""));
  const marks = !result.ok ? "" : result.aligned.columns.slice(90, 150).map((column) => (column.kind === "same" ? "|" : column.kind === "different" ? "." : " ")).join("");
  return (
    <div className="flat">
      <h2>{text.code.heading}</h2>
      <p>{text.code.alignmentIntro}</p>
      <Highlighted code={SOURCE} />
      <h3>{text.code.output}</h3>
      <Highlighted code={run.join("\n")} />
      <Highlighted code={[`// columns 91 to 150 of that alignment, where the deletion falls`, line("target"), marks, line("query")].join("\n")} />
      <h3>{text.code.alignmentMatrices}</h3>
      <p>{text.code.alignmentMatricesIntro}</p>
      <Highlighted code={MATRIX} />
      <h3>{text.code.output}</h3>
      <Highlighted code={`substitutionMatrices.loadNames()   // ${MATRICES.length} matrices: ${MATRICES.slice(0, 6).join(", ")}, ...`} />
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
      <Highlighted language="bash" code="npm install @biolibs/align" />
      <p className="quiet">{text.code.reference} <Link href="/api">{text.api.title}</Link></p>
    </div>
  );
}
