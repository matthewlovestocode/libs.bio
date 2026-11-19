import type { Metadata } from "next";
import Link from "next/link";
import { Code as Highlighted } from "@/components/Code.tsx";
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

/** Fetching a record from NCBI, which is what the accession box does. */
const FETCHING = `import { efetch } from "@biolibs/entrez";
import { parse } from "@biolibs/seqio";

const reply = await efetch("nucleotide", { id: "J01749", rettype: "gb", retmode: "text" });
const [record] = parse(reply.readText(), "genbank");      // pBR322, 4,361 bp, circular`;

/** What a cut leaves behind, which is the "Leaves" column. */
const ENDS = `import { enzymes } from "@biolibs/restriction";

enzymes.EcoRI.ovhg;       // -4: four bases, and negative means the 5' end is left sticking out
enzymes.EcoRI.ovhgseq;    // "AATT"
enzymes.PstI.ovhg;        //  4: positive means the 3' end is
enzymes.SmaI.isBlunt();   // true

// The top strand is cut at \`cut\`, and the bottom strand \`ovhg\` bases away, so the
// single-stranded bases are the ones in between.
const overhang = plasmid.slice(Math.min(cut, cut - ovhg), Math.max(cut, cut - ovhg));`;

const PACKAGES = [
  { name: "restriction", note: text.code.restriction },
  { name: "gel", note: text.code.gel },
  { name: "seq", note: text.code.seq },
  { name: "seqio", note: text.code.seqio },
  { name: "entrez", note: text.code.entrez },
  { name: "seqmap", note: text.code.seqmap },
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
      <Highlighted code={SOURCE} />
      <h3>{text.code.output}</h3>
      <Highlighted code={output} />
      <h3>{text.code.reading}</h3>
      <p>{text.code.readingIntro}</p>
      <Highlighted code={READING} />
      <h3>{text.code.fetching}</h3>
      <p>{text.code.fetchingIntro}</p>
      <Highlighted code={FETCHING} />
      <h3>{text.code.ends}</h3>
      <Highlighted code={ENDS} />
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
      <Highlighted language="bash" code="npm install @biolibs/seq @biolibs/restriction @biolibs/gel @biolibs/seqio @biolibs/entrez @biolibs/seqmap" />
      <p className="quiet">{text.code.reference} <Link href="/api">{text.api.title}</Link></p>
    </div>
  );
}
