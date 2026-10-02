import { describe, it, expect } from 'vitest';

import {
  buildReplay,
  comings,
  frameCounts,
  jitter,
  lastScoredBefore,
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

/** Rows as the snapshot writes them: a score, or only what the Listing column records. */
function listingTable(rows: [string, number, number | null, number][]) {
  return {
    columns: [{ name: '[Visual]' }, { name: '[Week]' }, { name: '[Latest]' }, { name: '[Listing]' }],
    rows,
  };
}
const LISTED = 1;
const VERSION = 2;
const CERTIFIED = 4;

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

  it('keeps the first week even when only some visuals have a score in it', () => {
    const rows: [string, number, number | null, number][] = [['a', 3, pack(0.1), LISTED]];
    for (const g of ['b', 'c', 'd', 'e']) rows.push([g, 3, null, LISTED]);
    for (const g of ['a', 'b', 'c', 'd', 'e']) rows.push([g, 2, pack(0.3), LISTED]);
    const r = buildReplay(listingTable(rows), asOf);
    expect(r.frames).toHaveLength(4);
    expect(r.frames[0].listed).toBe(5);
    // A first score is not an arrival, and it is not a move either.
    expect(r.frames[1].arrived).toEqual([]);
    expect(r.frames[1].changed).toBe(1);
    const b = r.guids.indexOf('b');
    expect(r.frames[0].present[b]).toBe(1);
    expect(Number.isNaN(r.frames[0].scores[b])).toBe(true);
    expect(r.frames[0].positions[b]).toBeCloseTo(0.3);
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

describe('a record that knows who was listed before it knows the scores', () => {
  // Week 14 lists two visuals with no score. Week 13 scores them. Weeks 12 to 4
  // record no score, and week 8 records an arrival, a version and a
  // certification. Week 3 scores everything again.
  const r = buildReplay(
    listingTable([
      ['a', 14, null, LISTED],
      ['b', 14, null, LISTED],
      ['a', 13, pack(0.4), LISTED],
      ['b', 13, pack(0.6), LISTED],
      ['a', 8, null, LISTED + VERSION],
      ['b', 8, null, LISTED + CERTIFIED],
      ['c', 8, null, LISTED],
      ['b', 6, null, 0],
      ['a', 3, pack(0.7), LISTED],
      ['c', 3, pack(0.2), LISTED],
      ['b', 1, null, LISTED],
    ]),
    asOf
  );
  const [a, b, c] = ['a', 'b', 'c'].map((g) => r.guids.indexOf(g));
  const at = (week: number) => 14 - week;

  it('opens on the listed visuals, with no score and no arrivals', () => {
    const first = r.frames[0];
    expect(first.listed).toBe(2);
    expect(first.arrived).toEqual([]);
    expect(first.scored).toBe(false);
    expect(first.unscored).toBe(true);
    expect(first.scoredAt).toBe(-1);
    expect(Number.isNaN(first.scores[a])).toBe(true);
    // The dot waits where its first score later places it.
    expect(first.positions[a]).toBeCloseTo(0.4);
  });

  it('marks the weeks in which popularity was recorded again', () => {
    expect(r.frames.map((f) => f.resumed)).toEqual(r.frames.map((_, i) => i === at(13) || i === at(3)));
    expect(lastScoredBefore(r, at(13))).toBeNull();
    expect(lastScoredBefore(r, at(3))?.toISOString()).toBe(r.frames[at(13)].end.toISOString());
    // A resumed week is neither a quiet week nor a catch-up week.
    expect(r.frames[at(3)].quiet).toBe(false);
    expect(r.frames[at(3)].catchUp).toBe(false);
    expect(r.frames[at(3)].bigMoves).toBe(1);
  });

  it('treats a long run without a score as unscored, and holds the last score through it', () => {
    for (let week = 12; week >= 4; week--) {
      expect(r.frames[at(week)].unscored).toBe(true);
      expect(r.frames[at(week)].scoredAt).toBe(at(13));
      expect(r.frames[at(week)].scores[a]).toBeCloseTo(0.4);
    }
    // Weeks 2 to 0 are too few to be a stretch of their own.
    expect(r.frames[at(2)].unscored).toBe(false);
    expect(r.frames[at(3)].scoredAt).toBe(at(3));
  });

  it('plays an unscored week quickly only when nothing was recorded in it', () => {
    expect(r.frames[at(10)].quiet).toBe(true);
    expect(r.frames[at(8)].quiet).toBe(false);
    expect(r.frames[at(6)].quiet).toBe(false);
  });

  it('records arrivals, departures, versions and certifications without a score', () => {
    const week8 = r.frames[at(8)];
    expect(week8.arrived).toEqual([c]);
    expect(week8.versions).toEqual([a]);
    expect(week8.certified).toEqual([b]);
    expect(week8.present[c]).toBe(1);
    expect(Number.isNaN(week8.scores[c])).toBe(true);
    expect(r.frames[at(6)].left).toEqual([b]);
    expect(frameCounts(r, at(8))).toEqual({
      listed: 3,
      unrated: 3,
      arrived: 1,
      left: 0,
      bigMoves: 0,
      versions: 1,
      certified: 1,
    });
    expect(frameCounts(r, at(8), (v) => v === b)).toMatchObject({ arrived: 0, versions: 0, certified: 1 });
  });

  it('forgets a score when the visual leaves, so a return starts with none', () => {
    expect(Number.isNaN(r.frames[at(6)].scores[b])).toBe(true);
    expect(r.frames[at(1)].present[b]).toBe(1);
    expect(r.frames[at(1)].arrived).toEqual([b]);
    expect(Number.isNaN(r.frames[at(1)].scores[b])).toBe(true);
    // Its dot still has a place: the last score it had.
    expect(r.frames[at(1)].positions[b]).toBeCloseTo(0.6);
  });

  it('dates a move from the day the earlier score was recorded', () => {
    const m = movers(r, at(3), 4, 8);
    expect(m.from?.toISOString()).toBe(r.frames[at(13)].end.toISOString());
    expect(m.climbers.map((x) => x.guid)).toEqual(['a']);
    expect(m.climbers[0].delta).toBeCloseTo(0.3);
  });

  it('lists who joined and who left over the lookback', () => {
    const week6 = comings(r, at(6), 4);
    expect(week6.from?.toISOString()).toBe(r.frames[at(10)].end.toISOString());
    expect(week6.joined).toEqual([c]);
    expect(week6.left).toEqual([b]);
    expect(comings(r, at(6), 4, (v) => v === c)).toMatchObject({ joined: [c], left: [] });
    expect(comings(r, 0, 4)).toEqual({ from: null, joined: [], left: [] });
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

  it('ranks only the visuals the include test accepts', () => {
    const down = r.guids.indexOf('down');
    const m = movers(r, 2, 4, 8, (v) => v === down);
    expect(m.climbers).toEqual([]);
    expect(m.sliders.map((x) => x.guid)).toEqual(['down']);
  });
});

describe('frameCounts', () => {
  const r = buildReplay(
    table([
      ['up', 2, pack(0.2)],
      ['down', 2, pack(0.8)],
      ['flat', 2, pack(0.5)],
      ['new', 0, pack(0.9)],
      ['up', 0, pack(0.45)],
      ['down', 0, pack(0.7)],
      ['flat', 0, pack(0.5, true)],
    ]),
    asOf
  );

  it('matches the numbers the frame carries when every visual counts', () => {
    const c = frameCounts(r, 2);
    const f = r.frames[2];
    expect(c.listed).toBe(f.listed);
    expect(c.arrived).toBe(f.arrived.length);
    expect(c.left).toBe(f.left.length);
    expect(c.bigMoves).toBe(f.bigMoves);
    // The fixture carries no ratings, so every listed visual is unrated.
    expect(c.unrated).toBe(f.listed);
  });

  it('counts only the visuals the include test accepts', () => {
    const up = r.guids.indexOf('up');
    expect(frameCounts(r, 2, (v) => v === up)).toEqual({
      listed: 1,
      unrated: 1,
      arrived: 0,
      left: 0,
      bigMoves: 1,
      versions: 0,
      certified: 0,
    });
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
