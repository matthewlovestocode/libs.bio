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

**Progress as of 2026-11-19.** Step 1 is done: the nameservers are at Cloudflare and the zone is
empty. Step 2 is done locally: this directory is a git repository with the two apps and the shared
package, and both build as static exports showing a placeholder page. The repository is public on GitHub and `main` is pushed.
Still to do in step 2, in Matthew's Cloudflare account: create the two Workers, connect each to the
repository, and attach the two addresses.

Choices made while setting up, which were not in the plan and can be changed:

- English pages have no language prefix in their address; another language goes under its code.
- The shared package is `@libsbio/shared`, and the apps are `apps/libs` and `apps/bionet`.
- The placeholder pages use plain CSS over the Bionet theme's variables. Tailwind, which
  `biolibs-site` uses, is not added yet; that is decided when its content is carried over.
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
