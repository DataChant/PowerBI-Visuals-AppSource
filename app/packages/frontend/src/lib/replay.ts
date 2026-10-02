import type { QueryTableLike } from '@/lib/to-data-table';
import { asNumber, asString, daysBefore, readRows } from '@/lib/table';

/** One week of the replay: where every visual stood when the week ended. */
export interface ReplayFrame {
  /** The last day of the week. */
  end: Date;
  /** 1 while a visual is listed, 0 while it is not. Indexed like `Replay.guids`. */
  present: Uint8Array;
  /**
   * Popularity per visual (0 to 1). NaN while a visual is not listed, and while
   * it is listed with no score recorded for it yet.
   */
  scores: Float32Array;
  /**
   * Where each visual's dot sits, listed or not: its score, its last score once
   * it has left, or its first score before one was recorded. Lets a dot appear
   * and disappear in place instead of flying in from the axis. NaN for a visual
   * that never had a score.
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
  /** Listed visuals that published a new version this week. */
  versions: number[];
  /** Listed visuals that became certified this week. */
  certified: number[];
  /** Listed visuals whose score changed since the previous week. */
  changed: number;
  /** Listed visuals whose score moved by 5 points or more since the previous week. */
  bigMoves: number;
  /** A popularity score was recorded for at least one visual this week. */
  scored: boolean;
  /**
   * The week sits in a stretch when no popularity was recorded at all: the
   * weeks before the first score, and any run of eight weeks or more without
   * one. Listings, versions and certifications are still known in it.
   */
  unscored: boolean;
  /** The latest frame up to this one in which a score was recorded, or -1 when there is none yet. */
  scoredAt: number;
  /** The first week with scores after an unscored stretch, when every score moves at once. */
  resumed: boolean;
  /**
   * Almost nothing happened this week: under 2% of listed visuals moved or, in
   * an unscored stretch, nothing was recorded at all.
   */
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
/** This many weeks in a row without a score is a stretch when popularity was not recorded. */
const UNSCORED_RUN = 8;

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
 *
 * A row's `Listing` says whether the visual ends the week listed (1), published
 * a new version (2) or became certified (4). A row may carry that alone, with no
 * score: the record before the daily leaderboard knows who was listed, but not
 * how popular they were.
 */
export function buildReplay(table: QueryTableLike, asOf: Date): Replay {
  const rows = readRows(table, (get) => ({
    guid: asString(get('[Visual]')),
    week: asNumber(get('[Week]')),
    packed: asNumber(get('[Latest]')),
    raters: unpackRaters(asNumber(get('[Raters]'))),
    stars: unpackStars(asNumber(get('[Stars]'))),
    listing: asNumber(get('[Listing]')),
  })).filter(
    (
      r
    ): r is {
      guid: string;
      week: number;
      packed: number | null;
      raters: number;
      stars: number;
      listing: number | null;
    } => r.guid !== '' && r.week != null && (r.packed != null || r.listing != null)
  );
  if (rows.length === 0) return { guids: [], frames: [] };

  const indexOf = new Map<string, number>();
  const guids: string[] = [];
  const byWeek = new Map<
    number,
    {
      index: number;
      /** NaN when the row carries no score. */
      score: number;
      present: boolean;
      raters: number;
      stars: number;
      version: boolean;
      certified: boolean;
    }[]
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
    const latest = r.packed == null ? null : unpack(r.packed);
    const bucket = byWeek.get(r.week) ?? [];
    bucket.push({
      index,
      score: latest && !latest.removed ? latest.score : NaN,
      // Without a Listing, a visual is listed unless the row records its removal.
      present: r.listing != null ? (r.listing & 1) === 1 : !latest?.removed,
      raters: r.raters,
      stars: r.stars,
      version: r.listing != null && (r.listing & 2) !== 0,
      certified: r.listing != null && (r.listing & 4) !== 0,
    });
    byWeek.set(r.week, bucket);
  }

  const n = guids.length;
  const present = new Uint8Array(n);
  // A listed visual's last recorded score. It is forgotten when the visual leaves.
  const held = new Float32Array(n).fill(NaN);
  const raters = new Float32Array(n).fill(NaN);
  const stars = new Float32Array(n).fill(NaN);
  const raw: {
    end: Date;
    present: Uint8Array;
    scores: Float32Array;
    raters: Float32Array;
    stars: Float32Array;
    versions: number[];
    certified: number[];
    scored: boolean;
  }[] = [];
  for (let week = oldest; week >= 0; week--) {
    const versions: number[] = [];
    const certified: number[] = [];
    let scored = false;
    for (const c of byWeek.get(week) ?? []) {
      present[c.index] = c.present ? 1 : 0;
      if (!c.present) held[c.index] = NaN;
      else if (!Number.isNaN(c.score)) {
        held[c.index] = c.score;
        scored = true;
      }
      if (!Number.isNaN(c.raters)) raters[c.index] = c.raters;
      if (!Number.isNaN(c.stars)) stars[c.index] = c.stars;
      if (c.present && c.version) versions.push(c.index);
      if (c.present && c.certified) certified.push(c.index);
    }
    raw.push({
      end: daysBefore(asOf, week * 7),
      present: present.slice(),
      scores: held.slice(),
      raters: raters.slice(),
      stars: stars.slice(),
      versions,
      certified,
      scored,
    });
  }

  // Popularity was not recorded in the weeks before the first score, nor in any
  // long run of weeks without one. A short run is only a quiet spell.
  const unscored = raw.map(() => false);
  for (let i = 0; i < raw.length; ) {
    if (raw[i].scored) {
      i++;
      continue;
    }
    let end = i;
    while (end < raw.length && !raw[end].scored) end++;
    if (i === 0 || end - i >= UNSCORED_RUN) unscored.fill(true, i, end);
    i = end;
  }

  // Positions: forward-fill each visual's last score, then back-fill its first.
  const positions = raw.map((f) => f.scores.slice());
  carry(positions, n);
  const allRaters = raw.map((f) => f.raters);
  const allStars = raw.map((f) => f.stars);
  carry(allRaters, n);
  carry(allStars, n);

  const frames: ReplayFrame[] = [];
  let quietRun = 0;
  let scoredAt = -1;
  raw.forEach((f, i) => {
    const prev = i > 0 ? raw[i - 1] : null;
    const arrived: number[] = [];
    const left: number[] = [];
    let listed = 0;
    let changed = 0;
    let bigMoves = 0;
    for (let v = 0; v < n; v++) {
      const isListed = f.present[v] === 1;
      if (isListed) listed++;
      if (!prev) continue;
      const wasListed = prev.present[v] === 1;
      if (isListed && !wasListed) arrived.push(v);
      else if (!isListed && wasListed) left.push(v);
      else if (isListed && wasListed) {
        // A first score has nothing to be compared with, so it is not a move.
        const delta = Math.abs(f.scores[v] - prev.scores[v]);
        if (delta > 0.0005) changed++;
        if (delta >= BIG_MOVE - 0.0005) bigMoves++;
      }
    }
    if (f.scored) scoredAt = i;
    const resumed = f.scored && i > 0 && unscored[i - 1];
    const quiet = unscored[i]
      ? prev != null &&
        arrived.length + left.length + f.versions.length + f.certified.length === 0
      : !resumed && prev != null && changed < QUIET_SHARE * listed;
    // Only the weeks with scores have a pace to catch up with.
    const paced = !unscored[i] && !resumed;
    frames.push({
      end: f.end,
      present: f.present,
      scores: f.scores,
      positions: positions[i],
      raters: allRaters[i],
      stars: allStars[i],
      listed,
      arrived,
      left,
      versions: f.versions,
      certified: f.certified,
      changed,
      bigMoves,
      scored: f.scored,
      unscored: unscored[i],
      scoredAt,
      resumed,
      quiet,
      catchUp: paced && !quiet && quietRun >= QUIET_RUN,
    });
    quietRun = paced && quiet ? quietRun + 1 : 0;
  });

  return { guids, frames };
}

/**
 * The day popularity was last recorded before frame `at`, or null when it never
 * was. In the week scores come back after an unscored stretch, every change is
 * measured from that day, not from the week before.
 */
export function lastScoredBefore(replay: Replay, at: number): Date | null {
  const before = replay.frames[at - 1];
  return before && before.scoredAt >= 0 ? replay.frames[before.scoredAt].end : null;
}

/**
 * The visuals that moved most between `lookback` weeks before frame `at` and
 * frame `at`. Only visuals with a score at both ends count, so an arrival or a
 * farewell is never mistaken for a climb or a slide. `from` is the day the
 * earlier scores were recorded, which is before the earlier frame when that
 * frame sits in an unscored stretch.
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
  if (!frame || !base || base === frame) return { from: null, climbers: [], sliders: [] };
  const moves: Move[] = [];
  for (let v = 0; v < replay.guids.length; v++) {
    if (include && !include(v)) continue;
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
  const from =
    base.unscored && base.scoredAt >= 0 ? replay.frames[base.scoredAt].end : base.end;
  return { from, climbers, sliders };
}

/**
 * The visuals that joined and left between `lookback` weeks before frame `at`
 * and frame `at`, the most popular first. It is what the record can still tell
 * about a stretch in which popularity was not recorded.
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
    if (frame.present[v] === base.present[v]) continue;
    (frame.present[v] === 1 ? joined : left).push(v);
  }
  // A visual with no score at all sorts last.
  const place = (v: number) => (Number.isNaN(frame.positions[v]) ? -1 : frame.positions[v]);
  const byPlace = (a: number, b: number) =>
    place(b) - place(a) || replay.guids[a].localeCompare(replay.guids[b]);
  return { from: base.end, joined: joined.sort(byPlace), left: left.sort(byPlace) };
}

export interface FrameCounts {
  listed: number;
  /** Listed visuals nobody has rated yet. */
  unrated: number;
  arrived: number;
  left: number;
  bigMoves: number;
  /** Listed visuals that published a new version this week. */
  versions: number;
  /** Listed visuals that became certified this week. */
  certified: number;
}

/**
 * A week's counts for a subset of the visuals, such as the certified ones.
 * With no `include` it returns the same numbers the frame itself carries.
 */
export function frameCounts(
  replay: Replay,
  at: number,
  include?: (index: number) => boolean
): FrameCounts {
  const counts: FrameCounts = {
    listed: 0,
    unrated: 0,
    arrived: 0,
    left: 0,
    bigMoves: 0,
    versions: 0,
    certified: 0,
  };
  const frame = replay.frames[at];
  if (!frame) return counts;
  const prev = at > 0 ? replay.frames[at - 1].scores : null;
  const ok = (v: number) => !include || include(v);
  for (let v = 0; v < replay.guids.length; v++) {
    if (!ok(v) || frame.present[v] !== 1) continue;
    counts.listed++;
    if (!(frame.raters[v] > 0)) counts.unrated++;
    // NaN on either side, a visual with no score to compare, is never a move.
    if (prev && Math.abs(frame.scores[v] - prev[v]) >= BIG_MOVE - 0.0005) counts.bigMoves++;
  }
  counts.arrived = frame.arrived.filter(ok).length;
  counts.left = frame.left.filter(ok).length;
  counts.versions = frame.versions.filter(ok).length;
  counts.certified = frame.certified.filter(ok).length;
  return counts;
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
