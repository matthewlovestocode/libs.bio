/**
 * Writes what the libraries page knows about each Bionet package, by reading its own type files.
 *
 *   node scripts/libraries.mjs
 *
 * The page shows a handful of names from each package and not the rest, but the handful is not
 * copied out by hand: `content/libraries.ts` names them, this reads what the package says about
 * them, and `lib/libraries.ts` fails the build if a name is not exported any more. So a renamed
 * function breaks the build instead of leaving a page that quietly lies.
 *
 * It runs before every build, so the page describes the versions installed from npm.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

/** Every Bionet package, in the order the page's layers reach them. */
const PACKAGES = [
  "bionet",
  "bionet-client",
  "bionet-peer",
  "bionet-space",
  "bionet-theme",
  "bionet-react",
  "bionet-panels",
  "bionet-scene",
  "bionet-tools",
  "bionet-agent",
  "bionet-demo",
];

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "src", "generated");

/** The longest a signature is written out before it is cut short. */
const LONGEST = 240;

/** Doc comments point at other items with `{@link Name}`. On the page that is just the name. */
const plain = (text) => text.replace(/\{@link(?:code|plain)?\s+([^}|\s]+)(?:\s*\|\s*([^}]+))?\}/g, (_, name, label) => `${label ?? name}`).trim();

/** Where an installed package's manifest is, found the way Node finds a package. */
function manifestOf(name) {
  for (let folder = here; ; folder = dirname(folder)) {
    const candidate = join(folder, "node_modules", "@biolibs", name, "package.json");
    if (existsSync(candidate)) return candidate;
    if (dirname(folder) === folder) throw new Error(`@biolibs/${name} is not installed.`);
  }
}

/** A declaration as written, without `export declare` or a trailing semicolon. */
const written = (node, file) => node.getText(file).replace(/^export\s+(declare\s+)?/, "").replace(/^declare\s+/, "").replace(/;\s*$/, "");

const cut = (text) => (text.length > LONGEST ? `${text.slice(0, LONGEST).trimEnd()} …` : text);

/** Everything one package exports, keyed by name. */
function read(name) {
  const manifestPath = manifestOf(name);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const entry = join(dirname(manifestPath), manifest.types);
  const program = ts.createProgram([entry], { skipLibCheck: true, noEmit: true, target: ts.ScriptTarget.ES2022, moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext });
  const checker = program.getTypeChecker();
  const file = program.getSourceFile(entry);
  const module = checker.getSymbolAtLocation(file);

  const exports = {};
  for (const exported of module ? checker.getExportsOfModule(module) : []) {
    const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    const node = symbol.declarations?.[0];
    if (!node) continue;
    const from = node.getSourceFile();
    const type = checker.getTypeOfSymbolAtLocation(symbol, node);
    let kind, signature;
    if (ts.isFunctionDeclaration(node)) { kind = "function"; signature = written(node, from); }
    else if (ts.isClassDeclaration(node)) { kind = "class"; signature = `class ${exported.name}`; }
    else if (ts.isInterfaceDeclaration(node)) { kind = "interface"; signature = `interface ${exported.name}`; }
    else if (ts.isTypeAliasDeclaration(node)) { kind = "type"; signature = written(node, from); }
    else if (ts.isVariableDeclaration(node)) {
      kind = type.getCallSignatures().length > 0 ? "function" : "constant";
      signature = `const ${written(node, from)}`;
    } else if (ts.isEnumDeclaration(node)) { kind = "type"; signature = written(node, from); }
    else continue;
    // The first line of the comment is what the page prints. The rest is for the reference, which
    // this page is not.
    const summary = plain(ts.displayPartsToString(symbol.getDocumentationComment(checker))).split("\n")[0];
    exports[exported.name] = { kind, signature: cut(signature), summary };
  }
  return { name, version: manifest.version, description: (manifest.description ?? "").trim(), exports };
}

mkdirSync(out, { recursive: true });
const all = PACKAGES.map(read);
writeFileSync(join(out, "libraries.json"), JSON.stringify(all));
for (const pack of all) console.log(`@biolibs/${pack.name} ${pack.version}: ${Object.keys(pack.exports).length} exports`);
