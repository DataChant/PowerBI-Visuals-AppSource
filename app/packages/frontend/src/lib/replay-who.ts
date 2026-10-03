import type { VisualRef } from '@/components/visual-drawer';
import type { CatalogVisual } from '@/lib/catalog';
import type { Standing } from '@/lib/leaderboard';

/**
 * What the replay shows of a visual: its name, publisher and icon, and the
 * catalog ID that opens its details. Whether it is certified is not here,
 * because that changes during the replay and each day's frame says so.
 */
export interface Who {
  guid: string;
  name: string;
  publisher: string;
  thumbnail: string;
  catalogId: string;
}

/**
 * Each replay visual's identity, indexed like `Replay.guids`. The leaderboard
 * knows most visuals, and the catalog knows the ones the leaderboard has not
 * read yet. Undefined for a visual neither knows.
 */
export function whoOf(
  guids: string[],
  standings: Standing[],
  catalog: CatalogVisual[]
): (Who | undefined)[] {
  const standing = new Map(standings.map((s) => [s.guid, s]));
  const listing = new Map(catalog.map((c) => [c.guid, c]));
  return guids.map((guid) => {
    const s = standing.get(guid);
    const c = listing.get(guid);
    if (!s && !c) return undefined;
    return {
      guid,
      name: s?.name || c?.title || '',
      publisher: s?.publisher || c?.publisher || '',
      thumbnail: s?.thumbnail || c?.thumbnail || '',
      catalogId: s?.catalogId || c?.id || '',
    };
  });
}

/** What the visual drawer needs to open a visual. */
export function refOf(who: Who): VisualRef {
  return { id: who.catalogId, guid: who.guid, name: who.name };
}
