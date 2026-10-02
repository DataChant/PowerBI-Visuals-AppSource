import type { DataTable, InteractionEvent } from '@microsoft/fabric-visuals-core';
import {
  useCssTheme,
  VegaVisual,
  type VisualizationSpec,
} from '@microsoft/fabric-visuals';

import { cn } from '@/lib/utils';

import { EmptyState } from './states';

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
    <div
      role="img"
      aria-label={label}
      className={cn('flex min-h-0 flex-1 flex-col', className)}
    >
      <VegaVisual
        spec={spec}
        data={table}
        theme={theme}
        onInteraction={onInteraction}
        className="min-h-0 flex-1"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
