/**
 * The Understand view of the protein structure topic, in English.
 *
 * Three versions, as every topic has: one that assumes nothing, one that assumes school biology, and
 * one for somebody who already uses Biopython.
 */
import type { Lesson, Level } from "../../src/lib/lesson.ts";

const levels: Level[] = [
  {
    id: "new",
    label: "I'm new to biology",
    hint: "Starts from what a protein looks like. No jargon assumed.",
    sections: [
      {
        heading: "A chain that folds into a shape",
        paragraphs: [
          "A protein is a chain of amino acids, but it does not stay a chain. The moment it is made it folds up into one particular three-dimensional shape, and that shape is what does the work: a hollow that fits one molecule and nothing else, a surface that grips another protein, a channel through a membrane.",
          "The order of the amino acids decides the shape, and the shape decides the job. That is most of molecular biology in two sentences.",
        ],
        figure: "protein-fold",
      },
      {
        heading: "A structure file is a list of positions",
        paragraphs: [
          "To record a shape you write down where every atom is: three numbers for each one, in ångströms, which is the unit atoms are conveniently measured in. A structure file is that list, plus which residue and which chain each atom belongs to.",
          "That is all it is. Everything else, including every picture you have seen of a protein, is drawn from those numbers.",
        ],
      },
      {
        heading: "Where the numbers come from",
        paragraphs: [
          "Most structures were measured, usually by shining X-rays through a crystal of the protein and working backwards from how they scattered. It is slow, difficult work, and the result is a model that fits the measurements rather than a photograph.",
          "Since 2021, many structures are predicted instead, by programs that learned from the measured ones. The files look identical. Whether a structure was measured or predicted is something you have to check, not something the file's shape tells you.",
        ],
      },
      {
        heading: "The backbone, and the two turns",
        paragraphs: [
          "Running through every protein is the same repeating backbone, the same in all of them, with the parts that differ hanging off it. The backbone can only bend in two places per residue, and those two angles are called phi and psi.",
          "So the whole shape of a protein's backbone is just a long list of pairs of angles. That is what the second picture in this tool plots.",
        ],
        figure: "backbone-and-side-chain",
      },
      {
        heading: "Why most of that picture is empty",
        paragraphs: [
          "If you plot every residue by its two angles, almost all of the square is bare. That is not a quirk of the proteins we happen to have: most combinations are simply impossible, because they would put atoms through each other.",
          "Two patches hold nearly everything. One is the helix, where the chain coils; the other is the strand, where it stretches out flat and lies alongside its neighbours. Those two shapes, in different arrangements, make up most of every protein there is.",
        ],
        figure: "secondary-structure",
      },
      {
        heading: "The other picture: what touches what",
        paragraphs: [
          "A contact map takes every residue and asks which others are close to it in space. Dark squares mean close. The diagonal line is every residue next to itself, which tells you nothing; everything interesting is away from it.",
          "A thick band hugging the diagonal is a helix, because in a coil each residue sits near the ones a few along. A line running across the map at right angles is two stretches of chain lying against each other, far apart along the sequence but touching in space. A fold, flattened into a picture you can read.",
        ],
      },
    ],
    analogy: {
      picture: "Think of a long piece of wire that always coils or folds the same way when you drop it. A contact map is like laying a grid over the folded wire and marking which parts of its length ended up touching.",
      breaksDown: "Wire is passive. A protein's shape is held by thousands of weak attractions, it breathes and shifts constantly, and a structure file shows one frozen average rather than the thing moving.",
    },
    remember: [
      "A structure file is a list of atom positions, nothing more.",
      "The backbone bends in two places per residue: phi and psi.",
      "Most angle pairs are impossible, which is why the plot is mostly empty.",
      "A contact map flattens a fold: bands are helices, crossing lines are paired strands.",
    ],
  },
  {
    id: "some",
    label: "I know some biology",
    hint: "Assumes residues and secondary structure. Covers what a file does and does not tell you.",
    sections: [
      {
        heading: "The hierarchy",
        paragraphs: [
          "A structure holds models, each holding chains, each holding residues, each holding atoms. An NMR entry has many models and one is as good as another; a crystal entry has one. Chains are polymers; waters, ions, ligands and sugars sit in the same chains marked as hetero residues, which is why a chain's residue count and its sequence length are not the same number.",
          "The tool separates those three categories per chain, because mistaking 300 waters for 300 residues is an easy way to misread a file.",
        ],
      },
      {
        heading: "What the coordinates are worth",
        paragraphs: [
          "A crystal structure is a model fitted to a density map. Resolution says how much detail the data could support: at 1.5 Å you can see individual atoms, at 3.5 Å you are fitting a backbone into a tube. The B-factor column says how smeared each atom was, which is a mixture of genuine motion and poor fit.",
          "Missing residues are common and silent: disordered loops simply are not in the file, so residue 45 may be followed by residue 58 with nothing to mark the gap. Any analysis that walks a chain by counting has to notice that.",
        ],
      },
      {
        heading: "The Ramachandran plot as a check",
        paragraphs: [
          "Ramachandran worked out which backbone angles are sterically possible in 1963, from hard-sphere geometry, before there were enough structures to check against. The allowed regions have barely moved since.",
          "It is still used as a validation tool: a residue in a disallowed region is usually a modelling error rather than a discovery. Glycine is the exception, having no side chain and therefore far more freedom, and proline the opposite, being locked near phi −60.",
        ],
        figure: "secondary-structure",
      },
      {
        heading: "Contact maps",
        paragraphs: [
          "A contact map is a symmetric binary or distance matrix over residue pairs, usually on α-carbons with a cutoff somewhere between 6 and 12 Å. It discards all the orientation information and keeps all the topology, which turns out to be most of what matters about a fold.",
          "It was the representation structure prediction worked in for decades: predict the contacts from sequence, then build coordinates that satisfy them. Reading one is a skill worth having, because it makes the parallel and antiparallel arrangements of strands immediately visible.",
        ],
      },
      {
        heading: "Surface area",
        paragraphs: [
          "The Shrake-Rupley method rolls a probe the size of a water molecule over the structure and sums the area it can reach. It is the standard way of asking which residues are buried and which are exposed, and of measuring how much surface two proteins bury when they bind.",
          "It is quadratic-ish in atom count, which is why the tool offers it as a button rather than doing it to everything you open.",
        ],
      },
      {
        heading: "Measured or predicted",
        paragraphs: [
          "A predicted structure is a file of the same shape, and most software cannot tell the difference. In an AlphaFold file the B-factor column holds pLDDT, a per-residue confidence from 0 to 100, which is not a B-factor at all. Treat anything under 70 as a guess at the backbone and under 50 as likely disordered.",
          "Predictions are generally excellent for a well-represented fold and unreliable for anything that depends on a ligand, a partner, or a conformational change. The honest question is always what the structure was for.",
        ],
      },
    ],
    remember: [
      "Chains hold residues, waters and ligands together; count them separately.",
      "Missing residues leave no trace in the file.",
      "A disallowed Ramachandran angle usually means a modelling error.",
      "In a predicted file, the B-factor column is confidence, not motion.",
    ],
  },
  {
    id: "biopython",
    label: "I use Biopython",
    hint: "Bio.PDB, ported, and what a browser changes.",
    sections: [
      {
        heading: "The whole of Bio.PDB",
        paragraphs: [
          "`@biolibs/pdb` is `Bio.PDB`, with 502 of 502 applicable items at parity across every module, verified by 18,674 recorded cases that compare the return value, the exception type and message, the warnings, and the state of the structure afterwards. `Structure`, `Model`, `Chain`, `Residue`, `Atom` and the disorder wrappers all behave as you expect.",
          "The one change: `getStructure(id, text)` takes the file's **contents**, not a path, because there is no file system. `new PDBParser({ quiet: true })` suppresses the construction warnings exactly as `QUIET=True` does.",
        ],
      },
      {
        heading: "Python to TypeScript",
        paragraphs: [
          "Iteration and indexing become explicit: `[...structure]` for the models, `chain.get(\"CA\")` for `chain[\"CA\"]`, `[...residue]` for its atoms. `atom.minus(other)` is the `-` operator, giving the distance. `repr()` on any level returns exactly Biopython's string.",
          "`unfoldEntities`, `Select` subclasses for partial writing, `PDBIO` and `MMCIFIO`, `MMCIF2Dict`, `parsePdbHeader` and the vector helpers are all present with their Biopython signatures in camel case.",
        ],
      },
      {
        heading: "Analysis",
        paragraphs: [
          "`PPBuilder` and `CaPPBuilder` build polypeptides and give `getPhiPsiList` and the torsion lists, in radians as in Biopython. `NeighborSearch` wraps a KD-tree: `search(point, radius)` and `searchAll(radius, level)` where level is `\"A\"`, `\"R\"`, `\"C\"`, `\"M\"` or `\"S\"`.",
          "`ShrakeRupley().compute(entity, level)` records `sasa` at the level you ask for. `Superimposer` uses `@biolibs/svdsuperimposer`, a dependency-free Kabsch through a 3×3 Jacobi SVD, and gives `rms` and `rotran` as Biopython does.",
        ],
      },
      {
        heading: "What is not here",
        paragraphs: [
          "`Bio.PDB.internal_coords` **is** here, complete, at 103 of 103 items on 1,316 cases of its own — the sample on this page is built from torsion angles for that reason. What a browser cannot do is anything needing a file system, a download or a compiled renderer: there is no structure viewer in this tool, only the two plots, because a real viewer is a different kind of program.",
          "The contact map, the Ramachandran plot and the per-chain summary are the site's own code, about a hundred lines in `src/lib/structure.ts` and `StructureViews.tsx`. Everything they measure comes from the library.",
        ],
      },
    ],
  },
];

/** The lesson, whole. */
export const lesson: Lesson = {
  question: "What does a structure file hold, and what can you see in it?",
  levels,
  termSlugs: ["protein", "residue", "backbone-and-side-chain", "secondary-structure", "protein-fold", "amino-acid", "rmsd"],
  tryIt: "Try it: look at the sample peptide's contact map and find the helix →",
};
