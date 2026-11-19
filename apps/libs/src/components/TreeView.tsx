"use client";

import type { Layout } from "@/lib/tree.ts";
import { messages } from "@/messages/index.ts";

/** How much room a tip's name needs, in characters, before it is cut short. */
const MOST_NAME = 18;

/**
 * A tree, drawn as a phylogram: the root on the left, tips on the right, each fork level with the
 * middle of its children. Branch lengths run along the x axis, so a long branch means a lot of
 * change.
 *
 * `@biolibs/phylo` does not draw, so this is the site's own. The library decides the shape; this
 * decides the pixels.
 *
 * @param props.layout - Every node with its place.
 * @param props.scaled - Whether the branches are to length, which decides if a scale bar is drawn.
 * @param props.support - Whether to write the support values on the forks.
 */
export function TreeView({ layout, scaled, support }: { layout: Layout; scaled: boolean; support: boolean }) {
  const text = messages().trees;
  const rowHeight = 30, left = 14, right = 150, top = 18;
  const width = 640, height = top + layout.rows * rowHeight + (scaled ? 34 : 10);
  const across = width - left - right;
  const x = (value: number) => left + (value / Math.max(layout.span, 1e-9)) * across;
  const y = (value: number) => top + value * rowHeight + rowHeight / 2;
  const short = (name: string) => (name.length > MOST_NAME ? `${name.slice(0, MOST_NAME - 1)}…` : name);
  // A scale bar of a round size, about a fifth of the way across.
  const rough = layout.span / 5;
  const step = Number(rough.toPrecision(1));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={text.treeAlt(layout.rows)} className="tree">
      {layout.nodes.map((node, at) => (
        <g key={at}>
          {node.parent === null ? null : (
            <>
              <path d={`M${x(node.parent.x)},${y(node.parent.y)} L${x(node.parent.x)},${y(node.y)} L${x(node.x)},${y(node.y)}`}
                    fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              {support && !node.tip && node.confidence !== null ? (
                <text x={x(node.x) + 4} y={y(node.y) - 4} className="tree-support">{node.confidence}</text>
              ) : null}
            </>
          )}
          {node.tip ? (
            <>
              <circle cx={x(node.x)} cy={y(node.y)} r="2.5" fill="var(--bionet-yours)" />
              <text x={x(node.x) + 7} y={y(node.y) + 4} className="tree-name">{short(node.name)}</text>
            </>
          ) : null}
        </g>
      ))}
      {scaled ? (
        <g>
          <path d={`M${left},${height - 16} L${left + (step / Math.max(layout.span, 1e-9)) * across},${height - 16}`} stroke="var(--soft)" strokeWidth="1.5" />
          <text x={left} y={height - 4} className="tree-scale">{step} {text.perSite}</text>
        </g>
      ) : <text x={left} y={height - 2} className="tree-scale">{text.noLengths}</text>}
    </svg>
  );
}
