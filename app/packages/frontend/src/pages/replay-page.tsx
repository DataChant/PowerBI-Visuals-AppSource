import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import {
  ArrowUpDown,
  BadgeCheck,
  Gauge,
  Hash,
  Info,
  LogIn,
  LogOut,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  lazy,
  Suspense,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { EmptyState, LoadingBlock } from '@/components/states';
import { CertifiedBadge, CertifiedToggle, Segmented, Thumb } from '@/components/ui';
import type { VisualRef } from '@/components/visual-drawer';
import type { CatalogVisual } from '@/lib/catalog';
import { formatDate, formatInt, formatScore, formatScoreChange } from '@/lib/format';
import type { Standing } from '@/lib/leaderboard';
import {
  CERTIFIED,
  certifiedSince,
  comings,
  frameCounts,
  growth,
  jitter,
  lastReading,
  LISTED,
  modeStart,
  movers,
  spanAt,
  valuesAt,
  type Move,
  type Replay,
  type ReplayFrame,
  type ReplayMode,
} from '@/lib/replay';
import { describeVisual } from '@/lib/replay-lines';
import { refOf, whoOf, type Who } from '@/lib/replay-who';
import { cn } from '@/lib/utils';

/** How long one day lasts in each view until another speed is chosen. Popularity moves slowly enough to follow. */
const DEFAULT_SPEED: Record<ReplayMode, number> = { scores: 1000, listings: 250 };
const SPEEDS = [
  { ms: 2000, label: '1 day every 2 seconds' },
  { ms: 1000, label: '1 day per second' },
  { ms: 500, label: '2 days per second' },
  { ms: 250, label: '4 days per second' },
  { ms: 125, label: '8 days per second' },
  { ms: 62.5, label: '16 days per second' },
];
/** The lists beside the field look back this many days. */
const LOOKBACK_DAYS = 28;
/** A visual is coloured as new, or as newly certified, for this many days. */
const RECENT_DAYS = 7;
/** The climbing and sliding lists show as many rows as their panel has room for, within these bounds. */
const MIN_MOVERS = 3;
const MAX_MOVERS = 8;
const MOVER_ROW = 36;
/** The height the movers panel spends on its caption, its two titles and the gaps between them. */
const MOVERS_CHROME = 88;
/** The extra height a third list's title takes. */
const THIRD_TITLE = 32;
/** The least height the player takes, on a screen too short to fit it. */
const MIN_PLAYER = 260;
/** The space kept between the player and the bottom of the window. */
const BOTTOM_GAP = 12;
/** Bounds on the certified lane's share of the field's height, which otherwise follows its share of visuals. */
const MIN_LANE = 0.25;
const MAX_LANE = 0.6;
const DOT = 8;
const PAD = 12;
/** How many visuals can be followed at once. */
const MAX_PICKS = 10;
const SUGGESTIONS = 8;
/** How long the flat field takes to move to a day chosen on the timeline. */
const SCRUB_MS = 600;
/** In the listings view an event is a single moment, so its move takes at least this long. */
const EVENT_MS = 900;
/** How long a logo stays after its visual comes to rest, and how long it takes to fade. */
const LOGO_HOLD_MS = 600;
const MIX_MS = 450;
/** With reduced motion nothing glides, so a logo simply shows for this long. */
const LOGO_REDUCED_MS = 1500;
/** While the listings view plays, a logo stays about this long after its event. */
const LOGO_SPAN_MS = 1500;
/** The most logos the flat field shows at once, besides the followed visuals. */
const FLAT_LOGOS = 16;
const FLAT_LOGO = 20;
/** A popularity change smaller than this does not show a logo in the flat field. */
const LOGO_MIN_SHIFT = 0.003;
/** A popularity change smaller than this colours a dot as unchanged. */
const STILL = 0.00005;

// three.js is large, so the 3D view loads only when the Replay tab opens.
const Replay3D = lazy(() => import('./replay-3d'));

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

function isCertified(frame: ReplayFrame, v: number) {
  return (frame.state[v] & CERTIFIED) !== 0;
}

function isListed(frame: ReplayFrame, v: number) {
  return (frame.state[v] & LISTED) !== 0;
}

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, size] as const;
}

function fitHeight(top: number) {
  return Math.max(MIN_PLAYER, Math.floor(window.innerHeight - top - BOTTOM_GAP));
}

/**
 * The height that lets the player end at the bottom of the window, so the
 * whole replay is on screen before anybody scrolls.
 */
function useFitHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(() => fitHeight(220));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setHeight(fitHeight(el.getBoundingClientRect().top + window.scrollY));
    const first = window.requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    // The banner above can wrap or load its logo late, which moves the player.
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(document.body);
    return () => {
      window.cancelAnimationFrame(first);
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, []);
  return [ref, height] as const;
}

/**
 * Shares `budget` rows among lists one row at a time, so a short list hands the
 * rows it does not need to the longer ones. An empty list keeps one row for the
 * sentence that says so.
 */
function shareRows(lengths: number[], budget: number): number[] {
  const rows = lengths.map(() => 0);
  let left = budget - lengths.filter((l) => l === 0).length;
  let given = true;
  while (left > 0 && given) {
    given = false;
    for (let i = 0; i < lengths.length && left > 0; i++) {
      if (rows[i] < lengths[i]) {
        rows[i]++;
        left--;
        given = true;
      }
    }
  }
  return rows;
}

/**
 * The field without WebGL. The popularity view places each visual by its score
 * across; the listings view lets each float in place, certified visuals above
 * the others. A visual that moves, or that joins, becomes certified or publishes
 * a new version, shows its logo for a moment.
 */
function DotField({
  replay,
  mode,
  at,
  stepMs,
  playing,
  who,
  picks,
  showUnrated,
  certifiedOnly,
  reducedMotion,
  onOpen,
}: {
  replay: Replay;
  mode: ReplayMode;
  at: number;
  stepMs: number;
  playing: boolean;
  who: (Who | undefined)[];
  picks: number[];
  showUnrated: boolean;
  certifiedOnly: boolean;
  reducedMotion: boolean;
  onOpen: (v: VisualRef) => void;
}) {
  const [ref, { width, height }] = useSize<HTMLDivElement>();
  const picked = useMemo(() => new Set(picks), [picks]);
  const scores = mode === 'scores';
  const frame = replay.frames[at];
  const since = modeStart(replay, mode);
  const recent = replay.frames[Math.max(0, at - RECENT_DAYS)];
  const reading = replay.readings[frame.reading];
  const values = useMemo(() => valuesAt(replay, at), [replay, at]);
  const before = useMemo(() => valuesAt(replay, Math.max(0, at - 1)), [replay, at]);
  const place = useMemo(
    () =>
      replay.guids.map((g) => ({
        lane: jitter(g),
        across: jitter(g, 'x'),
        driftMs: 8000 + jitter(g, 's') * 8000,
        phase: jitter(g, 'p'),
      })),
    [replay]
  );

  // The lanes split by today's share of certified visuals, so the line holds still through the replay.
  const certifiedShare = useMemo(() => {
    const today = replay.frames[replay.frames.length - 1];
    let listed = 0;
    let certified = 0;
    for (let v = 0; v < replay.guids.length; v++) {
      if (!isListed(today, v)) continue;
      listed++;
      if (isCertified(today, v)) certified++;
    }
    return listed ? certified / listed : 0;
  }, [replay]);
  // With only certified visuals in view there is one lane, and it takes the whole field.
  const oneLane = certifiedOnly && picked.size === 0;
  const laneSplit = oneLane
    ? height
    : height * Math.min(MAX_LANE, Math.max(MIN_LANE, certifiedShare));

  const visible = useMemo(() => {
    const shown = new Uint8Array(replay.guids.length);
    for (let v = 0; v < shown.length; v++) {
      // A visual that was never read has no place on the popularity axis.
      if (scores && Number.isNaN(values.score[v])) continue;
      if (picked.size > 0) {
        if (picked.has(v)) shown[v] = 1;
        continue;
      }
      if (oneLane && !isCertified(frame, v)) continue;
      if (scores && !showUnrated && !(values.raters[v] > 0)) continue;
      shown[v] = 1;
    }
    return shown;
  }, [replay, frame, values, scores, picked, oneLane, showUnrated]);

  // The day the field showed before this one, which says what just moved.
  const [step, setStep] = useState({ at, mode, from: at });
  if (step.at !== at || step.mode !== mode) {
    // A change of view moves everything, so nothing is singled out.
    setStep({ at, mode, from: step.mode === mode ? step.at : at });
  }
  const glide = reducedMotion
    ? 0
    : scores && playing
      ? stepMs * 1.1
      : !scores && playing
        ? Math.max(stepMs, EVENT_MS)
        : SCRUB_MS;
  // The field comes to rest a moment after the day stops changing.
  const [restedAt, setRestedAt] = useState(at);
  useEffect(() => {
    const timer = window.setTimeout(
      () => setRestedAt(at),
      reducedMotion ? LOGO_REDUCED_MS : glide + LOGO_HOLD_MS
    );
    return () => window.clearTimeout(timer);
  }, [at, glide, reducedMotion]);
  const moving = restedAt !== at;

  const logos = useMemo(() => {
    const shown = new Set<number>(picks);
    if (!moving) return shown;
    const room = () => shown.size - picks.length < FLAT_LOGOS;
    const add = (v: number) => {
      if (room() && visible[v] && isListed(frame, v)) shown.add(v);
    };
    if (scores) {
      const from = valuesAt(replay, step.from);
      const moved: { v: number; d: number }[] = [];
      for (let v = 0; v < replay.guids.length; v++) {
        const d = Math.abs(values.score[v] - from.score[v]);
        if (d >= LOGO_MIN_SHIFT) moved.push({ v, d });
      }
      moved.sort((a, b) => b.d - a.d);
      for (const m of moved) add(m.v);
    } else {
      // While playing, each event keeps its logo for a moment after the day moves on.
      const floor = playing
        ? at - Math.max(1, Math.ceil(LOGO_SPAN_MS / stepMs))
        : Math.max(step.from, at - 1);
      for (let f = at; f > floor && f > 0 && room(); f--) {
        const day = replay.frames[f];
        for (const v of [...day.certified, ...day.arrived, ...day.versioned]) add(v);
      }
    }
    return shown;
  }, [moving, picks, visible, frame, scores, replay, step.from, values, playing, at, stepMs]);

  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);
  const targetOf = (event: MouseEvent<HTMLDivElement>) =>
    (event.target as HTMLElement).closest<HTMLElement>('[data-index]');
  const point = (event: MouseEvent<HTMLDivElement>) => {
    const target = targetOf(event);
    if (!target) return setHover(null);
    const box = event.currentTarget.getBoundingClientRect();
    const dot = target.getBoundingClientRect();
    setHover({ index: Number(target.dataset.index), x: dot.left - box.left, y: dot.top - box.top });
  };
  const hovered = hover ? who[hover.index] : undefined;
  const card = hover && hovered ? describeVisual(replay, mode, at, hover.index, hovered) : null;
  const open = (event: MouseEvent<HTMLDivElement>) => {
    const index = targetOf(event)?.dataset.index;
    const w = index === undefined ? undefined : who[Number(index)];
    if (w) onOpen(refOf(w));
  };
  const drift = !scores && !reducedMotion;

  return (
    <div className="flex h-full flex-col gap-100">
      {/* The dots repeat what the counts and lists say in words, so screen readers skip them. */}
      <div
        ref={ref}
        aria-hidden
        onClick={open}
        onMouseOver={point}
        onMouseLeave={() => setHover(null)}
        className="relative isolate min-h-0 flex-1 overflow-hidden rounded-2xl border border-border bg-muted/40"
      >
        <span className="absolute left-300 top-200 text-100 font-bold uppercase tracking-wide text-muted-foreground">
          Certified
        </span>
        {!oneLane && (
          <>
            <div
              className="absolute inset-x-0 border-t border-dashed border-border"
              style={{ top: laneSplit }}
            />
            <span
              className="absolute left-300 text-100 font-bold uppercase tracking-wide text-muted-foreground"
              style={{ top: laneSplit + 8 }}
            >
              Not certified
            </span>
          </>
        )}
        {width > 0 &&
          replay.guids.map((guid, v) => {
            if (!visible[v]) return null;
            const listed = isListed(frame, v);
            const certified = isCertified(frame, v);
            // Listed and not read yet: a ring, where its first reading later puts it.
            const hollow = scores && listed && (!reading || reading.readOn[v] < 0);
            const upper = oneLane || certified;
            const top = upper ? 28 : laneSplit + 28;
            const bottom = upper ? laneSplit - 8 : height - 8;
            const p = place[v];
            const x = scores
              ? PAD + values.score[v] * (width - 2 * PAD) - DOT / 2
              : PAD + p.across * Math.max(0, width - 2 * PAD - DOT);
            const y = top + p.lane * Math.max(0, bottom - top - DOT);
            const joined = at > 0 && listed && !isListed(recent, v);
            const delta = scores ? values.score[v] - before.score[v] : 0;
            const newlyCertified = !scores && listed && certified && !isCertified(recent, v);
            const tone = !listed
              ? 'border-transparent bg-muted-foreground'
              : hollow
                ? joined
                  ? 'border-gold bg-transparent'
                  : 'border-muted-foreground bg-transparent'
                : joined
                  ? 'border-transparent bg-gold'
                  : delta > STILL || newlyCertified
                    ? 'border-transparent bg-up'
                    : delta < -STILL
                      ? 'border-transparent bg-down'
                      : 'border-transparent bg-muted-foreground/45';
            const lively = joined || newlyCertified || Math.abs(delta) > STILL;
            const grow = growth(replay, at, since, v);
            const logo = listed && logos.has(v) ? who[v] : undefined;
            return (
              <span
                key={guid}
                className={cn('absolute left-0 top-0', drift && 'replay-drift')}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  transitionProperty: 'transform',
                  transitionDuration: `${glide}ms`,
                  transitionTimingFunction: scores && playing ? 'linear' : 'ease-out',
                  zIndex: logo ? 1 : undefined,
                  animationDuration: drift ? `${p.driftMs}ms` : undefined,
                  animationDelay: drift ? `${-p.phase * p.driftMs}ms` : undefined,
                }}
              >
                <span
                  data-index={v}
                  className={cn(
                    'block rounded-full border-[1.5px] transition-[transform,opacity,background-color,border-color] duration-500 ease-out',
                    // A visual that is not listed on the day shown stays drawn, unseen, so it
                    // can fade in and out, but it has nothing to show on hover.
                    listed ? 'cursor-pointer' : 'pointer-events-none',
                    tone
                  )}
                  style={{
                    width: DOT,
                    height: DOT,
                    opacity: !listed || logo ? 0 : lively ? 0.95 : hollow ? 0.75 : 0.6,
                    transform: `scale(${listed ? grow * (hollow ? 0.75 : 1) : 0.3})`,
                  }}
                />
                <AnimatePresence initial={false}>
                  {logo && (
                    <motion.span
                      key="logo"
                      data-index={v}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.4 }}
                      transition={{ duration: MIX_MS / 1000, ease: 'easeOut' }}
                      className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <Thumb
                        src={logo.thumbnail}
                        name={logo.name}
                        size={Math.round(FLAT_LOGO * (1 + (grow - 1) * 0.6))}
                        className="rounded-md shadow-sm"
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            );
          })}
        {hover && hovered && card && (
          <div
            data-hover-card
            className="pointer-events-none absolute left-0 top-0 z-10 flex w-[240px] items-center gap-200 rounded-2xl border border-border bg-card p-200 shadow-lg"
            style={{
              transform: `translate(${Math.max(4, Math.min(hover.x + 14, width - 244))}px, ${
                hover.y + 110 > height ? Math.max(4, hover.y - 102) : hover.y + 14
              }px)`,
            }}
          >
            <Thumb src={hovered.thumbnail} name={hovered.name} size={44} />
            <span className="min-w-0">
              <span className="block truncate text-300 font-bold">{hovered.name}</span>
              {card.certified && <CertifiedBadge label />}
              {card.lines.map((line) => (
                <span key={line} className="block text-200 text-muted-foreground">
                  {line}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>
      {scores && (
        <div className="relative h-[20px] text-100 text-muted-foreground" aria-hidden>
          {[0, 25, 50, 75, 100].map((tick) => (
            <span
              key={tick}
              className="tabular absolute -translate-x-1/2"
              style={{ left: `calc(${PAD}px + ${tick / 100} * (100% - ${2 * PAD}px))` }}
            >
              {tick}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-500 gap-y-100">
        {scores && (
          <p className="text-200 font-semibold text-muted-foreground" aria-hidden>
            Popularity score
          </p>
        )}
        {picked.size === 0 && (
          <Legend
            mode={mode}
            flat
            className="hidden flex-wrap justify-center gap-x-300 gap-y-100 text-100 sm:flex"
          />
        )}
      </div>
    </div>
  );
}

function Legend({
  mode,
  flat,
  className,
}: {
  mode: ReplayMode;
  flat: boolean;
  className?: string;
}) {
  const grown = { swatch: 'size-[14px] bg-muted-foreground/45', label: 'Larger after new versions' };
  const items =
    mode === 'scores'
      ? [
          { swatch: 'size-[10px] bg-up', label: 'Gaining popularity' },
          { swatch: 'size-[10px] bg-down', label: 'Losing popularity' },
          { swatch: 'size-[10px] bg-gold', label: 'Joined in the last 7 days' },
          { swatch: 'size-[10px] bg-muted-foreground/45', label: 'No change' },
          {
            // The flat field draws it as a ring, and the 3D view as a smaller dot.
            swatch: flat
              ? 'size-[10px] border-[1.5px] border-muted-foreground'
              : 'mx-[2px] size-[6px] bg-muted-foreground',
            label: 'No popularity recorded yet',
          },
          grown,
        ]
      : [
          { swatch: 'size-[10px] bg-gold', label: 'Joined in the last 7 days' },
          { swatch: 'size-[10px] bg-up', label: 'Certified in the last 7 days' },
          { swatch: 'size-[10px] bg-muted-foreground/45', label: 'Listed' },
          grown,
        ];
  return (
    <ul className={cn('text-200 text-muted-foreground', className)} aria-hidden>
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-100">
          <span className={cn('inline-block shrink-0 rounded-full', i.swatch)} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

/** One of the player's round controls. A pressed one is filled. */
function ToolButton({
  icon,
  children,
  pressed,
  label,
  onClick,
  className,
}: {
  icon: ReactNode;
  children: ReactNode;
  pressed?: boolean;
  /** The name read out and shown on hover, when it says more than the visible text. */
  label?: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-[40px] shrink-0 items-center gap-100 rounded-full border px-300 text-200 font-semibold focus-visible:outline-2 focus-visible:outline-ring',
        pressed
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card hover:bg-hover',
        className
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function Count({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <li className="inline-flex min-h-[28px] shrink-0 items-center gap-200 rounded-full border border-border bg-card px-300 text-200">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular font-heading font-bold">{value}</span>
      {hint && <span className="max-w-[220px] truncate text-muted-foreground">{hint}</span>}
    </li>
  );
}

function Race({
  title,
  icon,
  moves,
  frame,
  who,
  tone,
  empty,
  onOpen,
}: {
  title: string;
  icon: ReactNode;
  moves: Move[];
  /** The day being shown, which says whether each visual is certified. */
  frame: ReplayFrame;
  who: (Who | undefined)[];
  tone: 'up' | 'down';
  empty: string;
  onOpen: (v: VisualRef) => void;
}) {
  const largest = moves.reduce((m, x) => Math.max(m, Math.abs(x.delta)), 0) || 1;
  return (
    <section>
      <h2 className="flex h-[24px] items-center gap-100 text-300 font-bold">
        {icon}
        {title}
      </h2>
      {moves.length > 0 ? (
        <ol className="relative flex flex-col overflow-y-clip">
          {/*
            A row that is leaving steps out of the flow at once, so the list never
            outgrows its panel, and fades where it stood. The list clips it there,
            so it never shows over the title of the list below.
          */}
          <AnimatePresence initial={false} mode="popLayout">
            {moves.map((m) => {
              const w = who[m.index];
              if (!w) return null;
              return (
                <motion.li
                  key={m.guid}
                  layout
                  initial={{ opacity: 0, x: tone === 'up' ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="w-full"
                >
                  <button
                    type="button"
                    onClick={() => onOpen(refOf(w))}
                    className="flex w-full items-center gap-200 rounded-xl px-100 text-left hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                    style={{ height: MOVER_ROW }}
                  >
                    <Thumb src={w.thumbnail} name={w.name} size={24} className="rounded-lg" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-100">
                        <span className="truncate text-200 font-semibold leading-200">{w.name}</span>
                        {isCertified(frame, m.index) && <CertifiedBadge className="size-[14px]" />}
                      </span>
                      <span className="mt-[3px] block h-[4px] overflow-hidden rounded-full bg-muted">
                        <motion.span
                          className={cn('block h-full rounded-full', tone === 'up' ? 'bg-up' : 'bg-down')}
                          initial={false}
                          animate={{ width: `${(Math.abs(m.delta) / largest) * 100}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end">
                      <span
                        className={cn(
                          'tabular font-heading text-300 font-bold leading-200',
                          tone === 'up' ? 'text-up' : 'text-down'
                        )}
                      >
                        {formatScoreChange(m.delta)}
                      </span>
                      <span className="tabular text-100 leading-100 text-muted-foreground">
                        now {formatScore(m.score)}
                      </span>
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      ) : (
        <p className="px-100 py-200 text-200 leading-200 text-muted-foreground">{empty}</p>
      )}
    </section>
  );
}

/** The visuals that joined, became certified or left over the days the panel looks back on. */
function Roster({
  title,
  icon,
  visuals,
  limit,
  replay,
  at,
  who,
  empty,
  onOpen,
}: {
  title: string;
  icon: ReactNode;
  visuals: number[];
  limit: number;
  replay: Replay;
  at: number;
  who: (Who | undefined)[];
  empty: string;
  onOpen: (v: VisualRef) => void;
}) {
  const named = visuals.filter((v) => who[v]);
  const frame = replay.frames[at];
  return (
    <section>
      <h2 className="flex h-[24px] items-center gap-100 text-300 font-bold">
        {icon}
        {title}
        {named.length > 0 && (
          <span className="tabular font-normal text-muted-foreground">{formatInt(named.length)}</span>
        )}
      </h2>
      {named.length > 0 ? (
        <ol className="relative flex flex-col overflow-y-clip">
          {/* As in the climbing and sliding lists, a leaving row fades inside the list. */}
          <AnimatePresence initial={false} mode="popLayout">
            {named.slice(0, limit).map((v) => {
              const w = who[v]!;
              const read = lastReading(replay, at, v);
              return (
                <motion.li
                  key={w.guid}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="w-full"
                >
                  <button
                    type="button"
                    onClick={() => onOpen(refOf(w))}
                    className="flex w-full items-center gap-200 rounded-xl px-100 text-left hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                    style={{ height: MOVER_ROW }}
                  >
                    <Thumb src={w.thumbnail} name={w.name} size={24} className="rounded-lg" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-100">
                        <span className="truncate text-200 font-semibold leading-200">{w.name}</span>
                        {isCertified(frame, v) && <CertifiedBadge className="size-[14px]" />}
                      </span>
                      <span className="block truncate text-100 leading-100 text-muted-foreground">
                        {w.publisher}
                      </span>
                    </span>
                    {read && (
                      <span
                        className="tabular shrink-0 text-100 leading-100 text-muted-foreground"
                        title="The popularity score last read for this visual"
                      >
                        {formatScore(read.score)}
                      </span>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      ) : (
        <p className="px-100 py-200 text-200 leading-200 text-muted-foreground">{empty}</p>
      )}
    </section>
  );
}

/**
 * The lists beside the field: the climbing and sliding visuals in the
 * popularity view, and the visuals that joined, became certified or left in the
 * listings view. Beside the field on a wide screen, over it on a narrow one.
 */
function MoversPanel({
  replay,
  mode,
  at,
  who,
  include,
  onOpen,
  onClose,
}: {
  replay: Replay;
  mode: ReplayMode;
  at: number;
  who: (Who | undefined)[];
  include?: (index: number) => boolean;
  onOpen: (v: VisualRef) => void;
  onClose: () => void;
}) {
  const [ref, { height }] = useSize<HTMLElement>();
  const scores = mode === 'scores';
  const frame = replay.frames[at];
  const lookback = Math.min(LOOKBACK_DAYS, at - modeStart(replay, mode));
  const base = replay.frames[Math.max(0, at - lookback)];
  const rows = Math.max(
    MIN_MOVERS,
    Math.min(MAX_MOVERS, Math.floor((height - MOVERS_CHROME) / (2 * MOVER_ROW)))
  );
  const race = useMemo(
    () => (scores && lookback > 0 ? movers(replay, at, lookback, rows, include) : null),
    [scores, replay, at, lookback, rows, include]
  );
  const turnover = useMemo(
    () => (!scores && lookback > 0 ? comings(replay, at, lookback, include) : null),
    [scores, replay, at, lookback, include]
  );
  const raised = useMemo(
    () => (!scores && lookback > 0 ? certifiedSince(replay, at, lookback, include) : null),
    [scores, replay, at, lookback, include]
  );

  // The popularity compared with is the reading the earlier day had, which can be a few days before it.
  const thenReading = replay.readings[base?.reading ?? -1];
  const fromReading = thenReading ? replay.frames[thenReading.frame].day : null;
  const firstOnly = scores && (lookback <= 0 || (frame.reading <= 0 && base.reading === frame.reading));
  const from = formatDate(scores ? fromReading : base?.day);

  let caption: string;
  if (scores)
    caption = firstOnly
      ? `Popularity was first read on ${formatDate(replay.frames[Math.max(0, replay.firstReading)].day)}. The climbing and sliding visuals are listed here from the next reading on.`
      : `Popularity change since ${from}.`;
  else
    caption =
      lookback <= 0
        ? `The record starts on ${formatDate(frame.day)}. The visuals that join, become certified or leave are listed here from the next day on.`
        : `Visuals that joined, became certified or left since ${from}.`;

  const named = (visuals: number[] | undefined) => (visuals ?? []).filter((v) => who[v]).length;
  const budget = Math.max(
    3 * MIN_MOVERS,
    Math.min(3 * MAX_MOVERS, Math.floor((height - MOVERS_CHROME - THIRD_TITLE) / MOVER_ROW))
  );
  const [joinedRows, raisedRows, leftRows] = shareRows(
    [named(turnover?.joined), named(raised?.certified), named(turnover?.left)],
    budget
  );
  const hide = scores ? 'Hide the climbing and sliding visuals' : 'Hide the visuals that joined, became certified or left';

  return (
    <aside
      ref={ref}
      aria-label={scores ? 'Climbing and sliding visuals' : 'Visuals that joined, became certified or left'}
      className="absolute inset-0 z-20 flex flex-col gap-200 overflow-y-auto rounded-2xl border border-border bg-card p-200 lg:static lg:z-auto lg:w-[300px] lg:shrink-0"
    >
      <div className="flex min-h-[20px] items-center justify-between gap-200">
        <p className="text-200 leading-200 text-muted-foreground">{caption}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label={hide}
          className="inline-flex size-[32px] shrink-0 items-center justify-center rounded-full hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring lg:hidden"
        >
          <X className="icon-size-200" aria-hidden />
        </button>
      </div>
      {scores && race && !firstOnly && (
        <>
          <Race
            title="Climbing"
            icon={<TrendingUp className="icon-size-200 text-up" aria-hidden />}
            moves={race.climbers}
            frame={frame}
            who={who}
            tone="up"
            empty={`No listed visual gained popularity since ${from}.`}
            onOpen={onOpen}
          />
          <Race
            title="Sliding"
            icon={<TrendingDown className="icon-size-200 text-down" aria-hidden />}
            moves={race.sliders}
            frame={frame}
            who={who}
            tone="down"
            empty={`No listed visual lost popularity since ${from}.`}
            onOpen={onOpen}
          />
        </>
      )}
      {!scores && turnover && raised && (
        <>
          <Roster
            title="Joined"
            icon={<LogIn className="icon-size-200 text-gold" aria-hidden />}
            visuals={turnover.joined}
            limit={joinedRows}
            replay={replay}
            at={at}
            who={who}
            empty={`No visual joined since ${from}.`}
            onOpen={onOpen}
          />
          <Roster
            title="Certified"
            icon={<BadgeCheck className="icon-size-200 text-up" aria-hidden />}
            visuals={raised.certified}
            limit={raisedRows}
            replay={replay}
            at={at}
            who={who}
            empty={`No listed visual became certified since ${from}.`}
            onOpen={onOpen}
          />
          <Roster
            title="Left"
            icon={<LogOut className="icon-size-200 text-muted-foreground" aria-hidden />}
            visuals={turnover.left}
            limit={leftRows}
            replay={replay}
            at={at}
            who={who}
            empty={`No visual left since ${from}.`}
            onOpen={onOpen}
          />
        </>
      )}
    </aside>
  );
}

function Picker({
  who,
  replay,
  at,
  picks,
  certifiedOnly,
  onPicks,
}: {
  who: (Who | undefined)[];
  replay: Replay;
  at: number;
  picks: number[];
  certifiedOnly: boolean;
  onPicks: (picks: number[]) => void;
}) {
  const [query, setQuery] = useState('');
  const listId = useId();
  const full = picks.length >= MAX_PICKS;
  const q = query.trim().toLowerCase();
  const frame = replay.frames[at];
  // Before the first reading, each visual counts by its first known popularity.
  const values = useMemo(() => valuesAt(replay, at), [replay, at]);
  const score = (v: number) => (Number.isNaN(values.score[v]) ? -1 : values.score[v]);
  const matches = useMemo(() => {
    // With the most visuals already followed, there is nothing left to offer.
    if (!q || full) return [];
    const taken = new Set(picks);
    const found: number[] = [];
    who.forEach((w, v) => {
      if (!w || taken.has(v)) return;
      if (w.name.toLowerCase().includes(q) || w.publisher.toLowerCase().includes(q)) found.push(v);
    });
    const by = (v: number) => (Number.isNaN(values.score[v]) ? -1 : values.score[v]);
    return found.sort((a, b) => by(b) - by(a)).slice(0, SUGGESTIONS);
  }, [q, full, who, picks, values]);

  const add = (v: number) => {
    if (full) return;
    onPicks([...picks, v]);
    setQuery('');
  };
  const topTen = () => {
    const ranked = replay.guids
      .map((_, v) => v)
      .filter(
        (v) =>
          who[v] &&
          isListed(frame, v) &&
          !Number.isNaN(values.score[v]) &&
          (!certifiedOnly || isCertified(frame, v))
      )
      .sort((a, b) => score(b) - score(a))
      .slice(0, MAX_PICKS);
    onPicks(ranked);
    setQuery('');
  };

  return (
    <div className="flex flex-col gap-200">
      <label className="relative">
        <span className="sr-only">Find a visual to follow</span>
        <Search
          className="icon-size-200 pointer-events-none absolute left-300 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          disabled={full}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && matches[0] !== undefined) add(matches[0]);
          }}
          placeholder={
            full
              ? `Following ${MAX_PICKS} visuals, the most at once.`
              : 'Find a visual by name or publisher'
          }
          aria-controls={listId}
          className="min-h-[40px] w-full rounded-full border border-border bg-card pl-[40px] pr-300 text-300 disabled:opacity-60"
        />
      </label>
      <div className="flex flex-wrap gap-200">
        <button
          type="button"
          onClick={topTen}
          className="min-h-[40px] rounded-full border border-border px-300 text-200 font-semibold hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
        >
          {certifiedOnly
            ? `Follow the ${MAX_PICKS} most popular certified visuals`
            : `Follow the ${MAX_PICKS} most popular visuals`}
        </button>
        {picks.length > 0 && (
          <button
            type="button"
            onClick={() => onPicks([])}
            className="min-h-[40px] rounded-full px-300 text-200 font-semibold text-muted-foreground hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
          >
            Show every visual
          </button>
        )}
      </div>
      <ul id={listId} aria-label="Matching visuals" className={cn('flex flex-col', matches.length === 0 && 'hidden')}>
        {matches.map((v) => {
          const w = who[v]!;
          return (
            <li key={w.guid}>
              <button
                type="button"
                onClick={() => add(v)}
                className="flex min-h-[40px] w-full items-center gap-200 rounded-xl px-100 text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
              >
                <Thumb src={w.thumbnail} name={w.name} size={28} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-100">
                    <span className="truncate text-300 font-semibold">{w.name}</span>
                    {isCertified(frame, v) && <CertifiedBadge />}
                  </span>
                  <span className="block truncate text-200 text-muted-foreground">{w.publisher}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {q && matches.length === 0 && !full && (
        <p className="px-100 text-200 text-muted-foreground">No visual matches that name.</p>
      )}
      {picks.length > 0 && (
        <ul className="flex flex-wrap gap-200" aria-label="Visuals you are following">
          {picks.map((v) => {
            const w = who[v];
            if (!w) return null;
            return (
              <li key={w.guid}>
                <button
                  type="button"
                  onClick={() => onPicks(picks.filter((p) => p !== v))}
                  aria-label={`Stop following ${w.name}`}
                  className="inline-flex min-h-[40px] items-center gap-200 rounded-full border border-border bg-card py-100 pl-100 pr-300 text-200 font-semibold hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Thumb src={w.thumbnail} name={w.name} size={28} className="rounded-full" />
                  <span className="max-w-[140px] truncate">{w.name}</span>
                  {isCertified(frame, v) && <CertifiedBadge />}
                  <X className="icon-size-100 text-muted-foreground" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function ReplayPage({
  replay,
  standings,
  catalog,
  certifiedOnly,
  onCertifiedOnly,
  onOpen,
}: {
  replay: Replay;
  standings: Standing[];
  /** Names the visuals the leaderboard has not read yet. */
  catalog: CatalogVisual[];
  /** Narrows the field, the counts and the lists to the certified visuals. */
  certifiedOnly: boolean;
  onCertifiedOnly: (certifiedOnly: boolean) => void;
  onOpen: (v: VisualRef) => void;
}) {
  const last = replay.frames.length - 1;
  const scoresReady = replay.firstReading >= 0;
  const [mode, setMode] = useState<ReplayMode>(scoresReady ? 'scores' : 'listings');
  const start = modeStart(replay, mode);
  const [cursor, setCursor] = useState(() =>
    modeStart(replay, scoresReady ? 'scores' : 'listings')
  );
  // The popularity view cannot go back before the first reading.
  const at = Math.min(last, Math.max(start, cursor));
  const [speeds, setSpeeds] = useState(DEFAULT_SPEED);
  const stepMs = speeds[mode];
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [reducedMotion] = useState(prefersReducedMotion);
  const [picks, setPicks] = useState<number[]>([]);
  const [flat, setFlat] = useState(() => !webglAvailable());
  const [resetSignal, setResetSignal] = useState(0);
  const [showUnrated, setShowUnrated] = useState(false);
  // A narrow screen starts with the field alone, and its buttons bring the rest in.
  const [showCounts, setShowCounts] = useState(() => window.innerWidth >= 640);
  const [showMovers, setShowMovers] = useState(() => window.innerWidth >= 1024);
  const [panel, setPanel] = useState<'follow' | 'help' | null>(null);
  const [maximized, setMaximized] = useState(false);
  const [slotRef, height] = useFitHeight<HTMLDivElement>();

  const who = useMemo(() => whoOf(replay.guids, standings, catalog), [replay, standings, catalog]);

  const frame = replay.frames[at] as ReplayFrame | undefined;
  const include = useMemo(() => {
    const now = replay.frames[at];
    if (!certifiedOnly || !now) return undefined;
    const earlier = replay.frames[Math.max(0, at - LOOKBACK_DAYS)];
    // A visual that is no longer listed counts as it was four weeks earlier.
    return (v: number) => isCertified(isListed(now, v) ? now : earlier, v);
  }, [certifiedOnly, replay, at]);

  // Playback stops by itself at the last day; Play then starts over.
  const running = playing && at < last;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setCursor(at + 1), stepMs);
    return () => window.clearTimeout(timer);
  }, [running, at, stepMs]);

  // Escape closes the open panel first, and then leaves the maximized player.
  useEffect(() => {
    if (!maximized && !panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      // A visual's details open over the player and take Escape for themselves.
      if (document.querySelector('[role="dialog"]')) return;
      if (panel) setPanel(null);
      else setMaximized(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [maximized, panel]);

  // The page behind a maximized player stays still.
  useEffect(() => {
    if (!maximized) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = before;
    };
  }, [maximized]);

  const counts = useMemo(() => frameCounts(replay, at, include), [replay, at, include]);
  // The latest reading's moves, compared with the reading before it.
  const k = frame?.reading ?? -1;
  const readFrame = k >= 1 ? replay.readings[k].frame : -1;
  const prevFrame = k >= 1 ? replay.readings[k - 1].frame : -1;
  const latest = useMemo(
    () =>
      readFrame < 0
        ? null
        : {
            bigMoves: frameCounts(replay, readFrame, include).bigMoves,
            jump: movers(replay, readFrame, readFrame - prevFrame, 1, include).climbers[0],
          },
    [replay, readFrame, prevFrame, include]
  );
  // A visual that was never read has no place on the popularity axis, so it has no dot there.
  const unplaced = useMemo(
    () => replay.first.score.reduce((n, s) => n + (Number.isNaN(s) ? 1 : 0), 0),
    [replay]
  );

  if (!frame)
    return (
      <EmptyState title="Nothing to replay yet">
        The leaderboard has no daily history to play back. Once a few daily
        snapshots have been recorded, the replay appears here.
      </EmptyState>
    );

  const scores = mode === 'scores';
  const toggle = () => {
    if (running) setPlaying(false);
    else {
      if (at >= last) setCursor(start);
      setPlaying(true);
    }
  };
  const changeMode = (next: ReplayMode) => {
    if (next === mode) return;
    setMode(next);
    setCursor(Math.max(at, modeStart(replay, next)));
  };
  const day = formatDate(frame.day);
  const following = picks.length > 0;
  const jumper = latest?.jump ? who[latest.jump.index] : undefined;
  const between =
    readFrame >= 0
      ? `between ${formatDate(replay.frames[prevFrame].day)} and ${formatDate(replay.frames[readFrame].day)}`
      : '';

  // A note over the field, for the days that need one, and a line under the timeline on a wide screen.
  let note: string | null = null;
  let line: string | null = null;
  if (scores) {
    const span = spanAt(replay, at);
    if (at === start && at < last)
      note =
        start > 0
          ? `Popularity was first read on ${day}. The Listings view goes back to ${formatDate(replay.frames[0].day)}.`
          : `Popularity was first read on ${day}.`;
    else if (span.from >= 0) {
      const a = replay.readings[span.from].frame;
      const b = replay.readings[span.to].frame;
      if (span.to !== span.from && b - a > 1)
        line = `Popularity was read on ${formatDate(replay.frames[a].day)} and on ${formatDate(replay.frames[b].day)}. Each visual moves in a straight line between the two readings.`;
      else if (span.to === span.from && at > a)
        line = `Popularity was last read on ${formatDate(replay.frames[a].day)}, so each visual holds that reading.`;
    }
  } else if (at === 0)
    note = `The record starts on ${day}. Every visual listed that day is part of the opening field, not a new arrival.`;

  return (
    <MotionConfig reducedMotion="user">
      <h1 className="sr-only">Replay: every day of Microsoft Marketplace</h1>
      {/* The slot keeps the player's place in the page while the player is maximized. */}
      <div ref={slotRef} style={{ height }}>
        <div
          data-replay-player
          className={cn(
            'flex flex-col gap-200',
            maximized ? 'fixed inset-0 z-40 bg-background p-300' : 'h-full'
          )}
        >
          <div className="flex shrink-0 items-center gap-300">
            <button
              type="button"
              onClick={toggle}
              aria-label={running ? 'Pause the replay' : at >= last ? 'Play the replay from the start' : 'Play the replay'}
              className="inline-flex min-h-[40px] shrink-0 items-center gap-200 rounded-full bg-primary px-300 text-300 font-bold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-400"
            >
              {running ? (
                <Pause className="icon-size-200" aria-hidden />
              ) : (
                <Play className="icon-size-200" aria-hidden />
              )}
              <span className="hidden sm:inline">
                {running ? 'Pause' : at >= last ? 'Play again' : 'Play'}
              </span>
            </button>
            <div className="shrink-0">
              <p className="tabular font-heading text-300 font-extrabold leading-300 sm:text-400 sm:leading-400">
                {day}
              </p>
              <p className="tabular text-100 leading-100 text-muted-foreground">
                Day {formatInt(at - start + 1)} of {formatInt(last - start + 1)}
              </p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <input
                type="range"
                min={start}
                max={last}
                step={1}
                value={at}
                aria-label="Day"
                aria-valuetext={day}
                onChange={(e) => {
                  setPlaying(false);
                  setCursor(Number(e.target.value));
                }}
                className="h-[36px] w-full cursor-pointer accent-[var(--color-pbi)] xl:h-[22px]"
              />
              {/* A wide screen has room for the day's note under the timeline, clear of the field. */}
              <p className="hidden h-[16px] truncate text-200 leading-200 text-muted-foreground xl:block">
                {note ?? line}
              </p>
            </div>
            <ToolButton
              icon={
                maximized ? (
                  <Minimize2 className="icon-size-200" aria-hidden />
                ) : (
                  <Maximize2 className="icon-size-200" aria-hidden />
                )
              }
              label={maximized ? 'Return the replay to its place in the page' : 'Fill the window with the replay'}
              onClick={() => setMaximized((m) => !m)}
            >
              <span className="hidden md:inline">{maximized ? 'Restore' : 'Maximize'}</span>
            </ToolButton>
          </div>

          <div
            role="group"
            aria-label="Replay options"
            className="-m-[3px] flex shrink-0 items-center gap-200 overflow-x-auto p-[3px] sm:flex-wrap sm:overflow-visible"
          >
            {scoresReady && (
              <Segmented
                label="What the replay shows"
                value={mode}
                options={[
                  { value: 'scores', label: 'Popularity' },
                  { value: 'listings', label: 'Listings' },
                ]}
                onChange={changeMode}
                className="shrink-0"
              />
            )}
            <label className="inline-flex min-h-[40px] shrink-0 items-center gap-100 rounded-full border border-border bg-card pl-300 pr-200 text-200 font-semibold hover:bg-hover has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring">
              <Gauge className="icon-size-100" aria-hidden />
              <span className="sr-only">Playback speed</span>
              <select
                value={stepMs}
                onChange={(e) => setSpeeds((s) => ({ ...s, [mode]: Number(e.target.value) }))}
                className="cursor-pointer bg-transparent pr-100 font-semibold focus:outline-none"
              >
                {SPEEDS.map((s) => (
                  <option key={s.ms} value={s.ms}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <CertifiedToggle
              certifiedOnly={certifiedOnly}
              onChange={onCertifiedOnly}
              className="shrink-0"
            />
            <ToolButton
              icon={<Target className="icon-size-100" aria-hidden />}
              pressed={panel === 'follow'}
              onClick={() => setPanel((p) => (p === 'follow' ? null : 'follow'))}
            >
              {following
                ? `Following ${formatInt(picks.length)} ${picks.length === 1 ? 'visual' : 'visuals'}`
                : 'Follow visuals'}
            </ToolButton>
            <ToolButton
              icon={<ArrowUpDown className="icon-size-100" aria-hidden />}
              pressed={showMovers}
              label={
                scores
                  ? showMovers
                    ? 'Hide the climbing and sliding visuals'
                    : 'Show the climbing and sliding visuals'
                  : showMovers
                    ? 'Hide the visuals that joined, became certified or left'
                    : 'Show the visuals that joined, became certified or left'
              }
              onClick={() => setShowMovers((m) => !m)}
            >
              Movers
            </ToolButton>
            <ToolButton
              icon={<Hash className="icon-size-100" aria-hidden />}
              pressed={showCounts}
              label={showCounts ? "Hide the day's counts" : "Show the day's counts"}
              onClick={() => setShowCounts((c) => !c)}
            >
              Counts
            </ToolButton>
            {scores && !following && (
              <label className="inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-200 rounded-full border border-border bg-card px-300 text-200 font-semibold hover:bg-hover has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring">
                <input
                  type="checkbox"
                  role="switch"
                  checked={showUnrated}
                  onChange={(e) => setShowUnrated(e.target.checked)}
                  className="size-[16px] accent-[var(--color-pbi)]"
                />
                Include visuals with no ratings ({formatInt(counts.unrated)})
              </label>
            )}
            <ToolButton
              icon={<Info className="icon-size-100" aria-hidden />}
              pressed={panel === 'help'}
              onClick={() => setPanel((p) => (p === 'help' ? null : 'help'))}
            >
              How to read this view
            </ToolButton>
            {!flat && (
              <ToolButton
                icon={<RotateCcw className="icon-size-100" aria-hidden />}
                onClick={() => setResetSignal((n) => n + 1)}
              >
                Reset view
              </ToolButton>
            )}
          </div>

          <ul
            aria-label={certifiedOnly ? `${day} in numbers, certified visuals only` : `${day} in numbers`}
            className={cn(
              showCounts ? '-m-[3px] flex shrink-0 gap-200 overflow-x-auto p-[3px]' : 'sr-only'
            )}
          >
            <Count
              label={certifiedOnly ? 'Listed certified visuals' : 'Listed visuals'}
              value={formatInt(counts.listed)}
            />
            {scores && latest && (
              <>
                <Count
                  label={`Moved 5 points or more ${between}`}
                  value={formatInt(latest.bigMoves)}
                />
                <Count
                  label={`Biggest jump ${between}`}
                  value={latest.jump ? formatScoreChange(latest.jump.delta) : 'None'}
                  hint={jumper?.name}
                />
              </>
            )}
            <Count label="Joined on this day" value={formatInt(counts.arrived)} />
            <Count label="Left on this day" value={formatInt(counts.left)} />
            <Count label="New versions on this day" value={formatInt(counts.versions)} />
            <Count label="Newly certified on this day" value={formatInt(counts.certified)} />
          </ul>

          <div className="relative flex min-h-0 flex-1 gap-300">
            <div className="relative min-h-0 min-w-0 flex-1">
              <div className="absolute inset-0">
                {flat ? (
                  <DotField
                    replay={replay}
                    mode={mode}
                    at={at}
                    stepMs={stepMs}
                    playing={running}
                    who={who}
                    picks={picks}
                    showUnrated={showUnrated}
                    certifiedOnly={certifiedOnly}
                    reducedMotion={reducedMotion}
                    onOpen={onOpen}
                  />
                ) : (
                  <Suspense
                    fallback={
                      <LoadingBlock
                        label="Loading the 3D view"
                        className="h-full rounded-2xl border border-border"
                      />
                    }
                  >
                    <Replay3D
                      replay={replay}
                      mode={mode}
                      at={at}
                      stepMs={stepMs}
                      playing={running}
                      who={who}
                      picks={picks}
                      showUnrated={showUnrated}
                      certifiedOnly={certifiedOnly}
                      resetSignal={resetSignal}
                      reducedMotion={reducedMotion}
                      onOpen={onOpen}
                      onUnsupported={() => setFlat(true)}
                    />
                  </Suspense>
                )}
              </div>
              {!flat && !following && (
                <Legend
                  mode={mode}
                  flat={false}
                  className="pointer-events-none absolute right-200 top-200 z-10 hidden flex-col gap-[2px] rounded-xl bg-card/85 px-200 py-100 text-100 sm:flex"
                />
              )}
              {note && (
                <p
                  className={cn(
                    'pointer-events-none absolute inset-x-200 z-10 mx-auto max-w-[640px] rounded-xl bg-accent px-300 py-200 text-200 leading-200 shadow-md xl:hidden',
                    // The flat field keeps its axis and legend under the dots. A
                    // narrow 3D view leaves its top empty, and a wide one its bottom.
                    flat ? 'bottom-[52px]' : 'top-200 lg:bottom-200 lg:top-auto'
                  )}
                >
                  {note}
                </p>
              )}
            </div>

            {showMovers && (
              <MoversPanel
                replay={replay}
                mode={mode}
                at={at}
                who={who}
                include={include}
                onOpen={onOpen}
                onClose={() => setShowMovers(false)}
              />
            )}

            {panel && (
              <section
                aria-label={panel === 'follow' ? 'Follow visuals' : 'How to read this view'}
                className={`absolute inset-200 z-30 flex flex-col gap-200 overflow-auto rounded-2xl border border-border bg-card p-300 shadow-lg sm:bottom-auto sm:right-auto sm:max-h-[calc(100%-16px)] ${
                  panel === 'follow' ? 'sm:w-[380px]' : 'sm:w-[600px]'
                }`}
              >
                <div className="flex items-center justify-between gap-200">
                  <h2 className="text-300 font-bold">
                    {panel === 'follow' ? 'Follow visuals' : 'How to read this view'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setPanel(null)}
                    aria-label="Close"
                    className="inline-flex size-[32px] shrink-0 items-center justify-center rounded-full hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <X className="icon-size-200" aria-hidden />
                  </button>
                </div>
                {panel === 'follow' ? (
                  <>
                    <p className="text-200 leading-200 text-muted-foreground">
                      Following a visual keeps only its path in view. Up to{' '}
                      {MAX_PICKS} visuals can be followed at once.
                    </p>
                    <Picker
                      who={who}
                      replay={replay}
                      at={at}
                      picks={picks}
                      certifiedOnly={certifiedOnly}
                      onPicks={setPicks}
                    />
                  </>
                ) : (
                  <div className="flex flex-col gap-200 text-200 leading-200">
                    <p>
                      Every dot is a custom visual on Microsoft Marketplace.
                      Pointing at a dot shows the visual, and selecting the dot
                      opens its details.
                    </p>
                    {scores ? (
                      <p>
                        The Popularity view runs one day at a time, from{' '}
                        {formatDate(replay.frames[start].day)} to{' '}
                        {formatDate(replay.frames[last].day)}.{' '}
                        {flat
                          ? 'Each listed visual is placed by its popularity score.'
                          : 'The number of ratings runs across, popularity rises upward, and average stars run front to back, with 3 stars in the middle. You can drag the view to turn it.'}
                      </p>
                    ) : (
                      <p>
                        The Listings view runs one day at a time, from{' '}
                        {formatDate(replay.frames[0].day)} to{' '}
                        {formatDate(replay.frames[last].day)}. Certified visuals
                        sit above the others, and a visual rises on the day it
                        becomes certified.
                        {flat ? '' : ' You can drag the view to turn it.'}
                      </p>
                    )}
                    <p>
                      {scores
                        ? 'A visual that moves shows its logo until it comes to rest, and then turns back into a dot.'
                        : 'A visual that joins, becomes certified or publishes a new version shows its logo for a moment, and then turns back into a dot.'}{' '}
                      Each new version makes a visual a little larger.
                    </p>
                    <Legend
                      mode={mode}
                      flat={flat}
                      className="grid grid-cols-2 gap-x-300 gap-y-100 sm:grid-cols-3"
                    />
                    {scores ? (
                      <p>
                        Popularity, ratings and stars were read about once a
                        week until spring 2026 and every day since June 2026.
                        Between two readings, each visual moves in a straight
                        line from one reading to the next.
                      </p>
                    ) : (
                      <p>
                        Most arrivals, new versions and certifications carry the
                        exact day Microsoft Marketplace gives for them. The rest,
                        and every departure, were found by a check of the
                        marketplace, which ran about once a week until spring
                        2026, so they can appear up to a week late.
                      </p>
                    )}
                    {scores && unplaced > 0 && (
                      <p>
                        {unplaced === 1
                          ? 'One visual has no popularity recorded on any day. It is counted and named in the lists, and it has no dot in the Popularity view.'
                          : `${formatInt(unplaced)} visuals have no popularity recorded on any day. They are counted and named in the lists, and they have no dot in the Popularity view.`}
                      </p>
                    )}
                    <p>
                      <CertifiedBadge className="mr-100 align-[-3px]" />
                      Certified visuals passed Microsoft's code review and can
                      export to PowerPoint and PDF. The Certified option keeps
                      only the certified visuals. A visual you follow stays in
                      view either way.
                    </p>
                    <p className="text-muted-foreground">
                      Data from Microsoft Marketplace. Popularity is Microsoft
                      Marketplace's own usage percentile.
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
