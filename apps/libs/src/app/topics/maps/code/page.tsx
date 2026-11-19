import type { Metadata } from "next";
import Link from "next/link";
import { angleAt, tickPositions, tickStep } from "@biolibs/seqmap";
import { Code as Highlighted } from "@/components/Code.tsx";
import { readSequenceFile } from "@/lib/files.ts";
import { place, singleCutters } from "@/lib/map.ts";
import { SAMPLE_NAME, sampleGenBank } from "@/lib/sample.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.maps.title}: ${text.views.code}` };

/** Reading the file, as somebody would write it. */
const READ = `import { parse } from "@biolibs/seqio";

// One record per sequence in the file. A GenBank file's features come with it.
const [record] = [...parse(text, "genbank")];

record.seq.length;                       // how long it is
record.annotations.topology;             // "circular" or "linear"
for (const feature of record.features) {
  feature.type;                          // "CDS", "promoter", "rep_origin" ...
  feature.qualifiers.label;              // what the file calls it
  feature.location.strand;               // 1 for the top strand, -1 for the bottom
  feature.location.parts;                // its pieces: more than one when it crosses the origin
}`;

/** Laying it out, as somebody would write it. */
const DRAW = `import { angleAt, packLanes, ringPath, spreadAround, tickPositions, tickStep } from "@biolibs/seqmap";

// Which lane each feature goes in, so two that overlap are not drawn on top of each other.
const lanes = packLanes(features.map(({ start, end }) => ({ start, end })), 25);

// A feature becomes an arc: a start angle, an end angle, and an arrowhead for its strand.
const d = ringPath(cx, cy, inner, outer, angleAt(start, length), angleAt(end, length), "end", 7);

// A scale with round numbers on it.
const step = tickStep(length, 10);
const ticks = tickPositions(length, step, true);

// Names pushed apart round the circle until none sits on another.
const placed = spreadAround(wanted, 0.2);`;

/** Marking the enzymes that cut once. */
const SITES = `import { enzymes } from "@biolibs/restriction";
import { Seq } from "@biolibs/seq";

// search() gives where an enzyme cuts. One cut on a circle opens it in one known place.
const cuts = enzymes.EcoRI.search(new Seq(dna), false);   // false: not linear`;

const PACKAGES = [
  { name: "seqmap", note: text.code.seqmap, documented: true },
  { name: "seqio", note: text.code.seqio, documented: true },
  { name: "seqfeature", note: text.code.seqfeature, documented: true },
  { name: "restriction", note: text.code.restriction, documented: true },
] as const;

/** Code: the calls the tool makes, with what they give, worked out when the page is built. */
export default async function Code() {
  // Run for real, here, so the output on the page cannot drift from what the packages do.
  const opened = await readSequenceFile(`${SAMPLE_NAME}.gb`, new TextEncoder().encode(sampleGenBank()));
  const record = opened.records[0];
  const { placed, lanes } = place(record.features, record.sequence.length);
  const step = tickStep(record.sequence.length, 10);
  const sites = singleCutters(record.sequence, true);
  const last = placed[placed.length - 1];
  const read = [
    `record.seq.length             // ${record.sequence.length}`,
    `record.annotations.topology   // "${record.circular === true ? "circular" : "linear"}"`,
    `record.features.length        // ${record.features.length}`,
    ...placed.map((feature) => `// ${feature.type.padEnd(13)} ${feature.label.padEnd(22)} strand ${String(feature.strand).padStart(2)}  ${feature.parts.map((part) => `[${part.start}, ${part.end})`).join(" + ")}`),
  ].join("\n");
  const drawn = [
    `lanes                         // ${JSON.stringify(placed.map((feature) => feature.lane))}, so ${lanes} ${lanes === 1 ? "lane" : "lanes"}`,
    `angleAt(${placed[1].parts[0].start}, ${record.sequence.length})            // ${angleAt(placed[1].parts[0].start, record.sequence.length).toFixed(4)} radians, clockwise from the top`,
    `step                          // ${step}`,
    `ticks                         // ${JSON.stringify(tickPositions(record.sequence.length, step, true))}`,
    `// "${last.label}" is drawn as ${last.parts.length} arcs, one each side of the origin`,
  ].join("\n");
  return (
    <div className="flat">
      <h2>{text.code.heading}</h2>
      <p>{text.code.mapsIntro}</p>
      <Highlighted code={READ} />
      <h3>{text.code.output}</h3>
      <Highlighted code={read} />
      <h3>{text.code.mapsDraw}</h3>
      <p>{text.code.mapsDrawIntro}</p>
      <Highlighted code={DRAW} />
      <h3>{text.code.output}</h3>
      <Highlighted code={drawn} />
      <h3>{text.code.mapsSites}</h3>
      <Highlighted code={SITES} />
      <h3>{text.code.output}</h3>
      <Highlighted code={`// Of the common enzymes, these cut the sample once:\n// ${sites.map((site) => `${site.name} after base ${site.at}`).join(", ")}`} />
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
      <Highlighted language="bash" code="npm install @biolibs/seqmap @biolibs/seqio @biolibs/restriction" />
      <p className="quiet">{text.code.reference} <Link href="/api">{text.api.title}</Link></p>
    </div>
  );
}
