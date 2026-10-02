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
 * the public AppSource catalog and the public leaderboard history, and saves it
 * as a static file. This module hands a query its saved answer in the shape a
 * semantic model query would have returned.
 */

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

function load(file: string): Promise<unknown> {
  let pending = files.get(file);
  if (!pending) {
    pending = fetch(`${import.meta.env.BASE_URL}snapshot/${file}.json`).then(
      (response) => {
        if (!response.ok) {
          throw new Error(
            `The published data could not be loaded (${response.status}).`
          );
        }
        return response.json();
      }
    );
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
