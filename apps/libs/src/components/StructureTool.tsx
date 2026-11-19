"use client";

import { useMemo, useRef, useState } from "react";
import { saveFile, saveSvgAsPng } from "@/lib/save.ts";
import { SAMPLE_STRUCTURE, sampleStructure } from "@/lib/sample.ts";
import { CONTACT_AT, MOST_RESIDUES, contactMap, contactsIn, fetchStructure, readStructure, surfaceArea } from "@/lib/structure.ts";
import { messages } from "@/messages/index.ts";
import { ContactMap, Ramachandran } from "./StructureViews.tsx";

/** What a structure file is normally called. */
const ACCEPT = ".pdb,.ent,.cif,.mmcif,.txt,text/plain";

/** Past this many atoms, working out the surface takes long enough to be worth not doing by default. */
const SURFACE_LIMIT = 20_000;

/**
 * The structure tool: open a PDB or mmCIF file, see what is in it, and look at the two pictures that
 * say most about a fold — a contact map and a Ramachandran plot.
 *
 * The parsing and the geometry are `@biolibs/pdb`'s. The file is read in the browser; only the
 * Protein Data Bank button contacts anybody, and only when it is pressed.
 */
export function StructureTool() {
  const all = messages();
  const text = all.structure, shared = all.tool;
  const [source, setSource] = useState<{ text: string; id: string; format: "pdb" | "cif"; from: string }>(
    () => ({ text: sampleStructure(), id: SAMPLE_STRUCTURE.id, format: "pdb", from: text.sampleName }));
  const [wanted, setWanted] = useState("");
  const [fetching, setFetching] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [area, setArea] = useState<number | null | "working">(null);
  const file = useRef<HTMLInputElement>(null);
  const mapSide = useRef<HTMLDivElement>(null);
  const ramaSide = useRef<HTMLDivElement>(null);

  const result = useMemo(() => readStructure(source.text, source.id, source.format), [source]);
  const structure = result.ok ? result.structure : null;
  const distances = useMemo(() => (structure === null ? [] : contactMap(structure.alphaCarbons)), [structure]);
  const touching = useMemo(() => {
    if (structure === null) return [];
    try { return contactsIn(source.text, source.id, source.format, CONTACT_AT).filter((one) => one.distant); } catch { return []; }
  }, [structure, source]);
  const number = (value: number) => value.toLocaleString("en-US");

  const take = (contents: string, id: string, from: string, name: string) => {
    setSource({ text: contents, id, format: /\.(cif|mmcif)$/i.test(name) ? "cif" : "pdb", from });
    setArea(null); setProblem(null);
  };
  const open = async (picked: File | undefined) => {
    if (picked === undefined) return;
    const contents = await picked.text();
    take(contents, picked.name.replace(/\.[^.]+$/, ""), picked.name, picked.name);
  };
  const fetchIt = async () => {
    if (wanted.trim() === "" || fetching) return;
    setFetching(true);
    try {
      const got = await fetchStructure(wanted);
      take(got.text, got.id, `${text.fromPdb} ${got.id}`, `${got.id}.pdb`);
    } catch (error) {
      setProblem(`${text.cannotFetch} ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setFetching(false);
    }
  };
  const measureSurface = () => {
    setArea("working");
    // Let the page paint the "working" state before the arithmetic blocks it.
    window.setTimeout(() => setArea(surfaceArea(source.text, source.id, source.format)), 20);
  };
  const savePng = async (which: React.RefObject<HTMLDivElement | null>, name: string) => {
    const svg = which.current?.querySelector("svg");
    if (svg === null || svg === undefined) return;
    try { await saveSvgAsPng(svg, name, 3, getComputedStyle(document.body).backgroundColor); setProblem(null); }
    catch (error) { setProblem(error instanceof Error ? error.message : String(error)); }
  };

  return (
    <div className="tool align-tool">
      <section className="glass">
        <h2>{text.inputHeading}</h2>
        <div className={`source${over ? " over" : ""}`}
             onDragOver={(event) => { event.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
             onDrop={(event) => { event.preventDefault(); setOver(false); void open(event.dataTransfer.files[0]); }}>
          <div className="row">
            <button type="button" className="btn" onClick={() => file.current?.click()}>{shared.openFile}</button>
            <input ref={file} type="file" accept={ACCEPT} hidden onChange={(event) => { void open(event.target.files?.[0]); event.target.value = ""; }} />
            <button type="button" className="btn" onClick={() => take(sampleStructure(), SAMPLE_STRUCTURE.id, text.sampleName, "sample.pdb")}>{shared.loadSample}</button>
          </div>
          <p className="quiet">{text.openNote}</p>
          <p className="field">{text.fromDatabase}</p>
          <div className="row">
            <input className="in grow" value={wanted} onChange={(event) => setWanted(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void fetchIt(); }}
                   placeholder={text.idPlaceholder} aria-label={text.pdbId} spellCheck={false} maxLength={4} />
            <button type="button" className="btn" onClick={() => void fetchIt()} disabled={fetching}>{fetching ? shared.fetching : shared.fetch}</button>
          </div>
          <p className="quiet">{text.fetchNote}</p>
        </div>
        {problem !== null ? <p className="problem" role="alert">{problem}</p> : null}

        {structure === null ? null : (
          <>
            <h3>{text.whatIsInIt}</h3>
            <p className="facts">
              <span><b>{text.from}</b> {source.from}</span>
              {structure.title === "" ? null : <span><b>{text.title}</b> {structure.title}</span>}
              {structure.method === "" || structure.method === "unknown" ? null : <span><b>{text.method}</b> {structure.method}</span>}
            </p>
            <p className="facts">
              <span><b>{text.models}</b> {number(structure.models)}</span>
              <span><b>{text.chainsLabel}</b> {number(structure.chains.length)}</span>
              <span><b>{text.atoms}</b> {number(structure.atoms)}</span>
            </p>
            <div className="tables">
              <table>
                <thead><tr><th>{text.chain}</th><th>{text.residues}</th><th>{text.waters}</th><th>{text.otherThings}</th></tr></thead>
                <tbody>
                  {structure.chains.map((chain) => (
                    <tr key={chain.id}>
                      <td className="n">{chain.id}</td>
                      <td className="n">{number(chain.residues)}</td>
                      <td className="n">{chain.waters === 0 ? "—" : number(chain.waters)}</td>
                      <td className="n wrap">{chain.other.length === 0 ? "—" : chain.other.slice(0, 6).join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {structure.chains.filter((chain) => chain.sequence !== "").slice(0, 3).map((chain) => (
              <p className="chain-seq" key={chain.id}>
                <b>{text.chain} {chain.id}</b> <code>{chain.sequence.length > 240 ? `${chain.sequence.slice(0, 240)}…` : chain.sequence}</code>
              </p>
            ))}
            <div className="row">
              <button type="button" className="btn" onClick={measureSurface} disabled={area === "working" || structure.atoms > SURFACE_LIMIT}>{text.measureSurface}</button>
              {area === "working" ? <span className="quiet">{text.working}</span>
                : area === null ? null
                : <span className="quiet">{area === null ? text.noSurface : `${number(Math.round(area))} Å²`}</span>}
            </div>
            <p className="quiet">{structure.atoms > SURFACE_LIMIT ? text.tooBigForSurface(number(SURFACE_LIMIT)) : text.surfaceNote}</p>
          </>
        )}
      </section>

      <section className="glass" aria-live="polite">
        {!result.ok ? (
          <>
            <h2>{text.cannotRead}</h2>
            <p className={result.error === "empty" ? "quiet" : "problem"}>{result.error === "empty" ? text.cannotReadNote : result.error}</p>
          </>
        ) : structure === null ? null : (
          <>
            <h2>{text.shapeHeading}</h2>
            {structure.alphaCarbons.length < 2 ? <p className="quiet">{text.noBackbone}</p> : (
              <>
                <h3>{text.contactHeading}</h3>
                <div ref={mapSide}><ContactMap alphaCarbons={structure.alphaCarbons} distances={distances} /></div>
                <p className="quiet">{text.contactNote(CONTACT_AT)} {structure.trimmed ? text.trimmedNote(number(MOST_RESIDUES)) : ""}</p>
                {touching.length === 0 ? <p className="quiet">{source.id === SAMPLE_STRUCTURE.id ? text.noDistant : text.noneTouching}</p> : (
                  <p className="facts">
                    <span><b>{text.distantContacts}</b> {number(touching.length)}</span>
                    <span><b>{text.closest}</b> {touching[0].from.name} {touching[0].from.at} · {touching[0].to.name} {touching[0].to.at} ({touching[0].distance.toFixed(1)} Å)</span>
                  </p>
                )}
              </>
            )}
            {structure.torsions.length === 0 ? null : (
              <>
                <h3>{text.ramaHeading}</h3>
                <div ref={ramaSide}><Ramachandran torsions={structure.torsions} /></div>
                <p className="quiet">{text.ramaNote}</p>
              </>
            )}
            <div className="row">
              <button type="button" className="btn" onClick={() => void savePng(mapSide, `${structure.id}_contacts.png`)} disabled={structure.alphaCarbons.length < 2}>{text.saveMap}</button>
              <button type="button" className="btn" onClick={() => void savePng(ramaSide, `${structure.id}_ramachandran.png`)} disabled={structure.torsions.length === 0}>{text.saveRama}</button>
              <button type="button" className="btn" onClick={() => saveFile(`${structure.id}.pdb`, new Blob([source.text], { type: "text/plain" }))}>{text.saveFile}</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
