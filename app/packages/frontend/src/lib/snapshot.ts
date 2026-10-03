import type { SemanticModelQueryResult } from '@microsoft/rayfin-connector-fabric-semanticmodel';
import { toQueryResult } from '@microsoft/rayfin-connector-fabric-semanticmodel';

import catalogQuery from '@/queries/catalog/catalog-visuals.dax?raw';
import starsQuery from '@/queries/catalog/rating-stars.dax?raw';
import profileQuery from '@/queries/detail/visual-profile.dax?raw';
import screenshotsQuery from '@/queries/detail/visual-screenshots.dax?raw';
import standingsQuery from '@/queries/leaderboard/leaderboard-standings.dax?raw';
import historyQuery from '@/queries/leaderboard/popularity-history.dax?raw';
import replayQuery from '@/queries/leaderboard/popularity-replay.dax?raw';

/**
 * The published data files, which are the app's only data source.
 *
 * `scripts/snapshot.mjs` builds the answer to each of the app's queries from
 * the public Microsoft Marketplace catalog and the public leaderboard history,
 * and saves it as a static file. This module hands a query its saved answer in
 * the shape a semantic model query would have returned.
 *
 * Every build carries its own copy of the files, but only the website rebuilds
 * its copy every night. So a copy published anywhere else, such as a Fabric
 * App, reads the website's files instead when they are newer than its own and
 * in the same format. When the website does not answer in time, holds files in
 * another format, or is not newer, the app reads its own copy.
 */

/** Where the website publishes its data files, rebuilt after every nightly refresh. */
export const WEBSITE_DATA =
  'https://datachant.github.io/PowerBI-Visuals-Marketplace/snapshot/';

/**
 * What the data files hold, as a number. Keep in step with `DATA_FORMAT` in
 * scripts/snapshot.mjs, and raise both whenever a file changes shape, so that a
 * copy published before the change never reads files it cannot understand.
 */
export const DATA_FORMAT = 2;

/** How long the app waits for the website before it reads its own copy. */
const WEBSITE_WAIT_MS = 3000;

/** The app's own copy of the data files, next to the page. */
function ownData(): string {
  return new URL(`${import.meta.env.BASE_URL}snapshot/`, window.location.href)
    .href;
}

type Built = Record<string, unknown>;

/** The built.json of one copy of the data files. Undefined when it cannot be read in time. */
async function readBuilt(base: string, waitMs?: number): Promise<Built | undefined> {
  const controller = new AbortController();
  const timer =
    waitMs === undefined ? undefined : setTimeout(() => controller.abort(), waitMs);
  try {
    const response = await fetch(`${base}built.json`, {
      cache: 'no-cache',
      signal: controller.signal,
    });
    if (!response.ok) return undefined;
    const built: unknown = await response.json();
    return built && typeof built === 'object' ? (built as Built) : undefined;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * Whether build `a` holds newer data than build `b`. The leaderboard date
 * decides, and the build time breaks a tie, because the catalog is read fresh
 * on every build even when the leaderboard has not moved.
 */
function isNewer(a: Built, b: Built): boolean {
  if (text(a.asOf) !== text(b.asOf)) return text(a.asOf) > text(b.asOf);
  return text(a.builtAt) > text(b.builtAt);
}

/**
 * Which copy of the data files this page load reads: the website's when it is
 * newer than the app's own and in the same format, otherwise the app's own.
 */
export async function chooseSource(
  own: string,
  website: string = WEBSITE_DATA,
  waitMs: number = WEBSITE_WAIT_MS
): Promise<string> {
  if (own === website) return own;
  const [mine, theirs] = await Promise.all([
    readBuilt(own),
    readBuilt(website, waitMs),
  ]);
  if (!theirs || theirs.format !== DATA_FORMAT || !text(theirs.asOf)) return own;
  return isNewer(theirs, mine ?? {}) ? website : own;
}

let source: Promise<string> | undefined;

/**
 * The copy this page load reads, decided once, when the first file is needed.
 * `npm run dev` always reads the files on this computer, because those are the
 * ones being worked on.
 */
function dataSource(): Promise<string> {
  source ??= import.meta.env.DEV
    ? Promise.resolve(ownData())
    : chooseSource(ownData());
  return source;
}

/** Whole-catalog queries, each saved as one file. */
const WHOLE = new Map<string, string>([
  [catalogQuery, 'catalog'],
  [starsQuery, 'stars'],
  [standingsQuery, 'standings'],
  [replayQuery, 'replay'],
]);

/** Per-visual queries, saved in buckets keyed by the value that replaces the placeholder. */
const PER_VISUAL = [
  { name: 'profile', template: profileQuery, placeholder: '__ID__' },
  { name: 'screenshots', template: screenshotsQuery, placeholder: '__ID__' },
  { name: 'history', template: historyQuery, placeholder: '__GUID__' },
].map(({ name, template, placeholder }) => {
  // The placeholder also appears in each query's own comment, so the factory
  // writes the key more than once and every copy has to agree.
  const parts = template
    .split(placeholder)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const [first, ...rest] = parts;
  return {
    name,
    pattern: new RegExp(`^${first}(.+?)${rest.join('\\1')}$`, 's'),
  };
});

/** Keep in step with `bucketOf` in scripts/snapshot.mjs. */
const BUCKETS = 64;
export function bucketOf(key: string): number {
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return sum % BUCKETS;
}

/** Which snapshot file answers a query, and for which visual. Undefined for a query the snapshot does not hold. */
export function locate(
  query: string
): { file: string; key?: string } | undefined {
  const whole = WHOLE.get(query);
  if (whole) return { file: whole };
  for (const { name, pattern } of PER_VISUAL) {
    const key = pattern.exec(query)?.[1];
    if (key) return { file: `${name}-${bucketOf(key)}`, key };
  }
  return undefined;
}

const files = new Map<string, Promise<unknown>>();

async function download(base: string, file: string): Promise<unknown> {
  const response = await fetch(`${base}${file}.json`);
  if (!response.ok) {
    throw new Error(
      `The published data could not be loaded (${response.status}).`
    );
  }
  return response.json();
}

function load(file: string): Promise<unknown> {
  let pending = files.get(file);
  if (!pending) {
    pending = dataSource().then((base) => {
      const own = ownData();
      if (base === own) return download(own, file);
      // A file the website fails to send is read from the app's own copy.
      return download(base, file).catch(() => download(own, file));
    });
    // A failed download is retried on the next request instead of being kept.
    pending.catch(() => files.delete(file));
    files.set(file, pending);
  }
  return pending;
}

/** The saved answer to one of the app's queries. */
export async function querySnapshot(
  query: string
): Promise<SemanticModelQueryResult> {
  const found = locate(query);
  if (!found) throw new Error('The published data does not hold this query.');
  const saved = await load(found.file);
  if (found.key === undefined) return toQueryResult(saved as never);
  const { columns, rows } = saved as {
    columns: unknown[];
    rows: Record<string, unknown[][]>;
  };
  return toQueryResult({
    status: 'success',
    table: { columns, rows: rows[found.key] ?? [] },
  } as never);
}
