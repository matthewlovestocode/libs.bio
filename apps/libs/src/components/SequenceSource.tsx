"use client";

import { useMemo, useRef, useState } from "react";
import { cleanSequence, notDna } from "@/lib/digest.ts";
import { ACCEPT, type FileRecord, MOST_RECORDS, type OpenedFile, readSequenceFile } from "@/lib/files.ts";
import { fetchRecord } from "@/lib/ncbi.ts";
import { samplePlasmid } from "@/lib/sample.ts";
import { messages } from "@/messages/index.ts";
import { SequenceInput } from "./SequenceInput.tsx";

/**
 * Where a tool's sequence comes from, the same in every tool: type or paste it, drop or choose a
 * file in any of 25 formats, fetch it from NCBI by accession number, or load the sample.
 *
 * It holds nothing itself but the file that was opened. The sequence and its shape belong to the
 * tool, which hands them in and is told when they change.
 *
 * @param props.value - What is in the box.
 * @param props.onChange - Called with new contents.
 * @param props.circular - Whether the molecule is a circle.
 * @param props.onCircular - Called when that changes, by hand or because a file said so.
 * @param props.onName - Called with what to call the molecule, for naming saved files.
 * @param props.onRecord - Called with the whole record when a file's sequence is used, features and
 *   all, and with `null` when the sequence is typed or pasted, since typed letters carry none.
 * @param props.sample - A sample of the tool's own to load, as a file. The made-up plasmid if left out.
 * @param props.id - What to call the sequence box, where a page has more than one.
 * @param props.label - What to call the sequence, where "Sequence" is not enough.
 * @param props.notes - Whether to end with the note about files and NCBI. A page with two of these
 *   says it once.
 * @param props.children - The tool's own controls, placed under the sequence and above the ways to
 *   get one.
 */
export function SequenceSource({ value, onChange, circular, onCircular, onName, onRecord, sample, id = "sequence", label, notes = true, children }:
  { value: string; onChange: (value: string) => void; circular: boolean; onCircular: (circular: boolean) => void; onName?: (name: string) => void;
    onRecord?: (record: FileRecord | null) => void; sample?: () => { fileName: string; bytes: Uint8Array }; id?: string; label?: string; notes?: boolean; children?: React.ReactNode }) {
  const text = messages().tool;
  const [opened, setOpened] = useState<OpenedFile | null>(null);
  const [record, setRecord] = useState(0);
  const [over, setOver] = useState(false);
  const [accession, setAccession] = useState("");
  const [fetching, setFetching] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const dna = useMemo(() => cleanSequence(value), [value]);
  const wrong = useMemo(() => notDna(dna), [dna]);
  const number = (count: number) => count.toLocaleString("en-US");
  const tidy = (name: string) => name.replace(/[^A-Za-z0-9_.-]+/g, "_");

  /** Put one of a file's sequences into the tool, with its shape when the file says what that is. */
  const use = (from: OpenedFile, index: number) => {
    const one = from.records[index];
    setRecord(index); onChange(one.sequence); onName?.(tidy(one.name)); onRecord?.(one);
    if (one.circular !== null) onCircular(one.circular);
  };
  const take = async (fileName: string, bytes: Uint8Array) => {
    try {
      const read = await readSequenceFile(fileName, bytes);
      setProblem(null); setOpened(read); use(read, 0);
    } catch (error) {
      setOpened(null);
      setProblem(`${text.cannotRead(fileName)} ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  const open = async (picked: File | undefined) => { if (picked !== undefined) await take(picked.name, new Uint8Array(await picked.arrayBuffer())); };
  const fetchIt = async () => {
    if (accession.trim() === "" || fetching) return;
    setFetching(true);
    try {
      const got = await fetchRecord(accession);
      await take(got.fileName, got.bytes);
    } catch (error) {
      setProblem(`${text.cannotFetch} ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className={`source${over ? " over" : ""}`}
         onDragOver={(event) => { event.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
         onDrop={(event) => { event.preventDefault(); setOver(false); void open(event.dataTransfer.files[0]); }}>
      <label className="field" htmlFor={id}>{label ?? text.sequence} <span className="count">{number(dna.length)} {text.length}</span></label>
      <SequenceInput id={id} value={value} onChange={(next) => { onChange(next); setOpened(null); onName?.("sequence"); onRecord?.(null); }} />
      {opened === null ? null : (
        <p className="opened">
          {text.openedAs(opened.fileName, opened.format?.label ?? text.plainText)}
          {opened.records.length > 1 ? (
            <>
              {" "}<label htmlFor={`${id}-record`}>{text.whichRecord(opened.total)}</label>{" "}
              <select id={`${id}-record`} className="in" value={record} onChange={(event) => use(opened, Number(event.target.value))}>
                {opened.records.map((one, index) => <option key={index} value={index}>{one.name} ({number(one.sequence.length)} {text.length})</option>)}
              </select>
              {opened.total > opened.records.length ? <> {text.firstOnly(MOST_RECORDS)}</> : null}
            </>
          ) : null}
        </p>
      )}
      {wrong.length > 0 ? <p className="problem" role="alert">{text.notDna} {wrong.join(" ")}</p> : null}
      {dna.length === 0 ? <p className="quiet">{text.empty}</p> : null}
      <label className="check"><input type="checkbox" checked={circular} onChange={(event) => onCircular(event.target.checked)} /> {text.circular} <span className="quiet">{text.circularNote}</span></label>

      {children}

      <p className="field">{text.getSequence}</p>
      <div className="row first">
        <input className="in grow" value={accession} onChange={(event) => setAccession(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void fetchIt(); }}
               placeholder={text.accessionPlaceholder} aria-label={text.accession} spellCheck={false} maxLength={40} />
        <button type="button" className="btn" onClick={() => void fetchIt()} disabled={fetching}>{fetching ? text.fetching : text.fetch}</button>
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => file.current?.click()}>{text.openFile}</button>
        <input ref={file} type="file" accept={ACCEPT} hidden onChange={(event) => { void open(event.target.files?.[0]); event.target.value = ""; }} />
        <button type="button" className="btn" onClick={() => { if (sample !== undefined) { const own = sample(); void take(own.fileName, own.bytes); return; } onChange(samplePlasmid()); setOpened(null); onCircular(true); onName?.("sample"); onRecord?.(null); }}>{text.loadSample}</button>
      </div>
      {problem !== null ? <p className="problem" role="alert">{problem}</p> : null}
      {notes ? <p className="quiet">{text.openFileNote} {text.fetchNote}</p> : null}
    </div>
  );
}
