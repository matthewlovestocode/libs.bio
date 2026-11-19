"use client";

import { useMemo, useRef, useState } from "react";
import { openAnyFile } from "@/lib/convert.ts";
import { ACCEPT } from "@/lib/files.ts";
import { SAMPLE_NEWICK, sampleFamily } from "@/lib/sample.ts";
import { saveFile, saveSvgAsPng } from "@/lib/save.ts";
import { METHODS, MODELS, type Method, type Row, TREE_FORMATS, buildTree, readTree, writeTree } from "@/lib/tree.ts";
import { messages } from "@/messages/index.ts";
import { TreeView } from "./TreeView.tsx";

/** The models worth putting at the top of the list: the ones that suit DNA. */
const FIRST_MODELS = ["identity", "blastn", "trans"];

/**
 * The tree tool: draw a tree somebody wrote down, or build one from sequences that are already
 * aligned and then draw that.
 *
 * The reading, the distances and the tree-building are `@biolibs/phylo`'s. The drawing is the
 * site's, because that is the one part of `Bio.Phylo` that was not ported.
 */
export function TreeTool() {
  const all = messages();
  const text = all.trees, shared = all.tool;
  const [fromAlignment, setFromAlignment] = useState(false);
  const [newick, setNewick] = useState(SAMPLE_NEWICK);
  const [format, setFormat] = useState("newick");
  const [rows, setRows] = useState<Row[]>(sampleFamily);
  const [fileName, setFileName] = useState<string>(text.sampleName);
  const [model, setModel] = useState("identity");
  const [method, setMethod] = useState<Method>("nj");
  const [scaled, setScaled] = useState(true);
  const [support, setSupport] = useState(true);
  const [saveAs, setSaveAs] = useState("newick");
  const [problem, setProblem] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const drawing = useRef<HTMLDivElement>(null);

  const written = useMemo(() => (fromAlignment ? null : readTree(newick, format, scaled)), [fromAlignment, newick, format, scaled]);
  const built = useMemo(() => (fromAlignment ? buildTree(rows, model, method, scaled) : null), [fromAlignment, rows, model, method, scaled]);
  const result = fromAlignment ? built : written;
  const number = (value: number) => value.toLocaleString("en-US");
  const models = [...FIRST_MODELS.filter((one) => MODELS.includes(one)), ...MODELS.filter((one) => !FIRST_MODELS.includes(one))];

  const open = async (picked: File | undefined) => {
    if (picked === undefined) return;
    try {
      const opened = openAnyFile(picked.name, new Uint8Array(await picked.arrayBuffer()));
      const found: Row[] = opened.records.map((record, at) => ({ name: opened.summaries[at].name, letters: String(record.seq ?? "").toUpperCase() }));
      setRows(found); setFileName(picked.name); setProblem(null);
    } catch (error) {
      setProblem(`${shared.cannotRead(picked.name)} ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  const savePng = async () => {
    const svg = drawing.current?.querySelector("svg");
    if (svg === null || svg === undefined) return;
    try { await saveSvgAsPng(svg, "tree.png", 3, getComputedStyle(document.body).backgroundColor); setProblem(null); }
    catch (error) { setProblem(error instanceof Error ? error.message : String(error)); }
  };
  const saveTree = () => {
    if (result === null || !result.ok) return;
    const out = writeTree(result.tree.newick, saveAs);
    if (out === null) return setProblem(text.cannotWrite);
    saveFile(`tree.${saveAs === "newick" ? "nwk" : saveAs === "nexus" ? "nex" : "xml"}`, new Blob([out], { type: "text/plain" }));
  };

  return (
    <>
      <div className="methods" role="group" aria-label={text.where}>
        <button type="button" className={`chip${fromAlignment ? "" : " on"}`} aria-pressed={!fromAlignment} onClick={() => setFromAlignment(false)}>{text.aTree}</button>
        <button type="button" className={`chip${fromAlignment ? " on" : ""}`} aria-pressed={fromAlignment} onClick={() => setFromAlignment(true)}>{text.fromSequences}</button>
        <span className="quiet">{fromAlignment ? text.fromSequencesNote : text.aTreeNote}</span>
      </div>

      <div className="tool align-tool">
        <section className="glass">
          {fromAlignment ? (
            <>
              <h2>{text.sequencesHeading}</h2>
              <div className={`source${over ? " over" : ""}`}
                   onDragOver={(event) => { event.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
                   onDrop={(event) => { event.preventDefault(); setOver(false); void open(event.dataTransfer.files[0]); }}>
                <div className="row">
                  <button type="button" className="btn" onClick={() => file.current?.click()}>{shared.openFile}</button>
                  <input ref={file} type="file" accept={ACCEPT} hidden onChange={(event) => { void open(event.target.files?.[0]); event.target.value = ""; }} />
                  <button type="button" className="btn" onClick={() => { setRows(sampleFamily()); setFileName(text.sampleName); setProblem(null); }}>{shared.loadSample}</button>
                </div>
                <p className="quiet">{text.sequencesNote}</p>
              </div>
              <p className="facts">
                <span><b>{text.source}</b> {fileName}</span>
                <span><b>{text.sequences}</b> {number(rows.length)}</span>
                <span><b>{text.columns}</b> {number(rows[0]?.letters.length ?? 0)}</span>
              </p>
              <div className="row">
                <label className="field" htmlFor="model">{text.model}</label>
                <select id="model" className="in grow" value={model} onChange={(event) => setModel(event.target.value)}>
                  {models.map((one) => <option key={one} value={one}>{one}</option>)}
                </select>
              </div>
              <div className="chips">
                {METHODS.map((one) => (
                  <button key={one} type="button" className={`chip${method === one ? " on" : ""}`} aria-pressed={method === one} onClick={() => setMethod(one)}>
                    {one === "nj" ? text.nj : text.upgma}
                  </button>
                ))}
              </div>
              <p className="quiet">{method === "nj" ? text.njNote : text.upgmaNote}</p>
            </>
          ) : (
            <>
              <h2>{text.treeHeading}</h2>
              <div className="row">
                <label className="field" htmlFor="format">{text.format}</label>
                <select id="format" className="in" value={format} onChange={(event) => setFormat(event.target.value)}>
                  {TREE_FORMATS.map((one) => <option key={one} value={one}>{one}</option>)}
                </select>
              </div>
              <label className="field" htmlFor="newick">{text.theTree}</label>
              <textarea id="newick" className="in tree-text" value={newick} onChange={(event) => setNewick(event.target.value)} spellCheck={false} rows={6} />
              <div className="row">
                <button type="button" className="btn" onClick={() => { setNewick(SAMPLE_NEWICK); setFormat("newick"); }}>{shared.loadSample}</button>
              </div>
              <p className="quiet">{text.treeNote}</p>
            </>
          )}
          <label className="check"><input type="checkbox" checked={scaled} onChange={(event) => setScaled(event.target.checked)} /> {text.toScale} <span className="quiet">{text.toScaleNote}</span></label>
          <label className="check"><input type="checkbox" checked={support} onChange={(event) => setSupport(event.target.checked)} /> {text.showSupport} <span className="quiet">{text.supportNote}</span></label>
          {problem !== null ? <p className="problem" role="alert">{problem}</p> : null}
        </section>

        <section className="glass" aria-live="polite">
          {result === null ? null : !result.ok ? (
            <>
              <h2>{text.noTree}</h2>
              <p className={result.error === "empty" || result.error === "too few" || result.error === "not aligned" ? "quiet" : "problem"}>
                {result.error === "empty" ? text.noTreeNote : result.error === "too few" ? text.tooFew : result.error === "not aligned" ? text.notAligned : result.error}
              </p>
            </>
          ) : (
            <>
              <h2>{text.resultHeading(result.tree.summary.tips)}</h2>
              <p className="facts">
                <span><b>{text.totalLength}</b> {result.tree.summary.totalLength.toFixed(3)}</span>
                <span><b>{text.rooted}</b> {result.tree.summary.rooted ? text.yes : text.no}</span>
                <span><b>{text.bifurcating}</b> {result.tree.summary.bifurcating ? text.yes : text.no}</span>
              </p>
              <div ref={drawing}>
                <TreeView layout={result.tree.layout} scaled={scaled && result.tree.summary.hasLengths} support={support} />
              </div>
              {fromAlignment && built !== null && built.ok && built.distances !== undefined ? (
                <>
                  <h3>{text.distancesHeading(model)}</h3>
                  <div className="tables">
                    <table className="distances">
                      <thead><tr><th /> {built.distances.names.map((name) => <th key={name}>{name.slice(0, 8)}</th>)}</tr></thead>
                      <tbody>
                        {built.distances.names.map((name, i) => (
                          <tr key={name}>
                            <th scope="row">{name}</th>
                            {built.distances!.rows[i].map((value, j) => <td key={j} className="n">{i === j ? "—" : value.toFixed(3)}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="quiet">{text.distancesNote}</p>
                </>
              ) : null}
              <h3>{text.saveHeading}</h3>
              <div className="row">
                <label className="field" htmlFor="save-as">{text.as}</label>
                <select id="save-as" className="in" value={saveAs} onChange={(event) => setSaveAs(event.target.value)}>
                  {TREE_FORMATS.map((one) => <option key={one} value={one}>{one}</option>)}
                </select>
                <button type="button" className="btn" onClick={saveTree}>{text.saveTree}</button>
                <button type="button" className="btn" onClick={() => void savePng()}>{text.savePng}</button>
              </div>
              <p className="newick-out"><code>{result.tree.newick}</code></p>
            </>
          )}
        </section>
      </div>
    </>
  );
}
