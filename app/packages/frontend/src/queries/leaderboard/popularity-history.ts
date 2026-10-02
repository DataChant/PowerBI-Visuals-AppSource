import type { VisualizationSpec } from '@microsoft/fabric-visuals';

import type { ColumnMetadataMap } from '@/lib/to-data-table';

import { assertSafeKey, connection } from '../connection';
import baseQuery from './popularity-history.dax?raw';
import spec from './popularity-history.json';

const columnMetadata: ColumnMetadataMap = {
  '[Snapshot Date]': { name: 'Snapshot Date', displayName: 'Date' },
  '[Popularity]': {
    name: 'Popularity',
    displayName: 'Popularity',
    format: '0.0%',
  },
  '[Ratings]': { name: 'Ratings', displayName: 'Ratings', format: '#,0' },
};

/** The step-by-step popularity history of one visual, by its visual GUID. */
export function popularityHistory(guid: string) {
  const query = baseQuery.replaceAll(
    '__GUID__',
    assertSafeKey(guid, 'visual GUID')
  );
  return {
    connection,
    query,
    columnMetadata,
    vegaLiteSpec: spec as VisualizationSpec,
  };
}
