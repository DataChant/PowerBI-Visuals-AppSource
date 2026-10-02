import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Result = {
  data: unknown;
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => Promise<void>;
};

const refetch = vi.fn(async () => {});
let respond: (query: string) => Result = () => ({
  data: undefined,
  isLoading: true,
  error: undefined,
  refetch,
});

// No connector exists under test, so every query answers from `respond`.
vi.mock('@/hooks/use-semantic-model-query', () => ({
  useSemanticModelQuery: ({ query }: { query: string }) => respond(query),
}));

import App from '@/App';

const STANDING_COLUMNS = [
  'Leaderboard[Visual GUID]',
  '[Name]',
  '[Publisher]',
  '[Version]',
  '[Popularity]',
  '[Ratings]',
  '[Average Rating]',
  '[Certified]',
  '[Removed]',
  '[Catalog ID]',
  '[Thumbnail]',
  '[Release Date]',
  '[Last Change]',
  '[First Seen]',
  '[As Of]',
  '[Popularity Change 7d]',
  '[Popularity Change 30d]',
  '[Popularity Change 90d]',
  '[Ratings Change 7d]',
  '[Ratings Change 30d]',
  '[Ratings Change 90d]',
].map((name) => ({ name }));

function standing(guid: string, name: string, popularity: number) {
  return [
    guid, name, 'Contoso', '1.0', popularity, 10, 4.5, 'Certified', false,
    `contoso.${guid}`, '', '2020-01-01T00:00:00.000', '2026-09-01T00:00:00.000',
    '2026-01-01T00:00:00.000', '2026-09-30T00:00:00.000', 0.01, 0.02, 0.03, 0, 1, 2,
  ];
}

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
    respond = () => ({ data: undefined, isLoading: true, error: undefined, refetch });
  });

  it('shows a loading state while the queries run', () => {
    render(<App />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('ranks the leaderboard once the standings arrive', () => {
    respond = (query) =>
      query.includes('Leaderboard')
        ? {
            data: {
              status: 'success',
              table: {
                columns: STANDING_COLUMNS,
                rows: [standing('a', 'Second Visual', 0.8), standing('b', 'Top Visual', 0.99)],
              },
            },
            isLoading: false,
            error: undefined,
            refetch,
          }
        : { data: undefined, isLoading: true, error: undefined, refetch };
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Hall of Fame' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^First place: Top Visual/ })).toBeInTheDocument();
  });

  it('offers a retry when Power BI rejects the query', () => {
    respond = () => ({
      data: { status: 'error', error: { category: 'query', message: 'Bad DAX' } },
      isLoading: false,
      error: undefined,
      refetch,
    });
    render(<App />);
    expect(screen.getByRole('alert')).toHaveTextContent('Bad DAX');
    screen.getByRole('button', { name: 'Try again' }).click();
    expect(refetch).toHaveBeenCalled();
  });
});
