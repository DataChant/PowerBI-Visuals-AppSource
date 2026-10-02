import type { QueryTableLike } from '@/lib/to-data-table';

/** Reads query rows by column name, so a column reorder in the DAX cannot shift values. */
export function readRows<T>(
  table: QueryTableLike,
  read: (get: (column: string) => unknown) => T
): T[] {
  const index = new Map(table.columns.map((c, i) => [c.name, i]));
  return table.rows.map((row) =>
    read((column) => {
      const i = index.get(column);
      return i === undefined ? undefined : row[i];
    })
  );
}

export function asString(value: unknown): string {
  return typeof value === 'string' ? value : value == null ? '' : String(value);
}

export function asNumber(value: unknown): number | null {
  if (value == null || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Power BI returns datetimes without a zone ("2026-09-30T23:20:15.000"). The
 * model stores them as UTC, so read them as UTC rather than local time, which
 * would move a midnight release date to the previous day west of Greenwich.
 */
export function asDate(value: unknown): Date | null {
  if (value == null || value === '') return null;
  const text = String(value);
  const hasZone = /([zZ]|[+-]\d\d:?\d\d)$/.test(text);
  const date = new Date(hasZone ? text : `${text}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

const DAY_MS = 86_400_000;

export function daysBefore(date: Date, days: number): Date {
  return new Date(date.getTime() - days * DAY_MS);
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}
