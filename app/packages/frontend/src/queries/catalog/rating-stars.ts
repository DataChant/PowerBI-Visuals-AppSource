import { connection } from '../connection';
import query from './rating-stars.dax?raw';

/** How many raters gave each visual one to five stars. Aggregated in the browser. */
export function ratingStars() {
  return { connection, query };
}
