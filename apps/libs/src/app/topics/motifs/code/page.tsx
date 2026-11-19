import type { Metadata } from "next";
import Link from "next/link";
import { Code as Highlighted } from "@/components/Code.tsx";
import { DEFAULT_SETTINGS, buildMotif } from "@/lib/motif.ts";
import { SAMPLE_MOTIF_AT, sampleMotifInstances, sampleMotifTarget } from "@/lib/sample.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.motifs.title}: ${text.views.code}` };

/** Building a motif, as somebody would write it. */
const SOURCE = `import * as motifs from "@biolibs/motifs";
import { Seq } from "@biolibs/seq";

const motif = motifs.create(instances.map((one) => new Seq(one)));

motif.length;                      // how wide it is
String(motif.consensus);           // the commonest letter at each position
String(motif.degenerateConsensus); // the same with the ambiguity codes

// A count of zero would score as impossible, so pseudocounts go in first,
// and the background is what the motif is scored against.
motif.pseudocounts = 0.5;
motif.background = 0.5;

motif.counts.row("A");             // what was seen
motif.pwm.row("A");                // as shares
motif.pssm.row("A");               // as log-odds against the background
motif.pssm.max;`;

/** Scanning, as somebody would write it. */
const SCAN = `// Every window scored, both strands. A negative position is a hit on the
// other strand, counted back from the end.
[...motif.pssm.search(new Seq(target), 4.0)];

// And two ways of choosing the score to beat, rather than guessing one.
const spread = new motifs.ScoreDistribution(500, motif.pssm, motif.background);
spread.thresholdFpr(0.001);        // one false hit in a thousand
spread.thresholdPatser();`;

const PACKAGES = [
  { name: "motifs", note: text.code.motifs },
  { name: "seq", note: text.code.seqPackage },
] as const;

/** Code: the calls the tool makes, with what they give, worked out when the page is built. */
export default function Code() {
  // Run for real, here, so the output on the page cannot drift from what the packages do.
  const result = buildMotif(sampleMotifInstances(), DEFAULT_SETTINGS);
  const target = sampleMotifTarget();
  const built = !result.ok ? [`// ${result.error}`] : [
    `motif.length                       // ${result.built.length}`,
    `String(motif.consensus)            // "${result.built.consensus}"`,
    `String(motif.degenerateConsensus)  // "${result.built.degenerate}"`,
    `motif.counts.row("A")              // [${["A"].flatMap(() => result.built.columns.map((column) => column.counts.A)).join(", ")}]`,
    `motif.pssm.max                     // ${result.built.best.toFixed(4)}`,
    `// information per position, in bits: ${result.built.columns.map((column) => column.information.toFixed(2)).join(", ")}`,
  ];
  const found = !result.ok ? [] : (() => {
    const hits = result.scan(target, DEFAULT_SETTINGS.threshold);
    return [
      `spread.thresholdFpr(0.001)         // ${result.built.thresholds.falsePositive.toFixed(4)}`,
      `spread.thresholdPatser()           // ${result.built.thresholds.patser.toFixed(4)}`,
      ``,
      `// searching the sample at ${DEFAULT_SETTINGS.threshold}: ${hits.length} hits`,
      ...hits.slice(0, 5).map((hit) => `//   ${String(hit.at).padStart(4)}  ${hit.strand === "forward" ? "as written" : "the other"}  ${hit.letters}  ${hit.score.toFixed(2)}`),
      ``,
      `// the copies were planted at ${SAMPLE_MOTIF_AT.forward.join(" and ")} as written, ${SAMPLE_MOTIF_AT.reverse[0]} on the other strand`,
    ];
  })();
  return (
    <div className="flat">
      <h2>{text.code.heading}</h2>
      <p>{text.code.motifsIntro}</p>
      <Highlighted code={SOURCE} />
      <h3>{text.code.output}</h3>
      <Highlighted code={built.join("\n")} />
      <h3>{text.code.motifsScanning}</h3>
      <p>{text.code.motifsScanningIntro}</p>
      <Highlighted code={SCAN} />
      <h3>{text.code.output}</h3>
      <Highlighted code={found.join("\n")} />
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
      <Highlighted language="bash" code="npm install @biolibs/motifs" />
      <p className="quiet">{text.code.reference} <Link href="/api">{text.api.title}</Link></p>
    </div>
  );
}
