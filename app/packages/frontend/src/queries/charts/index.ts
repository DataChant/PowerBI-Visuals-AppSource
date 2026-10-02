import type { DataTable } from '@microsoft/fabric-visuals-core';
import type { VisualizationSpec } from '@microsoft/fabric-visuals';

import { toDataTable, type ColumnMetadataMap } from '@/lib/to-data-table';

import categoriesSpec from './categories.json';
import ratingsVsPopularitySpec from './ratings-vs-popularity.json';
import releasesPerYearSpec from './releases-per-year.json';
import starMixSpec from './star-mix.json';
import topPublishersSpec from './top-publishers.json';

/**
 * Charts over rows the app aggregates in the browser from the catalog queries.
 * The row builders in lib/catalog.ts produce columns in the order each
 * metadata map lists them.
 */
function chart(columnMetadata: ColumnMetadataMap, spec: unknown) {
  const columns = Object.keys(columnMetadata).map((name) => ({ name }));
  return {
    columnMetadata,
    vegaLiteSpec: spec as VisualizationSpec,
    toTable: (rows: unknown[][]): DataTable =>
      toDataTable({ columns, rows }, columnMetadata),
  };
}

export const releasesPerYearChart = chart(
  {
    Year: { name: 'Year', displayName: 'Year', format: '0' },
    Status: { name: 'Status', displayName: 'Status' },
    Visuals: { name: 'Visuals', displayName: 'Visuals', format: '#,0' },
  },
  releasesPerYearSpec
);

export const topPublishersChart = chart(
  {
    Publisher: { name: 'Publisher', displayName: 'Publisher' },
    Value: { name: 'Value', displayName: 'Total', format: '#,0' },
  },
  topPublishersSpec
);

export const categoriesChart = chart(
  {
    Category: { name: 'Category', displayName: 'Category' },
    Visuals: { name: 'Visuals', displayName: 'Visuals', format: '#,0' },
  },
  categoriesSpec
);

export const starMixChart = chart(
  {
    Publisher: { name: 'Publisher', displayName: 'Publisher (raters)' },
    Stars: { name: 'Stars', displayName: 'Stars' },
    'Star Order': { name: 'Star Order', displayName: 'Star order' },
    Share: { name: 'Share', displayName: 'Share of raters', format: '0%' },
    Raters: { name: 'Raters', displayName: 'Raters', format: '#,0' },
  },
  starMixSpec
);

export const ratingsVsPopularityChart = chart(
  {
    Title: { name: 'Title', displayName: 'Visual' },
    Publisher: { name: 'Publisher', displayName: 'Publisher' },
    Ratings: { name: 'Ratings', displayName: 'Ratings', format: '#,0' },
    Score: { name: 'Score', displayName: 'Popularity score', format: '0.0' },
    Status: { name: 'Status', displayName: 'Status' },
    ID: { name: 'ID', displayName: 'Microsoft Marketplace ID' },
    Thumbnail: { name: 'Thumbnail', displayName: 'Logo' },
  },
  ratingsVsPopularitySpec
);
