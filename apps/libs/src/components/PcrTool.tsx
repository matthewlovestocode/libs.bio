"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GELS } from "@biolibs/gel";
import { cleanSequence, notDna } from "@/lib/digest.ts";
import { ANNEAL_BELOW, design, pcr, productsFasta } from "@/lib/pcr.ts";
import { samplePlasmid } from "@/lib/sample.ts";
import { saveFile, saveSvgAsPng } from "@/lib/save.ts";
import { messages } from "@/messages/index.ts";
import { Bases } from "./Bases.tsx";
import { Gel } from "./Gel.tsx";
import { PrimerMap } from "./PrimerMap.tsx";
import { SequenceSource } from "./SequenceSource.tsx";

/** The longest template a link is made for. Past this an address stops being something to paste. */
const LONGEST_LINK = 20_000;

/** The stretch of the sample the tool starts by copying. */
const START = { from: 501, to: 1200 };

/** The primers the tool starts with: a pair designed for that stretch of the sample. */
function starting(): { forward: string; reverse: string } {
  const pair = design(samplePlasmid(), START.from, START.to);
  return { forward: pair?.forward.sequence ?? "", reverse: pair?.reverse.sequence ?? "" };
}

/**
 * The PCR tool: a template, two primers, and what they would copy.
 *
 * Everything is worked out in the page by `pcr()` and `design()`. Nothing is sent anywhere. A link
 * is made only when it is asked for, and holds the template after the `#`, which browsers do not
 * send to a server.
 */
export function PcrTool() {
  const all = messages();
  const text = all.pcr, shared = all.tool;
  const [input, setInput] = useState(samplePlasmid);
  const [circular, setCircular] = useState(true);
  const [name, setName] = useState("sample");
  const [from, setFrom] = useState(String(START.from));
  const [to, setTo] = useState(String(START.to));
  const [primers, setPrimers] = useState(starting);
  const [mismatches, setMismatches] = useState(0);
  const [gel, setGel] = useState("1.0");
  const [problem, setProblem] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const gelSide = useRef<HTMLDivElement>(null);

  // A link somebody was sent is read once, after the page is up.
  useEffect(() => {
    if (window.location.hash.length < 2) return;
    const sent = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const template = sent.get("s");
    if (template !== null) setInput(cleanSequence(template));
    if (sent.get("f") !== null || sent.get("r") !== null) setPrimers({ forward: sent.get("f") ?? "", reverse: sent.get("r") ?? "" });
    if (sent.get("c") !== null) setCircular(sent.get("c") === "1");
    if (sent.get("a") !== null) setFrom(sent.get("a") ?? "");
    if (sent.get("b") !== null) setTo(sent.get("b") ?? "");
    const tolerance = Number(sent.get("m"));
    if (sent.get("m") !== null && [0, 1, 2, 3].includes(tolerance)) setMismatches(tolerance);
    const sentGel = sent.get("g");
    if (sentGel !== null && GELS.some((one) => one.id === sentGel)) setGel(sentGel);
  }, []);

  const dna = useMemo(() => cleanSequence(input), [input]);
  const usable = dna.length > 0 && notDna(dna).length === 0;
  const result = useMemo(() => (usable ? pcr(dna, primers.forward, primers.reverse, { circular, mismatches, gel }) : null), [usable, dna, primers, circular, mismatches, gel]);
  const number = (value: number) => value.toLocaleString("en-US");
  // A complaint about the last thing tried is out of date once the template or the primers change.
  useEffect(() => { setProblem(null); }, [dna, primers.forward, primers.reverse]);

  const designThem = () => {
    const first = Number(from), last = Number(to);
    if (!Number.isInteger(first) || !Number.isInteger(last) || first < 1 || last > dna.length || first >= last) return setProblem(text.badStretch(dna.length));
    try {
      const pair = design(dna, first, last);
      if (pair === null) return setProblem(text.noPair);
      setProblem(null); setPrimers({ forward: pair.forward.sequence, reverse: pair.reverse.sequence });
    } catch (error) {
      setProblem(error instanceof Error ? error.message : String(error));
    }
  };
  const copy = async () => {
    if (dna.length > LONGEST_LINK) return setProblem(shared.tooLong);
    const carry = new URLSearchParams({ s: dna, f: primers.forward, r: primers.reverse, c: circular ? "1" : "0", a: from, b: to, m: String(mismatches), g: gel });
    await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${carry.toString()}`);
    setProblem(null); setCopied(true); window.setTimeout(() => setCopied(false), 2500);
  };
  const saveGel = async () => {
    const drawing = gelSide.current?.querySelector("svg");
    if (drawing === null || drawing === undefined) return;
    try { await saveSvgAsPng(drawing, `${name}_pcr_gel.png`); setProblem(null); } catch (error) { setProblem(error instanceof Error ? error.message : String(error)); }
  };
  const where = (start: number, end: number) => `${number(start + 1)}–${number(end > dna.length ? end - dna.length : end)}`;

  return (
    <div className="tool">
      <section className="glass">
        <h2>{text.inputHeading}</h2>
        <SequenceSource value={input} onChange={setInput} circular={circular} onCircular={setCircular} onName={setName}>
          <p className="field">{text.stretch}</p>
          <div className="row first">
            <label className="inline">{text.from} <input className="in num" inputMode="numeric" value={from} onChange={(event) => setFrom(event.target.value)} aria-label={text.fromLabel} /></label>
            <label className="inline">{text.to} <input className="in num" inputMode="numeric" value={to} onChange={(event) => setTo(event.target.value)} aria-label={text.toLabel} /></label>
            <button type="button" className="btn go" onClick={designThem} disabled={!usable}>{text.design}</button>
          </div>
          <p className="quiet">{text.designNote}</p>

          <label className="field" htmlFor="forward">{text.forward} <span className="count">{text.fiveToThree}</span></label>
          <input id="forward" className="in primer" value={primers.forward} onChange={(event) => setPrimers((now) => ({ ...now, forward: event.target.value }))} spellCheck={false} autoCapitalize="characters" autoCorrect="off" />
          <label className="field" htmlFor="reverse">{text.reverse} <span className="count">{text.fiveToThree}</span></label>
          <input id="reverse" className="in primer" value={primers.reverse} onChange={(event) => setPrimers((now) => ({ ...now, reverse: event.target.value }))} spellCheck={false} autoCapitalize="characters" autoCorrect="off" />

          <label className="field" htmlFor="mismatches">{text.mismatches}</label>
          <select id="mismatches" className="in" value={mismatches} onChange={(event) => setMismatches(Number(event.target.value))}>
            {[0, 1, 2, 3].map((count) => <option key={count} value={count}>{text.mismatchOption(count)}</option>)}
          </select>
        </SequenceSource>
        <div className="row">
          <button type="button" className="btn" onClick={() => void copy()} disabled={result === null}>{copied ? shared.copied : shared.copyLink}</button>
        </div>
        {problem !== null ? <p className="problem" role="alert">{problem}</p> : null}
        <p className="quiet">{shared.copyNote}</p>
      </section>

      <section className="glass" aria-live="polite">
        {result === null ? <><h2>{text.noResult}</h2><p className="quiet">{text.noResultNote}</p></> : (
          <>
            <h2>{text.resultHeading(result.products.length)}</h2>
            {result.products.length === 0 ? <p className="quiet">{text.noProduct}</p> : null}
            {result.products.length > 1 ? <p className="problem">{text.manyProducts}</p> : null}
            <div className="result">
              <div className="gel-side" ref={gelSide}>
                <Gel ladder={result.ladderLane} sample={result.bands}
                     labels={{ ladder: shared.ladderLane, sample: text.lane, alt: shared.gelAlt(result.ladder.name, result.bands.length) }} />
                <label className="field" htmlFor="gel">{shared.gel}</label>
                <select id="gel" className="in" value={gel} onChange={(event) => setGel(event.target.value)}>
                  {GELS.map((one) => <option key={one.id} value={one.id}>{shared.gelOption(one.percent, number(one.smallest), number(one.largest))}</option>)}
                </select>
              </div>
              <div className="tables">
                {result.products.length === 0 ? null : (
                  <table>
                    <thead><tr><th>{text.product}</th><th>{shared.span}</th><th>{text.madeBy}</th></tr></thead>
                    <tbody>
                      {result.products.map((product, i) => (
                        <tr key={i}>
                          <td className="n">{number(product.length)} bp</td>
                          <td className="n">{where(product.start, product.end)}</td>
                          <td>{product.forward} · {product.reverse}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {result.anneal === null || result.tmGap === null ? null : (
                  <p className="facts">
                    <span><b>{text.anneal}</b> {result.anneal.toFixed(0)} °C</span>
                    <span className={result.tmGap > 5 ? "warn" : undefined}><b>{text.gap}</b> {result.tmGap.toFixed(1)} °C</span>
                  </p>
                )}
              </div>
            </div>

            <h3>{text.primersHeading}</h3>
            {result.primers.map((primer) => (
              <div className="primer-card" key={primer.name}>
                <p className="primer-name"><i className={`dot ${primer.name}`} />{text[primer.name]}</p>
                {primer.sequence === "" ? null : <p className="primer-seq"><span className="quiet">5′</span> <Bases text={primer.sequence} /> <span className="quiet">3′</span></p>}
                {primer.problem !== null ? <p className="problem">{primer.problem}</p> : primer.report === null ? null : (
                  <>
                    <p className="facts">
                      <span><b>{text.length}</b> {primer.report.length}</span>
                      <span><b>{text.tm}</b> {primer.report.tm.toFixed(1)} °C</span>
                      <span><b>{text.gc}</b> {(primer.report.gc * 100).toFixed(0)}%</span>
                      <span><b>{text.binds}</b> {primer.sites.length === 0 ? text.nowhere : primer.sites.map((site) => `${where(site.start, site.end)}${site.mismatches > 0 ? ` (${text.mismatched(site.mismatches)})` : ""}`).join(", ")}</span>
                    </p>
                    {primer.sites.length > 1 ? <p className="problem">{text.bindsTwice(primer.sites.length)}</p> : null}
                    {primer.report.warnings.length === 0 ? <p className="fine">{text.looksFine}</p> : <ul className="warnings">{primer.report.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
                  </>
                )}
              </div>
            ))}

            {result.primers.some((primer) => primer.sites.length > 0) ? (
              <>
                <h3>{text.mapHeading}</h3>
                <PrimerMap result={result} alt={text.mapAlt(result.circular, result.products.length)} />
              </>
            ) : null}
            <div className="row">
              <button type="button" className="btn" disabled={result.products.length === 0} onClick={() => saveFile(`${name}_pcr_products.fasta`, new Blob([productsFasta(result, name)], { type: "text/plain" }))}>{text.saveProducts}</button>
              <button type="button" className="btn" onClick={() => void saveGel()}>{shared.saveGel}</button>
            </div>
            <p className="quiet">{text.note(ANNEAL_BELOW)}</p>
          </>
        )}
      </section>
    </div>
  );
}
