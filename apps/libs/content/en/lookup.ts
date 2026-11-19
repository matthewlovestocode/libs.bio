/**
 * The Understand view of the looking things up topic, in English.
 *
 * Three versions, as every topic has: one that assumes nothing, one that assumes school biology, and
 * one for somebody who already uses Biopython.
 */
import type { Lesson, Level } from "../../src/lib/lesson.ts";

const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to this",
    hint: "Starts from what the public databases are. No jargon assumed.",
    sections: [
      {
        heading: "Almost everything is already public",
        paragraphs: [
          "When somebody sequences a gene, solves a structure or publishes a paper, the result generally goes into a public database that anybody may read, free, without an account. That has been the arrangement since the 1980s and it is one of the quietly remarkable things about biology.",
          "So before measuring something yourself, it is worth asking whether somebody has already measured it and put it somewhere you can find.",
        ],
      },
      {
        heading: "Three places, three kinds of question",
        paragraphs: [
          "NCBI holds sequences: genes, plasmids, genomes, and the submissions around them. UniProt holds proteins, carefully curated: what a protein is, what is done to it after it is made, which bits matter. Europe PMC holds the papers, and for many of them the whole text rather than just the abstract.",
          "This tool asks one question of one of them at a time. It is not a search engine over all of biology; it is three doorbells.",
        ],
      },
      {
        heading: "An accession is a name that does not move",
        paragraphs: [
          "Every record has an accession: J01749, P02666, PMC332411. It is not a web address and it is not a file name. It is a permanent label, and quoting it in a paper means anybody, anywhere, years later, can fetch exactly the thing you meant.",
          "This is why the other tools on this site take an accession rather than asking you to upload something. Searching is how you find the accession; everything else starts from it.",
        ],
      },
      {
        heading: "Curated and automatic are not the same",
        paragraphs: [
          "UniProt has two kinds of entry. In one, a person has read the papers and assembled what is known. In the other, a machine has guessed the annotations from something that looks similar, and no human has checked.",
          "Both arrive looking identical, in the same fields, through the same request. The tool shows you which you have, because treating the second as the first is the quietest way to be confidently wrong about a protein.",
        ],
      },
      {
        heading: "Two ways to count the same protein",
        paragraphs: [
          "Many proteins are made with a short tag at the front that directs them somewhere and is then cut off. So there are two numberings: counting along the protein as the gene makes it, and counting along what is left afterwards, which is what a lab actually has in a tube.",
          "Papers use both, usually without saying which. The tool prints both columns side by side, because a modification at position 30 in one numbering is at position 15 in the other, and ordering a peptide against the wrong one wastes a month.",
        ],
      },
      {
        heading: "Your browser asks, not this site",
        paragraphs: [
          "Every request here goes from your own browser straight to the service. Nothing passes through this site, which has no server to pass it through. Each service sees the query you typed and nothing else about you.",
          "That is the same arrangement as the accession boxes in the other tools, and it is why none of this needs an account.",
        ],
      },
    ],
    analogy: {
      picture: "It is like a library with three catalogues: one for specimens, one for the detailed notes a curator has written about them, and one for the published papers. An accession is the shelf mark.",
      breaksDown: "A library's catalogue is checked by librarians. Much of what is in these databases was deposited by whoever did the work and has never been examined by anybody else, which is exactly what the reviewed-or-not flag is warning you about.",
    },
    remember: [
      "Most of what you need is already public, free, and without an account.",
      "An accession is a permanent name; searching is how you find it.",
      "A UniProt entry may be curated by a person or guessed by machine.",
      "Two numberings exist for a protein, and papers use both.",
    ],
  },
  {
    id: "some",
    label: "I know some biology",
    hint: "Assumes the databases exist. Covers their manners, their limits and what to distrust.",
    sections: [
      {
        heading: "The manners these services expect",
        paragraphs: [
          "NCBI asks for at most three requests a second, ten with an API key, and wants a tool name and a contact address so it can get in touch before throttling you. The library enforces the rate limit itself, and warns on every request if no address is set, which is why this site catches that warning rather than printing it eight times a page.",
          "This site sends a tool name and no address: it is an anonymous client, which is allowed and works. A script you run yourself should set a real address — that is what it is for, and being reachable is better than being blocked.",
        ],
      },
      {
        heading: "GenBank is not RefSeq",
        paragraphs: [
          "GenBank is an archive: whatever was submitted, as submitted, including the errors, kept forever because the record of what someone deposited has value. RefSeq is a curated derivative, with NCBI's own annotation, which is updated and can change under you.",
          "The same organism can carry different gene boundaries in the two, and analyses have been shown to differ as a result. Record which you used, and the version suffix with it.",
        ],
      },
      {
        heading: "Swiss-Prot and TrEMBL",
        paragraphs: [
          "UniProt's reviewed section, Swiss-Prot, is around half a million entries assembled by curators from the literature. The unreviewed section, TrEMBL, is hundreds of millions, annotated automatically by similarity.",
          "A TrEMBL entry's modified residues, domains and function were inferred, often transitively from another inferred entry. They are not evidence. The flag is one boolean and it changes what the entry is worth.",
        ],
      },
      {
        heading: "Open access and full text are different questions",
        paragraphs: [
          "Open access is a licence: what you may do with the paper. Whether the full text is in Europe PMC is a question of deposit. A paper can be open access and not deposited, leaving you an abstract and a link; one can be deposited and not open access, readable but not reusable.",
          "The tool reports both separately, and only offers to read a paper when the text is actually there.",
        ],
      },
      {
        heading: "Why reading a paper as sections is worth something",
        paragraphs: [
          "Europe PMC will hand over a full text as JATS markup: well over a hundred kilobytes in which the paragraph you want is three levels down inside nested sections, wrapped in formatting elements and interrupted by citation markers that render as bracketed numbers.",
          "The library makes three decisions rather than leaving them to you: citation markers pointing at the reference list are dropped along with the brackets they leave behind, while ones pointing at a table or figure are kept because the sentence needs them; tables are lifted out and kept with their captions rather than flattened into prose; and a section's words are its own rather than its subsections' counted again at every level above.",
        ],
      },
      {
        heading: "The one that is not a button",
        paragraphs: [
          "NCBI will also run a BLAST search for you over HTTP, and there is a port that asks for it exactly as Biopython does, including the polling rules. What it cannot change is the queue at the other end.",
          "Timed here, those queries took over half an hour. That is a script to leave running, not something to put behind a button on a page that somebody is waiting at, so this topic shows the call and does not offer it.",
        ],
      },
    ],
    remember: [
      "Rate limits and a tool name are not optional; the library handles the first.",
      "GenBank archives what was submitted; RefSeq is curated and moves.",
      "Swiss-Prot is read by people, TrEMBL is inferred by machine.",
      "Open access is a licence; full text being present is a separate fact.",
    ],
  },
  {
    id: "biopython",
    label: "I use Biopython",
    hint: "Bio.Entrez ported, plus two packages Biopython has no counterpart for.",
    sections: [
      {
        heading: "Bio.Entrez, as it was",
        paragraphs: [
          "`@biolibs/entrez` is `Bio.Entrez`: `efetch`, `esearch`, `esummary`, `elink`, `epost`, `einfo`, `espell` and `ecitmatch`, with the same names and arguments, the same parameter order and URL encoding, and the same switch from GET to POST past a thousand characters or two hundred identifiers. The three-a-second rate limit and the retry rules are the same too.",
          "Two differences worth knowing. `Entrez.read` is not ported yet, so ask for `retmode: \"json\"` and parse that, which is what this tool does. And it runs in a browser: NCBI answers with `Access-Control-Allow-Origin: *`, so a page needs no server of its own.",
        ],
      },
      {
        heading: "Two packages with no Biopython counterpart",
        paragraphs: [
          "`@biolibs/uniprot` exists because reading a UniProt entry through `SeqIO` gives you a `SeqRecord` whose annotations are a bag of strings. This gives named fields: `reviewed`, `chain`, `signal`, `modifications`, and `onTheChain` to convert between the two numberings.",
          "`@biolibs/europepmc` exists because `fullTextOf` returns JATS and nobody wants to write that walk twice. `readArticle` gives sections, tables with their captions, and a licence; `sectionsNamed(paper, \"methods\")` finds the part somebody actually asked for.",
        ],
      },
      {
        heading: "What is sent",
        paragraphs: [
          "All three take `settings.tool` and `settings.email`. The tool name is the only thing they say about who is asking; an address goes only if somebody sets one deliberately, and is never taken from a file, a document or the device.",
          "`settings.transport` is one replaceable function in each. Swapping it is how the tests run without a network, and how you would route requests through a proxy or a cache.",
        ],
      },
      {
        heading: "BLAST",
        paragraphs: [
          "`@biolibs/blast` ports `qblast`: the same Put and Get requests, the same wait page, the same polling rules. It is correct and it is not fast, because the waiting is NCBI's.",
          "Measured here, the queries took upwards of half an hour, so this page shows the call rather than offering it. For anything regular, a local BLAST or a different service is the answer, and neither belongs in a browser tab.",
        ],
      },
    ],
  },
];

/** The lesson, whole. */
export const lesson: Lesson = {
  question: "What is already public, and how much of it should you believe?",
  levels,
  termSlugs: ["protein", "residue", "gene", "genome", "sequencing", "feature", "coordinates"],
  tryIt: "Try it: look up P02666 and see the two numberings side by side →",
};
