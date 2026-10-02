//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import type { ColumnDef, DataTable } from '@microsoft/fabric-visuals-core';

/**
 * The shape `toDataTable` reads from a query result: a raw table, before column
 * metadata is merged in.
 *
 * Composed from the `visuals-core` types rather than re-declaring their fields,
 * and narrowed to `name` because that is the only column property this reads -
 * everything else comes from `columnMetadata`. Declared here rather than
 * imported from `@microsoft/rayfin-connector-fabric-semanticmodel` so charting
 * does not drag the semantic-model connector in; that package's `QueryTable`
 * satisfies this structurally.
 */
export interface QueryTableLike {
  columns: readonly Pick<ColumnDef, 'name'>[];
  rows: DataTable['rows'];
}

/**
 * Dictionary keyed by the original column name from the DAX query result.
 * Each value holds the `ColumnDef` metadata for that column.
 */
export type ColumnMetadataMap = Record<string, ColumnDef>;

/**
 * Merges a raw query table with static column metadata to produce
 * a `DataTable` that `VegaVisual` and `DataGrid` accept directly.
 *
 * @param queryTable - The `table` value from `CachedQueryResult` (SDK output).
 * @param columnMetadata - Metadata dictionary exported from the query barrel file,
 *                         keyed by the original column name.
 * @returns A `DataTable` with enriched `ColumnDef` entries and the original rows.
 *
 * @example
 * ```tsx
 * import { columnMetadata, query } from "@/queries/sales/revenue-by-region";
 * import { toDataTable } from "@/lib/to-data-table";
 *
 * const { data } = useSemanticModelQuery({ connection: "myModel", query });
 *
 * if (data?.status === "success") {
 *   const dataTable = toDataTable(data.table, columnMetadata);
 *   return <VegaVisual spec={vegaLiteSpec} data={dataTable} theme={theme} />;
 * }
 * ```
 */
export function toDataTable(
  queryTable: QueryTableLike,
  columnMetadata: ColumnMetadataMap
): DataTable {
  const columns: ColumnDef[] = queryTable.columns.map((col) => {
    return columnMetadata[col.name] ?? { name: col.name };
  });

  return { columns, rows: queryTable.rows };
}
