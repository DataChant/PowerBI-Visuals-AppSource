import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Root } from './Root';

// Under test every query stays loading.
vi.mock('@/hooks/use-semantic-model-query', () => ({
  useSemanticModelQuery: () => ({
    data: undefined,
    isLoading: true,
    error: undefined,
    refetch: async () => {},
  }),
}));

describe('the app is public', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens straight away, with no sign-in and no wait for Fabric', () => {
    render(<Root />);
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Sign in with Microsoft' })
    ).toBeNull();
    expect(screen.queryByText('Connecting to Fabric…')).toBeNull();
  });
});
