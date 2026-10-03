import { describe, it, expect } from 'vitest';

import type { CatalogVisual } from '@/lib/catalog';
import { formatDate, formatScore } from '@/lib/format';
import type { Standing } from '@/lib/leaderboard';
import { buildReplay, CERTIFIED, LISTED } from '@/lib/replay';
import { describeVisual, formatStars } from '@/lib/replay-lines';
import { refOf, whoOf, type Who } from '@/lib/replay-who';

const asOf = new Date('2026-09-30T00:00:00Z');
const VERSION = 2;

type Row = [string, number, number | null, number | null, number | null, number | null];

function table(rows: Row[]) {
  return {
    columns: ['[Visual]', '[Day]', '[Popularity]', '[Raters]', '[Stars]', '[Listing]'].map(
      (name) => ({ name })
    ),
    rows,
  };
}

const replay = buildReplay(
  table([
    ['a', 6, null, null, null, LISTED],
    ['a', 4, 0.2, 0, 0, LISTED],
    ['a', 3, null, null, null, LISTED | VERSION],
    ['a', 0, 0.6, 12, 4.5, LISTED | CERTIFIED],
    ['b', 2, null, null, null, LISTED],
    ['c', 6, null, null, null, LISTED],
    ['c', 1, null, null, null, 0],
  ]),
  asOf
);
const day = (frame: number) => formatDate(replay.frames[frame].day);
const index = (guid: string) => replay.guids.indexOf(guid);
const who = (guid: string): Who => ({
  guid,
  name: guid.toUpperCase(),
  publisher: `Publisher ${guid}`,
  thumbnail: '',
  catalogId: `id-${guid}`,
});

describe('describeVisual', () => {
  it('gives the latest reading, the ratings and the versions since popularity was first read', () => {
    expect(describeVisual(replay, 'scores', 6, index('a'), who('a'))).toEqual({
      certified: true,
      lines: [
        `Popularity ${formatScore(0.6)}`,
        '12 ratings, 4.5 stars on average',
        `1 new version since ${day(2)}`,
      ],
    });
  });

  it('dates a reading that was not made on the day shown', () => {
    const { certified, lines } = describeVisual(replay, 'scores', 4, index('a'), who('a'));
    expect(certified).toBe(false);
    expect(lines[0]).toBe(`Popularity ${formatScore(0.2)}, last read ${day(2)}`);
    expect(lines[1]).toBe('No ratings yet');
  });

  it('says when a listed visual has no popularity recorded yet', () => {
    expect(describeVisual(replay, 'scores', 6, index('b'), who('b')).lines).toEqual([
      'No popularity recorded yet',
      `No new version since ${day(2)}`,
    ]);
  });

  it('says when a visual is not listed on the day shown', () => {
    expect(describeVisual(replay, 'scores', 6, index('c'), who('c')).lines).toEqual([
      'Not listed on this day',
    ]);
  });

  it('gives the publisher, the first listed day and the versions since the record began in the listings view', () => {
    expect(describeVisual(replay, 'listings', 6, index('a'), who('a')).lines).toEqual([
      'Publisher a',
      'Listed since the replay began',
      `1 new version since ${day(0)}`,
    ]);
    expect(describeVisual(replay, 'listings', 6, index('b'), who('b')).lines).toEqual([
      'Publisher b',
      `Listed since ${day(4)}`,
      `No new version since ${day(0)}`,
    ]);
  });
});

describe('formatStars', () => {
  it('drops the decimal for a whole number and keeps one place otherwise', () => {
    expect(formatStars(1)).toBe('1 star on average');
    expect(formatStars(4)).toBe('4 stars on average');
    expect(formatStars(4.25)).toBe('4.3 stars on average');
  });
});

describe('whoOf', () => {
  const standings = [
    { guid: 'a', name: 'Alpha', publisher: 'Contoso', thumbnail: 'a.png', catalogId: 'cat-a' },
  ] as Standing[];
  const catalog = [
    { guid: 'a', title: 'Alpha (catalog)', publisher: 'Other', thumbnail: 'x.png', id: 'x' },
    { guid: 'b', title: 'Beta', publisher: 'Fabrikam', thumbnail: 'b.png', id: 'cat-b' },
  ] as CatalogVisual[];

  it('prefers the leaderboard, names the newest visuals from the catalog, and leaves the rest unnamed', () => {
    const named = whoOf(['a', 'b', 'c'], standings, catalog);
    expect(named[0]).toEqual({
      guid: 'a',
      name: 'Alpha',
      publisher: 'Contoso',
      thumbnail: 'a.png',
      catalogId: 'cat-a',
    });
    expect(named[1]).toEqual({
      guid: 'b',
      name: 'Beta',
      publisher: 'Fabrikam',
      thumbnail: 'b.png',
      catalogId: 'cat-b',
    });
    expect(named[2]).toBeUndefined();
    expect(refOf(named[1]!)).toEqual({ id: 'cat-b', guid: 'b', name: 'Beta' });
  });
});
