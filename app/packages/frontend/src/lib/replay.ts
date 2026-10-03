import type { QueryTableLike } from '@/lib/to-data-table';
import { asNumber, asString, daysBefore, readRows } from '@/lib/table';

/**
 * The replay, one frame per day.
 *
 * Two records feed it, and they are dated differently. Listings, new versions
 * and certifications are dated to the day for the whole replay. Popularity,
 * ratings and stars are known only on the days the leaderboard was read, which
 * was about weekly until spring 2026 and daily since June 2026. So every day
 * has a frame of listings, and the days in between two readings take their
 * figures from a straight line between those readings.
 */

/** Bits of `ReplayFrame.state`. */
export const LISTED = 1;
export const CERTIFIED = 4;
/** Bit of the query's `Listing` column: a new version that day. Never kept in `state`. */
const NEW_VERSION = 2;

/** One day of the replay: who was listed and certified when the day ended. */
export interface ReplayFrame {
  day: Date;
  /**
   * `LISTED` and `CERTIFIED` bits per visual, indexed like `Replay.guids`. The
   * same array as the previous frame's when nothing changed that day, so treat
   * it as read only.
   */
  state: Uint8Array;
  /**
   * New versions each visual published from the second frame up to and
   * including this one. Shared with the previous frame like `state`.
   */
  versions: Uint16Array;
  /** The latest reading made on or before this day, as an index into `Replay.readings`. -1 before the first. */
  reading: number;
  /** Visuals listed this day that were not listed the day before. Empty on the first frame. */
  arrived: number[];
  left: number[];
  /** Listed visuals that published a new version this day. */
  versioned: number[];
  /** Visuals listed on both days that became certified this day. */
  certified: number[];
  uncertified: number[];
}

/** One day the leaderboard was read. */
export interface Reading {
  /** The frame of the day it was read. */
  frame: number;
  /**
   * Each visual's popularity (0 to 1), number of ratings and average stars as
   * known that day. The leaderboard records a visual only when its figures
   * change, so a visual absent from this reading keeps its previous figures.
   * NaN while a visual has never been read.
   */
  scores: Float32Array;
  raters: Float32Array;
  stars: Float32Array;
  /** The frame of each visual's latest reading up to this one, -1 while it has never been read. */
  readOn: Int32Array;
}

export interface Replay {
  guids: string[];
  frames: ReplayFrame[];
  readings: Reading[];
  /** The frame of the first reading, -1 when the leaderboard was never read. */
  firstReading: number;
  /**
   * Each visual's first known figures, which place it before its first reading.
   * NaN for a visual that was never read.
   */
  first: { score: Float32Array; raters: Float32Array; stars: Float32Array };
}

/** Figures for every visual on one day. NaN for a visual that was never read. */
export interface Values {
  score: Float32Array;
  raters: Float32Array;
  stars: Float32Array;
}

export interface Move {
  index: number;
  guid: string;
  delta: number;
  score: number;
}

const BIG_MOVE = 0.05;
const MOVE = 0.0005;

const EMPTY: Replay = {
  guids: [],
  frames: [],
  readings: [],
  firstReading: -1,
  first: { score: new Float32Array(0), raters: new Float32Array(0), stars: new Float32Array(0) },
};

interface Row {
  index: number;
  popularity: number | null;
  raters: number | null;
  stars: number | null;
  listing: number | null;
}

/**
 * Builds daily frames from the replay query. `asOf` is the day of the latest
 * snapshot, day 0. A row's `Listing` says whether the visual ended the day
 * listed (1) and certified (4), and whether it published a new version that day
 * (2). The state a row records holds until that visual's next row. A row with
 * no popularity was not a reading: it records only a change of listing.
 */
export function buildReplay(table: QueryTableLike, asOf: Date): Replay {
  const raw = readRows(table, (get) => ({
    guid: asString(get('[Visual]')),
    day: asNumber(get('[Day]')),
    popularity: asNumber(get('[Popularity]')),
    raters: asNumber(get('[Raters]')),
    stars: asNumber(get('[Stars]')),
    listing: asNumber(get('[Listing]')),
  }));

  const indexOf = new Map<string, number>();
  const guids: string[] = [];
  const byDay = new Map<number, Row[]>();
  let oldest = -1;
  for (const r of raw) {
    if (r.guid === '' || r.day == null || r.day < 0) continue;
    if (r.popularity == null && r.listing == null) continue;
    let index = indexOf.get(r.guid);
    if (index === undefined) {
      index = guids.length;
      indexOf.set(r.guid, index);
      guids.push(r.guid);
    }
    oldest = Math.max(oldest, r.day);
    const bucket = byDay.get(r.day) ?? [];
    bucket.push({ index, popularity: r.popularity, raters: r.raters, stars: r.stars, listing: r.listing });
    byDay.set(r.day, bucket);
  }
  if (oldest < 0) return EMPTY;

  const n = guids.length;
  let state = new Uint8Array(n);
  let versions = new Uint16Array(n);
  const scores = new Float32Array(n).fill(NaN);
  const raters = new Float32Array(n).fill(NaN);
  const stars = new Float32Array(n).fill(NaN);
  const readOn = new Int32Array(n).fill(-1);
  const frames: ReplayFrame[] = [];
  const readings: Reading[] = [];

  for (let day = oldest; day >= 0; day--) {
    const i = frames.length;
    const prev = state;
    const rows = byDay.get(day) ?? [];
    let next: Uint8Array | null = null;
    let counted: Uint16Array | null = null;
    let read = false;
    const versioned: number[] = [];
    for (const row of rows) {
      const v = row.index;
      const isReading = row.popularity != null;
      // A row without a Listing still shows that a visual with a reading is listed.
      const listing =
        row.listing ?? (isReading ? (prev[v] & CERTIFIED) | LISTED : prev[v]);
      const bits = listing & (LISTED | CERTIFIED);
      if (bits !== (next ?? prev)[v]) {
        next ??= prev.slice();
        next[v] = bits;
      }
      if (i > 0 && (listing & NEW_VERSION) !== 0 && (bits & LISTED) !== 0) {
        counted ??= versions.slice();
        counted[v] = Math.min(65535, counted[v] + 1);
        versioned.push(v);
      }
      if (isReading) {
        read = true;
        scores[v] = row.popularity!;
        // A reading with no ratings count is a visual nobody has rated yet.
        if (row.raters != null) raters[v] = row.raters;
        else if (Number.isNaN(raters[v])) raters[v] = 0;
        if (row.stars != null) stars[v] = row.stars;
        else if (Number.isNaN(stars[v])) stars[v] = 0;
        readOn[v] = i;
      }
    }
    if (next) state = next;
    if (counted) versions = counted;

    const arrived: number[] = [];
    const left: number[] = [];
    const certified: number[] = [];
    const uncertified: number[] = [];
    if (i > 0 && state !== prev) {
      for (let v = 0; v < n; v++) {
        const was = prev[v];
        const is = state[v];
        if (was === is) continue;
        const listedNow = (is & LISTED) !== 0;
        const listedBefore = (was & LISTED) !== 0;
        if (listedNow && !listedBefore) arrived.push(v);
        else if (!listedNow && listedBefore) left.push(v);
        else if (listedNow && listedBefore) {
          if ((is & CERTIFIED) !== 0 && (was & CERTIFIED) === 0) certified.push(v);
          else if ((is & CERTIFIED) === 0 && (was & CERTIFIED) !== 0) uncertified.push(v);
        }
      }
    }

    if (read) {
      readings.push({
        frame: i,
        scores: scores.slice(),
        raters: raters.slice(),
        stars: stars.slice(),
        readOn: readOn.slice(),
      });
    }
    frames.push({
      day: daysBefore(asOf, day),
      state,
      versions,
      reading: readings.length - 1,
      arrived,
      left,
      versioned,
      certified,
      uncertified,
    });
  }

  // The figures of each visual's first reading, so a visual can be placed before it.
  const first = {
    score: new Float32Array(n).fill(NaN),
    raters: new Float32Array(n).fill(NaN),
    stars: new Float32Array(n).fill(NaN),
  };
  for (let k = readings.length - 1; k >= 0; k--) {
    const r = readings[k];
    for (let v = 0; v < n; v++) {
      if (r.readOn[v] === r.frame) {
        first.score[v] = r.scores[v];
        first.raters[v] = r.raters[v];
        first.stars[v] = r.stars[v];
      }
    }
  }

  return {
    guids,
    frames,
    readings,
    firstReading: readings.length > 0 ? readings[0].frame : -1,
    first,
  };
}

function known(values: Float32Array, first: Float32Array, v: number): number {
  const value = values[v];
  return Number.isNaN(value) ? first[v] : value;
}

/**
 * The two readings day `at` lies between, and how far along from the first to
 * the second it is (0 to 1). Both are the same reading, at 0, before the first
 * reading and from the last one on. -1 when the leaderboard was never read.
 */
export function spanAt(replay: Replay, at: number): { from: number; to: number; f: number } {
  const last = replay.readings.length - 1;
  if (last < 0) return { from: -1, to: -1, f: 0 };
  const k = replay.frames[at]?.reading ?? -1;
  if (k < 0) return { from: 0, to: 0, f: 0 };
  if (k >= last) return { from: last, to: last, f: 0 };
  const a = replay.readings[k].frame;
  const b = replay.readings[k + 1].frame;
  return { from: k, to: k + 1, f: (at - a) / (b - a) };
}

/**
 * Every visual's figures as of reading `k`, with a visual not read by then
 * placed at its first reading. NaN for a visual that was never read.
 */
export function readingValues(replay: Replay, k: number, out?: Values): Values {
  const n = replay.guids.length;
  const values = out ?? {
    score: new Float32Array(n),
    raters: new Float32Array(n),
    stars: new Float32Array(n),
  };
  const reading = replay.readings[k];
  const { first } = replay;
  for (let v = 0; v < n; v++) {
    values.score[v] = reading ? known(reading.scores, first.score, v) : NaN;
    values.raters[v] = reading ? known(reading.raters, first.raters, v) : NaN;
    values.stars[v] = reading ? known(reading.stars, first.stars, v) : NaN;
  }
  return values;
}

/**
 * Every visual's figures on day `at`. On a day between two readings they lie
 * on a straight line between the two, so a visual glides from one reading to
 * the next instead of jumping on the day it was read. Before the first reading
 * and after the last they hold.
 */
export function valuesAt(replay: Replay, at: number, out?: Values): Values {
  const { from, to, f } = spanAt(replay, at);
  const values = readingValues(replay, from, out);
  if (to === from) return values;
  const next = readingValues(replay, to);
  for (let v = 0; v < replay.guids.length; v++) {
    values.score[v] += (next.score[v] - values.score[v]) * f;
    values.raters[v] += (next.raters[v] - values.raters[v]) * f;
    values.stars[v] += (next.stars[v] - values.stars[v]) * f;
  }
  return values;
}

/**
 * A visual's latest reading on or before day `at`: its figures and the frame of
 * the day they were read. Null while it has not been read.
 */
export function lastReading(
  replay: Replay,
  at: number,
  v: number
): { frame: number; score: number; raters: number; stars: number } | null {
  const reading = replay.readings[replay.frames[at]?.reading ?? -1];
  if (!reading || reading.readOn[v] < 0) return null;
  return {
    frame: reading.readOn[v],
    score: reading.scores[v],
    raters: reading.raters[v],
    stars: reading.stars[v],
  };
}

/** Each visual's popularity as last read on or before day `at`, NaN when it has not been read. */
function readScores(replay: Replay, at: number): Float32Array | undefined {
  return replay.readings[replay.frames[at]?.reading ?? -1]?.scores;
}

function isListed(frame: ReplayFrame, v: number): boolean {
  return (frame.state[v] & LISTED) !== 0;
}

/**
 * The visuals whose popularity moved most between `lookback` days before day
 * `at` and day `at`, each as last read by that day. Only visuals listed and
 * read at both ends count, so an arrival or a farewell is never mistaken for a
 * climb or a slide.
 */
export function movers(
  replay: Replay,
  at: number,
  lookback: number,
  limit: number,
  /** When given, only the visuals it accepts are ranked. */
  include?: (index: number) => boolean
): { from: Date | null; climbers: Move[]; sliders: Move[] } {
  const frame = replay.frames[at];
  const base = replay.frames[Math.max(0, at - lookback)];
  const now = readScores(replay, at);
  const then = readScores(replay, Math.max(0, at - lookback));
  if (!frame || !base || base === frame || !now || !then) {
    return { from: null, climbers: [], sliders: [] };
  }
  const moves: Move[] = [];
  for (let v = 0; v < replay.guids.length; v++) {
    if (include && !include(v)) continue;
    if (!isListed(frame, v) || !isListed(base, v)) continue;
    if (Number.isNaN(now[v]) || Number.isNaN(then[v])) continue;
    const delta = now[v] - then[v];
    if (Math.abs(delta) > MOVE) moves.push({ index: v, guid: replay.guids[v], delta, score: now[v] });
  }
  const climbers = moves
    .filter((m) => m.delta > 0)
    .sort((a, b) => b.delta - a.delta || b.score - a.score || a.guid.localeCompare(b.guid))
    .slice(0, limit);
  const sliders = moves
    .filter((m) => m.delta < 0)
    .sort((a, b) => a.delta - b.delta || b.score - a.score || a.guid.localeCompare(b.guid))
    .slice(0, limit);
  return { from: base.day, climbers, sliders };
}

/**
 * The visuals that joined and left between `lookback` days before day `at` and
 * day `at`, the most popular first.
 */
export function comings(
  replay: Replay,
  at: number,
  lookback: number,
  /** When given, only the visuals it accepts are listed. */
  include?: (index: number) => boolean
): { from: Date | null; joined: number[]; left: number[] } {
  const frame = replay.frames[at];
  const base = replay.frames[Math.max(0, at - lookback)];
  if (!frame || !base || base === frame) return { from: null, joined: [], left: [] };
  const joined: number[] = [];
  const left: number[] = [];
  for (let v = 0; v < replay.guids.length; v++) {
    if (include && !include(v)) continue;
    const now = isListed(frame, v);
    if (now === isListed(base, v)) continue;
    (now ? joined : left).push(v);
  }
  const byPlace = placeOrder(replay, at);
  return { from: base.day, joined: joined.sort(byPlace), left: left.sort(byPlace) };
}

/** Sorts visuals the most popular first as of day `at`, with a visual never read last. */
function placeOrder(replay: Replay, at: number): (a: number, b: number) => number {
  const scores = readScores(replay, at);
  const place = (v: number) => {
    const score = scores ? known(scores, replay.first.score, v) : replay.first.score[v];
    return Number.isNaN(score) ? -1 : score;
  };
  return (a, b) => place(b) - place(a) || replay.guids[a].localeCompare(replay.guids[b]);
}

/**
 * The visuals certified on day `at` that were listed but not certified
 * `lookback` days before, the most popular first. A visual that joined already
 * certified is counted as joining, not here.
 */
export function certifiedSince(
  replay: Replay,
  at: number,
  lookback: number,
  /** When given, only the visuals it accepts are listed. */
  include?: (index: number) => boolean
): { from: Date | null; certified: number[] } {
  const frame = replay.frames[at];
  const base = replay.frames[Math.max(0, at - lookback)];
  if (!frame || !base || base === frame) return { from: null, certified: [] };
  const certified: number[] = [];
  for (let v = 0; v < replay.guids.length; v++) {
    if (include && !include(v)) continue;
    if (!isListed(frame, v) || !isListed(base, v)) continue;
    if ((frame.state[v] & CERTIFIED) !== 0 && (base.state[v] & CERTIFIED) === 0) certified.push(v);
  }
  return { from: base.day, certified: certified.sort(placeOrder(replay, at)) };
}

export interface FrameCounts {
  listed: number;
  /** Listed visuals nobody has rated yet. */
  unrated: number;
  /** Listed visuals the leaderboard had not read by this day. */
  unread: number;
  /** Of those, the visuals it never read at all, which have no place on the popularity axis. */
  unplaced: number;
  arrived: number;
  left: number;
  /** Listed visuals whose popularity moved by 5 points or more in a reading made this day. */
  bigMoves: number;
  /** Listed visuals that published a new version this day. */
  versions: number;
  /** Listed visuals that became certified this day. */
  certified: number;
}

/** A day's counts, for all visuals or for the subset `include` accepts, such as the certified ones. */
export function frameCounts(
  replay: Replay,
  at: number,
  include?: (index: number) => boolean
): FrameCounts {
  const counts: FrameCounts = {
    listed: 0,
    unrated: 0,
    unread: 0,
    unplaced: 0,
    arrived: 0,
    left: 0,
    bigMoves: 0,
    versions: 0,
    certified: 0,
  };
  const frame = replay.frames[at];
  if (!frame) return counts;
  const reading = replay.readings[frame.reading];
  // Only a reading made this day moves anything.
  const readToday = reading && reading.frame === at;
  const before = readToday ? replay.readings[frame.reading - 1] : undefined;
  const ok = (v: number) => !include || include(v);
  for (let v = 0; v < replay.guids.length; v++) {
    if (!ok(v) || !isListed(frame, v)) continue;
    counts.listed++;
    const ratedBy = reading ? known(reading.raters, replay.first.raters, v) : replay.first.raters[v];
    if (!(ratedBy > 0)) counts.unrated++;
    if (!reading || reading.readOn[v] < 0) counts.unread++;
    if (Number.isNaN(replay.first.score[v])) counts.unplaced++;
    // NaN on either side, a visual with nothing to compare, is never a move.
    if (before && Math.abs(reading.scores[v] - before.scores[v]) >= BIG_MOVE - MOVE) counts.bigMoves++;
  }
  counts.arrived = frame.arrived.filter(ok).length;
  counts.left = frame.left.filter(ok).length;
  counts.versions = frame.versioned.filter(ok).length;
  counts.certified = frame.certified.filter(ok).length;
  return counts;
}

/**
 * How much bigger a visual is drawn for the versions it published since frame
 * `since`: the square root of the count, so the first versions show and a
 * visual that publishes every week does not fill the view.
 */
export function growth(replay: Replay, at: number, since: number, v: number): number {
  const now = replay.frames[at]?.versions[v] ?? 0;
  const then = replay.frames[Math.max(0, since)]?.versions[v] ?? 0;
  return Math.min(2.2, 1 + 0.22 * Math.sqrt(Math.max(0, now - then)));
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

/**
 * The two ways to play the replay. `scores` places each visual by its
 * popularity, ratings and stars, so it can start only once the leaderboard was
 * first read. `listings` follows arrivals, new versions and certifications,
 * which are dated for the whole replay.
 */
export type ReplayMode = 'scores' | 'listings';

/** The first frame a mode can show. */
export function modeStart(replay: Replay, mode: ReplayMode): number {
  return mode === 'scores' ? Math.max(0, replay.firstReading) : 0;
}

/** A stable pseudo-random number in [0, 1) for a visual, so its place holds from day to day. */
export function jitter(guid: string, salt = ''): number {
  let h = 2166136261;
  const text = salt + guid;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}
