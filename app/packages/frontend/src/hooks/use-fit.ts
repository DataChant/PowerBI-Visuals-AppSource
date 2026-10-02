import { useSyncExternalStore } from 'react';

/** The same window the `fit` style variant matches: wide and tall enough for a page to fit. */
const QUERY = '(min-width: 1024px) and (min-height: 696px)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia?.(QUERY);
  media?.addEventListener('change', onChange);
  return () => media?.removeEventListener('change', onChange);
}

/** True when a page fits the window, so it shows one view at a time instead of stacking them. */
export function useFit(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia?.(QUERY).matches ?? false,
    () => false
  );
}
