import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { CertifiedBadge, Thumb } from '@/components/ui';
import type { VisualRef } from '@/components/visual-drawer';
import { formatInt } from '@/lib/format';
import {
  CERTIFIED,
  growth,
  jitter,
  LISTED,
  modeStart,
  readingValues,
  sentiment,
  spanAt,
  type Replay,
  type ReplayMode,
} from '@/lib/replay';
import { describeVisual } from '@/lib/replay-lines';
import { refOf, type Who } from '@/lib/replay-who';

/**
 * The replay's field in three dimensions, in one of two modes.
 *
 * In the popularity mode, the number of ratings runs across (on a log scale,
 * since a handful of visuals hold most of the ratings), popularity runs up and
 * average stars run in depth, with 3 stars as the neutral middle. Between two
 * readings of the leaderboard each visual glides along a straight line, one day
 * at a time.
 *
 * In the listings mode, each visual floats at a place of its own, the certified
 * visuals above the others. A visual appears when it is listed, rises when it is
 * certified and grows with each new version.
 *
 * A visual that joins, becomes certified or publishes a new version shows its
 * logo for a moment, in both modes. In the popularity mode a visual that is
 * moving shows its logo too, which turns back into a dot once the move ends.
 */

/** Half the cube's width; the scene runs from -SIZE to +SIZE on every axis. */
const SIZE = 5;
const MAX_RATERS = 300;
const DOT_RADIUS = 0.09;
/** The starting angle; the distance is fitted to the view's shape. */
const CAMERA_HOME = new THREE.Vector3(0.55, 0.38, 0.74).normalize();
/**
 * The listings mode starts from lower down, so the certified visuals read as a
 * layer above the others rather than as one cloud seen from above.
 */
const LISTINGS_HOME = new THREE.Vector3(0.55, 0.17, 0.82).normalize();
const CAMERA_DISTANCE = 24;
/** The camera looks slightly below the centre, so the labels under the cube stay in frame. */
const TARGET = new THREE.Vector3(0, -2, 0);
/**
 * The listings mode has no labels under the cube, so it looks nearer the
 * centre. Seen from low down, the cube's near edge reaches further below it.
 */
const LISTINGS_TARGET = new THREE.Vector3(0, -1, 0);

function homeOf(mode: ReplayMode) {
  return mode === 'listings'
    ? { direction: LISTINGS_HOME, target: LISTINGS_TARGET }
    : { direction: CAMERA_HOME, target: TARGET };
}

/** A narrow view needs the camera further back to keep the whole cube in frame. */
function fittedDistance(aspect: number) {
  return CAMERA_DISTANCE * Math.max(1, Math.pow(1.6 / Math.max(aspect, 0.3), 0.85));
}
/** A press that travels further than this is a drag that turns the view, not a click. */
const CLICK_SLOP = 5;

const RATER_TICKS = [0, 1, 10, 100, 300];
const POPULARITY_TICKS = [0, 25, 50, 75, 100];
const Z_TICKS = [-2, -1, 0, 1, 2];

/** How much smaller a listed visual is drawn while the leaderboard has not read it yet. */
const UNSCORED_SCALE = 0.55;

/** How long the field takes to change from one mode to the other. */
const MORPH_MS = 900;
/** A move made by dragging the timeline, or by stepping one day while paused. */
const SCRUB_MS = 600;
/** A visual that is certified rises at least this slowly, however fast the replay plays. */
const EVENT_MS = 900;
/** How long a logo takes to fade into its dot, and back. */
const MIX_MS = 450;
/** How long a logo stays after its move ends. */
const LOGO_AFTER_MS = 120;
/** An event is a single moment, so its logo stays this much longer. */
const LOGO_HOLD_MS = 600;
/** With reduced motion nothing glides, so a logo simply shows for this long. */
const LOGO_REDUCED_MS = 1500;
/** The most logos shown at once, besides the followed visuals. */
const MAX_LOGOS = 16;
/**
 * In the popularity mode, the events of the day take at most this many logos
 * first, so the visuals that move most still show theirs.
 */
const EVENT_LOGOS = 8;
/** A move shorter than this, in scene units, does not show a logo. */
const LOGO_MIN_MOVE = 0.03;
/** A visual that is moving already keeps its logo over one moving slightly further. */
const LOGO_STICKY = 1.5;
/** A view at least this wide, in pixels, draws logos at full size. */
const LOGO_FULL_WIDTH = 720;
/** The smallest a logo is drawn in a narrow view, against its full size. */
const LOGO_NARROWEST = 0.6;
/** A new version makes a visual swell briefly, on top of the size its versions give it. */
const PULSE_MS = 600;
const PULSE = 0.35;
/** How far a visual floats from its place in the listings mode. */
const DRIFT = 0.14;
/** The days for which a visual that joined, or was certified, keeps that colour. */
const RECENT_DAYS = 7;
/** A rise or fall smaller than this, in scene units, leaves a visual in the neutral colour. */
const STILL = 0.005;

const LINEAR = 0;
const EASE_OUT = 1;
const EASE_IN_OUT = 2;

function eased(t: number, kind: number) {
  if (kind === EASE_OUT) return 1 - Math.pow(1 - t, 3);
  if (kind === EASE_IN_OUT) return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return t;
}

function approach(value: number, goal: number, by: number) {
  return goal > value ? Math.min(goal, value + by) : Math.max(goal, value - by);
}

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

function cssColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(value || fallback);
}

interface Palette {
  up: THREE.Color;
  down: THREE.Color;
  gold: THREE.Color;
  /** A visual that joined recently. */
  fresh: THREE.Color;
  still: THREE.Color;
}

function readPalette(): Palette {
  return {
    up: cssColor('--color-up', '#107c10'),
    down: cssColor('--color-down', '#c50f1f'),
    gold: cssColor('--color-gold', '#e3b505'),
    fresh: cssColor('--color-new', '#54b948'),
    still: cssColor('--color-muted-foreground', '#6b6458'),
  };
}

/** Where every visual can be placed, worked out once per replay. */
interface Layout {
  /**
   * Each reading's scene position of every visual (x, y and z in a row), NaN
   * for a visual that was never read. Moving in scene space rather than in
   * stars keeps a visual that gets its first rating from passing through one star.
   */
  readings: Float32Array[];
  raters: Float32Array[];
  /** The listings mode: each visual's own place, and where it floats in each band. */
  homeX: Float32Array;
  homeZ: Float32Array;
  certifiedY: Float32Array;
  otherY: Float32Array;
  /** The phase and speed, in radians per millisecond, of each visual's floating. */
  phase: Float32Array;
  speed: Float32Array;
}

function buildLayout(replay: Replay): Layout {
  const n = replay.guids.length;
  const values = {
    score: new Float32Array(n),
    raters: new Float32Array(n),
    stars: new Float32Array(n),
  };
  const readings: Float32Array[] = [];
  const raters: Float32Array[] = [];
  for (let k = 0; k < replay.readings.length; k++) {
    readingValues(replay, k, values);
    const p = new Float32Array(n * 3);
    for (let v = 0; v < n; v++) {
      const i = v * 3;
      const score = values.score[v];
      if (Number.isNaN(score)) {
        p[i] = p[i + 1] = p[i + 2] = NaN;
        continue;
      }
      p[i] = xOf(values.raters[v]);
      p[i + 1] = yOf(score);
      p[i + 2] = zOf(values.stars[v], values.raters[v]);
    }
    readings.push(p);
    raters.push(values.raters.slice());
  }
  const homeX = new Float32Array(n);
  const homeZ = new Float32Array(n);
  const certifiedY = new Float32Array(n);
  const otherY = new Float32Array(n);
  const phase = new Float32Array(n);
  const speed = new Float32Array(n);
  replay.guids.forEach((g, v) => {
    homeX[v] = (jitter(g, 'x') * 2 - 1) * SIZE * 0.92;
    homeZ[v] = (jitter(g, 'z') * 2 - 1) * SIZE * 0.92;
    // The gap between the two layers is wider than a visual's float.
    const height = jitter(g, 'y');
    certifiedY[v] = 1.4 + height * 3;
    otherY[v] = -4.4 + height * 3.2;
    phase[v] = jitter(g, 'p') * Math.PI * 2;
    // One float takes between 6 and 18 seconds.
    speed[v] = (Math.PI * 2) / (6000 + jitter(g, 's') * 12000);
  });
  return { readings, raters, homeX, homeZ, certifiedY, otherY, phase, speed };
}

export interface Replay3DProps {
  replay: Replay;
  mode: ReplayMode;
  at: number;
  /** How long one day lasts while the replay plays, in milliseconds. */
  stepMs: number;
  playing: boolean;
  /** Each visual's name and logo, indexed like `Replay.guids`. */
  who: (Who | undefined)[];
  /** Indexes of the visuals to follow. When any are picked, only they are drawn. */
  picks: number[];
  /** Whether visuals nobody has rated yet are drawn in the popularity mode. Followed visuals are always drawn. */
  showUnrated: boolean;
  /** Whether only certified visuals are drawn. Followed visuals are always drawn. */
  certifiedOnly: boolean;
  /** Changes whenever the camera should return to its starting angle. */
  resetSignal: number;
  reducedMotion: boolean;
  onOpen: (v: VisualRef) => void;
  /** Called once when the browser cannot draw 3D, so the page can fall back to the flat view. */
  onUnsupported: () => void;
}

interface Scene {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  dots: THREE.InstancedMesh;
  trails: THREE.Group;
  /** The objects only one mode draws. */
  scoreParts: THREE.Object3D[];
  listingParts: THREE.Object3D[];
  palette: Palette;
  /** Each visual's move: where it started and where it is heading, and when and how. */
  from: Float32Array;
  to: Float32Array;
  fromScale: Float32Array;
  toScale: Float32Array;
  startedAt: Float64Array;
  duration: Float32Array;
  ease: Uint8Array;
  /** Where each visual is drawn now, before it floats. */
  cur: Float32Array;
  curScale: Float32Array;
  /** The size its new versions give each visual, which its logo shares. */
  grow: Float32Array;
  /** How far each visual has turned from a dot into its logo, 0 to 1. */
  mix: Float32Array;
  logoUntil: Float64Array;
  pulseAt: Float64Array;
  picked: Uint8Array;
  /** The visuals besides the followed ones whose logo is drawn. */
  active: Set<number>;
  logosChanged: boolean;
  /** When the last move and the last swell end. */
  busyUntil: number;
  pulseUntil: number;
  /** How much the visuals float, 0 in the popularity mode and 1 in the listings mode. */
  drift: number;
  /** The camera's turn to a mode's starting angle, while it lasts. */
  glide: Glide | null;
  lastAt: number;
  lastMode: ReplayMode | null;
}

interface Glide {
  fromOffset: THREE.Vector3;
  toOffset: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  startedAt: number;
}

/** Turns the camera to a mode's starting angle, gliding there from `now` unless `glide` is false. */
function aimCamera(s: Scene, mode: ReplayMode, now: number, glide: boolean) {
  const home = homeOf(mode);
  const toOffset = home.direction.clone().multiplyScalar(fittedDistance(s.camera.aspect));
  if (!glide) {
    s.glide = null;
    s.controls.target.copy(home.target);
    s.camera.position.copy(home.target).add(toOffset);
    s.controls.update();
    return;
  }
  s.glide = {
    fromOffset: s.camera.position.clone().sub(s.controls.target),
    toOffset,
    fromTarget: s.controls.target.clone(),
    toTarget: home.target.clone(),
    startedAt: now,
  };
}

const offset = new THREE.Vector3();

/** Moves the camera along its glide, which ends after the same time the field takes to change. */
function glideCamera(s: Scene, now: number) {
  const g = s.glide;
  if (!g) return;
  const t = Math.min(1, Math.max(0, (now - g.startedAt) / MORPH_MS));
  const e = eased(t, EASE_IN_OUT);
  const from = g.fromOffset.length();
  const length = from + (g.toOffset.length() - from) * e;
  s.controls.target.lerpVectors(g.fromTarget, g.toTarget, e);
  // Turning the direction rather than sliding the position keeps the distance
  // from shrinking halfway through.
  offset.lerpVectors(g.fromOffset, g.toOffset, e).setLength(length);
  s.camera.position.copy(s.controls.target).add(offset);
  if (t >= 1) s.glide = null;
}

/** Where visual `v` is drawn at time `now`, into `s.cur` and `s.curScale`. */
function sample(s: Scene, v: number, now: number) {
  const i = v * 3;
  const duration = s.duration[v];
  const t = duration > 0 ? Math.min(1, Math.max(0, (now - s.startedAt[v]) / duration)) : 1;
  const e = eased(t, s.ease[v]);
  s.cur[i] = s.from[i] + (s.to[i] - s.from[i]) * e;
  s.cur[i + 1] = s.from[i + 1] + (s.to[i + 1] - s.from[i + 1]) * e;
  s.cur[i + 2] = s.from[i + 2] + (s.to[i + 2] - s.from[i + 2]) * e;
  s.curScale[v] = s.fromScale[v] + (s.toScale[v] - s.fromScale[v]) * e;
}

/** Shows or hides the objects only one mode draws. */
function showParts(parts: THREE.Object3D[], visible: boolean) {
  for (const part of parts) part.visible = visible;
}

function pulseOf(s: Scene, v: number, now: number) {
  const p = now - s.pulseAt[v];
  return p >= 0 && p < PULSE_MS ? 1 + PULSE * Math.sin((Math.PI * p) / PULSE_MS) : 1;
}

export default function Replay3D({
  replay,
  mode,
  at,
  stepMs,
  playing,
  who,
  picks,
  showUnrated,
  certifiedOnly,
  resetSignal,
  reducedMotion,
  onOpen,
  onUnsupported,
}: Replay3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [logos, setLogos] = useState<number[]>([]);
  const layout = useMemo(() => buildLayout(replay), [replay]);

  // Everything the render loop reads lives in one ref, so a new day or a new
  // pick changes the scene without tearing down the renderer.
  const live = useRef({ replay, mode, who, reducedMotion, onOpen, layout });
  useLayoutEffect(() => {
    live.current = { replay, mode, who, reducedMotion, onOpen, layout };
  });

  const scene = useRef<Scene | null>(null);

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
    const n = replay.guids.length;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';
    host.prepend(renderer.domElement);

    const three = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    const home = homeOf(live.current.mode);
    camera.position.copy(home.direction).multiplyScalar(CAMERA_DISTANCE).add(home.target);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 60;
    controls.target.copy(home.target);
    // Turning the view by hand stops the camera's glide to a mode's angle.
    controls.addEventListener('start', () => {
      if (scene.current) scene.current.glide = null;
    });

    three.add(new THREE.AmbientLight(0xffffff, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(6, 12, 8);
    three.add(sun);

    const palette = readPalette();

    // The cube's edges, which both modes draw.
    three.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(2 * SIZE, 2 * SIZE, 2 * SIZE)),
        new THREE.LineBasicMaterial({ color: palette.still, transparent: true, opacity: 0.35 })
      )
    );
    // The popularity mode's floor grid and neutral 3-star plane.
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
    // The listings mode's floor between the certified visuals and the others.
    const divider = new THREE.Mesh(
      new THREE.PlaneGeometry(2 * SIZE, 2 * SIZE),
      new THREE.MeshBasicMaterial({
        color: palette.gold,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    divider.rotation.x = -Math.PI / 2;
    divider.position.y = 0.1;
    divider.visible = false;
    three.add(divider);

    const dots = new THREE.InstancedMesh(
      new THREE.SphereGeometry(DOT_RADIUS, 14, 10),
      new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05 }),
      n
    );
    dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // Every visual stays inside the cube, so one fixed sphere bounds them all
    // and nothing is measured again on each move.
    dots.boundingSphere = new THREE.Sphere(new THREE.Vector3(), SIZE * 2.1);
    dots.frustumCulled = false;
    const hidden = new THREE.Matrix4().makeScale(0.0001, 0.0001, 0.0001);
    for (let v = 0; v < n; v++) {
      dots.setColorAt(v, palette.still);
      dots.setMatrixAt(v, hidden);
    }
    three.add(dots);

    const trails = new THREE.Group();
    three.add(trails);

    scene.current = {
      renderer,
      camera,
      controls,
      dots,
      trails,
      scoreParts: [grid, neutral],
      listingParts: [divider],
      palette,
      from: new Float32Array(n * 3),
      to: new Float32Array(n * 3),
      fromScale: new Float32Array(n),
      toScale: new Float32Array(n),
      startedAt: new Float64Array(n),
      duration: new Float32Array(n),
      ease: new Uint8Array(n),
      cur: new Float32Array(n * 3),
      curScale: new Float32Array(n),
      grow: new Float32Array(n).fill(1),
      mix: new Float32Array(n),
      logoUntil: new Float64Array(n),
      pulseAt: new Float64Array(n).fill(-Infinity),
      picked: new Uint8Array(n),
      active: new Set(),
      logosChanged: false,
      busyUntil: 0,
      pulseUntil: 0,
      drift: 0,
      glide: null,
      lastAt: -1,
      lastMode: null,
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
      // A hidden dot, or one showing its logo, has almost no size, so it is never hit.
      return found?.instanceId ?? null;
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
      const w = index === null ? undefined : live.current.who[index];
      if (w) live.current.onOpen(refOf(w));
    };
    const canvas = renderer.domElement;
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);

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
        depth: point.z,
        visible: point.z < 1,
      };
    };
    // Where a visual is drawn, floating included.
    const drawn = (s: Scene, v: number, now: number, out: THREE.Vector3) => {
      const i = v * 3;
      out.set(s.cur[i], s.cur[i + 1], s.cur[i + 2]);
      if (s.drift > 0) {
        const { phase, speed } = live.current.layout;
        const a = now * speed[v] + phase[v];
        const d = DRIFT * s.drift;
        out.x += d * Math.sin(a);
        out.y += d * Math.sin(a * 1.3 + phase[v] * 1.7);
        out.z += d * Math.sin(a * 0.8 + phase[v] * 2.3);
      }
      return out;
    };
    const place = new THREE.Vector3();

    // The render loop: move the dots and logos, then place the HTML labels over them.
    let raf = 0;
    let before = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const s = scene.current;
      if (!s) return;
      const dt = Math.min(100, Math.max(0, now - before));
      before = now;
      const { mode: showing, reducedMotion: still } = live.current;
      glideCamera(s, now);
      controls.update();

      const floats = showing === 'listings' && !still ? 1 : 0;
      if (s.drift !== floats) s.drift = still ? floats : approach(s.drift, floats, dt / MORPH_MS);

      // A dot turns into its logo while it moves, and back once it stops.
      let mixing = false;
      for (let v = 0; v < n; v++) {
        const goal = s.picked[v] === 1 || now < s.logoUntil[v] ? 1 : 0;
        if (s.mix[v] === goal) continue;
        s.mix[v] = still ? goal : approach(s.mix[v], goal, dt / MIX_MS);
        mixing = true;
      }
      for (const v of s.active) {
        if (s.mix[v] === 0 && now >= s.logoUntil[v]) {
          s.active.delete(v);
          s.logosChanged = true;
        }
      }
      if (s.logosChanged) {
        s.logosChanged = false;
        setLogos([...s.active]);
      }

      const moving =
        now < s.busyUntil + 50 || now < s.pulseUntil + 50 || mixing || s.drift > 0;
      if (moving) {
        for (let v = 0; v < n; v++) {
          sample(s, v, now);
          const k = s.curScale[v] * pulseOf(s, v, now) * (1 - s.mix[v]);
          scaleVector.setScalar(Math.max(k, 0.0001));
          matrix.compose(drawn(s, v, now, place), quaternion, scaleVector);
          dots.setMatrixAt(v, matrix);
        }
        dots.instanceMatrix.needsUpdate = true;
        // Each trail ends where its visual is drawn now.
        for (const child of s.trails.children) {
          const line = child as THREE.Line;
          const v = line.userData.index as number;
          const attribute = line.geometry.getAttribute('position') as THREE.BufferAttribute;
          const i = v * 3;
          attribute.setXYZ(attribute.count - 1, s.cur[i], s.cur[i + 1], s.cur[i + 2]);
          attribute.needsUpdate = true;
        }
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

      // Logos ride where their dots would be.
      const marks = logosRef.current?.children;
      if (marks) {
        // A narrow view draws the cube smaller, and the logos of moving visuals
        // shrink with it so a few of them do not cover the field. A followed
        // visual keeps its size, because its name is written under its logo.
        const narrow = Math.min(1, Math.max(LOGO_NARROWEST, canvas.clientWidth / LOGO_FULL_WIDTH));
        for (const el of Array.from(marks) as HTMLElement[]) {
          const v = Number(el.dataset.index);
          const mix = s.mix[v];
          drawn(s, v, now, place);
          const p = project(place.x, place.y, place.z);
          if (!p.visible || s.toScale[v] <= 0 || mix <= 0.001) {
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
            continue;
          }
          const followed = el.dataset.pick === 'true';
          const size =
            (0.6 + 0.4 * mix) * (1 + (s.grow[v] - 1) * 0.6) * (followed ? 1 : narrow);
          // A followed visual's logo is centred on its place with its name below.
          const lift = followed ? '-15px' : '-50%';
          el.style.visibility = 'visible';
          el.style.opacity = String(mix);
          el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, ${lift}) scale(${size})`;
          el.style.zIndex = String(Math.round((1 - p.depth) * 10000));
          el.style.pointerEvents = mix > 0.5 ? 'auto' : 'none';
        }
      }

      // The hover card follows its visual while the view turns.
      const card = hostRef.current?.querySelector<HTMLElement>('[data-hover-card]');
      if (card) {
        drawn(s, Number(card.dataset.index), now, place);
        const p = project(place.x, place.y, place.z);
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

  // A new day, mode or set of picks sets where every visual is heading.
  useEffect(() => {
    const s = scene.current;
    const frame = replay.frames[at];
    if (!s || !frame) return;
    const now = performance.now();
    const n = replay.guids.length;
    const scores = mode === 'scores';
    const since = modeStart(replay, mode);
    const morph = s.lastMode !== null && s.lastMode !== mode;
    const step = !morph && at === s.lastAt + 1;

    let duration: number;
    let kind: number;
    if (reducedMotion) {
      duration = 0;
      kind = LINEAR;
    } else if (morph) {
      duration = MORPH_MS;
      kind = EASE_IN_OUT;
    } else if (step && scores && playing) {
      // A little longer than the day, so a timer that fires late never leaves
      // the field standing still between two days.
      duration = stepMs * 1.1;
      kind = LINEAR;
    } else if (step && !scores) {
      duration = Math.max(playing ? stepMs : 0, EVENT_MS);
      kind = EASE_IN_OUT;
    } else {
      duration = SCRUB_MS;
      kind = EASE_OUT;
    }

    showParts(s.scoreParts, scores);
    showParts(s.listingParts, !scores);
    // Each mode has its own starting angle, and the camera turns to it with the field.
    if (morph) aimCamera(s, mode, now, !reducedMotion);

    const span = spanAt(replay, at);
    const A = scores && span.from >= 0 ? layout.readings[span.from] : null;
    const B = scores && span.from >= 0 ? layout.readings[span.to] : null;
    const RA = scores && span.from >= 0 ? layout.raters[span.from] : null;
    const RB = scores && span.from >= 0 ? layout.raters[span.to] : null;
    const reading = replay.readings[frame.reading];
    const recent = replay.frames[Math.max(0, at - RECENT_DAYS)];
    // The colour of a visual in the popularity mode says which way the day that
    // ends here moved it: the stretch between the two readings around that day.
    const k = at > 0 ? replay.frames[at - 1].reading : -1;
    const dayA = scores && k >= 0 && k + 1 < layout.readings.length ? layout.readings[k] : null;
    const dayB = dayA ? layout.readings[k + 1] : null;

    const following = picks.length > 0;
    s.picked.fill(0);
    for (const v of picks) s.picked[v] = 1;
    const palette = readPalette();
    s.palette = palette;
    const versioned = new Set(frame.versioned);
    const candidates: { v: number; d: number }[] = [];

    for (let v = 0; v < n; v++) {
      const i = v * 3;
      sample(s, v, now);
      const state = frame.state[v];
      const listed = (state & LISTED) !== 0;
      const certified = (state & CERTIFIED) !== 0;
      const picked = s.picked[v] === 1;
      let tx: number;
      let ty: number;
      let tz: number;
      let shown: boolean;
      let scale: number;
      if (scores) {
        const grow = growth(replay, at, since, v);
        s.grow[v] = grow;
        if (!A || !B || !RA || !RB || Number.isNaN(A[i])) {
          // Never read, so it has no place on the axes.
          tx = s.to[i];
          ty = s.to[i + 1];
          tz = s.to[i + 2];
          shown = false;
        } else {
          const f = span.f;
          tx = A[i] + (B[i] - A[i]) * f;
          ty = A[i + 1] + (B[i + 1] - A[i + 1]) * f;
          tz = A[i + 2] + (B[i + 2] - A[i + 2]) * f;
          const rated = RA[v] + (RB[v] - RA[v]) * f > 0;
          shown =
            listed &&
            (following ? picked : (showUnrated || rated) && (!certifiedOnly || certified));
        }
        const unread = !reading || reading.readOn[v] < 0;
        scale = shown ? grow * (unread ? UNSCORED_SCALE : 1) : 0;
      } else {
        const grow = growth(replay, at, 0, v);
        s.grow[v] = grow;
        tx = layout.homeX[v];
        ty = certified ? layout.certifiedY[v] : layout.otherY[v];
        tz = layout.homeZ[v];
        shown = listed && (following ? picked : !certifiedOnly || certified);
        scale = shown ? grow : 0;
      }

      const joined = at > 0 && listed && (recent.state[v] & LISTED) === 0;
      let colour = palette.still;
      if (joined) colour = palette.fresh;
      else if (dayA && dayB) {
        const rise = dayB[i + 1] - dayA[i + 1];
        if (rise > STILL) colour = palette.up;
        else if (rise < -STILL) colour = palette.down;
      } else if (!scores && certified && (recent.state[v] & CERTIFIED) === 0) colour = palette.gold;
      s.dots.setColorAt(v, colour);

      // A new version makes a visual swell for a moment, in both modes.
      if (step && !reducedMotion && shown && versioned.has(v)) {
        s.pulseAt[v] = now;
        s.pulseUntil = now + PULSE_MS;
      }

      if (tx === s.to[i] && ty === s.to[i + 1] && tz === s.to[i + 2] && scale === s.toScale[v]) {
        continue;
      }
      if (scores && !morph && shown && !picked && s.curScale[v] >= 0.01) {
        const d = Math.hypot(tx - s.cur[i], ty - s.cur[i + 1], tz - s.cur[i + 2]);
        if (d >= LOGO_MIN_MOVE) {
          candidates.push({ v, d: s.logoUntil[v] > now ? d * LOGO_STICKY : d });
        }
      }
      // A visual that is not drawn yet appears where it is heading.
      const appears = s.curScale[v] < 0.01;
      s.from[i] = appears ? tx : s.cur[i];
      s.from[i + 1] = appears ? ty : s.cur[i + 1];
      s.from[i + 2] = appears ? tz : s.cur[i + 2];
      s.fromScale[v] = s.curScale[v];
      s.to[i] = tx;
      s.to[i + 1] = ty;
      s.to[i + 2] = tz;
      s.toScale[v] = scale;
      s.startedAt[v] = now;
      s.duration[v] = duration;
      s.ease[v] = kind;
    }
    if (s.dots.instanceColor) s.dots.instanceColor.needsUpdate = true;
    s.busyUntil = Math.max(s.busyUntil, now + duration);

    // Which visuals show their logo.
    const hold = reducedMotion ? LOGO_REDUCED_MS : duration + LOGO_AFTER_MS;
    const show = (v: number, until: number) => {
      s.logoUntil[v] = Math.max(s.logoUntil[v], until);
      if (!s.active.has(v)) {
        s.active.add(v);
        s.logosChanged = true;
      }
    };
    // A certification first, then an arrival, then a new version. A visual
    // that leaves simply fades.
    const events: number[] = [];
    if (step && !morph) {
      const seen = new Set<number>();
      for (const v of [...frame.certified, ...frame.arrived, ...frame.versioned]) {
        if (seen.has(v) || s.picked[v] === 1 || s.toScale[v] <= 0) continue;
        seen.add(v);
        events.push(v);
      }
    }
    const eventUntil = now + hold + (reducedMotion ? 0 : LOGO_HOLD_MS);
    if (morph) {
      // Every visual moves when the mode changes, so none is singled out.
      s.logoUntil.fill(0);
    } else if (scores) {
      // The day's events and the visuals that moved most share the logos, and
      // either takes the room the other leaves.
      candidates.sort((a, b) => b.d - a.d);
      const first = events.slice(0, EVENT_LOGOS);
      const chosen = new Set(first);
      for (const c of candidates) {
        if (chosen.size >= MAX_LOGOS) break;
        chosen.add(c.v);
      }
      for (const v of events.slice(EVENT_LOGOS)) {
        if (chosen.size >= MAX_LOGOS) break;
        chosen.add(v);
      }
      const isEvent = new Set(events);
      for (const v of chosen) show(v, isEvent.has(v) ? eventUntil : now + hold);
    } else {
      for (const v of events) show(v, eventUntil);
    }
    // Too many logos at once hide the field, so the oldest give way.
    const showing = [...s.active].filter((v) => s.logoUntil[v] > now && s.picked[v] !== 1);
    if (showing.length > MAX_LOGOS) {
      showing.sort((a, b) => s.logoUntil[a] - s.logoUntil[b]);
      for (const v of showing.slice(0, showing.length - MAX_LOGOS)) s.logoUntil[v] = now;
    }

    // Each followed visual leaves a trail through its readings in the popularity mode.
    for (const child of [...s.trails.children]) {
      const line = child as THREE.Line;
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
      s.trails.remove(line);
    }
    if (scores && span.from >= 0) {
      for (const v of picks) {
        const i = v * 3;
        const points: number[] = [];
        for (let r = 0; r <= span.from; r++) {
          if (replay.readings[r].readOn[v] < 0) continue;
          const p = layout.readings[r];
          if (Number.isNaN(p[i])) continue;
          points.push(p[i], p[i + 1], p[i + 2]);
        }
        if (points.length === 0) continue;
        // The last point follows the visual, and the render loop moves it.
        points.push(s.cur[i], s.cur[i + 1], s.cur[i + 2]);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        const line = new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color: palette.gold, transparent: true, opacity: 0.8 })
        );
        line.frustumCulled = false;
        line.userData.index = v;
        s.trails.add(line);
      }
    }

    s.lastAt = at;
    s.lastMode = mode;
  }, [replay, layout, mode, at, stepMs, playing, picks, showUnrated, certifiedOnly, reducedMotion]);

  useEffect(() => {
    const s = scene.current;
    if (!s || resetSignal === 0) return;
    aimCamera(s, live.current.mode, performance.now(), false);
  }, [resetSignal]);

  const scores = mode === 'scores';
  const pickSet = new Set(picks);
  const hovered = hover === null ? undefined : who[hover];
  const { certified: hoveredCertified, lines } =
    hover !== null && hovered
      ? describeVisual(replay, mode, at, hover, hovered)
      : { certified: false, lines: [] as string[] };

  // Labels sit just outside the cube's front-bottom edges.
  const E = SIZE + 0.7;
  const labels: { key: string; at: [number, number, number]; text: string; strong?: boolean }[] =
    scores
      ? [
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
        ]
      : [
          { key: 'certified', at: [-E, 2.9, E], text: 'Certified', strong: true },
          { key: 'other', at: [-E, -2.8, E], text: 'Not certified', strong: true },
        ];

  return (
    <div
      ref={hostRef}
      className="relative isolate h-full cursor-grab select-none overflow-hidden rounded-2xl border border-border bg-muted/40"
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
        {/* The logos of moving visuals repeat what the dots show, so screen readers skip them. */}
        {logos
          .filter((v) => !pickSet.has(v))
          .map((v) => {
            const w = who[v];
            if (!w) return null;
            return (
              <span
                key={w.guid}
                data-index={v}
                aria-hidden
                onPointerEnter={() => setHover(v)}
                onPointerLeave={() => setHover(null)}
                onClick={() => onOpen(refOf(w))}
                className="absolute left-0 top-0 cursor-pointer"
                style={{ opacity: 0, visibility: 'hidden' }}
              >
                <Thumb src={w.thumbnail} name={w.name} size={28} className="shadow-md" />
              </span>
            );
          })}
        {picks.map((v) => {
          const w = who[v];
          if (!w) return null;
          return (
            <button
              key={w.guid}
              type="button"
              data-index={v}
              data-pick="true"
              onClick={() => onOpen(refOf(w))}
              onPointerEnter={() => setHover(v)}
              onPointerLeave={() => setHover(null)}
              aria-label={`Open ${w.name}`}
              className="absolute left-0 top-0 flex flex-col items-center gap-100 rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
              style={{ opacity: 0, visibility: 'hidden' }}
            >
              <Thumb src={w.thumbnail} name={w.name} size={30} className="shadow-md" />
              <span className="max-w-[96px] truncate rounded-full bg-card/90 px-100 text-100 font-semibold">
                {w.name}
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
          className="pointer-events-none absolute left-0 top-0 z-[20000] flex w-[240px] items-center gap-200 rounded-2xl border border-border bg-card p-200 shadow-lg"
        >
          <Thumb src={hovered.thumbnail} name={hovered.name} size={44} />
          <span className="min-w-0">
            <span className="block truncate text-300 font-bold">{hovered.name}</span>
            {hoveredCertified && <CertifiedBadge label />}
            {lines.map((line) => (
              <span key={line} className="block text-200 text-muted-foreground">
                {line}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}
