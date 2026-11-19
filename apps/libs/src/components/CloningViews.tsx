"use client";

import { useState } from "react";
import { messages } from "@/messages/index.ts";
import { AssemblyTool } from "./AssemblyTool.tsx";
import { CloneTool } from "./CloneTool.tsx";

/**
 * The two ways of putting DNA together, one at a time behind a switch: cutting and ligating, or
 * joining pieces that overlap. They answer different questions and share no inputs, so showing both
 * at once would only be noise.
 */
export function CloningViews() {
  const text = messages().clone;
  const [byOverlap, setByOverlap] = useState(false);
  return (
    <>
      <div className="methods" role="group" aria-label={text.methods}>
        <button type="button" className={`chip${byOverlap ? "" : " on"}`} aria-pressed={!byOverlap} onClick={() => setByOverlap(false)}>{text.byEnzyme}</button>
        <button type="button" className={`chip${byOverlap ? " on" : ""}`} aria-pressed={byOverlap} onClick={() => setByOverlap(true)}>{text.byOverlap}</button>
        <span className="quiet">{byOverlap ? text.byOverlapNote : text.byEnzymeNote}</span>
      </div>
      {byOverlap ? <AssemblyTool /> : <CloneTool />}
    </>
  );
}
