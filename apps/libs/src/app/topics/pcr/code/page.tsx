import type { Metadata } from "next";
import Link from "next/link";
import { Code as Highlighted } from "@/components/Code.tsx";
import { design, pcr } from "@/lib/pcr.ts";
import { samplePlasmid } from "@/lib/sample.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.pcr.title}: ${text.views.code}` };

/** The calls, as somebody would write them. It is the same working as `src/lib/pcr.ts`. */
const SOURCE = `import { checkPrimer, designPrimers, findBindingSites, predictProducts, productSequence, tmDifference } from "@biolibs/pcr";

// Pick a pair for bases 501 to 1,200. Positions count from 0 and leave the end out, as a slice does.
const pair = designPrimers(template, 500, 1200);

// What is known about each primer: length, GC, melting temperature, and anything to warn about.
const forward = checkPrimer(pair.forward.sequence);
const reverse = checkPrimer(pair.reverse.sequence);
tmDifference(forward, reverse);

// Where a primer binds, on either strand.
findBindingSites(template, "circular", pair.forward.sequence);

// Everything the two would copy, shortest first.
const products = predictProducts(template, "circular", [
  { name: "forward", sequence: pair.forward.sequence },
  { name: "reverse", sequence: pair.reverse.sequence },
]);
productSequence(template, products[0]);`;

const GEL = `import { bandsOf, gelById } from "@biolibs/gel";

const bands = bandsOf(products.map((product) => product.length), gelById("1.0"));`;

const PACKAGES = [
  { name: "pcr", note: text.code.pcrPackage, documented: true },
  { name: "gel", note: text.code.gel, documented: true },
  { name: "seqtools", note: text.code.seqtools, documented: false },
] as const;

/** Code: the calls the tool makes, with what they give, worked out when the page is built. */
export default function Code() {
  // Run for real, here, so the output on the page cannot drift from what the packages do.
  const template = samplePlasmid();
  const pair = design(template, 501, 1200)!;
  const ran = pcr(template, pair.forward.sequence, pair.reverse.sequence, { circular: true, mismatches: 0, gel: "1.0" });
  const [forward, reverse] = ran.primers;
  const site = forward.sites[0];
  const output = [
    `pair.forward.sequence   // "${pair.forward.sequence}"`,
    `pair.reverse.sequence   // "${pair.reverse.sequence}"`,
    `forward.tm              // ${forward.report!.tm.toFixed(1)}`,
    `reverse.tm              // ${reverse.report!.tm.toFixed(1)}`,
    `tmDifference(...)       // ${ran.tmGap!.toFixed(2)}`,
    `forward.warnings        // ${JSON.stringify(forward.report!.warnings)}`,
    `findBindingSites(...)   // [{ start: ${site.start}, end: ${site.end}, strand: "${site.strand}", mismatches: ${site.mismatches}, ... }]`,
    `products.length         // ${ran.products.length}`,
    `products[0].length      // ${ran.products[0].length}`,
    `products[0].start       // ${ran.products[0].start}`,
    `products[0].end         // ${ran.products[0].end}`,
  ].join("\n");
  return (
    <div className="flat">
      <h2>{text.code.heading}</h2>
      <p>{text.code.pcrIntro}</p>
      <Highlighted code={SOURCE} />
      <h3>{text.code.output}</h3>
      <Highlighted code={output} />
      <h3>{text.code.pcrGel}</h3>
      <Highlighted code={GEL} />
      <h3>{text.code.packages}</h3>
      <ul className="packages">
        {PACKAGES.map((one) => (
          <li key={one.name}>
            {one.documented ? <Link href={`/api/${one.name}`}><code>@biolibs/{one.name}</code></Link> : <code>@biolibs/{one.name}</code>} · <a href={`https://www.npmjs.com/package/@biolibs/${one.name}`}>{text.code.readme}</a>
            <span className="quiet">{one.note}</span>
          </li>
        ))}
      </ul>
      <h3>{text.code.install}</h3>
      <Highlighted language="bash" code="npm install @biolibs/pcr @biolibs/gel" />
      <p className="quiet">{text.code.reference} <Link href="/api">{text.api.title}</Link></p>
    </div>
  );
}
