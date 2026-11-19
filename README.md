# libs.bio

The web presence for [biolibs](https://github.com/matthewlovestocode/biolibs) and Bionet: two sites
in one repository.

| Site | Address | What it is for |
|---|---|---|
| libs.bio | https://libs.bio | Doing bioengineering in the browser with the libraries, and understanding the code, the ideas and the papers behind each tool |
| Bionet | https://bionet.libs.bio | What Bionet is, a lab you can try in the browser, and how a lab hosts its own node |

Both are for the DIY bio community: free, with no account, no tracking, and nothing uploaded.

**Bionet's site is a placeholder at the moment, and libs.bio has its first topic.** What is being built, in what order and why is in
[PLAN.md](PLAN.md). The drawings the look was agreed from are in [`design/`](design/).

## Run it

Node 20 or later.

```bash
npm install
npm run dev:libs       # http://localhost:3000
npm run dev:bionet     # http://localhost:3001
```

```bash
npm run build          # both sites, each into its own out/ folder
npm run typecheck
```

## Where things are

```
apps/libs/             the libs.bio site
apps/bionet/           the bionet.libs.bio site
packages/shared/       what the two have in common: behaviour and content, not appearance
design/                mock-ups, as plain HTML files
PLAN.md                the plan
```

Each site is Next.js (App Router) built as a **static export**: `next build` writes plain files to
`out/`, and that folder is the whole site. There is no server, so nothing here can use rewrites,
response headers set by the app, or server-rendered routes.

Inside a site:

| Path | What it holds |
|---|---|
| `src/app/` | Pages |
| `src/components/` | Components, including the site's mark |
| `src/messages/` | The words the interface shows, one file per language |
| `content/<language>/` | Lessons, glossary entries and papers (libs.bio only, so far) |

Colours come from [`@biolibs/bionet-theme`](https://www.npmjs.com/package/@biolibs/bionet-theme),
which has a light and a dark value for each and follows the reader's setting. Neither site writes a
colour down for itself.

## Languages

Content is in English only. The layout is ready for more:

- No component has text written into it. It shows what `messages(language)` gives it.
- English pages have no prefix in their address. Another language goes under its code, and
  `pathIn()` in the shared package works out the address.
- A translation is a new file in `src/messages/` and a new folder in `content/`, and its code added
  to `LANGUAGES` in `packages/shared/src/languages.ts`.

The routes for a second language are not there yet. They are added with the first translation.

## Deploying

Each site is a Cloudflare Worker that holds only files: there is no script, and every request is
answered from the site's `out/` folder. Each app has a `wrangler.jsonc` saying so.

Cloudflare builds and deploys a site when `main` changes, and gives every other branch a preview
address of its own. **Previews are public.** Each Worker is connected to this repository under
**Settings > Build**, with:

| | libs.bio | bionet.libs.bio |
|---|---|---|
| Worker name | `libs-bio` | `bionet-libs-bio` |
| Root directory | `apps/libs` | `apps/bionet` |
| Build command | `npm run build` | `npm run build` |
| Deploy command | `npx wrangler deploy` | `npx wrangler deploy` |
| Preview command | `npx wrangler preview` | `npx wrangler preview` |
| Build watch paths | `apps/libs/*`, `packages/shared/*`, `package-lock.json` | `apps/bionet/*`, `packages/shared/*`, `package-lock.json` |

The Worker's name in the dashboard has to match `name` in its `wrangler.jsonc`, or its builds fail.

Both Workers are set up this way and both sites are live. Build watch paths are the one row not
yet set in the dashboard, so for now a push rebuilds both sites.

Each site's address is attached to its Worker as a custom domain, and also written in its
`wrangler.jsonc` so a deploy from the file agrees with the dashboard. `wrangler deploy --dry-run`
checks the configuration and the files and deploys nothing.

To deploy by hand, signed in with `npx wrangler login`:

```bash
npm run deploy:libs
npm run deploy:bionet
```

## Licences

- Code: MIT. See [LICENSE](LICENSE).
- The sites' own writing and drawings: CC BY 4.0. See [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
