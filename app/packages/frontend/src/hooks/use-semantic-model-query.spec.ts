//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useSemanticModelQuery } from '@/hooks/use-semantic-model-query';

const executeQuery = vi.fn();

vi.mock('@/lib/snapshot', () => ({
  querySnapshot: (query: string) => executeQuery(query),
}));

/** A saved table, as the data files answer a query. */
const wireSuccess = (total: number) => ({
  status: 'success',
  table: {
    columns: [{ name: 'Sales[Total]', dataType: 'unknown' }],
    rows: [[total]],
  },
});

describe('useSemanticModelQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const render = (connection = 'model', query = 'EVALUATE ROW()') =>
    renderHook(() => useSemanticModelQuery({ connection, query }));

  it('starts in the loading state', () => {
    executeQuery.mockReturnValue(new Promise(() => {}));

    const { result } = render();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('publishes the saved table', async () => {
    executeQuery.mockResolvedValue(wireSuccess(42));

    const { result } = render();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(wireSuccess(42));
    expect(result.current.error).toBeUndefined();
    expect(executeQuery).toHaveBeenCalledWith('EVALUATE ROW()');
  });

  it('surfaces the thrown error itself, not a copy of its message', async () => {
    const thrown = Object.assign(new Error('401 Unauthorized'), {
      status: 401,
    });
    executeQuery.mockRejectedValue(thrown);

    const { result } = render();

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.error).toBe(thrown);
    expect((result.current.error as { status?: number }).status).toBe(401);
  });

  it('clears a stale result when a later query throws', async () => {
    // Prevents rows staying on screen under an error banner. Asserting this on
    // the first query would pass either way - there has to be a result to lose.
    executeQuery.mockResolvedValueOnce(wireSuccess(42));
    const { result, rerender } = renderHook(
      ({ query }) => useSemanticModelQuery({ connection: 'model', query }),
      { initialProps: { query: 'EVALUATE ROW()' } }
    );
    await waitFor(() => expect(result.current.data).toBeDefined());

    executeQuery.mockRejectedValueOnce(new Error('401 Unauthorized'));
    rerender({ query: 'EVALUATE ROW(2)' });

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.data).toBeUndefined();
  });

  it('does not let a slow earlier query overwrite a newer result', async () => {
    let resolveSlow: (value: unknown) => void = () => {};
    executeQuery.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveSlow = resolve;
      })
    );

    const { result, rerender } = renderHook(
      ({ query }) => useSemanticModelQuery({ connection: 'model', query }),
      { initialProps: { query: 'EVALUATE ROW()' } }
    );

    executeQuery.mockResolvedValueOnce(wireSuccess(2));
    rerender({ query: 'EVALUATE ROW(2)' });
    await waitFor(() =>
      expect(result.current.data?.status === 'success').toBe(true)
    );

    // The first query lands last and must not publish. A microtask is not
    // enough to prove that: a stale publish needs several turns plus a React
    // flush to become visible, so asserting too early passes either way.
    await act(async () => {
      resolveSlow(wireSuccess(999));
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    expect(
      result.current.data?.status === 'success' &&
        result.current.data.table.rows
    ).toEqual([[2]]);
  });

  it('clears a previous result when it goes idle', async () => {
    executeQuery.mockResolvedValue(wireSuccess(1));

    const { result, rerender } = renderHook(
      ({ query }) => useSemanticModelQuery({ connection: 'model', query }),
      { initialProps: { query: 'EVALUATE ROW()' } }
    );
    await waitFor(() => expect(result.current.data).toBeDefined());

    // Leaving the rows in place renders data for a query that no longer
    // applies.
    rerender({ query: '' });

    await waitFor(() => expect(result.current.data).toBeUndefined());
    expect(result.current.isLoading).toBe(false);
  });

  it('keeps the previous result while an explicit refetch is loading', async () => {
    executeQuery.mockResolvedValueOnce(wireSuccess(1));
    const { result } = render();
    await waitFor(() => expect(result.current.data).toBeDefined());

    let resolveNext!: (value: unknown) => void;
    executeQuery.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveNext = resolve;
      })
    );
    let pending: Promise<void>;
    act(() => {
      pending = result.current.refetch();
    });
    expect(result.current.isLoading).toBe(true);
    expect(
      result.current.data?.status === 'success' &&
        result.current.data.table.rows
    ).toEqual([[1]]);

    await act(async () => {
      resolveNext(wireSuccess(2));
      await pending;
    });
    expect(result.current.isLoading).toBe(false);
    expect(
      result.current.data?.status === 'success' &&
        result.current.data.table.rows
    ).toEqual([[2]]);
  });

  it('does not publish an in-flight result after the query goes idle', async () => {
    let resolveQuery!: (value: unknown) => void;
    executeQuery.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveQuery = resolve;
      })
    );
    const { result, rerender } = renderHook(
      ({ query }) => useSemanticModelQuery({ connection: 'model', query }),
      { initialProps: { query: 'EVALUATE ROW()' } }
    );
    rerender({ query: '' });
    await act(async () => {
      resolveQuery(wireSuccess(9));
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('starts loading again when revisiting a previously completed query', async () => {
    executeQuery.mockResolvedValueOnce(wireSuccess(1));
    const { result, rerender } = renderHook(
      ({ query }) => useSemanticModelQuery({ connection: 'model', query }),
      { initialProps: { query: 'EVALUATE ROW(1)' } }
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    executeQuery.mockReturnValueOnce(new Promise(() => {}));
    rerender({ query: 'EVALUATE ROW(2)' });
    expect(result.current.isLoading).toBe(true);

    let resolveRevisited!: (value: unknown) => void;
    executeQuery.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRevisited = resolve;
      })
    );
    rerender({ query: 'EVALUATE ROW(1)' });
    expect(result.current.isLoading).toBe(true);
    await act(async () => {
      resolveRevisited(wireSuccess(3));
    });
    expect(result.current.isLoading).toBe(false);
    expect(
      result.current.data?.status === 'success' &&
        result.current.data.table.rows
    ).toEqual([[3]]);
  });
});
