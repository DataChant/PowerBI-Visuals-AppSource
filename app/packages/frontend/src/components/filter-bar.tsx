import { RotateCcw, Search } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';

import {
  allCategories,
  isFiltered,
  NO_FILTERS,
  yearRange,
  type CatalogFilters,
  type CatalogVisual,
  type CertifiedFilter,
} from '@/lib/catalog';
import { formatInt } from '@/lib/format';

import { Segmented } from './ui';

// A control carries its own name: its first option or its placeholder says
// what it filters, so no row of labels sits above the controls.
const CONTROL =
  'min-h-[36px] w-full min-w-0 rounded-xl border border-input bg-card px-300 text-300 fit:min-h-[32px] max-sm:min-h-[44px] focus-visible:outline-2 focus-visible:outline-ring';

export function FilterBar({
  visuals,
  shown,
  filters,
  onChange,
  actions,
}: {
  visuals: CatalogVisual[];
  shown: number;
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  /** Controls of the page itself, shown beside the certification filter. */
  actions?: ReactNode;
}) {
  const publishers = useMemo(
    () => [...new Set(visuals.map((v) => v.publisher))].sort((a, b) => a.localeCompare(b)),
    [visuals]
  );
  const categories = useMemo(() => allCategories(visuals), [visuals]);
  const years = useMemo(() => {
    const range = yearRange(visuals);
    if (!range) return [];
    const list: number[] = [];
    for (let y = range[0]; y <= range[1]; y++) list.push(y);
    return list;
  }, [visuals]);
  const set = (patch: Partial<CatalogFilters>) => onChange({ ...filters, ...patch });
  const yearValue = (y: number | null) => (y == null ? '' : String(y));
  const parseYear = (v: string) => (v ? Number(v) : null);

  return (
    <section
      aria-label="Filters"
      className="flex flex-col gap-200 rounded-3xl border border-border bg-card p-300 fit:shrink-0 fit:p-200"
    >
      <div className="grid grid-cols-2 gap-200 lg:grid-cols-[2fr_1.4fr_1.4fr_1fr_1fr_1fr]">
        <span className="relative col-span-2 flex lg:col-span-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-300 icon-size-200 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            aria-label="Search"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search a visual or a publisher"
            className={`${CONTROL} pl-[36px]`}
          />
        </span>
        <select
          aria-label="Publisher"
          value={filters.publisher}
          onChange={(e) => set({ publisher: e.target.value })}
          className={CONTROL}
        >
          <option value="">All publishers</option>
          {publishers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          aria-label="Category"
          value={filters.category}
          onChange={(e) => set({ category: e.target.value })}
          className={CONTROL}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          aria-label="Minimum rating"
          value={filters.minRating}
          onChange={(e) => set({ minRating: Number(e.target.value) })}
          className={CONTROL}
        >
          <option value={0}>Any rating</option>
          {[3, 3.5, 4, 4.5].map((r) => (
            <option key={r} value={r}>
              {r} stars or more
            </option>
          ))}
        </select>
        <select
          aria-label="Released from"
          value={yearValue(filters.yearFrom)}
          onChange={(e) => set({ yearFrom: parseYear(e.target.value) })}
          className={CONTROL}
        >
          <option value="">From the first year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              From {y}
            </option>
          ))}
        </select>
        <select
          aria-label="Released to"
          value={yearValue(filters.yearTo)}
          onChange={(e) => set({ yearTo: parseYear(e.target.value) })}
          className={CONTROL}
        >
          <option value="">To this year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              To {y}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-300 gap-y-200">
        <div className="flex flex-wrap items-center gap-200">
          <Segmented<CertifiedFilter>
            label="Certification"
            value={filters.certified}
            onChange={(certified) => set({ certified })}
            options={[
              { value: 'all', label: 'All visuals' },
              { value: 'certified', label: 'Certified' },
              { value: 'not-certified', label: 'Not certified' },
            ]}
          />
          {actions}
        </div>
        <div className="flex items-center gap-300">
          <p className="text-200 text-muted-foreground" aria-live="polite">
            Showing {formatInt(shown)} of {formatInt(visuals.length)} visuals.
          </p>
          {isFiltered(filters) && (
            <button
              type="button"
              onClick={() => onChange(NO_FILTERS)}
              className="inline-flex min-h-[32px] items-center gap-100 rounded-full border border-border px-300 text-200 font-semibold fit:min-h-[28px] max-sm:min-h-[44px] hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
            >
              <RotateCcw className="icon-size-100" aria-hidden />
              Clear filters
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
