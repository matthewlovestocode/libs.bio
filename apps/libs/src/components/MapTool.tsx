"use client";

import { useMemo, useRef, useState } from "react";
import { cleanSequence, notDna } from "@/lib/digest.ts";
import type { FeatureRecord, FileRecord } from "@/lib/files.ts";
import { place, singleCutters, whereIs } from "@/lib/map.ts";
import { SAMPLE_NAME, sampleFeatures, sampleGenBank, samplePlasmid } from "@/lib/sample.ts";
import { saveSvgAsPng } from "@/lib/save.ts";
import { messages } from "@/messages/index.ts";
import { FeatureMap } from "./FeatureMap.tsx";
import { SequenceSource } from "./SequenceSource.tsx";

/** The sample, as the file it would be if somebody had saved it. */
const sampleFile = () => ({ fileName: `${SAMPLE_NAME}.gb`, bytes: new TextEncoder().encode(sampleGenBank()) });

/**
 * The map tool: a sequence with its features, drawn.
 *
 * The features are whatever the opened file marks. Nothing is guessed: a sequence that is typed or
 * pasted has none, and the tool says so. Everything is worked out in the page and nothing is sent
 * anywhere.
 */
export function MapTool() {
  const all = messages();
  const text = all.maps, shared = all.tool;
  const [input, setInput] = useState(samplePlasmid);
  const [circular, setCircular] = useState(true);
  const [name, setName] = useState(SAMPLE_NAME);
  const [features, setFeatures] = useState<FeatureRecord[]>(sampleFeatures);
  const [showSites, setShowSites] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const drawing = useRef<HTMLDivElement>(null);

  const dna = useMemo(() => cleanSequence(input), [input]);
  const wrong = useMemo(() => notDna(dna), [dna]);
  const ready = dna.length > 0 && wrong.length === 0;
  // A feature that runs past the end of the sequence cannot be drawn on it, so it is left out.
  const layout = useMemo(() => place(features.filter((feature) => feature.parts.length > 0 && feature.parts.every((part) => part.start >= 0 && part.end <= dna.length && part.end > part.start)), dna.length), [features, dna]);
  const sites = useMemo(() => (ready && showSites ? singleCutters(dna, circular) : []), [ready, showSites, dna, circular]);
  const number = (value: number) => value.toLocaleString("en-US");
  const taken = (record: FileRecord | null) => { setFeatures(record?.features ?? []); setSelected(null); };
  const save = async () => {
    const svg = drawing.current?.querySelector("svg");
    if (svg === null || svg === undefined) return;
    try { await saveSvgAsPng(svg, `${name}_map.png`, 3, getComputedStyle(document.body).backgroundColor); setProblem(null); } catch (error) { setProblem(error instanceof Error ? error.message : String(error)); }
  };

  return (
    <div className="tool map-tool">
      <section className="glass">
        <h2>{text.inputHeading}</h2>
        <SequenceSource value={input} onChange={setInput} circular={circular} onCircular={setCircular} onName={setName} onRecord={taken} sample={sampleFile}>
          <label className="check"><input type="checkbox" checked={showSites} onChange={(event) => setShowSites(event.target.checked)} /> {text.showSites} <span className="quiet">{text.showSitesNote}</span></label>
        </SequenceSource>
        <p className="quiet">{text.whereFrom}</p>
      </section>

      <section className="glass" aria-live="polite">
        {!ready ? <><h2>{text.noResult}</h2><p className="quiet">{text.noResultNote}</p></> : (
          <>
            <h2>{text.resultHeading(layout.placed.length)}</h2>
            <div ref={drawing}>
              <FeatureMap name={name} length={dna.length} circular={circular} features={layout.placed} sites={sites} selected={selected} onSelect={setSelected}
                          alt={text.mapAlt(circular, layout.placed.length, sites.length)} />
            </div>
            {layout.placed.length === 0 ? <p className="quiet">{text.noFeatures}</p> : (
              <div className="tables">
                <table className="features">
                  <thead><tr><th>{text.feature}</th><th>{text.kind}</th><th>{text.where}</th><th>{text.strand}</th><th>{text.length}</th></tr></thead>
                  <tbody>
                    {layout.placed.map((feature) => (
                      <tr key={feature.index} className={selected === feature.index ? "picked" : undefined} aria-selected={selected === feature.index}
                          tabIndex={0} onClick={() => setSelected(selected === feature.index ? null : feature.index)}
                          onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(selected === feature.index ? null : feature.index); } }}>
                        <td><span className="named"><i className="swatch" style={{ background: feature.colour }} />{feature.label}</span></td>
                        <td className="n">{feature.type}</td>
                        <td className="n">{whereIs(feature)}</td>
                        <td>{feature.strand === 1 ? text.top : feature.strand === -1 ? text.bottom : text.either}</td>
                        <td className="n">{number(feature.size)} bp</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {showSites ? <p className="facts"><span><b>{text.cutOnce}</b> {sites.length === 0 ? text.none : sites.map((site) => `${site.name} (${number(site.at === 0 ? dna.length : site.at)})`).join(", ")}</span></p> : null}
            <div className="row">
              <button type="button" className="btn" onClick={() => void save()}>{text.save}</button>
            </div>
            {problem !== null ? <p className="problem" role="alert">{problem}</p> : null}
            <p className="quiet">{text.note} {shared.fetchNote}</p>
          </>
        )}
      </section>
    </div>
  );
}
