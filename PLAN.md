# libs.bio plan

The web presence for biolibs and Bionet, on the `libs.bio` domain.

This document records a discussion. **Matthew agreed the plan on 2026-11-19**, so work can begin, in
the order under "Sequence of work", which also says how far it has got. Last updated 2026-11-19.

Each item is marked:

- **Decided**: stated by Matthew.
- **Proposed**: suggested in discussion, not yet accepted or rejected.
- **Open**: a question nobody has answered.

## 1. Decided

### Scope

- `libs.bio` is the domain for both biolibs and Bionet. This directory (`~/bio/libs.bio`) holds the web
  presence.
- The existing `biolibs-site` is **redone, not moved**. The new site is built here, in a structure that
  allows exploring the API and using the libraries, with a dedicated section for Bionet.
- Bionet has its own subdomain: `bionet.libs.bio`.
- The projects are still in development. The plan must not assume finished software.

### Audience

- The users are the **DIY bio community**. Usage is driven through people, not corporations or
  institutions.

### Principles

- **Free to use.**
- **Little to no barrier to entry.**
- Everything is focused on making it easy for a visitor to do one of these:
  - do something in the browser;
  - understand the programmatic API;
  - understand the educational concepts behind what they are looking at;
  - look things up in glossaries;
  - follow links to related research papers.

### What "free, no barrier" commits to

- **No accounts, no sign-in, no tracking**, so no cookie banner.
- **Files stay in the browser.** Nothing is uploaded, and the site says so.
- **libs.bio is fully static, on a free CDN.** It has no server of its own. Requests to NCBI or
  UniProt are made from the visitor's browser, so no API key can be used.
- **A tool's state can be shared as a link, when the visitor asks for one** (a "copy link" button).
  It is not put in the URL automatically, because the link carries the visitor's sequence.
- **Works on a phone and a cheap laptop.** This constrains the heavier 3D pieces.
- **Each tool and package says plainly whether it is stable or still moving.**

### Domain and hosting

- The registration stays at IONOS. **DNS is managed at Cloudflare**, by changing the nameservers at
  IONOS once.
- **Both sites are hosted on Cloudflare Workers, each as a Worker that holds only files.** The plan
  first said Cloudflare Pages. It was changed on 2026-11-19, before anything was created there,
  because Cloudflare's documentation now says to start new projects with Workers. Workers gives
  what Pages was chosen for: a build on every push, a preview of each branch, and the bare domain.
- Branch previews are public: anyone with the address can see a branch's site.
- Cloudflare's optional analytics stay off, and its command-line tool is told not to report usage,
  to keep the "no tracking" commitment.
- **bionet.libs.bio is also fully static.** Nothing decided for it needs a server:
  `@biolibs/bionet-demo` opens its lab on a key held in memory and makes no network requests.
- `wren.bionet.libs.bio` and `thistle.bionet.libs.bio` are DNS records pointing at wherever those
  labs are hosted.
- **No email at `libs.bio` yet.** The IONOS mail records that Cloudflare's scan copied in are removed.
  When email is wanted, mail records are added at Cloudflare for whichever provider is chosen.
- Checked against the providers' documentation on 2026-11-19:
  - A Worker's custom domain needs the domain to be an active Cloudflare zone, which it is. A
    custom domain cannot be made on a name that already has a CNAME record.
  - `libs.bio` and `www.libs.bio` are separate names. Sending `www` to the bare domain is a
    redirect rule of its own.
  - Serving static files from a Worker is free and unlimited. The free plan allows 20,000 files a
    site and 3,000 build minutes a month.
  - A page written as `topics.html` is served at `/topics` by default.
  - If DNSSEC is on at the registrar, it is turned off before the nameservers are changed.
  - IONOS's help page does not say what happens to IONOS email after switching to outside
    nameservers. That is unknown.
- **`biolibs-site` keeps running on Render until the new libs.bio has the four bench-work topics
  live**, so there is never a gap. Then its repository is archived on GitHub (read-only, history
  kept) and its Render service is deleted. Its lessons, glossary and examples move to the new site;
  its code does not.

### Structure

- **One repository, two apps.** This directory is a single repository holding the `libs.bio` site and
  the `bionet.libs.bio` site. Each app is its own Cloudflare Worker.
- The repository is **`matthewlovestocode/libs.bio` on GitHub, public from the first commit**.
- **Both sites are built with Next.js, as a static export.** It is what `biolibs-site` and the example
  labs already use, and the Bionet packages are React. A static export has no server features: no
  rewrites, no response headers set by the app, no server-rendered routes.
- A **shared package** holds what the two sites have in common: behaviour and content (glossary,
  layout pieces, status labels), not appearance. Bionet keeps its own theme and mark.
- **Tools first, API behind them.** The landing page lists things you can do; it is not a pitch.
- **The API reference is generated** from the TSDoc and `.d.ts` files in biolibs, so it follows the
  code as it changes. It replaces the hand-written Markdown the current site syncs.
- The explanatory prose in `biolibs/docs/*.md` (why a thing works as it does, what is not ported) is
  kept and feeds the *Understand* views.
- **A full playground** (an editor with types and autocomplete across all packages) is not a first
  goal. The structure must not rule it out.

### The libs.bio page model

- The site is **organised by topic, not by package**. Someone arriving to check a primer should not
  need to know which package does it.
- Each topic has **four views**, reachable from each other, and a visitor can enter by any of them:
  - *Do*: the tool in the browser, with sample data loaded so the first click gives a result.
  - *Code*: the calls that just ran, editable, linked to the API reference.
  - *Understand*: the concept in plain language, glossary terms linked on first mention.
  - *Read*: the papers behind the method.

### Topics

Twelve topics. The **bench-work group is built first**: it is what a DIY lab does week to week, and
it matches the tools in `bionet-desktop`. The package mapping is a first reading and is confirmed as
each topic is built.

| Topic | Packages behind it | First group |
|---|---|---|
| Restriction digests and gels | `restriction`, `gel` | Yes |
| PCR and primers | `pcr`, `seqtools` | Yes |
| Cloning and assembly (ligation, Gibson) | `cloning`, `assembly`, `assembly2`, `dseq` | Yes |
| Plasmid maps and features | `seqmap`, `seqfeature`, `features` | Yes |
| Reading and converting files | `seqio`, `align`, `phylo`, `pdb` | |
| Sequences and translation | `seq`, `seqtools` | |
| Alignment | `align` | |
| Trees | `phylo`, `nexus` | |
| Protein structure | `pdb`, `svdsuperimposer` | |
| Motifs | `motifs` | |
| Looking things up (NCBI, UniProt, papers) | `entrez`, `uniprot`, `europepmc` | |
| Working safely | None; it has *Understand* and *Read* views only | |

### First release

- The smallest thing worth putting live at `libs.bio` is **a landing page plus one complete topic:
  restriction digests and gels**, with all four views.
- Its purpose is to prove the page model before the other eleven topics are built on it.

### Sequence of work

**Progress as of 2026-11-19.** Steps 1 to 4 are done.

- Step 1: the nameservers are at Cloudflare.
- Step 2: this directory is a public repository on GitHub with the two apps and the shared package.
  Each app is a Cloudflare Worker (`libs-bio` and `bionet-libs-bio`) connected to the repository, so
  a push to `main` builds and deploys it and any other branch gets a preview.
- Both sites are live at https://libs.bio and https://bionet.libs.bio. Bionet's is still its
  placeholder page.
- `www.libs.bio` is sent to `libs.bio`, keeping the path and the query string. It is a redirect rule
  at Cloudflare, with a placeholder DNS record for `www` so the rule has something to act on.
- "Always Use HTTPS" is on for the whole domain, so a plain `http://` address is sent to `https://`.
  It applies to every name under `libs.bio`. When Wren and Thistle move under the domain, their
  hosts must not also force the redirect, or the two will loop.

- Step 3, the first release of `libs.bio`, **went live on 2026-11-19**. It has the landing page and
  the digests and gels topic with its four views, each view a page of its own so it can be linked
  to. How it stands:
  - Matthew chose all five shortlisted papers for the *Read* view on 2026-11-19. Their details
    were checked against Europe PMC by hand that day. Fetching them at build time is not written;
  - "Open a file" reads 25 formats through `@biolibs/seqio`, by choosing a file or dropping one on
    the tool: SnapGene, GenBank, EMBL, FASTA, FASTQ, Sanger traces, Gene Construction Kit, DNA
    Strider and the alignment formats among them, with plain text as the fallback. A file that says
    whether it is circular sets the tool's switch. It was tested with small files built from the
    libraries' own recorded test cases, not with files exported from the real programs;
  - the tool also fetches a record from NCBI by accession number, shows the overhang each cut
    leaves, draws a map of where the cuts fall, and saves the pieces as FASTA and the gel as a PNG.
    Fetching was checked against pBR322 (J01749): 4,361 bp, circular, with EcoRI and BamHI cutting
    where the published map says they do;
  - the NCBI fetch is the one place a page contacts anybody else, and only when asked. NCBI wants a
    contact address from every client. It is read from `NEXT_PUBLIC_NCBI_EMAIL` when the site is
    built, and is not set, so the site is an anonymous client for now;
  - the mark in the header is still the sketch from the mock-up;
  - the *Code* view linked to each package's README until step 4 gave it the API reference.

- Step 4, the generated API reference, **went live on 2026-11-19**. `scripts/api-reference.mjs` reads each package's own type files, doc comments and all,
  before every build, and the pages at `/api` are drawn from what it finds. Six packages are in: the
  ones behind digests and gels (`seq`, `restriction`, `gel`, `seqio`, `seqmap`, `entrez`). How it
  stands:
  - it documents the versions installed from npm, not a checkout of biolibs, so it describes what
    is published;
  - the parity checklists are not beside it yet, which the plan asks for;
  - the explanatory prose in `biolibs/docs/*.md` is not carried into the *Understand* views yet;
  - a package's page is one long page with a filter box. `seqio` has 235 exports.
- Released with it, after Matthew reviewed the live site:
  - **Code is highlighted**, by Shiki when the site is built, so no script colours anything in the
    browser. **DNA is coloured base by base** wherever it appears, including in the box it is typed
    into;
  - **dropdowns draw their own chevron** with room around it, in place of the browser's;
  - **the *Understand* view has three versions and the reader picks one**: new to biology, some
    biology, and knows Biopython. The first is the default and assumes nothing. It has a diagram for
    each idea, a comparison with something familiar and where that comparison stops being true, and
    a short list to remember. The choice is kept in the reader's own browser and carries from topic
    to topic. The diagrams are carried over from `biolibs-site`'s glossary and are drawn by the
    libraries when the site is built. **Every topic's *Understand* view follows this pattern.**

- The **visual glossary** is carried over whole from `biolibs-site` and **went live on
  2026-11-19**: all 60 terms in seven subjects, each with its diagram, a page of its
  own, related terms, the topics that use it and the packages behind it, plus the five "easily
  confused" pairs. How it stands:
  - the words and the diagrams are `biolibs-site`'s, unchanged apart from the frame around a
    diagram, which is drawn in this site's CSS;
  - a lesson links the first mention of any glossary term to its page, and no longer keeps its own
    copy of the terms it uses;
  - an entry names the topics that use it. Most of those topics are not built, and say so;
  - the five "Start here" lessons for complete beginners are not carried over;
  - nothing yet records whether a biologist has reviewed a term, which the plan names as a way for
    the community to take part.

- Step 5 has begun. **PCR and primers**, the second topic, **went live on 2026-11-19**. Its tool designs a pair of primers for a stretch, or takes typed ones, and shows where
  each binds, every product the pair would make, each primer's melting temperature and warnings, a
  map and a gel. It was checked against pUC19 (L09137) with the M13 primers: 2,686 bp, each primer
  binding once, and one 103 bp product spanning the cloning site. How it stands:
  - Matthew chose all five shortlisted papers for its *Read* view on 2026-11-19, with details
    checked on Europe PMC that day. Three of the five are paywalled;
  - it reports what a pair should copy, not how well the reaction would go.
- **Plasmid maps and features**, the third topic, **went live on 2026-11-19**. Its tool draws a sequence as a ring or a bar with the features its file marks, each an
  arrow for its strand and in a lane of its own where two overlap, and marks the common enzymes that
  cut once. A feature can be picked out on the map or in the table, and the map saves as a PNG. It
  was checked against pBR322 (J01749): 48 features, with EcoRI at 4,359 and BamHI at 375. How it
  stands:
  - **features come only from the file.** `@biolibs/features` ships no library of known parts, so a
    sequence that is typed, or a file with nothing marked, gets a bare map and a note saying why.
    pUC19's NCBI record (L09137) is one such: it marks nothing but its source;
  - the map has room for 22 names. Past that it names the largest features and the table has all;
  - it does not edit features or write an annotated file, and it has no link to copy, since a link
    cannot carry features;
  - Matthew chose all six shortlisted papers for its *Read* view on 2026-11-19, with details
    checked on Europe PMC that day. Two of the six are paywalled;
  - `seqfeature` joined the API reference with it, making eight packages;
  - saving any drawing now writes each shape's real colour into the file, so a saved map or gel
    looks as it does on the page.
- **Cloning and assembly**, the fourth topic, **went live on 2026-11-19**. The tool does the two ways of putting DNA together, one at a time behind a switch:
  - **cut and paste**: cut a vector and an insert with the same enzymes and list every circle their
    pieces can be ligated into, with the product drawn as a map carrying both pieces' features, what
    holds each junction together, and the pieces you would have on the bench. Enzymes that cut the
    vector once and the insert too are marked, since those are the ones that can work;
  - **overlaps**: fragments that already share their ends are searched for an arrangement that
    closes into a circle, and fragments that do not are given the primers whose 5′ tails would
    create the overlaps. A tailed primer is reported twice over, whole and binding part, because
    only the binding part sets the annealing temperature;
  - each mode has its own sample, swapped when the mode changes if the visitor has not typed over
    it: pieces that overlap for finding, pieces that butt together for designing;
  - the sample insert was given EcoRI and KpnI ends, because those are the two common enzymes that
    cut the sample plasmid exactly once. BamHI, the obvious choice, cuts it twice by chance, which
    would have contradicted the tool's own advice on the same screen;
  - checked by re-assembling the sample plasmid from three overlapping pieces: 3,000 bp back, three
    25 bp junctions. The ligation was checked by arithmetic that adds up: vector 2,522 + insert 844
    = 3,366 bp, with five features carried into the product;
  - `cloning` and `seqrecord` joined the API reference, making ten packages;
  - Matthew chose all five shortlisted papers for its *Read* view on 2026-11-19, with details
    checked on Europe PMC that day. Two of the five are paywalled;
  - it says whether a product **can** form, not how much of it you would get: no ligation
    efficiency, no insert-to-vector ratio, no dephosphorylation, no methylation.
- **Reading and converting files**, the fifth topic, **went live on 2026-11-19**. The tool opens a file in any of the 25 formats the site offers, shows what each record in
  it holds, and writes it out again in any of 23 formats. How it stands:
  - **what a conversion costs is measured, not looked up.** The file is written, read straight back
    in, and the two are compared, so the answer is what *this* file loses. The sample plasmid as
    FASTA loses its features and its topology; the sample reads as FASTA lose their quality scores;
    as XDNA the plasmid loses nothing at all;
  - two samples, a GenBank plasmid and four FASTQ reads with a quality score for every base, since
    quality is the thing most formats cannot hold;
  - a format that cannot hold what the file carries refuses, and the library's own message is shown
    rather than a guess. Asking for FASTQ from a record with no quality names the record;
  - the three binary outputs are written with a byte handle and offered as a download. SeqXML turns
    out to be readable text, so it is shown; nib and XDNA are not;
  - SFF is left out of the 26 writable formats: its writer needs the flow readings only an SFF file
    carries, so nothing else can become one;
  - Matthew chose all five shortlisted papers for its *Read* view on 2026-11-19, with details
    checked on Europe PMC that day. All five are free to read;
  - it converts whole files, not parts of them: no filtering, no trimming, no renaming.
- **Sequences and translation**, the sixth topic, **went live on 2026-11-19**. The tool measures a sequence, writes it out four ways, reads it in all six frames and
  finds its open reading frames. How it stands:
  - all 27 of NCBI's genetic codes are offered, and choosing one changes the start and stop codons
    shown as well as the translation. Switching the sample to the vertebrate mitochondrial code
    turns AGA and AGG into stops, the stop counts jump and both open frames vanish, which is the
    lesson about picking the right table, demonstrated rather than asserted;
  - the codon view shows each amino acid under the three bases that make it, with start codons and
    stops marked. Clicking a frame in the table switches the view to it;
  - open reading frames are scanned from each start codon to the next stop, longest first, and on a
    circle the frames are followed past the origin. The sample's longest is 181 amino acids on
    frame −1 at bases 1,189–1,731, which was checked by hand: that region's reverse complement
    translates to exactly that protein with no internal stop, and the next codon along is TGA;
  - the frame arithmetic and the ORF scan are the site's own, about forty lines in
    `src/lib/sequence.ts`. Biopython's `sixFrameTranslations` returns a report meant for printing,
    not values to compute with;
  - `seqtools` joined the API reference, making eleven packages;
  - Matthew chose all five shortlisted papers for its *Read* view on 2026-11-19, with details
    checked on Europe PMC that day. One of the five is paywalled;
  - an open reading frame is a candidate, not a gene: nothing here looks for a promoter, a ribosome
    binding site or introns, and the page says so.
- **Alignment**, the seventh topic, **went live on 2026-11-19**. It does the two halves of the
  subject separately:
  - **two sequences**: a pairwise alignment with the scoring in the visitor's hands — end to end or
    best stretch, a match and mismatch score or any of the 30 substitution matrices, and separate
    costs for opening a gap and extending one. The result is written in blocks of 50 columns with a
    bar, a dot or a space between the two lines, and positions that stop agreeing after a gap,
    which is the point made visible;
  - **an alignment file**: Clustal, Stockholm, NEXUS, PHYLIP, MSF or aligned FASTA, read with the
    gaps kept, with a star under every column all the sequences agree on. Nothing is aligned here,
    and the page says so: multiple alignment is a heuristic that needs Clustal or MUSCLE, and a
    browser tab cannot run one;
  - the sample is two made-up isolates of one 300 bp stretch: twelve substitutions and a three-base
    deletion, which align at 96.0% with one optimal alignment. The deletion is visible in the
    second block on the Code view;
  - the counting is the library's own `counts()`, not characters counted here. Percent identity is
    matches over aligned letter pairs, and the lesson says so, since the figure means nothing
    without knowing what it was divided by;
  - `align` joined the API reference, making twelve packages;
  - Matthew chose all five shortlisted papers for its *Read* view on 2026-11-19, with details
    checked on Europe PMC that day. Three of the five are paywalled.
- **Trees**, the eighth topic, **went live on 2026-11-19**. It does both halves: draw a tree you
  have, or build one from sequences.
  - a tree in Newick, NEXUS or phyloXML is read and drawn as a phylogram, with branch lengths to
    scale, a scale bar, support values on the forks and a switch to drop the lengths and show the
    shape alone;
  - from an alignment it measures the distance between every pair in any of 31 models, shows the
    matrix beside the tree, and builds by neighbour joining or UPGMA. The matrix is shown on
    purpose: a tree built from distances can be no better than they are;
  - the sample is a made-up family with a known history — one ancestor, two groups of three and
    two, and an outgroup that left earlier. Both methods recover the grouping, and the distances
    show why: about 0.03 within a group, 0.11 between them, 0.20 to the outgroup;
  - **drawing is the site's own**, about thirty lines, because `Bio.Phylo.draw` needs matplotlib and
    was the one part of the module not ported. The library gives the shape; the page gives pixels;
  - a bug worth recording: the layout floored the tree's width at 1, which squashed every real tree
    into a tenth of the panel, since branch lengths are fractions of a substitution per site. Caught
    by reading the drawn coordinates out of the page rather than by looking at it;
  - bootstrap values are shown when a file carries them and are never computed: the library leaves
    out what uses Python's random number generator, and the lesson says a support value measures
    consistency, not truth;
  - `phylo` joined the API reference, making thirteen packages;
  - Matthew chose all five shortlisted papers for its *Read* view on 2026-11-19, with details
    checked on Europe PMC that day. Three of the five are paywalled.
- **Protein structure**, the ninth topic, **went live on 2026-11-19**. It opens a PDB or mmCIF file,
  says what is in it, and draws the two pictures that say most about a fold. How it stands:
  - a **contact map**, every residue against every other, dark where their α-carbons are within 8 Å,
    and a **Ramachandran plot**, each residue placed by its two backbone angles with the helix and
    strand regions shaded;
  - per chain it separates residues, waters and everything else, since mistaking 300 waters for 300
    residues is an easy way to misread a file, and shows the sequence in one-letter code;
  - solvent-accessible surface area on a button, because it takes a moment and is not wanted for
    every file;
  - **the sample is built, not copied**: a 24-residue peptide assembled from standard bond geometry
    and chosen torsions, so nothing here is anybody else's data. Measuring the torsions back gives
    exactly what it was built with, helix φ −57 ψ −47 and strand φ −139 ψ 135, which is a real check
    that the building and the reading agree;
  - the sample has **no long-range contacts**, and the page says so rather than pretending: a single
    extended peptide never folds back on itself. Idealised turn geometry was tried and gave strands
    2.9 Å apart, which is unphysical, so it was dropped rather than shipped;
  - **a PDB id fetches the real thing** from RCSB, the browser asking it directly as it asks NCBI
    elsewhere. Checked with 1CRN: 46 residues, the right crambin sequence, 2,976 Å² of surface, and
    the closest long-range contact CYS 4 · CYS 32 at 4.1 Å, which is one of crambin's three real
    disulfide bonds;
  - a bug found while testing: the contact search was given plain points rather than atoms, and the
    library asks an atom for its coordinates, so it silently returned nothing. It now parses the
    file and uses the real atoms;
  - `pdb` joined the API reference, making fourteen packages;
  - Matthew chose all five shortlisted papers for its *Read* view on 2026-11-19, with details
    checked on Europe PMC that day. Three of the five are paywalled;
  - **a 3D backbone view went live on 2026-11-19**, after Matthew asked whether React Three Fiber
    had a use here. It does: `@biolibs/bionet-scene` is already built on it, so the stack was
    already in the family. The view is a tube through the α-carbons, coloured by what the
    backbone's own angles say each stretch is doing, with the site's own orbit controls rather than
    a helper package, and clicking a contact pair marks both residues in space;
  - three.js is loaded only when the view is asked for: it is 175 KB gzipped in a chunk of its own,
    and the structure page's initial scripts are 251 KB against the trees page's 457 KB, so nothing
    is paid for by somebody who does not open it;
  - it needed `transpilePackages: ["three", "@react-three/fiber"]`. Without it the canvas appeared
    and three.js loaded, but nothing was ever drawn and the canvas stayed at its default 300 by 150:
    React Three Fiber is a React renderer of its own and has to be compiled against the same copy of
    React as the app. It worked in the dev server and failed in the production build, which is what
    pointed at the cause. Checked afterwards on the built output with 1CRN: crambin's fold, its two
    helices and its sheet, with a picked disulfide marked;
  - it is a trace, not a structure viewer: no side chains, no surfaces, no selection language.
- **Motifs**, the tenth topic, **went live on 2026-11-19**. Give it the places a short pattern has
  been seen and it builds the motif, draws it, and looks for it. How it stands:
  - the drawing is a **sequence logo**: each position as tall as it is telling, two bits where only
    one letter ever appears and nothing where anything goes, with each letter's share of the height
    its share of the instances. The information content is the site's own six lines, worked out from
    the library's own frequencies so the picture cannot disagree with the matrix beside it;
  - pseudocounts, background composition and the score to beat are all in the visitor's hands, with
    two thresholds the library works out — one false hit in a thousand, and Hertz and Stormo's —
    rather than a round number;
  - the sample has **three copies planted at known places**, two on the strand as written and one on
    the other. The scan finds exactly those three at the top, all at the maximum score, which is a
    check that can be seen rather than argued about. It also finds ten more at the default
    threshold, which is the lesson about where to draw the line, demonstrated rather than asserted;
  - `motifs` joined the API reference, making fifteen packages;
  - `Paper.doi` is now nullable: the MEME paper has no DOI, and inventing one or faking the type
    would have been worse than the view simply not offering that link;
  - its *Read* view is a shortlist of five, checked on Europe PMC on 2026-11-19, which Matthew has
    not chosen from. Three of the five are paywalled;
  - it takes the instances as given: finding a motif nobody has described is motif discovery, which
    this does not attempt, and the lesson says so. Nothing is posted to the WebLogo server.
- **Looking things up**, the eleventh topic, **went live on 2026-11-19**. One question to one of
  three public services, asked by the visitor's own browser. How it stands:
  - **NCBI**: search nucleotide or protein records and get accessions back with what each one is,
    which is how you find the accession the other tools take;
  - **UniProt**: a protein by accession, with the thing most worth knowing shown first — whether a
    curator has been over it or a machine guessed it — and **both numberings side by side**, since
    a modification at 30 as the gene makes it is at 15 on what a lab holds, and papers use both;
  - **Europe PMC**: a search that distinguishes open access, which is a licence, from the full text
    being present, which is a different fact; and for a paper whose text is there, the whole thing
    as sections rather than as JATS markup. Reading one takes fifteen to twenty seconds, which the
    button says while it waits;
  - all three checked from a browser, which is the check that matters: each service answers
    cross-origin, so no part of this needs a server. The browser asks directly and each service sees
    the query and nothing else;
  - **BLAST is shown but not offered.** `@biolibs/blast` ports NCBI's qblast faithfully, but Matthew
    timed the queries at over half an hour, which is a queue at NCBI rather than anything the port
    does. That is a script to leave running, not a button on a page somebody is waiting at. The Code
    view shows the call and the lesson says why it is not there;
  - `uniprot` and `europepmc` joined the API reference, making seventeen packages;
  - its *Read* view is a shortlist of five, checked on Europe PMC on 2026-11-19 — with the same
    service this topic asks — which Matthew has not chosen from. All five are free to read;
  - it sends a tool name and no address. NCBI asks every client for one and the field is still
    unset, so the site is an anonymous client, which works.
- **Working safely**, the twelfth and last topic, **went live on 2026-11-19**. It is the one topic
  with no package behind it, so it has **three tabs, not four**: writing
  a Code view that said there was no code would be worse than leaving the tab out. How it stands:
  - the Do view asks six questions somebody qualified would ask and says where each answer actually
    lives. It answers none of them, and says so at the top rather than in small print at the bottom;
  - the four containment levels are **quoted verbatim** from BMBL 6th edition, pages 28 to 30, with
    this site's summary kept visibly separate from the quotation;
  - **everything describing somebody else's rules was checked against the issuing body**, as this
    plan requires, rather than written from memory. That check changed the page:
    - WHO's 4th edition manual (2020) moved the emphasis from fixed levels to risk assessment, and
      BMBL says of itself that it is advisory, not a regulation, and that its core principle is
      protocol-driven risk assessment. The page now reasons from the protocol to the level rather
      than presenting a lookup table, which is how most people including me would have written it;
    - **two resources this plan says to point at are gone.** `diybio.org/codes` says the programme
      is now closed, pointing at a preserved record on DIYbiosphere; and `ask.diybio.org`, the
      ask-a-biosafety-professional service, answers with a certificate issued for wordpress.com. The
      page links the preserved code as a 2011 document never formally revised, and does not link the
      service at all. **The plan's biosafety decision to "point to the DIYbio codes of ethics and
      its service" needs revisiting by Matthew**: there is no live service to point at;
    - the IATA page on infectious substances returned a 404, so the page names the WHO transport
      guidance and **states no shipping categories, UN numbers or packing instructions**;
  - the three failed checks are printed on the page itself, next to the ones that passed, under
    "What this page could not check". A safety page that is confidently wrong is worse than one with
    its gaps marked;
  - its *Read* view is a shortlist of five about how this community governs itself, checked on
    Europe PMC on 2026-11-19, which Matthew has not chosen from. Four of the five are free to read;
  - there is **no sequence screening tool and will not be one here**: real screening is done by
    providers against curated databases under policy frameworks, and an approximation in a browser
    would produce false reassurance, which is the specific failure worth avoiding. The lesson says
    so in the version written for people who build software.
- What topics share was split out while building it, so a third costs less: where a sequence comes
  from (typed, a file, NCBI, the sample), the topic's frame and tabs, the lesson with its three
  versions, and the reading list.

Left over from step 2, none of it blocking:

- Each Worker also answers at a `workers.dev` address, which branch previews are served from.
- Cloudflare's GitHub app can see more of Matthew's repositories than this one. Narrowing it is a
  setting on GitHub.
- Build watch paths are not set, so both sites rebuild on every push.
- A branch other than `main` gets a public preview at
  `https://<branch>-libs-bio.mattcodenow.workers.dev`, and the same for Bionet.

Choices made while setting up, which were not in the plan and can be changed:

- English pages have no language prefix in their address; another language goes under its code.
- The shared package is `@libsbio/shared`, and the apps are `apps/libs` and `apps/bionet`.
- The site uses plain CSS over the Bionet theme's variables, not Tailwind, which `biolibs-site`
  uses. The lesson and glossary text carried over so far is plain text and did not need it.
- A link made by "Copy a link" holds the sequence after the `#` of the address. Browsers do not send
  that part to a server, so a shared link still uploads nothing.
- In a topic, the *Do* view is at the topic's own address and the other three views are under it.
- `LICENSE-CONTENT.md` states the CC BY 4.0 licence and links to its text. It does not reproduce it.

| Step | What | Waits on |
|---|---|---|
| 1 | Point the nameservers at Cloudflare, and confirm the provider details flagged as from memory | Nothing |
| 2 | Set up this directory as the repository: two apps, the shared package, two Cloudflare Workers | Step 1, for the live addresses only |
| 3 | **First release of `libs.bio`**: landing page plus digests and gels | Step 2 |
| 4 | The generated API reference, starting with the packages behind that topic | Step 3 |
| 5 | The other three bench-work topics: PCR and primers, cloning and assembly, plasmid maps | Step 3 |
| 6 | Archive `biolibs-site` and delete its Render service | Step 5 |
| 7 | **First release of `bionet.libs.bio`**: what Bionet is, the demo lab, the plain statement on biosafety | Step 2 |
| 8 | Move Wren and Thistle to their new addresses and re-sign them | Step 1 |
| 9 | The peer starter template, then the Render and Docker guides | Step 7 |
| 10 | The remaining eight topics, and the machine-in-the-lab guide | Steps 5 and 9 |

- **The API reference comes after the first topic.** Until step 4, the *Code* view links to the
  package's README.
- **The two sites are independent after step 2.** Steps 7 to 9 do not wait on steps 3 to 6.
- **The Bionet site's first release has no download.** It explains and demonstrates, until a packaged
  `bionet-desktop` exists.
- **The Bionet site's first release uses today's solid panels.** It does not wait for the glass look
  to reach the Bionet packages.

### Content

- **Carried over from `biolibs-site`:**
  - the lessons and the 60-term glossary, as the basis of the *Understand* views;
  - the parity checklists, kept near the API reference;
  - the file converter and worked examples, rebuilt as *Do* views.
- **Papers:**
  - a curated handful per topic (the original method paper and a good review), not a search result;
  - stored as a DOI or PMID, with titles, authors and open-access status fetched at build time
    through `@biolibs/europepmc`;
  - open-access links preferred, paywalled ones marked;
  - Matthew chooses the first set, for the four bench-work topics, to set the pattern. After that the
    list is a plain file in the repository, and anyone can propose additions by pull request.

### Languages and licence

- **Content is in English only, and the structure is ready for more languages**: routes and content
  files are laid out at setup so a translation can be added without restructuring. Translation is a
  way for the community to take part.
- **The sites' own content (lessons, glossary, diagrams, guides) is licensed CC BY 4.0.** The code
  stays MIT. This is settled before any content is published.

### Community

- **Ways to take part:** reviewing glossary terms (the glossary already tracks whether a biologist
  has reviewed each one), reporting parity gaps, and adding examples.
- **Where people talk:** GitHub Discussions on the biolibs repository, to start. A chat space is
  considered once there are people to fill it, since bench-first people without a GitHub account are
  otherwise left out.

### Biosafety

- **Say plainly what Bionet is.** A page on `bionet.libs.bio` states what it does and does not do: a
  lab chooses what it lists and offers; an inventory names parts by checksum; nothing in Bionet ships
  material, vets a lab or checks what a sequence is; and with no central party, nothing is enforced.
- **Adopt the community's code.** Point to the DIYbio codes of ethics and its service for asking a
  biosafety professional, and state an expectation of work at the lowest containment level.
- **Teach it.** "Working safely" is a twelfth topic on `libs.bio`: containment levels, what not to
  work with, disposal, and how sending material works (transfer agreements, shipping rules).
- Guidance for labs on what to list: publishing an inventory is a public act, and "held but not
  offered" exists for the cases where a lab wants to be careful.
- Descriptions of other projects' practice are from memory and are checked before the site cites
  them.

### Visual design of the Bionet software

Settled in the design conversation that began 2026-11-19. The mock-ups are in `design/`. These are
changes to the Bionet packages in biolibs, starting with `@biolibs/bionet-theme`, not to this
repository.

- The lab software keeps a light and a dark theme.
- **Panels are pronounced glass**, replacing today's solid blue panels: a translucent fill, a blur
  of what is behind, a bright edge and a top highlight (`design/panel-treatments.html`, row 3).
- **What is behind the glass is tied to something real**, in keeping with the theme's rule that
  colours carry meaning. On the Lab tab and the tools that is the 3D scene.
- **Where a page has no scene, the lab's own constructs float behind the panels**, drawn as maps
  (`design/floating-constructs.html`, row 2):
  - a few constructs, chosen from the whole lab;
  - each drawn much larger than the window, so the view moves across part of a map and large shapes
    pass behind the glass;
  - a slow drift;
  - at **10% strength**. It is background, subtle and not distracting, and not meant to be read or
    understood;
  - in the meaning colours: cyan for this lab's, amber for held but not on offer;
  - with the page's grid drawn over them, so it is never lost.
- **The base is variant D** in `design/glass-variants.html`: controls inside a panel are glass too,
  and the panel carries a denser tint (about 42% in dark, 58% in light) with slightly stronger grey
  text, so small text stays readable over a moving background.
- **Where blur is unavailable, or the system asks for reduced transparency, panels fall back to
  today's solid fill.**
- **An empty lab shows the Bionet mark in grey**, at about 12%, over a neutral glow. Grey, so no
  colour claims a meaning it does not have.
- **The light theme may run the constructs slightly stronger than the dark**, so the two look
  equally quiet. 10% is the reference; the light value is tuned by eye when it is built.

### The libs.bio mark

- `libs.bio` has a mark of its own, themed to sit beside Bionet's.
- **The mark is a lower-case b traced inside a DNA ladder**, from the ladder's own rails and rungs,
  with nothing added outside it: the whole left rail, the lower part of the right rail, and the two
  rungs that close the bowl.
- The chosen drawing is **version D in `design/mark-b-within-ladder.html`**: a tall, narrow ladder
  with five rungs, the rest of the ladder in the same cyan at about a quarter strength, and a green
  rung inside the bowl.
- It is drawn in the Bionet mark's language: one thin line weight and round ends. The name beside it
  is set in the typeface the Bionet logo uses, Geist ExtraLight.
- The mock-up is a sketch. The final geometry is drawn properly when the site is built.

### Visual design of libs.bio

- **Related to the Bionet look, but calmer.** The two sites share the grid, the typography and the
  light and dark themes.
- **Reading surfaces are flat.** Lessons, glossary, code and papers sit on plain panels, with nothing
  moving behind them.
- **Glass is used only around the tools**, in the *Do* view, so a tool feels like the lab software.
- **Behind the tools, gel bands and ladders drift**, the way plasmid maps do in the Bionet software:
  oversized, slow, with the grid drawn over them. Each site has its own motif.
- **The bands are stronger here than the constructs are in the lab software**: about 22% in dark and
  24% in light, against 10%, confirmed by eye on `design/topic-page.html`. At 10% they barely
  showed, because the tool's panels cover most of the area. The tool area also keeps a wide margin
  around its panels so the background has room.
- **A topic shows one view at a time, behind its four tabs** (*Do*, *Code*, *Understand*, *Read*).
  The views are not stacked down one page.
- The same fallbacks apply: solid panels where blur is unavailable or reduced transparency is asked
  for, and no motion where reduced motion is asked for.
- A first mock-up of the digests and gels topic page is in `design/topic-page.html`. It is a
  drawing to react to, not an agreed layout.

### Bionet infrastructure

- There should be, if possible, a **no-infrastructure-cost option** for the user.
- Labs or institutions that need **always-on nodes host the infrastructure themselves**. libs.bio does
  not run nodes for them.
- Self-hosting must be **easy and well documented**: how to create a node and how to deploy it.
- The **peer starter and the deploy guide are part of this plan**, not separate work the site only
  links to.
- The peer starter lives in **a template repository of its own**, so a lab ends up with a small
  repository it owns. The deploy guide is pages on `bionet.libs.bio`.
- The starter is **peer only by default**, with the lab's **public page as an optional switch**. How
  the switch works is not yet designed; the aim is that the default does not carry the page's heavier
  build. `lab-wren` stays as the worked example of the fuller version.
- **Three hosting guides** are documented:
  - a free platform with a one-click deploy button (Render, where `lab-wren` already runs);
  - a Docker image, covering paid hosts, institutional servers and anything else;
  - a machine in the lab (for example a Raspberry Pi), including a tunnel for a public address with
    TLS.

### Bionet hosting tiers

How today's code maps onto the infrastructure decision. This table is the backbone of the hosting
guides.

| Tier | What you get | Cost to the lab | State today |
|---|---|---|---|
| Desktop app only | A full lab on one computer; founding a lab needs no peer | Nothing | Works |
| Moving a lab by file | `exportLab` writes every signed entry to one file, checked on import | Nothing | Works, but built as backup, not as a sync routine |
| A peer on a free host | Members never online together still sync | Nothing; sleeps when idle | Works (`lab-wren` on Render free) |
| An always-on peer | The same, with no wake-up delay or data loss | The lab's hosting bill | Same code on a paid plan or own machine |

Two properties of the peer make the free tier sound: its store is a cache (members re-send the log if
the host wipes it), and it holds no key (it can withhold or serve stale data, but cannot forge).

The guides are written in this order: Render and Docker first, the machine in the lab third, since it
is the most support-heavy to document. No second free platform is named until it has been tested with
a long-lived WebSocket.

### The Bionet subdomain

- `bionet.libs.bio` holds: what Bionet is, a demo lab that runs in the browser, the hosting guides,
  the protocol documentation, and the desktop download once one exists.
- The example labs move under the domain as `wren.bionet.libs.bio` and `thistle.bionet.libs.bio`,
  now, while nobody depends on their `onrender.com` addresses. Each is re-signed for its new address
  and re-pointed at the other. They are the worked examples the guides refer to, and the only live
  Bionet infrastructure run under the domain.
- Both example labs **stay on Render's free plan** under their new addresses. They demonstrate the
  tier most DIY labs will use, wake-up delay included, and a note on each lab's page says why it may
  be slow to answer.
- On `libs.bio`, Bionet is a short introduction that links across. The subdomain is the one place
  Bionet is explained.

### Dependencies

Work this plan wants but does not own. The site documents each once it exists.

- **File-based exchange as a supported way to sync.** Two members passing a file as a routine way to
  stay in step, beyond today's backup and restore. It is the only tier with no infrastructure at all.
  The work is in `bionet-desktop` and probably `@biolibs/bionet-client`.
- **A packaged release of `bionet-desktop`.** The app is at 0.1.0 with no packaging or release
  scripts, so there is nothing to download. Every Bionet tier starts with the desktop app: until a
  release exists, `bionet.libs.bio` can explain and demonstrate but cannot onboard anyone.
- **The glass look in the Bionet packages.** The pronounced glass panels and the floating constructs
  are changes to the packages in biolibs, starting with `@biolibs/bionet-theme`. The demo lab on
  `bionet.libs.bio` is drawn by those packages. **The Bionet site's first release does not wait for
  them**: it ships with today's solid panels and picks up the glass when the packages have it.

## 2. Proposed

### Publishing an inventory with no server

A lab that only wants to be findable by other labs (not to sync its members) publishes its signed
inventory as a file on free static hosting.

**Checked against the code on 2026-11-19. The protocol allows it; the app cannot yet produce the
file.**

What the reader in `@biolibs/bionet` (`fetch.ts`, `origin.ts`) requires of the address:

- `https`;
- the file at `/.well-known/bionet.json` at the **root of the origin**. A lab is identified by its
  origin alone, so an address with a path (a GitHub project page at `name.github.io/repo`) cannot be
  a lab; a custom domain or a root site can;
- **no redirects**: the fetch is made with `redirect: "error"`;
- the origin named inside the signed document equals the origin it was served from;
- an `access-control-allow-origin` header only when the reader is a page on another site. The
  desktop app and servers do not need it.

Nothing in that needs a server. The example labs already serve theirs as a plain file from `public/`,
with a rewrite and a header.

What is missing:

- `Lab.publish()` in `@biolibs/bionet-client` refuses without a peer ("The lab has no peer to publish
  through") and hands the signed inventory to the peer. Nothing writes it to a file. The pieces exist
  (`publicInventory`, `signInventory`, and `setOrigin` for an address that is not the peer's), so the
  change is small: sign and save.
- The file is a snapshot. It goes stale until somebody uploads a new one, where a peer is updated
  from the app.

Not tested: any real static host. How each one treats a dot-directory, redirects and the
cross-origin header has to be tried before a guide names it.

### A lab declaring its practice

- A field in the inventory where a lab states its containment level and the code it follows, shown on
  its page. It would be a protocol change in `@biolibs/bionet`, so a dependency if adopted.
- A self-declaration proves nothing, and the site would say so.

## 3. Open

### bionet.libs.bio

1. How does the peer starter's public-page switch work? Left open until the starter is being built.

### Both

2. In the `libs.bio` mark, the green rung is hard to tell from cyan on the dark ground. Does it get
   a different accent in dark, or is it dropped?

## 4. Context

What exists as of 2026-11-19, for reference.

| Project | What it is | State |
|---|---|---|
| `biolibs` | TypeScript ports of Biopython, pydna and seguid, plus the Bionet packages; `@biolibs` on npm | Ports at 1.x; Bionet packages mostly 0.x and changing |
| `biolibs-site` | Next.js site: learn, glossary, docs, parity, convert, examples, lab demo | Deployed from a Render blueprint, free plan; to be replaced |
| `bionet-desktop` | Electron app for running a lab's freezer | 0.1.0, private, no packaging or release scripts; nothing to download yet |
| `lab-wren` | Example lab with a web peer (`/sync` over WebSocket) | Render free plan; data lost on each deploy |
| `lab-thistle` | Example lab, inventory only | Render free plan |
| `lab-p2p` | Earlier GPL take on a 3D lab with peer-to-peer sharing | Assumed out of scope |

`libs.bio` is registered at IONOS. Its nameservers were changed to Cloudflare on 2026-11-19, and
the `.bio` registry listed the Cloudflare nameservers later that day. The eight records Cloudflare copied from
IONOS were then deleted, so the zone is empty and `libs.bio` does not load until a site is attached.
Step 1 of the sequence is done apart from confirming the remaining provider details.

No domain is hardcoded in `biolibs-site` or the biolibs README, so adopting `libs.bio` is cheap now.
The two example labs point at each other's `onrender.com` addresses.
