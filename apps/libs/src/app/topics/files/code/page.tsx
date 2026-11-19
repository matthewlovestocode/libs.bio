import type { Metadata } from "next";
import Link from "next/link";
import { Code as Highlighted } from "@/components/Code.tsx";
import { OUTPUT_FORMATS, openAnyFile, survives, writeAs } from "@/lib/convert.ts";
import { SEQUENCE_FORMATS } from "@/lib/files.ts";
import { SAMPLE_NAME, sampleGenBank } from "@/lib/sample.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.files.title}: ${text.views.code}` };

/** Reading and writing, as somebody would write it. */
const SOURCE = `import { parse, write, StringHandle } from "@biolibs/seqio";

// One record per sequence in the file. A string is the file's contents, not its name.
const records = [...parse(text, "genbank")];
records[0].id;                          // what it is called
records[0].seq.length;                  // how long it is
records[0].features.length;             // what is marked on it
records[0].annotations.get("topology"); // "circular" or "linear", when the file says
records[0].letterAnnotations;           // a quality score per base, for a read

// Writing it out again: a handle is anything with write(text).
const handle = new StringHandle();
write(records, handle, "fasta");
handle.getvalue();`;

/** Checking what a conversion costs, as somebody would write it. */
const LOSING = `// Write it, read it back, and compare. No list of what each format can hold.
const handle = new StringHandle();
write(records, handle, "fasta");
const after = [...parse(handle.getvalue(), "fasta")];

records[0].features.length;   // what went in
after[0].features.length;     // what came out`;

const PACKAGES = [
  { name: "seqio", note: text.code.seqio },
  { name: "seqrecord", note: text.code.seqrecord },
  { name: "entrez", note: text.code.entrez },
] as const;

/** Code: the calls the tool makes, with what they give, worked out when the page is built. */
export default function Code() {
  // Run for real, here, so the output on the page cannot drift from what the packages do.
  const opened = openAnyFile(`${SAMPLE_NAME}.gb`, new TextEncoder().encode(sampleGenBank()));
  const one = opened.summaries[0];
  const read = [
    `records.length                        // ${opened.records.length}`,
    `records[0].id                         // "${one.id}"`,
    `records[0].seq.length                 // ${one.length}`,
    `records[0].features.length            // ${one.features}`,
    `annotations.get("topology")           // "${one.topology}"`,
    `annotations.get("molecule_type")      // "${one.molecule}"`,
  ].join("\n");
  const costs = OUTPUT_FORMATS.filter((format) => ["fasta", "genbank", "embl", "tab", "nexus", "fastq"].includes(format.id)).map((format) => {
    const written = writeAs(opened.records, format.id);
    if (!written.ok) return `${format.id.padEnd(10)} // refused: ${written.error}`;
    const survived = survives(opened.summaries, written, format.id);
    const lost = survived === null ? "cannot be read back" : survived.lost.length === 0 ? "nothing lost" : `loses ${survived.lost.join(", ")}`;
    return `${format.id.padEnd(10)} // ${String(written.bytes.length).padStart(5)} bytes, ${lost}`;
  }).join("\n");
  return (
    <div className="flat">
      <h2>{text.code.heading}</h2>
      <p>{text.code.filesIntro}</p>
      <Highlighted code={SOURCE} />
      <h3>{text.code.output}</h3>
      <Highlighted code={read} />
      <h3>{text.code.filesLosing}</h3>
      <p>{text.code.filesLosingIntro}</p>
      <Highlighted code={LOSING} />
      <h3>{text.code.output}</h3>
      <Highlighted code={costs} />
      <h3>{text.code.packages}</h3>
      <ul className="packages">
        {PACKAGES.map((package_) => (
          <li key={package_.name}>
            <Link href={`/api/${package_.name}`}><code>@biolibs/{package_.name}</code></Link> · <a href={`https://www.npmjs.com/package/@biolibs/${package_.name}`}>{text.code.readme}</a>
            <span className="quiet">{package_.note}</span>
          </li>
        ))}
      </ul>
      <h3>{text.code.install}</h3>
      <Highlighted language="bash" code="npm install @biolibs/seqio" />
      <p className="quiet">{text.files.dropNote(SEQUENCE_FORMATS.length)}</p>
      <p className="quiet">{text.code.reference} <Link href="/api">{text.api.title}</Link></p>
    </div>
  );
}
