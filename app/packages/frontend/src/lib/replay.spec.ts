import { describe, it, expect } from 'vitest';

import {
  buildReplay,
  CERTIFIED,
  certificationsAhead,
  certifiedSince,
  comings,
  frameCounts,
  growth,
  jitter,
  lastReading,
  LISTED,
  modeStart,
  mostRatings,
  movers,
  ratingsAlong,
  ratingTicks,
  readingValues,
  sentiment,
  spanAt,
  valuesAt,
} from '@/lib/replay';

const asOf = new Date('2026-09-30T00:00:00Z');
const VERSION = 2;

type Row = [
  visual: string,
  day: number,
  popularity: number | null,
  raters: number | null,
  stars: number | null,
  listing: number | null,
];

function table(rows: Row[]) {
  return {
    columns: ['[Visual]', '[Day]', '[Popularity]', '[Raters]', '[Stars]', '[Listing]'].map(
      (name) => ({ name })
    ),
    rows,
  };
}

/** A reading of a listed visual. */
function read(visual: string, day: number, popularity: number, raters = 0, stars = 0, listing = LISTED): Row {
  return [visual, day, popularity, raters, stars, listing];
}

/** A listing change with no reading. */
function list(visual: string, day: number, listing: number): Row {
  return [visual, day, null, null, null, listing];
}

describe('buildReplay', () => {
  it('returns no frames for an empty result', () => {
    const r = buildReplay(table([]), asOf);
    expect(r.frames).toEqual([]);
    expect(r.readings).toEqual([]);
    expect(r.firstReading).toBe(-1);
  });

  it('makes one frame per day, dated back from asOf, with no day skipped', () => {
    const r = buildReplay(table([list('a', 3, LISTED), read('a', 0, 0.5)]), asOf);
    expect(r.frames).toHaveLength(4);
    expect(r.frames[0].day.toISOString()).toBe('2026-09-27T00:00:00.000Z');
    expect(r.frames[3].day.toISOString()).toBe('2026-09-30T00:00:00.000Z');
  });

  it('holds a visual state until its next row, and shares the array on a day nothing changed', () => {
    const r = buildReplay(
      table([list('a', 3, LISTED), list('a', 1, LISTED | CERTIFIED), list('b', 0, LISTED)]),
      asOf
    );
    const a = r.guids.indexOf('a');
    expect(r.frames[1].state[a]).toBe(LISTED);
    expect(r.frames[1].state).toBe(r.frames[0].state);
    expect(r.frames[2].state[a]).toBe(LISTED | CERTIFIED);
    expect(r.frames[3].state[a]).toBe(LISTED | CERTIFIED);
    // A later change copies the array, so the earlier day keeps its own state.
    expect(r.frames[0].state[a]).toBe(LISTED);
  });

  it('counts arrivals and departures, but never the visuals already listed on the first day', () => {
    const r = buildReplay(
      table([list('a', 3, LISTED), list('b', 1, LISTED), list('a', 0, 0)]),
      asOf
    );
    const a = r.guids.indexOf('a');
    const b = r.guids.indexOf('b');
    expect(r.frames[0].arrived).toEqual([]);
    expect(r.frames[2].arrived).toEqual([b]);
    expect(r.frames[3].left).toEqual([a]);
  });

  it('marks a new version on its own day only, and keeps the running count', () => {
    const r = buildReplay(
      table([
        list('a', 4, LISTED | VERSION),
        list('a', 2, LISTED | VERSION),
        list('a', 1, LISTED | VERSION),
        list('b', 0, LISTED),
      ]),
      asOf
    );
    const a = r.guids.indexOf('a');
    // The first day is where the replay starts, so its version is not an event.
    expect(r.frames[0].versioned).toEqual([]);
    expect(r.frames[0].versions[a]).toBe(0);
    expect(r.frames[2].versioned).toEqual([a]);
    expect(r.frames[3].versioned).toEqual([a]);
    expect(r.frames[4].versioned).toEqual([]);
    expect(Array.from(r.frames.map((f) => f.versions[a]))).toEqual([0, 0, 1, 2, 2]);
    // The version bit is never kept as state.
    expect(r.frames[4].state[a]).toBe(LISTED);
  });

  it('records certification and its loss for listed visuals, not an arrival that comes certified', () => {
    const r = buildReplay(
      table([
        list('a', 3, LISTED),
        list('a', 2, LISTED | CERTIFIED),
        list('a', 0, LISTED),
        list('b', 1, LISTED | CERTIFIED),
      ]),
      asOf
    );
    const a = r.guids.indexOf('a');
    const b = r.guids.indexOf('b');
    expect(r.frames[1].certified).toEqual([a]);
    expect(r.frames[2].arrived).toEqual([b]);
    expect(r.frames[2].certified).toEqual([]);
    expect(r.frames[3].uncertified).toEqual([a]);
  });

  it('keeps a reading only on the days the leaderboard was read, and carries absent visuals forward', () => {
    const r = buildReplay(
      table([
        read('a', 3, 0.4, 2, 4),
        read('a', 1, 0.5, 3, 4.5),
        read('b', 3, 0.6, 10, 3),
        list('c', 2, LISTED),
      ]),
      asOf
    );
    const b = r.guids.indexOf('b');
    expect(r.readings.map((k) => k.frame)).toEqual([0, 2]);
    expect(r.firstReading).toBe(0);
    expect(r.frames.map((f) => f.reading)).toEqual([0, 0, 1, 1]);
    // b was not in the second reading, so it held its figures.
    expect(r.readings[1].scores[b]).toBeCloseTo(0.6);
    expect(r.readings[1].raters[b]).toBe(10);
    expect(r.readings[1].readOn[b]).toBe(0);
  });

  it('reads a reading with no ratings count as no ratings, not as the next count', () => {
    const r = buildReplay(table([['a', 2, 0.3, null, null, LISTED], read('a', 0, 0.4, 5, 4)]), asOf);
    const a = r.guids.indexOf('a');
    expect(r.readings[0].raters[a]).toBe(0);
    expect(r.first.raters[a]).toBe(0);
  });

  it('places a visual before its first reading where it was first read', () => {
    const r = buildReplay(table([read('a', 2, 0.2), read('b', 0, 0.8, 7, 5)]), asOf);
    const b = r.guids.indexOf('b');
    expect(r.first.score[b]).toBeCloseTo(0.8);
    expect(readingValues(r, 0).score[b]).toBeCloseTo(0.8);
    expect(lastReading(r, 1, b)).toBeNull();
    expect(lastReading(r, 2, b)).toEqual({ frame: 2, score: expect.closeTo(0.8), raters: 7, stars: 5 });
  });
});

describe('spanAt and valuesAt', () => {
  const r = buildReplay(
    table([
      list('a', 6, LISTED),
      read('a', 4, 0.2, 0, 0),
      read('a', 0, 0.6, 100, 4),
    ]),
    asOf
  );
  const a = r.guids.indexOf('a');

  it('names the two readings a day sits between', () => {
    expect(spanAt(r, 0)).toEqual({ from: 0, to: 0, f: 0 });
    expect(spanAt(r, 2)).toEqual({ from: 0, to: 1, f: 0 });
    expect(spanAt(r, 4)).toEqual({ from: 0, to: 1, f: 0.5 });
    expect(spanAt(r, 6)).toEqual({ from: 1, to: 1, f: 0 });
  });

  it('moves a visual along a straight line between two readings', () => {
    expect(valuesAt(r, 3).score[a]).toBeCloseTo(0.3);
    expect(valuesAt(r, 4).score[a]).toBeCloseTo(0.4);
    expect(valuesAt(r, 4).raters[a]).toBeCloseTo(50);
    expect(valuesAt(r, 5).stars[a]).toBeCloseTo(3);
  });

  it('holds before the first reading and from the last one on', () => {
    expect(valuesAt(r, 0).score[a]).toBeCloseTo(0.2);
    expect(valuesAt(r, 6).score[a]).toBeCloseTo(0.6);
  });

  it('gives NaN for a visual that was never read', () => {
    const s = buildReplay(table([read('a', 1, 0.5), list('b', 1, LISTED)]), asOf);
    expect(valuesAt(s, 1).score[s.guids.indexOf('b')]).toBeNaN();
  });
});

describe('movers', () => {
  const r = buildReplay(
    table([
      read('up', 3, 0.2),
      read('down', 3, 0.7),
      read('flat', 3, 0.5),
      read('up', 0, 0.5),
      read('down', 0, 0.6),
      read('new', 0, 0.9, 0, 0, LISTED),
      list('new', 3, 0),
    ]),
    asOf
  );

  it('ranks the climbs and slides between a number of days ago and today', () => {
    const m = movers(r, 3, 3, 5);
    expect(m.from?.toISOString()).toBe('2026-09-27T00:00:00.000Z');
    expect(m.climbers.map((x) => x.guid)).toEqual(['up']);
    expect(m.climbers[0].delta).toBeCloseTo(0.3);
    expect(m.sliders.map((x) => x.guid)).toEqual(['down']);
  });

  it('never counts a visual that arrived in between as a climb', () => {
    const m = movers(r, 3, 3, 5);
    expect(m.climbers.some((x) => x.guid === 'new')).toBe(false);
  });

  it('ranks only the visuals the filter accepts', () => {
    const up = r.guids.indexOf('up');
    expect(movers(r, 3, 3, 5, (v) => v !== up).climbers).toEqual([]);
  });

  it('measures change from the last reading by the earlier day', () => {
    // Day 2 has no reading of its own, so it compares with the first reading.
    expect(movers(r, 3, 1, 5).climbers.map((x) => x.guid)).toEqual(['up']);
  });

  it("never counts a visual's first popularity, a rise from 0, as a climb", () => {
    const first = buildReplay(
      table([read('up', 3, 0.2), read('fresh', 3, 0), read('up', 0, 0.3), read('fresh', 0, 0.8)]),
      asOf
    );
    expect(movers(first, 3, 3, 5).climbers.map((x) => x.guid)).toEqual(['up']);
  });
});

describe('comings', () => {
  it('lists who joined and left in the period, the most popular first', () => {
    const r = buildReplay(
      table([
        read('a', 4, 0.5),
        read('gone', 4, 0.3),
        list('gone', 2, 0),
        read('low', 1, 0.1),
        read('high', 1, 0.9),
        list('never', 1, LISTED),
      ]),
      asOf
    );
    const c = comings(r, 4, 4);
    expect(c.joined.map((v) => r.guids[v])).toEqual(['high', 'low', 'never']);
    expect(c.left.map((v) => r.guids[v])).toEqual(['gone']);
  });
});

describe('certifiedSince', () => {
  const r = buildReplay(
    table([
      read('early', 4, 0.3),
      list('early', 2, LISTED | CERTIFIED),
      read('late', 4, 0.8),
      list('late', 1, LISTED | CERTIFIED),
      list('born', 1, LISTED | CERTIFIED),
      list('always', 4, LISTED | CERTIFIED),
      list('other', 4, LISTED),
    ]),
    asOf
  );

  it('lists the visuals certified in the period, the most popular first', () => {
    const c = certifiedSince(r, 4, 4);
    expect(c.certified.map((v) => r.guids[v])).toEqual(['late', 'early']);
    expect(c.from).toEqual(r.frames[0].day);
  });

  it('leaves out a visual that joined certified, and one certified before the period', () => {
    expect(certifiedSince(r, 4, 1).certified).toEqual([]);
    expect(certifiedSince(r, 0, 4)).toEqual({ from: null, certified: [] });
  });

  it('lists only the visuals the filter accepts', () => {
    const c = certifiedSince(r, 4, 4, (v) => r.guids[v] === 'early');
    expect(c.certified.map((v) => r.guids[v])).toEqual(['early']);
  });
});

describe('certificationsAhead', () => {
  const r = buildReplay(
    table([
      list('a', 5, LISTED),
      list('a', 3, LISTED | CERTIFIED),
      list('a', 1, LISTED),
      list('b', 5, LISTED),
      list('b', 2, LISTED | CERTIFIED),
      list('born', 4, LISTED | CERTIFIED),
    ]),
    asOf
  );
  const a = r.guids.indexOf('a');
  const b = r.guids.indexOf('b');

  it('finds the first certification or loss of each visual in the days after the one shown', () => {
    expect([...certificationsAhead(r, 0, 5)]).toEqual([
      [a, 2],
      [b, 3],
    ]);
    expect(certificationsAhead(r, 2, 5).get(a)).toBe(4);
  });

  it('looks only as many days ahead as asked, and not past the last day', () => {
    expect([...certificationsAhead(r, 0, 2)]).toEqual([[a, 2]]);
    expect(certificationsAhead(r, 0, 1).size).toBe(0);
    expect(certificationsAhead(r, 4, 100).size).toBe(0);
  });
});

describe('modeStart', () => {
  it('starts the popularity mode at the first reading and the listings mode at the first day', () => {
    const r = buildReplay(table([list('a', 4, LISTED), read('a', 2, 0.5)]), asOf);
    expect(modeStart(r, 'scores')).toBe(2);
    expect(modeStart(r, 'listings')).toBe(0);
    const never = buildReplay(table([list('a', 4, LISTED)]), asOf);
    expect(modeStart(never, 'scores')).toBe(0);
  });
});

describe('frameCounts', () => {
  const r = buildReplay(
    table([
      read('a', 3, 0.2, 0),
      read('b', 3, 0.5, 4, 4, LISTED | CERTIFIED),
      read('a', 1, 0.3, 1, 5, LISTED | VERSION),
      list('c', 1, LISTED),
      read('d', 0, 0.4),
    ]),
    asOf
  );

  it('counts the visuals not read yet, and the ones never read at all', () => {
    const counts = frameCounts(r, 2);
    expect(counts.listed).toBe(3);
    expect(counts.unread).toBe(1);
    expect(counts.unplaced).toBe(1);
    expect(frameCounts(r, 3).unread).toBe(1);
  });

  it('counts the day events, for a subset when given one', () => {
    expect(frameCounts(r, 2)).toMatchObject({ arrived: 1, versions: 1, unrated: 1 });
    const b = r.guids.indexOf('b');
    const certifiedOnly = (v: number) => v === b;
    expect(frameCounts(r, 2, certifiedOnly)).toMatchObject({ listed: 1, arrived: 0, versions: 0 });
  });
});

describe('growth', () => {
  it('grows by the square root of the versions published since a day, up to 2.2 times', () => {
    const rows: Row[] = [list('a', 40, LISTED), list('b', 0, LISTED)];
    for (let day = 39; day >= 1; day--) rows.push(list('a', day, LISTED | VERSION));
    const r = buildReplay(table(rows), asOf);
    const a = r.guids.indexOf('a');
    expect(growth(r, 0, 0, a)).toBe(1);
    expect(growth(r, 4, 0, a)).toBeCloseTo(1.44);
    expect(growth(r, 4, 3, a)).toBeCloseTo(1.22);
    expect(growth(r, 40, 0, a)).toBe(2.2);
  });
});

describe('sentiment', () => {
  it('centres average stars on a neutral 3, and has none without ratings', () => {
    expect(sentiment(5, 10)).toBe(2);
    expect(sentiment(1, 3)).toBe(-2);
    expect(sentiment(4, 0)).toBeNull();
    expect(sentiment(0, 4)).toBeNull();
  });
});

describe('the ratings axis', () => {
  it('ends at the most ratings any visual has on any day, not only the last one', () => {
    const r = buildReplay(
      table([read('a', 20, 0.5, 40, 4), read('b', 20, 0.4, 7, 3), read('a', 10, 0.5, 276, 4), read('a', 0, 0.5, 250, 4)]),
      asOf
    );
    expect(mostRatings(r)).toBe(276);
  });

  it('keeps an axis of at least 10 ratings for a replay with few or none', () => {
    expect(mostRatings(buildReplay(table([read('a', 5, 0.5, 3, 4)]), asOf))).toBe(10);
    expect(mostRatings(buildReplay(table([]), asOf))).toBe(10);
  });

  it('places ratings on a log scale from none to the end, and holds a count past the end at the end', () => {
    expect(ratingsAlong(0, 276)).toBe(0);
    expect(ratingsAlong(276, 276)).toBe(1);
    expect(ratingsAlong(10, 276)).toBeCloseTo(Math.log10(11) / Math.log10(277));
    expect(ratingsAlong(500, 276)).toBe(1);
    expect(ratingsAlong(NaN, 276)).toBe(0);
  });

  it('marks none, the powers of ten clear of the end, and the end', () => {
    expect(ratingTicks(276)).toEqual([0, 1, 10, 100, 276]);
    expect(ratingTicks(120)).toEqual([0, 1, 10, 120]);
    expect(ratingTicks(10)).toEqual([0, 1, 10]);
  });
});

describe('jitter', () => {
  it('is stable for a visual, spread over [0, 1), and changes with the salt', () => {
    expect(jitter('abc')).toBe(jitter('abc'));
    expect(jitter('abc')).not.toBe(jitter('abd'));
    expect(jitter('abc', 'x')).not.toBe(jitter('abc'));
    for (const g of ['a', 'b', 'c', 'visual-guid-1']) {
      expect(jitter(g)).toBeGreaterThanOrEqual(0);
      expect(jitter(g)).toBeLessThan(1);
    }
  });
});
