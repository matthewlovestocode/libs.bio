/**
 * The visual glossary: general molecular-biology and bioinformatics terms, each with a diagram
 * (chosen by slug in `src/components/diagrams`). Lessons link to these automatically.
 */

export type Category = "basics" | "molecules" | "genes" | "records" | "lab" | "comparison" | "structure";

export const CATEGORIES: { id: Category; title: string; blurb: string }[] = [
  { id: "basics", title: "The basics", blurb: "Cells, DNA, RNA, proteins and how big things are." },
  { id: "molecules", title: "DNA as a molecule", blurb: "Bases, strands and how they pair." },
  { id: "genes", title: "From gene to protein", blurb: "How a sequence is read and what changes do to it." },
  { id: "records", title: "Records and files", blurb: "How sequences are labelled, numbered and stored." },
  { id: "lab", title: "At the bench", blurb: "Cutting, joining, copying and checking DNA." },
  { id: "comparison", title: "Comparing sequences", blurb: "Alignments, patterns and trees." },
  { id: "structure", title: "Three-dimensional structure", blurb: "What molecules look like." },
];

export interface GlossaryEntry {
  slug: string;
  term: string;
  category: Category;
  /** One sentence. Shown on cards and in hover definitions. */
  definition: string;
  /** A short paragraph of further explanation. */
  detail: string;
  /** Why anyone needs to know this. */
  why: string;
  /** Phrases in lesson text that should link here, longest first where they overlap. */
  match: string[];
  related: string[];
  /** The topics that cover this term, by slug. `lessons.ts` checks these against what each lesson expands. */
  topics: string[];
  /** biolibs packages that work with this concept. */
  packages: string[];
}

export const GLOSSARY: GlossaryEntry[] = [
  // --- The basics -------------------------------------------------------------------------------
  {
    slug: "cell",
    term: "Cell",
    category: "basics",
    definition: "The smallest unit of life: a membrane-wrapped compartment that can feed, maintain and copy itself.",
    detail:
      "Bacteria are single small cells with no internal compartments. The cells of animals, plants and fungi are larger and keep their DNA in a compartment called the nucleus. Every cell carries a full copy of the organism's DNA and the machinery to read it.",
    why: "Everything in molecular biology happens inside cells, and most laboratory methods borrow machinery from them.",
    match: ["cells", "cell"],
    related: ["dna", "protein", "plasmid", "genome"],
    topics: ["cloning", "safety"],
    packages: [],
  },
  {
    slug: "dna",
    term: "DNA",
    category: "basics",
    definition: "The molecule that stores a living thing's instructions, as a long sequence of four bases: A, C, G and T.",
    detail:
      "DNA is two strands wound round each other in a double helix, with the bases of one strand paired to the bases of the other. Because each strand determines its partner, a cell copies DNA by separating the strands and rebuilding the missing half of each.",
    why: "Its sequence can be written as text, which is what makes biology something software can work on.",
    match: ["DNA"],
    related: ["base", "base-pair", "rna", "gene", "nucleotide"],
    topics: ["sequences"],
    packages: ["seq", "dseq"],
  },
  {
    slug: "rna",
    term: "RNA",
    category: "basics",
    definition: "A close relative of DNA, usually a single strand, that cells use as a working copy of a gene.",
    detail:
      "RNA uses the base U where DNA uses T, and a slightly different sugar. Messenger RNA carries a gene's instructions to the ribosome. Other kinds of RNA do jobs of their own, and some viruses use RNA instead of DNA as their genome.",
    why: "It is the step between a gene and its protein, and a sequence type software must handle differently from DNA.",
    match: ["RNA"],
    related: ["dna", "transcription", "translation"],
    topics: ["sequences"],
    packages: ["seq"],
  },
  {
    slug: "nucleotide",
    term: "Nucleotide",
    category: "basics",
    definition: "One building block of DNA or RNA: a sugar, a phosphate and a base.",
    detail:
      "Nucleotides join sugar to phosphate to sugar, forming the backbone of a strand, with the bases sticking out to the side. The backbone has a direction: one end finishes with a phosphate, called the 5′ end, and the other with a sugar, the 3′ end.",
    why: "It explains why strands have a direction, and the abbreviation nt, for nucleotides, is how single-stranded lengths are counted.",
    match: ["nucleotides", "nucleotide"],
    related: ["base", "strand-direction", "dna"],
    topics: ["sequences"],
    packages: ["seq"],
  },
  {
    slug: "amino-acid",
    term: "Amino acid",
    category: "basics",
    definition: "One building block of a protein. There are 20 kinds.",
    detail:
      "Every amino acid has the same backbone, which links to the next one in the chain, and a side chain that differs. Side chains may be large or small, charged or neutral, water-loving or water-avoiding, and that variety is what gives each protein its shape. Each amino acid has a three-letter and a one-letter abbreviation, so glycine is Gly or G.",
    why: "Protein sequences are written in the one-letter code, and a codon's meaning is an amino acid.",
    match: ["amino acids", "amino acid"],
    related: ["protein", "residue", "codon", "genetic-code"],
    topics: ["sequences", "structure"],
    packages: ["seq", "seqtools"],
  },
  {
    slug: "enzyme",
    term: "Enzyme",
    category: "basics",
    definition: "A protein that speeds up one specific chemical reaction without being used up.",
    detail:
      "An enzyme has a pocket, the active site, shaped to fit the molecules it acts on. It holds them in a way that makes the reaction easy, releases the products and is ready to go again. Enzyme names usually end in -ase: a polymerase copies DNA, a ligase joins it, a nuclease cuts it.",
    why: "The tools of genetic engineering are enzymes, so predicting an experiment means predicting what its enzymes will do.",
    match: ["enzymes", "enzyme"],
    related: ["protein", "restriction-enzyme", "ligation", "pcr"],
    topics: ["digests", "cloning"],
    packages: ["restriction"],
  },
  {
    slug: "chromosome",
    term: "Chromosome",
    category: "basics",
    definition: "One very long DNA molecule, carrying many genes.",
    detail:
      "A bacterium usually has a single circular chromosome. Human cells have 46 linear ones, 23 inherited from each parent. A chromosome is far too long to read in one piece, so it is sequenced in fragments that software fits back together.",
    why: "Positions in a genome are given as a chromosome and a coordinate along it.",
    match: ["chromosomes", "chromosome"],
    related: ["genome", "gene", "dna", "plasmid"],
    topics: ["lookup"],
    packages: ["seqio"],
  },
  {
    slug: "genome",
    term: "Genome",
    category: "basics",
    definition: "All of the DNA of an organism.",
    detail:
      "Genomes vary enormously in size, from tens of thousands of bases in a virus to billions in an animal or plant. Size is not a measure of complexity: genes make up most of a bacterial genome but only a few percent of a human one.",
    why: "Its size is why nobody reads a genome by eye, and why searching and comparing need software.",
    match: ["genomes", "genome"],
    related: ["chromosome", "gene", "units"],
    topics: ["lookup", "safety"],
    packages: ["seqio"],
  },
  {
    slug: "units",
    term: "Units of size",
    category: "basics",
    definition: "The abbreviations used for lengths, masses and distances: bp, kb, Mb, Da and Å.",
    detail:
      "DNA length is counted in base pairs (bp), thousands of them (kb, kilobases) or millions (Mb, megabases). The mass of a molecule is given in daltons (Da), one dalton being about the mass of a hydrogen atom. Distances inside a molecule are given in ångströms (Å), ten-billionths of a metre.",
    why: "These turn up in every result: fragment sizes on a gel, molecular weights, distances between atoms.",
    match: ["kilobases", "kilobase", "daltons", "dalton", "ångströms"],
    related: ["base-pair", "genome", "gel-electrophoresis"],
    topics: ["digests", "sequences"],
    packages: ["seqtools", "gel", "pdb"],
  },

  // --- DNA as a molecule ------------------------------------------------------------------------
  {
    slug: "base",
    term: "Base",
    category: "molecules",
    definition: "One of the four chemical letters of DNA (A, C, G and T) or of RNA (A, C, G and U).",
    detail:
      "Each base is attached to a sugar and a phosphate. That unit is a nucleotide, and nucleotides joined end to end make a strand. When a base is not known for certain, extra letters stand for a set of possibilities: N means any base, R means A or G, and so on.",
    why: "Every sequence file, search and alignment is built from these letters.",
    match: ["bases", "base"],
    related: ["base-pair", "strand-direction", "gc-content"],
    topics: ["sequences"],
    packages: ["seq"],
  },
  {
    slug: "base-pair",
    term: "Base pair",
    category: "molecules",
    definition: "Two bases, one on each strand, held together by hydrogen bonds: A with T, and G with C.",
    detail:
      "A G–C pair is held by three hydrogen bonds and an A–T pair by two, so G–C pairs are harder to pull apart. The length of double-stranded DNA is counted in base pairs, written bp; a thousand base pairs is a kilobase, kb.",
    why: "Pairing is what lets one strand be rebuilt from the other, and it is the unit every fragment size is measured in.",
    match: ["base pairs", "base pair"],
    related: ["base", "complement", "gc-content"],
    topics: ["digests", "sequences"],
    packages: ["seq", "dseq"],
  },
  {
    slug: "strand-direction",
    term: "5′ and 3′ ends",
    category: "molecules",
    definition: "The two ends of a DNA strand are chemically different, and are called 5′ (five prime) and 3′ (three prime).",
    detail:
      "The names come from the numbered carbon atoms of the sugar in each nucleotide. Enzymes that copy DNA can only add to a 3′ end, so by convention a sequence is always written from 5′ to 3′. The two strands of a double helix run in opposite directions, which is called antiparallel.",
    why: "Direction decides which way a gene is read and which way a primer is extended.",
    match: ["opposite directions", "antiparallel"],
    related: ["complement", "reverse-complement", "primer"],
    topics: ["pcr", "maps", "sequences"],
    packages: ["seq", "dseq"],
  },
  {
    slug: "complement",
    term: "Complement",
    category: "molecules",
    definition: "The strand that pairs with a given strand: every A swapped for T, every C for G, and the reverse.",
    detail:
      "Written directly beneath the original, the complement reads from 3′ to 5′, which is backwards by the usual convention. That is why the reverse complement is usually the more useful thing to ask for.",
    why: "It is the first step in working out what the other strand says.",
    match: ["complement"],
    related: ["reverse-complement", "base-pair", "strand-direction"],
    topics: ["sequences"],
    packages: ["seq"],
  },
  {
    slug: "reverse-complement",
    term: "Reverse complement",
    category: "molecules",
    definition: "The opposite strand written in its own 5′ to 3′ direction: complement every base, then reverse the order.",
    detail:
      "Because the strands run in opposite directions, reading the partner strand the right way round means reading the complement from right to left. A sequence that equals its own reverse complement, such as GAATTC, is called palindromic.",
    why: "A gene can lie on either strand, so software constantly has to switch to the other strand's point of view.",
    match: ["reverse complement"],
    related: ["complement", "strand-direction", "restriction-enzyme"],
    topics: ["sequences", "motifs"],
    packages: ["seq", "seqrecord"],
  },
  {
    slug: "gc-content",
    term: "GC content",
    category: "molecules",
    definition: "The fraction of the bases in a sequence that are G or C.",
    detail:
      "G–C pairs are more stable than A–T pairs, so DNA with a higher GC content needs more heat to separate. GC content also differs between organisms and between regions of a genome, which makes it a quick fingerprint of where a sequence came from.",
    why: "It feeds directly into melting temperature, and so into every primer you design.",
    match: ["GC content"],
    related: ["base-pair", "melting-temperature", "primer"],
    topics: ["pcr", "sequences", "motifs"],
    packages: ["seqtools"],
  },
  {
    slug: "melting-temperature",
    term: "Melting temperature",
    category: "molecules",
    definition: "The temperature at which half of the copies of a double-stranded DNA have separated into single strands.",
    detail:
      "Usually written Tm. It rises with length and with GC content, and it depends on the salt in the solution. For short pieces such as primers it can be estimated well from the sequence alone.",
    why: "A PCR only works if both primers bind at the same temperature, so their melting temperatures have to match.",
    match: ["melting temperatures", "melting temperature"],
    related: ["gc-content", "primer", "pcr"],
    topics: ["pcr"],
    packages: ["seqtools", "pcr"],
  },

  // --- From gene to protein ---------------------------------------------------------------------
  {
    slug: "gene",
    term: "Gene",
    category: "genes",
    definition: "A stretch of DNA that carries the instructions for one product, usually a protein.",
    detail:
      "A gene is more than its coding part. It has a promoter, where copying into RNA begins, and a terminator, where copying stops. Genes can lie on either strand, and in many organisms the coding part is split into pieces that are joined after copying.",
    why: "Genes are the things most features in a sequence record describe.",
    match: ["genes", "gene"],
    related: ["feature", "transcription", "codon", "promoter"],
    topics: ["maps", "motifs", "lookup"],
    packages: ["seqfeature", "seqrecord"],
  },
  {
    slug: "transcription",
    term: "Transcription",
    category: "genes",
    definition: "Copying one strand of a gene into RNA.",
    detail:
      "RNA uses the same letters as DNA except that U takes the place of T. The copy, called messenger RNA, carries the gene's message to the machinery that builds proteins. In sequence terms transcription is simply replacing every T with U.",
    why: "It is the first of the two steps between a gene and its protein.",
    match: ["transcription", "transcribed"],
    related: ["translation", "gene", "codon", "exons-and-introns"],
    topics: ["sequences"],
    packages: ["seq"],
  },
  {
    slug: "translation",
    term: "Translation",
    category: "genes",
    definition: "Reading messenger RNA three bases at a time to build a protein.",
    detail:
      "Each group of three bases names one amino acid, and the amino acids are joined in order into a chain. Translation normally begins at a start codon and ends at the first stop codon.",
    why: "It is how software predicts the protein a piece of DNA encodes.",
    match: ["translation"],
    related: ["codon", "genetic-code", "reading-frame", "protein"],
    topics: ["sequences"],
    packages: ["seq", "seqrecord"],
  },
  {
    slug: "codon",
    term: "Codon",
    category: "genes",
    definition: "Three consecutive bases that together specify one amino acid, or signal stop.",
    detail:
      "There are 64 possible codons and only 20 amino acids, so most amino acids are written by several codons. ATG both starts a protein and codes for methionine. In the standard code three codons, TAA, TAG and TGA, mean stop.",
    why: "The codon is the unit of translation, and of most mutations that matter.",
    match: ["codons", "codon"],
    related: ["genetic-code", "reading-frame", "translation", "mutation"],
    topics: ["sequences"],
    packages: ["seq"],
  },
  {
    slug: "genetic-code",
    term: "Genetic code",
    category: "genes",
    definition: "The table that says which amino acid each codon stands for.",
    detail:
      "The code is nearly the same in all living things, but not quite. Mitochondria and some microbes read a few codons differently, and the variants are catalogued as numbered tables. Translating with the wrong table gives the wrong protein.",
    why: "Choosing the right table is the difference between a correct protein and a truncated one.",
    match: ["genetic codes", "genetic code"],
    related: ["codon", "translation"],
    topics: ["sequences"],
    packages: ["seq"],
  },
  {
    slug: "reading-frame",
    term: "Reading frame",
    category: "genes",
    definition: "Which base you start counting codons from. Each strand can be read in three frames.",
    detail:
      "Shift the starting point by one base and every codon changes, so the same DNA spells three unrelated proteins per strand, six in all. A run of codons from a start to a stop with no stop in between is an open reading frame, or ORF, and is a candidate gene.",
    why: "Finding the right frame is how genes are located in new sequence.",
    match: ["reading frames", "reading frame"],
    related: ["codon", "translation", "mutation"],
    topics: ["sequences"],
    packages: ["seq", "seqtools"],
  },
  {
    slug: "mutation",
    term: "Mutation",
    category: "genes",
    definition: "A change in a DNA sequence.",
    detail:
      "A base can be substituted, or bases can be inserted or deleted. Within a gene, a substitution may leave the amino acid unchanged (silent), change it (missense) or create a stop (nonsense). An insertion or deletion that is not a multiple of three shifts the reading frame for everything after it.",
    why: "Mutations are the raw material of evolution and the cause of many diseases, and comparing sequences is largely a matter of finding them.",
    match: ["mutations", "mutation"],
    related: ["codon", "reading-frame", "alignment"],
    topics: ["alignment"],
    packages: ["seq", "align"],
  },
  {
    slug: "promoter",
    term: "Promoter",
    category: "genes",
    definition: "The stretch of DNA just before a gene where the copying machinery attaches to begin transcription.",
    detail:
      "A promoter acts as the gene's on switch. A strong promoter means many RNA copies and a lot of protein; a weak one means little. In engineered DNA, the promoter is chosen to decide when and how much of a protein the cell makes.",
    why: "Promoters are among the most commonly annotated features, and choosing one is a routine design decision.",
    match: ["promoters", "promoter"],
    related: ["gene", "transcription", "feature"],
    topics: ["maps", "motifs"],
    packages: ["seqfeature", "features"],
  },
  {
    slug: "exons-and-introns",
    term: "Exons and introns",
    category: "genes",
    definition: "In animals, plants and fungi a gene is split into pieces: exons are kept, and the introns between them are removed from the RNA copy.",
    detail:
      "After a gene is transcribed, the introns are cut out and the exons joined, a step called splicing. Only the joined exons are translated. Bacterial genes are mostly continuous, with no introns.",
    why: "It is why a gene's location in a database is often several ranges joined together and not one.",
    match: ["exons", "introns", "exon", "intron"],
    related: ["gene", "transcription", "feature"],
    topics: ["maps"],
    packages: ["seqfeature"],
  },
  {
    slug: "start-and-stop-codons",
    term: "Start and stop codons",
    category: "genes",
    definition: "The codons that mark where translation begins and ends.",
    detail:
      "Translation usually starts at ATG, which also codes for the amino acid methionine, so most proteins begin with it. It ends at the first stop codon in the same reading frame: TAA, TAG or TGA in the standard code. A stop codon adds no amino acid.",
    why: "Finding them is how the beginning and end of a protein-coding region are located.",
    match: ["start codon", "stop codons", "stop codon"],
    related: ["codon", "open-reading-frame", "reading-frame", "genetic-code"],
    topics: ["sequences"],
    packages: ["seq"],
  },
  {
    slug: "open-reading-frame",
    term: "Open reading frame",
    category: "genes",
    definition: "A run of codons that begins with a start codon and continues to the first stop codon, with no stop in between.",
    detail:
      "Usually shortened to ORF. In random sequence a stop codon turns up about once in every twenty codons, so a long stretch without one is unlikely to be chance and is a good candidate for a gene.",
    why: "Scanning for long open reading frames is the simplest way to find genes in new sequence.",
    match: ["open reading frames", "open reading frame", "ORF"],
    related: ["start-and-stop-codons", "reading-frame", "gene"],
    topics: ["sequences"],
    packages: ["seq", "seqtools"],
  },

  // --- Records and files ------------------------------------------------------------------------
  {
    slug: "feature",
    term: "Feature",
    category: "records",
    definition: "A labelled region of a sequence, such as a gene, a promoter or a binding site.",
    detail:
      "A feature has a type, a location and a strand. The location may be a single range, several ranges joined together, or a range whose ends are only approximately known. A sequence together with its features and description is a record.",
    why: "Features turn a string of letters into a map someone can use.",
    match: ["features", "feature"],
    related: ["gene", "coordinates", "plasmid"],
    topics: ["maps", "files", "lookup"],
    packages: ["seqfeature", "seqrecord", "seqedit", "features"],
  },
  {
    slug: "plasmid",
    term: "Plasmid",
    category: "records",
    definition: "A small circular DNA molecule, separate from the chromosome, that bacteria copy and pass on.",
    detail:
      "Laboratory plasmids carry an origin of replication so the cell copies them, a resistance gene so that cells holding the plasmid can be selected, and a place to insert the DNA you care about. A circle has no ends, so where the numbering starts is only a convention.",
    why: "Plasmids are the standard vehicle for carrying engineered DNA into cells.",
    match: ["plasmids", "plasmid"],
    related: ["feature", "restriction-enzyme", "ligation"],
    topics: ["digests", "maps", "cloning", "files", "safety"],
    packages: ["seqedit", "cloning", "seqmap", "dseq"],
  },
  {
    slug: "coordinates",
    term: "Zero-based and one-based coordinates",
    category: "records",
    definition: "Two ways of numbering positions: count the bases starting from 1, or count the gaps between them starting from 0.",
    detail:
      "Databases such as GenBank number bases from 1 and include both ends of a range. Most programming languages number from 0 and exclude the end. The same three bases are 3..5 in one system and 2 to 5 in the other, and mixing them up shifts everything by one.",
    why: "Off-by-one errors between the two conventions are the most common bug in sequence software.",
    match: ["0-based", "1-based"],
    related: ["feature", "restriction-enzyme"],
    topics: ["maps", "files", "lookup"],
    packages: ["seqfeature", "restriction"],
  },
  {
    slug: "fasta",
    term: "FASTA",
    category: "records",
    definition: "A plain-text sequence format: a line beginning with > that names the sequence, followed by the letters.",
    detail:
      "The sequence may be wrapped over several lines, and one file can hold many sequences one after another. FASTA stores nothing else, which is why almost every tool can read it.",
    why: "It is the lowest common denominator for exchanging sequences.",
    match: ["FASTA"],
    related: ["fastq", "feature"],
    topics: ["files"],
    packages: ["seqio"],
  },
  {
    slug: "fastq",
    term: "FASTQ and quality scores",
    category: "records",
    definition: "FASTA plus a quality score for every base, as written by sequencing machines.",
    detail:
      "Each score estimates the chance that the base is wrong. A score of 20 means 1 chance in 100, 30 means 1 in 1,000 and 40 means 1 in 10,000. To save space each score is stored as a single character, lined up beneath its base.",
    why: "Quality scores let analysis ignore the bases a machine was unsure of.",
    match: ["FASTQ", "quality scores", "quality score"],
    related: ["fasta"],
    topics: ["files"],
    packages: ["seqio"],
  },

  // --- At the bench -----------------------------------------------------------------------------
  {
    slug: "restriction-enzyme",
    term: "Restriction enzyme",
    category: "lab",
    definition: "A protein that cuts DNA wherever it finds one specific short sequence.",
    detail:
      "Bacteria make these enzymes to destroy the DNA of invading viruses. Each recognises its own site, typically four to eight bases long, and cuts both strands at fixed points within or beside it. More than a thousand are known.",
    why: "They are the scissors of molecular cloning, and predicting where they cut is the first step in planning it.",
    match: ["restriction enzymes", "restriction enzyme"],
    related: ["sticky-end", "blunt-end", "ligation", "gel-electrophoresis", "enzyme"],
    topics: ["digests", "maps", "cloning", "safety"],
    packages: ["restriction", "cloning"],
  },
  {
    slug: "sticky-end",
    term: "Sticky end",
    category: "lab",
    definition: "A short single-stranded overhang left when an enzyme cuts the two strands a few bases apart.",
    detail:
      "The overhang can pair with any end carrying the complementary overhang, and with no other. Two fragments cut by the same enzyme therefore fit together, which is what makes cutting and pasting DNA predictable.",
    why: "Whether two ends are compatible decides whether a planned ligation can work at all.",
    match: ["sticky ends", "sticky end"],
    related: ["blunt-end", "restriction-enzyme", "ligation"],
    topics: ["digests", "cloning"],
    packages: ["restriction", "cloning", "dseq"],
  },
  {
    slug: "blunt-end",
    term: "Blunt end",
    category: "lab",
    definition: "An end with no overhang, left when an enzyme cuts both strands at the same position.",
    detail:
      "Any blunt end can be joined to any other, which is flexible but less efficient and gives no control over which way round a fragment goes in.",
    why: "Knowing which enzymes leave blunt ends tells you when orientation has to be checked afterwards.",
    match: ["blunt ends", "blunt end"],
    related: ["sticky-end", "restriction-enzyme", "ligation"],
    topics: ["digests", "cloning"],
    packages: ["restriction", "cloning", "dseq"],
  },
  {
    slug: "ligation",
    term: "Ligation",
    category: "lab",
    definition: "Joining two DNA ends into one continuous molecule, using the enzyme DNA ligase.",
    detail:
      "Ligase seals the backbone of each strand once two compatible ends have come together. Ligation is the reverse of a restriction cut: read the picture of a cut from bottom to top.",
    why: "It is the paste in cut and paste.",
    match: ["ligation", "ligase"],
    related: ["sticky-end", "blunt-end", "plasmid", "enzyme"],
    topics: ["cloning"],
    packages: ["cloning", "dseq"],
  },
  {
    slug: "primer",
    term: "Primer",
    category: "lab",
    definition: "A short single strand of DNA, usually 18 to 30 bases, that marks where copying should start.",
    detail:
      "A primer binds to the stretch of template it is complementary to, and the copying enzyme extends it from its 3′ end. Primers are made to order, so you choose exactly where they bind.",
    why: "Primer design decides what a PCR amplifies and whether it works.",
    match: ["primers", "primer"],
    related: ["pcr", "melting-temperature", "strand-direction"],
    topics: ["pcr", "cloning"],
    packages: ["pcr", "seqtools"],
  },
  {
    slug: "pcr",
    term: "PCR",
    category: "lab",
    definition: "The polymerase chain reaction: a way of making millions of copies of one chosen stretch of DNA.",
    detail:
      "Two primers bind either side of the target, one on each strand, pointing towards each other. Each cycle of heating and cooling separates the strands, lets the primers bind, and copies the stretch between them, doubling the amount each time.",
    why: "It is how the piece of DNA you want is obtained in the first place.",
    match: ["PCR"],
    related: ["primer", "melting-temperature", "gel-electrophoresis"],
    topics: ["pcr"],
    packages: ["pcr"],
  },
  {
    slug: "gel-electrophoresis",
    term: "Gel electrophoresis",
    category: "lab",
    definition: "Sorting DNA fragments by size by pulling them through a gel with an electric field.",
    detail:
      "DNA is negatively charged, so it moves towards the positive electrode. The gel slows large fragments more than small ones, so fragments of one size gather into a band. A ladder of known sizes run alongside lets you read off how big each band is.",
    why: "It is the everyday check that a digest or a PCR produced what was expected.",
    match: ["gel electrophoresis", "gel"],
    related: ["restriction-enzyme", "pcr", "base-pair"],
    topics: ["digests", "pcr"],
    packages: ["gel"],
  },
  {
    slug: "sequencing",
    term: "Sequencing",
    category: "lab",
    definition: "Reading the order of the bases in a sample of DNA.",
    detail:
      "No machine reads a whole genome in one go. The DNA is broken into fragments, each fragment is read separately, and software pieces the results back together from where they overlap. Some machines produce very many short reads of a few hundred bases; others produce fewer reads that are thousands of bases long.",
    why: "It is where nearly all sequence data comes from, and its limits explain why files hold fragments and quality scores.",
    match: ["sequencing", "sequencers", "sequencer"],
    related: ["read", "fastq", "genome"],
    topics: ["files", "lookup"],
    packages: ["seqio"],
  },
  {
    slug: "read",
    term: "Read",
    category: "lab",
    definition: "One stretch of sequence produced by a sequencing machine from a single fragment of DNA.",
    detail:
      "A sequencing run produces millions of reads. Each position in the original DNA is usually covered by many of them, and the number covering a position is called the coverage or depth. More coverage means more confidence that a base was read correctly.",
    why: "A read is the unit a FASTQ file stores, one record per read.",
    match: [],
    related: ["sequencing", "fastq"],
    topics: ["files", "alignment"],
    packages: ["seqio"],
  },
  {
    slug: "vector-and-insert",
    term: "Vector and insert",
    category: "lab",
    definition: "The vector is the DNA molecule, usually a plasmid, used to carry a piece of DNA into a cell. The insert is the piece it carries.",
    detail:
      "Cloning means putting an insert into a vector. The vector is cut open, the insert is joined in, and the circle is closed again. The vector supplies everything the cell needs to keep and copy the molecule; the insert is the part you are interested in.",
    why: "Every cloning plan is described as a vector plus one or more inserts.",
    match: ["vectors", "vector"],
    related: ["plasmid", "ligation", "restriction-enzyme", "gibson-assembly"],
    topics: ["maps", "cloning"],
    packages: ["cloning", "dseq"],
  },
  {
    slug: "transformation",
    term: "Transformation",
    category: "lab",
    definition: "Getting DNA, usually a plasmid, into bacterial cells.",
    detail:
      "Bacteria are treated so that their outer layers become leaky for a moment, typically with a brief heat shock or an electric pulse, and some of them take up the plasmid. Only a small fraction do, which is why the next step is always selection.",
    why: "It is the step that turns a tube of DNA into living cells that copy it.",
    match: ["transformation"],
    related: ["selection", "plasmid", "cell"],
    topics: ["cloning", "safety"],
    packages: [],
  },
  {
    slug: "selection",
    term: "Selection",
    category: "lab",
    definition: "Keeping only the cells that took up a plasmid, usually by growing them with an antibiotic.",
    detail:
      "The plasmid carries a gene that makes the cell resistant to a particular antibiotic. When the cells are spread on a plate containing that antibiotic, only those with the plasmid survive. Each survivor multiplies into a visible spot called a colony, and every cell in a colony carries the same plasmid.",
    why: "It is the reason almost every laboratory plasmid has a resistance gene among its features.",
    match: ["antibiotic selection"],
    related: ["transformation", "plasmid", "feature"],
    topics: ["maps", "cloning", "safety"],
    packages: ["features"],
  },
  {
    slug: "gibson-assembly",
    term: "Gibson assembly",
    category: "lab",
    definition: "Joining DNA fragments whose ends overlap, in a single reaction and without restriction sites.",
    detail:
      "Each fragment is made so that its last 20 to 40 bases match the start of the next. In the reaction, one enzyme trims back one strand at every end to expose the matching stretches, which pair up; a second enzyme fills in the gaps and a third seals the joins. Several fragments can be joined at once, in a set order.",
    why: "It has become one of the most common ways to build plasmids, and designing the overlaps is a job for software.",
    match: ["Gibson assembly"],
    related: ["ligation", "primer", "pcr", "vector-and-insert"],
    topics: ["cloning"],
    packages: ["cloning", "assembly"],
  },

  // --- Comparing sequences ----------------------------------------------------------------------
  {
    slug: "alignment",
    term: "Alignment",
    category: "comparison",
    definition: "Sequences arranged in rows so that positions believed to correspond sit in the same column.",
    detail:
      "Each column is a match, a mismatch or a gap. A scoring scheme rewards matches and penalises the others, and an algorithm finds the arrangement with the best total. A global alignment covers both sequences end to end; a local one finds only their best-matching parts.",
    why: "Alignment is how similarity is measured, and almost every comparison starts from one.",
    match: ["alignments", "alignment"],
    related: ["gap", "mutation", "phylogenetic-tree", "motif"],
    topics: ["alignment", "trees", "motifs"],
    packages: ["align"],
  },
  {
    slug: "gap",
    term: "Gap",
    category: "comparison",
    definition: "A placeholder in an alignment where one sequence has bases and the other has none.",
    detail:
      "A gap stands for an insertion in one sequence or a deletion in the other; the alignment alone cannot say which. Opening a gap is usually penalised more heavily than extending one, because a single event often adds or removes several bases at once.",
    why: "How gaps are scored changes which alignment comes out best.",
    match: ["gaps", "gap"],
    related: ["alignment", "mutation"],
    topics: ["alignment"],
    packages: ["align"],
  },
  {
    slug: "motif",
    term: "Motif",
    category: "comparison",
    definition: "A short pattern that recurs in many sequences, such as the site a regulatory protein binds.",
    detail:
      "A motif is rarely one exact word. It is described by counting, for each position, how often each base appears among known examples. Those counts become scores, and sliding the scores along a new sequence finds likely sites.",
    why: "Motifs are how binding sites and other signals are found in sequences nobody has studied yet.",
    match: ["motifs", "motif"],
    related: ["alignment", "feature", "promoter"],
    topics: ["motifs"],
    packages: ["motifs"],
  },
  {
    slug: "phylogenetic-tree",
    term: "Phylogenetic tree",
    category: "comparison",
    definition: "A branching diagram of descent: tips are sequences or species, and each fork is an inferred common ancestor.",
    detail:
      "Branch lengths usually stand for the amount of change. Trees are built from aligned sequences, either from the distances between them or by searching for the tree that needs the fewest changes.",
    why: "Trees are how relationships are inferred, from the history of species to the spread of an outbreak.",
    match: ["phylogenetic trees", "phylogenetic tree"],
    related: ["clade", "newick", "alignment", "bootstrap"],
    topics: ["trees"],
    packages: ["phylo", "nexus"],
  },
  {
    slug: "clade",
    term: "Clade",
    category: "comparison",
    definition: "An ancestor together with all of its descendants: one complete branch of a tree.",
    detail:
      "Cut a tree at any branch and everything on the far side is a clade. Clades nest inside one another, and how often a clade reappears when the analysis is repeated on resampled data is a measure of how well supported it is.",
    why: "Clades are the groupings a tree actually claims.",
    match: ["clades", "clade"],
    related: ["phylogenetic-tree", "newick", "bootstrap"],
    topics: ["trees"],
    packages: ["phylo"],
  },
  {
    slug: "newick",
    term: "Newick",
    category: "comparison",
    definition: "A way of writing a tree as text, using nested brackets.",
    detail:
      "Each pair of brackets is a fork and the names inside are its descendants, so ((A,B),C); says that A and B are closest relatives and C is further out. Branch lengths can follow a colon after each name.",
    why: "Nearly every tree program reads and writes it.",
    match: ["Newick"],
    related: ["phylogenetic-tree", "clade"],
    topics: ["trees"],
    packages: ["phylo", "nexus"],
  },
  {
    slug: "homology",
    term: "Homology",
    category: "comparison",
    definition: "Similarity between sequences that exists because they descend from a common ancestor.",
    detail:
      "Homology is a conclusion, not a measurement. Two sequences are either homologous or they are not, so it is not given as a percentage; what can be measured is how similar they are, and strong similarity is the evidence for homology. Homologous genes often do the same job, which is how the function of a newly sequenced gene is usually guessed.",
    why: "It is the reasoning behind almost every sequence search: find something similar that is already understood.",
    match: ["homology", "homologous"],
    related: ["alignment", "identity-and-similarity", "phylogenetic-tree", "mutation"],
    topics: ["alignment", "trees"],
    packages: ["align", "phylo"],
  },
  {
    slug: "identity-and-similarity",
    term: "Identity and similarity",
    category: "comparison",
    definition: "Two ways of scoring an alignment: the share of columns that match exactly, and the share that match or nearly match.",
    detail:
      "Percent identity counts only columns where the two letters are the same. For proteins, similarity also counts columns where one amino acid has been replaced by another of the same character, such as one positively charged amino acid for another. Similarity is therefore always at least as high as identity.",
    why: "These are the two numbers most often quoted for how alike two sequences are, and they are easy to confuse.",
    match: ["percent identity"],
    related: ["alignment", "substitution-matrix", "homology"],
    topics: ["alignment"],
    packages: ["align"],
  },
  {
    slug: "substitution-matrix",
    term: "Substitution matrix",
    category: "comparison",
    definition: "A table giving a score for aligning each letter with each other letter.",
    detail:
      "For proteins the scores come from counting which replacements actually occur in families of related proteins. A positive score means the pair is seen more often than chance would predict, and a negative score less often. BLOSUM62 is the most widely used; others suit closer or more distant relatives.",
    why: "The matrix decides which alignment scores best, so choosing a different one can change the result.",
    match: ["substitution matrices", "substitution matrix", "BLOSUM62"],
    related: ["alignment", "identity-and-similarity", "amino-acid", "gap"],
    topics: ["alignment", "trees"],
    packages: ["align"],
  },
  {
    slug: "bootstrap",
    term: "Bootstrap",
    category: "comparison",
    definition: "A way of measuring how well the data supports each branch of a tree, by rebuilding the tree many times from resampled data.",
    detail:
      "Columns of the alignment are drawn at random, with repeats allowed, to make a new alignment of the same size, and a tree is built from it. This is repeated a hundred or a thousand times. The support for a clade is the percentage of those trees in which it appears.",
    why: "A tree always comes out fully resolved, whether or not the data justifies it. Bootstrap values say which parts to believe.",
    match: ["bootstrap"],
    related: ["phylogenetic-tree", "clade", "alignment"],
    topics: ["trees"],
    packages: ["phylo", "nexus"],
  },

  // --- Structure --------------------------------------------------------------------------------
  {
    slug: "protein",
    term: "Protein",
    category: "structure",
    definition: "A chain of amino acids that folds into a three-dimensional shape, and whose shape decides what it does.",
    detail:
      "Structures worked out by experiment are stored as lists of atom positions, organised as a hierarchy: a structure holds models, a model holds chains, a chain holds residues and a residue holds atoms.",
    why: "Most of what a cell does is done by proteins, and their shape explains how.",
    match: ["proteins", "protein"],
    related: ["residue", "translation", "protein-fold"],
    topics: ["structure", "lookup"],
    packages: ["pdb", "seqtools"],
  },
  {
    slug: "residue",
    term: "Residue",
    category: "structure",
    definition: "One amino acid within a protein chain.",
    detail:
      "It is called a residue because a little of each amino acid is lost when it is joined to its neighbours. Every residue shares the same backbone atoms and differs in its side chain, which gives each amino acid its character.",
    why: "Residues are the level at which structure and sequence line up.",
    match: ["residues", "residue"],
    related: ["protein"],
    topics: ["structure", "lookup"],
    packages: ["pdb"],
  },
  {
    slug: "backbone-and-side-chain",
    term: "Backbone and side chain",
    category: "structure",
    definition: "The two parts of every residue: the backbone, which is the same throughout the chain, and the side chain, which differs.",
    detail:
      "The backbone is a repeating run of three atoms per residue, a nitrogen and two carbons. The middle one, called the alpha carbon, is where the side chain attaches. Comparisons of protein shape often use only the alpha carbons, one point per residue.",
    why: "Structure files name every atom this way, and most measurements pick out backbone atoms.",
    match: ["side chains", "side chain"],
    related: ["residue", "amino-acid", "secondary-structure", "rmsd"],
    topics: ["structure"],
    packages: ["pdb"],
  },
  {
    slug: "secondary-structure",
    term: "Secondary structure",
    category: "structure",
    definition: "The regular local shapes a protein chain folds into, chiefly the alpha helix and the beta sheet.",
    detail:
      "In an alpha helix the chain coils like a spring, with about 3.6 residues to each turn. In a beta sheet, stretches of the chain called strands lie side by side. Both are held together by weak bonds between backbone atoms, and they are joined by less regular loops.",
    why: "Helices and sheets are how protein shapes are described and drawn, and where a residue sits affects what a mutation there will do.",
    match: ["secondary structure", "alpha helix", "beta sheet"],
    related: ["protein", "residue", "backbone-and-side-chain", "protein-fold"],
    topics: ["structure"],
    packages: ["pdb", "seqtools"],
  },
  {
    slug: "rmsd",
    term: "RMSD",
    category: "structure",
    definition: "Root-mean-square deviation: a single number for how far apart two structures are once one has been laid over the other.",
    detail:
      "One structure is rotated and shifted to fit the other as closely as possible. The distance between each pair of matching atoms is then measured, and the RMSD is a kind of average of those distances, in ångströms. Zero means identical; for proteins, a value under about 2 Å usually means the two are very alike.",
    why: "It is the standard way to say how similar two shapes are, or how far a prediction is from the real structure.",
    match: ["RMSD"],
    related: ["protein", "protein-fold", "backbone-and-side-chain", "units"],
    topics: ["structure"],
    packages: ["pdb", "svdsuperimposer"],
  },
  {
    slug: "protein-fold",
    term: "Protein fold",
    category: "structure",
    definition: "The compact three-dimensional shape a protein chain settles into, and the arrangement of helices and strands that shape amounts to.",
    detail:
      "A protein is made as a straight chain and folds itself, driven largely by its side chains: the water-avoiding ones end up buried in the middle and the water-loving ones on the outside. The helices and strands of its secondary structure pack against each other, and how they are arranged is the fold. A fold outlasts the sequence that makes it, so two proteins whose sequences have drifted far apart can still fold the same way.",
    why: "What a protein does follows from its shape, so a shared fold is evidence of a shared job even where an alignment finds little left in common.",
    match: ["protein fold", "folding", "folds", "fold"],
    related: ["protein", "secondary-structure", "backbone-and-side-chain", "residue", "rmsd"],
    topics: ["structure"],
    packages: ["pdb", "svdsuperimposer"],
  },
];

export function getEntry(slug: string): GlossaryEntry | undefined {
  return GLOSSARY.find((entry) => entry.slug === slug);
}

/** The glossary entry whose name is this text, ignoring case, if there is one. */
export function findEntryByName(name: string): GlossaryEntry | undefined {
  const wanted = name.toLowerCase();
  return GLOSSARY.find((entry) => entry.term.toLowerCase() === wanted || entry.match.some((m) => m.toLowerCase() === wanted));
}

// --- Finding terms in running text --------------------------------------------------------------

const PHRASES = GLOSSARY.flatMap((entry) => entry.match.map((phrase) => ({ phrase, slug: entry.slug }))).sort(
  (a, b) => b.phrase.length - a.phrase.length,
);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PATTERN = new RegExp(`(?<![\\w-])(${PHRASES.map((p) => escape(p.phrase)).join("|")})(?![\\w-])`, "gi");
const SLUG_BY_PHRASE = new Map(PHRASES.map((p) => [p.phrase.toLowerCase(), p.slug]));

export type TextPart = { text: string; slug?: string };

/**
 * Split text at the first mention of each glossary term.
 *
 * @param text - Plain text.
 * @param seen - Slugs already linked earlier on the page; matched terms are added to it, so each
 *   term is linked once per page and not on every mention.
 * @param skip - Lower-case phrases to leave unlinked.
 */
export function splitByTerms(text: string, seen: Set<string>, skip?: ReadonlySet<string>): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const match of text.matchAll(PATTERN)) {
    const slug = SLUG_BY_PHRASE.get(match[0].toLowerCase());
    if (!slug || seen.has(slug) || skip?.has(match[0].toLowerCase())) continue;
    seen.add(slug);
    if (match.index > last) parts.push({ text: text.slice(last, match.index) });
    parts.push({ text: match[0], slug });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
