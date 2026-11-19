"use client";

import { useRef, useState } from "react";
import { place } from "@/lib/map.ts";
import { type Product, productFasta } from "@/lib/clone.ts";
import { saveFile, saveSvgAsPng } from "@/lib/save.ts";
import { messages } from "@/messages/index.ts";
import { FeatureMap } from "./FeatureMap.tsx";

/**
 * The circles a cloning or an assembly would give: each one drawn, with what holds it together and
 * what it carries, and a way to save it.
 *
 * @param props.products - The circles.
 * @param props.junctionsHeading - What to call the junction table, which differs between a ligation
 *   and an assembly.
 */
export function ProductList({ products, junctionsHeading }: { products: Product[]; junctionsHeading: string }) {
  const text = messages().clone;
  const [shown, setShown] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const drawing = useRef<HTMLDivElement>(null);
  const product = products[Math.min(shown, products.length - 1)];
  const number = (value: number) => value.toLocaleString("en-US");
  const layout = place(product.features, product.length);
  const savePng = async () => {
    const svg = drawing.current?.querySelector("svg");
    if (svg === null || svg === undefined) return;
    try { await saveSvgAsPng(svg, `${product.name}_map.png`, 3, getComputedStyle(document.body).backgroundColor); setProblem(null); } catch (error) { setProblem(error instanceof Error ? error.message : String(error)); }
  };

  return (
    <>
      {products.length > 1 ? (
        <div className="chips">
          {products.map((one, index) => (
            <button key={one.name} type="button" className={`chip${index === shown ? " on" : ""}`} aria-pressed={index === shown}
                    onClick={() => { setShown(index); setSelected(null); }}>
              {number(one.length)} bp{one.orientation === undefined ? "" : ` · ${one.orientation}`}
            </button>
          ))}
        </div>
      ) : null}
      <p className="facts"><span><b>{text.product}</b> {product.description}</span></p>
      <div ref={drawing}>
        <FeatureMap name={product.name} length={product.length} circular features={layout.placed} sites={[]} selected={selected} onSelect={setSelected}
                    alt={text.productAlt(number(product.length), layout.placed.length)} />
      </div>
      <h3>{junctionsHeading}</h3>
      <table>
        <thead><tr><th>{text.junction}</th><th>{text.heldBy}</th></tr></thead>
        <tbody>
          {product.junctions.map((junction, index) => (
            <tr key={index}><td>{junction.label}</td><td className="n">{junction.detail === "" ? text.blunt : junction.detail}</td></tr>
          ))}
        </tbody>
      </table>
      {layout.placed.length === 0 ? <p className="quiet">{text.nothingCarried}</p> : (
        <p className="facts"><span><b>{text.carries}</b> {layout.placed.map((feature) => feature.label).join(", ")}</span></p>
      )}
      <div className="row">
        <button type="button" className="btn" onClick={() => saveFile(`${product.name}.fasta`, new Blob([productFasta(product)], { type: "text/plain" }))}>{text.saveProduct}</button>
        <button type="button" className="btn" onClick={() => void savePng()}>{text.saveMap}</button>
      </div>
      {problem !== null ? <p className="problem" role="alert">{problem}</p> : null}
    </>
  );
}
