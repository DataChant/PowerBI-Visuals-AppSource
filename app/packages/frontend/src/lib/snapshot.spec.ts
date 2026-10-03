import { afterEach, describe, expect, it, vi } from 'vitest';

import { visualProfile } from '@/queries/detail/visual-profile';
import { visualScreenshots } from '@/queries/detail/visual-screenshots';
import { catalogVisuals } from '@/queries/catalog/catalog-visuals';
import { popularityHistory } from '@/queries/leaderboard/popularity-history';

import snapshotScript from '../../../../scripts/snapshot.mjs?raw';

import {
  DATA_FORMAT,
  WEBSITE_DATA,
  bucketOf,
  chooseSource,
  locate,
} from './snapshot';

const OWN = 'https://app.example/snapshot/';

/**
 * Stands in for the network. Each address answers with its body, a thrown
 * error, or nothing until the request is aborted. Any other address is a 404.
 */
function serve(answers: Record<string, unknown>): string[] {
  const asked: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string, init?: RequestInit) => {
      asked.push(url);
      const answer = answers[url];
      if (answer === 'hang') {
        return new Promise((_, reject) =>
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError'))
          )
        );
      }
      if (answer instanceof Error) return Promise.reject(answer);
      if (answer === undefined) {
        return Promise.resolve({ ok: false, status: 404, json: async () => ({}) });
      }
      return Promise.resolve({ ok: true, status: 200, json: async () => answer });
    })
  );
  return asked;
}

/** A built.json. A `format` of null leaves the format out, as files built before it existed do. */
const built = (asOf: string, builtAt = '', format: number | null = DATA_FORMAT) => ({
  asOf,
  ...(builtAt ? { builtAt } : {}),
  ...(format === null ? {} : { format }),
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('choosing which copy of the data files to read', () => {
  it('reads the website when its leaderboard is newer', async () => {
    serve({
      [`${OWN}built.json`]: built('2026-10-01T23:19:30.000'),
      [`${WEBSITE_DATA}built.json`]: built('2026-10-02T23:20:11.000'),
    });
    await expect(chooseSource(OWN)).resolves.toBe(WEBSITE_DATA);
  });

  it('reads its own copy when that is newer', async () => {
    serve({
      [`${OWN}built.json`]: built('2026-10-03T23:18:02.000'),
      [`${WEBSITE_DATA}built.json`]: built('2026-10-02T23:20:11.000'),
    });
    await expect(chooseSource(OWN)).resolves.toBe(OWN);
  });

  it('reads the website when both hold the same leaderboard and the website was built later', async () => {
    serve({
      [`${OWN}built.json`]: built('2026-10-01T23:19:30.000', '2026-10-02T08:00:00.000Z'),
      [`${WEBSITE_DATA}built.json`]: built('2026-10-01T23:19:30.000', '2026-10-02T23:40:00.000Z'),
    });
    await expect(chooseSource(OWN)).resolves.toBe(WEBSITE_DATA);
  });

  it('reads its own copy when both were built at the same time', async () => {
    const same = built('2026-10-01T23:19:30.000', '2026-10-02T23:40:00.000Z');
    serve({ [`${OWN}built.json`]: same, [`${WEBSITE_DATA}built.json`]: same });
    await expect(chooseSource(OWN)).resolves.toBe(OWN);
  });

  it('reads the website when its own copy says nothing about when it was built', async () => {
    serve({ [`${WEBSITE_DATA}built.json`]: built('2026-10-02T23:20:11.000') });
    await expect(chooseSource(OWN)).resolves.toBe(WEBSITE_DATA);
  });

  it('reads its own copy when the website holds files in another format', async () => {
    serve({
      [`${OWN}built.json`]: built('2026-10-01T23:19:30.000'),
      [`${WEBSITE_DATA}built.json`]: built('2026-10-02T23:20:11.000', '', DATA_FORMAT + 1),
    });
    await expect(chooseSource(OWN)).resolves.toBe(OWN);
  });

  it('reads its own copy when the website names no format, as it did before this check existed', async () => {
    serve({
      [`${OWN}built.json`]: built('2026-10-01T23:19:30.000'),
      [`${WEBSITE_DATA}built.json`]: built('2026-10-02T23:20:11.000', '', null),
    });
    await expect(chooseSource(OWN)).resolves.toBe(OWN);
  });

  it('reads its own copy when the website cannot be reached', async () => {
    serve({
      [`${OWN}built.json`]: built('2026-10-01T23:19:30.000'),
      [`${WEBSITE_DATA}built.json`]: new TypeError('Failed to fetch'),
    });
    await expect(chooseSource(OWN)).resolves.toBe(OWN);
  });

  it('reads its own copy when the website does not answer in time', async () => {
    serve({
      [`${OWN}built.json`]: built('2026-10-01T23:19:30.000'),
      [`${WEBSITE_DATA}built.json`]: 'hang',
    });
    await expect(chooseSource(OWN, WEBSITE_DATA, 20)).resolves.toBe(OWN);
  });

  it('asks nothing when the app is the website itself', async () => {
    const asked = serve({});
    await expect(chooseSource(WEBSITE_DATA)).resolves.toBe(WEBSITE_DATA);
    expect(asked).toEqual([]);
  });

  it('uses the same format number as the script that builds the files', () => {
    const format = /const DATA_FORMAT = (\d+);/.exec(snapshotScript)?.[1];
    expect(Number(format)).toBe(DATA_FORMAT);
  });
});

describe('reading a file from the chosen copy', () => {
  const id = 'publisher1234.somevisual';
  const bucket = `profile-${bucketOf(id)}.json`;
  const columns = [{ name: '[Name]', dataType: 'String' }];
  const own = () => new URL('/snapshot/', window.location.href).href;

  it('reads the file from the website when the website is newer', async () => {
    vi.stubEnv('DEV', false);
    const asked = serve({
      [`${own()}built.json`]: built('2026-10-01T23:19:30.000'),
      [`${WEBSITE_DATA}built.json`]: built('2026-10-02T23:20:11.000'),
      [`${WEBSITE_DATA}${bucket}`]: { columns, rows: { [id]: [['From the website']] } },
      [`${own()}${bucket}`]: { columns, rows: { [id]: [['From the app']] } },
    });
    const { querySnapshot } = await import('./snapshot');
    const result = (await querySnapshot(visualProfile(id).query)) as {
      table: { rows: unknown[][] };
    };
    expect(result.table.rows).toEqual([['From the website']]);
    expect(asked).not.toContain(`${own()}${bucket}`);
  });

  it('reads the file from its own copy when the website fails to send it', async () => {
    vi.stubEnv('DEV', false);
    serve({
      [`${own()}built.json`]: built('2026-10-01T23:19:30.000'),
      [`${WEBSITE_DATA}built.json`]: built('2026-10-02T23:20:11.000'),
      [`${own()}${bucket}`]: { columns, rows: { [id]: [['From the app']] } },
    });
    const { querySnapshot } = await import('./snapshot');
    const result = (await querySnapshot(visualProfile(id).query)) as {
      table: { rows: unknown[][] };
    };
    expect(result.table.rows).toEqual([['From the app']]);
  });

  it('never asks the website while the app runs on this computer', async () => {
    vi.stubEnv('DEV', true);
    const asked = serve({
      [`${own()}${bucket}`]: { columns, rows: { [id]: [['From the app']] } },
    });
    const { querySnapshot } = await import('./snapshot');
    await querySnapshot(visualProfile(id).query);
    expect(asked).toEqual([`${own()}${bucket}`]);
  });
});

describe('locating a query in the published data snapshot', () => {
  it('answers a whole-catalog query from its own file', () => {
    expect(locate(catalogVisuals().query)).toEqual({ file: 'catalog' });
  });

  it('answers a per-visual query from the bucket of that visual', () => {
    const id = 'publisher1234.somevisual';
    const guid = 'someVisual1234ABCD';
    expect(locate(visualProfile(id).query)).toEqual({
      file: `profile-${bucketOf(id)}`,
      key: id,
    });
    expect(locate(visualScreenshots(id).query)).toEqual({
      file: `screenshots-${bucketOf(id)}`,
      key: id,
    });
    expect(locate(popularityHistory(guid).query)).toEqual({
      file: `history-${bucketOf(guid)}`,
      key: guid,
    });
  });

  it('holds nothing for a query the app does not send', () => {
    expect(locate('EVALUATE Leaderboard')).toBeUndefined();
  });
});
