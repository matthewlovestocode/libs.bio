/**
 * What a map of a sequence is made of, worked out before anything is drawn: which lane each feature
 * sits in, which enzymes cut once, and what colour each kind of feature is.
 *
 * The geometry is `@biolibs/seqmap`'s. This only decides what goes where.
 */
import { enzymes } from "@biolibs/restriction";
import { Seq } from "@biolibs/seq";
import { packLanes } from "@biolibs/seqmap";
import { COMMON_ENZYMES } from "@/lib/digest.ts";
import type { FeatureRecord } from "@/lib/files.ts";

/** The colour each kind of feature is drawn in. They are the site's own colours, so they follow the theme. */
const COLOURS: Record<string, string> = {
  CDS: "var(--bionet-yours)", gene: "var(--bionet-yours)",
  promoter: "var(--base-g)", RBS: "var(--base-g)", regulatory: "var(--base-g)",
  terminator: "var(--base-t)",
  rep_origin: "var(--base-c)",
  primer_bind: "var(--bionet-theirs)",
  misc_feature: "var(--bionet-found)",
};

/** @param type - A feature's kind, as its file says. @returns The colour to draw it in. */
export const colourOf = (type: string): string => COLOURS[type] ?? "var(--muted)";

/** A feature, placed. */
export interface Placed extends FeatureRecord {
  /** Its place in the list it came in, which is how it is picked out. */
  index: number;
  /** Which lane it is drawn in, counting from 0 at the sequence. */
  lane: number;
  /** How many bases it covers. */
  size: number;
  colour: string;
}

/**
 * Give each feature a lane, so two that overlap are not drawn on top of each other.
 *
 * @param features - The features, as a file gives them.
 * @param length - The sequence's length.
 * @returns The features with their lanes, and how many lanes there are.
 */
export function place(features: readonly FeatureRecord[], length: number): { placed: Placed[]; lanes: number } {
  // A feature is packed by the whole stretch it spans. One that runs across the origin is given a
  // span that runs past the end, which is how the map package writes a wrap.
  const spans = features.map((feature) => {
    const first = feature.parts[0], last = feature.parts[feature.parts.length - 1];
    const wraps = feature.parts.length > 1 && first.start > last.start;
    const start = wraps ? first.start : Math.min(...feature.parts.map((part) => part.start));
    const end = wraps ? length + last.end : Math.max(...feature.parts.map((part) => part.end));
    return { start, end: Math.max(end, start) };
  });
  const lanes = spans.length === 0 ? [] : packLanes(spans, Math.max(1, Math.round(length / 120)));
  const placed = features.map((feature, index) => ({
    ...feature, index, lane: lanes[index], colour: colourOf(feature.type),
    size: feature.parts.reduce((sum, part) => sum + (part.end - part.start), 0),
  }));
  return { placed, lanes: lanes.length === 0 ? 0 : Math.max(...lanes) + 1 };
}

/** A place an enzyme cuts. */
export interface Site {
  name: string;
  /** Where it cuts, as a 0-based boundary: the cut is before the base at this index. */
  at: number;
}

/**
 * The common enzymes that cut a sequence exactly once. Those are the ones worth marking on a map:
 * a single cut opens a plasmid in one known place.
 *
 * @param dna - The sequence, in DNA letters.
 * @param circular - Whether it is a circle.
 * @returns One site per enzyme that cuts once, in order along the sequence.
 */
export function singleCutters(dna: string, circular: boolean): Site[] {
  if (dna === "") return [];
  const seq = new Seq(dna);
  const sites: Site[] = [];
  for (const name of COMMON_ENZYMES) {
    const cuts = enzymes[name].search(seq, !circular);
    if (cuts.length === 1) sites.push({ name, at: (cuts[0] - 1 + dna.length) % dna.length });
  }
  return sites.sort((a, b) => a.at - b.at);
}

/**
 * Where a feature is, as a person would write it: bases counted from 1, both ends included.
 *
 * @param feature - A feature.
 * @returns `420–1,240`, or `2,981–3,000, 1–40` for one in two pieces.
 */
export function whereIs(feature: FeatureRecord): string {
  return feature.parts.map((part) => `${(part.start + 1).toLocaleString("en-US")}–${part.end.toLocaleString("en-US")}`).join(", ");
}
