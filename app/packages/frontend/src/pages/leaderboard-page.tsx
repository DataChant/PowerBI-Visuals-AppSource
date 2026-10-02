import { motion } from 'framer-motion';
import {
  Crown,
  Ghost,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { EmptyState } from '@/components/states';
import {
  Card,
  CertifiedBadge,
  CertifiedToggle,
  Kpi,
  ScrollList,
  Segmented,
  Thumb,
} from '@/components/ui';
import type { VisualRef } from '@/components/visual-drawer';
import { useFit } from '@/hooks/use-fit';
import {
  formatDate,
  formatInt,
  formatPercent,
  formatScore,
  formatScoreChange,
} from '@/lib/format';
import {
  buildBoards,
  WINDOWS,
  type Standing,
  type Window,
} from '@/lib/leaderboard';
import { cn } from '@/lib/utils';

function refOf(s: Standing): VisualRef {
  return { id: s.catalogId, guid: s.guid, name: s.name };
}

/**
 * The three steps of the podium. `height` is a step's height where the page
 * scrolls. Where the page fits the window, the steps share whatever height the
 * card has left, and `grow` is each step's share of it.
 */
const PODIUM = [
  { place: 2, medal: 'bg-silver', height: 'sm:h-[128px]', grow: 0.72, label: 'Second place' },
  { place: 1, medal: 'bg-gold', height: 'sm:h-[160px]', grow: 1, label: 'First place' },
  { place: 3, medal: 'bg-bronze', height: 'sm:h-[104px]', grow: 0.5, label: 'Third place' },
] as const;

/** The tallest the first step grows to, however tall the window is. */
const STEP_LIMIT = 280;

function Podium({
  top,
  onOpen,
}: {
  top: Standing[];
  onOpen: (v: VisualRef) => void;
}) {
  return (
    <ol className="grid grid-cols-1 items-end gap-300 sm:grid-cols-3 fit:min-h-0 fit:flex-1 fit:grid-rows-[minmax(0,1fr)] fit:items-stretch fit:pt-300">
      {PODIUM.map(({ place, medal, height, grow, label }, i) => {
        const s = top[place - 1];
        if (!s) return <li key={place} aria-hidden />;
        return (
          <motion.li
            key={s.guid}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, type: 'spring', stiffness: 260, damping: 24 }}
            className={cn(
              'fit:flex fit:min-h-0',
              place === 1 ? 'order-1 sm:order-2' : place === 2 ? 'order-2 sm:order-1' : 'order-3'
            )}
          >
            <button
              type="button"
              onClick={() => onOpen(refOf(s))}
              aria-label={`${label}: ${s.name} by ${s.publisher}, popularity score ${formatScore(s.popularity)}`}
              className="group flex w-full flex-col items-center justify-end gap-200 text-center fit:gap-100 focus-visible:outline-2 focus-visible:outline-ring"
            >
              {/* The room above a lower step, so the three steps stand on one line. */}
              <span aria-hidden className="hidden fit:block" style={{ flexGrow: 1 - grow }} />
              <span className="relative">
                <Thumb
                  src={s.thumbnail}
                  name={s.name}
                  size={place === 1 ? 64 : 52}
                  fitSize={place === 1 ? 48 : 40}
                  className="bg-card shadow-md transition-transform group-hover:-translate-y-100"
                />
                {place === 1 && (
                  <Crown
                    aria-hidden
                    className="absolute -top-500 left-1/2 icon-size-500 -translate-x-1/2 text-gold drop-shadow fit:-top-300 fit:icon-size-300"
                  />
                )}
              </span>
              <span className="min-w-0 max-w-full px-200">
                <span className="flex items-center justify-center gap-100">
                  <span className="truncate text-400 font-bold leading-400 fit:text-300 fit:leading-300">
                    {s.name}
                  </span>
                  {s.certified && <CertifiedBadge />}
                </span>
                <span className="block truncate text-200 leading-200 text-muted-foreground">
                  {s.publisher}
                </span>
              </span>
              <span
                className={cn(
                  'flex w-full flex-col items-center justify-start gap-100 rounded-t-3xl pt-300 pb-400 text-pbi-foreground',
                  // Where the page fits the window, a step is as tall as its share
                  // of the room, with its place and score on one line. A taller
                  // window stacks them again.
                  'fit:min-h-[32px] fit:basis-0 fit:flex-row fit:items-baseline fit:justify-center fit:gap-200 fit:rounded-t-2xl fit:pt-100 fit:pb-0',
                  'roomy:min-h-[72px] roomy:flex-col roomy:items-center roomy:justify-start roomy:gap-0 roomy:pt-200',
                  medal,
                  height
                )}
                style={{ flexGrow: grow, maxHeight: Math.round(STEP_LIMIT * grow) }}
              >
                <span className="font-heading text-hero-900 font-extrabold leading-hero-900 fit:text-500 fit:leading-500 roomy:text-hero-800 roomy:leading-hero-800">
                  {place}
                </span>
                <span className="tabular text-300 font-semibold leading-300 fit:text-200 roomy:text-300">
                  Score {formatScore(s.popularity)}
                </span>
              </span>
            </button>
          </motion.li>
        );
      })}
    </ol>
  );
}

function BoardRow({
  rank,
  standing,
  value,
  valueClass,
  detail,
  stretch = false,
  onOpen,
}: {
  rank: number;
  standing: Standing;
  value: string;
  valueClass?: string;
  detail?: string;
  /** Where the page fits the window, the rows of a list share its height. */
  stretch?: boolean;
  onOpen: (v: VisualRef) => void;
}) {
  return (
    <li className={cn(stretch && 'fit:flex fit:max-h-[48px] fit:shrink-0 fit:grow fit:basis-[36px]')}>
      <button
        type="button"
        onClick={() => onOpen(refOf(standing))}
        className={cn(
          'flex min-h-[48px] w-full items-center gap-300 rounded-xl px-200 py-100 text-left fit:min-h-[36px] fit:py-0 hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring',
          !stretch && 'roomy:min-h-[44px]'
        )}
      >
        <span className="tabular w-[24px] shrink-0 text-right font-heading text-300 font-bold text-muted-foreground">
          {rank}
        </span>
        <Thumb src={standing.thumbnail} name={standing.name} size={32} fitSize={28} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-200">
            <span className="truncate text-300 font-semibold leading-300">{standing.name}</span>
            {standing.certified && <CertifiedBadge />}
          </span>
          <span className="block truncate text-200 leading-200 text-muted-foreground">
            {detail ?? standing.publisher}
          </span>
        </span>
        <span className={cn('tabular shrink-0 font-heading text-400 font-bold', valueClass)}>
          {value}
        </span>
      </button>
    </li>
  );
}

const WINDOW_LABEL: Record<Window, string> = {
  7: 'the last 7 days',
  30: 'the last 30 days',
  90: 'the last 90 days',
};

/** The four lists of visuals on the move. One is shown at a time. */
type BoardId = 'climbers' | 'sliding' | 'arrivals' | 'farewells';

const BOARDS: { value: BoardId; label: string }[] = [
  { value: 'climbers', label: 'Climbers' },
  { value: 'sliding', label: 'Sliding' },
  { value: 'arrivals', label: 'New arrivals' },
  { value: 'farewells', label: 'Farewells' },
];

interface Move {
  subtitle: string;
  icon: ReactNode;
  rows: ReactNode[];
  empty: ReactNode;
}

export function LeaderboardPage({
  standings,
  certifiedOnly,
  onCertifiedOnly,
  onOpen,
}: {
  standings: Standing[];
  /** Narrows every list on the page to the certified visuals. */
  certifiedOnly: boolean;
  onCertifiedOnly: (certifiedOnly: boolean) => void;
  onOpen: (v: VisualRef) => void;
}) {
  const [win, setWin] = useState<Window>(30);
  const [board, setBoard] = useState<BoardId>('climbers');
  const fit = useFit();
  // The headline numbers always describe the whole marketplace. Only the
  // lists narrow to the certified visuals.
  const totals = useMemo(() => buildBoards(standings, win), [standings, win]);
  const boards = useMemo(
    () =>
      certifiedOnly
        ? buildBoards(
            standings.filter((s) => s.certified),
            win
          )
        : totals,
    [standings, win, certifiedOnly, totals]
  );
  const span = WINDOW_LABEL[win];
  const kind = certifiedOnly ? 'certified visual' : 'visual';

  if (standings.length === 0)
    return (
      <EmptyState title="The leaderboard is empty">
        The leaderboard source returned no visuals. Once the next crawl lands,
        the standings appear here.
      </EmptyState>
    );

  const moves: Record<BoardId, Move> = {
    climbers: {
      subtitle: `The biggest popularity gains over ${span}, in score points.`,
      icon: <TrendingUp className="icon-size-200 shrink-0 text-up" aria-hidden />,
      empty: (
        <EmptyState title="No climbers in this window">
          No established {kind} gained popularity over {span}.
        </EmptyState>
      ),
      rows: boards.climbers.map((s, i) => (
        <BoardRow
          key={s.guid}
          rank={i + 1}
          standing={s}
          value={formatScoreChange(s.popularityChange[win])}
          valueClass="text-up"
          detail={`${s.publisher} · now ${formatScore(s.popularity)}`}
          stretch
          onOpen={onOpen}
        />
      )),
    },
    sliding: {
      subtitle: `The biggest popularity losses over ${span}, in score points.`,
      icon: <TrendingDown className="icon-size-200 shrink-0 text-down" aria-hidden />,
      empty: (
        <EmptyState title="Nobody slid in this window">
          No listed {kind} lost popularity over {span}.
        </EmptyState>
      ),
      rows: boards.sliding.map((s, i) => (
        <BoardRow
          key={s.guid}
          rank={i + 1}
          standing={s}
          value={formatScoreChange(s.popularityChange[win])}
          valueClass="text-down"
          detail={`${s.publisher} · now ${formatScore(s.popularity)}`}
          stretch
          onOpen={onOpen}
        />
      )),
    },
    arrivals: {
      subtitle: `Visuals that joined Microsoft Marketplace in ${span}.`,
      icon: <Sparkles className="icon-size-200 shrink-0 text-brand-foreground" aria-hidden />,
      empty:
        totals.trackingStarted &&
        totals.asOf &&
        totals.asOf.getTime() - win * 86_400_000 <= totals.trackingStarted.getTime() ? (
          <EmptyState title="Too early to tell">
            The leaderboard started tracking on {formatDate(totals.trackingStarted)},
            so a visual that arrived in {span} cannot be told apart from one
            that was already listed. Try a shorter window.
          </EmptyState>
        ) : (
          <EmptyState title="No new arrivals">
            No {kind} joined Microsoft Marketplace in {span}.
          </EmptyState>
        ),
      rows: boards.arrivals.map((s, i) => (
        <BoardRow
          key={s.guid}
          rank={i + 1}
          standing={s}
          value={formatScore(s.popularity)}
          detail={`${s.publisher} · first seen ${formatDate(s.firstSeen)}`}
          stretch
          onOpen={onOpen}
        />
      )),
    },
    farewells: {
      subtitle: `Visuals that left Microsoft Marketplace in ${span}. Thank you for your service.`,
      icon: <Ghost className="icon-size-200 shrink-0 text-muted-foreground" aria-hidden />,
      empty: (
        <EmptyState title="Nobody left">
          Every {kind} listed at the start of {span} is still listed.
        </EmptyState>
      ),
      rows: boards.farewells.map((s, i) => (
        <BoardRow
          key={s.guid}
          rank={i + 1}
          standing={s}
          value={formatDate(s.lastChange).replace(/, \d{4}$/, '')}
          valueClass="text-300 text-muted-foreground"
          stretch
          onOpen={onOpen}
        />
      )),
    },
  };
  const move = moves[board];
  const boardLabel = BOARDS.find((b) => b.value === board)?.label;

  const pill = (
    <p className="mb-200 inline-flex shrink-0 items-center gap-100 rounded-full bg-pbi px-300 py-100 text-200 font-bold text-pbi-foreground fit:mb-0 fit:py-0">
      <Trophy className="icon-size-100" aria-hidden />
      Power BI custom visuals
    </p>
  );
  const headline = (
    <h1 className="text-hero-800 font-extrabold leading-hero-800 sm:text-hero-900 sm:leading-hero-900 fit:min-w-0 fit:text-600 fit:leading-600">
      The visuals that make Power BI reports sing.
    </h1>
  );
  const standfirst = (
    <p className="mt-300 text-400 leading-400 text-muted-foreground fit:mt-0 fit:min-w-0 fit:text-200 fit:leading-200">
      Every custom visual on Microsoft Marketplace, ranked by how widely it is used.
      Report authors vote with their canvases, and these are the
      standings as of {formatDate(totals.asOf)}.
    </p>
  );
  const figures = (
    <div
      className={
        fit
          ? 'flex shrink-0 gap-200'
          : 'grid grid-cols-2 gap-300 sm:grid-cols-3 lg:w-[460px]'
      }
    >
      <Kpi label="Listed visuals" value={formatInt(totals.live)} />
      <Kpi
        label="Certified"
        value={formatPercent(totals.live ? totals.certified / totals.live : null)}
        hint={`${formatInt(totals.certified)} visuals`}
      />
      <Kpi
        label="Tracked since"
        value={formatDate(totals.trackingStarted).replace(/, \d{4}$/, '')}
        hint={totals.trackingStarted ? String(totals.trackingStarted.getUTCFullYear()) : undefined}
        className="col-span-2 sm:col-span-1"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-400 fit:min-h-0 fit:flex-1 fit:gap-200">
      <section className="hero-glow overflow-hidden rounded-4xl border border-border p-400 sm:p-600 fit:shrink-0 fit:rounded-3xl fit:px-400 fit:py-200">
        {fit ? (
          // Where the page fits the window, the hero is two lines: the
          // headline beside the figures, then the sentence under them.
          <div className="flex flex-col gap-100">
            <div className="flex flex-wrap items-center justify-between gap-x-400 gap-y-100">
              {headline}
              {figures}
            </div>
            <div className="flex items-center gap-300">
              {pill}
              {standfirst}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-400 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[60ch]">
              {pill}
              {headline}
              {standfirst}
            </div>
            {figures}
          </div>
        )}
      </section>

      <div className="flex flex-col gap-400 fit:grid fit:min-h-[376px] fit:flex-1 fit:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] fit:grid-rows-[minmax(0,1fr)] fit:gap-300">
        <Card
          title="Hall of Fame"
          subtitle={`The ten most popular ${kind}s right now. The popularity score is Microsoft Marketplace's usage percentile, out of 100.`}
          icon={<Crown className="icon-size-300 text-brand-foreground" aria-hidden />}
          actions={
            <CertifiedToggle certifiedOnly={certifiedOnly} onChange={onCertifiedOnly} />
          }
          className="fit:min-h-0"
          bodyClassName="gap-400 pt-600 fit:gap-200 fit:pt-100"
        >
          <Podium top={boards.hallOfFame.slice(0, 3)} onOpen={onOpen} />
          {/* Fourth to seventh read down the first column and eighth to tenth
              down the second. The order in the page stays fourth to tenth. */}
          <ol
            start={4}
            className="grid grid-cols-1 gap-x-600 md:grid-flow-col md:grid-cols-2 md:grid-rows-[repeat(4,auto)] fit:shrink-0"
          >
            {boards.hallOfFame.slice(3).map((s, i) => (
              <BoardRow
                key={s.guid}
                rank={i + 4}
                standing={s}
                value={formatScore(s.popularity)}
                onOpen={onOpen}
              />
            ))}
          </ol>
        </Card>

        <Card
          title="On the move"
          subtitle={
            certifiedOnly
              ? `The certified visuals that gained and lost ground over ${span}.`
              : `Who gained and lost ground over ${span}.`
          }
          actions={
            <Segmented
              label="Time window"
              value={win}
              onChange={setWin}
              options={WINDOWS.map((w) => ({ value: w, label: `${w} days` }))}
            />
          }
          className="fit:min-h-0"
          bodyClassName="gap-200 pt-200"
        >
          <div className="flex flex-wrap items-center gap-200">
            <div data-scroll-x className="flex max-w-full overflow-x-auto">
              <Segmented<BoardId>
                label="Board"
                value={board}
                onChange={setBoard}
                options={BOARDS}
              />
            </div>
            {/* Beside the Hall of Fame, its own certification filter is in reach. */}
            <CertifiedToggle
              certifiedOnly={certifiedOnly}
              onChange={onCertifiedOnly}
              className="fit:hidden"
            />
          </div>
          <p className="flex items-start gap-200 text-200 leading-200 text-muted-foreground">
            {move.icon}
            <span>{move.subtitle}</span>
          </p>
          {move.rows.length > 0 ? (
            <ScrollList
              // A new board or time window starts at its first row.
              key={`${board}-${win}`}
              aria-label={boardLabel}
              className="flex max-h-[504px] flex-col overflow-y-auto fit:max-h-[none] fit:min-h-0 fit:flex-1"
            >
              {move.rows}
            </ScrollList>
          ) : (
            <div className="fit:min-h-0 fit:flex-1 fit:overflow-y-auto">{move.empty}</div>
          )}
        </Card>
      </div>
    </div>
  );
}
