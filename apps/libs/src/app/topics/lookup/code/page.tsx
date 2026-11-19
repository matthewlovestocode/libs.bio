import type { Metadata } from "next";
import Link from "next/link";
import { Code as Highlighted } from "@/components/Code.tsx";
import { lookUpProtein, searchPapers, searchRecords } from "@/lib/lookup.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.lookup.title}: ${text.views.code}` };

/** Asking the three services, as somebody would write it. */
const SOURCE = `import { esearch, esummary, efetch, settings as ncbi } from "@biolibs/entrez";
import { lookUpProtein, readProtein, onTheChain, settings as uniprot } from "@biolibs/uniprot";
import { searchArticles, fullTextOf, readArticle, settings as epmc } from "@biolibs/europepmc";

// What the software calls itself. Never a person's name, and no address
// unless somebody sets one deliberately.
ncbi.tool = uniprot.tool = epmc.tool = "libs.bio";

// NCBI: search, then ask what the matches are.
const found = await esearch("nucleotide", "pUC19[title]", { retmax: 5, retmode: "json" });
const summaries = await esummary({ db: "nucleotide", id: ids.join(","), retmode: "json" });
await efetch("nucleotide", { id: "J01749", rettype: "gb", retmode: "text" });

// UniProt: an entry, read into something with fields.
const protein = readProtein(await lookUpProtein("P02666"));
protein.reviewed;                       // whether a curator has been over it
protein.length;                         // as the gene makes it
protein.chain?.length;                  // what a lab ends up holding
onTheChain(protein, protein.modifications[0].at);   // the same residue, counted on the chain

// Europe PMC: search, then read an open paper as sections.
const papers = await searchArticles('TITLE:"sequence logos"', { abstracts: false });
const paper = readArticle(await fullTextOf("PMC332411"));
paper.sections.map((one) => one.heading);`;

/** The one that is not a button. */
const BLAST = `import { qblast } from "@biolibs/blast";

// The same Put and Get requests Biopython makes, the same wait page, the same
// polling rules. What it does not change is how long NCBI takes.
const handle = await qblast("blastn", "nt", sequence);`;

const PACKAGES = [
  { name: "entrez", note: text.code.entrez },
  { name: "uniprot", note: text.code.uniprot },
  { name: "europepmc", note: text.code.europepmc },
] as const;

/** Code: the calls the tool makes, with what they gave when the page was built. */
export default async function Code() {
  // Asked for real, here, so what is shown is what the services said rather than what was expected.
  const asked = async <T,>(what: () => Promise<T>): Promise<T | null> => {
    try { return await what(); } catch { return null; }
  };
  const records = await asked(() => searchRecords("pUC19[title]", "nucleotide", 3));
  const protein = await asked(() => lookUpProtein("P02666"));
  const papers = await asked(() => searchPapers('TITLE:"sequence logos" AND AUTH:"Schneider"', 3));
  const lines = [
    `// NCBI, nucleotide records matching pUC19[title]`,
    records === null ? `//   (NCBI could not be reached when this page was built)` : `//   ${records.matched.toLocaleString("en-US")} matched; the first three:`,
    ...(records?.records.slice(0, 3).map((one) => `//   ${one.accession.padEnd(12)} ${String(one.length ?? "").padStart(6)} bp  ${one.title.slice(0, 44)}`) ?? []),
    ``,
    `// UniProt, P02666`,
    protein === null ? `//   (UniProt could not be reached when this page was built)` : [
      `//   ${protein.name} (${protein.gene}), ${protein.reviewed ? "reviewed" : "not reviewed"}`,
      `//   ${protein.length} residues as the gene makes it, ${protein.chainLength ?? "—"} once the signal peptide is cut off`,
      `//   ${protein.modifications.length} modified residues; the first is at ${protein.modifications[0]?.at ?? "—"}, which is ${protein.modifications[0]?.onChain ?? "—"} on the chain`,
    ].join("\n"),
    ``,
    `// Europe PMC`,
    papers === null ? `//   (Europe PMC could not be reached when this page was built)` : `//   ${papers.matched} matched; ${papers.articles.filter((one) => one.fullText).length} of the first ${papers.articles.length} have a full text here`,
    ...(papers?.articles.slice(0, 2).map((one) => `//   ${one.year}  ${one.title.slice(0, 56)}`) ?? []),
  ];
  return (
    <div className="flat">
      <h2>{text.code.heading}</h2>
      <p>{text.code.lookupIntro}</p>
      <Highlighted code={SOURCE} />
      <h3>{text.code.output}</h3>
      <Highlighted code={lines.join("\n")} />
      <h3>{text.code.lookupBlast}</h3>
      <p>{text.code.lookupBlastIntro}</p>
      <Highlighted code={BLAST} />
      <h3>{text.code.packages}</h3>
      <ul className="packages">
        {PACKAGES.map((one) => (
          <li key={one.name}>
            <Link href={`/api/${one.name}`}><code>@biolibs/{one.name}</code></Link> · <a href={`https://www.npmjs.com/package/@biolibs/${one.name}`}>{text.code.readme}</a>
            <span className="quiet">{one.note}</span>
          </li>
        ))}
        <li>
          <code>@biolibs/blast</code> · <a href="https://www.npmjs.com/package/@biolibs/blast">{text.code.readme}</a>
          <span className="quiet">{text.code.blast}</span>
        </li>
      </ul>
      <h3>{text.code.install}</h3>
      <Highlighted language="bash" code="npm install @biolibs/entrez @biolibs/uniprot @biolibs/europepmc" />
      <p className="quiet">{text.code.reference} <Link href="/api">{text.api.title}</Link></p>
    </div>
  );
}
