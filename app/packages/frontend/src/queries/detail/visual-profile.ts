import { assertSafeKey, connection } from '../connection';
import baseQuery from './visual-profile.dax?raw';

/** The long description, publisher links and preview video of one visual, by AppSource ID. */
export function visualProfile(id: string) {
  return {
    connection,
    query: baseQuery.replaceAll('__ID__', assertSafeKey(id, 'AppSource ID')),
  };
}
