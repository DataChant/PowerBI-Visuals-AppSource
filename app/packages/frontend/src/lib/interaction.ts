import type { InteractionEvent } from '@microsoft/fabric-visuals-core';

/**
 * Reads the first value of a set predicate on `field` from a chart click.
 * Returns null for a cleared selection, so the caller can reset its filter.
 */
export function selectedValue(
  events: InteractionEvent[],
  field: string
): unknown | null | undefined {
  for (const event of events) {
    if (event.action === 'clear') return null;
    for (const selection of event.selections) {
      for (const predicate of selection.predicates) {
        if (predicate.type === 'set' && predicate.name === field)
          return predicate.values[0];
      }
    }
  }
  return undefined;
}
