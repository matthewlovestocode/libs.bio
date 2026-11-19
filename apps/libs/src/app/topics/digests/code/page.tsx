import type { Metadata } from "next";
import { digest } from "@/lib/digest.ts";
import { samplePlasmid } from "@/lib/sample.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.digests.title}: ${text.views.code}` };

/** The calls, as somebody would write them. It is the same working as `src/lib/digest.ts`. */
const SOURCE = `import { Seq } from "@biolibs/seq";
import { enzymes } from "@biolibs/restriction";
import { bandsOf, fragmentSizes, gelById } from "@biolibs/gel";

const seq = new Seq(plasmid);            // your sequence, as a string of DNA letters
const circular = true;

// Where each enzyme cuts. As in Biopython, a position is 1-based and names the base after the
// cut, and the second argument says whether the molecule is linear.
const cuts = ["EcoRI", "BamHI"]
  .flatMap((name) => enzymes[name].search(seq, !circular))
  .map((position) => (position - 1 + plasmid.length) % plasmid.length);   // to 0-based boundaries

const sizes = fragmentSizes(plasmid.length, "circular", cuts);
const bands = bandsOf(sizes, gelById("1.0"));    // a 1% agarose gel`;

/** Reading the sequence out of a file, which is what "Open a file" does. */
const READING = `import { parse } from "@biolibs/seqio";

// A text format takes the file's text, and a binary one, like SnapGene's, takes its bytes.
const bytes = new Uint8Array(await file.arrayBuffer());
const [record] = parse(bytes, "snapgene");       // or parse(text, "genbank"), "embl", "fasta" ...

const plasmid = record.seq.toString().toUpperCase();
const circular = record.annotations.get("topology") === "circular";`;

const PACKAGES = [
  { name: "restriction", note: text.code.restriction },
  { name: "gel", note: text.code.gel },
  { name: "seq", note: text.code.seq },
  { name: "seqio", note: text.code.seqio },
] as const;

/** Code: the calls the tool makes, with what they give, worked out when the page is built. */
export default function Code() {
  // Run for real, here, so the output on the page cannot drift from what the packages do.
  const ran = digest(samplePlasmid(), ["EcoRI", "BamHI"], { circular: true, gel: "1.0" });
  const output = [
    `cuts   // ${JSON.stringify(ran.enzymes.flatMap((one) => one.cuts).sort((a, b) => a - b))}`,
    `sizes  // ${JSON.stringify(ran.fragments.map((piece) => piece.size))}`,
    `bands  // ${JSON.stringify(ran.bands.map((band) => ({ size: band.size, position: Number(band.position.toFixed(3)) })))}`,
  ].join("\n");
  return (
    <div className="flat">
      <h2>{text.code.heading}</h2>
      <p>{text.code.intro}</p>
      <pre><code>{SOURCE}</code></pre>
      <h3>{text.code.output}</h3>
      <pre><code>{output}</code></pre>
      <h3>{text.code.reading}</h3>
      <p>{text.code.readingIntro}</p>
      <pre><code>{READING}</code></pre>
      <h3>{text.code.packages}</h3>
      <ul className="packages">
        {PACKAGES.map((one) => (
          <li key={one.name}>
            <code>@biolibs/{one.name}</code> · <a href={`https://www.npmjs.com/package/@biolibs/${one.name}`}>{text.code.readme}</a>
            <span className="quiet">{one.note}</span>
          </li>
        ))}
      </ul>
      <h3>{text.code.install}</h3>
      <pre><code>npm install @biolibs/seq @biolibs/restriction @biolibs/gel @biolibs/seqio</code></pre>
      <p className="quiet">{text.code.reference}</p>
    </div>
  );
}
