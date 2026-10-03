import type { InteractionEvent } from '@microsoft/fabric-visuals-core';
import { useReducedMotion } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Chart } from '@/components/chart';
import {
  Card,
  CertifiedBadge,
  Kpi,
  ScrollList,
  Segmented,
  Thumb,
} from '@/components/ui';
import type { VisualRef } from '@/components/visual-drawer';
import { VisualsGrid } from '@/components/visuals-grid';
import { EmptyState } from '@/components/states';
import { WordCloud } from '@/components/word-cloud';
import { useFit } from '@/hooks/use-fit';
import {
  categoryCounts,
  kpis,
  publisherStarMix,
  ratingsVsPopularity,
  releasesPerYear,
  topPublishers,
  type CatalogFilters,
  type CatalogVisual,
  type PublisherMeasure,
  type StarCount,
} from '@/lib/catalog';
import {
  formatInt,
  formatPercent,
  formatRating,
  formatScore,
} from '@/lib/format';
import { selectedValue } from '@/lib/interaction';
import { cn } from '@/lib/utils';
import { cloudWords } from '@/lib/word-cloud';
import {
  categoriesChart,
  ratingsVsPopularityChart,
  releasesPerYearChart,
  starMixChart,
  topPublishersChart,
} from '@/queries';

/**
 * Where a page fits the window, Overview and Ratings show one of these at a
 * time. On a smaller window a page shows both, one under the other.
 */
export type CatalogView = 'charts' | 'list';

interface CatalogPageProps {
  visuals: CatalogVisual[];
  stars: StarCount[];
  filters: CatalogFilters;
  onFilters: (filters: CatalogFilters) => void;
  onOpen: (v: VisualRef) => void;
  view: CatalogView;
}

/** A page that fills the room under the filters, with its panels side by side. */
const FIT_PAGE = 'grid min-h-[260px] flex-1 grid-rows-[minmax(0,1fr)] gap-300';

function ClickHint({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-100">
      <MousePointerClick className="icon-size-100" aria-hidden />
      {children}
    </span>
  );
}

export function OverviewPage({
  visuals,
  stars,
  filters,
  onFilters,
  onOpen,
  view,
}: CatalogPageProps) {
  const fit = useFit();
  const [measure, setMeasure] = useState<PublisherMeasure>('visuals');
  const k = useMemo(() => kpis(visuals), [visuals]);
  const releases = useMemo(
    () => releasesPerYearChart.toTable(releasesPerYear(visuals)),
    [visuals]
  );
  const publishers = useMemo(
    () => topPublishersChart.toTable(topPublishers(visuals, measure)),
    [visuals, measure]
  );
  const categories = useMemo(
    () => categoriesChart.toTable(categoryCounts(visuals)),
    [visuals]
  );

  const onYear = (events: InteractionEvent[]) => {
    const year = selectedValue(events, 'Year');
    if (year === null) onFilters({ ...filters, yearFrom: null, yearTo: null });
    else if (year !== undefined)
      onFilters({ ...filters, yearFrom: Number(year), yearTo: Number(year) });
  };
  const onPublisher = (events: InteractionEvent[]) => {
    const publisher = selectedValue(events, 'Publisher');
    if (publisher === null) onFilters({ ...filters, publisher: '' });
    else if (publisher !== undefined) onFilters({ ...filters, publisher: String(publisher) });
  };
  const onCategory = (events: InteractionEvent[]) => {
    const category = selectedValue(events, 'Category');
    if (category === null) onFilters({ ...filters, category: '' });
    else if (category !== undefined) onFilters({ ...filters, category: String(category) });
  };

  return (
    <div className="flex flex-col gap-300 fit:min-h-0 fit:flex-1">
      <div className="grid grid-cols-2 gap-200 md:grid-cols-5 fit:flex fit:shrink-0">
        <Kpi label="Visuals" value={formatInt(k.visuals)} className="fit:grow" />
        <Kpi label="Publishers" value={formatInt(k.publishers)} className="fit:grow" />
        <Kpi label="Ratings" value={formatInt(k.ratings)} className="fit:grow" />
        <Kpi
          label="Average rating"
          value={formatRating(k.averageRating)}
          hint="Across rated visuals only."
          className="fit:grow"
        />
        <Kpi
          label="Certified"
          value={formatPercent(k.certifiedShare)}
          className="col-span-2 md:col-span-1 fit:grow"
        />
      </div>

      {(!fit || view === 'charts') && (
      <div className={fit ? cn(FIT_PAGE, 'grid-cols-3') : 'grid grid-cols-1 gap-300 lg:grid-cols-2'}>
        <Card
          title="Releases per year"
          subtitle={<ClickHint>Select a year to filter every page to it.</ClickHint>}
          className={fit ? 'min-h-0' : 'h-[320px] lg:col-span-2'}
        >
          <Chart
            spec={releasesPerYearChart.vegaLiteSpec}
            table={releases}
            label="Visuals released per year, split by certification"
            onInteraction={onYear}
          />
        </Card>
        <Card
          title="Top publishers"
          subtitle={
            measure === 'visuals'
              ? 'The publishers with the most visuals.'
              : 'The publishers whose visuals add up to the most popularity, in score points.'
          }
          actions={
            <Segmented<PublisherMeasure>
              label="Rank publishers by"
              value={measure}
              onChange={setMeasure}
              options={[
                { value: 'visuals', label: 'Visuals' },
                { value: 'popularity', label: 'Popularity' },
              ]}
            />
          }
          className={fit ? 'min-h-0' : 'h-[380px]'}
        >
          <Chart
            spec={topPublishersChart.vegaLiteSpec}
            table={publishers}
            label="Top publishers"
            onInteraction={onPublisher}
          />
        </Card>
        <Card
          title="Categories"
          subtitle={<ClickHint>Select a category to filter to it.</ClickHint>}
          className={fit ? 'min-h-0' : 'h-[380px]'}
        >
          <Chart
            spec={categoriesChart.vegaLiteSpec}
            table={categories}
            label="Visuals per category"
            onInteraction={onCategory}
          />
        </Card>
      </div>
      )}

      {(!fit || view === 'list') && (
      <Card
        title="Every visual"
        subtitle="Select a visual's name to see its description, ratings and popularity history."
        className={fit ? 'min-h-[260px] flex-1' : 'h-[640px]'}
        bodyClassName="p-0 pt-200"
      >
        <VisualsGrid visuals={visuals} stars={stars} onOpen={onOpen} />
      </Card>
      )}
    </div>
  );
}

export function RatingsPage({ visuals, stars, onOpen, view }: CatalogPageProps) {
  const fit = useFit();
  const mix = useMemo(
    () => starMixChart.toTable(publisherStarMix(visuals, stars)),
    [visuals, stars]
  );
  const rated = useMemo(() => visuals.filter((v) => v.ratings > 0), [visuals]);
  const loved = useMemo(
    () =>
      rated
        .filter((v) => v.ratings >= 20)
        .sort((a, b) => b.averageRating - a.averageRating || b.ratings - a.ratings)
        .slice(0, 5),
    [rated]
  );
  return (
    <div className="flex flex-col gap-300 fit:min-h-0 fit:flex-1">
      {(!fit || view === 'charts') && (
      <div
        className={
          fit
            ? cn(FIT_PAGE, 'grid-cols-[minmax(0,2fr)_minmax(0,1fr)]')
            : 'grid grid-cols-1 gap-300 lg:grid-cols-[2fr_1fr]'
        }
      >
        <Card
          title="How each publisher's visuals are rated"
          subtitle="The share of one to five star ratings for the six publishers with the most raters. The total number of raters is in brackets."
          className={fit ? 'min-h-0' : 'h-[360px]'}
        >
          <Chart
            spec={starMixChart.vegaLiteSpec}
            table={mix}
            label="Star rating mix by publisher"
            emptyText="None of the visuals that match the filters has been rated."
          />
        </Card>
        <Card
          title="Best loved"
          subtitle="The highest average ratings among visuals with at least 20 ratings."
          className="fit:min-h-0"
        >
          {loved.length === 0 ? (
            <EmptyState title="Nobody qualifies">
              No visual that matches the filters has 20 ratings or more.
            </EmptyState>
          ) : (
            <ScrollList className="flex flex-col gap-100 fit:min-h-0 fit:flex-1 fit:overflow-y-auto">
              {loved.map((v, i) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => onOpen({ id: v.id, guid: v.guid, name: v.title })}
                    className="flex min-h-[48px] w-full items-center gap-300 rounded-xl px-200 text-left fit:min-h-[44px] hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <span className="tabular w-[16px] font-heading font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <Thumb src={v.thumbnail} name={v.title} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-200">
                        <span className="truncate text-300 font-semibold">{v.title}</span>
                        {v.certified && <CertifiedBadge />}
                      </span>
                      <span className="block truncate text-200 text-muted-foreground">
                        {formatInt(v.ratings)} ratings
                      </span>
                    </span>
                    <span className="tabular font-heading text-400 font-bold">
                      {formatRating(v.averageRating)}
                      <span aria-hidden className="ml-100 text-gold">
                        ★
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ScrollList>
          )}
        </Card>
      </div>
      )}
      {(!fit || view === 'list') && (
      <Card
        title="Rated visuals"
        subtitle="Every visual with at least one rating, with its share of five star and one star ratings."
        className={fit ? 'min-h-[260px] flex-1' : 'h-[600px]'}
        bodyClassName="p-0 pt-200"
      >
        <VisualsGrid visuals={rated} stars={stars} onOpen={onOpen} mode="ratings" />
      </Card>
      )}
    </div>
  );
}

export function PopularityPage({ visuals, onOpen }: CatalogPageProps) {
  const fit = useFit();
  const scatter = useMemo(
    () => ratingsVsPopularityChart.toTable(ratingsVsPopularity(visuals)),
    [visuals]
  );
  const top = useMemo(
    () => [...visuals].sort((a, b) => b.popularity - a.popularity).slice(0, 8),
    [visuals]
  );
  const onPoint = (events: InteractionEvent[]) => {
    const id = selectedValue(events, 'ID');
    const title = selectedValue(events, 'Title');
    const visual =
      (id != null && visuals.find((v) => v.id === id)) ||
      (title != null && visuals.find((v) => v.title === title)) ||
      undefined;
    if (visual) onOpen({ id: visual.id, guid: visual.guid, name: visual.title });
  };
  return (
    <div
      className={
        fit
          ? cn(FIT_PAGE, 'grid-cols-[minmax(0,2fr)_minmax(0,1fr)]')
          : 'grid grid-cols-1 gap-300 lg:grid-cols-[2fr_1fr]'
      }
    >
      <Card
        title="Ratings against popularity"
        subtitle={
          <ClickHint>
            Many ratings do not guarantee wide use. Select a point to open that visual.
          </ClickHint>
        }
        className={fit ? 'min-h-0' : 'h-[480px]'}
      >
        <Chart
          spec={ratingsVsPopularityChart.vegaLiteSpec}
          table={scatter}
          label="Each visual's number of ratings against its popularity score"
          onInteraction={onPoint}
        />
      </Card>
      <Card
        title="Most popular"
        subtitle="The highest popularity scores among the visuals shown."
        className="fit:min-h-0"
      >
        {top.length === 0 ? (
          <EmptyState title="No visuals match" />
        ) : (
          <ScrollList className="flex flex-col gap-200 fit:min-h-0 fit:flex-1 fit:gap-0 fit:overflow-y-auto">
            {top.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => onOpen({ id: v.id, guid: v.guid, name: v.title })}
                  className="flex w-full flex-col gap-100 rounded-xl px-200 py-100 text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className="flex items-center justify-between gap-200">
                    <span className="flex min-w-0 items-center gap-200">
                      <span className="truncate text-300 font-semibold leading-300">{v.title}</span>
                      {v.certified && <CertifiedBadge />}
                    </span>
                    <span className="tabular font-heading font-bold leading-300">
                      {formatScore(v.popularity)}
                    </span>
                  </span>
                  <span className="h-[6px] overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-pbi"
                      style={{ width: `${Math.round(v.popularity * 100)}%` }}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ScrollList>
        )}
      </Card>
    </div>
  );
}

export function WordsPage({ visuals, onOpen }: CatalogPageProps) {
  const fit = useFit();
  const words = useMemo(() => cloudWords(visuals), [visuals]);
  const [picked, setPicked] = useState<string | null>(null);
  const current = picked ? words.find((w) => w.word === picked) : undefined;
  const selected = current?.word ?? null;
  // The cloud's smallest words are hard to hit on a phone, so the list can name every word.
  const [allWords, setAllWords] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // On narrow screens the list sits below the cloud, so bring it into view.
  useEffect(() => {
    if (selected && window.innerWidth < 1024)
      panel.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [selected, reduceMotion]);
  const listed = allWords ? words : words.slice(0, 10);
  return (
    <div
      className={
        fit
          ? cn(FIT_PAGE, 'grid-cols-[minmax(0,2.4fr)_minmax(280px,1fr)]')
          : 'grid grid-cols-1 gap-300 lg:grid-cols-[minmax(0,2.4fr)_minmax(280px,1fr)]'
      }
    >
      <Card
        title="What publishers talk about"
        subtitle={
          <ClickHint>
            The bigger the word, the more visual descriptions use it. Select a word to list those visuals.
          </ClickHint>
        }
        className="fit:min-h-0"
        bodyClassName="px-300 sm:px-500"
      >
        {words.length === 0 ? (
          <EmptyState title="No words to show">No visual that matches the filters has a description.</EmptyState>
        ) : (
          <WordCloud words={words} selected={selected} onSelect={setPicked} fill={fit} />
        )}
      </Card>
      <div ref={panel} className="scroll-mt-400 fit:min-h-0 [&>section]:h-full">
      {current ? (
        <Card
          title={`Visuals that mention "${current.word}"`}
          subtitle={`${formatInt(current.count)} ${current.count === 1 ? 'visual' : 'visuals'}, most popular first.`}
          actions={
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="min-h-[32px] rounded-full border border-border px-300 text-200 font-semibold hover:bg-hover max-sm:min-h-[44px] focus-visible:outline-2 focus-visible:outline-ring"
            >
              Show the top words
            </button>
          }
        >
          <ScrollList className="flex flex-col gap-100 fit:min-h-0 fit:flex-1 fit:gap-0 fit:overflow-y-auto">
            {current.visuals.slice(0, 10).map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => onOpen({ id: v.id, guid: v.guid, name: v.title })}
                  className="flex w-full items-center gap-300 rounded-xl px-200 py-100 text-left fit:min-h-[36px] fit:py-0 hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Thumb src={v.thumbnail} name={v.title} size={36} fitSize={28} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex min-w-0 items-center gap-200">
                      <span className="truncate text-300 font-semibold fit:leading-300">{v.title}</span>
                      {v.certified && <CertifiedBadge />}
                    </span>
                    <span className="truncate text-200 text-muted-foreground fit:leading-200">{v.publisher}</span>
                  </span>
                  <span className="tabular font-heading font-bold">{formatScore(v.popularity)}</span>
                </button>
              </li>
            ))}
          </ScrollList>
          {current.count > 10 && (
            <p className="mt-200 px-200 text-200 text-muted-foreground fit:shrink-0">
              And {formatInt(current.count - 10)} more.
            </p>
          )}
        </Card>
      ) : (
        <Card
          title="Most mentioned"
          subtitle="The words the most visual descriptions use. Select one to list its visuals."
          actions={
            words.length > 10 && (
              <button
                type="button"
                onClick={() => setAllWords((all) => !all)}
                className="min-h-[32px] rounded-full border border-border px-300 text-200 font-semibold hover:bg-hover max-sm:min-h-[44px] focus-visible:outline-2 focus-visible:outline-ring"
              >
                {allWords ? 'Show the top 10 words' : `Show all ${formatInt(words.length)} words`}
              </button>
            )
          }
        >
          <ScrollList className="flex flex-col gap-100 fit:min-h-0 fit:flex-1 fit:gap-0 fit:overflow-y-auto">
            {listed.map((w) => (
              <li key={w.word}>
                <button
                  type="button"
                  onClick={() => setPicked(w.word)}
                  className="flex w-full flex-col gap-100 rounded-xl px-200 py-100 text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className="flex items-center justify-between gap-200">
                    <span className="truncate text-300 font-semibold leading-300">{w.word}</span>
                    <span className="tabular text-200 text-muted-foreground">
                      {formatInt(w.count)} {w.count === 1 ? 'visual' : 'visuals'}
                    </span>
                  </span>
                  <span className="h-[6px] overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${Math.round((w.count / words[0].count) * 100)}%`, background: 'var(--color-pbi)' }}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ScrollList>
        </Card>
      )}
      </div>
    </div>
  );
}
