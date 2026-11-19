"use client";

import { useMemo, useState } from "react";
import { cleanSequence, notDna } from "@/lib/digest.ts";
import { saveFile } from "@/lib/save.ts";
import { type Frame, codes, codonsIn, codonsOf, forms, frames, measure, orfs, proteinFasta } from "@/lib/sequence.ts";
import { samplePlasmid } from "@/lib/sample.ts";
import { messages } from "@/messages/index.ts";
import { Bases } from "./Bases.tsx";
import { SequenceSource } from "./SequenceSource.tsx";

/** How many codons the codon view shows before it stops and says how many are left. */
const CODONS_SHOWN = 60;

/** The fewest amino acids an open reading frame is worth reporting at. */
const ORF_LENGTHS = [30, 50, 100, 200];

/** The genetic codes, worked out once. */
const CODES = codes();

/**
 * The sequence tool: what a sequence is made of, the four ways of writing it out, and what it says
 * when read as protein in each of the six frames.
 *
 * Everything is worked out in the page by `@biolibs/seq` and `@biolibs/seqtools`.
 */
export function SequenceTool() {
  const all = messages();
  const text = all.sequences;
  const [input, setInput] = useState(samplePlasmid);
  const [circular, setCircular] = useState(true);
  const [name, setName] = useState("sample");
  const [code, setCode] = useState(1);
  const [frame, setFrame] = useState(1);
  const [shortest, setShortest] = useState(100);

  const dna = useMemo(() => cleanSequence(input), [input]);
  const wrong = useMemo(() => notDna(dna), [dna]);
  const ready = dna.length > 0 && wrong.length === 0;
  const measured = useMemo(() => (ready ? measure(dna) : null), [ready, dna]);
  const written = useMemo(() => (ready ? forms(dna) : null), [ready, dna]);
  const six = useMemo(() => (ready ? frames(dna, code) : []), [ready, dna, code]);
  const found = useMemo(() => (ready ? orfs(dna, code, shortest, circular) : []), [ready, dna, code, shortest, circular]);
  const codons = useMemo(() => codonsOf(code), [code]);
  const shown: Frame | undefined = six.find((one) => one.number === frame);
  const number = (value: number) => value.toLocaleString("en-US");
  const percent = (value: number) => `${(value * 100).toFixed(1)}%`;

  /** A sequence cut to its first and last few letters, since a whole plasmid is not worth printing. */
  const ends = (letters: string) => (letters.length <= 120 ? letters : `${letters.slice(0, 60)} … ${letters.slice(-60)}`);

  return (
    <div className="tool">
      <section className="glass">
        <h2>{text.inputHeading}</h2>
        <SequenceSource value={input} onChange={setInput} circular={circular} onCircular={setCircular} onName={setName}>
          <div className="row">
            <label className="field" htmlFor="code">{text.code}</label>
            <select id="code" className="in grow" value={code} onChange={(event) => setCode(Number(event.target.value))}>
              {CODES.map((one) => <option key={one.id} value={one.id}>{one.id}. {one.name}</option>)}
            </select>
          </div>
          <p className="quiet">{text.codeNote(codons.starts.join(", "), codons.stops.join(", "))}</p>
        </SequenceSource>
      </section>

      <section className="glass" aria-live="polite">
        {!ready || measured === null || written === null ? <><h2>{text.noResult}</h2><p className="quiet">{text.noResultNote}</p></> : (
          <>
            <h2>{text.measuredHeading}</h2>
            <p className="facts">
              <span><b>{text.length}</b> {number(measured.length)} bp</span>
              <span><b>{text.gc}</b> {percent(measured.gc)}</span>
              <span><b>{text.skew}</b> {measured.skew.toFixed(3)}</span>
              {measured.double === null ? null : <span><b>{text.weight}</b> {number(Math.round(measured.double))} Da</span>}
            </p>
            <p className="facts">
              {measured.counts.map((one) => (
                <span key={one.base}><b>{one.base}</b> {number(one.count)} <span className="quiet">({percent(one.count / Math.max(measured.length, 1))})</span></span>
              ))}
              {measured.other === 0 ? null : <span className="warn"><b>{text.other}</b> {number(measured.other)}</span>}
            </p>

            <h3>{text.formsHeading}</h3>
            <table>
              <tbody>
                <tr><td>{text.given} <span className="quiet">5′→3′</span></td><td className="n wrap"><Bases text={ends(written.given)} /></td></tr>
                <tr><td>{text.complement} <span className="quiet">3′→5′</span></td><td className="n wrap"><Bases text={ends(written.complement)} /></td></tr>
                <tr><td>{text.reverseComplement} <span className="quiet">5′→3′</span></td><td className="n wrap"><Bases text={ends(written.reverseComplement)} /></td></tr>
                <tr><td>{text.rna} <span className="quiet">5′→3′</span></td><td className="n wrap"><Bases text={ends(written.rna)} /></td></tr>
              </tbody>
            </table>
            <p className="quiet">{text.formsNote}</p>

            <h3>{text.framesHeading}</h3>
            <table>
              <thead><tr><th>{text.frame}</th><th>{text.acids}</th><th>{text.stops}</th><th>{text.longest}</th></tr></thead>
              <tbody>
                {six.map((one) => {
                  const best = found.filter((orf) => orf.frame === one.number)[0];
                  return (
                    <tr key={one.number} className={one.number === frame ? "picked" : undefined} tabIndex={0}
                        onClick={() => setFrame(one.number)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setFrame(one.number); } }}>
                      <td>{one.number > 0 ? `+${one.number}` : one.number} <span className="quiet">{one.number > 0 ? text.topStrand : text.bottomStrand}</span></td>
                      <td className="n">{number(one.protein.length)}</td>
                      <td className="n">{number(one.stops)}</td>
                      <td className="n">{best === undefined ? "—" : `${number(best.length)} aa`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {shown === undefined ? null : (
              <>
                <h3>{text.codonsHeading(shown.number > 0 ? `+${shown.number}` : String(shown.number))}</h3>
                <div className="codons">
                  {codonsIn(shown, CODONS_SHOWN).map((codon) => (
                    <span key={codon.at} className={`codon${codon.acid === "*" ? " stop" : codons.starts.includes(codon.bases) ? " start" : ""}`}>
                      <span className="codon-bases"><Bases text={codon.bases} /></span>
                      <span className="codon-acid">{codon.acid}</span>
                    </span>
                  ))}
                </div>
                {shown.dna.length > CODONS_SHOWN * 3 ? <p className="quiet">{text.andMoreCodons(number(Math.floor(shown.dna.length / 3) - CODONS_SHOWN))}</p> : null}
                <div className="row">
                  <button type="button" className="btn" disabled={shown.protein === ""}
                          onClick={() => saveFile(`${name}_frame${shown.number}.fasta`, new Blob([proteinFasta(name, shown.number, shown.protein)], { type: "text/plain" }))}>
                    {text.saveProtein}
                  </button>
                </div>
              </>
            )}

            <h3>{text.orfsHeading(found.length)}</h3>
            <div className="row">
              <label className="field" htmlFor="shortest">{text.atLeast}</label>
              <select id="shortest" className="in" value={shortest} onChange={(event) => setShortest(Number(event.target.value))}>
                {ORF_LENGTHS.map((one) => <option key={one} value={one}>{text.acidsLong(one)}</option>)}
              </select>
            </div>
            {found.length === 0 ? <p className="quiet">{text.noOrfs}</p> : (
              <div className="tables">
                <table>
                  <thead><tr><th>{text.frame}</th><th>{text.bases}</th><th>{text.acids}</th><th>{text.protein}</th></tr></thead>
                  <tbody>
                    {found.slice(0, 10).map((orf, at) => (
                      <tr key={at}>
                        <td className="n">{orf.frame > 0 ? `+${orf.frame}` : orf.frame}</td>
                        <td className="n">{number(orf.from)}–{number(orf.to)}{orf.openEnded ? ` ${text.openEnded}` : ""}</td>
                        <td className="n">{number(orf.length)}</td>
                        <td className="n wrap">{orf.protein.slice(0, 24)}{orf.protein.length > 24 ? "…" : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {found.length > 10 ? <p className="quiet">{text.andMoreOrfs(number(found.length - 10))}</p> : null}
              </div>
            )}
            <p className="quiet">{text.orfsNote} {circular ? text.circularNote : ""}</p>
          </>
        )}
      </section>
    </div>
  );
}
