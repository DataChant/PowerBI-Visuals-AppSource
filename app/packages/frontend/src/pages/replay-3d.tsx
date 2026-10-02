import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { Thumb } from '@/components/ui';
import type { VisualRef } from '@/components/visual-drawer';
import { formatInt, formatScore } from '@/lib/format';
import type { Standing } from '@/lib/leaderboard';
import { sentiment, type Replay } from '@/lib/replay';

/**
 * The replay's field in three dimensions: number of ratings across (on a log
 * scale, since a handful of visuals hold most of the ratings), popularity up
 * and average stars in depth, with 3 stars as the neutral middle.
 */

/** Half the cube's width; the scene runs from -SIZE to +SIZE on every axis. */
const SIZE = 5;
const MAX_RATERS = 300;
const MOVE_MS = 700;
const DOT_RADIUS = 0.09;
/** The starting angle; the distance is fitted to the view's shape. */
const CAMERA_HOME = new THREE.Vector3(0.55, 0.38, 0.74).normalize();
const CAMERA_DISTANCE = 24;
/** The camera looks slightly below the centre, so the labels under the cube stay in frame. */
const TARGET = new THREE.Vector3(0, -2, 0);

/** A narrow view needs the camera further back to keep the whole cube in frame. */
function fittedDistance(aspect: number) {
  return CAMERA_DISTANCE * Math.max(1, Math.pow(1.6 / Math.max(aspect, 0.3), 0.85));
}
/** A press that travels further than this is a drag that turns the view, not a click. */
const CLICK_SLOP = 5;
const TRAIL_POINTS_MAX = 400;

const RATER_TICKS = [0, 1, 10, 100, 300];
const POPULARITY_TICKS = [0, 25, 50, 75, 100];
const Z_TICKS = [-2, -1, 0, 1, 2];

function yOf(score: number) {
  return (score * 2 - 1) * SIZE;
}
function xOf(raters: number) {
  const r = Number.isNaN(raters) ? 0 : Math.max(0, raters);
  return (Math.log10(1 + r) / Math.log10(1 + MAX_RATERS)) * 2 * SIZE - SIZE;
}
function zOf(stars: number, raters: number) {
  const s = sentiment(stars, raters);
  return s === null ? 0 : (s / 2) * SIZE;
}

function formatStars(stars: number) {
  const value = Number.isInteger(stars) ? String(stars) : stars.toFixed(1);
  return `${value} star${stars === 1 ? '' : 's'} on average`;
}

function cssColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(value || fallback);
}

interface Palette {
  up: THREE.Color;
  down: THREE.Color;
  gold: THREE.Color;
  still: THREE.Color;
  line: THREE.Color;
}

function readPalette(): Palette {
  return {
    up: cssColor('--color-up', '#107c10'),
    down: cssColor('--color-down', '#c50f1f'),
    gold: cssColor('--color-gold', '#e3b505'),
    still: cssColor('--color-muted-foreground', '#6b6458'),
    line: cssColor('--color-border', '#e8e0c8'),
  };
}

/** Where a visual sits in a frame. NaN on x when it has never been listed. */
function place(replay: Replay, at: number, v: number, out: THREE.Vector3) {
  const f = replay.frames[at];
  const score = f.positions[v];
  if (Number.isNaN(score)) return out.set(NaN, NaN, NaN);
  return out.set(xOf(f.raters[v]), yOf(score), zOf(f.stars[v], f.raters[v]));
}

export interface Replay3DProps {
  replay: Replay;
  at: number;
  standings: (Standing | undefined)[];
  /** Indexes of the visuals to follow. When any are picked, only they are drawn. */
  picks: number[];
  /** Whether visuals nobody has rated yet are drawn. Followed visuals are always drawn. */
  showUnrated: boolean;
  /** Changes whenever the camera should return to its starting angle. */
  resetSignal: number;
  reducedMotion: boolean;
  onOpen: (v: VisualRef) => void;
  /** Called once when the browser cannot draw 3D, so the page can fall back to the flat view. */
  onUnsupported: () => void;
}

export default function Replay3D({
  replay,
  at,
  standings,
  picks,
  showUnrated,
  resetSignal,
  reducedMotion,
  onOpen,
  onUnsupported,
}: Replay3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  // Everything the render loop reads lives in one ref, so a new week or a new
  // pick changes the scene without tearing down the renderer.
  const live = useRef({
    replay,
    at,
    picks,
    standings,
    reducedMotion,
    onOpen,
  });
  useLayoutEffect(() => {
    live.current = { replay, at, picks, standings, reducedMotion, onOpen };
  });

  const scene = useRef<{
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    dots: THREE.InstancedMesh;
    trails: THREE.Group;
    from: Float32Array;
    to: Float32Array;
    fromScale: Float32Array;
    toScale: Float32Array;
    startedAt: number;
    palette: Palette;
    dirty: boolean;
  } | null>(null);

  // Build the scene once.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      onUnsupported();
      return;
    }
    const n = live.current.replay.guids.length;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';
    host.prepend(renderer.domElement);

    const three = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    camera.position.copy(CAMERA_HOME).multiplyScalar(CAMERA_DISTANCE).add(TARGET);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 60;
    controls.target.copy(TARGET);

    three.add(new THREE.AmbientLight(0xffffff, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(6, 12, 8);
    three.add(sun);

    const palette = readPalette();

    // The cube's edges, a floor grid and the neutral 3-star plane.
    const frame = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2 * SIZE, 2 * SIZE, 2 * SIZE)),
      new THREE.LineBasicMaterial({ color: palette.still, transparent: true, opacity: 0.35 })
    );
    three.add(frame);
    const grid = new THREE.GridHelper(2 * SIZE, 4, palette.still, palette.still);
    grid.position.y = -SIZE;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.25;
    three.add(grid);
    const neutral = new THREE.Mesh(
      new THREE.PlaneGeometry(2 * SIZE, 2 * SIZE),
      new THREE.MeshBasicMaterial({
        color: palette.gold,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    three.add(neutral);

    const dots = new THREE.InstancedMesh(
      new THREE.SphereGeometry(DOT_RADIUS, 14, 10),
      new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05 }),
      n
    );
    dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let v = 0; v < n; v++) dots.setColorAt(v, palette.still);
    three.add(dots);

    const trails = new THREE.Group();
    three.add(trails);

    scene.current = {
      renderer,
      camera,
      controls,
      dots,
      trails,
      from: new Float32Array(n * 3).fill(NaN),
      to: new Float32Array(n * 3),
      fromScale: new Float32Array(n),
      toScale: new Float32Array(n),
      startedAt: 0,
      palette,
      dirty: true,
    };

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      camera.position.sub(controls.target).setLength(fittedDistance(camera.aspect)).add(controls.target);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    // Hover and click both find the dot under the pointer.
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const hit = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
      const found = raycaster.intersectObject(dots, false)[0];
      if (found?.instanceId === undefined) return null;
      // A hidden dot has zero scale, so it can never be hit.
      return found.instanceId;
    };
    let hovered = -1;
    let pressed: { x: number; y: number } | null = null;
    const onMove = (event: PointerEvent) => {
      if (pressed) return;
      const index = hit(event) ?? -1;
      renderer.domElement.style.cursor = index >= 0 ? 'pointer' : 'grab';
      if (index === hovered) return;
      hovered = index;
      setHover(index >= 0 ? index : null);
    };
    const onLeave = () => {
      hovered = -1;
      setHover(null);
    };
    const onDown = (event: PointerEvent) => {
      pressed = { x: event.clientX, y: event.clientY };
    };
    const onUp = (event: PointerEvent) => {
      const start = pressed;
      pressed = null;
      if (!start) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > CLICK_SLOP) return;
      const index = hit(event);
      const s = index === null ? undefined : live.current.standings[index];
      if (s) live.current.onOpen({ id: s.catalogId, guid: s.guid, name: s.name });
    };
    const canvas = renderer.domElement;
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);

    // The render loop: move the dots, then place the HTML labels over them.
    const matrix = new THREE.Matrix4();
    const point = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scaleVector = new THREE.Vector3();
    const project = (x: number, y: number, z: number) => {
      point.set(x, y, z).project(camera);
      const { width, height } = renderer.domElement.getBoundingClientRect();
      return {
        x: (point.x * 0.5 + 0.5) * width,
        y: (-point.y * 0.5 + 0.5) * height,
        visible: point.z < 1,
      };
    };
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const s = scene.current;
      if (!s) return;
      controls.update();

      const elapsed = now - s.startedAt;
      const moving = elapsed < MOVE_MS || s.dirty;
      if (moving) {
        const t = live.current.reducedMotion ? 1 : Math.min(1, elapsed / MOVE_MS);
        const ease = 1 - Math.pow(1 - t, 3);
        for (let v = 0; v < n; v++) {
          const i = v * 3;
          point.set(
            s.from[i] + (s.to[i] - s.from[i]) * ease,
            s.from[i + 1] + (s.to[i + 1] - s.from[i + 1]) * ease,
            s.from[i + 2] + (s.to[i + 2] - s.from[i + 2]) * ease
          );
          const k = s.fromScale[v] + (s.toScale[v] - s.fromScale[v]) * ease;
          scaleVector.setScalar(Math.max(k, 0.0001));
          matrix.compose(point, quaternion, scaleVector);
          dots.setMatrixAt(v, matrix);
        }
        dots.instanceMatrix.needsUpdate = true;
        dots.computeBoundingSphere();
        s.dirty = false;
      }

      // Axis labels.
      const labels = labelsRef.current?.children;
      if (labels) {
        for (const el of Array.from(labels) as HTMLElement[]) {
          const [x, y, z] = (el.dataset.at ?? '0,0,0').split(',').map(Number);
          const p = project(x, y, z);
          el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
          el.style.visibility = p.visible ? 'visible' : 'hidden';
        }
      }

      // The picked visuals' logos ride on top of their dots.
      const logos = logosRef.current?.children;
      if (logos) {
        for (const el of Array.from(logos) as HTMLElement[]) {
          const v = Number(el.dataset.index);
          const i = v * 3;
          const t = live.current.reducedMotion ? 1 : Math.min(1, elapsed / MOVE_MS);
          const ease = 1 - Math.pow(1 - t, 3);
          const x = s.from[i] + (s.to[i] - s.from[i]) * ease;
          const y = s.from[i + 1] + (s.to[i + 1] - s.from[i + 1]) * ease;
          const z = s.from[i + 2] + (s.to[i + 2] - s.from[i + 2]) * ease;
          const k = s.toScale[v];
          const p = project(x, y, z);
          el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
          el.style.visibility = p.visible && k > 0 ? 'visible' : 'hidden';
          el.style.zIndex = String(Math.round((1 - point.z) * 10000));
        }
      }

      // The hover card follows its dot while the view turns.
      const card = hostRef.current?.querySelector<HTMLElement>('[data-hover-card]');
      if (card) {
        const v = Number(card.dataset.index);
        const i = v * 3;
        const p = project(s.to[i], s.to[i + 1], s.to[i + 2]);
        const { width } = renderer.domElement.getBoundingClientRect();
        const left = Math.min(Math.max(p.x + 14, 8), width - card.offsetWidth - 8);
        const top = Math.max(p.y - card.offsetHeight - 10, 8);
        card.style.transform = `translate(${left}px, ${top}px)`;
      }

      renderer.render(three, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      controls.dispose();
      three.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      renderer.dispose();
      canvas.remove();
      scene.current = null;
    };
    // The scene is built once per replay; later props flow in through `live`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replay]);

  // A new week or a new set of picks sets where every dot is heading.
  useEffect(() => {
    const s = scene.current;
    if (!s) return;
    const n = replay.guids.length;
    const f = replay.frames[at];
    const prev = at > 0 ? replay.frames[at - 1] : null;
    const arrived = new Set(f.arrived);
    const picked = new Set(picks);
    const following = picked.size > 0;
    const palette = readPalette();
    s.palette = palette;

    // Start each move from wherever the dot is drawn right now.
    const elapsed = performance.now() - s.startedAt;
    const t = reducedMotion ? 1 : Math.min(1, elapsed / MOVE_MS);
    const ease = 1 - Math.pow(1 - t, 3);
    const target = new THREE.Vector3();
    for (let v = 0; v < n; v++) {
      const i = v * 3;
      for (let a = 0; a < 3; a++) s.from[i + a] = s.from[i + a] + (s.to[i + a] - s.from[i + a]) * ease;
      s.fromScale[v] = s.fromScale[v] + (s.toScale[v] - s.fromScale[v]) * ease;

      place(replay, at, v, target);
      const listed = !Number.isNaN(f.scores[v]);
      const known = !Number.isNaN(target.x);
      if (known) {
        s.to[i] = target.x;
        s.to[i + 1] = target.y;
        s.to[i + 2] = target.z;
      }
      // A dot that has never been drawn starts where it is going.
      for (let a = 0; a < 3; a++) {
        if (Number.isNaN(s.from[i + a])) s.from[i + a] = s.to[i + a];
      }
      const rated = f.raters[v] > 0;
      const shown = listed && (following ? picked.has(v) : showUnrated || rated);
      s.toScale[v] = shown ? (following ? 1.9 : arrived.has(v) ? 1.6 : 1) : 0;

      const before = prev ? prev.scores[v] : NaN;
      const delta = listed && !Number.isNaN(before) ? f.scores[v] - before : 0;
      s.dots.setColorAt(
        v,
        arrived.has(v)
          ? palette.gold
          : delta > 0.0005
            ? palette.up
            : delta < -0.0005
              ? palette.down
              : palette.still
      );
    }
    if (s.dots.instanceColor) s.dots.instanceColor.needsUpdate = true;
    s.startedAt = performance.now();
    s.dirty = true;

    // Each picked visual leaves a trail of where it has been.
    for (const child of [...s.trails.children]) {
      const line = child as THREE.Line;
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
      s.trails.remove(line);
    }
    const stride = Math.max(1, Math.ceil((at + 1) / TRAIL_POINTS_MAX));
    for (const v of picks) {
      const points: THREE.Vector3[] = [];
      for (let w = 0; w <= at; w += stride) {
        if (Number.isNaN(replay.frames[w].scores[v])) continue;
        points.push(place(replay, w, v, new THREE.Vector3()));
      }
      if (!Number.isNaN(f.scores[v])) points.push(place(replay, at, v, new THREE.Vector3()));
      if (points.length < 2) continue;
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: palette.gold, transparent: true, opacity: 0.8 })
      );
      s.trails.add(line);
    }
  }, [replay, at, picks, showUnrated, reducedMotion]);

  useEffect(() => {
    const s = scene.current;
    if (!s || resetSignal === 0) return;
    s.camera.position.copy(CAMERA_HOME).multiplyScalar(fittedDistance(s.camera.aspect)).add(TARGET);
    s.controls.target.copy(TARGET);
    s.controls.update();
  }, [resetSignal]);

  const frame = replay.frames[at];
  const hovered = hover === null ? undefined : standings[hover];
  const hoveredScore = hover === null ? NaN : frame.scores[hover];
  const hoveredRaters = hover === null ? NaN : frame.raters[hover];
  const hoveredStars = hover === null ? NaN : frame.stars[hover];

  // Labels sit just outside the cube's front-bottom edges.
  const E = SIZE + 0.7;
  const labels: { key: string; at: [number, number, number]; text: string; strong?: boolean }[] = [
    ...RATER_TICKS.map((t) => ({
      key: `x${t}`,
      at: [xOf(t), -SIZE, E] as [number, number, number],
      text: formatInt(t),
    })),
    { key: 'xt', at: [0, -SIZE - 1.1, E + 0.6], text: 'Ratings', strong: true },
    ...POPULARITY_TICKS.map((t) => ({
      key: `y${t}`,
      at: [-E, yOf(t / 100), E] as [number, number, number],
      text: String(t),
    })),
    { key: 'yt', at: [-E - 0.4, SIZE + 1, E], text: 'Popularity', strong: true },
    ...Z_TICKS.map((t) => ({
      key: `z${t}`,
      at: [E, -SIZE, (t / 2) * SIZE] as [number, number, number],
      text: t === 0 ? '3★' : `${t + 3}★`,
    })),
    { key: 'zt', at: [E + 1.4, -SIZE - 0.6, 0], text: 'Average stars', strong: true },
  ];

  return (
    <div
      ref={hostRef}
      className="relative h-[340px] cursor-grab select-none overflow-hidden rounded-2xl border border-border bg-muted/40 sm:h-[480px]"
    >
      <div ref={labelsRef} aria-hidden className="pointer-events-none absolute inset-0">
        {labels.map((l) => (
          <span
            key={l.key}
            data-at={l.at.join(',')}
            className={
              l.strong
                ? 'absolute left-0 top-0 whitespace-nowrap text-200 font-bold text-foreground'
                : 'tabular absolute left-0 top-0 whitespace-nowrap text-100 text-muted-foreground'
            }
          >
            {l.text}
          </span>
        ))}
      </div>

      <div ref={logosRef} className="pointer-events-none absolute inset-0">
        {picks.map((v) => {
          const s = standings[v];
          if (!s) return null;
          return (
            <button
              key={s.guid}
              type="button"
              data-index={v}
              onClick={() => onOpen({ id: s.catalogId, guid: s.guid, name: s.name })}
              aria-label={`Open ${s.name}`}
              className="pointer-events-auto absolute left-0 top-0 flex flex-col items-center gap-100 rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Thumb src={s.thumbnail} name={s.name} size={30} className="shadow-md" />
              <span className="max-w-[96px] truncate rounded-full bg-card/90 px-100 text-100 font-semibold">
                {s.name}
              </span>
            </button>
          );
        })}
      </div>

      {hover !== null && hovered && (
        <div
          data-hover-card
          data-index={hover}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 flex w-[240px] items-center gap-200 rounded-2xl border border-border bg-card p-200 shadow-lg"
        >
          <Thumb src={hovered.thumbnail} name={hovered.name} size={44} />
          <span className="min-w-0">
            <span className="block truncate text-300 font-bold">{hovered.name}</span>
            <span className="block text-200 text-muted-foreground">
              Popularity {Number.isNaN(hoveredScore) ? 'not listed' : formatScore(hoveredScore)}
            </span>
            <span className="block text-200 text-muted-foreground">
              {hoveredRaters > 0
                ? `${formatInt(hoveredRaters)} rating${hoveredRaters === 1 ? '' : 's'}, ${formatStars(hoveredStars)}`
                : 'No ratings yet'}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
