import { useCallback, useEffect, useMemo, useState } from 'react';

import { FilterBar } from '@/components/filter-bar';
import { Header } from '@/components/header';
import { ErrorState, LoadingBlock } from '@/components/states';
import { VisualDrawer, type VisualRef } from '@/components/visual-drawer';
import { useQueryTable } from '@/hooks/use-query-table';
import {
  applyFilters,
  NO_FILTERS,
  parseCatalog,
  parseStars,
  type CatalogFilters,
} from '@/lib/catalog';
import { parseStandings } from '@/lib/leaderboard';
import { buildReplay } from '@/lib/replay';
import { TABS, type Tab } from '@/lib/tabs';
import {
  OverviewPage,
  PopularityPage,
  RatingsPage,
  WordsPage,
} from '@/pages/catalog-pages';
import { LeaderboardPage } from '@/pages/leaderboard-page';
import { ReplayPage } from '@/pages/replay-page';
import {
  catalogVisuals,
  leaderboardStandings,
  popularityReplay,
  ratingStars,
} from '@/queries';

function tabFromHash(): Tab {
  const id = window.location.hash.replace('#', '');
  return TABS.some((t) => t.id === id) ? (id as Tab) : 'leaderboard';
}

const STANDINGS = leaderboardStandings();
const CATALOG = catalogVisuals();
const STARS = ratingStars();
const REPLAY = popularityReplay();
const IDLE = { connection: REPLAY.connection, query: '' };

function App() {
  const [tab, setTab] = useState<Tab>(tabFromHash);
  const [filters, setFilters] = useState<CatalogFilters>(NO_FILTERS);
  const [open, setOpen] = useState<VisualRef | null>(null);

  const standingsState = useQueryTable(STANDINGS);
  const catalogState = useQueryTable(CATALOG);
  const starsState = useQueryTable(STARS);
  // The weekly history is large, so it is fetched the first time the Replay
  // tab opens and then kept, rather than on every visit to the app.
  const [replayWanted, setReplayWanted] = useState(tab === 'replay');
  if (tab === 'replay' && !replayWanted) setReplayWanted(true);
  const replayState = useQueryTable(replayWanted ? REPLAY : IDLE);

  const standingsTable = standingsState.status === 'success' ? standingsState.table : null;
  const catalogTable = catalogState.status === 'success' ? catalogState.table : null;
  const starsTable = starsState.status === 'success' ? starsState.table : null;
  const standings = useMemo(
    () => (standingsTable ? parseStandings(standingsTable) : []),
    [standingsTable]
  );
  const catalog = useMemo(
    () => (catalogTable ? parseCatalog(catalogTable) : []),
    [catalogTable]
  );
  const stars = useMemo(() => (starsTable ? parseStars(starsTable) : []), [starsTable]);
  const replayTable = replayState.status === 'success' ? replayState.table : null;
  const asOf = useMemo(
    () =>
      standings.reduce<Date | null>(
        (latest, s) => (s.asOf && (!latest || s.asOf > latest) ? s.asOf : latest),
        null
      ),
    [standings]
  );
  const replay = useMemo(() => {
    if (!replayTable || !asOf) return null;
    // Weeks are counted in whole days back from the latest snapshot date.
    const day = new Date(Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate()));
    return buildReplay(replayTable, day);
  }, [replayTable, asOf]);
  const filtered = useMemo(() => applyFilters(catalog, filters), [catalog, filters]);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goTo = (next: Tab) => {
    setTab(next);
    window.history.replaceState(null, '', `#${next}`);
    window.scrollTo({ top: 0 });
  };
  const close = useCallback(() => setOpen(null), []);

  const isLeaderboard = tab === 'leaderboard';
  const isReplay = tab === 'replay';
  // The replay needs the standings for names and icons as well as its own history.
  const primary = isLeaderboard
    ? standingsState
    : isReplay
      ? standingsState.status === 'success'
        ? replayState
        : standingsState
      : catalogState;

  let content;
  if (primary.status === 'error') {
    content = (
      <ErrorState
        title={
          isLeaderboard
            ? 'The leaderboard could not load.'
            : isReplay
              ? 'The weekly history could not load.'
              : 'The Microsoft Marketplace catalog could not load.'
        }
        message={primary.message}
        onRetry={primary.retry}
      />
    );
  } else if (primary.status === 'loading') {
    content = (
      <LoadingBlock
        label="Loading"
        className="h-[480px] rounded-3xl border border-border bg-card"
      />
    );
  } else if (isLeaderboard) {
    content = <LeaderboardPage standings={standings} onOpen={setOpen} />;
  } else if (isReplay) {
    content = replay && (
      <ReplayPage replay={replay} standings={standings} onOpen={setOpen} />
    );
  } else {
    const props = { visuals: filtered, stars, filters, onFilters: setFilters, onOpen: setOpen };
    content = (
      <div className="flex flex-col gap-400">
        <FilterBar
          visuals={catalog}
          shown={filtered.length}
          filters={filters}
          onChange={setFilters}
        />
        {tab === 'ratings' && starsState.status === 'error' && (
          <ErrorState
            title="The individual star ratings could not load."
            message={starsState.message}
            onRetry={starsState.retry}
          />
        )}
        {tab === 'overview' && <OverviewPage {...props} />}
        {tab === 'ratings' && <RatingsPage {...props} />}
        {tab === 'popularity' && <PopularityPage {...props} />}
        {tab === 'words' && <WordsPage {...props} />}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <Header tab={tab} onTab={goTo} />
      <main className="mx-auto max-w-[1280px] px-400 py-600">{content}</main>
      <footer className="mx-auto max-w-[1280px] px-400 pb-800 text-200 text-muted-foreground">
        Data from Microsoft Marketplace, collected daily. Popularity is Microsoft Marketplace's
        own usage percentile. Made with love for the Power BI community.
      </footer>
      <VisualDrawer
        visual={open}
        catalog={catalog}
        standings={standings}
        stars={stars}
        onClose={close}
      />
    </div>
  );
}

export default App;
