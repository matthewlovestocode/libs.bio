/**
 * The papers behind the PCR and primers topic, chosen by Matthew on 2026-11-19.
 *
 * The details were looked up on Europe PMC by hand on the date below, so each one is what Europe
 * PMC says and not what anybody remembered. Fetching them when the site is built is not written
 * yet.
 */
import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "2999980", doi: "10.1126/science.2999980", pmcid: null,
    title: "Enzymatic amplification of beta-globin genomic sequences and restriction site analysis for diagnosis of sickle cell anemia",
    authors: "Saiki RK, Scharf S, Faloona F, Mullis KB, Horn GT, Erlich HA, Arnheim N", journal: "Science", year: 1985, access: "paywalled",
    why: "The first published use of PCR. It also checks its product with a restriction digest, the subject of the first topic here.",
  },
  {
    pmid: "2448875", doi: "10.1126/science.2448875", pmcid: null,
    title: "Primer-directed enzymatic amplification of DNA with a thermostable DNA polymerase",
    authors: "Saiki RK, Gelfand DH, Stoffel S, Scharf SJ, Higuchi R, Horn GT, Mullis KB, and others", journal: "Science", year: 1988, access: "paywalled",
    why: "The polymerase that survives the heating step, which is what made PCR something a machine could do unattended.",
  },
  {
    pmid: "9465037", doi: "10.1073/pnas.95.4.1460", pmcid: "PMC19045",
    title: "A unified view of polymer, dumbbell, and oligonucleotide DNA nearest-neighbor thermodynamics",
    authors: "SantaLucia J", journal: "Proc Natl Acad Sci U S A", year: 1998, access: "free",
    why: "Where the numbers behind a primer's melting temperature come from.",
  },
  {
    pmid: "15035624", doi: "10.1021/bi034621r", pmcid: null,
    title: "Effects of sodium ions on DNA duplex oligomers: improved predictions of melting temperatures",
    authors: "Owczarzy R, You Y, Moreira BG, Manthey JA, Huang L, Behlke MA, Walder JA", journal: "Biochemistry", year: 2004, access: "paywalled",
    why: "The salt correction the tool uses by default when it works out a melting temperature.",
  },
  {
    pmid: "22730293", doi: "10.1093/nar/gks596", pmcid: "PMC3424584",
    title: "Primer3: new capabilities and interfaces",
    authors: "Untergasser A, Cutcutache I, Koressaar T, Ye J, Faircloth BC, Remm M, Rozen SG", journal: "Nucleic Acids Res", year: 2012, access: "open",
    why: "The most widely used primer design program, and a fuller treatment of design than this tool attempts.",
  },
];

/** The list: chosen, with details checked on Europe PMC on the date given. */
export const reading: ReadingList = { chosen: true, checked: "2026-11-19", papers };
