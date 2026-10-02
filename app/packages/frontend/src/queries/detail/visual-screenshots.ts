import { assertSafeKey, connection } from '../connection';
import baseQuery from './visual-screenshots.dax?raw';

/** The AppSource screenshots of one visual, in listing order. */
export function visualScreenshots(id: string) {
  return {
    connection,
    query: baseQuery.replaceAll('__ID__', assertSafeKey(id, 'AppSource ID')),
  };
}
