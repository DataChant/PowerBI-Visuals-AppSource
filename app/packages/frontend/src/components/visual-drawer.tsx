import { useCssTheme, VegaVisual } from '@microsoft/fabric-visuals';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, ExternalLink, PlayCircle, Star, X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

import { useInert } from '@/hooks/use-inert';
import { useQueryTable } from '@/hooks/use-query-table';
import type { CatalogVisual, StarCount } from '@/lib/catalog';
import { starsFor } from '@/lib/catalog';
import {
  formatDate,
  formatInt,
  formatRating,
  formatScore,
} from '@/lib/format';
import type { Standing } from '@/lib/leaderboard';
import { asString, readRows } from '@/lib/table';
import { toDataTable } from '@/lib/to-data-table';
import { popularityHistory, visualProfile, visualScreenshots } from '@/queries';

import { ChartImage, ChartTable } from './chart';
import { EmptyState, ErrorState, LoadingBlock } from './states';
import { CertifiedBadge, Thumb } from './ui';

/** Enough to open a visual from any surface: the catalog ID for details, the GUID for history. */
export interface VisualRef {
  id: string;
  guid: string;
  name: string;
}

const SAFE = /^[A-Za-z0-9._-]{1,200}$/;

/** Builds a query only for a usable key; an empty query keeps the hook idle. */
function safeQuery(key: string, build: (key: string) => { connection: string; query: string }) {
  return SAFE.test(key) ? build(key) : { connection: '', query: '' };
}

function Facts({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-400 gap-y-200 sm:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-200 text-muted-foreground">{label}</dt>
          <dd className="tabular truncate font-heading text-400 font-bold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function StarBars({ counts }: { counts: number[] }) {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0)
    return (
      <p className="text-200 text-muted-foreground">
        Nobody has rated this visual on Microsoft Marketplace yet.
      </p>
    );
  return (
    <ul className="flex flex-col gap-100">
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = counts[stars - 1];
        const share = count / total;
        return (
          <li key={stars} className="flex items-center gap-200 text-200">
            <span className="tabular w-[52px] shrink-0 text-muted-foreground">
              {stars} {stars === 1 ? 'star' : 'stars'}
            </span>
            <span className="h-[8px] flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-pbi"
                style={{ width: `${Math.round(share * 100)}%` }}
              />
            </span>
            <span className="tabular w-[44px] shrink-0 text-right">
              {formatInt(count)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** The library's crosshair tooltip lists only the axes, so the chart keeps the tooltip its spec declares. */
const OWN_TOOLTIP = { disableLineChartCrosshairTooltip: true };

function History({
  guid,
  name,
  thumbnail,
  early,
}: {
  guid: string;
  name: string;
  thumbnail: string;
  /** The visual left before the leaderboard began, so it has no daily record. */
  early: boolean;
}) {
  const theme = useCssTheme();
  const source = SAFE.test(guid) ? popularityHistory(guid) : null;
  // The history rows carry no name or logo, so the tooltip takes them from the open visual.
  const spec = useMemo(() => {
    const base = source?.vegaLiteSpec as { transform?: unknown[] } | undefined;
    if (!base) return null;
    return {
      ...base,
      transform: [
        ...(base.transform ?? []),
        { calculate: JSON.stringify(name), as: 'Visual' },
        { calculate: JSON.stringify(thumbnail), as: 'Logo' },
      ],
    } as NonNullable<typeof source>['vegaLiteSpec'];
  },[source?.vegaLiteSpec, name, thumbnail]);
  const state = useQueryTable(source ?? { connection: '', query: '' });
  const table = useMemo(
    () =>
      source && state.status === 'success'
        ? toDataTable(state.table, source.columnMetadata)
        : null,
    // The query string identifies the source; the object is rebuilt every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, source?.query]
  );
  if (!source)
    return (
      <EmptyState title="No history yet">
        The leaderboard has not recorded this visual.
      </EmptyState>
    );
  if (state.status === 'error')
    return (
      <ErrorState
        title="The popularity history could not load."
        message={state.message}
        onRetry={state.retry}
      />
    );
  if (!table) return <LoadingBlock label="Loading popularity history" className="h-[220px]" />;
  if (table.rows.length < 2)
    return early ? (
      <EmptyState title="No popularity history">
        This visual left Microsoft Marketplace before July 2025, when popularity began to
        be recorded every day.
      </EmptyState>
    ) : (
      <EmptyState title="Not enough history yet">
        The leaderboard needs at least two snapshots to draw a trend.
      </EmptyState>
    );
  return (
    <>
      <ChartImage label="Popularity over time" className="flex h-[220px] flex-col">
        <VegaVisual
          spec={spec ?? source.vegaLiteSpec}
          capabilities={OWN_TOOLTIP}
          data={table}
          theme={theme}
          className="min-h-0 flex-1"
          style={{ width: '100%', height: '100%' }}
        />
      </ChartImage>
      <ChartTable table={table} caption={`${name}, popularity and ratings over time`} />
    </>
  );
}

/** Said after the name of every link that opens in a new tab. */
function NewTab() {
  return <span className="sr-only">, opens in a new tab</span>;
}

function Profile({ id, name }: { id: string; name: string }) {
  const profile = useQueryTable(safeQuery(id, visualProfile));
  const shots = useQueryTable(safeQuery(id, visualScreenshots));
  const gone = (
    <p className="text-300 text-muted-foreground">
      This visual is no longer listed on Microsoft Marketplace, so its description and
      screenshots are gone too.
    </p>
  );
  if (!SAFE.test(id)) return gone;
  if (profile.status === 'error')
    return (
      <ErrorState
        title="The visual's description could not load."
        message={profile.message}
        onRetry={profile.retry}
      />
    );
  if (profile.status === 'loading')
    return <LoadingBlock label="Loading description" className="h-[160px]" />;
  const [info] = readRows(profile.table, (get) => ({
    summary: asString(get('[Long Summary]')),
    sample: asString(get('[Download Sample]')),
    support: asString(get('[Support Link]')),
    privacy: asString(get('[Privacy Policy]')),
    legal: asString(get('[Legal Terms]')),
    video: asString(get('[Video]')),
    videoPreview: asString(get('[Video Preview]')),
  }));
  if (!info) return gone;
  const screenshots =
    shots.status === 'success'
      ? readRows(shots.table, (get) => asString(get('[Url]'))).filter(Boolean)
      : [];
  const links = ([
        ['Sample report', info.sample],
        ['Support', info.support],
        ['Privacy policy', info.privacy],
        ['License terms', info.legal],
      ] as const).filter(([, href]) => href.startsWith('https://'));
  return (
    <div className="flex flex-col gap-400">
      {info.summary && (
        <p className="whitespace-pre-line text-300 leading-300">{info.summary}</p>
      )}
      {info.video.startsWith('https://') && (
        <a
          href={info.video}
          target="_blank"
          rel="noreferrer"
          className="group relative block overflow-hidden rounded-2xl border border-border bg-muted"
        >
          {info.videoPreview.startsWith('https://') && (
            <img
              src={info.videoPreview}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              className="aspect-video w-full object-cover"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white transition-colors group-hover:bg-black/45">
            <span className="inline-flex items-center gap-200 rounded-full bg-black/60 px-400 py-200 text-300 font-semibold">
              <PlayCircle className="icon-size-300" aria-hidden />
              Watch the video
              <NewTab />
            </span>
          </span>
        </a>
      )}
      {screenshots.length > 0 && (
        <div>
          <h3 className="mb-200 text-300 font-bold">Screenshots</h3>
          <div className="flex snap-x gap-200 overflow-x-auto pb-200">
            {screenshots.map((url, i) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 snap-start overflow-hidden rounded-xl border border-border"
              >
                <img
                  src={url}
                  alt={`${name}, screenshot ${i + 1} of ${screenshots.length}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-[140px] w-auto"
                />
                <NewTab />
              </a>
            ))}
          </div>
        </div>
      )}
      {links.length > 0 && (
        <ul className="flex flex-wrap gap-200">
          {links.map(([label, href]) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-100 rounded-full border border-border px-300 py-100 text-200 font-medium hover:bg-accent"
              >
                {label}
                <ExternalLink className="icon-size-100" aria-hidden />
                <NewTab />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function VisualDrawer({
  visual,
  catalog,
  standings,
  stars,
  onClose,
}: {
  visual: VisualRef | null;
  catalog: CatalogVisual[];
  standings: Standing[];
  stars: StarCount[];
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  // Declared before the focus effect, so the page is released before focus returns to it.
  useInert(rootRef, Boolean(visual));

  useEffect(() => {
    if (!visual) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [visual, onClose]);

  const entry = visual
    ? catalog.find((v) => v.id === visual.id) ??
      catalog.find((v) => v.guid === visual.guid)
    : undefined;
  const standing = visual
    ? standings.find((s) => s.guid === visual.guid) ??
      standings.find((s) => s.catalogId === visual.id)
    : undefined;
  const id = entry?.id ?? visual?.id ?? '';
  const guid = entry?.guid ?? standing?.guid ?? visual?.guid ?? '';
  const name = entry?.title ?? standing?.name ?? visual?.name ?? '';
  const publisher = entry?.publisher ?? standing?.publisher ?? '';
  const thumbnail = entry?.thumbnail ?? standing?.thumbnail ?? '';
  const certified = entry?.certified ?? standing?.certified ?? false;

  return (
    <AnimatePresence>
      {visual && (
        <div ref={rootRef} className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={name}
            className="relative flex h-full w-full max-w-[560px] flex-col overflow-y-auto bg-background shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          >
            <div className="hero-glow sticky top-0 z-10 flex items-start gap-300 border-b border-border p-500">
              <Thumb src={thumbnail} name={name} size={56} className="bg-card" />
              <div className="min-w-0 flex-1">
                <h2 className="text-500 font-extrabold leading-500">{name}</h2>
                <p className="text-300 text-muted-foreground">{publisher}</p>
                <div className="mt-200 flex flex-wrap items-center gap-200">
                  {certified && <CertifiedBadge label />}
                  {standing?.removed && (
                    <span className="rounded-full bg-muted px-200 py-[1px] text-100 font-bold uppercase tracking-wide text-muted-foreground">
                      Removed from Microsoft Marketplace
                    </span>
                  )}
                  {entry?.link.startsWith('https://') && (
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-100 text-200 font-semibold text-brand-foreground hover:underline"
                    >
                      Open in Microsoft Marketplace
                      <ExternalLink className="icon-size-100" aria-hidden />
                      <NewTab />
                    </a>
                  )}
                  {entry?.download.startsWith('https://') && (
                    <a
                      href={entry.download}
                      download
                      data-download-link
                      className="inline-flex items-center gap-100 text-200 font-semibold text-brand-foreground hover:underline"
                    >
                      Download .pbiviz
                      <Download className="icon-size-100" aria-hidden />
                    </a>
                  )}
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close the visual details"
                className="inline-flex size-[40px] shrink-0 items-center justify-center rounded-full bg-card hover:bg-accent max-sm:size-[44px] focus-visible:outline-2 focus-visible:outline-ring"
              >
                <X className="icon-size-200" aria-hidden />
              </button>
            </div>

            <div className="flex flex-col gap-600 p-500">
              <Facts
                items={[
                  [
                    'Popularity score',
                    formatScore(entry?.popularity ?? standing?.popularity),
                  ],
                  ['Ratings', formatInt(entry?.ratings ?? standing?.ratings)],
                  [
                    'Average rating',
                    formatRating(entry?.averageRating ?? standing?.averageRating),
                  ],
                  ['Version', entry?.version || standing?.version || '-'],
                  [
                    'Released',
                    formatDate(entry?.releaseDate ?? standing?.releaseDate),
                  ],
                  ['Free plan', entry ? (entry.freePlans ? 'Yes' : 'No') : '-'],
                ]}
              />

              <section>
                <h3 className="mb-200 text-300 font-bold">Popularity over time</h3>
                <History
                  guid={guid}
                  name={name}
                  thumbnail={thumbnail ?? ''}
                  early={Boolean(standing?.removed && standing.firstSeen == null)}
                />
                <p className="mt-100 text-200 text-muted-foreground">
                  Snapshots where Microsoft Marketplace briefly reported a score of zero are
                  left out, because they were crawl glitches rather than real drops.
                </p>
              </section>

              <section>
                <h3 className="mb-200 flex items-center gap-100 text-300 font-bold">
                  <Star className="icon-size-200 text-brand-foreground" aria-hidden />
                  How people rated it
                </h3>
                <StarBars counts={starsFor(stars, id)} />
              </section>

              <section>
                <h3 className="mb-200 text-300 font-bold">About this visual</h3>
                <Profile id={id} name={name} />
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
