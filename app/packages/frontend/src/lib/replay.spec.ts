import { describe, it, expect } from 'vitest';

import {
  buildReplay,
  jitter,
  movers,
  sentiment,
  unpack,
  unpackRaters,
  unpackStars,
} from '@/lib/replay';

const asOf = new Date('2026-09-30T00:00:00Z');
const DAY = 46000; // any whole day number; only the low digits carry data

function pack(score: number, removed = false) {
  return DAY * 10000 + Math.round(score * 1000) * 2 + (removed ? 1 : 0);
}

function table(rows: [string, number, number][]) {
  return {
    columns: [{ name: '[Visual]' }, { name: '[Week]' }, { name: '[Latest]' }],
    rows,
  };
}

describe('unpack', () => {
  it('reads the score and the removal flag back out of the packed number', () => {
    expect(unpack(pack(0.734))).toEqual({ score: 0.734, removed: false });
    expect(unpack(pack(0.5, true))).toEqual({ score: 0.5, removed: true });
  });
});

describe('buildReplay', () => {
  it('returns no frames for an empty result', () => {
    expect(buildReplay(table([]), asOf).frames).toEqual([]);
  });

  it('carries a score forward through weeks with no change, and dates frames back from asOf', () => {
    const r = buildReplay(
      table([
        ['a', 2, pack(0.4)],
        ['b', 2, pack(0.6)],
        ['a', 0, pack(0.5)],
      ]),
      asOf
    );
    expect(r.frames).toHaveLength(3);
    expect(r.frames[0].end.toISOString()).toBe('2026-09-16T00:00:00.000Z');
    expect(r.frames[2].end.toISOString()).toBe('2026-09-30T00:00:00.000Z');
    const a = r.guids.indexOf('a');
    expect(r.frames[1].scores[a]).toBeCloseTo(0.4);
    expect(r.frames[2].scores[a]).toBeCloseTo(0.5);
  });

  it('counts arrivals and departures, and keeps a departed dot at its last score', () => {
    const r = buildReplay(
      table([
        ['a', 2, pack(0.4)],
        ['b', 2, pack(0.6)],
        ...(['d', 'e', 'f', 'g', 'h', 'i', 'j', 'k'].map((g) => [g, 2, pack(0.5)]) as [string, number, number][]),
        ['c', 1, pack(0.2)],
        ['b', 0, pack(0.6, true)],
      ]),
      asOf
    );
    const [b, c] = [r.guids.indexOf('b'), r.guids.indexOf('c')];
    expect(r.frames[1].arrived).toEqual([c]);
    expect(r.frames[2].left).toEqual([b]);
    expect(Number.isNaN(r.frames[2].scores[b])).toBe(true);
    expect(r.frames[2].positions[b]).toBeCloseTo(0.6);
    // Before it arrives, a dot waits at its first score.
    expect(r.frames[0].positions[c]).toBeCloseTo(0.2);
    expect(r.frames.map((f) => f.listed)).toEqual([10, 11, 10]);
  });

  it('skips a partial first crawl so its missing visuals do not read as arrivals', () => {
    const rows: [string, number, number][] = [['a', 3, pack(0.1)]];
    for (const g of ['a', 'b', 'c', 'd', 'e']) rows.push([g, 2, pack(0.3)]);
    const r = buildReplay(table(rows), asOf);
    expect(r.frames).toHaveLength(3);
    expect(r.frames[0].listed).toBe(5);
    expect(r.frames[0].arrived).toEqual([]);
  });

  it('marks quiet weeks and the busy week that follows a long quiet run', () => {
    const guids = Array.from({ length: 10 }, (_, i) => `v${i}`);
    const rows: [string, number, number][] = guids.map((g) => [g, 6, pack(0.3)]);
    // Weeks 5 to 1 change nothing; week 0 moves every visual by 10 points.
    for (const g of guids) rows.push([g, 0, pack(0.4)]);
    const r = buildReplay(table(rows), asOf);
    expect(r.frames.map((f) => f.quiet)).toEqual([false, true, true, true, true, true, false]);
    expect(r.frames[6].catchUp).toBe(true);
    expect(r.frames[6].bigMoves).toBe(10);
    expect(r.frames[6].changed).toBe(10);
  });
});

describe('movers', () => {
  const r = buildReplay(
    table([
      ['up', 2, pack(0.2)],
      ['down', 2, pack(0.8)],
      ['flat', 2, pack(0.5)],
      ['new', 0, pack(0.9)],
      ['up', 0, pack(0.45)],
      ['down', 0, pack(0.7)],
    ]),
    asOf
  );

  it('ranks climbers and sliders over the lookback, ignoring arrivals and unchanged visuals', () => {
    const m = movers(r, 2, 4, 8);
    expect(m.from?.toISOString()).toBe(r.frames[0].end.toISOString());
    expect(m.climbers.map((x) => x.guid)).toEqual(['up']);
    expect(m.climbers[0].delta).toBeCloseTo(0.25);
    expect(m.sliders.map((x) => x.guid)).toEqual(['down']);
  });

  it('has nothing to compare on the first frame', () => {
    expect(movers(r, 0, 4, 8)).toEqual({ from: null, climbers: [], sliders: [] });
  });
});

describe('jitter', () => {
  it('is stable and within [0, 1)', () => {
    expect(jitter('abc')).toBe(jitter('abc'));
    for (const g of ['a', 'b', 'PBI_CV_1234']) {
      expect(jitter(g)).toBeGreaterThanOrEqual(0);
      expect(jitter(g)).toBeLessThan(1);
    }
  });
});

describe('ratings and stars', () => {
  const ratingsTable = (rows: [string, number, number, number | null, number | null][]) => ({
    columns: [
      { name: '[Visual]' },
      { name: '[Week]' },
      { name: '[Latest]' },
      { name: '[Raters]' },
      { name: '[Stars]' },
    ],
    rows,
  });

  it('unpacks the day-prefixed ratings count and average stars', () => {
    expect(unpackRaters(DAY * 100000 + 276)).toBe(276);
    expect(unpackStars(DAY * 1000 + 437)).toBeCloseTo(4.37);
    expect(Number.isNaN(unpackRaters(null))).toBe(true);
  });

  it('carries ratings forward through blank weeks and back to before the first reading', () => {
    const r = buildReplay(
      ratingsTable([
        ['a', 2, pack(0.4), null, null],
        ['a', 1, pack(0.5), DAY * 100000 + 12, DAY * 1000 + 420],
        ['a', 0, pack(0.6), null, null],
      ]),
      asOf
    );
    const a = r.guids.indexOf('a');
    expect(r.frames.map((f) => f.raters[a])).toEqual([12, 12, 12]);
    expect(r.frames[2].stars[a]).toBeCloseTo(4.2);
  });

  it('centres stars on a neutral 3, and gives an unrated visual no sentiment', () => {
    expect(sentiment(3, 10)).toBe(0);
    expect(sentiment(5, 10)).toBe(2);
    expect(sentiment(1, 4)).toBe(-2);
    expect(sentiment(0, 0)).toBeNull();
    expect(sentiment(4, 0)).toBeNull();
  });
});
