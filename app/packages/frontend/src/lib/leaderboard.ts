import type { QueryTableLike } from '@/lib/to-data-table';
import { asDate, asNumber, asString, daysBefore, readRows } from '@/lib/table';

export type Window = 7 | 30 | 90;
export const WINDOWS: Window[] = [7, 30, 90];

export interface Standing {
  guid: string;
  name: string;
  publisher: string;
  version: string;
  /** AppSource popularity percentile, 0 to 1. Null once a visual is removed. */
  popularity: number | null;
  ratings: number | null;
  averageRating: number | null;
  certified: boolean;
  removed: boolean;
  catalogId: string;
  thumbnail: string;
  releaseDate: Date | null;
  lastChange: Date | null;
  firstSeen: Date | null;
  asOf: Date | null;
  popularityChange: Record<Window, number | null>;
  ratingsChange: Record<Window, number | null>;
}

export function parseStandings(table: QueryTableLike): Standing[] {
  return readRows(table, (get) => ({
    guid: asString(get('Leaderboard[Visual GUID]')),
    name: asString(get('[Name]')),
    publisher: asString(get('[Publisher]')),
    version: asString(get('[Version]')),
    popularity: asNumber(get('[Popularity]')),
    ratings: asNumber(get('[Ratings]')),
    averageRating: asNumber(get('[Average Rating]')),
    certified: get('[Certified]') === 'Certified',
    removed: get('[Removed]') === true,
    catalogId: asString(get('[Catalog ID]')),
    thumbnail: asString(get('[Thumbnail]')),
    releaseDate: asDate(get('[Release Date]')),
    lastChange: asDate(get('[Last Change]')),
    firstSeen: asDate(get('[First Seen]')),
    asOf: asDate(get('[As Of]')),
    popularityChange: {
      7: asNumber(get('[Popularity Change 7d]')),
      30: asNumber(get('[Popularity Change 30d]')),
      90: asNumber(get('[Popularity Change 90d]')),
    },
    ratingsChange: {
      7: asNumber(get('[Ratings Change 7d]')),
      30: asNumber(get('[Ratings Change 30d]')),
      90: asNumber(get('[Ratings Change 90d]')),
    },
  }));
}

export interface Boards {
  asOf: Date | null;
  /** The first day the leaderboard recorded anything. Arrivals before it are unknowable. */
  trackingStarted: Date | null;
  live: number;
  certified: number;
  hallOfFame: Standing[];
  climbers: Standing[];
  sliding: Standing[];
  arrivals: Standing[];
  farewells: Standing[];
}

const BOARD_SIZE = 10;

function byPopularity(a: Standing, b: Standing): number {
  return (
    (b.popularity ?? 0) - (a.popularity ?? 0) ||
    (b.ratings ?? 0) - (a.ratings ?? 0) ||
    a.name.localeCompare(b.name)
  );
}

export function buildBoards(standings: Standing[], window: Window): Boards {
  const asOf = standings.reduce<Date | null>(
    (latest, s) => (s.asOf && (!latest || s.asOf > latest) ? s.asOf : latest),
    null
  );
  const trackingStarted = standings.reduce<Date | null>(
    (first, s) =>
      s.firstSeen && (!first || s.firstSeen < first) ? s.firstSeen : first,
    null
  );
  const since = asOf ? daysBefore(asOf, window) : null;
  const live = standings.filter((s) => !s.removed);
  const change = (s: Standing) => s.popularityChange[window] ?? 0;

  const climbers = live
    .filter((s) => {
      const delta = change(s);
      // A visual first seen inside the window has no baseline to climb from,
      // and a baseline of 0 is a crawl glitch rather than a real starting point.
      const baseline = (s.popularity ?? 0) - delta;
      return (
        delta > 0 &&
        baseline > 0 &&
        s.firstSeen != null &&
        since != null &&
        s.firstSeen < since
      );
    })
    .sort((a, b) => change(b) - change(a) || byPopularity(a, b))
    .slice(0, BOARD_SIZE);

  const sliding = live
    .filter((s) => change(s) < 0)
    .sort((a, b) => change(a) - change(b) || byPopularity(a, b))
    .slice(0, BOARD_SIZE);

  // When the window reaches back past the first crawl, every visual looks new.
  const arrivalsKnowable =
    since != null && trackingStarted != null && since > trackingStarted;
  const arrivals = arrivalsKnowable
    ? live
        .filter((s) => s.firstSeen != null && s.firstSeen >= since)
        .sort(byPopularity)
    : [];

  const farewells = standings
    .filter(
      (s) =>
        s.removed && s.lastChange != null && since != null && s.lastChange >= since
    )
    .sort(
      (a, b) => (b.lastChange?.getTime() ?? 0) - (a.lastChange?.getTime() ?? 0)
    );

  return {
    asOf,
    trackingStarted,
    live: live.length,
    certified: live.filter((s) => s.certified).length,
    hallOfFame: [...live].sort(byPopularity).slice(0, BOARD_SIZE),
    climbers,
    sliding,
    arrivals,
    farewells,
  };
}
