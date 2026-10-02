import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Welcome } from './Welcome';
import { AREAS, parseActivity, type SourceActivity } from './Welcome.activity';

function activity(): SourceActivity {
  const at = new Date().toISOString();
  return {
    structure: AREAS.map(({ family }) => ({
      family,
      count: family === 'logic' ? 1 : 0,
      lastChangedAt: family === 'logic' ? at : null,
    })),
    changes: [{ id: 'change-example', family: 'logic', kind: 'update', at }],
    generatedAt: at,
  };
}

describe('shared welcome and live activity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify(activity()), {
            headers: { 'content-type': 'application/json' },
          })
      )
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('renders the complete blueprint without a companion', () => {
    render(<Welcome activity={null} />);
    expect(
      screen.getByRole('heading', { name: 'Your app is taking shape' })
    ).toBeVisible();
    for (const area of AREAS)
      expect(screen.getByRole('heading', { name: area.label })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: /your app builder/ })
    ).toBeNull();
  });

  it('keeps live activity and changed tiles without a companion', () => {
    const { container } = render(<Welcome activity={activity()} />);
    expect(screen.getByText('Live activity')).toBeVisible();
    expect(screen.getByText('Updated the calculations')).toBeVisible();
    expect(container.querySelector('[data-family="logic"]')).toHaveAttribute(
      'data-active',
      'true'
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('polls the dev activity endpoint without an optional feature', async () => {
    render(<Welcome />);
    await act(async () => vi.advanceTimersByTimeAsync(0));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Live activity')).toBeVisible();
    await act(async () => vi.advanceTimersByTimeAsync(2500));
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('does not include a production polling path', async () => {
    vi.stubEnv('DEV', false);
    render(<Welcome />);
    await act(async () => vi.advanceTimersByTimeAsync(5000));
    expect(fetch).not.toHaveBeenCalled();
    expect(
      screen.getByText('A typical journey, not a live update.')
    ).toBeVisible();
  });

  it('keeps a failed connection explicit instead of reporting loading', () => {
    render(
      <Welcome activity={null} connecting={{ error: 'Sign-in required.' }} />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Sign-in required.');
    expect(
      screen.queryByText("We're getting connected to your data.")
    ).toBeNull();
  });

  it('rejects malformed activity snapshots', () => {
    expect(parseActivity(activity())).not.toBeNull();
    expect(parseActivity({ ...activity(), structure: [] })).toBeNull();
    expect(parseActivity({ ...activity(), generatedAt: 'invalid' })).toBeNull();
  });
});
