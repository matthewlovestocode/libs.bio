"use client";

import { useMemo, useState } from "react";
import { type Fragment, MOST_FRAGMENTS, assemble, planOverlaps, primersFasta } from "@/lib/clone.ts";
import { cleanSequence, notDna } from "@/lib/digest.ts";
import { sampleFragments } from "@/lib/sample.ts";
import { saveFile } from "@/lib/save.ts";
import { messages } from "@/messages/index.ts";
import { Bases } from "./Bases.tsx";
import { ProductList } from "./ProductList.tsx";
import { SequenceInput } from "./SequenceInput.tsx";

/** The overlaps the tool offers to design, in bases. */
const OVERLAPS = [20, 25, 30, 40];

/**
 * The assembly tool: fragments that overlap at their ends, joined into a circle without any enzyme.
 *
 * It works both ways round. Fragments that already overlap are searched for an arrangement that
 * closes; fragments that do not are given primers whose 5′ tails would create the overlaps.
 * Everything is worked out in the page by `@biolibs/cloning`.
 */
export function AssemblyTool() {
  const text = messages().clone;
  const [fragments, setFragments] = useState<Fragment[]>(() => sampleFragments(true));
  const [minOverlap, setMinOverlap] = useState(20);
  const [overlap, setOverlap] = useState(25);
  const [designing, setDesigning] = useState(false);

  const given = fragments.filter((fragment) => cleanSequence(fragment.dna).length > 0);
  const wrong = fragments.some((fragment) => notDna(cleanSequence(fragment.dna)).length > 0);
  const ready = given.length >= 2 && !wrong;
  const found = useMemo(() => (ready && !designing ? assemble(fragments, minOverlap) : null), [ready, designing, fragments, minOverlap]);
  const plan = useMemo(() => (ready && designing ? planOverlaps(fragments, overlap) : null), [ready, designing, fragments, overlap]);
  const number = (value: number) => value.toLocaleString("en-US");

  /**
   * Switch between finding and designing. Each mode has its own sample: finding starts with pieces
   * that already overlap, designing with pieces that butt together and need primers. A sample the
   * visitor has not touched is swapped for the other one, so each mode opens on something that
   * works; anything they typed is left alone.
   */
  const switchTo = (design: boolean) => {
    setDesigning(design);
    if (JSON.stringify(fragments) === JSON.stringify(sampleFragments(!designing))) setFragments(sampleFragments(!design));
  };

  const change = (index: number, part: Partial<Fragment>) => setFragments((now) => now.map((one, at) => (at === index ? { ...one, ...part } : one)));
  const add = () => setFragments((now) => (now.length >= MOST_FRAGMENTS ? now : [...now, { name: `fragment ${now.length + 1}`, dna: "" }]));
  const remove = (index: number) => setFragments((now) => (now.length <= 2 ? now : now.filter((_, at) => at !== index)));

  return (
    <div className="tool">
      <section className="glass">
        <h2>{text.fragmentsHeading}</h2>
        <p className="quiet">{text.fragmentsNote}</p>
        {fragments.map((fragment, index) => (
          <div className="fragment" key={index}>
            <div className="row">
              <input className="in grow" value={fragment.name} onChange={(event) => change(index, { name: event.target.value })}
                     aria-label={text.fragmentName(index + 1)} maxLength={30} />
              <span className="count">{number(cleanSequence(fragment.dna).length)} {messages().tool.length}</span>
              <button type="button" className="btn" onClick={() => remove(index)} disabled={fragments.length <= 2} aria-label={text.removeFragment(fragment.name)}>−</button>
            </div>
            <SequenceInput id={`fragment-${index}`} value={fragment.dna} onChange={(next) => change(index, { dna: next })} />
          </div>
        ))}
        <div className="row">
          <button type="button" className="btn" onClick={add} disabled={fragments.length >= MOST_FRAGMENTS}>{text.addFragment}</button>
          <button type="button" className="btn" onClick={() => setFragments(sampleFragments(!designing))}>{text.loadFragments}</button>
        </div>
        <div className="row">
          <label className="field" htmlFor={designing ? "overlap" : "min-overlap"}>{designing ? text.overlapToMake : text.shortestOverlap}</label>
          {designing ? (
            <select id="overlap" className="in" value={overlap} onChange={(event) => setOverlap(Number(event.target.value))}>
              {OVERLAPS.map((one) => <option key={one} value={one}>{text.bases(one)}</option>)}
            </select>
          ) : (
            <select id="min-overlap" className="in" value={minOverlap} onChange={(event) => setMinOverlap(Number(event.target.value))}>
              {[15, 20, 25, 30].map((one) => <option key={one} value={one}>{text.bases(one)}</option>)}
            </select>
          )}
        </div>
        <div className="chips">
          <button type="button" className={`chip${designing ? "" : " on"}`} aria-pressed={!designing} onClick={() => switchTo(false)}>{text.findCircles}</button>
          <button type="button" className={`chip${designing ? " on" : ""}`} aria-pressed={designing} onClick={() => switchTo(true)}>{text.designOverlaps}</button>
        </div>
        <p className="quiet">{designing ? text.designNote : text.findNote}</p>
      </section>

      <section className="glass" aria-live="polite">
        {!ready ? <><h2>{text.noFragments}</h2><p className="quiet">{text.noFragmentsNote}</p></>
          : designing ? (
            plan === null ? null : !plan.ok ? <><h2>{text.noDesign}</h2><p className="problem">{plan.error}</p></> : (
              <>
                <h2>{text.designHeading(plan.primers.length)}</h2>
                <p className="facts"><span><b>{text.wouldGive}</b> {number(plan.length)} bp</span></p>
                {plan.primers.map((primer) => (
                  <div className="primer-card" key={primer.name}>
                    <p className="primer-name">{primer.name}</p>
                    <p className="primer-seq">
                      <span className="quiet">5′</span>{" "}
                      {primer.tail === "" ? null : <span className="tail"><Bases text={primer.tail} /></span>}
                      <Bases text={primer.binding} /> <span className="quiet">3′</span>
                    </p>
                    <p className="facts">
                      <span><b>{text.whole}</b> {primer.sequence.length} {text.basesWord}</span>
                      <span><b>{text.bindingPart}</b> {primer.binding.length} {text.basesWord}, {primer.tm.toFixed(1)} °C</span>
                      <span><b>{text.tail}</b> {primer.tail.length} {text.basesWord}</span>
                    </p>
                  </div>
                ))}
                <h3>{text.junctionsMade}</h3>
                <table>
                  <thead><tr><th>{text.junction}</th><th>{text.overlapColumn}</th></tr></thead>
                  <tbody>{plan.junctions.map((junction, index) => <tr key={index}><td>{junction.label}</td><td className="n">{junction.detail}</td></tr>)}</tbody>
                </table>
                {plan.warnings.length > 0 ? <ul className="warnings">{plan.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : null}
                <div className="row">
                  <button type="button" className="btn" onClick={() => saveFile("assembly_primers.fasta", new Blob([primersFasta(plan.primers)], { type: "text/plain" }))}>{text.savePrimers}</button>
                </div>
                <p className="quiet">{text.designedNote}</p>
              </>
            )
          ) : found === null ? null : !found.ok ? (
            <>
              <h2>{text.noCircle}</h2>
              <p className="problem">{found.error}</p>
              <p className="quiet">{text.noCircleNote}</p>
            </>
          ) : (
            <>
              <h2>{text.circlesHeading(found.products.length)}</h2>
              <ProductList products={found.products} junctionsHeading={text.overlapsHeading} />
              <p className="quiet">{text.assemblyNote}</p>
            </>
          )}
      </section>
    </div>
  );
}
