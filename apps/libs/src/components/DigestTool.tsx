"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GELS } from "@biolibs/gel";
import { ALL_ENZYME_NAMES, COMMON_ENZYMES, type CutEnd, cleanSequence, digest, fragmentsFasta, notDna } from "@/lib/digest.ts";
import { ACCEPT, MOST_RECORDS, type OpenedFile, readSequenceFile } from "@/lib/files.ts";
import { fetchRecord } from "@/lib/ncbi.ts";
import { samplePlasmid } from "@/lib/sample.ts";
import { saveFile, saveSvgAsPng } from "@/lib/save.ts";
import { messages } from "@/messages/index.ts";
import { CutMap } from "./CutMap.tsx";
import { Gel } from "./Gel.tsx";

/** The longest sequence a link is made for. Past this an address stops being something to paste. */
const LONGEST_LINK = 20_000;

/** What a link carries, read back out of the part of the address after `#`. */
function fromHash(hash: string): { dna?: string; enzymes?: string[]; circular?: boolean; gel?: string } {
  const read = new URLSearchParams(hash.replace(/^#/, ""));
  const dna = read.get("s"), chosen = read.get("e"), gel = read.get("g");
  return {
    ...(dna === null ? {} : { dna: cleanSequence(dna) }),
    ...(chosen === null ? {} : { enzymes: chosen.split(",").filter((name) => ALL_ENZYME_NAMES.includes(name)) }),
    ...(read.get("c") === null ? {} : { circular: read.get("c") === "1" }),
    ...(gel !== null && GELS.some((one) => one.id === gel) ? { gel } : {}),
  };
}

/**
 * The digest tool: a sequence, some enzymes, and the pieces on a gel.
 *
 * Everything is worked out in the page by `digest()`. Nothing is sent anywhere. A link is made only
 * when it is asked for, and holds the sequence after the `#`, which browsers do not send to a server.
 */
export function DigestTool() {
  const text = messages().tool;
  const [input, setInput] = useState(samplePlasmid);
  const [chosen, setChosen] = useState<string[]>(["EcoRI", "BamHI"]);
  const [circular, setCircular] = useState(true);
  const [gel, setGel] = useState("1.0");
  const [adding, setAdding] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState<OpenedFile | null>(null);
  const [record, setRecord] = useState(0);
  const [over, setOver] = useState(false);
  const [accession, setAccession] = useState("");
  const [fetching, setFetching] = useState(false);
  const gelSide = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);

  // A link somebody was sent is read once, after the page is up, so the first paint is the same
  // on the server and in the browser.
  useEffect(() => {
    if (window.location.hash.length < 2) return;
    const sent = fromHash(window.location.hash);
    if (sent.dna !== undefined) setInput(sent.dna);
    if (sent.enzymes !== undefined) setChosen(sent.enzymes);
    if (sent.circular !== undefined) setCircular(sent.circular);
    if (sent.gel !== undefined) setGel(sent.gel);
  }, []);

  const dna = useMemo(() => cleanSequence(input), [input]);
  const wrong = useMemo(() => notDna(dna), [dna]);
  const result = useMemo(() => (dna.length === 0 || wrong.length > 0 ? null : digest(dna, chosen, { circular, gel })), [dna, wrong, chosen, circular, gel]);
  const number = (value: number) => value.toLocaleString("en-US");
  const offered = [...COMMON_ENZYMES, ...chosen.filter((name) => !(COMMON_ENZYMES as readonly string[]).includes(name))];

  const toggle = (name: string) => setChosen((now) => (now.includes(name) ? now.filter((one) => one !== name) : [...now, name]));
  const add = () => {
    const name = ALL_ENZYME_NAMES.find((one) => one.toLowerCase() === adding.trim().toLowerCase());
    if (name === undefined) return setProblem(text.unknownEnzyme);
    setProblem(null); setAdding("");
    setChosen((now) => (now.includes(name) ? now : [...now, name]));
  };
  /** Put one of a file's sequences into the tool, with its shape when the file says what that is. */
  const use = (from: OpenedFile, index: number) => {
    const one = from.records[index];
    setRecord(index); setInput(one.sequence);
    if (one.circular !== null) setCircular(one.circular);
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
  /** What a cut leaves, in a few characters: 5′ AATT, 3′ TGCA, blunt. */
  const leaves = (ends: CutEnd[]) => {
    const each = ends.map((end) => (end.kind === "blunt" ? text.blunt : end.kind === "unknown" ? text.unknownEnd : `${end.kind === "5'" ? "5′" : "3′"} ${end.overhang}`));
    return [...new Set(each)].join(", ");
  };
  const moleculeName = () => (opened === null ? "sample" : (opened.records[record]?.name ?? "sequence")).replace(/[^A-Za-z0-9_.-]+/g, "_");
  const saveGel = async () => {
    const drawing = gelSide.current?.querySelector("svg");
    if (drawing === null || drawing === undefined) return;
    try { await saveSvgAsPng(drawing, `${moleculeName()}_gel.png`); setProblem(null); } catch (error) { setProblem(error instanceof Error ? error.message : String(error)); }
  };
  const copy = async () => {
    if (dna.length > LONGEST_LINK) return setProblem(text.tooLong);
    const carry = new URLSearchParams({ s: dna, e: chosen.join(","), c: circular ? "1" : "0", g: gel });
    await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${carry.toString()}`);
    setProblem(null); setCopied(true); window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="tool">
      <section className={`glass${over ? " over" : ""}`}
               onDragOver={(event) => { event.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
               onDrop={(event) => { event.preventDefault(); setOver(false); void open(event.dataTransfer.files[0]); }}>
        <h2>{text.inputHeading}</h2>
        <label className="field" htmlFor="sequence">{text.sequence} <span className="count">{number(dna.length)} {text.length}</span></label>
        <textarea id="sequence" className="in sequence" value={input} onChange={(event) => { setInput(event.target.value); setOpened(null); }} spellCheck={false} rows={4} />
        {opened === null ? null : (
          <p className="opened">
            {text.openedAs(opened.fileName, opened.format?.label ?? text.plainText)}
            {opened.records.length > 1 ? (
              <>
                {" "}<label htmlFor="record">{text.whichRecord(opened.total)}</label>{" "}
                <select id="record" className="in" value={record} onChange={(event) => use(opened, Number(event.target.value))}>
                  {opened.records.map((one, index) => <option key={index} value={index}>{one.name} ({number(one.sequence.length)} {text.length})</option>)}
                </select>
                {opened.total > opened.records.length ? <> {text.firstOnly(MOST_RECORDS)}</> : null}
              </>
            ) : null}
          </p>
        )}
        {wrong.length > 0 ? <p className="problem" role="alert">{text.notDna} {wrong.join(" ")}</p> : null}
        {dna.length === 0 ? <p className="quiet">{text.empty}</p> : null}
        <label className="check"><input type="checkbox" checked={circular} onChange={(event) => setCircular(event.target.checked)} /> {text.circular} <span className="quiet">{text.circularNote}</span></label>

        <p className="field">{text.enzymes}</p>
        <div className="chips">
          {offered.map((name) => (
            <button key={name} type="button" className={`chip${chosen.includes(name) ? " on" : ""}`} aria-pressed={chosen.includes(name)} onClick={() => toggle(name)}>{name}</button>
          ))}
        </div>
        <div className="row">
          <input className="in grow" list="every-enzyme" value={adding} onChange={(event) => setAdding(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") add(); }}
                 placeholder={text.addPlaceholder} aria-label={text.addEnzyme} />
          <datalist id="every-enzyme">{ALL_ENZYME_NAMES.map((name) => <option key={name} value={name} />)}</datalist>
          <button type="button" className="btn" onClick={add}>{text.add}</button>
        </div>

        <p className="field">{text.getSequence}</p>
        <div className="row first">
          <input className="in grow" value={accession} onChange={(event) => setAccession(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void fetchIt(); }}
                 placeholder={text.accessionPlaceholder} aria-label={text.accession} spellCheck={false} maxLength={40} />
          <button type="button" className="btn" onClick={() => void fetchIt()} disabled={fetching}>{fetching ? text.fetching : text.fetch}</button>
        </div>
        <p className="quiet">{text.fetchNote}</p>
        <div className="row">
          <button type="button" className="btn" onClick={() => file.current?.click()}>{text.openFile}</button>
          <input ref={file} type="file" accept={ACCEPT} hidden onChange={(event) => { void open(event.target.files?.[0]); event.target.value = ""; }} />
          <button type="button" className="btn" onClick={() => { setInput(samplePlasmid()); setOpened(null); setCircular(true); }}>{text.loadSample}</button>
          <button type="button" className="btn" onClick={() => void copy()} disabled={result === null}>{copied ? text.copied : text.copyLink}</button>
        </div>
        {problem !== null ? <p className="problem" role="alert">{problem}</p> : null}
        <p className="quiet">{text.openFileNote} {text.copyNote}</p>
      </section>

      <section className="glass" aria-live="polite">
        {result === null ? <><h2>{text.noResult}</h2><p className="quiet">{text.noResultNote}</p></> : (
          <>
            <h2>{text.resultHeading(result.fragments.length)}</h2>
            {result.enzymes.every((one) => one.cuts.length === 0) ? <p className="quiet">{text.noCuts}</p> : null}
            <div className="result">
              <div className="gel-side" ref={gelSide}>
                <Gel ladder={result.ladderLane} sample={result.bands}
                     labels={{ ladder: text.ladderLane, sample: text.digestLane, alt: text.gelAlt(result.ladder.name, result.bands.length) }} />
                <label className="field" htmlFor="gel">{text.gel}</label>
                <select id="gel" className="in" value={gel} onChange={(event) => setGel(event.target.value)}>
                  {GELS.map((one) => <option key={one.id} value={one.id}>{text.gelOption(one.percent, number(one.smallest), number(one.largest))}</option>)}
                </select>
              </div>
              <div className="tables">
                <table>
                  <thead><tr><th>{text.size}</th><th>{text.span}</th><th>{text.ends}</th></tr></thead>
                  <tbody>
                    {result.fragments.map((piece) => (
                      <tr key={`${piece.from}-${piece.to}`}>
                        <td className="n">{number(piece.size)} bp</td>
                        <td className="n">{number(piece.from)}–{number(piece.to)}</td>
                        <td>{piece.left ?? text.endOfMolecule} · {piece.right ?? text.endOfMolecule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h3>{text.cutsHeading}</h3>
                <table>
                  <thead><tr><th>{text.enzyme}</th><th>{text.site}</th><th>{text.cutsAt}</th><th>{text.leaves}</th></tr></thead>
                  <tbody>
                    {result.enzymes.map((one) => (
                      <tr key={one.name}>
                        <td>{one.name}</td>
                        <td className="n">{one.pattern}</td>
                        <td className="n wrap">{one.cuts.length === 0 ? text.noSite : one.cuts.map((at) => number(at === 0 ? result.length : at)).join(", ")}</td>
                        <td className="n">{one.cuts.length === 0 ? "" : leaves(one.ends)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {result.enzymes.some((one) => one.cuts.length > 0) ? (
              <>
                <h3>{text.mapHeading}</h3>
                <CutMap result={result} alt={text.mapAlt(result.circular, result.enzymes.reduce((sum, one) => sum + one.cuts.length, 0))} />
              </>
            ) : null}
            <div className="row">
              <button type="button" className="btn" onClick={() => saveFile(`${moleculeName()}_pieces.fasta`, new Blob([fragmentsFasta(result, moleculeName())], { type: "text/plain" }))}>{text.savePieces}</button>
              <button type="button" className="btn" onClick={() => void saveGel()}>{text.saveGel}</button>
            </div>
            <p className="quiet">{text.saveNote} {text.gelNote}</p>
          </>
        )}
      </section>
    </div>
  );
}
