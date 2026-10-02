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
import { Card, CertifiedBadge, Kpi, Segmented, Thumb } from '@/components/ui';
import type { VisualRef } from '@/components/visual-drawer';
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

const PODIUM = [
  { place: 2, medal: 'bg-silver', height: 'sm:h-[150px]', label: 'Second place' },
  { place: 1, medal: 'bg-gold', height: 'sm:h-[190px]', label: 'First place' },
  { place: 3, medal: 'bg-bronze', height: 'sm:h-[120px]', label: 'Third place' },
] as const;

function Podium({
  top,
  onOpen,
}: {
  top: Standing[];
  onOpen: (v: VisualRef) => void;
}) {
  return (
    <ol className="grid grid-cols-1 items-end gap-300 sm:grid-cols-3">
      {PODIUM.map(({ place, medal, height, label }, i) => {
        const s = top[place - 1];
        if (!s) return <li key={place} aria-hidden />;
        return (
          <motion.li
            key={s.guid}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, type: 'spring', stiffness: 260, damping: 24 }}
            className={
              place === 1 ? 'order-1 sm:order-2' : place === 2 ? 'order-2 sm:order-1' : 'order-3'
            }
          >
            <button
              type="button"
              onClick={() => onOpen(refOf(s))}
              aria-label={`${label}: ${s.name} by ${s.publisher}, popularity score ${formatScore(s.popularity)}`}
              className="group flex w-full flex-col items-center gap-200 text-center focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="relative">
                <Thumb
                  src={s.thumbnail}
                  name={s.name}
                  size={place === 1 ? 72 : 60}
                  className="bg-card shadow-md transition-transform group-hover:-translate-y-100"
                />
                {place === 1 && (
                  <Crown
                    aria-hidden
                    className="absolute -top-500 left-1/2 icon-size-500 -translate-x-1/2 text-gold drop-shadow"
                  />
                )}
              </span>
              <span className="min-w-0 max-w-full px-200">
                <span className="block truncate text-400 font-bold">{s.name}</span>
                <span className="block truncate text-200 text-muted-foreground">
                  {s.publisher}
                </span>
              </span>
              <span
                className={cn(
                  'flex w-full flex-col items-center justify-start gap-100 rounded-t-3xl pt-300 pb-400 text-pbi-foreground',
                  medal,
                  height
                )}
              >
                <span className="font-heading text-hero-900 font-extrabold leading-hero-900">
                  {place}
                </span>
                <span className="tabular text-300 font-semibold">
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
  onOpen,
}: {
  rank: number;
  standing: Standing;
  value: string;
  valueClass?: string;
  detail?: string;
  onOpen: (v: VisualRef) => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(refOf(standing))}
        className="flex min-h-[48px] w-full items-center gap-300 rounded-xl px-200 py-100 text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
      >
        <span className="tabular w-[24px] shrink-0 text-right font-heading text-300 font-bold text-muted-foreground">
          {rank}
        </span>
        <Thumb src={standing.thumbnail} name={standing.name} size={32} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-200">
            <span className="truncate text-300 font-semibold">{standing.name}</span>
          </span>
          <span className="block truncate text-200 text-muted-foreground">
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

function Board({
  title,
  subtitle,
  icon,
  children,
  empty,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode[];
  empty: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const extra = children.length - BOARD_ROWS;
  return (
    <Card title={title} subtitle={subtitle} icon={icon} bodyClassName="pt-200">
      {children.length > 0 ? (
        <>
          <ol className="flex flex-col">
            {expanded ? children : children.slice(0, BOARD_ROWS)}
          </ol>
          {extra > 0 && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((e) => !e)}
              className="mt-200 min-h-[44px] self-start rounded-xl px-300 text-300 font-semibold text-brand-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
            >
              {expanded
                ? `Show the top ${BOARD_ROWS} only`
                : `Show all ${formatInt(children.length)} visuals`}
            </button>
          )}
        </>
      ) : (
        empty
      )}
    </Card>
  );
}

/** Rows a board shows before its Show all button. */
const BOARD_ROWS = 10;

const WINDOW_LABEL: Record<Window, string> = {
  7: 'the last 7 days',
  30: 'the last 30 days',
  90: 'the last 90 days',
};

export function LeaderboardPage({
  standings,
  onOpen,
}: {
  standings: Standing[];
  onOpen: (v: VisualRef) => void;
}) {
  const [win, setWin] = useState<Window>(30);
  const boards = useMemo(() => buildBoards(standings, win), [standings, win]);
  const span = WINDOW_LABEL[win];

  if (standings.length === 0)
    return (
      <EmptyState title="The leaderboard is empty">
        The leaderboard source returned no visuals. Once the next crawl lands,
        the standings appear here.
      </EmptyState>
    );

  return (
    <div className="flex flex-col gap-600">
      <section className="hero-glow overflow-hidden rounded-4xl border border-border p-600 sm:p-800">
        <div className="flex flex-col gap-600 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[60ch]">
            <p className="mb-200 inline-flex items-center gap-100 rounded-full bg-pbi px-300 py-100 text-200 font-bold text-pbi-foreground">
              <Trophy className="icon-size-100" aria-hidden />
              Power BI custom visuals
            </p>
            <h1 className="text-hero-800 font-extrabold leading-hero-800 sm:text-hero-900 sm:leading-hero-900">
              The visuals that make Power BI reports sing.
            </h1>
            <p className="mt-300 text-400 leading-400 text-muted-foreground">
              Every custom visual on Microsoft Marketplace, ranked by how widely it is used.
              Report authors vote with their canvases, and these are the
              standings as of {formatDate(boards.asOf)}.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-300 sm:grid-cols-3 lg:w-[460px]">
            <Kpi label="Listed visuals" value={formatInt(boards.live)} />
            <Kpi
              label="Certified"
              value={formatPercent(boards.live ? boards.certified / boards.live : null)}
              hint={`${formatInt(boards.certified)} visuals`}
            />
            <Kpi
              label="Tracked since"
              value={formatDate(boards.trackingStarted).replace(/, \d{4}$/, '')}
              hint={boards.trackingStarted ? String(boards.trackingStarted.getUTCFullYear()) : undefined}
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </div>
      </section>

      <Card
        title="Hall of Fame"
        subtitle="The ten most popular visuals right now. The popularity score is Microsoft Marketplace's usage percentile, out of 100."
        icon={<Crown className="icon-size-300 text-brand-foreground" aria-hidden />}
        bodyClassName="gap-600 pt-800"
      >
        <Podium top={boards.hallOfFame.slice(0, 3)} onOpen={onOpen} />
        <ol start={4} className="grid grid-cols-1 gap-x-600 md:grid-cols-2">
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

      <div className="flex flex-wrap items-center justify-between gap-300">
        <div>
          <h2 className="text-600 font-extrabold leading-600">On the move</h2>
          <p className="text-300 text-muted-foreground">
            Who gained and lost ground over {span}.
          </p>
        </div>
        <Segmented
          label="Time window"
          value={win}
          onChange={setWin}
          options={WINDOWS.map((w) => ({ value: w, label: `${w} days` }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-400 lg:grid-cols-2">
        <Board
          title="Climbers"
          subtitle={`The biggest popularity gains over ${span}, in score points.`}
          icon={<TrendingUp className="icon-size-300 text-up" aria-hidden />}
          empty={
            <EmptyState title="No climbers in this window">
              No established visual gained popularity over {span}.
            </EmptyState>
          }
        >
          {boards.climbers.map((s, i) => (
            <BoardRow
              key={s.guid}
              rank={i + 1}
              standing={s}
              value={formatScoreChange(s.popularityChange[win])}
              valueClass="text-up"
              detail={`${s.publisher} · now ${formatScore(s.popularity)}`}
              onOpen={onOpen}
            />
          ))}
        </Board>

        <Board
          title="Sliding"
          subtitle={`The biggest popularity losses over ${span}, in score points.`}
          icon={<TrendingDown className="icon-size-300 text-down" aria-hidden />}
          empty={
            <EmptyState title="Nobody slid in this window">
              No listed visual lost popularity over {span}.
            </EmptyState>
          }
        >
          {boards.sliding.map((s, i) => (
            <BoardRow
              key={s.guid}
              rank={i + 1}
              standing={s}
              value={formatScoreChange(s.popularityChange[win])}
              valueClass="text-down"
              detail={`${s.publisher} · now ${formatScore(s.popularity)}`}
              onOpen={onOpen}
            />
          ))}
        </Board>

        <Board
          title="New arrivals"
          subtitle={`Visuals that joined Microsoft Marketplace in ${span}.`}
          icon={<Sparkles className="icon-size-300 text-brand-foreground" aria-hidden />}
          empty={
            boards.trackingStarted &&
            boards.asOf &&
            boards.asOf.getTime() - win * 86_400_000 <= boards.trackingStarted.getTime() ? (
              <EmptyState title="Too early to tell">
                The leaderboard started tracking on {formatDate(boards.trackingStarted)},
                so a visual that arrived in {span} cannot be told apart from one
                that was already listed. Try a shorter window.
              </EmptyState>
            ) : (
              <EmptyState title="No new arrivals">
                No visual joined Microsoft Marketplace in {span}.
              </EmptyState>
            )
          }
        >
          {boards.arrivals.map((s, i) => (
            <BoardRow
              key={s.guid}
              rank={i + 1}
              standing={s}
              value={formatScore(s.popularity)}
              detail={`${s.publisher} · first seen ${formatDate(s.firstSeen)}`}
              onOpen={onOpen}
            />
          ))}
        </Board>

        <Board
          title="Farewells"
          subtitle={`Visuals that left Microsoft Marketplace in ${span}. Thank you for your service.`}
          icon={<Ghost className="icon-size-300 text-muted-foreground" aria-hidden />}
          empty={
            <EmptyState title="Nobody left">
              Every visual listed at the start of {span} is still listed.
            </EmptyState>
          }
        >
          {boards.farewells.map((s, i) => (
            <BoardRow
              key={s.guid}
              rank={i + 1}
              standing={s}
              value={formatDate(s.lastChange).replace(/, \d{4}$/, '')}
              valueClass="text-300 text-muted-foreground"
              onOpen={onOpen}
            />
          ))}
        </Board>
      </div>

      {boards.certified > 0 && (
        <p className="flex flex-wrap items-center gap-200 text-200 text-muted-foreground">
          <CertifiedBadge /> Certified visuals passed Microsoft's code review and
          can export to PowerPoint and PDF.
        </p>
      )}
    </div>
  );
}
