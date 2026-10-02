import { describe, expect, it } from 'vitest';

import { visualProfile } from '@/queries/detail/visual-profile';
import { visualScreenshots } from '@/queries/detail/visual-screenshots';
import { catalogVisuals } from '@/queries/catalog/catalog-visuals';
import { popularityHistory } from '@/queries/leaderboard/popularity-history';

import { bucketOf, locate } from './snapshot';

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
