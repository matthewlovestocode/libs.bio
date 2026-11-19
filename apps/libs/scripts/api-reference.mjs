/**
 * Writes the API reference's data, by reading the libraries' own type files.
 *
 *   node scripts/api-reference.mjs
 *
 * Every package in biolibs ships `.d.ts` files with its doc comments in them, and biolibs refuses to
 * build with an export that has none. So the reference is not written by anybody: this reads what
 * each package exports, with its signature, description, parameters and examples, and writes one
 * JSON file per package for the pages to draw. It runs before every build, so the reference always
 * describes the version of each package that is installed.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

/** The packages documented, in the order they are listed. More are added as their topics are built. */
const PACKAGES = ["seq", "restriction", "gel", "pcr", "seqio", "seqmap", "seqfeature", "cloning", "seqrecord", "seqtools", "align", "entrez"];

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "src", "generated", "api");

/**
 * Where an installed package's manifest is. The packages do not export their `package.json`, so it
 * is found the way Node finds a package: in the nearest `node_modules` going up from here.
 */
function manifestOf(name) {
  for (let folder = here; ; folder = dirname(folder)) {
    const candidate = join(folder, "node_modules", "@biolibs", name, "package.json");
    if (existsSync(candidate)) return candidate;
    if (dirname(folder) === folder) throw new Error(`@biolibs/${name} is not installed.`);
  }
}

/** The longest a type is written out before it is cut short. Some are whole tables of data. */
const LONGEST = 1200;

/** Doc comments point at other items with `{@link Name}`. On the page that is just the name, as code. */
const plain = (text) => text.replace(/\{@link(?:code|plain)?\s+([^}|\s]+)(?:\s*\|\s*([^}]+))?\}/g, (_, name, label) => `\`${label ?? name}\``).trim();

/** A tag's words, whichever of the two shapes TypeScript hands them over in. */
const tagText = (tag) => plain(typeof tag.text === "string" ? tag.text : ts.displayPartsToString(tag.text ?? []));

/** Take the code out of an `@example`, leaving the fence behind. */
const example = (text) => text.replace(/^```\w*\n?/, "").replace(/\n?```\s*$/, "").trim();

const cut = (text) => (text.length > LONGEST ? `${text.slice(0, LONGEST).trimEnd()} …` : text);

/** A declaration as it is written, without `export declare`, its doc comment or a trailing semicolon. */
const written = (node, file) => node.getText(file).replace(/^export\s+(declare\s+)?/, "").replace(/^declare\s+/, "").replace(/;\s*$/, "");

/**
 * What a declaration's doc comment says it throws, read from the comment as written.
 *
 * TypeScript reads `@throws {@link ValueError} for a bad size` as a tag with a type in braces and
 * hands back only the brace, so this one tag is taken from the text itself.
 */
function thrown(node, file) {
  // A constant's comment sits on the statement around it, two levels up.
  const holder = ts.isVariableDeclaration(node) ? node.parent.parent : node;
  const ranges = ts.getLeadingCommentRanges(file.text, holder.getFullStart()) ?? [];
  const comment = ranges.length === 0 ? "" : file.text.slice(ranges[ranges.length - 1].pos, ranges[ranges.length - 1].end);
  const lines = comment.replace(/^\/\*\*/, "").replace(/\*\/$/, "").split("\n").map((line) => line.replace(/^\s*\* ?/, "")).join("\n");
  return [...lines.matchAll(/@throws\s+([\s\S]*?)(?=\n\s*@\w|$)/g)].map((found) => plain(found[1].replace(/\s*\n\s*/g, " ")));
}

/**
 * Describe one symbol: what it says about itself, and the tags under that.
 *
 * @returns Its summary, parameters, return value, errors and examples.
 */
function describe(symbol, checker, node, file) {
  const tags = symbol.getJsDocTags(checker);
  const named = (name) => tags.filter((tag) => tag.name === name).map(tagText);
  return {
    summary: plain(ts.displayPartsToString(symbol.getDocumentationComment(checker))),
    params: named("param").map((text) => {
      const [, name = "", rest = ""] = /^(\S+)\s*(?:-\s*)?([\s\S]*)$/.exec(text) ?? [];
      return { name, text: rest };
    }),
    returns: named("returns").concat(named("return")).join(" "),
    throws: node ? thrown(node, file) : named("throws"),
    examples: named("example").map(example),
    deprecated: named("deprecated")[0] ?? null,
  };
}

/** The members of a class or interface that anybody outside it can use. */
function membersOf(node, file, checker) {
  const members = [];
  for (const member of node.members ?? []) {
    const flags = ts.getCombinedModifierFlags(member);
    if (flags & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected)) continue;
    if (member.name && ts.isPrivateIdentifier(member.name)) continue;
    const isConstructor = ts.isConstructorDeclaration(member);
    if (!isConstructor && !member.name) continue;
    const symbol = isConstructor ? null : checker.getSymbolAtLocation(member.name);
    const kind = isConstructor ? "constructor" : ts.isMethodDeclaration(member) || ts.isMethodSignature(member) ? "method"
      : ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member) ? "accessor" : "property";
    const told = symbol ? describe(symbol, checker, member, file) : { summary: plain(ts.displayPartsToString(ts.getJSDocCommentsAndTags(member).flatMap((doc) => (typeof doc.comment === "string" ? [{ text: doc.comment }] : [])))), params: [], returns: "", throws: [], examples: [], deprecated: null };
    members.push({ name: isConstructor ? "constructor" : member.name.getText(file), kind, signature: cut(written(member, file)), ...told });
  }
  return members;
}

/** Everything one package exports. */
function read(name) {
  const manifestPath = manifestOf(name);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const entry = join(dirname(manifestPath), manifest.types);
  const program = ts.createProgram([entry], { skipLibCheck: true, noEmit: true, target: ts.ScriptTarget.ES2022, moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext });
  const checker = program.getTypeChecker();
  const file = program.getSourceFile(entry);
  const module = checker.getSymbolAtLocation(file);

  // What the package says about itself is the comment at the top of its entry file. It ends with a
  // list of its source files, which means nothing to somebody using it, so that part is left off.
  const top = /^\s*\/\*\*([\s\S]*?)\*\//.exec(file.text)?.[1] ?? "";
  const about = top.split("\n").map((line) => line.replace(/^\s*\* ?/, "")).join("\n").replace(/@packageDocumentation\s*/, "");
  const overview = plain(about.split(/\n\s*@example/)[0].split(/\n- `[^`]+\.ts`/)[0]);

  const items = [];
  for (const exported of module ? checker.getExportsOfModule(module) : []) {
    const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    const node = symbol.declarations?.[0];
    if (!node) continue;
    const from = node.getSourceFile();
    const type = checker.getTypeOfSymbolAtLocation(symbol, node);
    let kind, signature, members = [];
    if (ts.isFunctionDeclaration(node)) { kind = "function"; signature = written(node, from); }
    else if (ts.isClassDeclaration(node)) {
      kind = "class"; members = membersOf(node, from, checker);
      signature = `class ${exported.name}${node.heritageClauses ? ` ${node.heritageClauses.map((clause) => clause.getText(from)).join(" ")}` : ""}`;
    } else if (ts.isInterfaceDeclaration(node)) {
      kind = "interface"; members = membersOf(node, from, checker);
      signature = `interface ${exported.name}${node.typeParameters ? `<${node.typeParameters.map((one) => one.getText(from)).join(", ")}>` : ""}${node.heritageClauses ? ` ${node.heritageClauses.map((clause) => clause.getText(from)).join(" ")}` : ""}`;
    } else if (ts.isTypeAliasDeclaration(node)) { kind = "type"; signature = written(node, from); }
    else if (ts.isVariableDeclaration(node)) {
      // A constant holding a function is a function to whoever calls it.
      kind = type.getCallSignatures().length > 0 ? "function" : "constant";
      signature = `const ${written(node, from)}`;
    } else if (ts.isEnumDeclaration(node)) { kind = "type"; signature = written(node, from); }
    else continue;
    items.push({ name: exported.name, kind, signature: cut(signature), ...describe(symbol, checker, node, from), members });
  }
  items.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  return { name, version: manifest.version, description: manifest.description, overview, items };
}

mkdirSync(out, { recursive: true });
const index = [];
for (const name of PACKAGES) {
  const pack = read(name);
  writeFileSync(join(out, `${name}.json`), JSON.stringify(pack));
  const undocumented = pack.items.filter((item) => item.summary === "").map((item) => item.name);
  index.push({ name, version: pack.version, description: pack.description, items: pack.items.length });
  console.log(`@biolibs/${name} ${pack.version}: ${pack.items.length} exports${undocumented.length ? `, ${undocumented.length} with no description (${undocumented.slice(0, 5).join(", ")}${undocumented.length > 5 ? ", …" : ""})` : ""}`);
}
writeFileSync(join(out, "index.json"), JSON.stringify(index));
