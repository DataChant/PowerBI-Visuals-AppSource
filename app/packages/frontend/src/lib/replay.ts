import type { QueryTableLike } from '@/lib/to-data-table';
import { asNumber, asString, daysBefore, readRows } from '@/lib/table';

/** One week of the replay: where every visual stood when the week ended. */
export interface ReplayFrame {
  /** The last day of the week. */
  end: Date;
  /** Popularity per visual (0 to 1), NaN while a visual is not listed. Indexed like `Replay.guids`. */
  scores: Float32Array;
  /**
   * Where each visual's dot sits, listed or not: its score, its last score once
   * it has left, or its first score before it arrives. Lets a dot appear and
   * disappear in place instead of flying in from the axis.
   */
  positions: Float32Array;
  /**
   * Number of ratings and average stars (1 to 5, 0 while unrated), carried the
   * same way as `positions`, so a dot that is not listed still has a place.
   */
  raters: Float32Array;
  stars: Float32Array;
  listed: number;
  arrived: number[];
  left: number[];
  /** Listed visuals whose score changed since the previous week. */
  changed: number;
  /** Listed visuals whose score moved by 5 points or more since the previous week. */
  bigMoves: number;
  /** Almost nothing changed this week: under 2% of listed visuals moved. */
  quiet: boolean;
  /** The first busy week after a long quiet stretch, when the record caught up at once. */
  catchUp: boolean;
}

export interface Replay {
  guids: string[];
  frames: ReplayFrame[];
}

export interface Move {
  index: number;
  guid: string;
  delta: number;
  score: number;
}

/** A week counts as quiet when fewer than this share of listed visuals changed. */
const QUIET_SHARE = 0.02;
/** A busy week after at least this many quiet weeks is a catch-up week. */
const QUIET_RUN = 4;
const BIG_MOVE = 0.05;

/**
 * Unpacks the replay query's `Latest` column: day * 10000 + score in
 * thousandths * 2 + removed. See popularity-replay.dax.
 */
export function unpack(packed: number): { score: number; removed: boolean } {
  const rest = packed % 10000;
  return { score: Math.floor(rest / 2) / 1000, removed: rest % 2 === 1 };
}

/** Unpacks the `Raters` column: day * 100000 + number of ratings. NaN when blank. */
export function unpackRaters(packed: number | null): number {
  return packed == null ? NaN : packed % 100000;
}

/** Unpacks the `Stars` column: day * 1000 + average stars in hundredths. NaN when blank. */
export function unpackStars(packed: number | null): number {
  return packed == null ? NaN : (packed % 1000) / 100;
}

/** Fills each visual's gaps with its previous value, then the gaps before its first value with that first value. */
function carry(series: Float32Array[], n: number) {
  for (let i = 1; i < series.length; i++) {
    for (let v = 0; v < n; v++) {
      if (Number.isNaN(series[i][v])) series[i][v] = series[i - 1][v];
    }
  }
  for (let i = series.length - 2; i >= 0; i--) {
    for (let v = 0; v < n; v++) {
      if (Number.isNaN(series[i][v])) series[i][v] = series[i + 1][v];
    }
  }
}

/**
 * Builds weekly frames from the replay query. `asOf` is the latest snapshot
 * date, the end of week 0.
 */
export function buildReplay(table: QueryTableLike, asOf: Date): Replay {
  const rows = readRows(table, (get) => ({
    guid: asString(get('[Visual]')),
    week: asNumber(get('[Week]')),
    packed: asNumber(get('[Latest]')),
    raters: unpackRaters(asNumber(get('[Raters]'))),
    stars: unpackStars(asNumber(get('[Stars]'))),
  })).filter(
    (r): r is { guid: string; week: number; packed: number; raters: number; stars: number } =>
      r.guid !== '' && r.week != null && r.packed != null
  );
  if (rows.length === 0) return { guids: [], frames: [] };

  const indexOf = new Map<string, number>();
  const guids: string[] = [];
  const byWeek = new Map<
    number,
    { index: number; score: number; removed: boolean; raters: number; stars: number }[]
  >();
  let oldest = 0;
  for (const r of rows) {
    let index = indexOf.get(r.guid);
    if (index === undefined) {
      index = guids.length;
      indexOf.set(r.guid, index);
      guids.push(r.guid);
    }
    oldest = Math.max(oldest, r.week);
    const bucket = byWeek.get(r.week) ?? [];
    bucket.push({ index, raters: r.raters, stars: r.stars, ...unpack(r.packed) });
    byWeek.set(r.week, bucket);
  }

  const n = guids.length;
  const current = new Float32Array(n).fill(NaN);
  const raters = new Float32Array(n).fill(NaN);
  const stars = new Float32Array(n).fill(NaN);
  const raw: { end: Date; scores: Float32Array; raters: Float32Array; stars: Float32Array }[] = [];
  for (let week = oldest; week >= 0; week--) {
    for (const c of byWeek.get(week) ?? []) {
      current[c.index] = c.removed ? NaN : c.score;
      if (!Number.isNaN(c.raters)) raters[c.index] = c.raters;
      if (!Number.isNaN(c.stars)) stars[c.index] = c.stars;
    }
    raw.push({
      end: daysBefore(asOf, week * 7),
      scores: current.slice(),
      raters: raters.slice(),
      stars: stars.slice(),
    });
  }

  // The first crawl took several days to cover the catalog, so its opening
  // weeks are partial. Start where coverage is within 10% of the next week,
  // or every visual the crawl had not reached yet would look like an arrival.
  const count = (s: Float32Array) => s.reduce((k, v) => (Number.isNaN(v) ? k : k + 1), 0);
  let start = 0;
  while (start < raw.length - 1 && count(raw[start].scores) < 0.9 * count(raw[start + 1].scores)) {
    start++;
  }
  const kept = raw.slice(start);

  // Positions: forward-fill each visual's last score, then back-fill its first.
  const positions = kept.map((f) => f.scores.slice());
  carry(positions, n);
  const keptRaters = kept.map((f) => f.raters);
  const keptStars = kept.map((f) => f.stars);
  carry(keptRaters, n);
  carry(keptStars, n);

  const frames: ReplayFrame[] = [];
  let quietRun = 0;
  kept.forEach((f, i) => {
    const prev = i > 0 ? kept[i - 1].scores : null;
    const arrived: number[] = [];
    const left: number[] = [];
    let listed = 0;
    let changed = 0;
    let bigMoves = 0;
    for (let v = 0; v < n; v++) {
      const now = f.scores[v];
      const isListed = !Number.isNaN(now);
      if (isListed) listed++;
      if (!prev) continue;
      const before = prev[v];
      const wasListed = !Number.isNaN(before);
      if (isListed && !wasListed) arrived.push(v);
      else if (!isListed && wasListed) left.push(v);
      else if (isListed && wasListed) {
        const delta = Math.abs(now - before);
        if (delta > 0.0005) changed++;
        if (delta >= BIG_MOVE - 0.0005) bigMoves++;
      }
    }
    const quiet = prev != null && changed < QUIET_SHARE * listed;
    frames.push({
      end: f.end,
      scores: f.scores,
      positions: positions[i],
      raters: keptRaters[i],
      stars: keptStars[i],
      listed,
      arrived,
      left,
      changed,
      bigMoves,
      quiet,
      catchUp: !quiet && quietRun >= QUIET_RUN,
    });
    quietRun = quiet ? quietRun + 1 : 0;
  });

  return { guids, frames };
}

/**
 * The visuals that moved most between `lookback` weeks before frame `at` and
 * frame `at`. Only visuals listed at both ends count, so an arrival or a
 * farewell is never mistaken for a climb or a slide.
 */
export function movers(
  replay: Replay,
  at: number,
  lookback: number,
  limit: number
): { from: Date | null; climbers: Move[]; sliders: Move[] } {
  const frame = replay.frames[at];
  const base = replay.frames[Math.max(0, at - lookback)];
  if (!frame || !base || base === frame) return { from: null, climbers: [], sliders: [] };
  const moves: Move[] = [];
  for (let v = 0; v < replay.guids.length; v++) {
    const now = frame.scores[v];
    const before = base.scores[v];
    if (Number.isNaN(now) || Number.isNaN(before)) continue;
    const delta = now - before;
    if (Math.abs(delta) > 0.0005) moves.push({ index: v, guid: replay.guids[v], delta, score: now });
  }
  const climbers = moves
    .filter((m) => m.delta > 0)
    .sort((a, b) => b.delta - a.delta || b.score - a.score || a.guid.localeCompare(b.guid))
    .slice(0, limit);
  const sliders = moves
    .filter((m) => m.delta < 0)
    .sort((a, b) => a.delta - b.delta || b.score - a.score || a.guid.localeCompare(b.guid))
    .slice(0, limit);
  return { from: base.end, climbers, sliders };
}

/**
 * Average stars as a sentiment around a neutral 3: -2 (one star) to +2 (five
 * stars). Null while a visual has no ratings, since an unrated visual has no
 * sentiment at all, not a neutral one.
 */
export function sentiment(stars: number, raters: number): number | null {
  if (!(raters > 0) || !(stars >= 1)) return null;
  return stars - 3;
}

/** A stable pseudo-random number in [0, 1) for a visual, so its dot keeps its height between weeks. */
export function jitter(guid: string): number {
  let h = 2166136261;
  for (let i = 0; i < guid.length; i++) {
    h ^= guid.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}
