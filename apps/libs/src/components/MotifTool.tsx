"use client";

import { useMemo, useState } from "react";
import { cleanSequence, notDna } from "@/lib/digest.ts";
import { DEFAULT_SETTINGS, LETTERS, type Settings, buildMotif, countsMatrix } from "@/lib/motif.ts";
import { SAMPLE_MOTIF_AT, sampleMotifInstances, sampleMotifTarget } from "@/lib/sample.ts";
import { saveFile } from "@/lib/save.ts";
import { messages } from "@/messages/index.ts";
import { Bases } from "./Bases.tsx";
import { SequenceInput } from "./SequenceInput.tsx";
import { SequenceLogo } from "./SequenceLogo.tsx";

/** The pseudocounts offered: none, the usual half, and a heavier damping. */
const PSEUDOCOUNTS = [0, 0.1, 0.5, 1];

/** How much of the target to mark up, since a whole genome is not worth printing. */
const MOST_SHOWN = 2000;

/**
 * The motif tool: build a motif from the places it has been seen, draw it, and look for it in a
 * sequence.
 *
 * The matrices and the scanning are `@biolibs/motifs`'. Everything happens in the page.
 */
export function MotifTool() {
  const all = messages();
  const text = all.motifs;
  const [instances, setInstances] = useState(() => sampleMotifInstances().join("\n"));
  const [target, setTarget] = useState(sampleMotifTarget);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const lines = useMemo(() => instances.split(/\r?\n/).map((one) => one.trim()).filter((one) => one !== ""), [instances]);
  const result = useMemo(() => buildMotif(lines, settings), [lines, settings]);
  const dna = useMemo(() => cleanSequence(target), [target]);
  const wrong = useMemo(() => notDna(dna), [dna]);
  const hits = useMemo(() => (result.ok && dna.length > 0 && wrong.length === 0 ? result.scan(dna, settings.threshold) : []), [result, dna, wrong, settings.threshold]);
  const number = (value: number) => value.toLocaleString("en-US");
  const set = (part: Partial<Settings>) => setSettings((now) => ({ ...now, ...part }));

  /** The target with every hit picked out, so they can be seen where they are. */
  const marked = useMemo(() => {
    if (!result.ok || dna === "") return null;
    const length = result.built.length;
    const pieces: { text: string; hit: boolean; strand?: string }[] = [];
    const taken = [...hits].sort((a, b) => a.at - b.at);
    let at = 0;
    for (const hit of taken) {
      if (hit.at - 1 < at) continue;
      if (hit.at - 1 > at) pieces.push({ text: dna.slice(at, hit.at - 1), hit: false });
      pieces.push({ text: dna.slice(hit.at - 1, hit.at - 1 + length), hit: true, strand: hit.strand });
      at = hit.at - 1 + length;
    }
    if (at < dna.length) pieces.push({ text: dna.slice(at), hit: false });
    return pieces;
  }, [result, dna, hits]);

  return (
    <div className="tool align-tool">
      <section className="glass">
        <h2>{text.inputHeading}</h2>
        <label className="field" htmlFor="instances">{text.instances} <span className="count">{number(lines.length)}</span></label>
        <textarea id="instances" className="in instances" value={instances} onChange={(event) => setInstances(event.target.value)} spellCheck={false} rows={8} />
        <p className="quiet">{text.instancesNote}</p>
        <div className="row">
          <button type="button" className="btn" onClick={() => setInstances(sampleMotifInstances().join("\n"))}>{text.loadInstances}</button>
        </div>

        <label className="field" htmlFor="target">{text.target} <span className="count">{number(dna.length)} {all.tool.length}</span></label>
        <SequenceInput id="target" value={target} onChange={setTarget} />
        <div className="row">
          <button type="button" className="btn" onClick={() => setTarget(sampleMotifTarget())}>{text.loadTarget}</button>
        </div>
        {wrong.length > 0 ? <p className="problem" role="alert">{all.tool.notDna} {wrong.join(" ")}</p> : null}

        <p className="field">{text.howScored}</p>
        <div className="row">
          <label className="field" htmlFor="pseudo">{text.pseudocounts}</label>
          <select id="pseudo" className="in" value={settings.pseudocounts} onChange={(event) => set({ pseudocounts: Number(event.target.value) })}>
            {PSEUDOCOUNTS.map((one) => <option key={one} value={one}>{one === 0 ? text.none : one}</option>)}
          </select>
          <label className="field" htmlFor="background">{text.background}</label>
          <select id="background" className="in" value={settings.backgroundGc} onChange={(event) => set({ backgroundGc: Number(event.target.value) })}>
            {[0.3, 0.4, 0.5, 0.6, 0.7].map((one) => <option key={one} value={one}>{(one * 100).toFixed(0)}% GC</option>)}
          </select>
        </div>
        <div className="row">
          <label className="field" htmlFor="threshold">{text.threshold}</label>
          <input id="threshold" className="in narrow" type="number" step={0.5} value={settings.threshold} onChange={(event) => set({ threshold: Number(event.target.value) })} />
          {result.ok ? (
            <>
              <button type="button" className="btn" onClick={() => set({ threshold: Number(result.built.thresholds.falsePositive.toFixed(2)) })}>{text.useFpr}</button>
              <button type="button" className="btn" onClick={() => set({ threshold: Number(result.built.thresholds.patser.toFixed(2)) })}>{text.usePatser}</button>
            </>
          ) : null}
        </div>
        <p className="quiet">{text.scoringNote}</p>
      </section>

      <section className="glass" aria-live="polite">
        {!result.ok ? (
          <>
            <h2>{text.noMotif}</h2>
            <p className="quiet">{result.error === "too few" ? text.tooFew : result.error === "different lengths" ? text.differentLengths : result.error}</p>
          </>
        ) : (
          <>
            <h2>{result.built.degenerate}</h2>
            <p className="facts">
              <span><b>{text.consensus}</b> {result.built.consensus}</span>
              <span><b>{text.builtFrom}</b> {text.ofInstances(result.built.instances, result.built.length)}</span>
            </p>
            <SequenceLogo built={result.built} />
            <p className="quiet">{text.logoNote}</p>

            <h3>{text.counts}</h3>
            <div className="tables">
              <table className="matrix">
                {/* No space between the corner cell and the numbers: a space on the same line in JSX
                    is a text node, and a text node is not allowed inside a `tr`. It hydrated as an
                    error and the browser moved it out of the table. */}
                <thead><tr><th />{result.built.columns.map((_, at) => <th key={at}>{at + 1}</th>)}</tr></thead>
                <tbody>
                  {LETTERS.map((letter) => (
                    <tr key={letter}>
                      <th scope="row" className={`b-${letter.toLowerCase()}`}>{letter}</th>
                      {result.built.columns.map((column, at) => <td key={at} className="n">{column.counts[letter]}</td>)}
                    </tr>
                  ))}
                  <tr className="information">
                    <th scope="row">{text.bits}</th>
                    {result.built.columns.map((column, at) => <td key={at} className="n">{column.information.toFixed(1)}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="facts">
              <span><b>{text.bestScore}</b> {result.built.best.toFixed(2)}</span>
              <span><b>{text.background}</b> {result.built.mean.toFixed(2)} ± {result.built.deviation.toFixed(2)}</span>
              <span><b>{text.fprThreshold}</b> {result.built.thresholds.falsePositive.toFixed(2)}</span>
            </p>

            <h3>{text.foundHeading(hits.length)}</h3>
            {dna.length === 0 ? <p className="quiet">{text.noTarget}</p> : hits.length === 0 ? <p className="quiet">{text.nothingFound(settings.threshold)}</p> : (
              <div className="tables">
                <table>
                  <thead><tr><th>{text.at}</th><th>{text.strand}</th><th>{text.letters}</th><th>{text.score}</th></tr></thead>
                  <tbody>
                    {hits.slice(0, 12).map((hit, at) => (
                      <tr key={at}>
                        <td className="n">{number(hit.at)}</td>
                        <td>{hit.strand === "forward" ? text.forward : text.reverse}</td>
                        <td className="n"><Bases text={hit.letters} /></td>
                        <td className="n">{hit.score.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hits.length > 12 ? <p className="quiet">{text.andMore(number(hits.length - 12))}</p> : null}
              </div>
            )}
            {marked === null || dna.length === 0 || dna.length > MOST_SHOWN ? null : (
              <>
                <h3>{text.whereHeading}</h3>
                <p className="marked">
                  {marked.map((piece, at) => (
                    piece.hit
                      ? <mark key={at} className={piece.strand}>{piece.text}</mark>
                      : <span key={at}>{piece.text}</span>
                  ))}
                </p>
              </>
            )}
            <p className="quiet">{text.plantedNote(SAMPLE_MOTIF_AT.forward.join(" and "), String(SAMPLE_MOTIF_AT.reverse[0]))}</p>
            <div className="row">
              <button type="button" className="btn" onClick={() => saveFile("motif.txt", new Blob([countsMatrix(result.built)], { type: "text/plain" }))}>{text.saveMotif}</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
