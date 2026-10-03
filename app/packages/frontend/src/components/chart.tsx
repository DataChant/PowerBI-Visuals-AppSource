import type { DataTable, InteractionEvent } from '@microsoft/fabric-visuals-core';
import {
  useCssTheme,
  VegaVisual,
  type VisualizationSpec,
} from '@microsoft/fabric-visuals';
import { useEffect, useRef, type ReactNode } from 'react';

import { formatDate, formatInt, formatPercent } from '@/lib/format';
import { asDate } from '@/lib/table';
import { cn } from '@/lib/utils';

import { EmptyState } from './states';

/** Columns a listener gains nothing from: an image address, an ID and a sort key. */
const UNREAD = new Set(['Thumbnail', 'ID', 'Star Order']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T|$)/;
const oneDecimal = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const percentOneDecimal = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** A cell as the chart's own labels and tooltips show it. */
function cellText(value: unknown, format: string | undefined): string {
  if (value == null || value === '') return '-';
  if (typeof value === 'string' && ISO_DATE.test(value)) return formatDate(asDate(value));
  if (typeof value !== 'number') return String(value);
  switch (format) {
    case '0%':
      return formatPercent(value);
    case '0.0%':
      return percentOneDecimal.format(value);
    case '0.0':
      return oneDecimal.format(value);
    case '#,0':
      return formatInt(value);
    default:
      return String(value);
  }
}

/**
 * A chart as one named picture to a screen reader. The marks drawn inside it
 * carry roles of their own, so they are hidden rather than read as unnamed images.
 */
export function ChartImage({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const hide = () =>
      el.querySelectorAll('svg:not([aria-hidden])').forEach((svg) => svg.setAttribute('aria-hidden', 'true'));
    hide();
    // The chart draws its picture after the first render, and again as it resizes.
    const watch = new MutationObserver(hide);
    watch.observe(el, { childList: true, subtree: true });
    return () => watch.disconnect();
  }, []);
  return (
    <div ref={ref} role="img" aria-label={label} className={className}>
      {children}
    </div>
  );
}

/**
 * The numbers behind a chart as a table that only screen readers reach, since
 * the chart itself is a picture to them.
 */
export function ChartTable({ table, caption }: { table: DataTable; caption: string }) {
  const read = table.columns.flatMap((column, i) => (UNREAD.has(column.name) ? [] : [{ column, i }]));
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {read.map(({ column }) => (
            <th key={column.name} scope="col">
              {column.displayName ?? column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, r) => (
          <tr key={r}>
            {read.map(({ column, i }) => (
              <td key={column.name}>{cellText(row[i], column.format)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Chart({
  spec,
  table,
  label,
  onInteraction,
  emptyTitle = 'Nothing to chart',
  emptyText = 'No visuals match the current filters.',
  className,
}: {
  spec: VisualizationSpec;
  table: DataTable;
  /** What the chart shows, read out by screen readers. */
  label: string;
  onInteraction?: (events: InteractionEvent[]) => void;
  emptyTitle?: string;
  emptyText?: string;
  className?: string;
}) {
  const theme = useCssTheme();
  if (table.rows.length === 0)
    return (
      <EmptyState title={emptyTitle} className={cn('flex-1', className)}>
        {emptyText}
      </EmptyState>
    );
  return (
    <>
      <ChartImage label={label} className={cn('flex min-h-0 flex-1 flex-col', className)}>
        <VegaVisual
          spec={spec}
          data={table}
          theme={theme}
          onInteraction={onInteraction}
          className="min-h-0 flex-1"
          style={{ width: '100%', height: '100%' }}
        />
      </ChartImage>
      <ChartTable table={table} caption={`${label}, as a table`} />
    </>
  );
}
