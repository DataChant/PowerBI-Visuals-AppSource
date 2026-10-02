import { DataGrid, type GridColumnDef, type Row } from '@microsoft/fabric-datagrid';
import { useCssTheme } from '@microsoft/fabric-visuals';
import { useMemo } from 'react';

import type { CatalogVisual, StarCount } from '@/lib/catalog';
import { formatInt, formatPercent, formatRating, formatScore } from '@/lib/format';

import { EmptyState } from './states';
import { CertifiedBadge, Thumb } from './ui';
import type { VisualRef } from './visual-drawer';

const num = (value: unknown) => (typeof value === 'number' ? value : null);

/**
 * The searchable list of visuals. Rows carry raw numbers so the grid sorts by
 * value, and the cell renderers format them for reading.
 */
export function VisualsGrid({
  visuals,
  stars,
  onOpen,
  mode = 'catalog',
}: {
  visuals: CatalogVisual[];
  stars?: StarCount[];
  onOpen: (v: VisualRef) => void;
  /** "ratings" swaps the release columns for the share of five and one star ratings. */
  mode?: 'catalog' | 'ratings';
}) {
  const theme = useCssTheme();

  const rows = useMemo<Row[]>(() => {
    const totals = new Map<string, number[]>();
    for (const s of stars ?? []) {
      const counts = totals.get(s.id) ?? [0, 0, 0, 0, 0];
      counts[s.stars - 1] += s.raters;
      totals.set(s.id, counts);
    }
    return visuals.map((v) => {
      const counts = totals.get(v.id) ?? [0, 0, 0, 0, 0];
      const raters = counts.reduce((a, b) => a + b, 0);
      return {
        _id: v.id,
        title: v.title,
        publisher: v.publisher,
        score: Math.round(v.popularity * 1000) / 10,
        ratings: v.ratings,
        average: v.averageRating,
        released: v.releaseDate ? v.releaseDate.toISOString().slice(0, 10) : '',
        certified: v.certified ? 'Yes' : 'No',
        five: raters ? counts[4] / raters : null,
        one: raters ? counts[0] / raters : null,
        thumbnail: v.thumbnail,
        guid: v.guid,
      } as Row;
    });
  }, [visuals, stars]);

  const columns = useMemo<GridColumnDef[]>(() => {
    const title: GridColumnDef = {
      id: 'title',
      header: 'Visual',
      width: 280,
      cellRenderer: (value, row) => (
        <button
          type="button"
          onClick={() =>
            onOpen({ id: String(row._id), guid: String(row.guid ?? ''), name: String(value) })
          }
          className="flex min-w-0 items-center gap-200 text-left font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Thumb src={String(row.thumbnail ?? '')} name={String(value)} size={24} className="rounded-md" />
          <span className="truncate">{value}</span>
        </button>
      ),
    };
    const shared: GridColumnDef[] = [
      title,
      { id: 'publisher', header: 'Publisher', width: 180 },
      {
        id: 'score',
        header: 'Popularity',
        width: 110,
        numericStyling: true,
        cellRenderer: (v) => {
          const score = num(v);
          return formatScore(score == null ? null : score / 100);
        },
      },
      {
        id: 'ratings',
        header: 'Ratings',
        width: 100,
        numericStyling: true,
        cellRenderer: (v) => formatInt(num(v)),
      },
      {
        id: 'average',
        header: 'Average rating',
        width: 130,
        numericStyling: true,
        cellRenderer: (v) => formatRating(num(v)),
      },
    ];
    const certified: GridColumnDef = {
      id: 'certified',
      header: 'Certified',
      width: 120,
      cellRenderer: (v) =>
        v === 'Yes' ? <CertifiedBadge /> : <span className="text-muted-foreground">No</span>,
    };
    if (mode === 'ratings')
      return [
        ...shared,
        certified,
        {
          id: 'five',
          header: 'Five stars',
          width: 110,
          numericStyling: true,
          cellRenderer: (v) => formatPercent(num(v)),
        },
        {
          id: 'one',
          header: 'One star',
          width: 110,
          numericStyling: true,
          cellRenderer: (v) => formatPercent(num(v)),
        },
      ];
    return [
      ...shared,
      { id: 'released', header: 'Released', width: 120 },
      certified,
    ];
  }, [mode, onOpen]);

  if (visuals.length === 0)
    return (
      <EmptyState title="No visuals match">
        Loosen a filter or clear them all to see the full catalog again.
      </EmptyState>
    );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <DataGrid
        columns={columns}
        data={rows}
        theme={theme}
        rowHeight={44}
        pageSize={25}
        defaultSort={[
          { columnId: mode === 'ratings' ? 'ratings' : 'score', direction: 'desc' },
        ]}
      />
    </div>
  );
}
