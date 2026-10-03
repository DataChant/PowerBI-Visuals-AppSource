import { MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { FilterBar } from '@/components/filter-bar';
import { Header } from '@/components/header';
import { ErrorState, LoadingBlock } from '@/components/states';
import { CertifiedBadge, Segmented } from '@/components/ui';
import { VisualDrawer, type VisualRef } from '@/components/visual-drawer';
import { useFit } from '@/hooks/use-fit';
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
import { cn } from '@/lib/utils';
import {
  OverviewPage,
  PopularityPage,
  RatingsPage,
  WordsPage,
  type CatalogView,
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
  // Where a page fits the window, Overview and Ratings show their charts or
  // their list, one at a time. On a smaller window both are stacked.
  const [view, setView] = useState<CatalogView>('charts');
  const fit = useFit();

  const standingsState = useQueryTable(STANDINGS);
  const catalogState = useQueryTable(CATALOG);
  const starsState = useQueryTable(STARS);
  // The daily history is large, so it is fetched the first time the Replay
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
    // The replay runs one day at a time, up to the latest snapshot date.
    const day = new Date(Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate()));
    return buildReplay(replayTable, day);
  }, [replayTable, asOf]);
  const filtered = useMemo(() => applyFilters(catalog, filters), [catalog, filters]);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const tabLabel = TABS.find((t) => t.id === tab)?.label ?? '';
  // A browser tab, a bookmark and a screen reader's window list all name the section.
  useEffect(() => {
    document.title = `${tabLabel} | Custom Visuals Marketplace`;
  }, [tabLabel]);

  const goTo = (next: Tab) => {
    setTab(next);
    window.history.replaceState(null, '', `#${next}`);
    window.scrollTo({ top: 0 });
  };
  const close = useCallback(() => setOpen(null), []);
  // One choice for the whole app: the Leaderboard and Replay toggles and the
  // Certification filter on the catalog tabs all read and write the same value.
  const certifiedOnly = filters.certified === 'certified';
  const setCertifiedOnly = useCallback(
    (only: boolean) =>
      setFilters((f) => ({ ...f, certified: only ? 'certified' : 'all' })),
    []
  );

  const isLeaderboard = tab === 'leaderboard';
  const isReplay = tab === 'replay';
  // The replay needs the standings for names and icons as well as its own history.
  // The catalog names the newest visuals, and fills in once it loads.
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
              ? 'The replay history could not load.'
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
        className="h-[480px] rounded-3xl border border-border bg-card fit:h-auto fit:flex-1"
      />
    );
  } else if (isLeaderboard) {
    content = (
      <LeaderboardPage
        standings={standings}
        certifiedOnly={certifiedOnly}
        onCertifiedOnly={setCertifiedOnly}
        onOpen={setOpen}
      />
    );
  } else if (isReplay) {
    content = replay && (
      <ReplayPage
        replay={replay}
        standings={standings}
        catalog={catalog}
        certifiedOnly={certifiedOnly}
        onCertifiedOnly={setCertifiedOnly}
        onOpen={setOpen}
      />
    );
  } else {
    const props = {
      visuals: filtered,
      stars,
      filters,
      onFilters: setFilters,
      onOpen: setOpen,
      view,
    };
    content = (
      <div className="flex flex-col gap-300 fit:min-h-0 fit:flex-1">
        <h1 className="sr-only">{tabLabel}</h1>
        <FilterBar
          visuals={catalog}
          shown={filtered.length}
          filters={filters}
          onChange={setFilters}
          actions={
            fit && (tab === 'overview' || tab === 'ratings') ? (
              <Segmented<CatalogView>
                label="View"
                value={view}
                onChange={setView}
                options={[
                  { value: 'charts', label: 'Charts' },
                  {
                    value: 'list',
                    label: tab === 'overview' ? 'Every visual' : 'Rated visuals',
                  },
                ]}
              />
            ) : undefined
          }
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
    <MotionConfig reducedMotion="user">
      <div
        className={cn(
          'min-h-full bg-background',
          // On a window that is wide and tall enough, a page is exactly one
          // screen: the header and footer keep their height and the page takes
          // the rest. The replay is left alone, because it sizes itself.
          !isReplay && 'fit:flex fit:h-dvh fit:flex-col fit:overflow-hidden'
        )}
      >
        <Header tab={tab} onTab={goTo} />
        <main
          className={cn(
            'mx-auto w-full max-w-[1280px] px-400',
            // The replay is a player that fits one screen, so it keeps its margins tight.
            isReplay
              ? 'py-300'
              : 'py-400 fit:flex fit:min-h-0 fit:flex-1 fit:flex-col fit:overflow-y-auto fit:py-200'
          )}
        >
          {content}
        </main>
        {/* The replay ends at the bottom of the window, and repeats these sentences in its own help. */}
        {!isReplay && (
          <footer className="mx-auto flex w-full max-w-[1280px] flex-col gap-100 px-400 pb-400 text-200 leading-200 text-muted-foreground fit:shrink-0 fit:gap-0 fit:pb-200">
            <p>
              <CertifiedBadge className="mr-100 align-[-3px]" />
              Certified visuals passed Microsoft's code review and can export to PowerPoint and
              PDF.
            </p>
            <p>
              Data from Microsoft Marketplace, collected daily. Popularity is Microsoft
              Marketplace's own usage percentile. Made with love for the Power BI community.
            </p>
          </footer>
        )}
        <VisualDrawer
          visual={open}
          catalog={catalog}
          standings={standings}
          stars={stars}
          onClose={close}
        />
      </div>
    </MotionConfig>
  );
}

export default App;
