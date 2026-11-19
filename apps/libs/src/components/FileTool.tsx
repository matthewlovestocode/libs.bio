"use client";

import { useMemo, useRef, useState } from "react";
import { OUTPUT_FORMATS, type Opened, openAnyFile, outputName, survives, writeAs } from "@/lib/convert.ts";
import { ACCEPT, SEQUENCE_FORMATS } from "@/lib/files.ts";
import { fetchRecord } from "@/lib/ncbi.ts";
import { SAMPLE_NAME, sampleGenBank, sampleReads } from "@/lib/sample.ts";
import { saveFile } from "@/lib/save.ts";
import { messages } from "@/messages/index.ts";

/** How much of the converted file to show. Past this it is a download, not something to read. */
const MOST_SHOWN = 20_000;

/** The sample files, so there is something to convert before anything is opened. */
const SAMPLES = {
  plasmid: () => ({ fileName: `${SAMPLE_NAME}.gb`, bytes: new TextEncoder().encode(sampleGenBank()) }),
  reads: () => ({ fileName: "reads.fastq", bytes: new TextEncoder().encode(sampleReads()) }),
};

/**
 * The file tool: open a sequence file in any of the formats the libraries read, see everything it
 * holds, and write it out in another format — with what the conversion costs worked out by reading
 * the result back in.
 *
 * The file is read in the browser and never uploaded.
 */
export function FileTool() {
  const all = messages();
  const text = all.files, shared = all.tool;
  const [opened, setOpened] = useState<Opened | null>(() => openAnyFile(...Object.values(SAMPLES.plasmid()) as [string, Uint8Array]));
  const [into, setInto] = useState("fasta");
  const [accession, setAccession] = useState("");
  const [fetching, setFetching] = useState(false);
  const [over, setOver] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const format = OUTPUT_FORMATS.find((one) => one.id === into)!;
  const written = useMemo(() => (opened === null ? null : writeAs(opened.records, into)), [opened, into]);
  const survived = useMemo(() => (opened === null || written === null ? null : survives(opened.summaries, written, into)), [opened, written, into]);
  const number = (value: number) => value.toLocaleString("en-US");

  const take = (fileName: string, bytes: Uint8Array, asFormat?: string) => {
    try { setOpened(openAnyFile(fileName, bytes, asFormat)); setProblem(null); }
    catch (error) { setOpened(null); setProblem(`${shared.cannotRead(fileName)} ${error instanceof Error ? error.message : String(error)}`); }
  };
  const open = async (picked: File | undefined) => { if (picked !== undefined) take(picked.name, new Uint8Array(await picked.arrayBuffer())); };
  const fetchIt = async () => {
    if (accession.trim() === "" || fetching) return;
    setFetching(true);
    try { const got = await fetchRecord(accession); take(got.fileName, got.bytes); }
    catch (error) { setProblem(`${shared.cannotFetch} ${error instanceof Error ? error.message : String(error)}`); }
    finally { setFetching(false); }
  };
  const save = () => {
    if (opened === null || written === null || !written.ok) return;
    saveFile(outputName(opened.fileName, format), new Blob([written.bytes as BlobPart], { type: format.binary === true ? "application/octet-stream" : "text/plain" }));
  };

  return (
    <div className="tool">
      <section className="glass">
        <h2>{text.inputHeading}</h2>
        <div className={`source${over ? " over" : ""}`}
             onDragOver={(event) => { event.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
             onDrop={(event) => { event.preventDefault(); setOver(false); void open(event.dataTransfer.files[0]); }}>
          <div className="row">
            <button type="button" className="btn" onClick={() => file.current?.click()}>{shared.openFile}</button>
            <input ref={file} type="file" accept={ACCEPT} hidden onChange={(event) => { void open(event.target.files?.[0]); event.target.value = ""; }} />
            <button type="button" className="btn" onClick={() => take(...Object.values(SAMPLES.plasmid()) as [string, Uint8Array])}>{text.samplePlasmid}</button>
            <button type="button" className="btn" onClick={() => take(...Object.values(SAMPLES.reads()) as [string, Uint8Array])}>{text.sampleReads}</button>
          </div>
          <p className="quiet">{text.dropNote(SEQUENCE_FORMATS.length)}</p>
          <p className="field">{shared.getSequence}</p>
          <div className="row">
            <input className="in grow" value={accession} onChange={(event) => setAccession(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void fetchIt(); }}
                   placeholder={shared.accessionPlaceholder} aria-label={shared.accession} spellCheck={false} maxLength={40} />
            <button type="button" className="btn" onClick={() => void fetchIt()} disabled={fetching}>{fetching ? shared.fetching : shared.fetch}</button>
          </div>
          <p className="quiet">{shared.fetchNote}</p>
        </div>
        {problem !== null ? <p className="problem" role="alert">{problem}</p> : null}

        {opened === null ? null : (
          <>
            <h3>{text.whatIsInIt}</h3>
            <p className="facts">
              <span><b>{text.file}</b> {opened.fileName}</span>
              <span><b>{text.readAs}</b> {opened.format.label}</span>
              <span><b>{text.records}</b> {number(opened.records.length)}</span>
            </p>
            <div className="tables">
              <table>
                <thead><tr><th>{text.name}</th><th>{text.length}</th><th>{text.molecule}</th><th>{text.marked}</th><th>{text.quality}</th></tr></thead>
                <tbody>
                  {opened.summaries.slice(0, 12).map((one, at) => (
                    <tr key={at}>
                      <td><span className="file-name" title={one.description === "" ? one.name : `${one.name} — ${one.description}`}>{one.name}{one.description === "" ? null : <span className="quiet"> {one.description}</span>}</span></td>
                      <td className="n">{number(one.length)}</td>
                      <td className="n">{one.molecule === "" ? "—" : one.molecule}{one.topology === "" ? "" : `, ${one.topology}`}</td>
                      <td className="n">{one.features === 0 ? "—" : number(one.features)}</td>
                      <td className="n">{one.quality ? text.yes : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {opened.summaries.length > 12 ? <p className="quiet">{text.andMore(opened.summaries.length - 12)}</p> : null}
            </div>
          </>
        )}
      </section>

      <section className="glass" aria-live="polite">
        {opened === null || written === null ? <><h2>{text.noFile}</h2><p className="quiet">{text.noFileNote}</p></> : (
          <>
            <h2>{text.convertHeading}</h2>
            <div className="row">
              <label className="field" htmlFor="into">{text.into}</label>
              <select id="into" className="in grow" value={into} onChange={(event) => setInto(event.target.value)}>
                {OUTPUT_FORMATS.map((one) => <option key={one.id} value={one.id}>{one.label}</option>)}
              </select>
            </div>
            {format.aligned === true && !opened.aligned ? <p className="quiet">{text.alignedNote}</p> : null}

            {!written.ok ? (
              <>
                <h3>{text.cannotWrite}</h3>
                <p className="problem" role="alert">{written.error}</p>
                <p className="quiet">{text.cannotWriteNote}</p>
              </>
            ) : (
              <>
                {survived === null ? <p className="quiet">{text.cannotCheck}</p> : (
                  <>
                    <p className="facts">
                      <span className={survived.lost.length > 0 ? "warn" : undefined}><b>{text.lost}</b> {survived.lost.length === 0 ? text.nothingLost : survived.lost.join(", ")}</span>
                    </p>
                    <p className="facts"><span><b>{text.kept}</b> {survived.kept.length === 0 ? text.onlyLetters : survived.kept.join(", ")}</span></p>
                  </>
                )}
                <p className="quiet">{text.checkedNote}</p>
                {written.shown ? (
                  <pre className="file-out"><code>{written.text.length > MOST_SHOWN ? `${written.text.slice(0, MOST_SHOWN)}\n…` : written.text}</code></pre>
                ) : <p className="quiet">{text.binaryNote(format.label)}</p>}
                <div className="row">
                  <button type="button" className="btn" onClick={save}>{text.save(outputName(opened.fileName, format))}</button>
                </div>
                <p className="quiet">{text.sizeNote(number(written.bytes.length), number(written.count))}</p>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
