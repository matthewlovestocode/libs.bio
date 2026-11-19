"use client";

import { useMemo, useState } from "react";
import { type Molecule, digestOf, ligate, usable } from "@/lib/clone.ts";
import { COMMON_ENZYMES, cleanSequence, notDna } from "@/lib/digest.ts";
import type { FileRecord } from "@/lib/files.ts";
import { SAMPLE_INSERT_NAME, SAMPLE_NAME, sampleFeatures, sampleGenBank, sampleInsert, sampleInsertGenBank, samplePlasmid } from "@/lib/sample.ts";
import { messages } from "@/messages/index.ts";
import { ProductList } from "./ProductList.tsx";
import { SequenceSource } from "./SequenceSource.tsx";

/** The gene on the sample insert, ready for the first paint, before any file has been read. */
const INSERT_FEATURES = [{ type: "CDS", label: "newGene", strand: 1, parts: [{ start: 39, end: 840 }] }];

/** The two enzymes the sample plasmid and the sample insert are both cut with. */
const SAMPLE_ENZYMES = ["EcoRI", "KpnI"];

/**
 * The restriction cloning tool: cut a vector and an insert with the same enzymes, and see the
 * circles their pieces can be ligated into.
 *
 * Everything is worked out in the page by `@biolibs/cloning`. Nothing is sent anywhere.
 */
export function CloneTool() {
  const all = messages();
  const text = all.clone;
  const [vectorDna, setVectorDna] = useState(samplePlasmid);
  const [vectorCircular, setVectorCircular] = useState(true);
  const [vectorName, setVectorName] = useState(SAMPLE_NAME);
  const [vectorFeatures, setVectorFeatures] = useState(sampleFeatures);
  const [insertDna, setInsertDna] = useState(sampleInsert);
  const [insertCircular, setInsertCircular] = useState(false);
  const [insertName, setInsertName] = useState(SAMPLE_INSERT_NAME);
  const [insertFeatures, setInsertFeatures] = useState(() => INSERT_FEATURES);
  const [chosen, setChosen] = useState<string[]>(SAMPLE_ENZYMES);

  const vector: Molecule = useMemo(() => ({ name: vectorName, dna: cleanSequence(vectorDna), circular: vectorCircular, features: vectorFeatures }), [vectorName, vectorDna, vectorCircular, vectorFeatures]);
  const insert: Molecule = useMemo(() => ({ name: insertName, dna: cleanSequence(insertDna), circular: insertCircular, features: insertFeatures }), [insertName, insertDna, insertCircular, insertFeatures]);
  const wrong = notDna(vector.dna).length > 0 || notDna(insert.dna).length > 0;
  const ready = vector.dna.length > 0 && insert.dna.length > 0 && !wrong;

  const suggested = useMemo(() => (ready ? usable(vector, insert, COMMON_ENZYMES) : []), [ready, vector, insert]);
  const result = useMemo(() => (ready && chosen.length > 0 ? ligate(vector, insert, chosen) : null), [ready, vector, insert, chosen]);
  const cutVector = useMemo(() => (ready && chosen.length > 0 ? digestOf(vector, chosen) : null), [ready, vector, chosen]);
  const cutInsert = useMemo(() => (ready && chosen.length > 0 ? digestOf(insert, chosen) : null), [ready, insert, chosen]);
  const number = (value: number) => value.toLocaleString("en-US");

  const toggle = (name: string) => setChosen((now) => (now.includes(name) ? now.filter((one) => one !== name) : [...now, name]));
  const tookVector = (record: FileRecord | null) => setVectorFeatures(record?.features ?? []);
  const tookInsert = (record: FileRecord | null) => setInsertFeatures(record?.features ?? []);
  const sampleVectorFile = () => ({ fileName: `${SAMPLE_NAME}.gb`, bytes: new TextEncoder().encode(sampleGenBank()) });
  const sampleInsertFile = () => ({ fileName: `${SAMPLE_INSERT_NAME}.gb`, bytes: new TextEncoder().encode(sampleInsertGenBank()) });

  /** The pieces of one digest, as a line of text: what you would see on a gel. */
  const pieces = (digest: ReturnType<typeof digestOf> | null) =>
    digest === null || digest.pieces.length === 0 ? text.noPieces
      : digest.pieces.map((piece) => `${number(piece.length)} bp (${piece.left ?? text.ownEnd} → ${piece.right ?? text.ownEnd})`).join(", ");

  return (
    <div className="tool">
      <section className="glass">
        <h2>{text.inputHeading}</h2>
        <SequenceSource id="vector" label={text.vector} value={vectorDna} onChange={setVectorDna} circular={vectorCircular} onCircular={setVectorCircular}
                        onName={setVectorName} onRecord={tookVector} sample={sampleVectorFile} />
        <p className="quiet">{text.vectorNote}</p>
        <SequenceSource id="insert" label={text.insert} value={insertDna} onChange={setInsertDna} circular={insertCircular} onCircular={setInsertCircular}
                        onName={setInsertName} onRecord={tookInsert} sample={sampleInsertFile} notes={false} />
        <p className="field">{text.enzymes}</p>
        <div className="chips">
          {COMMON_ENZYMES.map((name) => (
            <button key={name} type="button" className={`chip${chosen.includes(name) ? " on" : ""}${suggested.includes(name) ? " fits" : ""}`}
                    aria-pressed={chosen.includes(name)} onClick={() => toggle(name)}>{name}</button>
          ))}
        </div>
        <p className="quiet">{text.enzymesNote} {suggested.length === 0 ? text.noneFit : text.theseFit(suggested.join(", "))}</p>
      </section>

      <section className="glass" aria-live="polite">
        {!ready || result === null ? <><h2>{text.noResult}</h2><p className="quiet">{text.noResultNote}</p></> : !result.ok ? (
          <>
            <h2>{text.noProduct}</h2>
            <p className="problem">{result.error}</p>
            <h3>{text.whatYouHave}</h3>
            <p className="facts"><span><b>{text.vector}</b> {pieces(cutVector)}</span></p>
            <p className="facts"><span><b>{text.insert}</b> {pieces(cutInsert)}</span></p>
            <p className="quiet">{text.noProductNote}</p>
          </>
        ) : (
          <>
            <h2>{text.resultHeading(result.products.length)}</h2>
            <ProductList products={result.products} junctionsHeading={text.junctionsHeading} />
            <h3>{text.whatYouHave}</h3>
            <p className="facts"><span><b>{text.vector}</b> {pieces(cutVector)}</span></p>
            <p className="facts"><span><b>{text.insert}</b> {pieces(cutInsert)}</span></p>
            <p className="quiet">{text.note}</p>
          </>
        )}
      </section>
    </div>
  );
}
