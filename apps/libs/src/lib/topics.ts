/**
 * The topics the site is organised by. A visitor arrives wanting to do something, not knowing which
 * package does it, so the unit is the topic and never the package.
 */
import type { Status } from "@libsbio/shared";

/** One topic. */
export interface Topic {
  /** Its place in an address: `/topics/<slug>`. */
  slug: string;
  /** Which entry in the messages names and describes it. */
  key: "digests" | "pcr" | "cloning" | "maps" | "files" | "sequences" | "alignment" | "trees" | "structure" | "motifs" | "lookup" | "safety";
  /** The packages behind it, without the `@biolibs/` in front. */
  packages: string[];
  /** How settled it is, or `null` while there is nothing to use yet. */
  status: Status | null;
}

/** Every topic, in the order they are being built. */
export const TOPICS: readonly Topic[] = [
  { slug: "digests", key: "digests", packages: ["restriction", "gel"], status: "stable" },
  { slug: "pcr", key: "pcr", packages: ["pcr", "gel"], status: "stable" },
  { slug: "maps", key: "maps", packages: ["seqmap", "seqio", "seqfeature", "restriction"], status: "stable" },
  { slug: "cloning", key: "cloning", packages: ["cloning", "pcr", "restriction", "seqrecord"], status: "stable" },
  { slug: "files", key: "files", packages: ["seqio", "seqrecord", "entrez"], status: "stable" },
  { slug: "sequences", key: "sequences", packages: ["seq", "seqtools"], status: "stable" },
  { slug: "alignment", key: "alignment", packages: ["align", "seqio"], status: "stable" },
  { slug: "trees", key: "trees", packages: ["phylo", "align", "seqio"], status: "stable" },
  { slug: "structure", key: "structure", packages: ["pdb", "svdsuperimposer"], status: "stable" },
  { slug: "motifs", key: "motifs", packages: ["motifs", "seq"], status: "stable" },
  { slug: "lookup", key: "lookup", packages: ["entrez", "uniprot", "europepmc"], status: "stable" },
  { slug: "safety", key: "safety", packages: [], status: null },
];
