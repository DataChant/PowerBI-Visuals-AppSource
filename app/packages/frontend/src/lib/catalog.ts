import type { QueryTableLike } from '@/lib/to-data-table';
import { asDate, asNumber, asString, readRows } from '@/lib/table';

export interface CatalogVisual {
  id: string;
  guid: string;
  title: string;
  publisher: string;
  version: string;
  description: string;
  categories: string[];
  thumbnail: string;
  /** AppSource popularity percentile, 0 to 1. */
  popularity: number;
  ratings: number;
  averageRating: number;
  releaseDate: Date | null;
  releaseYear: number | null;
  certified: boolean;
  freePlans: boolean;
  link: string;
  download: string;
}

/** AppSource tags every certified visual with this category; it is shown as a badge instead. */
const CERTIFIED_TAG = 'PowerBICertified';

/**
 * AppSource mixes two tagging schemes ("pbiv-comparison" beside "KPI") and spells
 * some tags three ways ("advanced-analytics", "AdvancedAnalytics"). Each raw tag
 * maps to the one name a reader would use; unknown tags are tidied the same way.
 */
const CATEGORY_NAMES: Record<string, string> = {
  kpi: 'KPI',
  advancedanalytics: 'Advanced analytics',
  parttowhole: 'Part to whole',
};

export function categoryName(raw: string): string {
  const bare = raw.trim().replace(/^pbiv-/i, '');
  const key = bare.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (CATEGORY_NAMES[key]) return CATEGORY_NAMES[key];
  const words = bare.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]+/g, ' ').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function parseCatalog(table: QueryTableLike): CatalogVisual[] {
  return readRows(table, (get) => {
    const releaseDate = asDate(get('[Release Date]'));
    return {
      id: asString(get('[ID]')),
      guid: asString(get('[Visual GUID]')),
      title: asString(get('[Title]')),
      publisher: asString(get('[Publisher]')),
      version: asString(get('[Version]')),
      description: asString(get('[Description]')),
      categories: [
        ...new Set(
          asString(get('[Categories]'))
            .split(',')
            .map((c) => c.trim())
            .filter((c) => c && c !== CERTIFIED_TAG)
            .map(categoryName)
        ),
      ],
      thumbnail: asString(get('[Thumbnail]')),
      popularity: asNumber(get('[Popularity]')) ?? 0,
      ratings: asNumber(get('[Ratings]')) ?? 0,
      averageRating: asNumber(get('[Average Rating]')) ?? 0,
      releaseDate,
      releaseYear: releaseDate ? releaseDate.getUTCFullYear() : null,
      certified: get('[Certified]') === true,
      freePlans: get('[Free Plans]') === true,
      link: asString(get('[Link]')),
      download: asString(get('[Download Visual]')),
    };
  });
}

export interface StarCount {
  id: string;
  stars: number;
  raters: number;
}

export function parseStars(table: QueryTableLike): StarCount[] {
  return readRows(table, (get) => ({
    id: asString(get('[ID]')),
    stars: Number.parseInt(asString(get('[Stars]')), 10) || 0,
    raters: asNumber(get('[Raters]')) ?? 0,
  })).filter((s) => s.stars >= 1 && s.stars <= 5);
}

export type CertifiedFilter = 'all' | 'certified' | 'not-certified';

export interface CatalogFilters {
  search: string;
  publisher: string;
  certified: CertifiedFilter;
  category: string;
  minRating: number;
  yearFrom: number | null;
  yearTo: number | null;
}

export const NO_FILTERS: CatalogFilters = {
  search: '',
  publisher: '',
  certified: 'all',
  category: '',
  minRating: 0,
  yearFrom: null,
  yearTo: null,
};

export function isFiltered(filters: CatalogFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.publisher !== '' ||
    filters.certified !== 'all' ||
    filters.category !== '' ||
    filters.minRating > 0 ||
    filters.yearFrom != null ||
    filters.yearTo != null
  );
}

export function applyFilters(
  visuals: CatalogVisual[],
  filters: CatalogFilters
): CatalogVisual[] {
  const needle = filters.search.trim().toLowerCase();
  return visuals.filter((v) => {
    if (
      needle &&
      !v.title.toLowerCase().includes(needle) &&
      !v.publisher.toLowerCase().includes(needle)
    )
      return false;
    if (filters.publisher && v.publisher !== filters.publisher) return false;
    if (filters.certified === 'certified' && !v.certified) return false;
    if (filters.certified === 'not-certified' && v.certified) return false;
    if (filters.category && !v.categories.includes(filters.category))
      return false;
    if (filters.minRating > 0 && v.averageRating < filters.minRating)
      return false;
    if (
      filters.yearFrom != null &&
      (v.releaseYear == null || v.releaseYear < filters.yearFrom)
    )
      return false;
    if (
      filters.yearTo != null &&
      (v.releaseYear == null || v.releaseYear > filters.yearTo)
    )
      return false;
    return true;
  });
}

export function yearRange(visuals: CatalogVisual[]): [number, number] | null {
  const years = visuals
    .map((v) => v.releaseYear)
    .filter((y): y is number => y != null);
  if (years.length === 0) return null;
  return [Math.min(...years), Math.max(...years)];
}

export function allCategories(visuals: CatalogVisual[]): string[] {
  const set = new Set<string>();
  for (const v of visuals) for (const c of v.categories) set.add(c);
  return [...set].sort((a, b) => a.localeCompare(b));
}

export interface CatalogKpis {
  visuals: number;
  publishers: number;
  ratings: number;
  /** Mean of the average rating across rated visuals only. Unrated visuals report 0, not a score. */
  averageRating: number | null;
  certifiedShare: number | null;
}

export function kpis(visuals: CatalogVisual[]): CatalogKpis {
  const rated = visuals.filter((v) => v.averageRating > 0);
  return {
    visuals: visuals.length,
    publishers: new Set(visuals.map((v) => v.publisher)).size,
    ratings: visuals.reduce((sum, v) => sum + v.ratings, 0),
    averageRating: rated.length
      ? rated.reduce((sum, v) => sum + v.averageRating, 0) / rated.length
      : null,
    certifiedShare: visuals.length
      ? visuals.filter((v) => v.certified).length / visuals.length
      : null,
  };
}

export const CERTIFIED_LABEL = 'Certified';
export const NOT_CERTIFIED_LABEL = 'Not certified';

/** Rows of [year, status, visuals] for the releases-per-year chart. */
export function releasesPerYear(visuals: CatalogVisual[]): unknown[][] {
  const counts = new Map<string, number>();
  for (const v of visuals) {
    if (v.releaseYear == null) continue;
    const key = `${v.releaseYear}|${v.certified ? CERTIFIED_LABEL : NOT_CERTIFIED_LABEL}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => {
      const [year, status] = key.split('|');
      return [Number(year), status, count];
    })
    .sort((a, b) => (a[0] as number) - (b[0] as number));
}

export type PublisherMeasure = 'visuals' | 'popularity';

/**
 * Rows of [publisher, value] for the top publishers. "popularity" sums each
 * visual's percentile, so a publisher with many well-used visuals ranks above
 * one with a single hit.
 */
export function topPublishers(
  visuals: CatalogVisual[],
  measure: PublisherMeasure,
  limit = 12
): unknown[][] {
  const totals = new Map<string, number>();
  for (const v of visuals) {
    const add = measure === 'visuals' ? 1 : v.popularity * 100;
    totals.set(v.publisher, (totals.get(v.publisher) ?? 0) + add);
  }
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([publisher, value]) => [publisher, Math.round(value * 10) / 10]);
}

/** Rows of [category, visuals] across the filtered catalog. */
export function categoryCounts(visuals: CatalogVisual[], limit = 15): unknown[][] {
  const totals = new Map<string, number>();
  for (const v of visuals)
    for (const c of v.categories) totals.set(c, (totals.get(c) ?? 0) + 1);
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([category, count]) => [category, count]);
}

export function starLabel(stars: number): string {
  return stars === 1 ? '1 star' : `${stars} stars`;
}

/**
 * Rows of [publisher, stars label, star order, share of raters, raters] for the
 * publishers whose visuals collected the most individual star ratings.
 */
export function publisherStarMix(
  visuals: CatalogVisual[],
  stars: StarCount[],
  limit = 6
): unknown[][] {
  const publisherOf = new Map(visuals.map((v) => [v.id, v.publisher]));
  const byPublisher = new Map<string, number[]>();
  for (const s of stars) {
    const publisher = publisherOf.get(s.id);
    if (!publisher) continue;
    const counts = byPublisher.get(publisher) ?? [0, 0, 0, 0, 0];
    counts[s.stars - 1] += s.raters;
    byPublisher.set(publisher, counts);
  }
  const top = [...byPublisher.entries()]
    .map(([publisher, counts]) => ({
      publisher,
      counts,
      total: counts.reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => b.total - a.total || a.publisher.localeCompare(b.publisher))
    .slice(0, limit);
  const rows: unknown[][] = [];
  for (const { publisher, counts, total } of top) {
    counts.forEach((count, i) => {
      if (count > 0)
        rows.push([
          `${publisher} (${total})`,
          starLabel(i + 1),
          i + 1,
          count / total,
          count,
        ]);
    });
  }
  return rows;
}

/** Star totals for one visual, index 0 = 1 star. */
export function starsFor(stars: StarCount[], id: string): number[] {
  const counts = [0, 0, 0, 0, 0];
  for (const s of stars) if (s.id === id) counts[s.stars - 1] += s.raters;
  return counts;
}

/** Rows of [title, publisher, ratings, score, certified label, id, logo] for the scatter. */
export function ratingsVsPopularity(visuals: CatalogVisual[]): unknown[][] {
  return visuals.map((v) => [
    v.title,
    v.publisher,
    v.ratings,
    Math.round(v.popularity * 1000) / 10,
    v.certified ? CERTIFIED_LABEL : NOT_CERTIFIED_LABEL,
    v.id,
    v.thumbnail,
  ]);
}
