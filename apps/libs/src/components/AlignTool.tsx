"use client";

import { useMemo, useRef, useState } from "react";
import { DEFAULT_SCORING, MATRICES, type Row, type Scoring, alignPair, alignmentFasta, readAlignment } from "@/lib/align.ts";
import { openAnyFile } from "@/lib/convert.ts";
import { cleanSequence } from "@/lib/digest.ts";
import { ACCEPT } from "@/lib/files.ts";
import { sampleRelatives } from "@/lib/sample.ts";
import { saveFile } from "@/lib/save.ts";
import { messages } from "@/messages/index.ts";
import { AlignmentView, ManyView } from "./AlignmentView.tsx";
import { SequenceInput } from "./SequenceInput.tsx";

/** The gap costs offered, which is enough of a range to see what gaps do. */
const GAP_OPENS = [-1, -2, -5, -10, -11];

/**
 * The alignment tool: line two sequences up and see where they differ, or open an alignment
 * somebody else made and see which columns are settled.
 *
 * The aligning is `@biolibs/align`'s `PairwiseAligner`, and the counting is its own. Nothing is
 * sent anywhere.
 */
export function AlignTool() {
  const all = messages();
  const text = all.alignment, shared = all.tool;
  const sample = sampleRelatives();
  const [byFile, setByFile] = useState(false);
  const [target, setTarget] = useState(sample[0].dna);
  const [query, setQuery] = useState(sample[1].dna);
  const [names, setNames] = useState({ target: sample[0].name, query: sample[1].name });
  const [scoring, setScoring] = useState<Scoring>(DEFAULT_SCORING);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const left = useMemo(() => cleanSequence(target), [target]);
  const right = useMemo(() => cleanSequence(query), [query]);
  // Protein is left as typed: cleanSequence keeps only DNA letters, and a matrix means protein.
  const first = scoring.matrix === null ? left : target.toUpperCase().replace(/[^A-Z]/g, "");
  const second = scoring.matrix === null ? right : query.toUpperCase().replace(/[^A-Z]/g, "");
  const result = useMemo(() => (byFile ? null : alignPair(first, second, scoring)), [byFile, first, second, scoring]);
  const many = useMemo(() => (rows === null ? null : readAlignment(rows)), [rows]);
  const number = (value: number) => value.toLocaleString("en-US");
  const percent = (value: number) => `${(value * 100).toFixed(1)}%`;
  const set = (part: Partial<Scoring>) => setScoring((now) => ({ ...now, ...part }));

  const open = async (picked: File | undefined) => {
    if (picked === undefined) return;
    try {
      const opened = openAnyFile(picked.name, new Uint8Array(await picked.arrayBuffer()));
      const found: Row[] = opened.records.map((record, at) => ({
        name: opened.summaries[at].name,
        letters: String(record.seq ?? "").toUpperCase(),
      }));
      setFileName(picked.name); setRows(found); setProblem(null);
      if (readAlignment(found) === null) setProblem(text.notAligned);
    } catch (error) {
      setRows(null);
      setProblem(`${shared.cannotRead(picked.name)} ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <>
      <div className="methods" role="group" aria-label={text.methods}>
        <button type="button" className={`chip${byFile ? "" : " on"}`} aria-pressed={!byFile} onClick={() => setByFile(false)}>{text.twoSequences}</button>
        <button type="button" className={`chip${byFile ? " on" : ""}`} aria-pressed={byFile} onClick={() => setByFile(true)}>{text.anAlignment}</button>
        <span className="quiet">{byFile ? text.anAlignmentNote : text.twoSequencesNote}</span>
      </div>

      <div className="tool align-tool">
        <section className="glass">
          {byFile ? (
            <>
              <h2>{text.openHeading}</h2>
              <div className={`source${over ? " over" : ""}`}
                   onDragOver={(event) => { event.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
                   onDrop={(event) => { event.preventDefault(); setOver(false); void open(event.dataTransfer.files[0]); }}>
                <div className="row">
                  <button type="button" className="btn" onClick={() => file.current?.click()}>{shared.openFile}</button>
                  <input ref={file} type="file" accept={ACCEPT} hidden onChange={(event) => { void open(event.target.files?.[0]); event.target.value = ""; }} />
                </div>
                <p className="quiet">{text.openNote}</p>
              </div>
              {fileName === "" ? null : <p className="facts"><span><b>{text.file}</b> {fileName}</span><span><b>{text.rows}</b> {number(rows?.length ?? 0)}</span></p>}
            </>
          ) : (
            <>
              <h2>{text.inputHeading}</h2>
              <label className="field" htmlFor="target">{text.first} <span className="count">{number(first.length)}</span></label>
              <SequenceInput id="target" value={target} onChange={setTarget} />
              <label className="field" htmlFor="query">{text.second} <span className="count">{number(second.length)}</span></label>
              <SequenceInput id="query" value={query} onChange={setQuery} />
              <div className="row">
                <button type="button" className="btn" onClick={() => { const two = sampleRelatives(); setTarget(two[0].dna); setQuery(two[1].dna); setNames({ target: two[0].name, query: two[1].name }); set({ matrix: null }); }}>{shared.loadSample}</button>
              </div>

              <p className="field">{text.howScored}</p>
              <div className="chips">
                <button type="button" className={`chip${scoring.mode === "global" ? " on" : ""}`} aria-pressed={scoring.mode === "global"} onClick={() => set({ mode: "global" })}>{text.global}</button>
                <button type="button" className={`chip${scoring.mode === "local" ? " on" : ""}`} aria-pressed={scoring.mode === "local"} onClick={() => set({ mode: "local" })}>{text.local}</button>
              </div>
              <div className="row">
                <label className="field" htmlFor="matrix">{text.matrix}</label>
                <select id="matrix" className="in grow" value={scoring.matrix ?? ""} onChange={(event) => set({ matrix: event.target.value === "" ? null : event.target.value })}>
                  <option value="">{text.noMatrix}</option>
                  {MATRICES.map((one) => <option key={one} value={one}>{one}</option>)}
                </select>
              </div>
              {scoring.matrix === null ? (
                <div className="row">
                  <label className="field" htmlFor="match">{text.match}</label>
                  <input id="match" className="in narrow" type="number" value={scoring.match} step={1} onChange={(event) => set({ match: Number(event.target.value) })} />
                  <label className="field" htmlFor="mismatch">{text.mismatch}</label>
                  <input id="mismatch" className="in narrow" type="number" value={scoring.mismatch} step={1} onChange={(event) => set({ mismatch: Number(event.target.value) })} />
                </div>
              ) : <p className="quiet">{text.matrixNote}</p>}
              <div className="row">
                <label className="field" htmlFor="open-gap">{text.openGap}</label>
                <select id="open-gap" className="in" value={scoring.openGap} onChange={(event) => set({ openGap: Number(event.target.value) })}>
                  {GAP_OPENS.map((one) => <option key={one} value={one}>{one}</option>)}
                </select>
                <label className="field" htmlFor="extend-gap">{text.extendGap}</label>
                <select id="extend-gap" className="in" value={scoring.extendGap} onChange={(event) => set({ extendGap: Number(event.target.value) })}>
                  {[-0.5, -1, -2].map((one) => <option key={one} value={one}>{one}</option>)}
                </select>
              </div>
              <p className="quiet">{text.scoringNote}</p>
            </>
          )}
          {problem !== null ? <p className="problem" role="alert">{problem}</p> : null}
        </section>

        <section className="glass" aria-live="polite">
          {byFile ? (
            many === null ? <><h2>{text.noAlignment}</h2><p className="quiet">{text.noAlignmentNote}</p></> : (
              <>
                <h2>{text.manyHeading(many.rows.length, number(many.columns))}</h2>
                <p className="facts">
                  <span><b>{text.allAgree}</b> {number(many.identical)} <span className="quiet">({percent(many.identical / Math.max(many.columns, 1))})</span></span>
                </p>
                <ManyView rows={many.rows} conservation={many.conservation} />
                <p className="quiet">{text.manyNote}</p>
                <div className="row">
                  <button type="button" className="btn" onClick={() => saveFile("alignment.fasta", new Blob([alignmentFasta(many.rows)], { type: "text/plain" }))}>{text.saveAlignment}</button>
                </div>
              </>
            )
          ) : result === null ? null : !result.ok ? (
            <><h2>{text.noResult}</h2><p className="quiet">{result.error === "empty" ? text.noResultNote : result.error}</p></>
          ) : (
            <>
              <h2>{text.resultHeading(percent(result.aligned.identity))}</h2>
              <p className="facts">
                <span><b>{text.score}</b> {result.aligned.score.toFixed(1)}</span>
                <span><b>{text.same}</b> {number(result.aligned.identities)}</span>
                <span><b>{text.different}</b> {number(result.aligned.mismatches)}</span>
                <span><b>{text.gaps}</b> {number(result.aligned.gaps)}</span>
                <span><b>{text.columns}</b> {number(result.aligned.columns.length)}</span>
              </p>
              <AlignmentView columns={result.aligned.columns} names={names} />
              <p className="facts">
                <span><b>{text.algorithm}</b> {result.aligned.algorithm}</span>
                <span><b>{text.equallyGood}</b> {result.aligned.equallyGood}</span>
              </p>
              <div className="row">
                <button type="button" className="btn"
                        onClick={() => saveFile("alignment.fasta", new Blob([alignmentFasta([
                          { name: names.target, letters: result.aligned.columns.map((column) => column.target).join("") },
                          { name: names.query, letters: result.aligned.columns.map((column) => column.query).join("") },
                        ])], { type: "text/plain" }))}>{text.saveAlignment}</button>
              </div>
              <p className="quiet">{text.resultNote}</p>
            </>
          )}
        </section>
      </div>
    </>
  );
}
