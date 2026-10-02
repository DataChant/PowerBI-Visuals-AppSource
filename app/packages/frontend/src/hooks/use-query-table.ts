import { useSemanticModelQuery } from '@/hooks/use-semantic-model-query';
import type { QueryTableLike } from '@/lib/to-data-table';

export type QueryTableState =
  | { status: 'loading' }
  | { status: 'error'; message: string; retry: () => void }
  | { status: 'success'; table: QueryTableLike };

/**
 * Folds the hook's two disjoint error channels into one state, so every
 * consumer handles loading, a thrown failure and a Power BI-reported failure
 * the same way. An empty query stays loading, which is how a closed drawer
 * keeps its queries idle.
 */
export function useQueryTable(options: {
  connection: string;
  query: string;
}): QueryTableState {
  const { data, isLoading, error, refetch } = useSemanticModelQuery(options);
  const retry = () => void refetch();
  if (error) return { status: 'error', message: error.message, retry };
  if (data?.status === 'error')
    return { status: 'error', message: data.error.message, retry };
  if (!isLoading && data?.status === 'success')
    return { status: 'success', table: data.table };
  return { status: 'loading' };
}
