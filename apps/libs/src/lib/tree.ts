/**
 * Reading a tree, building one from an alignment, and working out where to draw it.
 *
 * The reading, the distances and the tree-building are `@biolibs/phylo`'s. The layout is this
 * file's, because drawing is the one part of `Bio.Phylo` that was not ported: it needs matplotlib,
 * and a page needs an SVG instead.
 */
import { MultipleSeqAlignment } from "@biolibs/align";
import { type Clade, TreeConstruction, type Tree, read, write } from "@biolibs/phylo";
import { Seq } from "@biolibs/seq";
import { SeqRecord } from "@biolibs/seqrecord";

/** The ways of turning distances into a tree. */
export const METHODS = ["nj", "upgma"] as const;

/** One of those ways. */
export type Method = (typeof METHODS)[number];

/** The models the distances can be measured with. */
export const MODELS: readonly string[] = TreeConstruction.DistanceCalculator.models;

/** The formats a tree can be written in. */
export const TREE_FORMATS = ["newick", "nexus", "phyloxml"] as const;

/** What a tree amounts to, in plain values. */
export interface Summary {
  tips: number;
  /** Every branch added together, in whatever units the tree is in. */
  totalLength: number;
  /** Whether the file says which end is the root. Newick does not say. */
  rooted: boolean;
  /** Whether every fork has exactly two branches. */
  bifurcating: boolean;
  /** Whether any branch has a length at all. Without them a tree can only be drawn as a shape. */
  hasLengths: boolean;
}

/** One node, placed. */
export interface Node {
  /** What it is called. Inner nodes often have no name. */
  name: string;
  /** How far from the root, added up along the branches. */
  x: number;
  /** Which row it sits on: a tip gets a whole number, a fork the middle of its children. */
  y: number;
  /** Its own branch's length, or `null` where the tree does not say. */
  length: number | null;
  /** How sure the branch is, where the tree says: a bootstrap value or a posterior. */
  confidence: number | null;
  /** Whether it is a tip. */
  tip: boolean;
  /** Where its parent sits, for drawing the elbow. `null` at the root. */
  parent: { x: number; y: number } | null;
}

/** A tree, laid out for drawing. */
export interface Layout {
  nodes: Node[];
  /** How many rows there are, which is the number of tips. */
  rows: number;
  /** The furthest any tip is from the root. */
  span: number;
}

/** Everything about a tree a page needs. */
export interface Drawn {
  summary: Summary;
  layout: Layout;
  newick: string;
}

/** A clade's children, whatever the library calls them. */
const childrenOf = (clade: Clade): Clade[] => (Array.isArray(clade.clades) ? clade.clades : []);

/**
 * Work out where every node goes.
 *
 * Tips are stacked in the order they appear, so sister groups stay together, and each fork is drawn
 * level with the middle of its children. Distance from the root is the branch lengths added up, or,
 * for a tree with no lengths, one step per fork.
 *
 * @param tree - The tree.
 * @param scaled - Whether to use branch lengths. A tree without them is drawn by steps instead.
 * @returns Every node with its place.
 */
export function layOut(tree: Tree, scaled: boolean): Layout {
  const nodes: Node[] = [];
  let row = 0;
  /** Place a clade and its children, and give back the node it made. */
  const place = (clade: Clade, fromRoot: number): Node => {
    const length = typeof clade.branchLength === "number" ? clade.branchLength : null;
    const x = fromRoot + (scaled ? length ?? 0 : nodes.length === 0 ? 0 : 1);
    const children = childrenOf(clade);
    const node: Node = {
      name: typeof clade.name === "string" ? clade.name : "",
      x, y: 0, length,
      confidence: typeof clade.confidence === "number" ? clade.confidence : null,
      tip: children.length === 0, parent: null,
    };
    nodes.push(node);
    if (children.length === 0) {
      node.y = row;
      row += 1;
      return node;
    }
    // The children go first, because a fork sits level with the middle of them.
    const placed = children.map((child) => place(child, x));
    node.y = (Math.min(...placed.map((one) => one.y)) + Math.max(...placed.map((one) => one.y))) / 2;
    for (const child of placed) child.parent = { x, y: node.y };
    return node;
  };
  place(tree.root as Clade, 0);
  // The furthest tip sets the width. Branch lengths are usually fractions of a substitution per
  // site, so this must not be floored at 1: that would squash every real tree into a corner.
  const deepest = Math.max(...nodes.map((node) => node.x));
  return { nodes, rows: Math.max(row, 1), span: deepest > 0 ? deepest : 1 };
}

/** What a tree is made of, asked of the library rather than counted here. */
function summarise(tree: Tree): Summary {
  const tips = tree.getTerminals();
  return {
    tips: tips.length,
    totalLength: tree.totalBranchLength(),
    rooted: tree.rooted === true,
    bifurcating: tree.isBifurcating(),
    hasLengths: tips.some((tip) => typeof tip.branchLength === "number" && tip.branchLength !== 0),
  };
}

/** A tree, with everything a page needs worked out. */
function drawnFrom(tree: Tree, scaled: boolean): Drawn {
  const summary = summarise(tree);
  return { summary, layout: layOut(tree, scaled && summary.hasLengths), newick: tree.format("newick").trim() };
}

/** What came of reading or building a tree. */
export type Attempt = { ok: true; tree: Drawn } | { ok: false; error: string };

/**
 * Read a tree somebody wrote down.
 *
 * @param text - The file's contents.
 * @param format - `"newick"`, `"nexus"` or `"phyloxml"`.
 * @param scaled - Whether to draw branches to length.
 * @returns The tree, or why it could not be read.
 */
export function readTree(text: string, format: string, scaled: boolean): Attempt {
  if (text.trim() === "") return { ok: false, error: "empty" };
  try {
    return { ok: true, tree: drawnFrom(read(text, format), scaled) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** A sequence as it appears in an alignment. */
export interface Row {
  name: string;
  letters: string;
}

/**
 * Build a tree from sequences that are already aligned.
 *
 * Distances are measured by `DistanceCalculator` in whichever model is chosen, and the tree is built
 * from those distances alone. Nothing here looks at the sequences again.
 *
 * @param rows - The aligned sequences, all the same length.
 * @param model - How to measure distance, as the library names its 31 models.
 * @param method - `"nj"` for neighbour joining, `"upgma"` for the simpler clustering.
 * @param scaled - Whether to draw branches to length.
 * @returns The tree and the distances it was built from, or why it could not be built.
 */
export function buildTree(rows: readonly Row[], model: string, method: Method, scaled: boolean):
  Attempt & { distances?: { names: string[]; rows: number[][] } } {
  if (rows.length < 3) return { ok: false, error: "too few" };
  const length = rows[0].letters.length;
  if (rows.some((row) => row.letters.length !== length)) return { ok: false, error: "not aligned" };
  try {
    const msa = new MultipleSeqAlignment(rows.map((row) => new SeqRecord(new Seq(row.letters), row.name)));
    const calculator = new TreeConstruction.DistanceCalculator(model);
    const matrix = calculator.getDistance(msa);
    const names: string[] = [...matrix.names];
    const distances = names.map((_, i) => names.map((__, j) => Number(matrix.get([i, j]) ?? 0)));
    const tree = new TreeConstruction.DistanceTreeConstructor(calculator, method).buildTree(msa);
    return { ok: true, tree: drawnFrom(tree, scaled), distances: { names, rows: distances } };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * A tree written out in another format.
 *
 * @param newick - The tree, as Newick.
 * @param format - `"newick"`, `"nexus"` or `"phyloxml"`.
 * @returns The text, or `null` when it cannot be written.
 */
export function writeTree(newick: string, format: string): string | null {
  try {
    if (format === "newick") return `${newick}\n`;
    let out = "";
    write(read(newick, "newick"), { write: (part: string) => { out += part; return part.length; } }, format);
    return out;
  } catch {
    return null;
  }
}
