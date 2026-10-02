import { connection } from '../connection';
import query from './catalog-visuals.dax?raw';

/**
 * Every visual in the AppSource catalog. The catalog pages filter and aggregate
 * these rows in the browser, so they carry no chart spec of their own; the
 * charts they feed live in queries/charts.
 */
export function catalogVisuals() {
  return { connection, query };
}
