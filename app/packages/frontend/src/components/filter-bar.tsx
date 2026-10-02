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

const SELECT =
  'min-h-[36px] max-w-full rounded-xl border border-input bg-card px-300 text-300 focus-visible:outline-2 focus-visible:outline-ring';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-100">
      <span className="text-200 font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function FilterBar({
  visuals,
  shown,
  filters,
  onChange,
}: {
  visuals: CatalogVisual[];
  shown: number;
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
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
      className="flex flex-col gap-300 rounded-3xl border border-border bg-card p-400"
    >
      <div className="grid grid-cols-1 gap-300 sm:grid-cols-2 lg:grid-cols-[2fr_1.4fr_1.4fr_1fr_1fr_1fr]">
        <Field label="Search">
          <span className="relative flex">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-300 icon-size-200 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={filters.search}
              onChange={(e) => set({ search: e.target.value })}
              placeholder="A visual or a publisher"
              className={`${SELECT} w-full pl-[36px]`}
            />
          </span>
        </Field>
        <Field label="Publisher">
          <select
            value={filters.publisher}
            onChange={(e) => set({ publisher: e.target.value })}
            className={SELECT}
          >
            <option value="">All publishers</option>
            {publishers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select
            value={filters.category}
            onChange={(e) => set({ category: e.target.value })}
            className={SELECT}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Minimum rating">
          <select
            value={filters.minRating}
            onChange={(e) => set({ minRating: Number(e.target.value) })}
            className={SELECT}
          >
            <option value={0}>Any rating</option>
            {[3, 3.5, 4, 4.5].map((r) => (
              <option key={r} value={r}>
                {r} stars or more
              </option>
            ))}
          </select>
        </Field>
        <Field label="Released from">
          <select
            value={yearValue(filters.yearFrom)}
            onChange={(e) => set({ yearFrom: parseYear(e.target.value) })}
            className={SELECT}
          >
            <option value="">The first year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Released to">
          <select
            value={yearValue(filters.yearTo)}
            onChange={(e) => set({ yearTo: parseYear(e.target.value) })}
            className={SELECT}
          >
            <option value="">This year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-300">
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
        <div className="flex items-center gap-300">
          <p className="text-200 text-muted-foreground" aria-live="polite">
            Showing {formatInt(shown)} of {formatInt(visuals.length)} visuals.
          </p>
          {isFiltered(filters) && (
            <button
              type="button"
              onClick={() => onChange(NO_FILTERS)}
              className="inline-flex min-h-[32px] items-center gap-100 rounded-full border border-border px-300 text-200 font-semibold hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
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
