import { connection } from '../connection';
import query from './popularity-replay.dax?raw';

/**
 * Every visual's popularity at the end of each week it changed, counted back
 * from the latest snapshot. Feeds the Replay tab, which carries values forward
 * between changes. About 19,000 rows, so it is only requested once the tab opens.
 */
export function popularityReplay() {
  return { connection, query };
}
