//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import type { SemanticModelQueryResult } from '@microsoft/rayfin-connector-fabric-semanticmodel';
import { useCallback, useEffect, useRef, useState } from 'react';

import { querySnapshot } from '@/lib/snapshot';

interface UseSemanticModelQueryOptions {
  /** Name of the data set. Kept so callers read as before; only empty matters. */
  connection: string;
  /** DAX query string. */
  query: string;
}

interface UseSemanticModelQueryResult {
  data: SemanticModelQueryResult | undefined;
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => Promise<void>;
}

interface QueryState {
  connection: string;
  query: string;
  data: SemanticModelQueryResult | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

/**
 * React hook that answers one of the app's queries from the published data
 * files under `public/snapshot/`, which `scripts/snapshot.mjs` builds from the
 * public AppSource catalog and the public leaderboard history.
 *
 * Nothing here signs in or calls Fabric, so the same build runs as a Fabric App
 * and on any static host. The query text is the lookup key: `lib/snapshot.ts`
 * recognises it and returns the saved table in the shape a semantic model
 * query would have returned, which is why the charts and pages are unchanged.
 *
 * `error` is set when a file could not be loaded or the query is not one the
 * data files hold. An empty `connection` or `query` puts the hook idle and
 * clears any previous result.
 */
export function useSemanticModelQuery(
  options: UseSemanticModelQueryOptions
): UseSemanticModelQueryResult {
  const { connection, query } = options;
  const canExecute = Boolean(connection && query);
  const [state, setState] = useState<QueryState>(() => ({
    connection,
    query,
    data: undefined,
    isLoading: canExecute,
    error: undefined,
  }));

  // Input changes reset request UI during render, not from the fetch effect.
  if (state.connection !== connection || state.query !== query) {
    setState({
      connection,
      query,
      data: canExecute ? state.data : undefined,
      isLoading: canExecute,
      error: undefined,
    });
  }

  // Monotonic request id: only the newest run may publish, so a slow first query
  // cannot land after a fast second one and overwrite fresher rows.
  const latestRequest = useRef(0);

  const execute = useCallback(async () => {
    const requestId = ++latestRequest.current;
    if (!canExecute) return;

    let result: SemanticModelQueryResult | undefined;
    let thrown: Error | undefined;
    try {
      result = await querySnapshot(query);
    } catch (err) {
      thrown =
        err instanceof Error ? err : new Error(String(err), { cause: err });
    }

    // Superseded by a newer run.
    if (requestId !== latestRequest.current) return;

    setState((current) => {
      if (current.connection !== connection || current.query !== query) {
        return current;
      }
      return {
        connection,
        query,
        data: thrown ? undefined : (result ?? current.data),
        isLoading: false,
        error: thrown,
      };
    });
  }, [connection, query, canExecute]);

  const refetch = useCallback(async () => {
    setState((current) => ({
      ...current,
      data: canExecute ? current.data : undefined,
      isLoading: canExecute,
      error: undefined,
    }));
    await execute();
  }, [execute, canExecute]);

  useEffect(() => {
    void execute();
    return () => {
      // Invalidate completions on cleanup.
      latestRequest.current += 1;
    };
  }, [execute]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refetch,
  };
}
