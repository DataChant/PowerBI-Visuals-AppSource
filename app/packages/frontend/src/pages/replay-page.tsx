import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import {
  History,
  Pause,
  Play,
  RotateCcw,
  Search,
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
import { Card, Kpi, Thumb } from '@/components/ui';
import type { VisualRef } from '@/components/visual-drawer';
import { formatDate, formatInt, formatScore, formatScoreChange } from '@/lib/format';
import type { Standing } from '@/lib/leaderboard';
import { jitter, movers, type Move, type Replay } from '@/lib/replay';
import { cn } from '@/lib/utils';

/** How long each week stays on screen. Quiet weeks pass quickly so the stretch with little recorded does not drag. */
const STEP_MS = 900;
const QUIET_STEP_MS = 180;
const CATCH_UP_STEP_MS = 2400;
/** The races compare each week with this many weeks earlier. */
const LOOKBACK = 4;
const RACE_SIZE = 8;
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

function DotField({
  replay,
  at,
  standings,
  picks,
  showUnrated,
  onOpen,
}: {
  replay: Replay;
  at: number;
  standings: (Standing | undefined)[];
  picks: number[];
  showUnrated: boolean;
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
  const laneSplit = height * Math.min(MAX_LANE, Math.max(MIN_LANE, certifiedShare));
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
  const hoveredScore = hover ? frame.scores[hover.index] : NaN;
  const open = (event: MouseEvent<HTMLDivElement>) => {
    const index = (event.target as HTMLElement).dataset.index;
    const s = index === undefined ? undefined : standings[Number(index)];
    if (s) onOpen(refOf(s));
  };

  return (
    <div className="flex flex-col gap-100">
      {/* The dots repeat what the counts and races say in words, so screen readers skip them. */}
      <div
        ref={ref}
        aria-hidden
        onClick={open}
        onMouseOver={point}
        onMouseLeave={() => setHover(null)}
        className="relative h-[260px] overflow-hidden rounded-2xl border border-border bg-muted/40 sm:h-[320px]"
      >
        <div
          className="absolute inset-x-0 border-t border-dashed border-border"
          style={{ top: laneSplit }}
        />
        <span className="absolute left-300 top-200 text-100 font-bold uppercase tracking-wide text-muted-foreground">
          Certified
        </span>
        <span
          className="absolute left-300 text-100 font-bold uppercase tracking-wide text-muted-foreground"
          style={{ top: laneSplit + 8 }}
        >
          Not certified
        </span>
        {width > 0 &&
          replay.guids.map((guid, v) => {
            if (picked.size > 0 ? !picked.has(v) : !showUnrated && !(frame.raters[v] > 0)) return null;
            const s = standings[v];
            const score = frame.scores[v];
            const listed = !Number.isNaN(score);
            const position = frame.positions[v];
            if (Number.isNaN(position)) return null;
            const before = prev ? prev.scores[v] : NaN;
            const delta = listed && !Number.isNaN(before) ? score - before : 0;
            const certified = s?.certified ?? false;
            const top = certified ? 28 : laneSplit + 28;
            const bottom = certified ? laneSplit - 8 : height - 8;
            const x = PAD + position * (width - 2 * PAD) - DOT / 2;
            const y = top + lanes[v] * Math.max(0, bottom - top - DOT);
            const tone = !listed
              ? 'bg-muted-foreground'
              : arrived.has(v)
                ? 'bg-gold'
                : delta > 0.0005
                  ? 'bg-up'
                  : delta < -0.0005
                    ? 'bg-down'
                    : 'bg-muted-foreground/45';
            return (
              <span
                key={guid}
                data-index={v}
                className={cn(
                  'absolute left-0 top-0 cursor-pointer rounded-full transition-[transform,opacity,background-color] duration-700 ease-out',
                  tone
                )}
                style={{
                  width: DOT,
                  height: DOT,
                  opacity: listed ? (arrived.has(v) || Math.abs(delta) > 0.0005 ? 0.95 : 0.6) : 0,
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
                hover.y + 76 > height ? hover.y - 68 : hover.y + 14
              }px)`,
            }}
          >
            <Thumb src={hovered.thumbnail} name={hovered.name} size={44} />
            <span className="min-w-0">
              <span className="block truncate text-300 font-bold">{hovered.name}</span>
              <span className="block text-200 text-muted-foreground">
                Popularity {Number.isNaN(hoveredScore) ? 'not listed' : formatScore(hoveredScore)}
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
      <p className="text-center text-200 font-semibold text-muted-foreground" aria-hidden>
        Popularity score
      </p>
    </div>
  );
}

function Legend() {
  const items = [
    { tone: 'bg-up', label: 'Gained this week' },
    { tone: 'bg-down', label: 'Lost this week' },
    { tone: 'bg-gold', label: 'Joined this week' },
    { tone: 'bg-muted-foreground/45', label: 'No change' },
  ];
  return (
    <ul className="flex flex-wrap gap-x-400 gap-y-100 text-200 text-muted-foreground" aria-hidden>
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-100">
          <span className={cn('inline-block size-[10px] rounded-full', i.tone)} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

function Race({
  title,
  subtitle,
  icon,
  moves,
  standings,
  tone,
  empty,
  onOpen,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  moves: Move[];
  standings: (Standing | undefined)[];
  tone: 'up' | 'down';
  empty: string;
  onOpen: (v: VisualRef) => void;
}) {
  const largest = moves.reduce((m, x) => Math.max(m, Math.abs(x.delta)), 0) || 1;
  return (
    <Card title={title} subtitle={subtitle} icon={icon} bodyClassName="pt-200">
      {moves.length > 0 ? (
        <ol className="flex flex-col">
          <AnimatePresence initial={false}>
            {moves.map((m) => {
              const s = standings[m.index];
              if (!s) return null;
              return (
                <motion.li
                  key={m.guid}
                  layout
                  initial={{ opacity: 0, x: tone === 'up' ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                >
                  <button
                    type="button"
                    onClick={() => onOpen(refOf(s))}
                    className="flex min-h-[48px] w-full items-center gap-300 rounded-xl px-200 py-100 text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <Thumb src={s.thumbnail} name={s.name} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-300 font-semibold">{s.name}</span>
                      <span className="mt-100 block h-[6px] overflow-hidden rounded-full bg-muted">
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
                          'tabular font-heading text-400 font-bold',
                          tone === 'up' ? 'text-up' : 'text-down'
                        )}
                      >
                        {formatScoreChange(m.delta)}
                      </span>
                      <span className="tabular text-200 text-muted-foreground">
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
        <p className="px-200 py-400 text-300 text-muted-foreground">{empty}</p>
      )}
    </Card>
  );
}

function Picker({
  standings,
  replay,
  at,
  picks,
  onPicks,
}: {
  standings: (Standing | undefined)[];
  replay: Replay;
  at: number;
  picks: number[];
  onPicks: (picks: number[]) => void;
}) {
  const [query, setQuery] = useState('');
  const listId = useId();
  const full = picks.length >= MAX_PICKS;
  const q = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return [];
    const taken = new Set(picks);
    const found: number[] = [];
    standings.forEach((s, v) => {
      if (!s || taken.has(v)) return;
      if (s.name.toLowerCase().includes(q) || s.publisher.toLowerCase().includes(q)) found.push(v);
    });
    return found
      .sort((a, b) => (standings[b]?.popularity ?? 0) - (standings[a]?.popularity ?? 0))
      .slice(0, SUGGESTIONS);
  }, [q, standings, picks]);

  const add = (v: number) => {
    if (full) return;
    onPicks([...picks, v]);
    setQuery('');
  };
  const topTen = () => {
    const frame = replay.frames[at];
    const ranked = replay.guids
      .map((_, v) => v)
      .filter((v) => standings[v] && !Number.isNaN(frame.scores[v]))
      .sort((a, b) => frame.scores[b] - frame.scores[a])
      .slice(0, MAX_PICKS);
    onPicks(ranked);
  };

  return (
    <div className="flex flex-col gap-200">
      <div className="flex flex-wrap items-center gap-200">
        <label className="relative min-w-0 flex-1 basis-[240px]">
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
                : 'Find a visual to follow, by name or publisher'
            }
            aria-controls={listId}
            className="min-h-[44px] w-full rounded-full border border-border bg-card pl-[40px] pr-300 text-300 disabled:opacity-60"
          />
        </label>
        <button
          type="button"
          onClick={topTen}
          className="min-h-[44px] rounded-full border border-border px-400 text-300 font-semibold hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
        >
          Follow this week's top 10
        </button>
        {picks.length > 0 && (
          <button
            type="button"
            onClick={() => onPicks([])}
            className="min-h-[44px] rounded-full px-400 text-300 font-semibold text-muted-foreground hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
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
                className="flex min-h-[44px] w-full items-center gap-300 rounded-xl px-200 text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
              >
                <Thumb src={s.thumbnail} name={s.name} size={28} />
                <span className="min-w-0 flex-1 truncate text-300 font-semibold">{s.name}</span>
                <span className="truncate text-200 text-muted-foreground">{s.publisher}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {q && matches.length === 0 && !full && (
        <p className="px-200 text-300 text-muted-foreground">No visual matches that name.</p>
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
                  className="inline-flex min-h-[44px] items-center gap-200 rounded-full border border-border bg-card py-100 pl-100 pr-300 text-200 font-semibold hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Thumb src={s.thumbnail} name={s.name} size={28} className="rounded-full" />
                  <span className="max-w-[160px] truncate">{s.name}</span>
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
  onOpen,
}: {
  replay: Replay;
  standings: Standing[];
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

  const byIndex = useMemo(() => {
    const byGuid = new Map(standings.map((s) => [s.guid, s]));
    return replay.guids.map((g) => byGuid.get(g));
  }, [replay, standings]);

  const frame = replay.frames[at];

  // Playback stops by itself at the last week; Play then starts over.
  const running = playing && at < last;

  useEffect(() => {
    if (!running) return;
    const next = replay.frames[at + 1];
    const delay = next.catchUp ? CATCH_UP_STEP_MS : next.quiet ? QUIET_STEP_MS : STEP_MS;
    const timer = window.setTimeout(() => setAt((i) => Math.min(i + 1, last)), delay);
    return () => window.clearTimeout(timer);
  }, [running, at, last, replay]);

  const race = useMemo(() => movers(replay, at, LOOKBACK, RACE_SIZE), [replay, at]);
  const jump = useMemo(() => movers(replay, at, 1, 1).climbers[0], [replay, at]);

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
  let unrated = 0;
  for (let v = 0; v < frame.scores.length; v++) {
    if (!Number.isNaN(frame.scores[v]) && !(frame.raters[v] > 0)) unrated++;
  }
  const jumper = jump ? byIndex[jump.index] : undefined;

  let note: string | null = null;
  if (at === 0)
    note = 'The record starts here. Every visual already listed this week counts as part of the opening field, not as a new arrival.';
  else if (frame.catchUp)
    note = 'When full recording resumed, the visuals that had joined in the meantime appeared all at once, and many scores jumped to catch up.';
  else if (frame.quiet)
    note = 'Very little was recorded in this stretch, so these weeks play quickly.';

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-600">
        <section className="hero-glow overflow-hidden rounded-4xl border border-border p-500 sm:p-700">
          <p className="mb-200 inline-flex items-center gap-100 rounded-full bg-pbi px-300 py-100 text-200 font-bold text-pbi-foreground">
            <History className="icon-size-100" aria-hidden />
            Replay
          </p>
          <h1 className="text-hero-700 font-extrabold leading-hero-700 sm:text-hero-800 sm:leading-hero-800">
            Every week of Microsoft Marketplace, replayed.
          </h1>
          <p className="mt-200 max-w-[64ch] text-400 leading-400 text-muted-foreground">
            Every dot is a custom visual, placed by its popularity, its number of
            ratings and its average stars. Watch visuals join, climb, slide and
            leave, from {formatDate(replay.frames[0].end)} to{' '}
            {formatDate(replay.frames[last].end)}. Follow up to {MAX_PICKS} visuals
            to see only their paths.
          </p>

          <div className="mt-500 flex flex-wrap items-center gap-400">
            <button
              type="button"
              onClick={toggle}
              aria-label={running ? 'Pause the replay' : at >= last ? 'Play the replay from the start' : 'Play the replay'}
              className="inline-flex min-h-[48px] items-center gap-200 rounded-full bg-primary px-500 text-300 font-bold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {running ? (
                <Pause className="icon-size-200" aria-hidden />
              ) : (
                <Play className="icon-size-200" aria-hidden />
              )}
              {running ? 'Pause' : at >= last ? 'Play again' : 'Play'}
            </button>
            <div className="min-w-0">
              <p className="tabular font-heading text-500 font-extrabold leading-500">
                {label}
              </p>
              <p className="tabular text-200 text-muted-foreground">
                Week {formatInt(at + 1)} of {formatInt(last + 1)}
              </p>
            </div>
          </div>
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
            className="mt-400 h-[44px] w-full cursor-pointer accent-[var(--color-pbi)]"
          />
        </section>

        <div className="grid grid-cols-2 gap-300 md:grid-cols-5">
          <Kpi label="Listed visuals" value={formatInt(frame.listed)} />
          <Kpi label="Joined this week" value={formatInt(frame.arrived.length)} />
          <Kpi label="Left this week" value={formatInt(frame.left.length)} />
          <Kpi
            label="Moved 5 points or more"
            value={formatInt(frame.bigMoves)}
          />
          <Kpi
            label="Biggest jump this week"
            value={jump ? formatScoreChange(jump.delta) : 'None'}
            hint={jumper?.name ?? 'No visual gained ground this week.'}
            className="col-span-2 md:col-span-1 [&>span:last-child]:truncate"
          />
        </div>

        <Card
          title={picks.length > 0 ? 'The visuals you follow' : 'The whole field'}
          subtitle={
            flat
              ? 'Each listed visual, placed by its popularity score at the end of the week.'
              : 'The number of ratings runs across, popularity rises upward, and average stars run front to back, with 3 stars in the middle. Drag to turn the view, point at a dot to see the visual, and select it for details.'
          }
          actions={
            <div className="flex flex-wrap items-center gap-200">
              {picks.length === 0 && (
                <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-200 rounded-full border border-border px-300 text-200 font-semibold hover:bg-hover has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={showUnrated}
                    onChange={(e) => setShowUnrated(e.target.checked)}
                    className="size-[18px] accent-[var(--color-pbi)]"
                  />
                  Include visuals with no ratings ({formatInt(unrated)})
                </label>
              )}
              {!flat && (
              <button
                type="button"
                onClick={() => setResetSignal((n) => n + 1)}
                className="inline-flex min-h-[44px] items-center gap-100 rounded-full border border-border px-300 text-200 font-semibold hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
              >
                <RotateCcw className="icon-size-100" aria-hidden />
                Reset view
              </button>
              )}
            </div>
          }
          bodyClassName="flex flex-col gap-300"
        >
          <Picker
            standings={byIndex}
            replay={replay}
            at={at}
            picks={picks}
            onPicks={setPicks}
          />
          {flat ? (
            <DotField
              replay={replay}
              at={at}
              standings={byIndex}
              picks={picks}
              showUnrated={showUnrated}
              onOpen={onOpen}
            />
          ) : (
            <Suspense
              fallback={
                <LoadingBlock
                  label="Loading the 3D view"
                  className="h-[340px] rounded-2xl border border-border sm:h-[480px]"
                />
              }
            >
              <Replay3D
                replay={replay}
                at={at}
                standings={byIndex}
                picks={picks}
                showUnrated={showUnrated}
                resetSignal={resetSignal}
                reducedMotion={reducedMotion}
                onOpen={onOpen}
                onUnsupported={() => setFlat(true)}
              />
            </Suspense>
          )}
          {picks.length === 0 && <Legend />}
          {note && (
            <p className="rounded-xl bg-accent px-300 py-200 text-300 leading-300">{note}</p>
          )}
        </Card>

        <div className="grid grid-cols-1 gap-400 lg:grid-cols-2">
          <Race
            title="Climbing"
            subtitle={
              race.from
                ? `Score gained between ${formatDate(race.from)} and ${formatDate(frame.end)}.`
                : 'Score gained over the previous four weeks.'
            }
            icon={<TrendingUp className="icon-size-300 text-up" aria-hidden />}
            moves={race.climbers}
            standings={byIndex}
            tone="up"
            empty="No listed visual gained ground over these weeks."
            onOpen={onOpen}
          />
          <Race
            title="Sliding"
            subtitle={
              race.from
                ? `Score lost between ${formatDate(race.from)} and ${formatDate(frame.end)}.`
                : 'Score lost over the previous four weeks.'
            }
            icon={<TrendingDown className="icon-size-300 text-down" aria-hidden />}
            moves={race.sliders}
            standings={byIndex}
            tone="down"
            empty="No listed visual lost ground over these weeks."
            onOpen={onOpen}
          />
        </div>
      </div>
    </MotionConfig>
  );
}
