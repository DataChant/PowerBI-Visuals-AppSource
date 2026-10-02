import { connection } from '../connection';
import query from './leaderboard-standings.dax?raw';

/**
 * One row per visual the leaderboard has ever tracked: its latest standing and
 * how much its popularity and rating count moved over 7, 30 and 90 days.
 * Rendered by custom components, so there is no chart spec.
 */
export function leaderboardStandings() {
  return { connection, query };
}
