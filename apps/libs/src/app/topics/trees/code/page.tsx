import type { Metadata } from "next";
import Link from "next/link";
import { Code as Highlighted } from "@/components/Code.tsx";
import { SAMPLE_NEWICK, sampleFamily } from "@/lib/sample.ts";
import { MODELS, buildTree, readTree } from "@/lib/tree.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.trees.title}: ${text.views.code}` };

/** Reading a tree, as somebody would write it. */
const SOURCE = `import { read, write } from "@biolibs/phylo";

const tree = read(newick, "newick");       // or "nexus", or "phyloxml"

tree.countTerminals();                     // how many tips
tree.getTerminals().map((c) => c.name);    // what they are called
tree.totalBranchLength();                  // every branch added together
tree.rooted;                               // whether the file says which end is the root
tree.isBifurcating();                      // two branches at every fork?

tree.root.clades;                          // the children of a clade
tree.root.clades[0].branchLength;          // and their branch lengths
tree.root.clades[0].confidence;            // and their support values

tree.format("newick");                     // and back out again`;

/** Building a tree from an alignment, as somebody would write it. */
const BUILD = `import { MultipleSeqAlignment } from "@biolibs/align";
import { TreeConstruction } from "@biolibs/phylo";

const msa = new MultipleSeqAlignment(records);

// How far apart every pair is, in one of 31 models.
const calculator = new TreeConstruction.DistanceCalculator("identity");
const matrix = calculator.getDistance(msa);
matrix.names;
matrix.get([1, 0]);

// And a tree from those distances alone.
const nj = new TreeConstruction.DistanceTreeConstructor(calculator, "nj");
nj.buildTree(msa).format("newick");`;

const PACKAGES = [
  { name: "phylo", note: text.code.phylo },
  { name: "align", note: text.code.align },
] as const;

/** Code: the calls the tool makes, with what they give, worked out when the page is built. */
export default function Code() {
  // Run for real, here, so the output on the page cannot drift from what the packages do.
  const given = readTree(SAMPLE_NEWICK, "newick", true);
  const rows = sampleFamily();
  const nj = buildTree(rows, "identity", "nj", true);
  const upgma = buildTree(rows, "identity", "upgma", true);
  const read = !given.ok ? [`// ${given.error}`] : [
    `tree.countTerminals()              // ${given.tree.summary.tips}`,
    `tree.getTerminals()...name         // ${JSON.stringify(given.tree.layout.nodes.filter((node) => node.tip).map((node) => node.name))}`,
    `tree.totalBranchLength()           // ${given.tree.summary.totalLength.toFixed(3)}`,
    `tree.rooted                        // ${given.tree.summary.rooted}`,
    `tree.isBifurcating()               // ${given.tree.summary.bifurcating}`,
  ];
  const distances = !nj.ok || nj.distances === undefined ? [] : nj.distances.names.map((name, i) =>
    `// ${name.padEnd(9)} ${nj.distances!.rows[i].map((value) => value.toFixed(3)).join("  ")}`);
  const built = [
    `matrix.names                       // ${!nj.ok || nj.distances === undefined ? "—" : JSON.stringify(nj.distances.names)}`,
    ...distances,
    ``,
    `// neighbour joining`,
    nj.ok ? nj.tree.newick : `// ${nj.error}`,
    ``,
    `// UPGMA, which assumes a steady rate and so puts every tip the same distance from the root`,
    upgma.ok ? upgma.tree.newick : `// ${upgma.error}`,
  ];
  return (
    <div className="flat">
      <h2>{text.code.heading}</h2>
      <p>{text.code.treesIntro}</p>
      <Highlighted code={SOURCE} />
      <h3>{text.code.output}</h3>
      <Highlighted code={read.join("\n")} />
      <h3>{text.code.treesBuilding}</h3>
      <p>{text.code.treesBuildingIntro}</p>
      <Highlighted code={BUILD} />
      <h3>{text.code.output}</h3>
      <Highlighted code={built.join("\n")} />
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
      <Highlighted language="bash" code="npm install @biolibs/phylo" />
      <p className="quiet">{text.trees.distancesNote} {MODELS.length} models.</p>
      <p className="quiet">{text.code.reference} <Link href="/api">{text.api.title}</Link></p>
    </div>
  );
}
