import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import {
  ArrowUpDown,
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
import { CertifiedBadge, CertifiedToggle, Thumb } from '@/components/ui';
import type { VisualRef } from '@/components/visual-drawer';
import { formatDate, formatInt, formatScore, formatScoreChange } from '@/lib/format';
import type { Standing } from '@/lib/leaderboard';
import {
  comings,
  frameCounts,
  jitter,
  lastScoredBefore,
  movers,
  type Move,
  type Replay,
  type ReplayFrame,
} from '@/lib/replay';
import { cn } from '@/lib/utils';

/** How long each week stays on screen. Quiet weeks pass quickly so the stretch with little recorded does not drag. */
const STEP_MS = 900;
const QUIET_STEP_MS = 180;
const CATCH_UP_STEP_MS = 2400;
/** The races compare each week with this many weeks earlier. */
const LOOKBACK = 4;
/** The climbing and sliding lists show as many rows as their panel has room for, within these bounds. */
const MIN_MOVERS = 3;
const MAX_MOVERS = 8;
const MOVER_ROW = 36;
/** The height the movers panel spends on its caption, its two titles and the gaps between them. */
const MOVERS_CHROME = 88;
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

function refOf(s: Standing): VisualRef {
  return { id: s.catalogId, guid: s.guid, name: s.name };
}

/**
 * What the record says about one visual's popularity in a week. In a stretch
 * when popularity was not recorded, a listed visual keeps its last score.
 */
function popularityLine(frame: ReplayFrame, v: number) {
  if (frame.present[v] !== 1) return 'Not listed this week';
  const score = frame.scores[v];
  if (Number.isNaN(score)) return 'Popularity not recorded yet';
  return frame.unscored
    ? `Last recorded popularity ${formatScore(score)}`
    : `Popularity ${formatScore(score)}`;
}

/**
 * Whether the lists beside the field show who joined and left instead of who
 * climbed and slid: in a stretch with no popularity recorded, and while the
 * week the lists compare with has no score behind it yet.
 */
function listingOnly(replay: Replay, at: number) {
  const frame = replay.frames[at];
  const base = replay.frames[Math.max(0, at - LOOKBACK)];
  return Boolean(frame && base && (frame.unscored || base.scoredAt < 0));
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

function DotField({
  replay,
  at,
  standings,
  picks,
  showUnrated,
  certifiedOnly,
  onOpen,
}: {
  replay: Replay;
  at: number;
  standings: (Standing | undefined)[];
  picks: number[];
  showUnrated: boolean;
  certifiedOnly: boolean;
  onOpen: (v: VisualRef) => void;
}) {
  const [ref, { width, height }] = useSize<HTMLDivElement>();
  const picked = useMemo(() => new Set(picks), [picks]);
  const frame = replay.frames[at];
  const prev = at > 0 ? replay.frames[at - 1] : null;
  const arrived = useMemo(() => new Set(frame.arrived), [frame]);
  const lanes = useMemo(() => replay.guids.map((g) => jitter(g)), [replay]);

  const certifiedShare = useMemo(() => {
    const known = standings.filter(Boolean);
    const certified = known.filter((s) => s?.certified).length;
    return known.length ? certified / known.length : 0;
  }, [standings]);
  // With only certified visuals in view there is one lane, and it takes the whole field.
  const oneLane = certifiedOnly && picked.size === 0;
  const laneSplit = oneLane
    ? height
    : height * Math.min(MAX_LANE, Math.max(MIN_LANE, certifiedShare));
  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);
  const point = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const index = target.dataset.index;
    if (index === undefined) return setHover(null);
    const box = event.currentTarget.getBoundingClientRect();
    const dot = target.getBoundingClientRect();
    setHover({ index: Number(index), x: dot.left - box.left, y: dot.top - box.top });
  };
  const hovered = hover ? standings[hover.index] : undefined;
  const open = (event: MouseEvent<HTMLDivElement>) => {
    const index = (event.target as HTMLElement).dataset.index;
    const s = index === undefined ? undefined : standings[Number(index)];
    if (s) onOpen(refOf(s));
  };

  return (
    <div className="flex h-full flex-col gap-100">
      {/* The dots repeat what the counts and races say in words, so screen readers skip them. */}
      <div
        ref={ref}
        aria-hidden
        onClick={open}
        onMouseOver={point}
        onMouseLeave={() => setHover(null)}
        className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-border bg-muted/40"
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
            if (picked.size > 0 ? !picked.has(v) : !showUnrated && !(frame.raters[v] > 0)) return null;
            const s = standings[v];
            if (oneLane && !s?.certified) return null;
            const score = frame.scores[v];
            const listed = frame.present[v] === 1;
            // Listed with no score recorded yet: a ring, where its first score later puts it.
            const hollow = listed && Number.isNaN(score);
            const position = frame.positions[v];
            // A visual that never had a score has no place on the axis.
            if (Number.isNaN(position)) return null;
            const before = prev ? prev.scores[v] : NaN;
            const delta = listed && !hollow && !Number.isNaN(before) ? score - before : 0;
            const certified = s?.certified ?? false;
            const top = certified ? 28 : laneSplit + 28;
            const bottom = certified ? laneSplit - 8 : height - 8;
            const x = PAD + position * (width - 2 * PAD) - DOT / 2;
            const y = top + lanes[v] * Math.max(0, bottom - top - DOT);
            const tone = !listed
              ? 'border-transparent bg-muted-foreground'
              : hollow
                ? arrived.has(v)
                  ? 'border-gold bg-transparent'
                  : 'border-muted-foreground bg-transparent'
                : arrived.has(v)
                  ? 'border-transparent bg-gold'
                  : delta > 0.0005
                    ? 'border-transparent bg-up'
                    : delta < -0.0005
                      ? 'border-transparent bg-down'
                      : 'border-transparent bg-muted-foreground/45';
            return (
              <span
                key={guid}
                data-index={v}
                className={cn(
                  'absolute left-0 top-0 cursor-pointer rounded-full border-[1.5px] transition-[transform,opacity,background-color,border-color] duration-700 ease-out',
                  tone
                )}
                style={{
                  width: DOT,
                  height: DOT,
                  opacity: listed
                    ? arrived.has(v) || Math.abs(delta) > 0.0005
                      ? 0.95
                      : hollow
                        ? 0.75
                        : 0.6
                    : 0,
                  transform: `translate(${x}px, ${y}px) scale(${listed ? (arrived.has(v) ? 1.6 : 1) : 0.3})`,
                }}
              />
            );
          })}
        {hover && hovered && (
          <div
            data-hover-card
            className="pointer-events-none absolute left-0 top-0 z-10 flex w-[240px] items-center gap-200 rounded-2xl border border-border bg-card p-200 shadow-lg"
            style={{
              transform: `translate(${Math.max(4, Math.min(hover.x + 14, width - 244))}px, ${
                hover.y + 96 > height ? Math.max(4, hover.y - 88) : hover.y + 14
              }px)`,
            }}
          >
            <Thumb src={hovered.thumbnail} name={hovered.name} size={44} />
            <span className="min-w-0">
              <span className="block truncate text-300 font-bold">{hovered.name}</span>
              {hovered.certified && <CertifiedBadge label />}
              <span className="block text-200 text-muted-foreground">
                {popularityLine(frame, hover.index)}
              </span>
            </span>
          </div>
        )}
      </div>
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
      <div className="flex flex-wrap items-center justify-center gap-x-500 gap-y-100">
        <p className="text-200 font-semibold text-muted-foreground" aria-hidden>
          Popularity score
        </p>
        {picked.size === 0 && (
          <Legend flat className="hidden flex-wrap justify-center gap-x-300 gap-y-100 text-100 sm:flex" />
        )}
      </div>
    </div>
  );
}

function Legend({ flat, className }: { flat: boolean; className?: string }) {
  const items = [
    { swatch: 'size-[10px] bg-up', label: 'Gained this week' },
    { swatch: 'size-[10px] bg-down', label: 'Lost this week' },
    { swatch: 'size-[10px] bg-gold', label: 'Joined this week' },
    { swatch: 'size-[10px] bg-muted-foreground/45', label: 'No change' },
    {
      // The flat field draws it as a ring, and the 3D view as a smaller dot.
      swatch: flat
        ? 'size-[10px] border-[1.5px] border-muted-foreground'
        : 'mx-[2px] size-[6px] bg-muted-foreground',
      label: 'No popularity recorded yet',
    },
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
  standings,
  tone,
  empty,
  onOpen,
}: {
  title: string;
  icon: ReactNode;
  moves: Move[];
  standings: (Standing | undefined)[];
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
        <ol className="relative flex flex-col">
          {/* A row that is leaving steps out of the flow at once, so the list never outgrows its panel. */}
          <AnimatePresence initial={false} mode="popLayout">
            {moves.map((m) => {
              const s = standings[m.index];
              if (!s) return null;
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
                    onClick={() => onOpen(refOf(s))}
                    className="flex w-full items-center gap-200 rounded-xl px-100 text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                    style={{ height: MOVER_ROW }}
                  >
                    <Thumb src={s.thumbnail} name={s.name} size={24} className="rounded-lg" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-100">
                        <span className="truncate text-200 font-semibold leading-200">{s.name}</span>
                        {s.certified && <CertifiedBadge className="size-[14px]" />}
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

/** The visuals that joined, or left, over the weeks the panel looks back on. */
function Roster({
  title,
  icon,
  visuals,
  limit,
  frame,
  standings,
  empty,
  onOpen,
}: {
  title: string;
  icon: ReactNode;
  visuals: number[];
  limit: number;
  /** The week being shown, which holds each visual's place on the popularity axis. */
  frame: ReplayFrame;
  standings: (Standing | undefined)[];
  empty: string;
  onOpen: (v: VisualRef) => void;
}) {
  const named = visuals.filter((v) => standings[v]);
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
        <ol className="relative flex flex-col">
          <AnimatePresence initial={false} mode="popLayout">
            {named.slice(0, limit).map((v) => {
              const s = standings[v]!;
              const place = frame.positions[v];
              return (
                <motion.li
                  key={s.guid}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="w-full"
                >
                  <button
                    type="button"
                    onClick={() => onOpen(refOf(s))}
                    className="flex w-full items-center gap-200 rounded-xl px-100 text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                    style={{ height: MOVER_ROW }}
                  >
                    <Thumb src={s.thumbnail} name={s.name} size={24} className="rounded-lg" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-100">
                        <span className="truncate text-200 font-semibold leading-200">{s.name}</span>
                        {s.certified && <CertifiedBadge className="size-[14px]" />}
                      </span>
                      <span className="block truncate text-100 leading-100 text-muted-foreground">
                        {s.publisher}
                      </span>
                    </span>
                    {!Number.isNaN(place) && (
                      <span
                        className="tabular shrink-0 text-100 leading-100 text-muted-foreground"
                        title={
                          frame.present[v] === 1 && !Number.isNaN(frame.scores[v])
                            ? 'The popularity score recorded for this visual'
                            : frame.present[v] === 1
                              ? 'The first popularity score recorded for this visual, later on'
                              : 'The last popularity score recorded for this visual'
                        }
                      >
                        {formatScore(place)}
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
 * The lists beside the field: the climbing and sliding visuals, or the visuals
 * that joined and left in the weeks when no popularity was recorded. Beside the
 * field on a wide screen, over it on a narrow one.
 */
function MoversPanel({
  replay,
  at,
  standings,
  include,
  onOpen,
  onClose,
}: {
  replay: Replay;
  at: number;
  standings: (Standing | undefined)[];
  include?: (index: number) => boolean;
  onOpen: (v: VisualRef) => void;
  onClose: () => void;
}) {
  const [ref, { height }] = useSize<HTMLElement>();
  const rows = Math.max(
    MIN_MOVERS,
    Math.min(MAX_MOVERS, Math.floor((height - MOVERS_CHROME) / (2 * MOVER_ROW)))
  );
  const roster = listingOnly(replay, at);
  const race = useMemo(
    () => movers(replay, at, LOOKBACK, rows, include),
    [replay, at, rows, include]
  );
  const turnover = useMemo(
    () => comings(replay, at, LOOKBACK, include),
    [replay, at, include]
  );
  // The two lists share the panel: a short or empty one hands its rows to the other.
  const named = (visuals: number[]) => visuals.filter((v) => standings[v]).length;
  const joinedRows = Math.max(rows, 2 * rows - Math.max(1, named(turnover.left)));
  const leftRows = Math.max(rows, 2 * rows - Math.max(1, named(turnover.joined)));
  const caption = roster
    ? at === 0
      ? 'The record starts this week. The visuals that join or leave are listed here from the next week on.'
      : turnover.from
      ? `Visuals that joined or left since ${formatDate(turnover.from)}.`
      : 'Visuals that joined or left over the previous four weeks.'
    : race.from
      ? `Score change since ${formatDate(race.from)}.`
      : 'Score change over the previous four weeks.';
  return (
    <aside
      ref={ref}
      aria-label={roster ? 'Visuals that joined and left' : 'Climbing and sliding visuals'}
      className="absolute inset-0 z-20 flex flex-col gap-200 overflow-y-auto rounded-2xl border border-border bg-card p-200 lg:static lg:z-auto lg:w-[300px] lg:shrink-0"
    >
      <div className="flex min-h-[20px] items-center justify-between gap-200">
        <p className="text-200 leading-200 text-muted-foreground">{caption}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label={
            roster ? 'Hide the visuals that joined and left' : 'Hide the climbing and sliding visuals'
          }
          className="inline-flex size-[32px] shrink-0 items-center justify-center rounded-full hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring lg:hidden"
        >
          <X className="icon-size-200" aria-hidden />
        </button>
      </div>
      {roster && at === 0 ? null : roster ? (
        <>
          <Roster
            title="Joined"
            icon={<LogIn className="icon-size-200 text-gold" aria-hidden />}
            visuals={turnover.joined}
            limit={joinedRows}
            frame={replay.frames[at]}
            standings={standings}
            empty="No visual joined over these weeks."
            onOpen={onOpen}
          />
          <Roster
            title="Left"
            icon={<LogOut className="icon-size-200 text-muted-foreground" aria-hidden />}
            visuals={turnover.left}
            limit={leftRows}
            frame={replay.frames[at]}
            standings={standings}
            empty="No visual left over these weeks."
            onOpen={onOpen}
          />
        </>
      ) : (
        <>
          <Race
            title="Climbing"
            icon={<TrendingUp className="icon-size-200 text-up" aria-hidden />}
            moves={race.climbers}
            standings={standings}
            tone="up"
            empty="No listed visual gained ground over these weeks."
            onOpen={onOpen}
          />
          <Race
            title="Sliding"
            icon={<TrendingDown className="icon-size-200 text-down" aria-hidden />}
            moves={race.sliders}
            standings={standings}
            tone="down"
            empty="No listed visual lost ground over these weeks."
            onOpen={onOpen}
          />
        </>
      )}
    </aside>
  );
}

function Picker({
  standings,
  replay,
  at,
  picks,
  certifiedOnly,
  onPicks,
}: {
  standings: (Standing | undefined)[];
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
  const matches = useMemo(() => {
    // With the most visuals already followed, there is nothing left to offer.
    if (!q || full) return [];
    const taken = new Set(picks);
    const found: number[] = [];
    standings.forEach((s, v) => {
      if (!s || taken.has(v)) return;
      if (s.name.toLowerCase().includes(q) || s.publisher.toLowerCase().includes(q)) found.push(v);
    });
    return found
      .sort((a, b) => (standings[b]?.popularity ?? 0) - (standings[a]?.popularity ?? 0))
      .slice(0, SUGGESTIONS);
  }, [q, full, standings, picks]);

  const add = (v: number) => {
    if (full) return;
    onPicks([...picks, v]);
    setQuery('');
  };
  const topTen = () => {
    const frame = replay.frames[at];
    // Before any popularity was recorded, the top is taken from where each visual first scored.
    const by = frame.scoredAt >= 0 ? frame.scores : frame.positions;
    const ranked = replay.guids
      .map((_, v) => v)
      .filter(
        (v) =>
          standings[v] &&
          frame.present[v] === 1 &&
          !Number.isNaN(by[v]) &&
          (!certifiedOnly || standings[v]?.certified === true)
      )
      .sort((a, b) => by[b] - by[a])
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
            ? `Follow this week's top ${MAX_PICKS} certified visuals`
            : `Follow this week's top ${MAX_PICKS}`}
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
          const s = standings[v]!;
          return (
            <li key={s.guid}>
              <button
                type="button"
                onClick={() => add(v)}
                className="flex min-h-[40px] w-full items-center gap-200 rounded-xl px-100 text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
              >
                <Thumb src={s.thumbnail} name={s.name} size={28} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-100">
                    <span className="truncate text-300 font-semibold">{s.name}</span>
                    {s.certified && <CertifiedBadge />}
                  </span>
                  <span className="block truncate text-200 text-muted-foreground">{s.publisher}</span>
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
            const s = standings[v];
            if (!s) return null;
            return (
              <li key={s.guid}>
                <button
                  type="button"
                  onClick={() => onPicks(picks.filter((p) => p !== v))}
                  aria-label={`Stop following ${s.name}`}
                  className="inline-flex min-h-[40px] items-center gap-200 rounded-full border border-border bg-card py-100 pl-100 pr-300 text-200 font-semibold hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Thumb src={s.thumbnail} name={s.name} size={28} className="rounded-full" />
                  <span className="max-w-[140px] truncate">{s.name}</span>
                  {s.certified && <CertifiedBadge />}
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
  certifiedOnly,
  onCertifiedOnly,
  onOpen,
}: {
  replay: Replay;
  standings: Standing[];
  /** Narrows the field, the counts and the movers to the certified visuals. */
  certifiedOnly: boolean;
  onCertifiedOnly: (certifiedOnly: boolean) => void;
  onOpen: (v: VisualRef) => void;
}) {
  const last = replay.frames.length - 1;
  const [at, setAt] = useState(0);
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

  const byIndex = useMemo(() => {
    const byGuid = new Map(standings.map((s) => [s.guid, s]));
    return replay.guids.map((g) => byGuid.get(g));
  }, [replay, standings]);

  const include = useMemo(
    () => (certifiedOnly ? (v: number) => byIndex[v]?.certified === true : undefined),
    [certifiedOnly, byIndex]
  );

  const frame = replay.frames[at];

  // Playback stops by itself at the last week; Play then starts over.
  const running = playing && at < last;

  useEffect(() => {
    if (!running) return;
    const next = replay.frames[at + 1];
    // The week popularity comes back moves every dot at once, so it stays longer.
    const delay =
      next.catchUp || next.resumed ? CATCH_UP_STEP_MS : next.quiet ? QUIET_STEP_MS : STEP_MS;
    const timer = window.setTimeout(() => setAt((i) => Math.min(i + 1, last)), delay);
    return () => window.clearTimeout(timer);
  }, [running, at, last, replay]);

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
  const jump = useMemo(() => movers(replay, at, 1, 1, include).climbers[0], [replay, at, include]);

  // The stretches after a recorded score in which popularity was not recorded.
  const gaps = useMemo(() => {
    const found: { from: Date; to: Date | null; start: number; end: number }[] = [];
    replay.frames.forEach((f, i) => {
      if (!f.unscored || f.scoredAt < 0) return;
      const open = found[found.length - 1];
      if (open && open.end === i - 1) open.end = i;
      else found.push({ from: replay.frames[f.scoredAt].end, to: null, start: i, end: i });
    });
    for (const g of found) g.to = replay.frames[g.end + 1]?.end ?? null;
    return found;
  }, [replay]);
  // A visual that never had a score has no place on the popularity axis, so it has no dot.
  const unplaced = useMemo(() => {
    const first = replay.frames[0];
    return first ? first.positions.reduce((n, p) => n + (Number.isNaN(p) ? 1 : 0), 0) : 0;
  }, [replay]);

  if (!frame)
    return (
      <EmptyState title="Nothing to replay yet">
        The leaderboard has no weekly history to play back. Once a few daily
        snapshots have been recorded, the replay appears here.
      </EmptyState>
    );

  const toggle = () => {
    if (running) setPlaying(false);
    else {
      if (at >= last) setAt(0);
      setPlaying(true);
    }
  };
  const label = `Week ending ${formatDate(frame.end)}`;
  const jumper = jump ? byIndex[jump.index] : undefined;
  const following = picks.length > 0;

  const since = lastScoredBefore(replay, at);
  const gap = gaps.find((g) => at >= g.start && at <= g.end);
  // With no score to compare, the week's counts turn to what the record does hold.
  const countListings = frame.unscored || (frame.resumed && !since);
  const roster = listingOnly(replay, at);

  let note: string | null = null;
  if (at === 0)
    note = frame.scored
      ? 'The record starts here. Every visual listed this week is part of the opening field, not a new arrival.'
      : 'The record starts here, before popularity was first recorded. Every visual listed this week is part of the opening field.';
  else if (frame.resumed)
    note = since
      ? `Popularity was recorded again this week, for the first time since ${formatDate(since)}, so every score moves at once.`
      : 'Popularity was recorded for the first time this week, so every dot now shows its score.';
  else if (gap)
    note = gap.to
      ? `Popularity was not recorded between ${formatDate(gap.from)} and ${formatDate(gap.to)}. Each dot holds its last recorded score.`
      : `Popularity was not recorded after ${formatDate(gap.from)}. Each dot holds its last recorded score.`;
  else if (frame.unscored)
    note = 'Popularity was not recorded yet. Each dot waits where its first recorded score later places it.';
  else if (frame.catchUp)
    note = 'Full recording resumed this week, so the visuals that joined in the meantime appear at once and many scores jump.';
  else if (frame.quiet)
    note = 'Very little was recorded in this stretch, so these weeks play quickly.';

  return (
    <MotionConfig reducedMotion="user">
      <h1 className="sr-only">Replay: every week of Microsoft Marketplace</h1>
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
                <span className="hidden sm:inline">Week ending </span>
                {formatDate(frame.end)}
              </p>
              <p className="tabular text-100 leading-100 text-muted-foreground">
                Week {formatInt(at + 1)} of {formatInt(last + 1)}
              </p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <input
                type="range"
                min={0}
                max={last}
                step={1}
                value={at}
                aria-label="Week"
                aria-valuetext={label}
                onChange={(e) => {
                  setPlaying(false);
                  setAt(Number(e.target.value));
                }}
                className="h-[36px] w-full cursor-pointer accent-[var(--color-pbi)] xl:h-[22px]"
              />
              {/* A wide screen has room for the week's note under the timeline, clear of the field. */}
              <p className="hidden h-[16px] truncate text-200 leading-200 text-muted-foreground xl:block">
                {note}
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
                roster
                  ? showMovers
                    ? 'Hide the visuals that joined and left'
                    : 'Show the visuals that joined and left'
                  : showMovers
                    ? 'Hide the climbing and sliding visuals'
                    : 'Show the climbing and sliding visuals'
              }
              onClick={() => setShowMovers((m) => !m)}
            >
              Movers
            </ToolButton>
            <ToolButton
              icon={<Hash className="icon-size-100" aria-hidden />}
              pressed={showCounts}
              label={showCounts ? "Hide the week's counts" : "Show the week's counts"}
              onClick={() => setShowCounts((c) => !c)}
            >
              Counts
            </ToolButton>
            {!following && (
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
            aria-label={certifiedOnly ? 'This week in numbers, certified visuals only' : 'This week in numbers'}
            className={cn(
              showCounts ? '-m-[3px] flex shrink-0 gap-200 overflow-x-auto p-[3px]' : 'sr-only'
            )}
          >
            <Count
              label={certifiedOnly ? 'Listed certified visuals' : 'Listed visuals'}
              value={formatInt(counts.listed)}
            />
            <Count label="Joined this week" value={formatInt(counts.arrived)} />
            <Count label="Left this week" value={formatInt(counts.left)} />
            {countListings ? (
              <>
                <Count label="New versions this week" value={formatInt(counts.versions)} />
                <Count label="Newly certified this week" value={formatInt(counts.certified)} />
              </>
            ) : (
              <>
                <Count
                  label={
                    frame.resumed && since
                      ? `Moved 5 points or more since ${formatDate(since)}`
                      : 'Moved 5 points or more'
                  }
                  value={formatInt(counts.bigMoves)}
                />
                <Count
                  label={
                    frame.resumed && since
                      ? `Biggest jump since ${formatDate(since)}`
                      : 'Biggest jump this week'
                  }
                  value={jump ? formatScoreChange(jump.delta) : 'None'}
                  hint={jumper?.name}
                />
              </>
            )}
          </ul>

          <div className="relative flex min-h-0 flex-1 gap-300">
            <div className="relative min-h-0 min-w-0 flex-1">
              <div className="absolute inset-0">
                {flat ? (
                  <DotField
                    replay={replay}
                    at={at}
                    standings={byIndex}
                    picks={picks}
                    showUnrated={showUnrated}
                    certifiedOnly={certifiedOnly}
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
                      at={at}
                      standings={byIndex}
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
                  flat={false}
                  className="pointer-events-none absolute right-200 top-200 z-10 hidden flex-col gap-[2px] rounded-xl bg-card/85 px-200 py-100 text-100 sm:flex"
                />
              )}
              {note && (
                <p
                  className={cn(
                    'pointer-events-none absolute inset-x-200 z-10 mx-auto max-w-[640px] rounded-xl bg-accent px-300 py-200 text-200 leading-200 shadow-md xl:hidden',
                    // The flat field keeps its score axis under the dots. A narrow
                    // 3D view leaves its top empty, and a wide one its bottom.
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
                at={at}
                standings={byIndex}
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
                      standings={byIndex}
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
                      Every dot is a custom visual on Microsoft Marketplace. The
                      replay runs one week at a time, from{' '}
                      {formatDate(replay.frames[0].end)} to{' '}
                      {formatDate(replay.frames[last].end)}. Pointing at a dot
                      shows the visual, and selecting the dot opens its details.
                    </p>
                    <p>
                      {flat
                        ? 'Each listed visual is placed by its popularity score at the end of the week.'
                        : 'The number of ratings runs across, popularity rises upward, and average stars run front to back, with 3 stars in the middle. You can drag the view to turn it.'}
                    </p>
                    <Legend flat={flat} className="grid grid-cols-2 gap-x-300 gap-y-100 sm:grid-cols-3" />
                    {gaps.map((g) => (
                      <p key={g.start}>
                        {g.to
                          ? `Popularity was not recorded between ${formatDate(g.from)} and ${formatDate(g.to)}.`
                          : `Popularity was not recorded after ${formatDate(g.from)}.`}{' '}
                        For those weeks the record holds which visuals were
                        listed, their new versions and their certifications, and
                        each dot keeps its last recorded score.
                      </p>
                    ))}
                    {unplaced > 0 && (
                      <p>
                        {unplaced === 1
                          ? 'One visual has no popularity recorded in any week. It is counted and named in the lists, and it has no dot.'
                          : `${formatInt(unplaced)} visuals have no popularity recorded in any week. They are counted and named in the lists, and they have no dot.`}
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
                      Data from Microsoft Marketplace, collected about weekly
                      from January 2024 and daily since July 2025. Popularity is
                      Microsoft Marketplace's own usage percentile.
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
