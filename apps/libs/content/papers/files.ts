/**
 * Candidate papers for the reading and converting files topic. A shortlist: Matthew has not chosen
 * from it yet.
 *
 * The details were looked up on Europe PMC by hand on the date below, so each one is what Europe
 * PMC says and not what anybody remembered. Fetching them when the site is built is not written
 * yet.
 */
import type { Paper, ReadingList } from "../../src/lib/papers.ts";

const papers: Paper[] = [
  {
    pmid: "3162770", doi: "10.1073/pnas.85.8.2444", pmcid: "PMC280013",
    title: "Improved tools for biological sequence comparison",
    authors: "Pearson WR, Lipman DJ", journal: "Proc Natl Acad Sci U S A", year: 1988, access: "free",
    why: "The FASTA program, whose input format outlived it and is now the format everything can read: a name on one line, letters on the next.",
  },
  {
    pmid: "20015970", doi: "10.1093/nar/gkp1137", pmcid: "PMC2847217",
    title: "The Sanger FASTQ file format for sequences with quality scores, and the Solexa/Illumina FASTQ variants",
    authors: "Cock PJ, Fields CJ, Goto N, Heuer ML, Rice PM", journal: "Nucleic Acids Res", year: 2010, access: "open",
    why: "Three incompatible things with the same name and no way to tell them apart from the file. The paper that had to be written because a format was never specified.",
  },
  {
    pmid: "23193287", doi: "10.1093/nar/gks1195", pmcid: "PMC3531190",
    title: "GenBank",
    authors: "Benson DA, Cavanaugh M, Clark K, Karsch-Mizrachi I, Lipman DJ, Ostell J, Sayers EW", journal: "Nucleic Acids Res", year: 2013, access: "open",
    why: "The database behind the format this tool reads most often, and behind the records the accession box fetches.",
  },
  {
    pmid: "19505943", doi: "10.1093/bioinformatics/btp352", pmcid: "PMC2723002",
    title: "The Sequence Alignment/Map format and SAMtools",
    authors: "Li H, Handsaker B, Wysoker A, Fennell T, Ruan J, Homer N, Marth G, Abecasis G, Durbin R", journal: "Bioinformatics", year: 2009, access: "open",
    why: "What a format looks like when it is specified first and written down: a declared grammar, a binary twin, and an index. Neither the libraries nor this tool read it.",
  },
  {
    pmid: "19304878", doi: "10.1093/bioinformatics/btp163", pmcid: "PMC2682512",
    title: "Biopython: freely available Python tools for computational molecular biology and bioinformatics",
    authors: "Cock PJ, Antao T, Chang JT, Chapman BA, Cox CJ, Dalke A, Friedberg I, and others", journal: "Bioinformatics", year: 2009, access: "open",
    why: "Bio.SeqIO, which this tool is a port of: one way of reading every format, so a program does not care which one it was given.",
  },
];

/** The list: a shortlist, with details checked on Europe PMC on the date given. */
export const reading: ReadingList = { chosen: false, checked: "2026-11-19", papers };
