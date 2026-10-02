//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { describe, it, expect } from 'vitest';

import { toDataTable } from '@/lib/to-data-table';
import type { ColumnMetadataMap } from '@/lib/to-data-table';

/**
 * The SDK's `QueryTable`, restated rather than imported so this test does not
 * pull the semantic-model client into the visuals pack.
 *
 * Declaring the fixture as this and passing it is the point: it is what a real
 * query result does, and it exercises the assignability `QueryTableLike` exists
 * for. Annotating the literal as `QueryTableLike` instead would not compile —
 * excess-property checking rejects `dataType` on a fresh literal, even though
 * the same value assigns fine through a variable.
 */
interface SdkQueryTable {
  columns: { name: string; dataType: string }[];
  rows: unknown[][];
}

describe('toDataTable', () => {
  const queryTable: SdkQueryTable = {
    columns: [
      { name: 'Products[Region]', dataType: 'string' },
      { name: '[Total Revenue]', dataType: 'number' },
    ],
    rows: [
      ['East', 100],
      ['West', 200],
    ],
  };

  it('merges column metadata with the query table columns', () => {
    const columnMetadata: ColumnMetadataMap = {
      'Products[Region]': { name: 'ProductsRegion', displayName: 'Region' },
      '[Total Revenue]': {
        name: 'TotalRevenue',
        displayName: 'Total Revenue',
        format: '$#,0.00',
      },
    };

    const result = toDataTable(queryTable, columnMetadata);

    expect(result.columns).toEqual([
      { name: 'ProductsRegion', displayName: 'Region' },
      { name: 'TotalRevenue', displayName: 'Total Revenue', format: '$#,0.00' },
    ]);
  });

  it('falls back to { name: col.name } for columns with no metadata entry', () => {
    const result = toDataTable(queryTable, {});

    expect(result.columns).toEqual([
      { name: 'Products[Region]' },
      { name: '[Total Revenue]' },
    ]);
  });

  it('passes rows through unchanged', () => {
    const result = toDataTable(queryTable, {});

    expect(result.rows).toBe(queryTable.rows);
  });

  it('applies metadata to known columns and falls back for unknown ones', () => {
    const columnMetadata: ColumnMetadataMap = {
      'Products[Region]': { name: 'ProductsRegion', displayName: 'Region' },
    };

    const result = toDataTable(queryTable, columnMetadata);

    expect(result.columns[0]).toEqual({
      name: 'ProductsRegion',
      displayName: 'Region',
    });
    expect(result.columns[1]).toEqual({ name: '[Total Revenue]' });
  });
});
