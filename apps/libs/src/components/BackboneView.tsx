"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Shape, Structure } from "@/lib/structure.ts";
import { messages } from "@/messages/index.ts";

/** How thick the backbone tube is, in ångströms. */
const THICKNESS = 0.42;

/** How wide a view the camera takes, in degrees. */
const FIELD = 42;

/** How smooth the tube is: segments per residue, and sides round it. */
const ALONG = 6, AROUND = 8;

/** What each shape is drawn in. The colours are the site's own, so they follow the theme. */
const SHAPE_COLOURS: Record<Shape, string> = { helix: "--bionet-yours", strand: "--bionet-theirs", other: "--muted" };

/** A CSS colour, read off the page so the drawing matches the rest of the site in either theme. */
function themeColour(name: string, fallback: string): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color(fallback);
  const value = getComputedStyle(document.body).getPropertyValue(name).trim();
  try { return new THREE.Color(value === "" ? fallback : value); } catch { return new THREE.Color(fallback); }
}

/** One run of residues that share a shape, which is drawn as one tube. */
interface Run {
  shape: Shape;
  points: THREE.Vector3[];
}

/**
 * Break a chain into runs of one shape, so each can be drawn in its own colour.
 *
 * Each run keeps one residue of overlap with the next, so the tube has no gaps in it.
 *
 * @param alphaCarbons - The α-carbons of one chain, in order.
 * @returns The runs.
 */
function runsOf(alphaCarbons: Structure["alphaCarbons"]): Run[] {
  const runs: Run[] = [];
  for (const [index, alpha] of alphaCarbons.entries()) {
    const point = new THREE.Vector3(alpha.xyz[0], alpha.xyz[1], alpha.xyz[2]);
    const last = runs[runs.length - 1];
    if (last === undefined || last.shape !== alpha.shape) {
      // Start the new run at the previous residue, so the two tubes meet.
      const before = index === 0 ? [] : [new THREE.Vector3(...(alphaCarbons[index - 1].xyz as [number, number, number]))];
      runs.push({ shape: alpha.shape, points: [...before, point] });
    } else {
      last.points.push(point);
    }
  }
  return runs.filter((run) => run.points.length >= 2);
}

/** The backbone itself: one tube per run of shape, plus a marker on anything picked out. */
function Backbone({ alphaCarbons, picked }: { alphaCarbons: Structure["alphaCarbons"]; picked: number[] }) {
  const colours = useMemo(() => ({
    helix: themeColour(SHAPE_COLOURS.helix, "#2ec4b6"),
    strand: themeColour(SHAPE_COLOURS.strand, "#8a7fd1"),
    other: themeColour(SHAPE_COLOURS.other, "#8899a6"),
    picked: themeColour("--bionet-held", "#e07a5f"),
  }), []);

  // One tube per chain, so two chains are never joined by a line through space.
  const chains = useMemo(() => {
    const byChain = new Map<string, Structure["alphaCarbons"]>();
    for (const alpha of alphaCarbons) byChain.set(alpha.chain, [...(byChain.get(alpha.chain) ?? []), alpha]);
    return [...byChain.values()];
  }, [alphaCarbons]);

  const tubes = useMemo(() => chains.flatMap((chain) => runsOf(chain).map((run) => ({
    shape: run.shape,
    geometry: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(run.points), Math.max(run.points.length * ALONG, 2), THICKNESS, AROUND, false),
  }))), [chains]);

  // Geometry holds GPU memory, so it is handed back when the structure changes.
  useEffect(() => () => { for (const tube of tubes) tube.geometry.dispose(); }, [tubes]);

  return (
    <group>
      {tubes.map((tube, at) => (
        <mesh key={at} geometry={tube.geometry}>
          <meshStandardMaterial color={colours[tube.shape]} roughness={0.45} metalness={0.05} />
        </mesh>
      ))}
      {picked.map((at) => {
        const alpha = alphaCarbons.find((one) => one.at === at);
        if (alpha === undefined) return null;
        return (
          <mesh key={at} position={[alpha.xyz[0], alpha.xyz[1], alpha.xyz[2]]}>
            <sphereGeometry args={[1.1, 16, 16]} />
            <meshStandardMaterial color={colours.picked} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * Keep the renderer the same size as the box it sits in.
 *
 * The canvas normally measures its own box, but that measurement can be missed when the view is put
 * on the page by something other than a resize, and the canvas then stays at its default 300 by 150
 * however large its box is. Watching the box here and telling the renderer its size is the same
 * work, done where it cannot be missed.
 *
 * @param props.box - The element the canvas fills.
 */
function FitToBox({ box }: { box: React.RefObject<HTMLDivElement | null> }) {
  const setSize = useThree((state) => state.setSize);
  useEffect(() => {
    const element = box.current;
    if (element === null) return;
    const apply = () => {
      const { width, height } = element.getBoundingClientRect();
      if (width > 0 && height > 0) setSize(width, height);
    };
    apply();
    const watcher = new ResizeObserver(apply);
    watcher.observe(element);
    return () => watcher.disconnect();
  }, [box, setSize]);
  return null;
}

/**
 * Turning the structure with a drag, and moving in and out with the wheel.
 *
 * Written here rather than taken from a library: it is about forty lines, and a whole helper package
 * would be several times the weight of the thing it helps with.
 *
 * @param props.centre - What the camera looks at.
 * @param props.distance - How far away it starts.
 * @param props.spin - Whether to turn slowly when nobody is dragging.
 */
function Controls({ centre, distance, spin }: { centre: THREE.Vector3; distance: number; spin: boolean }) {
  const { camera, gl } = useThree();
  const state = useRef({ around: 0.6, up: 0.35, away: distance, dragging: false, x: 0, y: 0, touched: false });

  useEffect(() => { state.current.away = distance; }, [distance]);

  useEffect(() => {
    const element = gl.domElement;
    const down = (event: PointerEvent) => {
      state.current = { ...state.current, dragging: true, x: event.clientX, y: event.clientY, touched: true };
      element.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!state.current.dragging) return;
      state.current.around -= (event.clientX - state.current.x) * 0.01;
      // Stop just short of the poles, where the camera would flip over.
      state.current.up = Math.max(-1.45, Math.min(1.45, state.current.up + (event.clientY - state.current.y) * 0.01));
      state.current.x = event.clientX;
      state.current.y = event.clientY;
    };
    const up = (event: PointerEvent) => {
      state.current.dragging = false;
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      state.current.away = Math.max(distance * 0.35, Math.min(distance * 3, state.current.away * (1 + event.deltaY * 0.001)));
      state.current.touched = true;
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("wheel", wheel, { passive: false });
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("wheel", wheel);
    };
  }, [gl, distance]);

  useFrame((_, delta) => {
    // It turns by itself until somebody takes hold of it, and then stays where they put it.
    if (spin && !state.current.touched) state.current.around += delta * 0.25;
    const { around, up, away } = state.current;
    camera.position.set(
      centre.x + away * Math.cos(up) * Math.sin(around),
      centre.y + away * Math.sin(up),
      centre.z + away * Math.cos(up) * Math.cos(around));
    camera.lookAt(centre);
  });
  return null;
}

/**
 * The backbone of a structure, in three dimensions: a tube through the α-carbons, coloured by what
 * the backbone's own angles say each stretch is doing.
 *
 * It is a trace, not a structure viewer: no side chains, no surfaces, no selection language. What it
 * adds to the two flat pictures is the one thing they cannot show, which is how the chain sits in
 * space, and where a pair of touching residues actually are.
 *
 * @param props.structure - The structure.
 * @param props.picked - The residue numbers to mark, if any.
 */
export default function BackboneView({ structure, picked }: { structure: Structure; picked: number[] }) {
  const text = messages().structure;
  const [spin, setSpin] = useState(true);
  const box = useRef<HTMLDivElement>(null);

  // Where the structure sits and how far back the camera has to be for all of it to fit, whichever
  // way round it is turned. A ball around it is the right measure for that, not a box: a box's
  // longest side changes as it turns, and the fit would change with it.
  const { centre, distance } = useMemo(() => {
    const points = structure.alphaCarbons.map((one) => new THREE.Vector3(one.xyz[0], one.xyz[1], one.xyz[2]));
    if (points.length === 0) return { centre: new THREE.Vector3(), distance: 50 };
    const middle = new THREE.Box3().setFromPoints(points).getCenter(new THREE.Vector3());
    const radius = Math.max(...points.map((point) => point.distanceTo(middle))) + THICKNESS * 2;
    // What the field of view needs, with a little room round the edge.
    return { centre: middle, distance: (radius / Math.sin(((FIELD / 2) * Math.PI) / 180)) * 1.08 };
  }, [structure]);

  if (structure.alphaCarbons.length < 2) return null;

  // `offsetSize` makes the canvas take its size from the box it is in rather than from a measured
  // rectangle. Without it the first measurement can be missed, and the canvas stays at its default
  // 300 by 150 until something else resizes the window.
  return (
    <div className="backbone" ref={box}>
      <Canvas camera={{ fov: FIELD, near: 0.1, far: 8000 }} dpr={[1, 2]} resize={{ offsetSize: true }}
              onPointerDown={() => setSpin(false)}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[1, 1.4, 1]} intensity={1.5} />
        <directionalLight position={[-1, -0.6, -0.8]} intensity={0.5} />
        <Backbone alphaCarbons={structure.alphaCarbons} picked={picked} />
        <Controls centre={centre} distance={distance} spin={spin} />
        <FitToBox box={box} />
      </Canvas>
      <p className="backbone-key">
        <span><i className="swatch" style={{ background: "var(--bionet-yours)" }} />{text.helixRegion}</span>
        <span><i className="swatch" style={{ background: "var(--bionet-theirs)" }} />{text.strandRegion}</span>
        <span><i className="swatch" style={{ background: "var(--muted)" }} />{text.neither}</span>
        {picked.length === 0 ? null : <span><i className="swatch" style={{ background: "var(--bionet-held)" }} />{text.thePair}</span>}
      </p>
    </div>
  );
}
